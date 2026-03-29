"""Tests for CSV parsers."""

import pytest
from datetime import date

from lib.models import Movie, normalize_rating
from lib.parsers import parse_letterboxd_csv, parse_imdb_csv, detect_and_parse


LETTERBOXD_CSV = """Date,Name,Year,Letterboxd URI,Rating,Rewatch,Tags
2026-01-15,The Matrix,1999,https://letterboxd.com/film/the-matrix/,4.5,,
2026-02-20,Inception,2010,https://letterboxd.com/film/inception/,5,,
2026-03-01,Barbie,2023,https://letterboxd.com/film/barbie/,3,,sci-fi
"""

IMDB_CSV = """Const,Your Rating,Date Rated,Title,URL,Title Type,IMDb Rating,Runtime (mins),Year,Genres,Num Votes,Release Date,Directors
tt0133093,9,2026-01-15,The Matrix,https://imdb.com/title/tt0133093/,movie,8.7,136,1999,"Action, Sci-Fi",1900000,1999-03-31,Lana Wachowski
tt1375666,10,2026-02-20,Inception,https://imdb.com/title/tt1375666/,movie,8.8,148,2010,"Action, Adventure, Sci-Fi",2300000,2010-07-16,Christopher Nolan
"""


class TestNormalizeRating:
    def test_five_scale(self):
        assert normalize_rating(4.5, 5.0) == 9.0

    def test_ten_scale(self):
        assert normalize_rating(7.0, 10.0) == 7.0

    def test_negative(self):
        assert normalize_rating(-1, 10.0) == 0.0

    def test_over_max(self):
        assert normalize_rating(12, 10.0) == 10.0


class TestLetterboxdParser:
    def test_parses_movies(self):
        movies = parse_letterboxd_csv(LETTERBOXD_CSV)
        assert len(movies) == 3

    def test_title(self):
        movies = parse_letterboxd_csv(LETTERBOXD_CSV)
        assert movies[0].title == "The Matrix"

    def test_date(self):
        movies = parse_letterboxd_csv(LETTERBOXD_CSV)
        assert movies[0].date_watched == date(2026, 1, 15)

    def test_rating_normalized(self):
        movies = parse_letterboxd_csv(LETTERBOXD_CSV)
        assert movies[0].rating == 9.0  # 4.5/5 * 10

    def test_year(self):
        movies = parse_letterboxd_csv(LETTERBOXD_CSV)
        assert movies[0].year == 1999

    def test_empty_csv(self):
        movies = parse_letterboxd_csv("Date,Name,Year,Letterboxd URI,Rating\n")
        assert movies == []


class TestImdbParser:
    def test_parses_movies(self):
        movies = parse_imdb_csv(IMDB_CSV)
        assert len(movies) == 2

    def test_title(self):
        movies = parse_imdb_csv(IMDB_CSV)
        assert movies[0].title == "The Matrix"

    def test_genres(self):
        movies = parse_imdb_csv(IMDB_CSV)
        assert "Action" in movies[0].genres
        assert "Sci-Fi" in movies[0].genres

    def test_director(self):
        movies = parse_imdb_csv(IMDB_CSV)
        assert movies[1].director == "Christopher Nolan"

    def test_runtime(self):
        movies = parse_imdb_csv(IMDB_CSV)
        assert movies[0].runtime_minutes == 136

    def test_imdb_id(self):
        movies = parse_imdb_csv(IMDB_CSV)
        assert movies[0].imdb_id == "tt0133093"

    def test_rating_ten_scale(self):
        movies = parse_imdb_csv(IMDB_CSV)
        assert movies[0].rating == 9.0


class TestAutoDetect:
    def test_detects_imdb(self):
        movies, source = detect_and_parse(IMDB_CSV)
        assert source == "IMDb"
        assert len(movies) == 2

    def test_detects_letterboxd(self):
        movies, source = detect_and_parse(LETTERBOXD_CSV)
        assert source == "Letterboxd"
        assert len(movies) == 3
