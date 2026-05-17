from __future__ import annotations

import numpy as np

from kyokuori.patterns import (
    cross_stitch, knit, quilt, mosaic, beading,
    all_patterns, ALL_PATTERN_NAMES, GRID,
)
from kyokuori.tracks import by_id, TRACKS


def _check_shape_and_range(img):
    assert img.shape == (GRID, GRID, 3), f"shape {img.shape}"
    assert img.dtype.kind == "f", f"dtype {img.dtype}"
    assert float(img.min()) >= 0.0
    assert float(img.max()) <= 1.0


def test_cross_stitch_shape():
    _check_shape_and_range(cross_stitch(by_id("espresso")))


def test_knit_shape():
    _check_shape_and_range(knit(by_id("espresso")))


def test_quilt_shape():
    _check_shape_and_range(quilt(by_id("espresso")))


def test_mosaic_shape():
    _check_shape_and_range(mosaic(by_id("espresso")))


def test_beading_shape():
    _check_shape_and_range(beading(by_id("espresso")))


def test_all_patterns_for_every_track():
    for track in TRACKS:
        for name, img in all_patterns(track).items():
            assert name in ALL_PATTERN_NAMES
            _check_shape_and_range(img)


def test_patterns_are_deterministic():
    for fn in (cross_stitch, knit, quilt, mosaic, beading):
        a = fn(by_id("apt"))
        b = fn(by_id("apt"))
        assert np.array_equal(a, b), f"{fn.__name__} not deterministic"


def test_different_tracks_yield_different_patterns():
    a = cross_stitch(by_id("espresso"))
    b = cross_stitch(by_id("fortnight"))
    assert not np.array_equal(a, b)


def test_mosaic_has_more_than_one_color():
    img = mosaic(by_id("apt"))
    # Quantize to 3 decimals to count distinct cells.
    cells = {(round(float(img[r, c, 0]), 3), round(float(img[r, c, 1]), 3), round(float(img[r, c, 2]), 3))
             for r in range(GRID) for c in range(GRID)}
    assert len(cells) >= 4
