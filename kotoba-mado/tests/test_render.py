"""Renderer tests — assert structural facts on captured output."""

from datetime import date

from rich.console import Console

from kotoba_mado.models import Log, Session
from kotoba_mado.render import (
    render_month,
    render_streak,
    render_today,
    render_year,
)


def _capture(renderable) -> str:
    """Render a Rich renderable to a plain string (no color)."""
    console = Console(record=True, force_terminal=False, width=120, color_system=None)
    console.print(renderable)
    return console.export_text()


def _log_with(*items):
    log = Log()
    for d, cat, mins in items:
        log.add(Session(date=d, language="ja", category=cat, minutes=mins))
    return log


def test_render_year_has_title_and_legend():
    log = _log_with(("2026-05-17", "read", 30))
    out = _capture(render_year(log, 2026))
    assert "言 葉 の 窓" in out
    assert "2026" in out
    # Legend has all 6 categories
    for label in ("読む", "聴く", "話す", "書く", "単語", "文法"):
        assert label in out


def test_render_year_includes_month_labels():
    out = _capture(render_year(Log(), 2026))
    for m in ("1月", "6月", "12月"):
        assert m in out


def test_render_year_has_frame_lines():
    out = _capture(render_year(Log(), 2026))
    assert "┌" in out and "┐" in out
    assert "└" in out and "┘" in out


def test_render_year_shows_streak_at_year_end():
    log = _log_with(
        ("2026-12-29", "read", 10),
        ("2026-12-30", "read", 10),
        ("2026-12-31", "read", 10),
    )
    out = _capture(render_year(log, 2026))
    assert "連続 3 日" in out


def test_render_month_has_weekday_labels():
    out = _capture(render_month(Log(), 2026, 5))
    for w in ("月", "火", "水", "木", "金", "土", "日"):
        assert w in out
    assert "2026" in out and "5" in out


def test_render_month_shows_minutes_for_days_with_data():
    log = _log_with(("2026-05-17", "read", 42))
    out = _capture(render_month(log, 2026, 5))
    assert " 42" in out  # minutes shown


def test_render_month_shows_monthly_total():
    log = _log_with(("2026-05-17", "read", 10), ("2026-05-18", "listen", 25))
    out = _capture(render_month(log, 2026, 5))
    assert "この月の合計 35 分" in out


def test_render_today_empty_message():
    out = _capture(render_today(Log(), date(2026, 5, 17)))
    assert "まだ今日の窓は描かれていない" in out
    assert "kotoba-mado add" in out


def test_render_today_shows_categories_and_minutes():
    log = _log_with(
        ("2026-05-17", "read", 30),
        ("2026-05-17", "vocab", 15),
    )
    out = _capture(render_today(log, date(2026, 5, 17)))
    assert "45 分" in out
    assert "30 分" in out
    assert "15 分" in out
    assert "読む" in out
    assert "単語" in out


def test_render_streak_zero_shows_invitation():
    out = _capture(render_streak(Log(), date(2026, 5, 17)))
    assert "今日からの連続が" in out


def test_render_streak_shows_count_and_flame():
    log = _log_with(
        ("2026-05-15", "read", 10),
        ("2026-05-16", "listen", 10),
        ("2026-05-17", "vocab", 10),
    )
    out = _capture(render_streak(log, date(2026, 5, 17)))
    assert "連続" in out
    assert "3" in out
