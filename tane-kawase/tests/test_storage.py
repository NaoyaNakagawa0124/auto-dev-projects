import json
from pathlib import Path

import pytest

from tane_kawase.models import Field, Packet, Seed
from tane_kawase.storage import (
    load_field,
    read_packet,
    save_field,
    write_packet,
)


def test_load_missing_returns_empty_field(tmp_path: Path):
    p = tmp_path / "nope.json"
    f = load_field(p)
    assert isinstance(f, Field)
    assert f.total_packets() == 0


def test_load_garbage_returns_empty(tmp_path: Path):
    p = tmp_path / "bad.json"
    p.write_text("not json {{", encoding="utf-8")
    f = load_field(p)
    assert f.total_packets() == 0


def test_save_then_load_roundtrip(tmp_path: Path):
    p = tmp_path / "field.json"
    f = Field(my_name="me")
    f.plant(Packet(name="春", topic="haru_na", sender="A",
                    seeds=[Seed(term="a"), Seed(term="b")]))
    save_field(f, p)
    raw = json.loads(p.read_text(encoding="utf-8"))
    assert raw["my_name"] == "me"
    f2 = load_field(p)
    assert f2.my_name == "me"
    assert f2.total_packets() == 1


def test_save_no_leftover_temp(tmp_path: Path):
    p = tmp_path / "field.json"
    save_field(Field(), p)
    leftovers = list(tmp_path.glob(".tane-kawase.*"))
    assert leftovers == []


def test_packet_roundtrip_file(tmp_path: Path):
    p = tmp_path / "packet.json"
    pkt = Packet(name="x", topic="aki_koku", sender="me", receiver="you",
                  language="en", seeds=[Seed(term="t", gloss="g")])
    write_packet(pkt, p)
    assert p.exists()
    pkt2 = read_packet(p)
    assert pkt2.name == "x"
    assert pkt2.size == 1
    assert pkt2.seeds[0].gloss == "g"


def test_read_packet_with_invalid_topic_raises(tmp_path: Path):
    p = tmp_path / "bad.json"
    p.write_text(json.dumps({"name": "x", "topic": "not_a_topic", "seeds": []}),
                  encoding="utf-8")
    with pytest.raises(ValueError):
        read_packet(p)
