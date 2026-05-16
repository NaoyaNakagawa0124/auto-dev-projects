from meme_fuda.templates import BY_ID, TEMPLATES, get, get_or_default


def test_twelve_templates():
    assert len(TEMPLATES) == 12
    ids = {t.id for t in TEMPLATES}
    assert len(ids) == 12  # all unique


def test_every_template_has_kaomoji_and_hints():
    for t in TEMPLATES:
        assert t.kaomoji_lines  # non-empty
        assert all(isinstance(s, str) and s for s in t.kaomoji_lines)
        assert t.hint_top
        assert t.hint_bottom
        assert t.name


def test_get_returns_template_or_none():
    assert get("ureshii").id == "ureshii"
    assert get("nope") is None


def test_get_or_default_falls_back_to_first():
    assert get_or_default(None) == TEMPLATES[0]
    assert get_or_default("nope") == TEMPLATES[0]
    assert get_or_default("ureshii").id == "ureshii"


def test_accent_values_are_known():
    allowed = {"gold", "rouge", "indigo"}
    for t in TEMPLATES:
        assert t.accent in allowed


def test_by_id_index_complete():
    for t in TEMPLATES:
        assert BY_ID[t.id] is t
