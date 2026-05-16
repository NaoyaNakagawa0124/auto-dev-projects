"""Headless smoke test — drive the Textual app via its test pilot.

This catches the `_render` shadowing bug if it returns: a shadowed _render
makes the screen render as None and surfaces as `'NoneType' object has no
attribute 'render_strips'` at frame time.
"""

from __future__ import annotations

import pytest

from sekai_wadaichou.app import WadaichouApp
from sekai_wadaichou.dossier import Dossier


@pytest.mark.asyncio
async def test_app_boots_and_renders(tmp_path):
    dossier = Dossier(path=tmp_path / "dossier.json", entries=[])
    app = WadaichouApp(dossier=dossier)
    async with app.run_test() as pilot:
        await pilot.pause()
        # Spotlight should be set on first paint.
        screen = app.screen
        spotlight = screen.query_one("#spotlight-name").renderable
        assert "●" in str(spotlight)


@pytest.mark.asyncio
async def test_arrow_keys_rotate_globe(tmp_path):
    dossier = Dossier(path=tmp_path / "dossier.json", entries=[])
    app = WadaichouApp(dossier=dossier)
    async with app.run_test() as pilot:
        await pilot.pause()
        screen = app.screen
        before = str(screen.query_one("#spotlight-name").renderable)
        # Two right-arrows == 60 degrees east, should change the spotlight.
        await pilot.press("right")
        await pilot.press("right")
        await pilot.pause()
        after = str(screen.query_one("#spotlight-name").renderable)
        assert before != after


@pytest.mark.asyncio
async def test_collect_writes_to_dossier(tmp_path):
    path = tmp_path / "dossier.json"
    dossier = Dossier(path=path, entries=[])
    app = WadaichouApp(dossier=dossier)
    async with app.run_test() as pilot:
        await pilot.pause()
        await pilot.press("enter")
        await pilot.pause()
        assert path.exists()
        reloaded = Dossier.load(path)
        assert len(reloaded.entries) == 1
