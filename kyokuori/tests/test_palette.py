from __future__ import annotations

from kyokuori.palette import palette_for, hsl_to_rgb, PALETTE_SIZE
from kyokuori.tracks import TRACKS, by_id


def test_palette_size_is_sixteen():
    assert PALETTE_SIZE == 16
    p = palette_for(by_id("espresso"))
    assert len(p) == PALETTE_SIZE


def test_palette_is_deterministic():
    a = palette_for(by_id("fortnight"))
    b = palette_for(by_id("fortnight"))
    assert a == b


def test_palettes_differ_across_tracks():
    a = palette_for(by_id("espresso"))
    b = palette_for(by_id("fortnight"))
    assert a != b


def test_all_components_in_unit_interval():
    for track in TRACKS:
        for (r, g, b) in palette_for(track):
            assert 0.0 <= r <= 1.0
            assert 0.0 <= g <= 1.0
            assert 0.0 <= b <= 1.0


def test_hsl_to_rgb_pure_red():
    (r, g, b) = hsl_to_rgb(0.0, 1.0, 0.5)
    assert r > 0.99
    assert g < 0.01
    assert b < 0.01


def test_each_track_has_some_color_variety():
    """A palette must contain more than 2 distinct colors (otherwise it's boring)."""
    for track in TRACKS:
        pal = palette_for(track)
        unique = {tuple(round(c, 3) for c in rgb) for rgb in pal}
        assert len(unique) >= 4, f"{track.id} only has {len(unique)} distinct colors"
