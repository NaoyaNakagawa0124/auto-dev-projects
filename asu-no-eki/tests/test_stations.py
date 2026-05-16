from __future__ import annotations

from asu_no_eki.stations import (
    STATIONS, BANNED_WORDS, EVENT_TYPES, by_id, in_ring_order,
)


def test_thirty_stations():
    assert len(STATIONS) == 30


def test_station_ids_unique():
    ids = [s.id for s in STATIONS]
    assert len(set(ids)) == len(ids)


def test_station_jp_names_unique():
    names = [s.jp for s in STATIONS]
    assert len(set(names)) == len(names)


def test_ring_indices_are_0_to_29_unique():
    idx = sorted(s.ring_index for s in STATIONS)
    assert idx == list(range(30))


def test_in_ring_order_is_monotonic():
    ordered = in_ring_order()
    for a, b in zip(ordered, ordered[1:]):
        assert a.ring_index < b.ring_index


def test_each_station_has_events():
    for s in STATIONS:
        assert len(s.events) >= 1, f"no events for {s.id}"


def test_event_types_are_valid():
    for s in STATIONS:
        for ev in s.events:
            assert ev.type in EVENT_TYPES, f"bad type {ev.type} in {s.id}"


def test_event_years_are_recent():
    for s in STATIONS:
        for ev in s.events:
            assert 2024 <= ev.year <= 2030


def test_event_months_in_range():
    for s in STATIONS:
        for ev in s.events:
            assert 1 <= ev.month <= 12


def test_event_blurb_lengths():
    for s in STATIONS:
        for ev in s.events:
            assert 10 <= len(ev.blurb) <= 80, f"blurb len {len(ev.blurb)} in {s.id}"


def test_no_banned_words():
    for s in STATIONS:
        for ev in s.events:
            for w in BANNED_WORDS:
                assert w not in ev.blurb, f"'{w}' in {s.id} event: {ev.blurb}"


def test_by_id_resolves():
    assert by_id("tokyo").jp == "東京"
    assert by_id("shibuya").jp == "渋谷"
    assert by_id("nope") is None
