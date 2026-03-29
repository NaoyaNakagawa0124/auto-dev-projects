"""Demo data for first-time users."""

from datetime import date
from .models import Movie

DEMO_MOVIES = [
    Movie("The Matrix", date(2026, 1, 5), 9.0, ["Action", "Sci-Fi"], "Lana Wachowski", 136, 1999),
    Movie("Inception", date(2026, 1, 12), 9.5, ["Action", "Sci-Fi", "Thriller"], "Christopher Nolan", 148, 2010),
    Movie("Parasite", date(2026, 1, 20), 10.0, ["Thriller", "Drama", "Comedy"], "Bong Joon-ho", 132, 2019),
    Movie("Spirited Away", date(2026, 1, 25), 9.0, ["Animation", "Fantasy", "Adventure"], "Hayao Miyazaki", 125, 2001),
    Movie("The Godfather", date(2026, 2, 2), 10.0, ["Crime", "Drama"], "Francis Ford Coppola", 175, 1972),
    Movie("Pulp Fiction", date(2026, 2, 8), 8.5, ["Crime", "Drama"], "Quentin Tarantino", 154, 1994),
    Movie("Everything Everywhere All at Once", date(2026, 2, 14), 9.0, ["Action", "Adventure", "Comedy"], "Daniel Kwan", 139, 2022),
    Movie("Blade Runner 2049", date(2026, 2, 20), 8.0, ["Sci-Fi", "Drama", "Thriller"], "Denis Villeneuve", 164, 2017),
    Movie("Moonlight", date(2026, 2, 28), 8.5, ["Drama"], "Barry Jenkins", 111, 2016),
    Movie("Mad Max: Fury Road", date(2026, 3, 1), 9.0, ["Action", "Adventure", "Sci-Fi"], "George Miller", 120, 2015),
    Movie("The Grand Budapest Hotel", date(2026, 3, 5), 8.0, ["Comedy", "Drama", "Adventure"], "Wes Anderson", 99, 2014),
    Movie("Interstellar", date(2026, 3, 10), 9.5, ["Sci-Fi", "Drama", "Adventure"], "Christopher Nolan", 169, 2014),
    Movie("Get Out", date(2026, 3, 12), 8.5, ["Horror", "Thriller"], "Jordan Peele", 104, 2017),
    Movie("La La Land", date(2026, 3, 15), 7.5, ["Musical", "Romance", "Drama"], "Damien Chazelle", 128, 2016),
    Movie("The Shawshank Redemption", date(2026, 3, 18), 10.0, ["Drama"], "Frank Darabont", 142, 1994),
    Movie("Whiplash", date(2026, 3, 20), 9.0, ["Drama", "Music"], "Damien Chazelle", 107, 2014),
    Movie("Dune", date(2026, 3, 22), 8.0, ["Sci-Fi", "Adventure", "Drama"], "Denis Villeneuve", 155, 2021),
    Movie("The Social Network", date(2026, 3, 24), 8.5, ["Drama", "Biography"], "David Fincher", 120, 2010),
    Movie("Arrival", date(2026, 3, 25), 9.0, ["Sci-Fi", "Drama"], "Denis Villeneuve", 116, 2016),
    Movie("Knives Out", date(2026, 3, 27), 8.0, ["Mystery", "Comedy", "Crime"], "Rian Johnson", 130, 2019),
]
