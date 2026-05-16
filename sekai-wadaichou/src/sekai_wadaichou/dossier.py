"""Dossier — the user's collected city talking-points, JSON-backed."""

from __future__ import annotations

import json
import os
import tempfile
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Iterable


def default_path() -> Path:
    return Path.home() / ".sekai-wadaichou" / "dossier.json"


@dataclass
class Entry:
    city_id: str
    collected_at: str
    note: str = ""

    def to_dict(self) -> dict:
        return {"city_id": self.city_id, "collected_at": self.collected_at, "note": self.note}

    @classmethod
    def from_dict(cls, d: dict) -> "Entry":
        return cls(city_id=d["city_id"], collected_at=d["collected_at"], note=d.get("note", ""))


@dataclass
class Dossier:
    path: Path
    entries: list[Entry] = field(default_factory=list)

    @classmethod
    def load(cls, path: Path | None = None) -> "Dossier":
        p = path or default_path()
        if not p.exists():
            return cls(path=p, entries=[])
        try:
            data = json.loads(p.read_text(encoding="utf-8"))
            entries = [Entry.from_dict(e) for e in data.get("entries", [])]
            return cls(path=p, entries=entries)
        except (OSError, json.JSONDecodeError, KeyError):
            return cls(path=p, entries=[])

    def save(self) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        data = {"version": 1, "entries": [e.to_dict() for e in self.entries]}
        # Atomic write: temp file in same dir + rename.
        with tempfile.NamedTemporaryFile(
            "w", encoding="utf-8", delete=False, dir=str(self.path.parent), prefix=".dossier-", suffix=".tmp"
        ) as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            tmpname = f.name
        os.replace(tmpname, self.path)

    def is_collected(self, city_id: str) -> bool:
        return any(e.city_id == city_id for e in self.entries)

    def add(self, city_id: str, note: str = "") -> bool:
        """Add an entry; returns False if already present."""
        if self.is_collected(city_id):
            return False
        self.entries.append(
            Entry(city_id=city_id, collected_at=datetime.now().isoformat(timespec="seconds"), note=note)
        )
        return True

    def remove(self, city_id: str) -> bool:
        before = len(self.entries)
        self.entries = [e for e in self.entries if e.city_id != city_id]
        return len(self.entries) != before

    def list_collected(self) -> list[Entry]:
        return list(self.entries)

    def __iter__(self) -> Iterable[Entry]:
        return iter(self.entries)
