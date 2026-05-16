"""Pick today's station deterministically from the date."""

from __future__ import annotations

from datetime import date

from .stations import STATIONS, Station


def today_station(d: date | None = None) -> Station:
    d = d or date.today()
    # ordinal() ensures continuous integer progression across years.
    idx = d.toordinal() % len(STATIONS)
    ring = sorted(STATIONS, key=lambda s: s.ring_index)
    return ring[idx]


def station_for_offset(d: date, offset: int) -> Station:
    """Today's station shifted by `offset` days; for testing 30-day cycle."""
    idx = (d.toordinal() + offset) % len(STATIONS)
    ring = sorted(STATIONS, key=lambda s: s.ring_index)
    return ring[idx]
