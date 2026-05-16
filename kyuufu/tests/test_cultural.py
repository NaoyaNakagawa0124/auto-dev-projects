from __future__ import annotations

from datetime import date

import pytest

from kyuufu.cultural import EVENTS, for_month, for_date, framed, PREFIX
from kyuufu.messages import BANNED_WORDS


def test_twelve_events():
    assert len(EVENTS) == 12


def test_events_cover_all_months():
    months = sorted({e.month for e in EVENTS})
    assert months == list(range(1, 13))


def test_for_month_returns_matching_month():
    for m in range(1, 13):
        ev = for_month(m)
        assert ev.month == m


def test_for_month_rejects_out_of_range():
    with pytest.raises(ValueError):
        for_month(0)
    with pytest.raises(ValueError):
        for_month(13)


def test_for_date_uses_month():
    ev = for_date(date(2026, 5, 17))
    assert ev.month == 5


def test_blurb_is_short():
    for ev in EVENTS:
        assert 10 <= len(ev.blurb) <= 100, f"month {ev.month} blurb len: {len(ev.blurb)}"


def test_framed_starts_with_prefix():
    out = framed(date(2026, 5, 17))
    assert out.startswith(PREFIX)


def test_no_banned_words_in_events():
    for ev in EVENTS:
        for w in BANNED_WORDS:
            assert w not in ev.blurb, f"'{w}' in month {ev.month} blurb"
            assert w not in ev.title
