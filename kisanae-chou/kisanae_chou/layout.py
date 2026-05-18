"""Pure-function helpers — anime ↔ month bucketing, overlap detection."""
from __future__ import annotations

import datetime as _dt
from dataclasses import dataclass
from typing import Iterable, List


@dataclass(frozen=True)
class AnimePoint:
    """A single tick to plot — one anime within one month."""
    month: int
    title: str
    genre: str
    episodes_in_month: int


def days_overlap(a_start: _dt.date, a_end: _dt.date, b_start: _dt.date, b_end: _dt.date) -> int:
    """Number of days the two ranges overlap (inclusive)."""
    last_start = max(a_start, b_start)
    first_end = min(a_end, b_end)
    if last_start > first_end:
        return 0
    return (first_end - last_start).days + 1


def month_overlap_days(start: _dt.date, end: _dt.date, year: int, month: int) -> int:
    """How many days of the airing range fall inside year-month."""
    m_start = _dt.date(year, month, 1)
    if month == 12:
        m_end = _dt.date(year, 12, 31)
    else:
        m_end = _dt.date(year, month + 1, 1) - _dt.timedelta(days=1)
    return days_overlap(start, end, m_start, m_end)


def bucket_anime_by_month(anime_list, year: int) -> dict[int, List[AnimePoint]]:
    """For each 1..12, list of AnimePoints whose airing overlapped that month."""
    out: dict[int, List[AnimePoint]] = {m: [] for m in range(1, 13)}
    for a in anime_list:
        days = a.end.toordinal() - a.start.toordinal() + 1
        if days <= 0:
            continue
        eps_per_day = a.episodes / days
        for m in range(1, 13):
            d = month_overlap_days(a.start, a.end, year, m)
            if d > 0:
                eps_in_m = max(1, round(eps_per_day * d))
                out[m].append(AnimePoint(m, a.title, a.genre, eps_in_m))
    return out


def season_of_month(month: int) -> str:
    """春 (3-5) / 夏 (6-8) / 秋 (9-11) / 冬 (12, 1, 2)."""
    if month in (3, 4, 5):
        return "春"
    if month in (6, 7, 8):
        return "夏"
    if month in (9, 10, 11):
        return "秋"
    return "冬"


def months_in_season(season: str) -> List[int]:
    return {
        "春": [3, 4, 5],
        "夏": [6, 7, 8],
        "秋": [9, 10, 11],
        "冬": [12, 1, 2],
    }[season]


def events_active_in_month(events, year: int, month: int) -> List:
    """Seasonal events that overlap the given month (>= 1 day)."""
    result = []
    for e in events:
        if month_overlap_days(e.start, e.end, year, month) > 0:
            result.append(e)
    return result


def count_anime_per_month(buckets: dict[int, List[AnimePoint]]) -> dict[int, int]:
    return {m: len(v) for m, v in buckets.items()}
