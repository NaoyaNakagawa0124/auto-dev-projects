"""Statistics engine for CineWrapped."""

from collections import Counter
from datetime import date
from typing import Optional

import pandas as pd

from .models import Movie


PERSONALITY_TYPES = [
    {"name": "The Cinephile", "desc": "You live and breathe cinema. Your taste spans decades and genres.", "min_movies": 50, "min_genres": 5},
    {"name": "The Binge Watcher", "desc": "When you start, you don't stop. Marathon sessions are your thing.", "min_movies": 30, "min_genres": 2},
    {"name": "The Genre Loyalist", "desc": "You know what you like and you stick to it. Respect.", "min_movies": 10, "max_genres": 3},
    {"name": "The Critic", "desc": "You rate harshly because you have standards. Not everything deserves a 10.", "min_movies": 10, "max_avg_rating": 5.0},
    {"name": "The Enthusiast", "desc": "You love almost everything you watch. Glass half full, always.", "min_movies": 10, "min_avg_rating": 7.5},
    {"name": "The Explorer", "desc": "You're always trying something new. Variety is the spice of your watchlist.", "min_movies": 15, "min_genres": 6},
    {"name": "The Casual Viewer", "desc": "You watch when the mood strikes. Quality over quantity.", "min_movies": 1, "min_genres": 1},
]


def compute_stats(movies: list[Movie]) -> dict:
    """Compute all statistics from a list of movies."""
    if not movies:
        return {"total_movies": 0}

    df = pd.DataFrame([
        {
            "title": m.title,
            "date_watched": m.date_watched,
            "rating": m.rating,
            "genres": m.genres,
            "director": m.director,
            "runtime_minutes": m.runtime_minutes,
            "year": m.year,
        }
        for m in movies
    ])

    rated_movies = [m for m in movies if m.rating is not None]
    avg_rating = sum(m.rating for m in rated_movies) / len(rated_movies) if rated_movies else None

    # Genre counts
    all_genres = []
    for m in movies:
        all_genres.extend(m.genres)
    genre_counts = Counter(all_genres)

    # Director counts
    directors = [m.director for m in movies if m.director]
    director_counts = Counter(directors)

    # Total runtime
    total_minutes = sum(m.runtime_minutes for m in movies if m.runtime_minutes)
    total_hours = round(total_minutes / 60, 1)

    # Rating distribution
    rating_dist = Counter()
    for m in rated_movies:
        bucket = int(m.rating)
        if bucket == 10:
            bucket = 9
        rating_dist[bucket] = rating_dist.get(bucket, 0) + 1

    # Watching by day of week
    dow_counts = Counter()
    for m in movies:
        dow_counts[m.date_watched.strftime("%A")] += 1

    # Watching by month
    month_counts = Counter()
    for m in movies:
        month_counts[m.date_watched.strftime("%B")] += 1

    # Decades
    decade_counts = Counter()
    for m in movies:
        if m.year:
            decade = (m.year // 10) * 10
            decade_counts[f"{decade}s"] += 1

    # Highest rated
    highest_rated = None
    if rated_movies:
        best = max(rated_movies, key=lambda m: m.rating)
        highest_rated = {"title": best.title, "rating": best.rating}

    # Most watched month
    busiest_month = max(month_counts, key=month_counts.get) if month_counts else None

    # Personality
    personality = _determine_personality(movies, genre_counts, avg_rating)

    return {
        "total_movies": len(movies),
        "total_hours": total_hours,
        "total_minutes": total_minutes,
        "avg_rating": round(avg_rating, 1) if avg_rating else None,
        "total_rated": len(rated_movies),
        "genre_counts": dict(genre_counts.most_common(15)),
        "director_counts": dict(director_counts.most_common(10)),
        "rating_distribution": dict(sorted(rating_dist.items())),
        "day_of_week": dict(dow_counts),
        "month_counts": dict(month_counts),
        "decade_counts": dict(sorted(decade_counts.items())),
        "highest_rated": highest_rated,
        "busiest_month": busiest_month,
        "personality": personality,
        "unique_genres": len(genre_counts),
        "unique_directors": len(director_counts),
    }


def _determine_personality(movies: list[Movie], genre_counts: Counter, avg_rating: Optional[float]) -> dict:
    """Determine the user's movie personality type."""
    n = len(movies)
    n_genres = len(genre_counts)

    rated = [m for m in movies if m.rating is not None]
    avg = avg_rating or 5.0

    if n >= 50 and n_genres >= 5:
        return PERSONALITY_TYPES[0]  # Cinephile
    if n >= 30 and n_genres < 5:
        return PERSONALITY_TYPES[1]  # Binge Watcher
    if n >= 15 and n_genres >= 6:
        return PERSONALITY_TYPES[5]  # Explorer
    if n >= 10 and avg < 5.0:
        return PERSONALITY_TYPES[3]  # Critic
    if n >= 10 and avg >= 7.5:
        return PERSONALITY_TYPES[4]  # Enthusiast
    if n >= 10 and n_genres <= 3:
        return PERSONALITY_TYPES[2]  # Genre Loyalist
    return PERSONALITY_TYPES[6]  # Casual Viewer
