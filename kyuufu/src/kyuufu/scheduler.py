"""Time-of-day tier mapping + stopping-time suggestions."""

from __future__ import annotations

from datetime import datetime, time, timedelta
from typing import Literal

from .messages import Tier


def tier_for(hour: int) -> Tier:
    """Map 0-23 hour into a tier.

    evening: 22-23
    deep:    0-2
    predawn: 3-5
    day:     6-21
    """
    if hour < 0 or hour > 23:
        raise ValueError(f"hour out of range: {hour}")
    if hour in (22, 23):
        return "evening"
    if 0 <= hour <= 2:
        return "deep"
    if 3 <= hour <= 5:
        return "predawn"
    return "day"


def tier_for_dt(dt: datetime) -> Tier:
    return tier_for(dt.hour)


# A small set of "natural stopping points" — the bot suggests the next one
# that falls within the requested window.
NATURAL_STOPS: tuple[time, ...] = (
    time(22, 0),
    time(22, 30),
    time(23, 0),
    time(23, 30),
    time(0, 0),
    time(0, 30),
    time(1, 0),
    time(1, 30),
    time(2, 0),
)


def suggest_stop(now: datetime, within_hours: float) -> datetime:
    """Return the natural stopping datetime within the next `within_hours`.

    Picks the latest NATURAL_STOP whose time is <= now + within_hours.
    If no natural stop falls in window, returns now + within_hours.
    """
    if within_hours <= 0:
        raise ValueError("within_hours must be positive")
    deadline = now + timedelta(hours=within_hours)
    best: datetime | None = None
    # Walk through stops over the next ~3 days to handle midnight wrap-around.
    for day_offset in (0, 1, 2):
        base = (now + timedelta(days=day_offset)).date()
        for t in NATURAL_STOPS:
            cand = datetime.combine(base, t).replace(tzinfo=now.tzinfo)
            if cand <= now:
                continue
            if cand > deadline:
                continue
            if best is None or cand > best:
                best = cand
    return best if best is not None else deadline


def is_quiet_hour(hour: int) -> bool:
    """Whether this hour is in the deep/predawn band where rest cues matter most."""
    return tier_for(hour) in ("deep", "predawn")
