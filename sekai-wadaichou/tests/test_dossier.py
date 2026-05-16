from __future__ import annotations

import json
from pathlib import Path

import pytest

from sekai_wadaichou.dossier import Dossier, Entry


@pytest.fixture
def tmp_dossier(tmp_path: Path) -> Dossier:
    return Dossier(path=tmp_path / "dossier.json", entries=[])


def test_empty_load_when_file_missing(tmp_path: Path):
    d = Dossier.load(tmp_path / "nope.json")
    assert d.entries == []


def test_add_and_list(tmp_dossier: Dossier):
    assert tmp_dossier.add("tokyo") is True
    assert tmp_dossier.add("london") is True
    ids = [e.city_id for e in tmp_dossier.list_collected()]
    assert ids == ["tokyo", "london"]


def test_add_duplicate_returns_false(tmp_dossier: Dossier):
    tmp_dossier.add("tokyo")
    assert tmp_dossier.add("tokyo") is False
    assert len(tmp_dossier.entries) == 1


def test_remove(tmp_dossier: Dossier):
    tmp_dossier.add("tokyo")
    assert tmp_dossier.remove("tokyo") is True
    assert tmp_dossier.entries == []
    assert tmp_dossier.remove("tokyo") is False


def test_is_collected(tmp_dossier: Dossier):
    assert tmp_dossier.is_collected("tokyo") is False
    tmp_dossier.add("tokyo")
    assert tmp_dossier.is_collected("tokyo") is True


def test_save_then_load_roundtrip(tmp_path: Path):
    p = tmp_path / "dossier.json"
    d = Dossier(path=p, entries=[])
    d.add("tokyo", note="夜カフェ")
    d.add("paris")
    d.save()
    assert p.exists()
    re = Dossier.load(p)
    assert len(re.entries) == 2
    assert re.entries[0].city_id == "tokyo"
    assert re.entries[0].note == "夜カフェ"
    assert re.entries[1].city_id == "paris"


def test_save_is_atomic_no_temp_left(tmp_path: Path):
    p = tmp_path / "dossier.json"
    d = Dossier(path=p, entries=[])
    d.add("tokyo")
    d.save()
    # Make sure no leftover temp file remains in the dir.
    leftovers = [f for f in p.parent.iterdir() if f.name.startswith(".dossier-")]
    assert leftovers == []


def test_save_uses_utf8_for_japanese(tmp_path: Path):
    p = tmp_path / "dossier.json"
    d = Dossier(path=p, entries=[])
    d.add("tokyo", note="深夜の研究")
    d.save()
    raw = p.read_text(encoding="utf-8")
    assert "深夜の研究" in raw


def test_load_recovers_from_corrupt_json(tmp_path: Path):
    p = tmp_path / "dossier.json"
    p.write_text("{ not valid json", encoding="utf-8")
    d = Dossier.load(p)
    assert d.entries == []
