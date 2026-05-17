import datetime as dt

import pytest

from app.holidays import (
    Holiday,
    TAGS,
    all_tags,
    curated_count,
    get_holiday,
    list_year,
)


def test_list_year_has_366_entries():
    y = list_year()
    assert len(y) == 366


def test_each_day_has_unique_date_key():
    y = list_year()
    keys = [h.date_key for h in y]
    assert len(set(keys)) == 366


def test_jan1_is_new_year():
    h = get_holiday(dt.date(2026, 1, 1))
    assert h.name == "元日"
    assert h.tag == "milestone"


def test_dec31_is_omisoka():
    h = get_holiday(dt.date(2026, 12, 31))
    assert h.name == "大晦日"


def test_feb29_handled():
    h = get_holiday(dt.date(2024, 2, 29))
    assert h.date_key == "02-29"
    assert h.name != ""


def test_each_holiday_has_three_rituals():
    y = list_year()
    for h in y:
        assert len(h.rituals) == 3, f"{h.date_key} has {len(h.rituals)} rituals"


def test_rituals_have_reasonable_length():
    y = list_year()
    for h in y:
        for r in h.rituals:
            assert 10 <= len(r) <= 120, f"{h.date_key} ritual length {len(r)}: {r!r}"


def test_ritual_triple_within_a_holiday_is_distinct():
    y = list_year()
    for h in y:
        assert len(set(h.rituals)) == 3, f"{h.date_key} duplicate rituals"


def test_holiday_is_deterministic():
    a = get_holiday(dt.date(2026, 5, 17))
    b = get_holiday(dt.date(2026, 5, 17))
    assert a == b


def test_curated_at_least_50():
    assert curated_count() >= 50


def test_tag_is_known_or_milestone():
    known_tags = set(TAGS) | {"milestone"}
    for h in list_year():
        assert h.tag in known_tags, f"unknown tag {h.tag} on {h.date_key}"


def test_holiday_immutable():
    h = get_holiday(dt.date(2026, 1, 1))
    with pytest.raises(Exception):
        h.name = "x"  # type: ignore[misc]


def test_specific_curated_dates():
    # spot check several curated entries
    assert get_holiday(dt.date(2026, 5, 17)).name == "世界 子守唄 の 日"
    assert get_holiday(dt.date(2026, 11, 22)).name == "いい 夫婦 の 日"
    assert get_holiday(dt.date(2026, 12, 25)).name == "クリスマス"
    assert get_holiday(dt.date(2026, 7, 7)).name == "七夕"


def test_all_tags_export():
    tags = all_tags()
    assert "love" in tags
    assert "food" in tags
