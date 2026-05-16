from rich.console import Console

from meme_fuda.models import Card
from meme_fuda.render import render_card, render_card_plain, render_thumbnail
from meme_fuda.templates import BY_ID, TEMPLATES


def _capture(renderable, width: int = 80) -> str:
    console = Console(record=True, force_terminal=False, width=width, color_system=None)
    console.print(renderable)
    return console.export_text()


def test_render_card_shows_template_name():
    c = Card(template_id="ureshii", top="孫が来た", bottom="お茶を出した",
             speaker="ばあちゃん", writer="ちひろ")
    out = _capture(render_card(c))
    assert "うれしい" in out
    assert "孫が来た" in out
    assert "お茶を出した" in out
    assert "話: ばあちゃん" in out
    assert "書: ちひろ" in out


def test_render_card_empty_shows_hints():
    c = Card(template_id="ureshii")
    out = _capture(render_card(c))
    t = BY_ID["ureshii"]
    assert t.hint_top in out
    assert t.hint_bottom in out


def test_render_card_contains_kaomoji():
    c = Card(template_id="ureshii", top="A", bottom="B")
    out = _capture(render_card(c))
    # at least the first kaomoji line should appear
    line = BY_ID["ureshii"].kaomoji_lines[0].strip()
    assert any(ch in out for ch in line if ch.strip())


def test_render_card_includes_tags():
    c = Card(template_id="natsukashii", top="x", bottom="y", tags=["昭和", "旅行"])
    out = _capture(render_card(c))
    assert "#昭和" in out
    assert "#旅行" in out


def test_render_card_plain_has_frame_and_content():
    c = Card(template_id="ureshii", top="x", bottom="y")
    p = render_card_plain(c)
    assert p.startswith("╭")
    assert "うれしい" in p
    assert "x" in p
    assert "y" in p


def test_render_thumbnail_shows_short_text():
    c = Card(template_id="ureshii", top="hello", bottom="world")
    out = _capture(render_thumbnail(c))
    assert "うれしい" in out
    assert "hello" in out
    assert "world" in out


def test_render_renders_every_template_without_error():
    for t in TEMPLATES:
        c = Card(template_id=t.id, top="a", bottom="b",
                 speaker="s", writer="w", tags=["x"])
        out = _capture(render_card(c))
        assert t.name in out
