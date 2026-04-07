"""Core game logic for tokineko."""
from __future__ import annotations

import random
import time

from .models import GameState, CatStats, save_game, load_game
from .eras import (
    build_eras, build_achievements, get_era_by_id,
    get_next_era_id, get_era_index, ERA_ORDER, Era, Item,
)


class Game:
    """Main game controller."""

    def __init__(self):
        self.eras = build_eras()
        self.achievement_defs = build_achievements()
        self.state = load_game() or GameState()
        self.pet_count = 0
        self.play_count = 0
        self.treat_count = 0
        if self.state.current_era_id not in self.state.visited_eras:
            self.state.visited_eras.append(self.state.current_era_id)

    @property
    def current_era(self) -> Era:
        era = get_era_by_id(self.eras, self.state.current_era_id)
        if era is None:
            era = self.eras[0]
        return era

    @property
    def era_progress(self) -> tuple[int, int]:
        idx = get_era_index(self.state.current_era_id)
        return idx + 1, len(ERA_ORDER)

    def pet_cat(self) -> str:
        """Pet the cat. Returns a reaction message."""
        self.pet_count += 1
        self.state.stats.happiness = min(100, self.state.stats.happiness + 5)
        self.state.stats.energy = max(0, self.state.stats.energy - 2)
        self.state.stats.clamp()
        self.save()
        reactions = [
            "ゴロゴロ... 猫が気持ちよさそうに目を細めた",
            "にゃ〜ん♪ 喉を鳴らしている",
            "ごろん。お腹を見せてきた",
            "すりすり... 頭を擦り寄せてきた",
            "ぷるるる... 幸せそうな声を出している",
        ]
        return random.choice(reactions)

    def play_with_cat(self) -> str:
        """Play with the cat. Returns a reaction message."""
        self.play_count += 1
        self.state.stats.happiness = min(100, self.state.stats.happiness + 8)
        self.state.stats.energy = max(0, self.state.stats.energy - 10)
        self.state.stats.curiosity = min(100, self.state.stats.curiosity + 5)
        self.state.stats.clamp()
        self.save()

        era = self.current_era
        play_messages = {
            "prehistoric": "猫が石器を転がして遊んでいる！",
            "egypt": "猫がスカラベを追いかけ回している！",
            "medieval": "猫が騎士のマントに飛びかかった！",
            "sengoku": "猫が刀の鞘で爪を研いでいる！",
            "edo": "猫が風鈴の紐でじゃれている！",
            "meiji": "猫がガス灯の虫を追いかけている！",
            "showa": "猫がテレビのアンテナを叩いている！",
            "modern": "猫がマウスカーソルを追いかけている！",
            "future": "猫がホログラムの蝶を追いかけている！",
        }
        return play_messages.get(era.id, "猫が楽しそうに遊んでいる！")

    def give_treat(self) -> str:
        """Give a treat to the cat. Returns a reaction message."""
        self.treat_count += 1
        self.state.stats.happiness = min(100, self.state.stats.happiness + 3)
        self.state.stats.energy = min(100, self.state.stats.energy + 15)
        self.state.stats.clamp()
        self.save()

        era = self.current_era
        treat_messages = {
            "prehistoric": "猫が生肉をむしゃむしゃ食べている",
            "egypt": "猫がナイルパーチをもりもり食べている",
            "medieval": "猫がチーズの切れ端をかじっている",
            "sengoku": "猫が干し魚を美味しそうに食べている",
            "edo": "猫が鯛のお刺身に大喜び！",
            "meiji": "猫が牛乳をペロペロ飲んでいる",
            "showa": "猫がかつお節に目を輝かせている！",
            "modern": "猫がちゅ〜るに夢中！",
            "future": "猫が栄養カプセルをカリカリ食べている",
        }
        return treat_messages.get(era.id, "猫がおやつを食べている")

    def complete_pomodoro(self) -> dict:
        """Complete a pomodoro session. Returns result info."""
        self.state.pomodoro_count += 1
        self.state.total_work_seconds += 25 * 60
        self.state.stats.curiosity = min(100, self.state.stats.curiosity + 10)
        self.state.stats.energy = max(0, self.state.stats.energy - 5)
        self.state.stats.clamp()

        result = {
            "pomodoro_count": self.state.pomodoro_count,
            "item_found": None,
            "time_traveled": False,
            "new_era": None,
            "achievements": [],
        }

        # Try to find an item
        item = self._try_find_item()
        if item:
            result["item_found"] = item

        # Try to time travel
        next_era_id = get_next_era_id(self.state.current_era_id)
        if next_era_id and self.state.pomodoro_count % 3 == 0:
            self.state.current_era_id = next_era_id
            if next_era_id not in self.state.visited_eras:
                self.state.visited_eras.append(next_era_id)
            result["time_traveled"] = True
            result["new_era"] = get_era_by_id(self.eras, next_era_id)

        # Check achievements
        new_achievements = self._check_achievements()
        result["achievements"] = new_achievements

        self.save()
        return result

    def _try_find_item(self) -> Item | None:
        """Attempt to find an item in the current era."""
        era = self.current_era
        available_items = [
            item for item in era.items
            if item.id not in self.state.collected_items
        ]
        if not available_items:
            return None

        # Rarity-based probability
        roll = random.random()
        for item in available_items:
            if item.rarity == "legendary" and roll < 0.05:
                self.state.collected_items.append(item.id)
                return item
            elif item.rarity == "rare" and roll < 0.20:
                self.state.collected_items.append(item.id)
                return item
            elif item.rarity == "common" and roll < 0.50:
                self.state.collected_items.append(item.id)
                return item
        return None

    def _check_achievements(self) -> list[dict]:
        """Check and unlock any new achievements."""
        newly_unlocked = []
        all_item_ids = []
        for era in self.eras:
            for item in era.items:
                all_item_ids.append(item.id)

        legendary_found = any(
            item.rarity == "legendary"
            for era in self.eras
            for item in era.items
            if item.id in self.state.collected_items
        )

        conditions = {
            "pomodoro_1": self.state.pomodoro_count >= 1,
            "pomodoro_5": self.state.pomodoro_count >= 5,
            "pomodoro_25": self.state.pomodoro_count >= 25,
            "visit_3": len(self.state.visited_eras) >= 3,
            "visit_all": len(self.state.visited_eras) >= len(ERA_ORDER),
            "collect_5": len(self.state.collected_items) >= 5,
            "collect_all": len(self.state.collected_items) >= len(all_item_ids),
            "happiness_100": self.state.stats.happiness >= 100,
            "pet_10": self.pet_count >= 10,
            "legendary_1": legendary_found,
        }

        for ach_def in self.achievement_defs:
            if ach_def["id"] in self.state.unlocked_achievements:
                continue
            if conditions.get(ach_def["condition"], False):
                self.state.unlocked_achievements.append(ach_def["id"])
                newly_unlocked.append(ach_def)

        return newly_unlocked

    def travel_to_era(self, era_id: str) -> bool:
        """Manually travel to a previously visited era."""
        if era_id not in self.state.visited_eras:
            return False
        self.state.current_era_id = era_id
        self.save()
        return True

    def get_collection_stats(self) -> dict:
        """Get collection statistics."""
        total_items = sum(len(era.items) for era in self.eras)
        collected = len(self.state.collected_items)
        by_rarity = {"common": 0, "rare": 0, "legendary": 0}
        for era in self.eras:
            for item in era.items:
                if item.id in self.state.collected_items:
                    by_rarity[item.rarity] += 1
        return {
            "total": total_items,
            "collected": collected,
            "by_rarity": by_rarity,
            "percentage": int(collected / total_items * 100) if total_items > 0 else 0,
        }

    def get_all_items_with_status(self) -> list[dict]:
        """Get all items with their collected status."""
        result = []
        for era in self.eras:
            for item in era.items:
                result.append({
                    "item": item,
                    "era": era,
                    "collected": item.id in self.state.collected_items,
                })
        return result

    def rename_cat(self, new_name: str):
        """Rename the cat."""
        self.state.cat_name = new_name.strip()[:20]
        self.save()

    def save(self):
        save_game(self.state)

    def decay_stats(self):
        """Apply time-based stat decay (called periodically)."""
        self.state.stats.happiness = max(0, self.state.stats.happiness - 1)
        self.state.stats.energy = min(100, self.state.stats.energy + 1)
        self.state.stats.clamp()
