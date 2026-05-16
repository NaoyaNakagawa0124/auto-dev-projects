from datetime import date

from futari_yoho.dates import days_back, iso, parse_iso, week_dates


def test_iso_and_parse_roundtrip():
    d = date(2026, 5, 17)
    assert iso(d) == "2026-05-17"
    assert parse_iso("2026-05-17") == d


def test_week_dates_returns_oldest_first_inclusive():
    end = date(2026, 5, 17)
    week = week_dates(end, 7)
    assert len(week) == 7
    assert week[-1] == end
    assert week[0] == date(2026, 5, 11)


def test_week_dates_arbitrary_length():
    end = date(2026, 5, 17)
    days = week_dates(end, 3)
    assert days == [date(2026, 5, 15), date(2026, 5, 16), date(2026, 5, 17)]


def test_days_back():
    assert days_back(date(2026, 5, 17), 3) == date(2026, 5, 14)
