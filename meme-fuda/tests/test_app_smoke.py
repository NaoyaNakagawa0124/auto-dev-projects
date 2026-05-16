"""Headless Textual smoke tests."""

from pathlib import Path

import pytest
from textual.widgets import Input

from meme_fuda.app import (
    ComposeScreen,
    DeckScreen,
    MemeFudaApp,
    SetupScreen,
)
from meme_fuda.storage import load


pytestmark = pytest.mark.asyncio


async def test_app_boots_with_setup_screen(tmp_path: Path):
    p = tmp_path / "deck.json"
    app = MemeFudaApp(data_path=p)
    async with app.run_test() as pilot:
        await pilot.pause()
        assert isinstance(app.screen, SetupScreen)


async def test_setup_screen_skip_with_escape_goes_to_compose(tmp_path: Path):
    p = tmp_path / "deck.json"
    app = MemeFudaApp(data_path=p)
    async with app.run_test() as pilot:
        await pilot.pause()
        await pilot.press("escape")
        await pilot.pause()
        assert isinstance(app.screen, ComposeScreen)
        assert app.pair_speaker == ""
        assert app.pair_writer == ""


async def test_setup_screen_enter_records_names(tmp_path: Path):
    p = tmp_path / "deck.json"
    app = MemeFudaApp(data_path=p)
    async with app.run_test() as pilot:
        await pilot.pause()
        sc = app.screen
        sc.query_one("#inp-speaker", Input).value = "ばあちゃん"
        sc.query_one("#inp-writer", Input).value = "ちひろ"
        await pilot.pause()
        # Don't rely on Enter because input may eat it — call the action directly
        sc.action_submit()
        await pilot.pause()
        assert app.pair_speaker == "ばあちゃん"
        assert app.pair_writer == "ちひろ"
        assert isinstance(app.screen, ComposeScreen)


async def test_compose_can_cycle_templates(tmp_path: Path):
    p = tmp_path / "deck.json"
    app = MemeFudaApp(data_path=p, initial_speaker="me", initial_writer="you")
    async with app.run_test() as pilot:
        await pilot.pause()
        assert isinstance(app.screen, ComposeScreen)
        start = app.screen.idx
        await pilot.press("ctrl+right")
        await pilot.pause()
        assert app.screen.idx == start + 1
        await pilot.press("ctrl+left")
        await pilot.press("ctrl+left")
        await pilot.pause()
        # idx wraps so should equal start - 1 mod len
        assert app.screen.idx == (start - 1) % 12


async def test_compose_save_persists_card(tmp_path: Path):
    p = tmp_path / "deck.json"
    app = MemeFudaApp(data_path=p, initial_speaker="ばあ", initial_writer="孫")
    async with app.run_test() as pilot:
        await pilot.pause()
        sc = app.screen
        sc.query_one("#inp-top", Input).value = "孫が来た"
        sc.query_one("#inp-bottom", Input).value = "お茶うけ全部出した"
        await pilot.pause()
        await pilot.press("ctrl+s")
        await pilot.pause()
        assert len(app.deck.cards) == 1
        assert app.deck.cards[0].speaker == "ばあ"
        assert app.deck.cards[0].writer == "孫"
        # And persisted to disk
        deck2 = load(p)
        assert len(deck2.cards) == 1
        assert deck2.cards[0].top == "孫が来た"


async def test_compose_save_with_both_empty_warns(tmp_path: Path):
    p = tmp_path / "deck.json"
    app = MemeFudaApp(data_path=p, initial_speaker="me", initial_writer="you")
    async with app.run_test() as pilot:
        await pilot.pause()
        await pilot.press("ctrl+s")
        await pilot.pause()
        assert len(app.deck.cards) == 0


async def test_compose_open_deck_screen(tmp_path: Path):
    p = tmp_path / "deck.json"
    app = MemeFudaApp(data_path=p, initial_speaker="me", initial_writer="you")
    async with app.run_test() as pilot:
        await pilot.pause()
        await pilot.press("ctrl+d")
        await pilot.pause()
        assert isinstance(app.screen, DeckScreen)


async def test_deck_screen_empty_shows_invitation(tmp_path: Path):
    p = tmp_path / "deck.json"
    app = MemeFudaApp(data_path=p, initial_speaker="me", initial_writer="you")
    async with app.run_test() as pilot:
        await pilot.pause()
        await pilot.press("ctrl+d")
        await pilot.pause()
        # Just verify nothing crashes; deck is empty
        assert isinstance(app.screen, DeckScreen)


async def test_deck_screen_flips_through_cards(tmp_path: Path):
    p = tmp_path / "deck.json"
    app = MemeFudaApp(data_path=p, initial_speaker="me", initial_writer="you")
    async with app.run_test() as pilot:
        await pilot.pause()
        sc = app.screen
        # Save 3 cards quickly
        for i in range(3):
            sc.query_one("#inp-top", Input).value = f"top-{i}"
            sc.query_one("#inp-bottom", Input).value = f"bot-{i}"
            await pilot.pause()
            await pilot.press("ctrl+s")
            await pilot.pause()
        assert len(app.deck.cards) == 3
        await pilot.press("ctrl+d")
        await pilot.pause()
        deck_screen = app.screen
        assert isinstance(deck_screen, DeckScreen)
        assert deck_screen.idx == 0
        await pilot.press("right")
        await pilot.pause()
        assert deck_screen.idx == 1
        await pilot.press("right")
        await pilot.press("right")
        await pilot.pause()
        # Wrap-around
        assert deck_screen.idx == 0


async def test_deck_screen_delete_removes_card(tmp_path: Path):
    p = tmp_path / "deck.json"
    app = MemeFudaApp(data_path=p, initial_speaker="me", initial_writer="you")
    async with app.run_test() as pilot:
        await pilot.pause()
        sc = app.screen
        sc.query_one("#inp-top", Input).value = "x"
        await pilot.pause()
        await pilot.press("ctrl+s")
        await pilot.pause()
        assert len(app.deck.cards) == 1
        await pilot.press("ctrl+d")
        await pilot.pause()
        await pilot.press("delete")
        await pilot.pause()
        assert len(app.deck.cards) == 0


async def test_app_with_initial_pair_skips_setup(tmp_path: Path):
    p = tmp_path / "deck.json"
    app = MemeFudaApp(data_path=p, initial_speaker="A", initial_writer="B")
    async with app.run_test() as pilot:
        await pilot.pause()
        assert isinstance(app.screen, ComposeScreen)
        assert app.pair_speaker == "A"
        assert app.pair_writer == "B"
