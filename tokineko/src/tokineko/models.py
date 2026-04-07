"""Data models for tokineko."""
from __future__ import annotations

import json
import time
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Optional


@dataclass
class CatStats:
    happiness: int = 70
    energy: int = 80
    curiosity: int = 60

    def clamp(self):
        self.happiness = max(0, min(100, self.happiness))
        self.energy = max(0, min(100, self.energy))
        self.curiosity = max(0, min(100, self.curiosity))


@dataclass
class Item:
    id: str
    name: str
    description: str
    era_id: str
    rarity: str  # "common", "rare", "legendary"
    emoji: str = "📦"


@dataclass
class Era:
    id: str
    name: str
    year_label: str
    description: str
    color: str
    cat_art: list[str]
    items: list[Item] = field(default_factory=list)
    ambient_text: str = ""


@dataclass
class Achievement:
    id: str
    name: str
    description: str
    condition: str  # machine-readable condition type
    unlocked: bool = False
    unlocked_at: Optional[float] = None


@dataclass
class GameState:
    cat_name: str = "ミケ"
    stats: CatStats = field(default_factory=CatStats)
    current_era_id: str = "prehistoric"
    visited_eras: list[str] = field(default_factory=list)
    collected_items: list[str] = field(default_factory=list)
    unlocked_achievements: list[str] = field(default_factory=list)
    pomodoro_count: int = 0
    total_work_seconds: int = 0
    created_at: float = field(default_factory=time.time)
    last_played: float = field(default_factory=time.time)

    def to_dict(self) -> dict:
        return {
            "cat_name": self.cat_name,
            "stats": asdict(self.stats),
            "current_era_id": self.current_era_id,
            "visited_eras": self.visited_eras,
            "collected_items": self.collected_items,
            "unlocked_achievements": self.unlocked_achievements,
            "pomodoro_count": self.pomodoro_count,
            "total_work_seconds": self.total_work_seconds,
            "created_at": self.created_at,
            "last_played": self.last_played,
        }

    @classmethod
    def from_dict(cls, data: dict) -> GameState:
        state = cls()
        state.cat_name = data.get("cat_name", "ミケ")
        stats_data = data.get("stats", {})
        state.stats = CatStats(
            happiness=stats_data.get("happiness", 70),
            energy=stats_data.get("energy", 80),
            curiosity=stats_data.get("curiosity", 60),
        )
        state.current_era_id = data.get("current_era_id", "prehistoric")
        state.visited_eras = data.get("visited_eras", [])
        state.collected_items = data.get("collected_items", [])
        state.unlocked_achievements = data.get("unlocked_achievements", [])
        state.pomodoro_count = data.get("pomodoro_count", 0)
        state.total_work_seconds = data.get("total_work_seconds", 0)
        state.created_at = data.get("created_at", time.time())
        state.last_played = data.get("last_played", time.time())
        return state


SAVE_DIR = Path.home() / ".tokineko"
SAVE_FILE = SAVE_DIR / "save.json"


def save_game(state: GameState) -> None:
    SAVE_DIR.mkdir(parents=True, exist_ok=True)
    state.last_played = time.time()
    with open(SAVE_FILE, "w", encoding="utf-8") as f:
        json.dump(state.to_dict(), f, ensure_ascii=False, indent=2)


def load_game() -> Optional[GameState]:
    if not SAVE_FILE.exists():
        return None
    try:
        with open(SAVE_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        return GameState.from_dict(data)
    except (json.JSONDecodeError, KeyError):
        return None
