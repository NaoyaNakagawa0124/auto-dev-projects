"""Tests for statistics engine."""

from lib.stats import compute_stats
from lib.demo_data import DEMO_MOVIES


class TestComputeStats:
    def test_empty_list(self):
        result = compute_stats([])
        assert result["total_movies"] == 0

    def test_total_movies(self):
        stats = compute_stats(DEMO_MOVIES)
        assert stats["total_movies"] == 20

    def test_total_hours(self):
        stats = compute_stats(DEMO_MOVIES)
        assert stats["total_hours"] > 0

    def test_avg_rating(self):
        stats = compute_stats(DEMO_MOVIES)
        assert 7.0 <= stats["avg_rating"] <= 10.0

    def test_genre_counts(self):
        stats = compute_stats(DEMO_MOVIES)
        assert len(stats["genre_counts"]) > 0
        assert "Sci-Fi" in stats["genre_counts"]

    def test_director_counts(self):
        stats = compute_stats(DEMO_MOVIES)
        assert "Denis Villeneuve" in stats["director_counts"]
        assert stats["director_counts"]["Denis Villeneuve"] == 3

    def test_highest_rated(self):
        stats = compute_stats(DEMO_MOVIES)
        assert stats["highest_rated"]["rating"] == 10.0

    def test_personality(self):
        stats = compute_stats(DEMO_MOVIES)
        assert stats["personality"]["name"] in [
            "The Cinephile", "The Binge Watcher", "The Genre Loyalist",
            "The Critic", "The Enthusiast", "The Explorer", "The Casual Viewer"
        ]

    def test_decade_counts(self):
        stats = compute_stats(DEMO_MOVIES)
        assert "2010s" in stats["decade_counts"]

    def test_day_of_week(self):
        stats = compute_stats(DEMO_MOVIES)
        assert len(stats["day_of_week"]) > 0

    def test_month_counts(self):
        stats = compute_stats(DEMO_MOVIES)
        assert "January" in stats["month_counts"]
        assert "March" in stats["month_counts"]
