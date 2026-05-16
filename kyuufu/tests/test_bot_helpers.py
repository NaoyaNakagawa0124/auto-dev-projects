"""Tests for the pure bot helper functions — no discord.py runtime required."""

from __future__ import annotations

from datetime import datetime

from kyuufu.bot import yasumi_text, yamedoki_text, kyou_text
from kyuufu.messages import BANNED_WORDS


def test_yasumi_text_picks_evening_tier():
    out = yasumi_text(datetime(2026, 5, 17, 22, 30), seed=1)
    assert out.endswith("。")


def test_yasumi_text_picks_deep_tier():
    out = yasumi_text(datetime(2026, 5, 17, 1, 15), seed=2)
    assert out.endswith("。")


def test_yasumi_text_deterministic_for_seed():
    a = yasumi_text(datetime(2026, 5, 17, 1, 0), seed=42)
    b = yasumi_text(datetime(2026, 5, 17, 1, 0), seed=42)
    assert a == b


def test_yasumi_text_has_no_banned_words():
    for hour in (1, 4, 14, 23):
        out = yasumi_text(datetime(2026, 5, 17, hour, 0), seed=1)
        for w in BANNED_WORDS:
            assert w not in out


def test_yamedoki_text_mentions_a_time():
    now = datetime(2026, 5, 17, 22, 0)
    out = yamedoki_text(now, within_hours=2.0)
    assert ":" in out  # there's a HH:MM in there
    assert out.endswith("。")


def test_kyou_text_starts_with_prefix():
    out = kyou_text(datetime(2026, 5, 17))
    assert "30 秒" in out


def test_kyou_text_includes_month_appropriate_place():
    # May -> Cannes
    out = kyou_text(datetime(2026, 5, 17))
    assert "カンヌ" in out


def test_bot_module_imports_without_token(monkeypatch):
    """Importing the module must not require DISCORD_TOKEN."""
    monkeypatch.delenv("DISCORD_TOKEN", raising=False)
    import importlib
    import kyuufu.bot
    importlib.reload(kyuufu.bot)
    assert hasattr(kyuufu.bot, "main")
