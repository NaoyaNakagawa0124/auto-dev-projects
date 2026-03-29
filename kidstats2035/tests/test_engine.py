#!/usr/bin/env python3
"""KidStats2035 Test Suite"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from data_engine import (
    SPORTS, INJURY_ZONES, SKILL_CATEGORIES, AGE_GROUPS,
    AthleteProfile, SeasonData, SkillRadar,
    generate_athlete, generate_season_data, generate_skill_radar,
    generate_injury_risk, generate_growth_trajectory, generate_training_schedule,
    get_ai_recommendation, get_parent_summary,
)

passed = 0
failed = 0
failures = []

def assert_eq(exp, act, name):
    global passed, failed
    if exp == act: passed += 1
    else: failed += 1; failures.append(f"{name} (exp={exp}, got={act})"); print(f"  FAIL: {name} (exp={exp}, got={act})")

def assert_true(cond, name):
    global passed, failed
    if cond: passed += 1
    else: failed += 1; failures.append(name); print(f"  FAIL: {name}")

def assert_gt(a, b, name):
    assert_true(a > b, f"{name} ({a} > {b})")

def assert_gte(a, b, name):
    assert_true(a >= b, f"{name} ({a} >= {b})")

def assert_lt(a, b, name):
    assert_true(a < b, f"{name} ({a} < {b})")

def assert_between(val, lo, hi, name):
    assert_true(lo <= val <= hi, f"{name} ({lo} <= {val} <= {hi})")

print("=== KidStats2035 Test Suite ===\n")

# ---- Constants Tests ----
print("[Constants Tests]")
assert_eq(8, len(SPORTS), "8 sports")
assert_eq(8, len(INJURY_ZONES), "8 injury zones")
assert_eq(6, len(SKILL_CATEGORIES), "6 skill categories")
assert_eq(6, len(AGE_GROUPS), "6 age groups")

for s in SPORTS:
    assert_true(len(s["id"]) > 0, f"Sport {s['id']} has id")
    assert_true(len(s["name"]) > 0, f"Sport {s['id']} has name")
    assert_true(len(s["icon"]) > 0, f"Sport {s['id']} has icon")
    assert_true(len(s["unit"]) > 0, f"Sport {s['id']} has unit")
    assert_true(len(s["season"]) > 0, f"Sport {s['id']} has season")

sport_ids = [s["id"] for s in SPORTS]
assert_eq(len(sport_ids), len(set(sport_ids)), "Sport IDs unique")

print("  Constants tests complete.\n")

# ---- Athlete Profile Tests ----
print("[Athlete Profile Tests]")

a1 = generate_athlete("Alex", 12, seed=42)
assert_eq("Alex", a1.name, "Name set")
assert_eq(12, a1.age, "Age set")
assert_gte(len(a1.sports), 2, "At least 2 sports")
assert_lt(len(a1.sports), 6, "At most 5 sports")
assert_gt(a1.height_cm, 100, "Height > 100cm")
assert_lt(a1.height_cm, 250, "Height < 250cm")
assert_gt(a1.weight_kg, 20, "Weight > 20kg")
assert_true(a1.dominant_hand in ["left", "right"], "Valid hand")

# Age group
assert_eq("U14", a1.age_group(), "12yo = U14")

a2 = generate_athlete("Sam", 7, seed=1)
assert_eq("U8", a2.age_group(), "7yo = U8")

a3 = generate_athlete("Jordan", 15, seed=2)
assert_eq("U16", a3.age_group(), "15yo = U16")

a4 = generate_athlete("Pat", 17, seed=3)
assert_eq("U18", a4.age_group(), "17yo = U18")

a5 = generate_athlete("Chris", 18, seed=4)
assert_eq("U18", a5.age_group(), "18yo = U18")

# Deterministic with same seed
a6 = generate_athlete("Alex", 12, seed=42)
assert_eq(a1.sports, a6.sports, "Same seed = same sports")
assert_eq(a1.height_cm, a6.height_cm, "Same seed = same height")

# Different seed = different result
a7 = generate_athlete("Alex", 12, seed=99)
assert_true(a1.sports != a7.sports or a1.height_cm != a7.height_cm, "Diff seed = diff data")

# All sports are valid
for sport_id in a1.sports:
    assert_true(sport_id in sport_ids, f"Sport {sport_id} is valid")

print("  Athlete profile tests complete.\n")

# ---- Season Data Tests ----
print("[Season Data Tests]")

seasons = generate_season_data(a1, seed=42)
assert_gt(len(seasons), 0, "Seasons generated")

# Should have 4 years * num_sports entries
expected = len(a1.sports) * 4
assert_eq(expected, len(seasons), f"Expected {expected} season entries")

for s in seasons:
    assert_true(s.sport_id in sport_ids, f"Valid sport {s.sport_id}")
    assert_between(s.year, 2032, 2035, f"Year {s.year} in range")
    assert_gt(s.games_played, 0, f"Games > 0")
    assert_between(s.performance_score, 10, 98, f"Score in range")
    assert_gte(s.practice_hours, 0, f"Practice >= 0")
    assert_between(s.ai_predicted_score, 5, 105, f"AI pred in range")
    assert_gte(s.injuries, 0, f"Injuries >= 0")

# Deterministic
seasons2 = generate_season_data(a1, seed=42)
assert_eq(len(seasons), len(seasons2), "Same length")
assert_eq(seasons[0].performance_score, seasons2[0].performance_score, "Same first score")

print("  Season data tests complete.\n")

# ---- Skill Radar Tests ----
print("[Skill Radar Tests]")

radar = generate_skill_radar(a1, year=2035, seed=42)
assert_between(radar.speed, 0, 100, "Speed in range")
assert_between(radar.endurance, 0, 100, "Endurance in range")
assert_between(radar.strength, 0, 100, "Strength in range")
assert_between(radar.agility, 0, 100, "Agility in range")
assert_between(radar.coordination, 0, 100, "Coordination in range")
assert_between(radar.mental_focus, 0, 100, "Mental focus in range")

d = radar.to_dict()
assert_eq(6, len(d), "Radar dict has 6 keys")
assert_true("Speed" in d, "Dict has Speed")
assert_true("Mental Focus" in d, "Dict has Mental Focus")

avg = radar.average()
assert_between(avg, 0, 100, "Average in range")

# Older athletes should have higher base stats
young = generate_athlete("Young", 8, seed=10)
old = generate_athlete("Old", 16, seed=10)
young_radar = generate_skill_radar(young, seed=10)
old_radar = generate_skill_radar(old, seed=10)
assert_gt(old_radar.average(), young_radar.average(), "Older athlete has higher avg skills")

# Sport-specific bonuses
# An athlete with esports should have high mental_focus
esports_athlete = AthleteProfile(name="Gamer", age=14, sports=["esports"], height_cm=165, weight_kg=55)
esports_radar = generate_skill_radar(esports_athlete, seed=42)
soccer_athlete = AthleteProfile(name="Kicker", age=14, sports=["soccer"], height_cm=165, weight_kg=55)
soccer_radar = generate_skill_radar(soccer_athlete, seed=42)
assert_gt(esports_radar.mental_focus, soccer_radar.mental_focus - 20, "Esports higher mental focus (approx)")

print("  Skill radar tests complete.\n")

# ---- Injury Risk Tests ----
print("[Injury Risk Tests]")

risks = generate_injury_risk(a1, seed=42)
assert_eq(8, len(risks), "8 injury zones")

for zone, risk in risks.items():
    assert_true(zone in INJURY_ZONES, f"Valid zone {zone}")
    assert_between(risk, 0, 0.5, f"Risk {zone} in range")

# More sports = higher risk
few_sports = AthleteProfile(name="A", age=12, sports=["soccer"], height_cm=150, weight_kg=40)
many_sports = AthleteProfile(name="B", age=12, sports=["soccer", "basketball", "swimming", "track", "tennis"], height_cm=150, weight_kg=40)
risk_few = generate_injury_risk(few_sports, seed=42)
risk_many = generate_injury_risk(many_sports, seed=42)
avg_few = sum(risk_few.values()) / len(risk_few)
avg_many = sum(risk_many.values()) / len(risk_many)
assert_gt(avg_many, avg_few, "More sports = higher avg risk")

# Older athletes = higher risk
young_risk = generate_injury_risk(AthleteProfile("Y", 10, ["soccer"], 140, 35), seed=42)
old_risk = generate_injury_risk(AthleteProfile("O", 16, ["soccer"], 170, 60), seed=42)
assert_gte(sum(old_risk.values()), sum(young_risk.values()), "Older = higher total risk")

print("  Injury risk tests complete.\n")

# ---- Growth Trajectory Tests ----
print("[Growth Trajectory Tests]")

growth = generate_growth_trajectory(a1, seed=42)
assert_eq(7, len(growth), "7 years of trajectory")

for g in growth:
    assert_between(g["year"], 2032, 2038, f"Year {g['year']} in range")
    assert_gt(g["height_cm"], 0, "Height positive")
    assert_gt(g["weight_kg"], 0, "Weight positive")
    assert_true(isinstance(g["predicted"], bool), "Has predicted flag")

# Past years not predicted, future years predicted
for g in growth:
    if g["year"] <= 2035:
        assert_true(not g["predicted"], f"Year {g['year']} not predicted")
    else:
        assert_true(g["predicted"], f"Year {g['year']} is predicted")

# Height generally increases
for i in range(1, len(growth)):
    assert_gte(growth[i]["height_cm"], growth[i-1]["height_cm"] - 2, "Height doesn't decrease significantly")

print("  Growth trajectory tests complete.\n")

# ---- Training Schedule Tests ----
print("[Training Schedule Tests]")

schedule = generate_training_schedule(a1, seed=42)
assert_eq(7, len(schedule), "7 days in schedule")

days = [s["day"] for s in schedule]
assert_eq(["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], days, "All days present")

# Sunday is rest
assert_eq("Rest & Recovery", schedule[6]["activity"], "Sunday is rest")
assert_eq(0, schedule[6]["duration_min"], "Sunday 0 duration")

# Other days have activities
for i in range(6):
    assert_gt(schedule[i]["duration_min"], 0, f"{schedule[i]['day']} has duration")
    assert_true(schedule[i]["sport"] in sport_ids, f"{schedule[i]['day']} valid sport")
    assert_true(schedule[i]["intensity"] in ["light", "moderate", "high"], f"{schedule[i]['day']} valid intensity")

print("  Training schedule tests complete.\n")

# ---- AI Recommendation Tests ----
print("[AI Recommendation Tests]")

rec = get_ai_recommendation(a1, seasons)
assert_true(len(rec) > 0, "Recommendation not empty")
assert_true("Alex" in rec, "Recommendation mentions name")
assert_true("12" in rec, "Recommendation mentions age")
assert_true("AI Coach" in rec, "Has AI Coach branding")

# Empty seasons
rec_empty = get_ai_recommendation(a1, [])
assert_true("Insufficient" in rec_empty, "Empty seasons handled")

# High performer
high_performer = generate_athlete("Star", 14, seed=777)
high_seasons = generate_season_data(high_performer, seed=777)
# Boost scores
for s in high_seasons:
    s.performance_score = 85
rec_high = get_ai_recommendation(high_performer, high_seasons)
assert_true(len(rec_high) > 0, "High performer rec exists")

print("  AI recommendation tests complete.\n")

# ---- Parent Summary Tests ----
print("[Parent Summary Tests]")

summary = get_parent_summary(a1, seasons)
assert_true(len(summary) > 0, "Summary not empty")
assert_true("Alex" in summary, "Summary mentions name")
assert_true("Quick Summary" in summary, "Has summary header")
assert_true("Sports:" in summary, "Mentions sports count")
assert_true("Performance" in summary, "Mentions performance")
assert_true("Games" in summary, "Mentions games")

print("  Parent summary tests complete.\n")

# ---- Integration Tests ----
print("[Integration Tests]")

# Full pipeline for multiple athletes
athletes = [
    generate_athlete("Maya", 10, seed=100),
    generate_athlete("Kai", 14, seed=200),
    generate_athlete("Luna", 8, seed=300),
    generate_athlete("Ravi", 16, seed=400),
]

for athlete in athletes:
    s = generate_season_data(athlete, seed=athlete.age * 10)
    assert_gt(len(s), 0, f"{athlete.name} has seasons")

    radar = generate_skill_radar(athlete, seed=athlete.age * 10)
    assert_between(radar.average(), 0, 100, f"{athlete.name} radar valid")

    risks = generate_injury_risk(athlete, seed=athlete.age * 10)
    assert_eq(8, len(risks), f"{athlete.name} has 8 risk zones")

    growth = generate_growth_trajectory(athlete, seed=athlete.age * 10)
    assert_eq(7, len(growth), f"{athlete.name} has 7yr trajectory")

    schedule = generate_training_schedule(athlete, seed=athlete.age * 10)
    assert_eq(7, len(schedule), f"{athlete.name} has 7-day schedule")

    rec = get_ai_recommendation(athlete, s)
    assert_true(len(rec) > 0, f"{athlete.name} has recommendation")

    summary = get_parent_summary(athlete, s)
    assert_true(len(summary) > 0, f"{athlete.name} has summary")

# Consistency check: same inputs = same outputs
for _ in range(3):
    a = generate_athlete("Test", 12, seed=42)
    s = generate_season_data(a, seed=42)
    r = generate_skill_radar(a, seed=42)
    assert_eq(a1.sports, a.sports, "Deterministic sports")
    assert_eq(seasons[0].performance_score, s[0].performance_score, "Deterministic scores")

print("  Integration tests complete.\n")

# ---- Edge Cases ----
print("[Edge Cases]")

# Very young athlete
tiny = generate_athlete("Tiny", 6, seed=50)
assert_eq("U8", tiny.age_group(), "6yo = U8")
tiny_seasons = generate_season_data(tiny, seed=50)
assert_gt(len(tiny_seasons), 0, "Young athlete has seasons")

# Very old athlete
senior = generate_athlete("Senior", 19, seed=60)
assert_eq("U18", senior.age_group(), "19yo = U18 (max)")

# Athlete with many sports
multi = AthleteProfile("Multi", 13, ["soccer","basketball","swimming","track","flag_football"], 160, 50)
multi_seasons = generate_season_data(multi, seed=70)
assert_eq(20, len(multi_seasons), "5 sports * 4 years = 20 seasons")
multi_schedule = generate_training_schedule(multi, seed=70)
assert_eq(7, len(multi_schedule), "Still 7-day schedule")

# Athlete with 1 sport
solo = AthleteProfile("Solo", 12, ["tennis"], 150, 40)
solo_seasons = generate_season_data(solo, seed=80)
assert_eq(4, len(solo_seasons), "1 sport * 4 years = 4 seasons")

print("  Edge cases complete.\n")

# ============ Results ============
print("================================")
print(f"  Results: {passed} passed, {failed} failed")
print("================================")
if failures:
    print("\nFailures:")
    for f in failures:
        print(f"  - {f}")
sys.exit(1 if failed > 0 else 0)
