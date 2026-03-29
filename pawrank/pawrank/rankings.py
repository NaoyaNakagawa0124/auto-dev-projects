"""PawRank — Ranking and leaderboard logic."""

from __future__ import annotations
import pandas as pd
from .dogs import CATEGORIES, Dog, dogs_to_dataframe


def rank_by_category(dogs: list[Dog], category: str) -> pd.DataFrame:
    """Rank dogs by a single category, returning a sorted DataFrame."""
    df = dogs_to_dataframe(dogs)
    df["rank"] = df[category].rank(ascending=False, method="min").astype(int)
    return df.sort_values(category, ascending=False).reset_index(drop=True)


def overall_ranking(dogs: list[Dog]) -> pd.DataFrame:
    """Rank dogs by overall average score."""
    df = dogs_to_dataframe(dogs)
    df["overall"] = df[CATEGORIES].mean(axis=1).round(1)
    df["rank"] = df["overall"].rank(ascending=False, method="min").astype(int)
    return df.sort_values("overall", ascending=False).reset_index(drop=True)


def category_winners(dogs: list[Dog]) -> dict[str, dict]:
    """Get the winner for each category."""
    winners = {}
    for cat in CATEGORIES:
        ranked = rank_by_category(dogs, cat)
        top = ranked.iloc[0]
        winners[cat] = {
            "name": top["name"],
            "breed": top["breed"],
            "score": int(top[cat]),
            "emoji": top["photo_emoji"],
        }
    return winners


def trophy_room(dogs: list[Dog]) -> pd.DataFrame:
    """Summary of all category winners as a DataFrame."""
    winners = category_winners(dogs)
    rows = []
    for cat, info in winners.items():
        rows.append({
            "category": cat,
            "winner": info["name"],
            "breed": info["breed"],
            "score": info["score"],
        })
    return pd.DataFrame(rows)


def dog_percentile(dogs: list[Dog], dog_name: str) -> dict[str, float]:
    """Get the percentile rank for a specific dog in each category."""
    df = dogs_to_dataframe(dogs)
    row = df[df["name"] == dog_name]
    if row.empty:
        return {}
    n = len(df)
    result = {}
    for cat in CATEGORIES:
        score = row[cat].values[0]
        below = (df[cat] < score).sum()
        result[cat] = round(below / n * 100, 1)
    return result


def head_to_head(dogs: list[Dog], name1: str, name2: str) -> dict:
    """Compare two dogs across all categories."""
    df = dogs_to_dataframe(dogs)
    d1 = df[df["name"] == name1]
    d2 = df[df["name"] == name2]
    if d1.empty or d2.empty:
        return {"error": "Dog not found"}

    results = {}
    wins1, wins2 = 0, 0
    for cat in CATEGORIES:
        s1 = int(d1[cat].values[0])
        s2 = int(d2[cat].values[0])
        winner = name1 if s1 > s2 else (name2 if s2 > s1 else "Tie")
        if s1 > s2:
            wins1 += 1
        elif s2 > s1:
            wins2 += 1
        results[cat] = {"score1": s1, "score2": s2, "winner": winner}

    return {
        "dog1": name1,
        "dog2": name2,
        "categories": results,
        "wins1": wins1,
        "wins2": wins2,
        "overall_winner": name1 if wins1 > wins2 else (name2 if wins2 > wins1 else "Tie"),
    }
