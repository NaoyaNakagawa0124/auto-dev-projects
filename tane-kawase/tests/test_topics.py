from tane_kawase.topics import BY_KEY, BY_NAME, TOPICS, get, get_or_default


def test_five_topics_in_order():
    keys = [t.key for t in TOPICS]
    assert keys == ["haru_na", "natsu_yasai", "aki_koku", "fuyu_ne", "kusabana"]


def test_every_topic_has_glyph_and_color():
    for t in TOPICS:
        assert len(t.glyph) >= 1
        assert t.color.startswith("#")
        assert t.name
        assert t.blurb


def test_get_by_key_and_name():
    assert get("haru_na").key == "haru_na"
    assert get("春菜").key == "haru_na"


def test_get_prefix_match():
    assert get("haru").key == "haru_na"
    assert get("fuyu").key == "fuyu_ne"


def test_get_returns_none_for_garbage():
    assert get("") is None
    assert get("nope") is None


def test_get_or_default_falls_back():
    assert get_or_default("nope") == TOPICS[0]
    assert get_or_default(None) == TOPICS[0]
    assert get_or_default("kusabana").key == "kusabana"


def test_glyphs_are_unique():
    assert len({t.glyph for t in TOPICS}) == 5
