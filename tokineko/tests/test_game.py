"""Tests for game logic."""
import tempfile
from pathlib import Path
from unittest.mock import patch

from tokineko.game import Game
from tokineko.models import GameState, SAVE_DIR, SAVE_FILE


def make_game(tmp_path):
    """Create a game instance with temporary save location."""
    save_file = tmp_path / "save.json"
    save_dir = tmp_path
    with patch("tokineko.models.SAVE_FILE", save_file), \
         patch("tokineko.models.SAVE_DIR", save_dir), \
         patch("tokineko.game.load_game", return_value=None), \
         patch("tokineko.game.save_game"):
        game = Game()
    # Patch save for subsequent calls
    game.save = lambda: None
    return game


class TestGameInit:
    def test_initial_era(self, tmp_path):
        game = make_game(tmp_path)
        assert game.state.current_era_id == "prehistoric"

    def test_initial_visited(self, tmp_path):
        game = make_game(tmp_path)
        assert "prehistoric" in game.state.visited_eras

    def test_current_era(self, tmp_path):
        game = make_game(tmp_path)
        assert game.current_era.name == "先史時代"


class TestCatInteractions:
    def test_pet_increases_happiness(self, tmp_path):
        game = make_game(tmp_path)
        initial = game.state.stats.happiness
        game.pet_cat()
        assert game.state.stats.happiness > initial

    def test_pet_returns_message(self, tmp_path):
        game = make_game(tmp_path)
        msg = game.pet_cat()
        assert isinstance(msg, str)
        assert len(msg) > 0

    def test_play_increases_happiness(self, tmp_path):
        game = make_game(tmp_path)
        initial = game.state.stats.happiness
        game.play_with_cat()
        assert game.state.stats.happiness > initial

    def test_play_decreases_energy(self, tmp_path):
        game = make_game(tmp_path)
        initial = game.state.stats.energy
        game.play_with_cat()
        assert game.state.stats.energy < initial

    def test_play_message_era_specific(self, tmp_path):
        game = make_game(tmp_path)
        msg = game.play_with_cat()
        assert "石器" in msg  # prehistoric era reference

    def test_treat_increases_energy(self, tmp_path):
        game = make_game(tmp_path)
        game.state.stats.energy = 50
        game.give_treat()
        assert game.state.stats.energy > 50

    def test_treat_returns_message(self, tmp_path):
        game = make_game(tmp_path)
        msg = game.give_treat()
        assert isinstance(msg, str)

    def test_stats_clamp_on_pet(self, tmp_path):
        game = make_game(tmp_path)
        game.state.stats.happiness = 99
        game.pet_cat()
        assert game.state.stats.happiness <= 100

    def test_stats_clamp_on_play(self, tmp_path):
        game = make_game(tmp_path)
        game.state.stats.energy = 3
        game.play_with_cat()
        assert game.state.stats.energy >= 0


class TestPomodoro:
    def test_complete_increments_count(self, tmp_path):
        game = make_game(tmp_path)
        game.complete_pomodoro()
        assert game.state.pomodoro_count == 1

    def test_complete_adds_work_time(self, tmp_path):
        game = make_game(tmp_path)
        game.complete_pomodoro()
        assert game.state.total_work_seconds == 25 * 60

    def test_time_travel_every_3(self, tmp_path):
        game = make_game(tmp_path)
        # Complete 3 pomodoros
        game.complete_pomodoro()  # 1
        game.complete_pomodoro()  # 2
        result = game.complete_pomodoro()  # 3 -> should travel
        assert result["time_traveled"] is True
        assert game.state.current_era_id == "egypt"

    def test_no_travel_before_3(self, tmp_path):
        game = make_game(tmp_path)
        result = game.complete_pomodoro()  # 1
        assert result["time_traveled"] is False
        result = game.complete_pomodoro()  # 2
        assert result["time_traveled"] is False

    def test_visited_eras_tracked(self, tmp_path):
        game = make_game(tmp_path)
        for _ in range(3):
            game.complete_pomodoro()
        assert "egypt" in game.state.visited_eras

    def test_curiosity_increases(self, tmp_path):
        game = make_game(tmp_path)
        initial = game.state.stats.curiosity
        game.complete_pomodoro()
        assert game.state.stats.curiosity > initial

    def test_result_structure(self, tmp_path):
        game = make_game(tmp_path)
        result = game.complete_pomodoro()
        assert "pomodoro_count" in result
        assert "item_found" in result
        assert "time_traveled" in result
        assert "new_era" in result
        assert "achievements" in result

    def test_first_pomodoro_achievement(self, tmp_path):
        game = make_game(tmp_path)
        result = game.complete_pomodoro()
        ach_ids = [a["id"] for a in result["achievements"]]
        assert "first_pomodoro" in ach_ids


class TestTimeTravel:
    def test_travel_to_visited(self, tmp_path):
        game = make_game(tmp_path)
        game.state.visited_eras = ["prehistoric", "egypt"]
        assert game.travel_to_era("egypt") is True
        assert game.state.current_era_id == "egypt"

    def test_travel_to_unvisited(self, tmp_path):
        game = make_game(tmp_path)
        assert game.travel_to_era("future") is False

    def test_travel_preserves_era(self, tmp_path):
        game = make_game(tmp_path)
        game.state.visited_eras = ["prehistoric", "egypt"]
        game.travel_to_era("egypt")
        assert game.current_era.name == "古代エジプト"


class TestCollection:
    def test_collection_stats_initial(self, tmp_path):
        game = make_game(tmp_path)
        stats = game.get_collection_stats()
        assert stats["total"] == 27
        assert stats["collected"] == 0
        assert stats["percentage"] == 0

    def test_collection_stats_with_items(self, tmp_path):
        game = make_game(tmp_path)
        game.state.collected_items = ["bone_flute", "scarab", "amber_bug"]
        stats = game.get_collection_stats()
        assert stats["collected"] == 3
        assert stats["by_rarity"]["common"] == 2  # bone_flute + scarab
        assert stats["by_rarity"]["rare"] == 0
        assert stats["by_rarity"]["legendary"] == 1  # amber_bug

    def test_all_items_with_status(self, tmp_path):
        game = make_game(tmp_path)
        game.state.collected_items = ["bone_flute"]
        items = game.get_all_items_with_status()
        assert len(items) == 27
        collected_items = [i for i in items if i["collected"]]
        assert len(collected_items) == 1


class TestCatRename:
    def test_rename(self, tmp_path):
        game = make_game(tmp_path)
        game.rename_cat("タマ")
        assert game.state.cat_name == "タマ"

    def test_rename_truncates(self, tmp_path):
        game = make_game(tmp_path)
        game.rename_cat("あ" * 30)
        assert len(game.state.cat_name) <= 20

    def test_rename_strips(self, tmp_path):
        game = make_game(tmp_path)
        game.rename_cat("  タマ  ")
        assert game.state.cat_name == "タマ"


class TestDecay:
    def test_happiness_decays(self, tmp_path):
        game = make_game(tmp_path)
        game.state.stats.happiness = 50
        game.decay_stats()
        assert game.state.stats.happiness == 49

    def test_energy_recovers(self, tmp_path):
        game = make_game(tmp_path)
        game.state.stats.energy = 50
        game.decay_stats()
        assert game.state.stats.energy == 51

    def test_decay_respects_bounds(self, tmp_path):
        game = make_game(tmp_path)
        game.state.stats.happiness = 0
        game.state.stats.energy = 100
        game.decay_stats()
        assert game.state.stats.happiness == 0
        assert game.state.stats.energy == 100
