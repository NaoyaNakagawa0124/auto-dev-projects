import pytest

from tane_kawase.models import Field, Packet, Seed


def test_seed_requires_term():
    with pytest.raises(ValueError):
        Seed(term="")
    s = Seed(term="hello", gloss="あいさつ")
    assert s.term == "hello"


def test_seed_trims_and_clamps():
    s = Seed(term="  hi  ", gloss="x" * 200)
    assert s.term == "hi"
    assert len(s.gloss) == 120


def test_packet_validates_topic_and_name():
    with pytest.raises(ValueError):
        Packet(name="x", topic="nope")
    with pytest.raises(ValueError):
        Packet(name="", topic="haru_na")
    p = Packet(name="春", topic="haru_na", seeds=[Seed(term="a")])
    assert p.size == 1


def test_packet_drops_empty_seeds_silently():
    # Empty Seed would raise ValueError, but a Seed with term then mutated isn't possible.
    p = Packet(name="x", topic="haru_na", seeds=[Seed(term="a"), Seed(term="b")])
    assert p.size == 2


def test_packet_roundtrip():
    p = Packet(
        name="秋", topic="aki_koku", sender="me", receiver="you",
        language="en", letter="hello",
        seeds=[Seed(term="harvest", gloss="収穫")],
    )
    d = p.to_dict()
    p2 = Packet.from_dict(d)
    assert p2.size == 1
    assert p2.sender == "me"
    assert p2.id == p.id
    assert p2.seeds[0].gloss == "収穫"


def test_field_plant_and_lookup():
    f = Field()
    p = Packet(name="x", topic="haru_na", sender="A", seeds=[Seed(term="a"), Seed(term="b")])
    f.plant(p)
    assert f.total_packets() == 1
    assert f.total_seeds() == 2
    assert len(f.seeds_by_topic("haru_na")) == 2
    assert f.packets_by_topic("aki_koku") == []
    assert f.senders_for_topic("haru_na") == ["A"]


def test_field_harvest_marks_seed():
    f = Field()
    s = Seed(term="a")
    p = Packet(name="x", topic="haru_na", seeds=[s])
    f.plant(p)
    assert f.harvest(s.id) is True
    assert f.harvest(s.id) is False  # already
    assert f.harvest("does-not-exist") is False


def test_field_record_sent_appends_log():
    f = Field()
    p = Packet(name="x", topic="haru_na", sender="me", receiver="you",
                seeds=[Seed(term="a")])
    f.record_sent(p)
    assert len(f.sent_log) == 1
    entry = f.sent_log[0]
    assert entry["to"] == "you"
    assert entry["name"] == "x"


def test_field_roundtrip():
    f = Field(my_name="ちあき")
    f.plant(Packet(name="x", topic="haru_na", sender="A", seeds=[Seed(term="a")]))
    f.record_sent(Packet(name="y", topic="aki_koku", sender="ちあき", receiver="B",
                          seeds=[Seed(term="b")]))
    d = f.to_dict()
    f2 = Field.from_dict(d)
    assert f2.my_name == "ちあき"
    assert f2.total_packets() == 1
    assert len(f2.sent_log) == 1


def test_field_latest_received_returns_most_recent():
    f = Field()
    p1 = Packet(name="A", topic="haru_na", seeds=[Seed(term="a")])
    p2 = Packet(name="B", topic="haru_na", seeds=[Seed(term="b")])
    # Force timestamps
    p1.created_at = "2026-05-10T10:00:00"
    p2.created_at = "2026-05-17T10:00:00"
    f.plant(p1)
    f.plant(p2)
    assert f.latest_received().name == "B"
