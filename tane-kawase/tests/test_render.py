from rich.console import Console

from tane_kawase.models import Field, Packet, Seed
from tane_kawase.render import render_field, render_packet, render_stats
from tane_kawase.topics import TOPICS


def _capture(renderable, width: int = 100) -> str:
    console = Console(record=True, force_terminal=False, width=width, color_system=None)
    console.print(renderable)
    return console.export_text()


def test_render_field_empty_has_all_topics_and_zero_counts():
    out = _capture(render_field(Field(my_name="ちあき")))
    for t in TOPICS:
        assert t.name in out
    assert "0 種" in out
    assert "ちあき の畑" in out


def test_render_field_shows_crops_and_sender():
    f = Field(my_name="ちあき")
    f.plant(Packet(name="春", topic="haru_na", sender="さくら",
                    seeds=[Seed(term="a"), Seed(term="b"), Seed(term="c")]))
    out = _capture(render_field(f))
    assert "ψ" in out
    assert "さくら" in out
    assert "3 種" in out


def test_render_packet_contains_letter_and_seeds():
    p = Packet(name="秋", topic="aki_koku", sender="たくみ", receiver="ちあき",
                language="en", letter="今週の慣用句!",
                seeds=[
                    Seed(term="harvest the rewards", gloss="努力が実る"),
                    Seed(term="hit the books", gloss="勉強に集中する",
                          example="I need to hit the books."),
                ])
    out = _capture(render_packet(p))
    assert "今週の慣用句!" in out
    assert "harvest the rewards" in out
    assert "努力が実る" in out
    assert "たくみ" in out
    assert "ちあき" in out
    assert "I need to hit the books." in out


def test_render_packet_shows_topic_name():
    p = Packet(name="x", topic="kusabana",
                seeds=[Seed(term="hit me up")])
    out = _capture(render_packet(p))
    assert "草花" in out
    assert "hit me up" in out


def test_render_stats_includes_per_topic_counts():
    f = Field(my_name="me")
    f.plant(Packet(name="春", topic="haru_na",
                    seeds=[Seed(term="a"), Seed(term="b")]))
    out = _capture(render_stats(f))
    assert "2" in out  # seeds in haru_na
    for t in TOPICS:
        assert t.name in out


def test_render_field_with_many_seeds_shows_overflow():
    f = Field(my_name="me")
    seeds = [Seed(term=f"w{i}") for i in range(20)]
    f.plant(Packet(name="big", topic="haru_na", sender="X", seeds=seeds))
    out = _capture(render_field(f))
    # The renderer caps crops at 12 and shows +N
    assert "+8" in out
