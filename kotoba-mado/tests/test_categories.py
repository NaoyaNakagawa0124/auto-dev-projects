from kotoba_mado.categories import BY_KEY, CATEGORIES, CATEGORY_KEYS, get, normalize_key


def test_six_categories_in_order():
    assert CATEGORY_KEYS == ("read", "listen", "speak", "write", "vocab", "grammar")
    assert len(CATEGORIES) == 6


def test_every_category_has_required_fields():
    for c in CATEGORIES:
        assert c.key and c.label and c.color.startswith("#") and c.glyph


def test_get_returns_category_or_none():
    assert get("read").key == "read"
    assert get("nope") is None


def test_normalize_key_accepts_japanese_labels():
    assert normalize_key("読む") == "read"
    assert normalize_key("聴く") == "listen"
    assert normalize_key("文法") == "grammar"
    assert normalize_key("単語") == "vocab"


def test_normalize_key_handles_prefix_and_case():
    assert normalize_key("READ") == "read"
    assert normalize_key("li") == "listen"
    assert normalize_key("vo") == "vocab"


def test_normalize_key_returns_none_for_garbage():
    assert normalize_key("") is None
    assert normalize_key(None) is None
    assert normalize_key("blahblah") is None
