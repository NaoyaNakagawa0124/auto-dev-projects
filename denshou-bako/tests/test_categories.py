from denshou_bako.categories import BY_KEY, CATEGORIES, get


def test_seven_categories_in_order():
    keys = [c.key for c in CATEGORIES]
    assert keys == ["philosophy", "people", "money", "failure", "tools", "era", "legacy"]


def test_every_category_has_required_fields():
    for c in CATEGORIES:
        assert c.name
        assert c.glyph
        assert c.color.startswith("#")
        assert c.blurb


def test_get_returns_category_or_none():
    assert get("people").key == "people"
    assert get("nope") is None


def test_by_key_complete():
    for c in CATEGORIES:
        assert BY_KEY[c.key] is c


def test_glyphs_are_distinct():
    assert len({c.glyph for c in CATEGORIES}) == 7
