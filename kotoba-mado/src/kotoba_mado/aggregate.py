"""Aggregation helpers — pure functions over Log."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, timedelta
from typing import Iterable

from .categories import CATEGORY_KEYS, BY_KEY
from .models import Log, Session


@dataclass(frozen=True)
class DaySummary:
    date_iso: str
    minutes: int
    by_category: dict[str, int]   # category key → minutes
    dominant: str | None          # category key of the majority, or None if empty
    sessions: int                 # number of distinct sessions

    @property
    def empty(self) -> bool:
        return self.minutes == 0


def by_day(log: Log) -> dict[str, list[Session]]:
    out: dict[str, list[Session]] = {}
    for s in log.sessions:
        out.setdefault(s.date, []).append(s)
    return out


def summarize(sessions: Iterable[Session], date_iso: str) -> DaySummary:
    by_cat: dict[str, int] = {k: 0 for k in CATEGORY_KEYS}
    minutes = 0
    n = 0
    for s in sessions:
        if s.category not in by_cat:
            continue
        by_cat[s.category] += s.minutes
        minutes += s.minutes
        n += 1
    dominant: str | None = None
    if minutes > 0:
        dominant = max(by_cat.items(), key=lambda kv: kv[1])[0]
    return DaySummary(
        date_iso=date_iso,
        minutes=minutes,
        by_category=by_cat,
        dominant=dominant,
        sessions=n,
    )


def day_summary(log: Log, d: date | str) -> DaySummary:
    key = d if isinstance(d, str) else d.isoformat()
    sessions = by_day(log).get(key, [])
    return summarize(sessions, key)


def year_summaries(log: Log, year: int) -> dict[str, DaySummary]:
    """Return DaySummary keyed by ISO date for every day in `year`."""
    grouped = by_day(log)
    out: dict[str, DaySummary] = {}
    d = date(year, 1, 1)
    end = date(year, 12, 31)
    while d <= end:
        key = d.isoformat()
        out[key] = summarize(grouped.get(key, []), key)
        d += timedelta(days=1)
    return out


def streak(log: Log, today: date | None = None) -> int:
    """Current streak in days, counting back from `today`."""
    today = today or date.today()
    grouped = by_day(log)
    s = 0
    d = today
    while True:
        if grouped.get(d.isoformat()):
            s += 1
            d -= timedelta(days=1)
        else:
            break
    return s


def total_minutes(log: Log) -> int:
    return sum(s.minutes for s in log.sessions)


def total_by_category(log: Log) -> dict[str, int]:
    out: dict[str, int] = {k: 0 for k in CATEGORY_KEYS}
    for s in log.sessions:
        if s.category in out:
            out[s.category] += s.minutes
    return out


def intensity_bucket(minutes: int) -> int:
    """Quantize minutes into [0..5] intensity for color/glyph selection."""
    if minutes <= 0:
        return 0
    if minutes < 15:
        return 1
    if minutes < 30:
        return 2
    if minutes < 60:
        return 3
    if minutes < 120:
        return 4
    return 5
