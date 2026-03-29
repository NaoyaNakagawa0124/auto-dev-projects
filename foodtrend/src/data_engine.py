"""
FoodTrend - Data engine for food TikTok analytics.
Generates realistic content strategy data for aspiring food creators.
"""

import random
import math
from dataclasses import dataclass, field
from typing import List, Dict, Tuple

FOOD_CATEGORIES = [
    {"id": "baking", "name": "Baking & Desserts", "icon": "🧁", "growth": 12},
    {"id": "healthy", "name": "Healthy & Wellness", "icon": "🥗", "growth": 25},
    {"id": "comfort", "name": "Comfort Food", "icon": "🍝", "growth": 8},
    {"id": "asian", "name": "Asian Cuisine", "icon": "🍜", "growth": 18},
    {"id": "quick", "name": "Quick & Easy (<15min)", "icon": "⏱️", "growth": 22},
    {"id": "budget", "name": "Budget Meals", "icon": "💰", "growth": 20},
    {"id": "viral", "name": "Viral Challenges", "icon": "🔥", "growth": 30},
    {"id": "drinks", "name": "Drinks & Smoothies", "icon": "🧃", "growth": 15},
    {"id": "protein", "name": "High Protein", "icon": "💪", "growth": 28},
    {"id": "airfryer", "name": "Air Fryer", "icon": "🍟", "growth": 35},
]

CONTENT_FORMATS = [
    {"id": "recipe_15s", "name": "Quick Recipe (15s)", "avg_views": 45000, "difficulty": 1},
    {"id": "recipe_30s", "name": "Step-by-Step (30s)", "avg_views": 35000, "difficulty": 2},
    {"id": "recipe_60s", "name": "Full Tutorial (60s)", "avg_views": 25000, "difficulty": 3},
    {"id": "pov_cook", "name": "POV Cooking", "avg_views": 55000, "difficulty": 2},
    {"id": "challenge", "name": "Food Challenge", "avg_views": 80000, "difficulty": 1},
    {"id": "review", "name": "Restaurant Review", "avg_views": 40000, "difficulty": 1},
    {"id": "hack", "name": "Kitchen Hack", "avg_views": 65000, "difficulty": 1},
    {"id": "asmr", "name": "ASMR Cooking", "avg_views": 50000, "difficulty": 2},
    {"id": "duet", "name": "Duet/Stitch", "avg_views": 70000, "difficulty": 1},
    {"id": "series", "name": "Multi-Part Series", "avg_views": 30000, "difficulty": 3},
]

TRENDING_RECIPES = [
    {"name": "2-Ingredient Japanese Cheesecake", "category": "baking", "virality": 95},
    {"name": "Protein Ice Cream (3 ways)", "category": "protein", "virality": 88},
    {"name": "Air Fryer Everything Bagel Bites", "category": "airfryer", "virality": 92},
    {"name": "Cottage Cheese Flatbread", "category": "healthy", "virality": 85},
    {"name": "One-Pan Garlic Butter Salmon", "category": "quick", "virality": 82},
    {"name": "Budget Ramen Upgrade ($3)", "category": "budget", "virality": 90},
    {"name": "Baked Oats 5 Ways", "category": "healthy", "virality": 78},
    {"name": "Spicy Korean Corn Dog", "category": "asian", "virality": 87},
    {"name": "Cloud Bread Sandwich", "category": "viral", "virality": 93},
    {"name": "Matcha Latte Art at Home", "category": "drinks", "virality": 80},
    {"name": "Air Fryer Mozzarella Sticks", "category": "airfryer", "virality": 86},
    {"name": "15-Min Pad Thai", "category": "asian", "virality": 84},
    {"name": "Overnight Oats Jar Hack", "category": "healthy", "virality": 76},
    {"name": "Smash Burger Tacos", "category": "comfort", "virality": 91},
    {"name": "Protein Brownie (No Sugar)", "category": "protein", "virality": 83},
]

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
HOURS = list(range(24))


def generate_posting_heatmap(seed: int = 42) -> List[List[float]]:
    """Generate engagement heatmap [day][hour] with realistic patterns."""
    rng = random.Random(seed)
    heatmap = []
    for day_idx in range(7):
        row = []
        for hour in range(24):
            # Base engagement pattern: peaks at lunch and evening
            base = 0.0
            if 11 <= hour <= 13:
                base = 0.6  # Lunch peak
            elif 17 <= hour <= 21:
                base = 0.9  # Evening peak
            elif 7 <= hour <= 9:
                base = 0.4  # Morning scroll
            elif 22 <= hour <= 23:
                base = 0.5  # Late night
            elif 0 <= hour <= 1:
                base = 0.3  # Midnight
            else:
                base = 0.1  # Low hours

            # Weekend boost
            if day_idx >= 5:
                base *= 1.2
                if 10 <= hour <= 14:
                    base *= 1.3  # Weekend brunch

            # Add noise
            base += rng.uniform(-0.1, 0.1)
            row.append(round(max(0, min(1.0, base)), 2))
        heatmap.append(row)
    return heatmap


def find_best_posting_times(heatmap: List[List[float]], top_n: int = 5) -> List[Dict]:
    """Find the top N posting times from the heatmap."""
    slots = []
    for day_idx, row in enumerate(heatmap):
        for hour, score in enumerate(row):
            slots.append({"day": DAYS[day_idx], "day_idx": day_idx, "hour": hour, "score": score})
    slots.sort(key=lambda x: x["score"], reverse=True)
    return slots[:top_n]


def generate_competitor_data(seed: int = 42) -> List[Dict]:
    """Generate fictional competitor accounts for benchmarking."""
    rng = random.Random(seed)
    competitors = [
        {"name": "@QuickBitesDaily", "followers": 125000, "niche": "quick"},
        {"name": "@HealthyPlateHQ", "followers": 89000, "niche": "healthy"},
        {"name": "@BakeItEasyy", "followers": 210000, "niche": "baking"},
        {"name": "@BudgetChefMom", "followers": 67000, "niche": "budget"},
        {"name": "@AirFryerKing", "followers": 340000, "niche": "airfryer"},
        {"name": "@RamenLoverTokyo", "followers": 156000, "niche": "asian"},
        {"name": "@ProteinChef_", "followers": 98000, "niche": "protein"},
        {"name": "@ViralFoodLab", "followers": 450000, "niche": "viral"},
    ]

    for c in competitors:
        c["avg_views"] = int(c["followers"] * rng.uniform(0.08, 0.25))
        c["posts_per_week"] = rng.randint(3, 7)
        c["engagement_rate"] = round(rng.uniform(2.5, 8.0), 1)
        c["growth_30d"] = round(rng.uniform(1.5, 12.0), 1)
        c["top_format"] = rng.choice(CONTENT_FORMATS)["id"]

    return competitors


def generate_growth_projection(start_followers: int = 500, months: int = 12,
                                posts_per_week: int = 4, seed: int = 42) -> List[Dict]:
    """Project follower growth over months."""
    rng = random.Random(seed)
    data = []
    followers = start_followers

    for month in range(months):
        # Base growth rate depends on consistency
        base_rate = 0.08 + (posts_per_week - 3) * 0.02
        # Viral boost chance
        viral_boost = 1.0
        if rng.random() < 0.15:
            viral_boost = rng.uniform(1.5, 3.0)

        growth = followers * base_rate * viral_boost
        followers += int(growth)

        data.append({
            "month": month + 1,
            "followers": followers,
            "growth": int(growth),
            "growth_pct": round(growth / max(1, followers - growth) * 100, 1),
            "viral_month": viral_boost > 1.5,
            "posts": posts_per_week * 4,
        })

    return data


def find_content_gaps(competitor_data: List[Dict]) -> List[Dict]:
    """Find underserved categories based on competitor niches."""
    served = set(c["niche"] for c in competitor_data)
    gaps = []
    for cat in FOOD_CATEGORIES:
        if cat["id"] not in served:
            gaps.append({**cat, "opportunity": "high"})
        elif sum(1 for c in competitor_data if c["niche"] == cat["id"]) == 1:
            gaps.append({**cat, "opportunity": "medium"})

    gaps.sort(key=lambda x: x["growth"], reverse=True)
    return gaps


def generate_hashtag_data(seed: int = 42) -> List[Dict]:
    """Generate trending food hashtags with volume data."""
    rng = random.Random(seed)
    hashtags = [
        "#FoodTok", "#RecipeOfTheDay", "#CookingTikTok", "#EasyRecipes",
        "#HealthyEating", "#AirFryerRecipes", "#ProteinMeals", "#BudgetMeals",
        "#QuickDinner", "#BakingTikTok", "#FoodChallenge", "#WhatIEatInADay",
        "#MealPrep", "#ViralRecipe", "#HomeCooking", "#KitchenHacks",
        "#AsianFood", "#ComfortFood", "#FoodASMR", "#2IngredientRecipe",
    ]
    data = []
    for tag in hashtags:
        views = rng.randint(50, 800) * 1_000_000
        growth = rng.uniform(-5, 40)
        data.append({
            "hashtag": tag,
            "total_views": views,
            "growth_7d": round(growth, 1),
            "competition": "high" if views > 400_000_000 else "medium" if views > 200_000_000 else "low",
        })
    data.sort(key=lambda x: x["growth_7d"], reverse=True)
    return data


def get_strategy_summary(competitors: List[Dict], gaps: List[Dict],
                          best_times: List[Dict]) -> str:
    """Generate a text strategy summary."""
    top_gap = gaps[0] if gaps else None
    top_time = best_times[0] if best_times else None

    lines = []
    lines.append("📋 CONTENT STRATEGY SUMMARY")
    lines.append("=" * 40)
    lines.append("")

    if top_gap:
        lines.append(f"🎯 Recommended Niche: {top_gap['icon']} {top_gap['name']}")
        lines.append(f"   Growth rate: +{top_gap['growth']}% | Competition: {top_gap.get('opportunity', 'unknown')}")
        lines.append("")

    if top_time:
        lines.append(f"⏰ Best Posting Time: {top_time['day']} at {top_time['hour']}:00")
        lines.append(f"   Engagement score: {top_time['score']:.0%}")
        lines.append("")

    lines.append("📱 Recommended Formats:")
    top_formats = sorted(CONTENT_FORMATS, key=lambda f: f["avg_views"], reverse=True)[:3]
    for f in top_formats:
        lines.append(f"   • {f['name']} (~{f['avg_views']:,} avg views)")

    lines.append("")
    lines.append("🔑 Key Tips:")
    lines.append("   1. Post 4-5x per week for optimal growth")
    lines.append("   2. First 3 seconds = hook (show the finished dish)")
    lines.append("   3. Use trending sounds + food ASMR audio")
    lines.append("   4. Engage with comments in first 30 minutes")
    lines.append("   5. Cross-post to Reels and Shorts")

    return "\n".join(lines)
