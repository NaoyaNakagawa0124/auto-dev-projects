"""Matplotlib figure builders for kisanae-chou."""
from __future__ import annotations

import datetime as _dt
from typing import Iterable, List

import matplotlib
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import patches as mpatches
from matplotlib.figure import Figure

from .data import AnimeShow, SeasonalEvent
from .layout import (
    bucket_anime_by_month,
    count_anime_per_month,
    days_overlap,
    events_active_in_month,
    months_in_season,
)
from .palette import (
    MONTH_PALETTE,
    category_color,
    genre_color,
    month_color,
    month_label,
    year_palette,
)

PAPER = "#faf6ee"
INK = "#3a2e22"
INK_LIGHT = "#6b594a"
INK_FAINT = "#a08c70"
RULE = "#d4c7ac"


def _setup_japanese_font():
    """Configure matplotlib to prefer Japanese-capable fonts."""
    preferred = [
        "Hiragino Sans",
        "Hiragino Maru Gothic ProN",
        "Yu Gothic",
        "Noto Sans CJK JP",
        "IPAPGothic",
        "DejaVu Sans",
    ]
    for name in preferred:
        if any(name.lower() in f.lower() for f in matplotlib.font_manager.findSystemFonts()):
            matplotlib.rcParams["font.family"] = name
            break
    matplotlib.rcParams["axes.unicode_minus"] = False


def _style_axes(ax):
    ax.set_facecolor(PAPER)
    for spine in ("top", "right"):
        ax.spines[spine].set_visible(False)
    for spine in ("left", "bottom"):
        ax.spines[spine].set_color(RULE)
        ax.spines[spine].set_linewidth(0.8)
    ax.tick_params(colors=INK_LIGHT, labelsize=10)


def year_timeline_fig(
    anime_list: List[AnimeShow],
    events: List[SeasonalEvent],
    year: int = 2026,
) -> Figure:
    """Big horizontal 12-month timeline with anime dots + seasonal bands."""
    _setup_japanese_font()
    fig = plt.figure(figsize=(18, 9), facecolor=PAPER)
    ax = fig.add_axes([0.05, 0.15, 0.92, 0.74])
    _style_axes(ax)

    year_start = _dt.date(year, 1, 1)
    year_end = _dt.date(year, 12, 31)
    total_days = (year_end - year_start).days + 1

    # X axis = days from Jan 1
    ax.set_xlim(-2, total_days + 2)
    # Y: rows for category bands (0..5) + dots floating above
    # Rows: 0=野菜  1=魚介  2=花  3=果物  4=節気
    bands = [
        ("節気", 4.0),
        ("花",   3.0),
        ("野菜", 2.0),
        ("魚介", 1.0),
        ("果物", 0.0),
    ]
    ax.set_ylim(-1.2, 9.5)

    # Draw season bands (one wide bg per quarter, very pale)
    season_colors = {
        "冬": "#e2e6ea",
        "春": "#fbe6ec",
        "夏": "#eef2dc",
        "秋": "#f4e4d2",
    }
    season_ranges = {
        "冬": (_dt.date(year, 1, 1), _dt.date(year, 2, 28)),
        "春": (_dt.date(year, 3, 1), _dt.date(year, 5, 31)),
        "夏": (_dt.date(year, 6, 1), _dt.date(year, 8, 31)),
        "秋": (_dt.date(year, 9, 1), _dt.date(year, 11, 30)),
        "冬2": (_dt.date(year, 12, 1), _dt.date(year, 12, 31)),
    }
    for name, (s, e) in season_ranges.items():
        c = season_colors[name[0]] if name[0] in season_colors else "#eee"
        ax.axvspan(
            (s - year_start).days,
            (e - year_start).days + 1,
            alpha=0.55,
            facecolor=c,
            edgecolor="none",
            zorder=-2,
        )

    # Draw seasonal events as horizontal bars by category band
    for ev in events:
        s = max(ev.start, year_start)
        e = min(ev.end, year_end)
        if s > e:
            continue
        x = (s - year_start).days
        w = (e - s).days + 1
        # Locate the band row
        band_y = next((y for (cat, y) in bands if cat == ev.category), 0.0)
        rect = mpatches.FancyBboxPatch(
            (x, band_y - 0.32),
            w,
            0.6,
            boxstyle="round,pad=0,rounding_size=4",
            facecolor=ev.color,
            edgecolor="none",
            alpha=0.78,
            mutation_scale=2.5,
        )
        ax.add_patch(rect)
        # Event name on top, only if wide enough
        if w >= 14:
            ax.text(
                x + w / 2,
                band_y,
                ev.name,
                ha="center",
                va="center",
                fontsize=8.5,
                color=INK,
            )

    # Anime dots layered above (rows 5.5 .. 9)
    buckets = bucket_anime_by_month(anime_list, year)
    for m in range(1, 13):
        month_start = _dt.date(year, m, 1)
        for i, point in enumerate(buckets[m]):
            base_x = (month_start - year_start).days + 14  # mid-month
            offset_x = ((i % 5) - 2) * 3  # slight spread within month
            row = 5.5 + (i // 5) * 0.8
            ax.scatter(
                [base_x + offset_x],
                [row],
                s=110 + point.episodes_in_month * 22,
                c=genre_color(point.genre),
                alpha=0.85,
                edgecolors=INK_FAINT,
                linewidths=0.6,
                zorder=4,
            )

    # Month gridlines
    for m in range(1, 13):
        d = (_dt.date(year, m, 1) - year_start).days
        ax.axvline(x=d, color=RULE, linewidth=0.5, alpha=0.6, zorder=-1)
        ax.text(
            d + 14,
            9.2,
            f"{m:02d}  {month_label(m)}",
            ha="center",
            va="bottom",
            fontsize=11,
            color=INK_LIGHT,
            fontweight="bold",
        )

    # Category labels on the left
    for cat, y in bands:
        ax.text(-1, y, cat, ha="right", va="center", fontsize=10, color=INK_LIGHT)
    ax.text(-1, 6.5, "アニメ", ha="right", va="center", fontsize=10, color=INK_LIGHT, fontweight="bold")

    ax.set_xticks([])
    ax.set_yticks([])
    ax.set_title(
        f"{year}年  季 重ね 帖  —  アニメ × 季節 × 旬",
        fontsize=22,
        color=INK,
        fontweight="bold",
        pad=22,
    )

    # Legend (genres)
    handles = [
        mpatches.Patch(facecolor=col, edgecolor=INK_FAINT, label=g, linewidth=0.5)
        for g, col in [
            ("action", genre_color("action")),
            ("drama", genre_color("drama")),
            ("slice_of_life", genre_color("slice_of_life")),
            ("mystery", genre_color("mystery")),
            ("fantasy", genre_color("fantasy")),
            ("comedy", genre_color("comedy")),
            ("horror", genre_color("horror")),
        ]
    ]
    ax.legend(
        handles=handles,
        loc="lower center",
        ncol=7,
        bbox_to_anchor=(0.5, -0.18),
        frameon=False,
        fontsize=9,
    )

    return fig


def month_card_fig(
    anime_list: List[AnimeShow],
    events: List[SeasonalEvent],
    year: int,
    month: int,
) -> Figure:
    """1200x1200 Insta-style card for a single month."""
    _setup_japanese_font()
    fig = plt.figure(figsize=(12, 12), facecolor=PAPER)
    name = month_label(month)
    light = month_color(month, dark=False)
    dark = month_color(month, dark=True)

    # Header band
    head = fig.add_axes([0.06, 0.86, 0.88, 0.10])
    head.set_facecolor(light)
    head.set_xticks([])
    head.set_yticks([])
    for sp in head.spines.values():
        sp.set_visible(False)
    head.text(0.04, 0.55, f"{month:02d}", fontsize=80, color=dark, fontweight="bold", va="center")
    head.text(0.22, 0.62, name, fontsize=32, color=INK, va="center")
    head.text(0.22, 0.32, f"{year} 年", fontsize=14, color=INK_LIGHT, va="center")

    # Anime list area
    anime_ax = fig.add_axes([0.06, 0.50, 0.88, 0.34])
    anime_ax.set_facecolor(PAPER)
    anime_ax.set_xticks([])
    anime_ax.set_yticks([])
    for sp in anime_ax.spines.values():
        sp.set_visible(False)
    anime_ax.text(0.0, 1.0, "  ●この 月 の アニメ", fontsize=14, color=dark, fontweight="bold", va="top", transform=anime_ax.transAxes)

    buckets = bucket_anime_by_month(anime_list, year)
    points = buckets.get(month, [])[:6]  # max 6 titles for visual balance
    for i, p in enumerate(points):
        y = 0.85 - i * 0.13
        anime_ax.add_patch(
            mpatches.Circle(
                (0.04, y),
                0.025,
                facecolor=genre_color(p.genre),
                edgecolor=INK_FAINT,
                linewidth=0.6,
                transform=anime_ax.transAxes,
            )
        )
        anime_ax.text(0.10, y, p.title, fontsize=15, color=INK, va="center", transform=anime_ax.transAxes)
        anime_ax.text(0.92, y, f"{p.episodes_in_month}話", fontsize=11, color=INK_LIGHT, va="center", ha="right", transform=anime_ax.transAxes)
    if not points:
        anime_ax.text(0.5, 0.45, "(この 月 に 重なる 作品 は なし)", fontsize=12, color=INK_FAINT, ha="center", va="center", transform=anime_ax.transAxes)

    # Seasonal events area
    seas_ax = fig.add_axes([0.06, 0.10, 0.88, 0.36])
    seas_ax.set_facecolor(PAPER)
    seas_ax.set_xticks([])
    seas_ax.set_yticks([])
    for sp in seas_ax.spines.values():
        sp.set_visible(False)
    seas_ax.text(0.0, 1.0, "  ●この 月 の 旬 と 季節", fontsize=14, color=dark, fontweight="bold", va="top", transform=seas_ax.transAxes)

    in_month = events_active_in_month(events, year, month)
    # Sort by category for visual grouping
    cat_order = ["節気", "花", "野菜", "魚介", "果物"]
    in_month.sort(key=lambda e: (cat_order.index(e.category) if e.category in cat_order else 99, e.name))
    for i, ev in enumerate(in_month[:9]):
        y = 0.85 - i * 0.09
        seas_ax.add_patch(
            mpatches.Rectangle(
                (0.02, y - 0.03),
                0.04,
                0.06,
                facecolor=ev.color,
                edgecolor="none",
                transform=seas_ax.transAxes,
            )
        )
        seas_ax.text(0.08, y, ev.name, fontsize=14, color=INK, va="center", transform=seas_ax.transAxes)
        seas_ax.text(0.92, y, f"[{ev.category}]", fontsize=10, color=INK_FAINT, va="center", ha="right", transform=seas_ax.transAxes)

    fig.text(0.5, 0.04, "季 重ね 帖  —  kisanae-chou", ha="center", fontsize=10, color=INK_FAINT)
    return fig


def season_scroll_fig(
    anime_list: List[AnimeShow],
    events: List[SeasonalEvent],
    year: int,
) -> Figure:
    """Tall single Figure with 4 horizontal panels (春夏秋冬)."""
    _setup_japanese_font()
    fig = plt.figure(figsize=(12, 36), facecolor=PAPER)

    seasons = ["春", "夏", "秋", "冬"]
    panel_h = 1.0 / 4.0
    for idx, season in enumerate(seasons):
        ax = fig.add_axes([0.06, 1.0 - (idx + 1) * panel_h + 0.02, 0.88, panel_h - 0.04])
        _style_axes(ax)
        months = months_in_season(season)
        # X axis: 3 month "columns"
        ax.set_xlim(0, 3)
        ax.set_ylim(0, 10)

        # Title strip
        col = month_color(months[1], dark=True)
        ax.text(0.0, 9.5, f"{season}", fontsize=42, color=col, fontweight="bold", va="top")
        ax.text(0.42, 9.45, "  ".join(month_label(m) for m in months), fontsize=14, color=INK_LIGHT, va="top")

        # Monthly columns
        for col_i, m in enumerate(months):
            x0 = col_i + 0.05
            x_w = 0.9
            # Column background
            ax.add_patch(
                mpatches.Rectangle(
                    (col_i, 0),
                    1,
                    8,
                    facecolor=month_color(m),
                    alpha=0.55,
                    edgecolor="none",
                )
            )
            ax.text(col_i + 0.5, 7.5, f"{m:02d}  {month_label(m)}", ha="center", va="center", fontsize=11, color=INK, fontweight="bold")

            # Anime as stacked rows
            buckets = bucket_anime_by_month(anime_list, year)
            points = buckets.get(m, [])[:5]
            for i, p in enumerate(points):
                y = 6.5 - i * 0.7
                ax.add_patch(
                    mpatches.Circle(
                        (x0 + 0.06, y),
                        0.06,
                        facecolor=genre_color(p.genre),
                        edgecolor=INK_FAINT,
                        linewidth=0.5,
                    )
                )
                ax.text(x0 + 0.14, y, p.title[:8], fontsize=9, color=INK, va="center")

            # Seasonal events at the bottom
            in_m = events_active_in_month(events, year, m)[:4]
            for i, ev in enumerate(in_m):
                y = 2.5 - i * 0.55
                ax.add_patch(
                    mpatches.Rectangle(
                        (x0, y - 0.18),
                        0.16,
                        0.32,
                        facecolor=ev.color,
                        edgecolor="none",
                    )
                )
                ax.text(x0 + 0.20, y, ev.name, fontsize=9, color=INK_LIGHT, va="center")

        ax.set_xticks([])
        ax.set_yticks([])

    return fig


def palette_year_fig(year: int = 2026) -> Figure:
    """1200x400 horizontal palette strip showing the 12 monthly colors."""
    _setup_japanese_font()
    fig = plt.figure(figsize=(12, 4), facecolor=PAPER)
    ax = fig.add_axes([0.05, 0.20, 0.90, 0.65])
    ax.set_facecolor(PAPER)
    for sp in ax.spines.values():
        sp.set_visible(False)

    ax.set_xlim(0, 12)
    ax.set_ylim(0, 1)
    palette = year_palette()
    for i, (m, name, light) in enumerate(palette):
        ax.add_patch(
            mpatches.Rectangle((i + 0.05, 0.0), 0.9, 0.85, facecolor=light, edgecolor="none")
        )
        deep = month_color(m, dark=True)
        ax.text(i + 0.5, 0.5, f"{m:02d}", fontsize=24, color=deep, ha="center", va="center", fontweight="bold")
        ax.text(i + 0.5, 0.12, name, fontsize=11, color=INK_LIGHT, ha="center", va="center")
    ax.set_xticks([])
    ax.set_yticks([])
    ax.set_title(f"{year}年 月 別 パレット", fontsize=16, color=INK, pad=12)
    return fig


def save_fig(fig: Figure, path: str, dpi: int = 110) -> None:
    fig.savefig(path, dpi=dpi, facecolor=fig.get_facecolor(), bbox_inches="tight")
    plt.close(fig)
