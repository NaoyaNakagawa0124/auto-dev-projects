from kisanae_chou.palette import (
    GENRE_COLORS,
    MONTH_PALETTE,
    category_color,
    genre_color,
    month_color,
    month_label,
    year_palette,
)


def test_month_palette_has_12():
    assert set(MONTH_PALETTE.keys()) == set(range(1, 13))


def test_month_color_returns_hex():
    for m in range(1, 13):
        c = month_color(m)
        assert c.startswith("#")
        assert len(c) == 7


def test_month_color_dark_differs():
    for m in range(1, 13):
        assert month_color(m, dark=False) != month_color(m, dark=True)


def test_month_label_returns_kanji():
    assert month_label(1) == "睦月"
    assert month_label(12) == "師走"


def test_genre_colors_have_all_genres():
    expected = {"action", "drama", "slice_of_life", "mystery", "fantasy", "comedy", "horror"}
    assert set(GENRE_COLORS.keys()) == expected


def test_genre_color_fallback():
    assert genre_color("does-not-exist") == "#888888"


def test_category_color_known_and_unknown():
    assert category_color("節気").startswith("#")
    assert category_color("xxx") == "#888888"


def test_year_palette_ordered():
    p = year_palette()
    assert len(p) == 12
    assert p[0][0] == 1
    assert p[-1][0] == 12
