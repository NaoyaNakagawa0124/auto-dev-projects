from __future__ import annotations

import matplotlib
matplotlib.use("Agg")  # Headless backend for tests.
import matplotlib.pyplot as plt

from kyokuori.renderer import plate, palette_strip
from kyokuori.tracks import by_id


def test_plate_returns_figure_with_five_axes():
    fig = plate(by_id("espresso"))
    try:
        # Figure should contain 5 image subplots.
        axes = [a for a in fig.get_axes() if a.has_data()]
        assert len(axes) == 5
    finally:
        plt.close(fig)


def test_palette_strip_renders_without_error():
    fig = palette_strip(by_id("fortnight"))
    try:
        axes = [a for a in fig.get_axes() if a.has_data()]
        assert len(axes) >= 1
    finally:
        plt.close(fig)


def test_plate_title_contains_track_info():
    fig = plate(by_id("fortnight"))
    try:
        title = fig._suptitle.get_text() if fig._suptitle else ""
        assert "Fortnight" in title
        assert "Taylor Swift" in title
    finally:
        plt.close(fig)
