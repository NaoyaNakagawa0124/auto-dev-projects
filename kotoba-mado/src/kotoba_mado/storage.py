"""Atomic JSON I/O for kotoba-mado."""

from __future__ import annotations

import json
import os
import tempfile
from pathlib import Path

from .models import Log


def default_data_path() -> Path:
    return Path.home() / ".kotoba-mado" / "log.json"


def load(path: Path | None = None) -> Log:
    p = path or default_data_path()
    if not p.exists():
        return Log()
    try:
        raw = json.loads(p.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return Log()
    return Log.from_dict(raw)


def save(log: Log, path: Path | None = None) -> Path:
    p = path or default_data_path()
    p.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(log.to_dict(), ensure_ascii=False, indent=2)
    fd, tmp = tempfile.mkstemp(prefix=".kotoba-mado.", suffix=".tmp", dir=str(p.parent))
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
