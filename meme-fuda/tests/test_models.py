from meme_fuda.models import Card, Deck


def test_card_normalizes_and_clamps():
    c = Card(
        template_id="ureshii",
        top="  hello  ",
        bottom="x" * 60,
        speaker=" me ",
        writer=" you ",
        tags=["  a  ", "", "  b  ", None],
    )
    assert c.top == "hello"
    assert len(c.bottom) == 40
    assert c.speaker == "me"
    assert c.writer == "you"
    assert c.tags == ["a", "b"]


def test_card_empty_means_no_text():
    c = Card(template_id="ureshii")
    assert c.empty is True
    c2 = Card(template_id="ureshii", top="x")
    assert c2.empty is False


def test_card_roundtrip_preserves_id_and_timestamp():
    c = Card(template_id="ureshii", top="A", bottom="B", speaker="s", writer="w", tags=["x"])
    d = c.to_dict()
    c2 = Card.from_dict(d)
    assert c2.id == c.id
    assert c2.created_at == c.created_at
    assert c2.top == "A"
    assert c2.tags == ["x"]


def test_deck_add_remove_find_replace():
    deck = Deck()
    c1 = Card(template_id="ureshii", top="x")
    c2 = Card(template_id="komatta", top="y")
    deck.add(c1)
    deck.add(c2)
    assert len(deck.cards) == 2
    assert deck.find(c1.id) is c1
    # replace
    c1_edited = Card(template_id=c1.template_id, top="changed",
                     bottom=c1.bottom, speaker=c1.speaker, writer=c1.writer,
                     tags=c1.tags, created_at=c1.created_at, id=c1.id)
    assert deck.replace(c1_edited) is True
    assert deck.find(c1.id).top == "changed"
    # remove
    assert deck.remove(c2.id) is True
    assert len(deck.cards) == 1
    # remove missing
    assert deck.remove("does-not-exist") is False


def test_deck_roundtrip_via_dict():
    deck = Deck()
    deck.add(Card(template_id="ureshii", top="hello", bottom="world"))
    d = deck.to_dict()
    assert d["version"] == 1
    assert len(d["cards"]) == 1
    deck2 = Deck.from_dict(d)
    assert deck2.cards[0].top == "hello"


def test_deck_from_empty_dict():
    assert Deck.from_dict(None).cards == []
    assert Deck.from_dict({}).cards == []
