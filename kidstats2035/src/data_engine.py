"""
KidStats2035 - Data Engine
Generates realistic futuristic youth sports analytics data.
Set in 2035, where AI tracks multi-sport development.
"""

import random
import math
from dataclasses import dataclass, field
from typing import List, Dict, Optional

SPORTS = [
    {"id": "soccer", "name": "Soccer", "icon": "⚽", "unit": "goals/assists", "season": "Fall"},
    {"id": "basketball", "name": "Basketball", "icon": "🏀", "unit": "points/rebounds", "season": "Winter"},
    {"id": "swimming", "name": "Swimming", "icon": "🏊", "unit": "seconds", "season": "Summer"},
    {"id": "track", "name": "Track & Field", "icon": "🏃", "unit": "seconds/meters", "season": "Spring"},
    {"id": "flag_football", "name": "Flag Football", "icon": "🏈", "unit": "touchdowns", "season": "Fall"},
    {"id": "tennis", "name": "Tennis", "icon": "🎾", "unit": "wins/aces", "season": "Spring"},
    {"id": "gymnastics", "name": "Gymnastics", "icon": "🤸", "unit": "score", "season": "Year-round"},
    {"id": "esports", "name": "Esports", "icon": "🎮", "unit": "rank/APM", "season": "Year-round"},
]

INJURY_ZONES = ["knee", "ankle", "shoulder", "wrist", "back", "hamstring", "shin", "elbow"]

SKILL_CATEGORIES = ["speed", "endurance", "strength", "agility", "coordination", "mental_focus"]

AGE_GROUPS = ["U8", "U10", "U12", "U14", "U16", "U18"]


@dataclass
class AthleteProfile:
    name: str
    age: int
    sports: List[str]
    height_cm: float
    weight_kg: float
    dominant_hand: str = "right"

    def age_group(self) -> str:
        for ag in AGE_GROUPS:
            limit = int(ag[1:])
            if self.age < limit:
                return ag
        return "U18"


@dataclass
class SeasonData:
    sport_id: str
    year: int
    season: str
    games_played: int
    performance_score: float  # 0-100
    improvement_pct: float
    injuries: int
    practice_hours: float
    ai_predicted_score: float
    highlight: str


@dataclass
class SkillRadar:
    speed: float  # 0-100
    endurance: float
    strength: float
    agility: float
    coordination: float
    mental_focus: float

    def to_dict(self) -> Dict[str, float]:
        return {
            "Speed": self.speed, "Endurance": self.endurance,
            "Strength": self.strength, "Agility": self.agility,
            "Coordination": self.coordination, "Mental Focus": self.mental_focus,
        }

    def average(self) -> float:
        vals = [self.speed, self.endurance, self.strength, self.agility, self.coordination, self.mental_focus]
        return sum(vals) / len(vals)


def generate_athlete(name: str, age: int, seed: int = 42) -> AthleteProfile:
    rng = random.Random(seed)
    num_sports = rng.randint(2, min(5, len(SPORTS)))
    sports = rng.sample([s["id"] for s in SPORTS], num_sports)
    height = 100 + age * 6 + rng.uniform(-5, 5)
    weight = 20 + age * 3.5 + rng.uniform(-3, 3)
    hand = rng.choice(["right", "right", "right", "left"])
    return AthleteProfile(name=name, age=age, sports=sports, height_cm=round(height, 1),
                          weight_kg=round(weight, 1), dominant_hand=hand)


def generate_season_data(athlete: AthleteProfile, seed: int = 42) -> List[SeasonData]:
    rng = random.Random(seed)
    seasons = []
    highlights = [
        "MVP of tournament", "New personal best", "Team captain elected",
        "Won league championship", "Selected for regional team",
        "Scored winning goal/point", "Perfect attendance", "Most improved player",
        "Sportsmanship award", "Led team in assists", "Undefeated streak",
        "Qualified for nationals", "Set age-group record", "Comeback of the season",
    ]

    for sport_id in athlete.sports:
        sport = next(s for s in SPORTS if s["id"] == sport_id)
        base_score = 40 + rng.uniform(0, 30)
        for year in range(2032, 2036):
            improvement = rng.uniform(-5, 15)
            base_score = max(10, min(98, base_score + improvement))
            games = rng.randint(8, 24)
            injuries = 1 if rng.random() < 0.15 else 0
            practice = rng.uniform(20, 60)
            ai_pred = base_score + rng.uniform(-5, 5)
            highlight = rng.choice(highlights) if rng.random() < 0.4 else ""

            seasons.append(SeasonData(
                sport_id=sport_id, year=year, season=sport["season"],
                games_played=games, performance_score=round(base_score, 1),
                improvement_pct=round(improvement, 1), injuries=injuries,
                practice_hours=round(practice, 1),
                ai_predicted_score=round(max(10, min(100, ai_pred)), 1),
                highlight=highlight,
            ))
    return seasons


def generate_skill_radar(athlete: AthleteProfile, year: int = 2035, seed: int = 42) -> SkillRadar:
    rng = random.Random(seed + year)
    age_factor = min(1.0, athlete.age / 16.0)
    base = 30 + age_factor * 30

    # Sport-specific bonuses
    bonuses = {cat: 0.0 for cat in SKILL_CATEGORIES}
    sport_skills = {
        "soccer": {"speed": 10, "endurance": 10, "agility": 8},
        "basketball": {"agility": 10, "coordination": 8, "strength": 5},
        "swimming": {"endurance": 12, "strength": 8},
        "track": {"speed": 12, "endurance": 10},
        "flag_football": {"speed": 8, "agility": 10, "coordination": 5},
        "tennis": {"agility": 8, "coordination": 10, "mental_focus": 8},
        "gymnastics": {"strength": 10, "coordination": 12, "agility": 10},
        "esports": {"mental_focus": 15, "coordination": 8},
    }

    for sport_id in athlete.sports:
        if sport_id in sport_skills:
            for skill, bonus in sport_skills[sport_id].items():
                bonuses[skill] += bonus

    return SkillRadar(
        speed=min(100, round(base + bonuses["speed"] + rng.uniform(-5, 10), 1)),
        endurance=min(100, round(base + bonuses["endurance"] + rng.uniform(-5, 10), 1)),
        strength=min(100, round(base + bonuses["strength"] + rng.uniform(-5, 10), 1)),
        agility=min(100, round(base + bonuses["agility"] + rng.uniform(-5, 10), 1)),
        coordination=min(100, round(base + bonuses["coordination"] + rng.uniform(-5, 10), 1)),
        mental_focus=min(100, round(base + bonuses["mental_focus"] + rng.uniform(-5, 10), 1)),
    )


def generate_injury_risk(athlete: AthleteProfile, seed: int = 42) -> Dict[str, float]:
    rng = random.Random(seed)
    risks = {}
    for zone in INJURY_ZONES:
        base = rng.uniform(0.02, 0.15)
        # Higher risk for more sports
        multi_sport_factor = 1 + len(athlete.sports) * 0.05
        # Age factor
        age_factor = 1.0 if athlete.age < 14 else 1.2
        risks[zone] = round(min(0.5, base * multi_sport_factor * age_factor), 3)
    return risks


def generate_growth_trajectory(athlete: AthleteProfile, seed: int = 42) -> List[Dict]:
    rng = random.Random(seed)
    trajectory = []
    height = athlete.height_cm - (2035 - 2032) * 5  # Estimate past height
    weight = athlete.weight_kg - (2035 - 2032) * 2.5

    for year in range(2032, 2039):
        growth_rate = 4 + rng.uniform(-1, 2) if athlete.age + (year - 2035) < 16 else rng.uniform(0, 1.5)
        height += growth_rate
        weight += growth_rate * 0.6 + rng.uniform(-0.5, 1)
        trajectory.append({
            "year": year,
            "height_cm": round(height, 1),
            "weight_kg": round(max(20, weight), 1),
            "predicted": year > 2035,
            "age": athlete.age + (year - 2035),
        })
    return trajectory


def generate_training_schedule(athlete: AthleteProfile, seed: int = 42) -> List[Dict]:
    rng = random.Random(seed)
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    schedule = []
    for day in days:
        if day == "Sunday":
            schedule.append({"day": day, "activity": "Rest & Recovery", "sport": None, "duration_min": 0, "intensity": "none"})
            continue
        sport_id = rng.choice(athlete.sports)
        sport = next(s for s in SPORTS if s["id"] == sport_id)
        duration = rng.choice([45, 60, 75, 90])
        intensity = rng.choice(["light", "moderate", "high"]) if day != "Saturday" else "moderate"
        schedule.append({
            "day": day,
            "activity": f"{sport['icon']} {sport['name']} Training",
            "sport": sport_id,
            "duration_min": duration,
            "intensity": intensity,
        })
    return schedule


def get_ai_recommendation(athlete: AthleteProfile, seasons: List[SeasonData]) -> str:
    """Generate a futuristic AI recommendation."""
    if not seasons:
        return "Insufficient data for analysis."

    latest = sorted(seasons, key=lambda s: s.year, reverse=True)
    best_sport = max(latest[:len(athlete.sports)], key=lambda s: s.performance_score)
    sport = next(s for s in SPORTS if s["id"] == best_sport.sport_id)

    avg_score = sum(s.performance_score for s in latest[:4]) / min(4, len(latest))
    total_injuries = sum(s.injuries for s in seasons)

    lines = []
    lines.append(f"🤖 AI Coach v12.3 Analysis — {athlete.name}, Age {athlete.age}")
    lines.append(f"Primary strength: {sport['name']} ({sport['icon']}) with {best_sport.performance_score}/100 score")
    lines.append(f"4-season average: {avg_score:.1f}/100")

    if total_injuries > 2:
        lines.append(f"⚠️ Injury alert: {total_injuries} injuries across {len(seasons)} seasons. Recommend recovery protocol.")
    elif avg_score > 75:
        lines.append("📈 Trajectory: Elite potential. Consider specialized training pathway.")
    elif avg_score > 50:
        lines.append("📊 Trajectory: Solid development. Maintain multi-sport approach for 2 more years.")
    else:
        lines.append("🌱 Trajectory: Building fundamentals. Focus on enjoyment and skill variety.")

    lines.append(f"Recommended focus sport for 2036: {sport['name']}")
    return "\n".join(lines)


def get_parent_summary(athlete: AthleteProfile, seasons: List[SeasonData]) -> str:
    """5-minute summary for busy parents."""
    total_games = sum(s.games_played for s in seasons)
    total_practice = sum(s.practice_hours for s in seasons)
    total_injuries = sum(s.injuries for s in seasons)
    avg_score = sum(s.performance_score for s in seasons) / max(1, len(seasons))

    return (
        f"📋 Quick Summary for {athlete.name}'s Parent\n"
        f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        f"🏅 Sports: {len(athlete.sports)} active ({', '.join(athlete.sports)})\n"
        f"📊 Avg Performance: {avg_score:.0f}/100\n"
        f"🎮 Games Played: {total_games} across {len(seasons)} seasons\n"
        f"⏱️ Practice Hours: {total_practice:.0f}h total\n"
        f"🩹 Injuries: {total_injuries}\n"
        f"📐 Height: {athlete.height_cm}cm | Weight: {athlete.weight_kg}kg\n"
        f"🏷️ Age Group: {athlete.age_group()}\n"
    )
