"""Recording session orchestration.

Glue between Backend and the question bank. One call to `run_session()` per
nightly visit.
"""

from __future__ import annotations

import json
from dataclasses import dataclass, asdict
from datetime import date
from pathlib import Path
from typing import Optional

from .audio import Backend
from .questions import Question, question_for


@dataclass
class SessionResult:
    date_iso: str
    question_id: int
    category: str
    question_text: str
    duration_s: float
    skipped: bool
    audio_path: Optional[str]   # None if skipped
    meta_path: str

    def to_dict(self) -> dict:
        d = asdict(self)
        # Keep keys stable
        return d


def session_paths(out_dir: Path, day: date) -> tuple[Path, Path]:
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    stem = day.isoformat()
    return out / f"{stem}.wav", out / f"{stem}.json"


def run_session(
    backend: Backend,
    out_dir: Path,
    *,
    day: date | None = None,
    max_record_s: float = 120.0,
    press_timeout_s: float | None = None,
) -> SessionResult:
    """One pass of: announce question → wait press → record → save metadata.

    Returns a `SessionResult`. Long-press (>=2s) at any wait point cancels
    and writes a "skipped" metadata file (no audio).
    """
    day = day or date.today()
    q = question_for(day)
    audio_path, meta_path = session_paths(out_dir, day)

    backend.set_led("yellow", True)
    # Speak the question
    backend.speak(f"今日の問いです。{q.text}")
    backend.speak("はじめる時はボタンをもう一度押してください。")

    press = backend.wait_for_press(timeout_s=press_timeout_s)
    if press in ("long", "timeout"):
        # Skip
        backend.set_led("yellow", False)
        result = SessionResult(
            date_iso=day.isoformat(),
            question_id=q.id,
            category=q.category,
            question_text=q.text,
            duration_s=0.0,
            skipped=True,
            audio_path=None,
            meta_path=str(meta_path),
        )
        _write_meta(meta_path, result)
        return result

    backend.set_led("yellow", False)
    backend.set_led("red", True)
    duration = backend.record(audio_path, max_s=max_record_s)
    backend.set_led("red", False)
    backend.speak("ありがとうございました。")

    result = SessionResult(
        date_iso=day.isoformat(),
        question_id=q.id,
        category=q.category,
        question_text=q.text,
        duration_s=duration,
        skipped=False,
        audio_path=str(audio_path),
        meta_path=str(meta_path),
    )
    _write_meta(meta_path, result)
    return result


def _write_meta(path: Path, result: SessionResult) -> None:
    Path(path).write_text(
        json.dumps(result.to_dict(), ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def read_meta(path: Path) -> SessionResult:
    raw = json.loads(Path(path).read_text(encoding="utf-8"))
    return SessionResult(
        date_iso=raw["date_iso"],
        question_id=int(raw["question_id"]),
        category=raw["category"],
        question_text=raw["question_text"],
        duration_s=float(raw.get("duration_s", 0.0)),
        skipped=bool(raw.get("skipped", False)),
        audio_path=raw.get("audio_path"),
        meta_path=str(path),
    )
