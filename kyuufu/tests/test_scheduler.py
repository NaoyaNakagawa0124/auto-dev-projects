from __future__ import annotations

from datetime import datetime, timedelta, timezone

import pytest

from kyuufu.scheduler import tier_for, tier_for_dt, suggest_stop, is_quiet_hour


def test_tier_for_evening():
    assert tier_for(22) == "evening"
    assert tier_for(23) == "evening"


def test_tier_for_deep():
    assert tier_for(0) == "deep"
    assert tier_for(1) == "deep"
    assert tier_for(2) == "deep"


def test_tier_for_predawn():
    assert tier_for(3) == "predawn"
    assert tier_for(4) == "predawn"
    assert tier_for(5) == "predawn"


def test_tier_for_day():
    for h in (6, 12, 17, 21):
        assert tier_for(h) == "day"


def test_tier_boundaries_no_overlap():
    """Every hour 0..23 must map to exactly one tier."""
    for h in range(24):
        t = tier_for(h)
        assert t in ("evening", "deep", "predawn", "day")


def test_tier_for_dt_uses_hour():
    dt = datetime(2026, 5, 17, 23, 5)
    assert tier_for_dt(dt) == "evening"


def test_tier_for_invalid_hour():
    with pytest.raises(ValueError):
        tier_for(24)
    with pytest.raises(ValueError):
        tier_for(-1)


def test_is_quiet_hour():
    assert is_quiet_hour(1) is True
    assert is_quiet_hour(4) is True
    assert is_quiet_hour(15) is False
    assert is_quiet_hour(22) is False


def test_suggest_stop_within_window():
    now = datetime(2026, 5, 17, 21, 0, tzinfo=timezone.utc)
    stop = suggest_stop(now, within_hours=2.0)
    # Latest stop within 2 hours of 21:00 is 22:30 or 23:00... but window ends 23:00.
    assert stop >= now
    assert stop <= now + timedelta(hours=2.0)


def test_suggest_stop_handles_wrap_around_midnight():
    now = datetime(2026, 5, 17, 23, 30, tzinfo=timezone.utc)
    stop = suggest_stop(now, within_hours=3.0)
    # Stop must be after now (so post-midnight).
    assert stop > now
    assert stop.day == 18


def test_suggest_stop_requires_positive_hours():
    now = datetime(2026, 5, 17, 22, 0, tzinfo=timezone.utc)
    with pytest.raises(ValueError):
        suggest_stop(now, within_hours=0)
