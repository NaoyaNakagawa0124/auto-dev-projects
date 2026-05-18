import datetime as dt

from kisanae_chou.data import SAMPLE_ANIME, SEASONAL_EVENTS, AnimeShow
from kisanae_chou.layout import (
    bucket_anime_by_month,
    count_anime_per_month,
    days_overlap,
    events_active_in_month,
    month_overlap_days,
    months_in_season,
    season_of_month,
)


def test_days_overlap_basic():
    a = (dt.date(2026, 1, 1), dt.date(2026, 1, 10))
    b = (dt.date(2026, 1, 5), dt.date(2026, 1, 20))
    assert days_overlap(*a, *b) == 6


def test_days_overlap_disjoint():
    assert days_overlap(
        dt.date(2026, 1, 1), dt.date(2026, 1, 10),
        dt.date(2026, 2, 1), dt.date(2026, 2, 5),
    ) == 0


def test_days_overlap_identical():
    assert days_overlap(
        dt.date(2026, 1, 1), dt.date(2026, 1, 10),
        dt.date(2026, 1, 1), dt.date(2026, 1, 10),
    ) == 10


def test_month_overlap_full_month():
    # full january
    assert month_overlap_days(dt.date(2026, 1, 1), dt.date(2026, 1, 31), 2026, 1) == 31


def test_month_overlap_partial():
    assert month_overlap_days(dt.date(2026, 1, 20), dt.date(2026, 2, 10), 2026, 1) == 12


def test_month_overlap_none():
    assert month_overlap_days(dt.date(2026, 3, 1), dt.date(2026, 3, 31), 2026, 1) == 0


def test_bucket_returns_12_keys():
    buckets = bucket_anime_by_month(SAMPLE_ANIME, 2026)
    assert set(buckets.keys()) == set(range(1, 13))


def test_bucket_each_month_has_entries():
    buckets = bucket_anime_by_month(SAMPLE_ANIME, 2026)
    for m, v in buckets.items():
        assert len(v) > 0, f"month {m} empty"


def test_anime_in_specific_month():
    show = AnimeShow("test", dt.date(2026, 4, 1), dt.date(2026, 4, 30), 4, "drama")
    buckets = bucket_anime_by_month([show], 2026)
    assert len(buckets[4]) == 1
    assert all(len(buckets[m]) == 0 for m in range(1, 13) if m != 4)


def test_count_anime_per_month():
    buckets = bucket_anime_by_month(SAMPLE_ANIME, 2026)
    counts = count_anime_per_month(buckets)
    assert sum(counts.values()) > 40
    assert all(counts[m] > 0 for m in range(1, 13))


def test_season_of_month_buckets():
    assert season_of_month(4) == "春"
    assert season_of_month(7) == "夏"
    assert season_of_month(10) == "秋"
    assert season_of_month(1) == "冬"
    assert season_of_month(12) == "冬"


def test_months_in_season():
    assert months_in_season("春") == [3, 4, 5]
    assert months_in_season("冬") == [12, 1, 2]


def test_events_active_in_month():
    cherry = next(e for e in SEASONAL_EVENTS if e.name == "桜 前線")
    in_april = events_active_in_month([cherry], 2026, 4)
    assert len(in_april) == 1
    in_january = events_active_in_month([cherry], 2026, 1)
    assert len(in_january) == 0
