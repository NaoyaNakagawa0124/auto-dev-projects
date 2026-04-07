"""Tests for data models."""
import json
import tempfile
from pathlib import Path
from unittest.mock import patch

from tokineko.models import CatStats, GameState, save_game, load_game, SAVE_FILE


class TestCatStats:
    def test_default_values(self):
        stats = CatStats()
        assert stats.happiness == 70
        assert stats.energy == 80
        assert stats.curiosity == 60

    def test_clamp_upper(self):
        stats = CatStats(happiness=150, energy=200, curiosity=999)
        stats.clamp()
        assert stats.happiness == 100
        assert stats.energy == 100
        assert stats.curiosity == 100

    def test_clamp_lower(self):
        stats = CatStats(happiness=-10, energy=-50, curiosity=-1)
        stats.clamp()
        assert stats.happiness == 0
        assert stats.energy == 0
        assert stats.curiosity == 0

    def test_clamp_in_range(self):
        stats = CatStats(happiness=50, energy=50, curiosity=50)
        stats.clamp()
        assert stats.happiness == 50
        assert stats.energy == 50
        assert stats.curiosity == 50


class TestGameState:
    def test_default_state(self):
        state = GameState()
        assert state.cat_name == "ミケ"
        assert state.current_era_id == "prehistoric"
        assert state.pomodoro_count == 0
        assert state.visited_eras == []
        assert state.collected_items == []

    def test_to_dict(self):
        state = GameState(cat_name="タマ", pomodoro_count=5)
        d = state.to_dict()
        assert d["cat_name"] == "タマ"
        assert d["pomodoro_count"] == 5
        assert "stats" in d

    def test_from_dict(self):
        data = {
            "cat_name": "クロ",
            "stats": {"happiness": 90, "energy": 50, "curiosity": 80},
            "current_era_id": "egypt",
            "visited_eras": ["prehistoric", "egypt"],
            "collected_items": ["bone_flute"],
            "unlocked_achievements": ["first_pomodoro"],
            "pomodoro_count": 10,
            "total_work_seconds": 15000,
        }
        state = GameState.from_dict(data)
        assert state.cat_name == "クロ"
        assert state.stats.happiness == 90
        assert state.current_era_id == "egypt"
        assert len(state.visited_eras) == 2
        assert "bone_flute" in state.collected_items

    def test_from_dict_defaults(self):
        state = GameState.from_dict({})
        assert state.cat_name == "ミケ"
        assert state.current_era_id == "prehistoric"

    def test_roundtrip(self):
        state = GameState(cat_name="ハナ", pomodoro_count=42)
        state.visited_eras = ["prehistoric", "egypt", "medieval"]
        state.collected_items = ["scarab", "mouse_trophy"]
        d = state.to_dict()
        restored = GameState.from_dict(d)
        assert restored.cat_name == state.cat_name
        assert restored.pomodoro_count == state.pomodoro_count
        assert restored.visited_eras == state.visited_eras
        assert restored.collected_items == state.collected_items


class TestSaveLoad:
    def test_save_and_load(self, tmp_path):
        save_file = tmp_path / "save.json"
        save_dir = tmp_path

        with patch("tokineko.models.SAVE_FILE", save_file), \
             patch("tokineko.models.SAVE_DIR", save_dir):
            state = GameState(cat_name="テスト猫", pomodoro_count=7)
            save_game(state)
            assert save_file.exists()

            loaded = load_game()
            assert loaded is not None
            assert loaded.cat_name == "テスト猫"
            assert loaded.pomodoro_count == 7

    def test_load_no_file(self, tmp_path):
        save_file = tmp_path / "nonexistent.json"
        with patch("tokineko.models.SAVE_FILE", save_file):
            result = load_game()
            assert result is None

    def test_load_corrupt_file(self, tmp_path):
        save_file = tmp_path / "corrupt.json"
        save_file.write_text("not valid json {{{")
        with patch("tokineko.models.SAVE_FILE", save_file):
            result = load_game()
            assert result is None
