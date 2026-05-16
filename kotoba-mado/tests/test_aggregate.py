from datetime import date

from kotoba_mado.aggregate import (
    by_day,
    day_summary,
    intensity_bucket,
    streak,
    summarize,
    total_by_category,
    total_minutes,
    year_summaries,
)
from kotoba_mado.models import Log, Session


def _log_with(*items):
    log = Log()
    for d, cat, mins in items:
        log.add(Session(date=d, language="ja", category=cat, minutes=mins))
    return log


def test_by_day_groups_correctly():
    log = _log_with(("2026-05-17", "read", 10), ("2026-05-17", "listen", 20),
                    ("2026-05-16", "read", 15))
    g = by_day(log)
    assert len(g["2026-05-17"]) == 2
    assert len(g["2026-05-16"]) == 1


def test_summarize_computes_minutes_and_dominant():
    log = _log_with(("2026-05-17", "read", 10), ("2026-05-17", "listen", 30))
    s = summarize(log.sessions, "2026-05-17")
    assert s.minutes == 40
    assert s.dominant == "listen"
    assert s.by_category["read"] == 10
    assert s.by_category["listen"] == 30
    assert s.empty is False
    assert s.sessions == 2


def test_summarize_empty_for_no_sessions():
    s = summarize([], "2026-05-17")
    assert s.empty is True
    assert s.dominant is None
    assert s.minutes == 0


def test_day_summary_for_log():
    log = _log_with(("2026-05-17", "read", 10))
    s = day_summary(log, "2026-05-17")
    assert s.minutes == 10
    assert day_summary(log, date(2026, 5, 18)).empty is True


def test_year_summaries_returns_all_days():
    log = _log_with(("2026-05-17", "read", 10))
    ys = year_summaries(log, 2026)
    assert len(ys) == 365  # 2026 is not a leap year
    assert ys["2026-05-17"].minutes == 10
    assert ys["2026-01-01"].empty is True


def test_year_summaries_leap_year():
    # 2024 was a leap year (366 days)
    ys = year_summaries(Log(), 2024)
    assert len(ys) == 366


def test_streak_counts_consecutive_days_backward():
    log = _log_with(
        ("2026-05-15", "read", 10),
        ("2026-05-16", "listen", 10),
        ("2026-05-17", "vocab", 10),
    )
    assert streak(log, date(2026, 5, 17)) == 3
    # break at 15→14 since no entry for 14
    log2 = _log_with(("2026-05-13", "read", 10), ("2026-05-15", "read", 10))
    assert streak(log2, date(2026, 5, 17)) == 0  # not active today
    assert streak(log2, date(2026, 5, 15)) == 1


def test_total_minutes_and_by_category():
    log = _log_with(("2026-05-17", "read", 10), ("2026-05-17", "listen", 25),
                    ("2026-05-16", "read", 5))
    assert total_minutes(log) == 40
    by_cat = total_by_category(log)
    assert by_cat["read"] == 15
    assert by_cat["listen"] == 25
    assert by_cat["vocab"] == 0


def test_intensity_bucket_quantizes():
    assert intensity_bucket(0) == 0
    assert intensity_bucket(1) == 1
    assert intensity_bucket(15) == 2
    assert intensity_bucket(30) == 3
    assert intensity_bucket(60) == 4
    assert intensity_bucket(120) == 5
    assert intensity_bucket(500) == 5
