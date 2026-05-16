"""Calendar lookups for the holiday dataset."""

from __future__ import annotations

from datetime import date, timedelta

from .holidays import HOLIDAYS, Holiday


def _md(d: date) -> str:
    return f"{d.month:02d}-{d.day:02d}"


def holidays_on(target: date) -> list[Holiday]:
    md = _md(target)
    return [h for h in HOLIDAYS if h.date == md]


def todays_pick(target: date, *, recent_ids: set[str] | None = None) -> tuple[Holiday | None, int]:
    """Return the best pick for ``target`` and the day-offset used (0 = exact match).

    The lookup expands ±3 days. Holidays the player has already used recently are
    de-prioritised so the daily picker stays fresh.
    """
    recent_ids = recent_ids or set()
    for offset in range(0, 4):
        for sign in (0, -1, 1) if offset else (0,):
            candidates = holidays_on(target + timedelta(days=sign * offset))
            if not candidates:
                continue
            fresh = [h for h in candidates if h.id not in recent_ids]
            chosen = (fresh or candidates)[0]
            return chosen, sign * offset
    return None, 0


def month_summary(year: int, month: int) -> list[list[Holiday]]:
    """Return a list of 31 (or fewer) days, each with its holidays for that month."""
    from calendar import monthrange
    _, last_day = monthrange(year, month)
    return [holidays_on(date(year, month, d)) for d in range(1, last_day + 1)]
