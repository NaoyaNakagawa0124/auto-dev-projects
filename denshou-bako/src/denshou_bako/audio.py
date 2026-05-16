"""Audio session abstraction.

Three backends share a single interface:

    class Backend:
        def speak(self, text: str) -> None
        def wait_for_press(self, *, timeout_s: float | None) -> str    # "press" | "long" | "timeout"
        def record(self, out_path: Path, max_s: float) -> float        # seconds actually recorded
        def set_led(self, name: str, on: bool) -> None                 # idempotent
        def close(self) -> None

Backends:
    MockBackend  — no hardware, used in tests and dev (keyboard "press" simulation).
    MacBackend   — `say` + `sox` for testing on a Mac.
    PiBackend    — `espeak-ng` + `arecord` + GPIO buttons + GPIO LEDs.

The CLI selects a backend at runtime via --backend or auto-detects:
    - if RPi.GPIO importable → Pi
    - elif platform.system() == "Darwin" → Mac
    - else → Mock
"""

from __future__ import annotations

import os
import platform
import subprocess
import time
import wave
from abc import ABC, abstractmethod
from pathlib import Path


class Backend(ABC):
    @abstractmethod
    def speak(self, text: str) -> None: ...
    @abstractmethod
    def wait_for_press(self, *, timeout_s: float | None = None) -> str: ...
    @abstractmethod
    def record(self, out_path: Path, max_s: float = 120.0) -> float: ...

    def set_led(self, name: str, on: bool) -> None:
        # Default: no-op (Mock / Mac have no LEDs)
        return

    def close(self) -> None:
        return


# ---------------------------------------------------------------------------
# MockBackend
# ---------------------------------------------------------------------------


class MockBackend(Backend):
    """No-hardware backend.

    Records a small silent WAV so the rest of the pipeline (file io,
    archiver, book renderer) can be exercised.

    Captures every speak() call into `.spoken` for test assertions, and
    accepts pre-queued press signals via `.queue_press()`.
    """

    def __init__(self):
        self.spoken: list[str] = []
        self._press_queue: list[str] = []
        self.led_states: dict[str, bool] = {}
        self._recorded: list[tuple[str, float]] = []  # (path, seconds)

    def speak(self, text: str) -> None:
        self.spoken.append(text)

    def queue_press(self, kind: str = "press") -> None:
        self._press_queue.append(kind)

    def wait_for_press(self, *, timeout_s: float | None = None) -> str:
        if self._press_queue:
            return self._press_queue.pop(0)
        return "timeout"

    def record(self, out_path: Path, max_s: float = 120.0) -> float:
        # Write a 0.1-second silent WAV — enough for archiver to inspect
        out_path = Path(out_path)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        duration = min(max_s, 0.1)
        with wave.open(str(out_path), "wb") as w:
            w.setnchannels(1)
            w.setsampwidth(2)  # 16-bit
            w.setframerate(16000)
            n_frames = int(duration * 16000)
            w.writeframes(b"\x00\x00" * n_frames)
        self._recorded.append((str(out_path), duration))
        return duration

    def set_led(self, name: str, on: bool) -> None:
        self.led_states[name] = on


# ---------------------------------------------------------------------------
# MacBackend (`say` + `sox`)
# ---------------------------------------------------------------------------


class MacBackend(Backend):
    """Used for dev on macOS — `say` for TTS, `sox` for recording.

    Press detection is keyboard-based (Enter to start/stop), so this backend
    is for one-developer demos, not the real deployment.
    """

    def __init__(self, voice: str = "Kyoko"):
        self.voice = voice

    def speak(self, text: str) -> None:
        try:
            subprocess.run(["say", "-v", self.voice, text], check=False)
        except FileNotFoundError:
            # macOS missing `say` (unlikely) — silent fall through
            pass

    def wait_for_press(self, *, timeout_s: float | None = None) -> str:
        # Block on stdin; "Enter" = press, "q\n" = long press = skip
        try:
            line = input()
        except (EOFError, KeyboardInterrupt):
            return "long"
        return "long" if line.strip().lower() in ("q", "quit", "skip") else "press"

    def record(self, out_path: Path, max_s: float = 120.0) -> float:
        out_path = Path(out_path)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        # sox: record from default input, 16kHz mono WAV, until silence or max_s
        start = time.time()
        try:
            subprocess.run(
                ["sox", "-d", "-r", "16000", "-c", "1", str(out_path),
                 "trim", "0", str(int(max_s))],
                check=False,
                timeout=max_s + 5,
            )
        except FileNotFoundError:
            # sox not installed — fall back to a 0.1s silent wav so the pipeline
            # still completes
            with wave.open(str(out_path), "wb") as w:
                w.setnchannels(1); w.setsampwidth(2); w.setframerate(16000)
                w.writeframes(b"\x00\x00" * 1600)
            return 0.1
        return min(max_s, time.time() - start)


# ---------------------------------------------------------------------------
# PiBackend (espeak-ng + arecord + GPIO)
# ---------------------------------------------------------------------------


class PiBackend(Backend):
    """Real Raspberry Pi backend.

    Uses subprocess for TTS (espeak-ng -v ja) and recording (arecord). GPIO
    is lazy-imported so test environments without RPi.GPIO can still import
    this module.

    GPIO mapping (BCM):
        BTN  : 17  (main button, pull-up to 3.3V via internal resistor)
        LED_RED  : 23 (recording indicator)
        LED_YELLOW: 24 (idle / waiting)
    """

    def __init__(self, *, btn_pin: int = 17, led_red: int = 23, led_yellow: int = 24,
                 audio_device: str = "default", tts_voice: str = "ja"):
        try:
            import RPi.GPIO as GPIO  # type: ignore
        except ImportError as e:
            raise RuntimeError(
                "PiBackend requires RPi.GPIO. Install with `pip install -e .[pi]`"
            ) from e
        self.GPIO = GPIO
        self.btn_pin = btn_pin
        self.led_red = led_red
        self.led_yellow = led_yellow
        self.audio_device = audio_device
        self.tts_voice = tts_voice

        GPIO.setmode(GPIO.BCM)
        GPIO.setup(btn_pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)
        GPIO.setup(led_red, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(led_yellow, GPIO.OUT, initial=GPIO.HIGH)

    def speak(self, text: str) -> None:
        subprocess.run(
            ["espeak-ng", "-v", self.tts_voice, "-s", "150", text],
            check=False,
        )

    def wait_for_press(self, *, timeout_s: float | None = None) -> str:
        GPIO = self.GPIO
        end = (time.time() + timeout_s) if timeout_s else None
        pressed_at: float | None = None
        while True:
            if end and time.time() > end:
                return "timeout"
            state = GPIO.input(self.btn_pin)
            if state == GPIO.LOW:
                if pressed_at is None:
                    pressed_at = time.time()
                elif time.time() - pressed_at >= 2.0:
                    # held > 2s while still pressed
                    while GPIO.input(self.btn_pin) == GPIO.LOW:
                        time.sleep(0.02)
                    return "long"
            else:
                if pressed_at is not None:
                    # released
                    elapsed = time.time() - pressed_at
                    return "long" if elapsed >= 2.0 else "press"
            time.sleep(0.02)

    def record(self, out_path: Path, max_s: float = 120.0) -> float:
        out_path = Path(out_path)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        start = time.time()
        try:
            subprocess.run(
                ["arecord", "-D", self.audio_device, "-f", "S16_LE",
                 "-r", "16000", "-c", "1", "-d", str(int(max_s)),
                 str(out_path)],
                check=False,
                timeout=max_s + 5,
            )
        except FileNotFoundError:
            return 0.0
        return min(max_s, time.time() - start)

    def set_led(self, name: str, on: bool) -> None:
        GPIO = self.GPIO
        pin = {"red": self.led_red, "yellow": self.led_yellow}.get(name)
        if pin is None:
            return
        GPIO.output(pin, GPIO.HIGH if on else GPIO.LOW)

    def close(self) -> None:
        try:
            self.GPIO.cleanup()
        except Exception:
            pass


# ---------------------------------------------------------------------------
# Auto-detect
# ---------------------------------------------------------------------------


def detect_backend() -> str:
    """Return the recommended backend name based on the environment."""
    try:
        import RPi.GPIO  # type: ignore  # noqa: F401
        return "pi"
    except ImportError:
        pass
    if platform.system() == "Darwin":
        return "mac"
    return "mock"


def make_backend(name: str) -> Backend:
    n = (name or "").lower()
    if n == "mock":
        return MockBackend()
    if n == "mac":
        return MacBackend()
    if n == "pi":
        return PiBackend()
    raise ValueError(f"unknown backend: {name!r} (use mock/mac/pi)")
