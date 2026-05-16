"""Atomic JSON I/O for the deck."""

from __future__ import annotations

import json
import os
import tempfile
from pathlib import Path

from .models import Deck


def default_data_path() -> Path:
    return Path.home() / ".meme-fuda" / "deck.json"


def load(path: Path | None = None) -> Deck:
    p = path or default_data_path()
    if not p.exists():
        return Deck()
    try:
        raw = json.loads(p.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return Deck()
    return Deck.from_dict(raw)


def save(deck: Deck, path: Path | None = None) -> Path:
    p = path or default_data_path()
    p.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(deck.to_dict(), ensure_ascii=False, indent=2)
    fd, tmp = tempfile.mkstemp(prefix=".meme-fuda.", suffix=".tmp", dir=str(p.parent))
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
