import datetime as dt

from kisanae_chou.data import GENRES, SAMPLE_ANIME, SEASONAL_EVENTS


def test_sample_anime_count():
    assert len(SAMPLE_ANIME) >= 40


def test_sample_anime_unique_titles():
    titles = [a.title for a in SAMPLE_ANIME]
    assert len(titles) == len(set(titles))


def test_sample_anime_genres_valid():
    for a in SAMPLE_ANIME:
        assert a.genre in GENRES, f"{a.title} has bad genre {a.genre}"


def test_sample_anime_dates_valid():
    for a in SAMPLE_ANIME:
        assert a.start <= a.end, f"{a.title} start > end"
        assert a.episodes > 0


def test_seasonal_events_categories():
    valid = {"節気", "花", "野菜", "魚介", "果物"}
    for e in SEASONAL_EVENTS:
        assert e.category in valid


def test_seasonal_events_count():
    assert len(SEASONAL_EVENTS) >= 30


def test_seasonal_events_unique_names():
    names = [e.name for e in SEASONAL_EVENTS]
    assert len(names) == len(set(names))


def test_seasonal_events_colors_hex():
    for e in SEASONAL_EVENTS:
        assert e.color.startswith("#")
        assert len(e.color) == 7


def test_year_coverage():
    # Every month has at least one anime overlapping
    year = 2026
    for m in range(1, 13):
        m_start = dt.date(year, m, 1)
        m_end = dt.date(year, 12, 31) if m == 12 else dt.date(year, m + 1, 1) - dt.timedelta(days=1)
        active = [a for a in SAMPLE_ANIME if a.start <= m_end and a.end >= m_start]
        assert active, f"no anime in month {m}"
