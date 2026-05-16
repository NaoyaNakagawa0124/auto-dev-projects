"""Renderers — pure-ish functions that return Rich renderables / text.

The output is intentionally a *picture*. Every choice (color, spacing,
header art) is in service of the 美しさで殴る intent — screenshot-worthy.
"""

from __future__ import annotations

from calendar import monthrange
from datetime import date, timedelta

from rich.console import Group
from rich.panel import Panel
from rich.text import Text

from .aggregate import (
    DaySummary,
    day_summary,
    intensity_bucket,
    streak,
    total_by_category,
    total_minutes,
    year_summaries,
)
from .categories import BY_KEY, CATEGORIES, CATEGORY_KEYS
from .models import Log


# Background tones for the stained-glass leading
LEADING = "#0e1620"
DIM_FRAME = "#5a6470"
EMPTY_FG = "#3a4250"  # subtle for empty cells


# Per-category palette: per intensity bucket → hex color (darker→lighter)
# Bucket 0 = empty (handled separately), 1..5 = light → bold
def _shade(hex_color: str, bucket: int) -> str:
    """Lighten a color by mixing toward warm white based on bucket (1..5)."""
    base = hex_color.lstrip("#")
    r, g, b = int(base[0:2], 16), int(base[2:4], 16), int(base[4:6], 16)
    # Mix toward warm cream #f0e6c8 — higher bucket = closer to base, lower = closer to cream
    target = (240, 230, 200)
    # bucket 5 = pure base, bucket 1 = 70% cream + 30% base
    weight = 0.18 + (bucket - 1) * 0.18  # 0.18, 0.36, 0.54, 0.72, 0.90
    weight = max(0.0, min(1.0, weight))
    nr = int(target[0] * (1 - weight) + r * weight)
    ng = int(target[1] * (1 - weight) + g * weight)
    nb = int(target[2] * (1 - weight) + b * weight)
    return f"#{nr:02x}{ng:02x}{nb:02x}"


def _cell_glyph(summary: DaySummary) -> str:
    """A 2-wide cell glyph chosen by dominant category and intensity bucket."""
    if summary.empty or summary.dominant is None:
        return "──"
    bucket = intensity_bucket(summary.minutes)
    # Intensity → glyph weight
    weights = {1: "░░", 2: "▒▒", 3: "▓▓", 4: "██", 5: "██"}
    return weights.get(bucket, "██")


def _cell_text(summary: DaySummary) -> Text:
    """Render a single day cell as a Rich Text (2 visible chars)."""
    if summary.empty or summary.dominant is None:
        return Text("──", style=EMPTY_FG)
    bucket = intensity_bucket(summary.minutes)
    cat = BY_KEY[summary.dominant]
    fg = _shade(cat.color, bucket)
    glyph = _cell_glyph(summary)
    # Two-tone for mixed days: if second-largest category has > 25% of minutes,
    # color each cell-half differently.
    sorted_cats = sorted(summary.by_category.items(), key=lambda kv: kv[1], reverse=True)
    if len(sorted_cats) >= 2 and sorted_cats[1][1] > 0 and sorted_cats[1][1] / max(summary.minutes, 1) >= 0.25:
        second_cat = BY_KEY[sorted_cats[1][0]]
        fg2 = _shade(second_cat.color, max(1, bucket - 1))
        t = Text()
        t.append("▌", style=fg)
        t.append("▐", style=fg2)
        return t
    return Text(glyph, style=fg)


# ---- Year (the centerpiece) -------------------------------------------------


JAPANESE_MONTHS = ("1月", "2月", "3月", "4月", "5月", "6月",
                   "7月", "8月", "9月", "10月", "11月", "12月")


def render_year(log: Log, year: int) -> Group:
    """Render the full 12-month × up-to-31-day stained-glass mosaic."""
    summaries = year_summaries(log, year)

    # Header (大きな鳥居のようなタイトル)
    header = Text()
    header.append("\n")
    header.append("      言 葉 の 窓\n", style="bold #e8d6b3")
    header.append(f"  〜  {year} 年の語学旅  〜\n", style="dim #c8b4d6")

    # Top month labels — each month label occupies exactly 4 visual columns
    # to align with the cells below. 1月..9月 are 3 visual columns (1+月=1+2),
    # so we pad with a trailing space. 10月..12月 are 4 visual columns.
    month_label = Text("      ")  # 6 char left margin for day number column
    for m in range(1, 13):
        name = JAPANESE_MONTHS[m - 1]
        # Bar position + 1 space padding accounted for by the frame, so just
        # emit a 5-char label per column (1 leading space + 4 label cols).
        if m < 10:
            month_label.append(f"  {name} ", style="#c8b4d6")  # 2sp + 1月 + 1sp = 6 vis
        else:
            month_label.append(f" {name} ", style="#c8b4d6")  # 1sp + 10月 + 1sp = 6 vis
    month_label.append("\n")

    # Top frame line
    top = Text("      ┌")
    top.append("┬".join(["────"] * 12))
    top.append("┐\n", style=DIM_FRAME)
    top.style = DIM_FRAME

    rows = Text()
    for day in range(1, 32):
        # Day number column (right-aligned, dim)
        rows.append(f"  {day:2d}  ", style="#5a6470")
        rows.append("│", style=DIM_FRAME)
        for m in range(1, 13):
            try:
                d = date(year, m, day)
                key = d.isoformat()
                summ = summaries.get(key)
                if summ is None:
                    summ = DaySummary(date_iso=key, minutes=0, by_category={}, dominant=None, sessions=0)
                # cell: 1 space pad, glyph (2 char), 1 space pad — total 4
                rows.append(" ")
                rows.append(_cell_text(summ))
                rows.append(" ")
            except ValueError:
                # day doesn't exist in this month (e.g. Feb 30)
                rows.append(" ── ", style=EMPTY_FG)
            rows.append("│", style=DIM_FRAME)
        rows.append("\n")

    # Bottom frame
    bottom = Text("      └")
    bottom.append("┴".join(["────"] * 12))
    bottom.append("┘\n", style=DIM_FRAME)
    bottom.style = DIM_FRAME

    # Footer: totals + legend
    minutes = total_minutes(log)
    by_cat = total_by_category(log)
    hours = minutes // 60
    rem = minutes % 60
    totals = Text()
    totals.append(f"\n  累計 {hours} 時間 {rem} 分", style="bold #e8d6b3")
    totals.append(f"  ／  {len(log.sessions)} セッション", style="#c8b4d6")
    totals.append(f"  ／  連続 {streak(log, date(year, 12, 31))} 日\n", style="#d49a3f")

    legend = Text("\n")
    for c in CATEGORIES:
        legend.append(f"  {c.glyph * 2}", style=_shade(c.color, 5))
        legend.append(f" {c.label}", style=c.color)
        legend.append(f" ({by_cat.get(c.key, 0)}分)  ", style="dim #c8b4d6")
    legend.append("\n")

    return Group(header, month_label, top, rows, bottom, totals, legend)


# ---- Month --------------------------------------------------------------------


def render_month(log: Log, year: int, month: int) -> Group:
    """Bigger calendar view of a single month with day numbers and minute totals."""
    summaries = year_summaries(log, year)

    header = Text()
    header.append("\n")
    header.append(f"  {year} 年 {month} 月  ", style="bold #e8d6b3")
    header.append("〜 ひと月の窓 〜\n", style="dim #c8b4d6")

    weekday_labels = Text("    ")
    for w in ("月", "火", "水", "木", "金", "土", "日"):
        weekday_labels.append(f"  {w}    ", style="#c8b4d6")
    weekday_labels.append("\n")

    first = date(year, month, 1)
    _, last_day = monthrange(year, month)
    last = date(year, month, last_day)

    # Build calendar grid (Mon=0 .. Sun=6)
    start_weekday = first.weekday()
    cells: list[date | None] = [None] * start_weekday
    d = first
    while d <= last:
        cells.append(d)
        d += timedelta(days=1)
    while len(cells) % 7 != 0:
        cells.append(None)

    rows = Text()
    for i in range(0, len(cells), 7):
        # Day-number row
        rows.append("    ")
        for c in cells[i:i+7]:
            if c is None:
                rows.append("       ", style=EMPTY_FG)
            else:
                rows.append(f"  {c.day:2d}   ", style="dim #c8b4d6")
        rows.append("\n")
        # Cell row (glyph + minutes)
        rows.append("    ")
        for c in cells[i:i+7]:
            if c is None:
                rows.append("       ", style=EMPTY_FG)
            else:
                summ = summaries.get(c.isoformat(),
                                     DaySummary(c.isoformat(), 0, {}, None, 0))
                rows.append("  ")
                rows.append(_cell_text(summ))
                m = summ.minutes
                if m > 0:
                    rows.append(f" {m:3d}", style="dim #d49a3f")
                else:
                    rows.append("    ", style=EMPTY_FG)
        rows.append("\n\n")

    # Month total
    month_total = sum(
        summaries.get(date(year, month, d).isoformat(),
                       DaySummary("", 0, {}, None, 0)).minutes
        for d in range(1, last_day + 1)
    )
    footer = Text()
    footer.append(f"\n  この月の合計 {month_total} 分", style="bold #d49a3f")
    footer.append(f"  ({month_total // 60} 時間 {month_total % 60} 分)\n", style="#c8b4d6")

    return Group(header, weekday_labels, rows, footer)


# ---- Today close-up -----------------------------------------------------------


def render_today(log: Log, target: date) -> Panel:
    summ = day_summary(log, target)
    inner = Text()
    inner.append(f"  {target.isoformat()}  ", style="bold #e8d6b3")
    inner.append(_japanese_weekday(target), style="dim #c8b4d6")
    inner.append("\n\n")

    if summ.empty:
        inner.append("  まだ今日の窓は描かれていない\n", style="dim #5a6470")
        inner.append("  `kotoba-mado add` で記録すると、ここに色が灯る\n",
                     style="dim #5a6470")
    else:
        # big cell
        cat_key = summ.dominant or "read"
        cat = BY_KEY[cat_key]
        bucket = intensity_bucket(summ.minutes)
        shade = _shade(cat.color, bucket)
        big_cell = Text()
        big_cell.append("  ████████  \n", style=shade)
        big_cell.append("  ████████  \n", style=shade)
        big_cell.append("  ████████  \n", style=shade)
        inner.append(big_cell)
        inner.append("\n")
        inner.append(f"  合計 {summ.minutes} 分", style="bold #d49a3f")
        inner.append(f"   ／ {summ.sessions} セッション\n", style="#c8b4d6")
        inner.append("\n")
        for key in CATEGORY_KEYS:
            m = summ.by_category.get(key, 0)
            if m == 0:
                continue
            c = BY_KEY[key]
            inner.append("    ")
            inner.append(c.glyph * 2, style=_shade(c.color, max(1, intensity_bucket(m))))
            inner.append(f"  {c.label}", style=c.color)
            inner.append(f"   {m} 分\n", style="dim #c8b4d6")

    return Panel(
        inner,
        title=Text("今日の窓", style="bold #e8d6b3"),
        border_style=DIM_FRAME,
        padding=(1, 2),
    )


_WEEKDAY_JA = ("月", "火", "水", "木", "金", "土", "日")


def _japanese_weekday(d: date) -> str:
    return f"({_WEEKDAY_JA[d.weekday()]})"


# ---- Streak -------------------------------------------------------------------


def render_streak(log: Log, today: date | None = None) -> Group:
    today = today or date.today()
    s = streak(log, today)
    art = Text()
    if s == 0:
        art.append("\n   ·  ·  ·\n", style="dim #5a6470")
        art.append("\n   今日からの連続が、明日の窓を灯す\n", style="dim #c8b4d6")
        return Group(art)

    # Flame ASCII size by streak (1..7 small, 8..30 medium, 31+ large)
    if s < 8:
        size = "small"
    elif s < 31:
        size = "medium"
    else:
        size = "large"

    art.append("\n")
    if size == "small":
        lines = ("       )", "      ((", "      ))", "  ┌─────────┐")
    elif size == "medium":
        lines = ("        ))      ", "       )((      ", "      )()(      ",
                 "     )((()(     ", "    )()()((     ", "  ┌───────────┐ ")
    else:
        lines = ("         )))         ", "        ))(((        ",
                 "       )(())(        ", "      )(()()()       ",
                 "     )(()()()((      ", "    )()()(((()()(    ",
                 "   )(()()((()()()(   ", "  ┌─────────────────┐")
    glow = ("#a8453c", "#c66640", "#d49a3f", "#d4b148", "#e8d6b3", "#f5e6b8", "#fff4c8", "#fff8d8")
    # Drop the last "frame" line in `lines` — we'll draw a proper symmetric box below.
    for i, line in enumerate(lines[:-1]):
        color = glow[i % len(glow)]
        art.append(f"  {line}\n", style=color)
    # Build a label like " 連続  35 日 " — visual width = 1 + 4 + 1 + 3 + 1 + 2 + 1 = 13
    label = f" 連続 {s:3d} 日 "
    inner_width = 4 + 1 + 3 + 1 + 2 + 2  # = 13 visual cols inside │ │
    bar = "─" * inner_width
    art.append(f"  ┌{bar}┐\n", style=DIM_FRAME)
    art.append(f"  │{label}│\n", style="bold #e8d6b3")
    art.append(f"  └{bar}┘\n", style=DIM_FRAME)
    art.append("\n   ")
    art.append(f"最後の記録: {today.isoformat()}", style="dim #c8b4d6")
    art.append("\n")
    return Group(art)
