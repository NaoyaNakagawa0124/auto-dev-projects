import json
from pathlib import Path

from futari_yoho.models import CheckIn, State
from futari_yoho.storage import load, save


def test_load_returns_empty_state_when_missing(tmp_path: Path):
    p = tmp_path / "nope.json"
    s = load(p)
    assert isinstance(s, State)
    assert s.days == {}
    assert set(s.partners.keys()) == {"a", "b"}


def test_save_then_load_roundtrip(tmp_path: Path):
    p = tmp_path / "data.json"
    s = State()
    s.record("a", "2026-05-17", CheckIn(mood=4, energy=3, solo_want=2, note="まる"))
    s.record("b", "2026-05-17", CheckIn(mood=2, energy=3, solo_want=4))
    save(s, p)
    assert p.exists()

    raw = json.loads(p.read_text(encoding="utf-8"))
    assert "days" in raw
    assert raw["days"]["2026-05-17"]["a"]["note"] == "まる"

    s2 = load(p)
    assert s2.day("2026-05-17").a.mood == 4
    assert s2.day("2026-05-17").b.solo_want == 4


def test_save_creates_parent_dir(tmp_path: Path):
    nested = tmp_path / "deep" / "nest" / "data.json"
    save(State(), nested)
    assert nested.exists()


def test_load_garbage_returns_empty_state(tmp_path: Path):
    p = tmp_path / "bad.json"
    p.write_text("not json{{", encoding="utf-8")
    s = load(p)
    assert isinstance(s, State)
    assert s.days == {}


def test_save_is_atomic_no_temp_leftovers(tmp_path: Path):
    p = tmp_path / "data.json"
    save(State(), p)
    leftovers = list(tmp_path.glob(".futari-yoho.*"))
    assert leftovers == []
