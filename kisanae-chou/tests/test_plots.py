import matplotlib
matplotlib.use("Agg")  # noqa: E402

from pathlib import Path

import pytest

from kisanae_chou.data import SAMPLE_ANIME, SEASONAL_EVENTS
from kisanae_chou.plots import (
    month_card_fig,
    palette_year_fig,
    save_fig,
    season_scroll_fig,
    year_timeline_fig,
)


def test_year_timeline_fig_builds():
    fig = year_timeline_fig(SAMPLE_ANIME, SEASONAL_EVENTS, 2026)
    assert fig is not None
    # at least some axes / artists exist
    assert len(fig.axes) >= 1


def test_month_card_fig_for_every_month():
    for m in range(1, 13):
        fig = month_card_fig(SAMPLE_ANIME, SEASONAL_EVENTS, 2026, m)
        assert fig is not None


def test_palette_year_fig_builds():
    fig = palette_year_fig(2026)
    assert fig is not None


def test_season_scroll_fig_builds():
    fig = season_scroll_fig(SAMPLE_ANIME, SEASONAL_EVENTS, 2026)
    assert fig is not None
    assert len(fig.axes) == 4


def test_save_fig_writes_png(tmp_path):
    fig = palette_year_fig(2026)
    out = tmp_path / "p.png"
    save_fig(fig, str(out))
    assert out.exists()
    assert out.stat().st_size > 1000


def test_render_all_creates_all_files(tmp_path):
    from kisanae_chou.run import render_all
    paths = render_all(tmp_path, year=2026)
    assert len(paths) == 1 + 12 + 1 + 1   # year + 12 months + scroll + palette
    for p in paths:
        assert p.exists()
        assert p.stat().st_size > 1000
