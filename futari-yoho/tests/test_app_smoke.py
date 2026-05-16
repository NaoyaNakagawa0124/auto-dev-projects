"""Headless smoke tests using Textual's run_test() pilot."""

from datetime import date
from pathlib import Path

import pytest

from futari_yoho.app import FutariYohoApp
from futari_yoho.cli import _seed_demo
from futari_yoho.models import CheckIn, State
from futari_yoho.storage import load, save


pytestmark = pytest.mark.asyncio


async def test_app_boots_with_empty_state(tmp_path: Path):
    p = tmp_path / "data.json"
    app = FutariYohoApp(data_path=p)
    async with app.run_test() as pilot:
        await pilot.pause()
        for wid in ("#today-a", "#today-b", "#couple", "#sky", "#month"):
            assert app.query_one(wid) is not None


async def test_app_renders_demo_data(tmp_path: Path):
    p = tmp_path / "data.json"
    save(_seed_demo(load(p)), p)
    app = FutariYohoApp(data_path=p)
    async with app.run_test() as pilot:
        await pilot.pause()
        sky = app.query_one("#sky")
        assert sky is not None


async def test_checkin_open_and_cancel_does_not_persist(tmp_path: Path):
    p = tmp_path / "data.json"
    app = FutariYohoApp(data_path=p)
    async with app.run_test() as pilot:
        await pilot.pause()
        await pilot.press("c")        # open check-in
        await pilot.pause()
        await pilot.press("escape")    # cancel
        await pilot.pause()
        # Today should still have no check-in for "a"
        today = app.state.day(date.today())
        assert today.a is None


async def test_checkin_complete_flow_records_state(tmp_path: Path):
    p = tmp_path / "data.json"
    app = FutariYohoApp(data_path=p)
    async with app.run_test() as pilot:
        await pilot.pause()
        await pilot.press("c")           # open check-in for "a"
        await pilot.pause()
        # mood: default 3 → enter
        await pilot.press("enter")
        await pilot.pause()
        # energy: default 3 → enter
        await pilot.press("enter")
        await pilot.pause()
        # solo: default 3 → enter
        await pilot.press("enter")
        await pilot.pause()
        # note step: skip typing, just enter
        await pilot.press("enter")
        await pilot.pause()
        # Persisted!
        today = app.state.day(date.today())
        assert today.a is not None
        assert today.a.mood == 3
        assert today.a.energy == 3
        assert today.a.solo_want == 3
        # And was saved to disk
        s2 = load(p)
        assert s2.day(date.today()).a is not None


async def test_checkin_uses_number_keys(tmp_path: Path):
    p = tmp_path / "data.json"
    app = FutariYohoApp(data_path=p)
    async with app.run_test() as pilot:
        await pilot.pause()
        await pilot.press("c")
        await pilot.pause()
        # mood = 5
        await pilot.press("5")
        await pilot.press("enter")
        await pilot.pause()
        # energy = 4
        await pilot.press("4")
        await pilot.press("enter")
        await pilot.pause()
        # solo = 2
        await pilot.press("2")
        await pilot.press("enter")
        await pilot.pause()
        # note (skip)
        await pilot.press("enter")
        await pilot.pause()

        today = app.state.day(date.today())
        assert today.a is not None
        assert today.a.mood == 5
        assert today.a.energy == 4
        assert today.a.solo_want == 2


async def test_quit_exits_cleanly(tmp_path: Path):
    p = tmp_path / "data.json"
    app = FutariYohoApp(data_path=p)
    async with app.run_test() as pilot:
        await pilot.pause()
        await pilot.press("q")
        await pilot.pause()
    # If we got here, the app exited without exception.
    assert True


async def test_refresh_picks_up_external_save(tmp_path: Path):
    p = tmp_path / "data.json"
    app = FutariYohoApp(data_path=p)
    async with app.run_test() as pilot:
        await pilot.pause()
        # Write a check-in directly to disk (as if the other partner used another terminal)
        s = State()
        s.record("b", date.today(), CheckIn(mood=5, energy=4, solo_want=2, note="ok"))
        save(s, p)
        await pilot.press("r")
        await pilot.pause()
        assert app.state.day(date.today()).b is not None
        assert app.state.day(date.today()).b.mood == 5
