"""Persistent state — meal log + statistics."""

from __future__ import annotations

import json
import os
from dataclasses import dataclass, field, asdict
from datetime import date
from pathlib import Path
from typing import Iterable

from .holidays import HOLIDAYS, Holiday, by_id

STATE_DIR_DEFAULT = Path.home() / ".gochisou-goyomi"
STATE_FILE_NAME = "state.json"
RECENT_HOLIDAY_WINDOW = 14


@dataclass
class MealEntry:
    date: str  # YYYY-MM-DD
    holiday_id: str | None
    ate_suggested: bool
    dish: str
    rating: int  # 1..5
    note: str = ""


@dataclass
class Store:
    entries: list[MealEntry] = field(default_factory=list)
    version: int = 1

    @classmethod
    def load(cls, path: Path | None = None) -> "Store":
        path = path or (STATE_DIR_DEFAULT / STATE_FILE_NAME)
        if not path.exists():
            return cls()
        try:
            raw = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return cls()
        entries = [MealEntry(**e) for e in raw.get("entries", [])]
        return cls(entries=entries, version=int(raw.get("version", 1)))

    def save(self, path: Path | None = None) -> None:
        path = path or (STATE_DIR_DEFAULT / STATE_FILE_NAME)
        path.parent.mkdir(parents=True, exist_ok=True)
        payload = {
            "version": self.version,
            "entries": [asdict(e) for e in self.entries],
        }
        path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    def log(self, entry: MealEntry) -> None:
        # Replace existing log for the same date
        self.entries = [e for e in self.entries if e.date != entry.date]
        self.entries.append(entry)
        self.entries.sort(key=lambda e: e.date)

    def find_for_date(self, iso: str) -> MealEntry | None:
        return next((e for e in self.entries if e.date == iso), None)

    def recent_holiday_ids(self, target: date, *, window: int = RECENT_HOLIDAY_WINDOW) -> set[str]:
        from datetime import datetime as _dt
        cutoff = target.toordinal() - window
        out: set[str] = set()
        for e in self.entries:
            if not e.holiday_id:
                continue
            try:
                d = _dt.strptime(e.date, "%Y-%m-%d").date()
            except ValueError:
                continue
            if d.toordinal() >= cutoff:
                out.add(e.holiday_id)
        return out

    # ============ statistics ============

    def countries_this_year(self, year: int) -> set[str]:
        out: set[str] = set()
        for e in self.entries:
            if not e.holiday_id or not e.date.startswith(f"{year}-"):
                continue
            h = by_id(e.holiday_id)
            if h:
                out.add(h.country_jp)
        return out

    def total_logged(self) -> int:
        return len(self.entries)

    def average_rating(self) -> float:
        if not self.entries:
            return 0.0
        return sum(e.rating for e in self.entries) / len(self.entries)

    def streak_ending(self, target: date) -> int:
        """Consecutive days up to and including target that have a log."""
        cur = target
        s = 0
        dates = {e.date for e in self.entries}
        while cur.isoformat() in dates:
            s += 1
            cur = date.fromordinal(cur.toordinal() - 1)
        return s

    def top_countries(self, year: int | None = None, k: int = 5) -> list[tuple[str, int]]:
        counts: dict[str, int] = {}
        for e in self.entries:
            if year and not e.date.startswith(f"{year}-"):
                continue
            if not e.holiday_id:
                continue
            h = by_id(e.holiday_id)
            if not h:
                continue
            counts[h.country_jp] = counts.get(h.country_jp, 0) + 1
        return sorted(counts.items(), key=lambda kv: -kv[1])[:k]


def all_countries() -> set[str]:
    return {h.country_jp for h in HOLIDAYS}
