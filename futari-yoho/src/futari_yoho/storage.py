"""JSON storage with atomic write."""

from __future__ import annotations

import json
import os
import tempfile
from pathlib import Path

from .models import State


def default_data_path() -> Path:
    home = Path.home()
    return home / ".futari-yoho" / "data.json"


def load(path: Path | None = None) -> State:
    p = path or default_data_path()
    if not p.exists():
        return State()
    try:
        raw = json.loads(p.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return State()
    return State.from_dict(raw)


def save(state: State, path: Path | None = None) -> Path:
    p = path or default_data_path()
    p.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(state.to_dict(), ensure_ascii=False, indent=2, sort_keys=True)
    # Atomic write via temp + rename
    fd, tmp = tempfile.mkstemp(
        prefix=".futari-yoho.", suffix=".tmp", dir=str(p.parent)
    )
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.write(payload)
        os.replace(tmp, p)
    except Exception:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise
    return p
