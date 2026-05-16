from __future__ import annotations

from datetime import date, timedelta

from asu_no_eki.rotator import today_station, station_for_offset
from asu_no_eki.stations import STATIONS


def test_same_date_same_station():
    d = date(2026, 5, 17)
    assert today_station(d).id == today_station(d).id


def test_consecutive_days_different_station():
    d = date(2026, 5, 17)
    nxt = d + timedelta(days=1)
    assert today_station(d).id != today_station(nxt).id


def test_thirty_day_cycle():
    """In 30 consecutive days, all 30 stations appear exactly once."""
    d = date(2026, 5, 17)
    ids = {today_station(d + timedelta(days=i)).id for i in range(30)}
    assert len(ids) == 30


def test_offset_is_consistent_with_today():
    d = date(2026, 5, 17)
    assert station_for_offset(d, 0).id == today_station(d).id


def test_offset_thirty_wraps():
    d = date(2026, 5, 17)
    assert station_for_offset(d, 30).id == today_station(d).id


def test_default_today_is_today():
    # Just make sure no-arg form returns a station with a known id.
    s = today_station()
    assert s.id in {st.id for st in STATIONS}
