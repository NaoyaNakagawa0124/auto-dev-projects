"""Data models for CineWrapped."""

from dataclasses import dataclass, field
from datetime import date
from typing import Optional


@dataclass
class Movie:
    title: str
    date_watched: date
    rating: Optional[float] = None  # 0-10 scale
    genres: list[str] = field(default_factory=list)
    director: Optional[str] = None
    runtime_minutes: Optional[int] = None
    year: Optional[int] = None
    imdb_id: Optional[str] = None


def normalize_rating(value: float, source_max: float = 10.0) -> float:
    """Normalize a rating to 0-10 scale."""
    if value < 0:
        return 0.0
    if value > source_max:
        return 10.0
    return round((value / source_max) * 10.0, 1)
