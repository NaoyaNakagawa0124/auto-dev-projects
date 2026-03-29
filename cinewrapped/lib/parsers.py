"""CSV parsers for Letterboxd and IMDb exports."""

import csv
import io
from datetime import date, datetime
from typing import Optional

import pandas as pd

from .models import Movie, normalize_rating


def parse_letterboxd_csv(file_content: str | io.BytesIO) -> list[Movie]:
    """Parse a Letterboxd diary.csv export.

    Expected columns: Date, Name, Year, Letterboxd URI, Rating, Rewatch, Tags
    """
    if isinstance(file_content, io.BytesIO):
        file_content = file_content.read().decode("utf-8")

    movies = []
    reader = csv.DictReader(io.StringIO(file_content))

    for row in reader:
        title = row.get("Name", "").strip()
        if not title:
            continue

        date_str = row.get("Date", "").strip()
        if not date_str:
            continue

        try:
            date_watched = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            continue

        rating_str = row.get("Rating", "").strip()
        rating = None
        if rating_str:
            try:
                rating = normalize_rating(float(rating_str), source_max=5.0)
            except ValueError:
                pass

        year_str = row.get("Year", "").strip()
        year = None
        if year_str:
            try:
                year = int(year_str)
            except ValueError:
                pass

        movies.append(Movie(
            title=title,
            date_watched=date_watched,
            rating=rating,
            year=year,
        ))

    return movies


def parse_imdb_csv(file_content: str | io.BytesIO) -> list[Movie]:
    """Parse an IMDb ratings.csv export.

    Expected columns: Const, Your Rating, Date Rated, Title, URL, Title Type,
    IMDb Rating, Runtime (mins), Year, Genres, Num Votes, Release Date, Directors
    """
    if isinstance(file_content, io.BytesIO):
        file_content = file_content.read().decode("utf-8")

    movies = []
    reader = csv.DictReader(io.StringIO(file_content))

    for row in reader:
        title = row.get("Title", "").strip()
        if not title:
            continue

        date_str = row.get("Date Rated", "").strip()
        if not date_str:
            continue

        try:
            date_watched = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            continue

        rating_str = row.get("Your Rating", "").strip()
        rating = None
        if rating_str:
            try:
                rating = normalize_rating(float(rating_str), source_max=10.0)
            except ValueError:
                pass

        genres_str = row.get("Genres", "").strip()
        genres = [g.strip() for g in genres_str.split(",") if g.strip()] if genres_str else []

        director = row.get("Directors", "").strip() or None

        runtime_str = row.get("Runtime (mins)", "").strip()
        runtime = None
        if runtime_str:
            try:
                runtime = int(runtime_str)
            except ValueError:
                pass

        year_str = row.get("Year", "").strip()
        year = None
        if year_str:
            try:
                year = int(year_str)
            except ValueError:
                pass

        imdb_id = row.get("Const", "").strip() or None

        movies.append(Movie(
            title=title,
            date_watched=date_watched,
            rating=rating,
            genres=genres,
            director=director,
            runtime_minutes=runtime,
            year=year,
            imdb_id=imdb_id,
        ))

    return movies


def detect_and_parse(file_content: str | io.BytesIO) -> tuple[list[Movie], str]:
    """Auto-detect CSV format and parse. Returns (movies, source_name)."""
    if isinstance(file_content, io.BytesIO):
        file_content = file_content.read().decode("utf-8")

    first_line = file_content.split("\n")[0].lower()

    if "const" in first_line and "your rating" in first_line:
        return parse_imdb_csv(file_content), "IMDb"
    elif "letterboxd" in first_line or ("name" in first_line and "rating" in first_line and "date" in first_line):
        return parse_letterboxd_csv(file_content), "Letterboxd"
    else:
        # Try Letterboxd format as fallback
        movies = parse_letterboxd_csv(file_content)
        if movies:
            return movies, "Letterboxd (detected)"
        return parse_imdb_csv(file_content), "IMDb (detected)"
