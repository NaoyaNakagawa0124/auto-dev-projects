import wave
from pathlib import Path

import pytest

from denshou_bako.audio import MockBackend, detect_backend, make_backend


def test_mock_backend_captures_speech():
    b = MockBackend()
    b.speak("hello")
    b.speak("world")
    assert b.spoken == ["hello", "world"]


def test_mock_wait_returns_queued_press():
    b = MockBackend()
    b.queue_press("press")
    b.queue_press("long")
    assert b.wait_for_press() == "press"
    assert b.wait_for_press() == "long"
    assert b.wait_for_press() == "timeout"


def test_mock_record_writes_a_silent_wav(tmp_path: Path):
    b = MockBackend()
    out = tmp_path / "x.wav"
    d = b.record(out, max_s=10.0)
    assert out.exists()
    assert d > 0
    with wave.open(str(out), "rb") as w:
        assert w.getnchannels() == 1
        assert w.getframerate() == 16000


def test_mock_set_led_tracks_state():
    b = MockBackend()
    b.set_led("red", True)
    b.set_led("yellow", False)
    assert b.led_states["red"] is True
    assert b.led_states["yellow"] is False


def test_detect_backend_returns_valid_name():
    n = detect_backend()
    assert n in ("mock", "mac", "pi")


def test_make_backend_supports_mock():
    b = make_backend("mock")
    assert isinstance(b, MockBackend)


def test_make_backend_rejects_unknown():
    with pytest.raises(ValueError):
        make_backend("zzz")
