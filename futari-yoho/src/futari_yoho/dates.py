"""Date helpers — pure, naive local-date based."""

from __future__ import annotations

from datetime import date, timedelta


def iso(d: date) -> str:
    return d.isoformat()


def parse_iso(s: str) -> date:
    return date.fromisoformat(s)


def today(now: date | None = None) -> date:
    return now or date.today()


def week_dates(end: date | None = None, n: int = 7) -> list[date]:
    """Return n consecutive dates ending at `end` (inclusive), oldest first."""
    end = end or date.today()
    return [end - timedelta(days=n - 1 - i) for i in range(n)]


def days_back(d: date, days: int) -> date:
    return d - timedelta(days=days)
