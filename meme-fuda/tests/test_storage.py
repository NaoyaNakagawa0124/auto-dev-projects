import json
from pathlib import Path

from meme_fuda.models import Card, Deck
from meme_fuda.storage import load, save


def test_load_missing_returns_empty_deck(tmp_path: Path):
    p = tmp_path / "nope.json"
    deck = load(p)
    assert isinstance(deck, Deck)
    assert deck.cards == []


def test_load_garbage_returns_empty_deck(tmp_path: Path):
    p = tmp_path / "bad.json"
    p.write_text("not json {{", encoding="utf-8")
    deck = load(p)
    assert deck.cards == []


def test_save_then_load_roundtrip(tmp_path: Path):
    p = tmp_path / "deck.json"
    deck = Deck()
    deck.add(Card(template_id="ureshii", top="A", bottom="B",
                   speaker="me", writer="you", tags=["happy"]))
    save(deck, p)
    raw = json.loads(p.read_text(encoding="utf-8"))
    assert raw["cards"][0]["top"] == "A"
    deck2 = load(p)
    assert deck2.cards[0].speaker == "me"
    assert deck2.cards[0].tags == ["happy"]


def test_save_creates_parent_dir(tmp_path: Path):
    deep = tmp_path / "x" / "y" / "deck.json"
    save(Deck(), deep)
    assert deep.exists()


def test_save_no_temp_leftover(tmp_path: Path):
    p = tmp_path / "deck.json"
    save(Deck(), p)
    leftovers = list(tmp_path.glob(".meme-fuda.*"))
    assert leftovers == []
