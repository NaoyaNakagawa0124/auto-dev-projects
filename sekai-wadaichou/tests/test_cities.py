from __future__ import annotations

from sekai_wadaichou.cities import CITIES, BANNED_WORDS, by_id, sorted_by_longitude


def test_twelve_cities():
    assert len(CITIES) == 12


def test_ids_unique():
    ids = [c.id for c in CITIES]
    assert len(set(ids)) == len(ids)


def test_japanese_names_unique():
    names = [c.jp for c in CITIES]
    assert len(set(names)) == len(names)


def test_longitudes_distinct_and_in_range():
    lons = [c.lon for c in CITIES]
    assert len(set(lons)) == len(lons)
    for lon in lons:
        assert -180.0 <= lon <= 180.0


def test_event_and_talking_point_present():
    for c in CITIES:
        assert c.event.strip(), f"missing event for {c.id}"
        assert c.talking_point.strip(), f"missing talking_point for {c.id}"
        assert 5 <= len(c.event) <= 200, f"event length out of band for {c.id}"
        assert 5 <= len(c.talking_point) <= 200, f"talking_point length out of band for {c.id}"


def test_no_banned_words_in_events():
    for c in CITIES:
        for word in BANNED_WORDS:
            assert word not in c.event, f"banned word '{word}' in event for {c.id}"
            assert word not in c.talking_point, f"banned word '{word}' in talking_point for {c.id}"


def test_by_id_returns_or_none():
    assert by_id("tokyo").jp == "東京"
    assert by_id("nope-not-real") is None


def test_sorted_by_longitude_is_monotonic():
    sorted_cities = sorted_by_longitude()
    lons = [c.lon for c in sorted_cities]
    for a, b in zip(lons, lons[1:]):
        assert a <= b


def test_cities_span_the_globe():
    """At least three of the four longitude quadrants should be represented."""
    quadrants = {(-180, -90), (-90, 0), (0, 90), (90, 180)}
    found = set()
    for c in CITIES:
        for lo, hi in quadrants:
            if lo <= c.lon < hi:
                found.add((lo, hi))
                break
    assert len(found) >= 3, f"too few quadrants: {found}"


def test_longitude_range_is_wide():
    """The east-west span across the cities should exceed 180 degrees."""
    lons = [c.lon for c in CITIES]
    assert max(lons) - min(lons) > 180.0
