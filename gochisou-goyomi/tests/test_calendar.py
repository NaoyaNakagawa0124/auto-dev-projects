"""Pure-logic tests for the dataset, calendar lookup, and state."""

from __future__ import annotations

from datetime import date
from pathlib import Path
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from gochisou_goyomi.holidays import HOLIDAYS, by_id  # noqa: E402
from gochisou_goyomi.calendar import holidays_on, todays_pick, month_summary  # noqa: E402
from gochisou_goyomi.state import Store, MealEntry  # noqa: E402


def test_dataset_size():
    assert len(HOLIDAYS) >= 80


def test_ids_unique():
    ids = [h.id for h in HOLIDAYS]
    assert len(ids) == len(set(ids))


def test_dates_well_formed():
    for h in HOLIDAYS:
        assert len(h.date) == 5 and h.date[2] == "-", h.date


def test_may_17_finds_syttende_mai():
    hits = holidays_on(date(2026, 5, 17))
    assert any(h.id == "syttende-no" for h in hits)


def test_todays_pick_exact_match():
    h, off = todays_pick(date(2026, 5, 17))
    assert h is not None
    assert h.id == "syttende-no"
    assert off == 0


def test_todays_pick_falls_back():
    # 2026-05-21 has no exact match. Nearest is 05-20 (Dragon Boat) or 05-23 (Belgian).
    h, off = todays_pick(date(2026, 5, 21))
    assert h is not None
    assert abs(off) <= 3


def test_todays_pick_avoids_recent():
    # Force the recent list to include Syttende Mai; we should still get *some*
    # holiday for that day (there happens to be only one), but the function should
    # not crash and the fallback logic should kick in for ambiguous days.
    h, _ = todays_pick(date(2026, 5, 17), recent_ids={"syttende-no"})
    assert h is not None  # still returns a candidate even if it had to repeat


def test_month_summary_length():
    # 2024 February has 29 days; 2026 has 28
    assert len(month_summary(2026, 2)) == 28
    assert len(month_summary(2024, 2)) == 29
    assert len(month_summary(2026, 5)) == 31


def test_log_round_trip(tmp_path):
    path = tmp_path / "state.json"
    s = Store()
    s.log(MealEntry("2026-05-17", "syttende-no", True, "ホットドッグ", 5, "うまかった"))
    s.save(path)

    raw = json.loads(path.read_text(encoding="utf-8"))
    assert raw["entries"][0]["dish"] == "ホットドッグ"

    s2 = Store.load(path)
    assert len(s2.entries) == 1
    assert s2.entries[0].rating == 5


def test_log_replaces_same_day(tmp_path):
    s = Store()
    s.log(MealEntry("2026-05-17", "syttende-no", True, "first", 3))
    s.log(MealEntry("2026-05-17", "syttende-no", True, "second", 4))
    assert len(s.entries) == 1
    assert s.entries[0].dish == "second"


def test_streak_counts_consecutive_days():
    s = Store()
    for day in (15, 16, 17):
        s.log(MealEntry(f"2026-05-{day:02d}", None, False, "x", 3))
    assert s.streak_ending(date(2026, 5, 17)) == 3
    assert s.streak_ending(date(2026, 5, 18)) == 0


def test_countries_this_year():
    s = Store()
    s.log(MealEntry("2026-05-17", "syttende-no", True, "x", 5))
    s.log(MealEntry("2026-01-01", "nyd-jp", True, "y", 4))
    s.log(MealEntry("2025-12-31", "toshikoshi", True, "z", 5))
    assert s.countries_this_year(2026) == {"ノルウェー", "日本"}


def test_top_countries():
    s = Store()
    s.log(MealEntry("2026-01-01", "nyd-jp", True, "a", 5))
    s.log(MealEntry("2026-01-11", "oshogatsu-mochi", True, "b", 4))
    s.log(MealEntry("2026-02-03", "setsubun-jp", True, "c", 4))
    s.log(MealEntry("2026-05-17", "syttende-no", True, "d", 4))
    top = s.top_countries(2026)
    assert top[0] == ("日本", 3)


def test_recent_holiday_ids_window():
    s = Store()
    s.log(MealEntry("2026-05-15", "syttende-no", True, "a", 5))
    s.log(MealEntry("2026-04-15", "showa", True, "b", 4))
    recent = s.recent_holiday_ids(date(2026, 5, 17), window=14)
    assert "syttende-no" in recent
    assert "showa" not in recent  # outside 14-day window


def test_dish_fields_non_empty():
    for h in HOLIDAYS:
        assert h.dish_jp and len(h.dish_jp) > 0
        assert h.country_jp and len(h.country_jp) > 0
        assert h.blurb and len(h.blurb) > 0
