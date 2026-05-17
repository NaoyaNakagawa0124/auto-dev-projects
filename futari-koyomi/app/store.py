"""Simple JSON file store for promise + timeline."""
from __future__ import annotations

import datetime as _dt
import json
import os
import threading
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import List, Optional


_LOCK = threading.Lock()


@dataclass
class Promise:
    date: str                       # YYYY-MM-DD
    holiday_id: str                 # MM-DD
    ritual_index: int               # 0-2
    ritual_text: str
    status: str = "set"             # set | done
    note: Optional[str] = None
    set_at: str = ""                # ISO datetime
    done_at: Optional[str] = None


@dataclass
class TimelineEntry:
    date: str
    holiday_name: str
    ritual_text: str
    status: str            # done | skipped
    note: Optional[str] = None


@dataclass
class State:
    promise: Optional[Promise] = None
    timeline: List[TimelineEntry] = field(default_factory=list)
    settings: dict = field(default_factory=dict)


def default_path() -> Path:
    env = os.environ.get("FUTARI_DATA")
    if env:
        return Path(env)
    return Path("data/state.json")


class Store:
    def __init__(self, path: Optional[Path] = None, clock=_dt.datetime.now):
        self.path = path or default_path()
        self._clock = clock

    def load(self) -> State:
        if not self.path.exists():
            return State()
        try:
            raw = json.loads(self.path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            return State()
        p = raw.get("promise")
        promise = Promise(**p) if p else None
        timeline = [TimelineEntry(**t) for t in raw.get("timeline", [])]
        settings = raw.get("settings", {}) or {}
        return State(promise=promise, timeline=timeline, settings=settings)

    def save(self, state: State) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        payload = {
            "promise": asdict(state.promise) if state.promise else None,
            "timeline": [asdict(t) for t in state.timeline],
            "settings": state.settings,
        }
        tmp = self.path.with_suffix(self.path.suffix + ".tmp")
        tmp.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        tmp.replace(self.path)

    # ── High-level operations (thread-locked) ─────────────────────────────

    def today(self) -> _dt.date:
        return self._clock().date()

    def set_promise(
        self,
        holiday_id: str,
        ritual_index: int,
        ritual_text: str,
    ) -> Promise:
        with _LOCK:
            state = self.load()
            self._roll_over(state)
            today = self.today().isoformat()
            now_iso = self._clock().isoformat(timespec="seconds")
            state.promise = Promise(
                date=today,
                holiday_id=holiday_id,
                ritual_index=ritual_index,
                ritual_text=ritual_text,
                status="set",
                note=None,
                set_at=now_iso,
                done_at=None,
            )
            self.save(state)
            return state.promise

    def mark_done(self, note: Optional[str] = None) -> Optional[Promise]:
        with _LOCK:
            state = self.load()
            self._roll_over(state)
            if not state.promise or state.promise.status == "done":
                return state.promise
            now_iso = self._clock().isoformat(timespec="seconds")
            state.promise.status = "done"
            state.promise.note = (note or "").strip() or None
            state.promise.done_at = now_iso
            self.save(state)
            return state.promise

    def clear_promise(self) -> None:
        with _LOCK:
            state = self.load()
            state.promise = None
            self.save(state)

    def get_state(self) -> State:
        with _LOCK:
            state = self.load()
            self._roll_over(state)
            self.save(state)
            return state

    def recent_timeline(self, n: int = 30) -> List[TimelineEntry]:
        state = self.get_state()
        return state.timeline[-n:][::-1]

    # ── Day rollover ──────────────────────────────────────────────────────

    def _roll_over(self, state: State) -> None:
        today = self.today().isoformat()
        if state.promise and state.promise.date != today:
            # Move yesterday's promise into the timeline
            holiday_name_default = "—"
            entry = TimelineEntry(
                date=state.promise.date,
                holiday_name=holiday_name_default,
                ritual_text=state.promise.ritual_text,
                status="done" if state.promise.status == "done" else "skipped",
                note=state.promise.note,
            )
            # Avoid duplicates if rollover already happened
            if not state.timeline or state.timeline[-1].date != entry.date:
                state.timeline.append(entry)
            state.promise = None
