"""Render functions for tane-kawase — pure-ish, return Rich renderables."""

from __future__ import annotations

from rich.console import Group
from rich.panel import Panel
from rich.text import Text

from .models import Field, Packet, Seed
from .topics import BY_KEY, TOPICS, Topic, get_or_default


DIM = "#6b6458"
INK = "#dccba6"
ACCENT = "#d4b06a"
ERR = "#c45663"


def _crop_row(topic: Topic, count: int, max_count: int = 12) -> Text:
    t = Text(no_wrap=True)
    if count <= 0:
        t.append("·", style=DIM)
        return t
    shown = min(count, max_count)
    for _ in range(shown):
        t.append(f"{topic.glyph} ", style=topic.color)
    if count > max_count:
        t.append(f"+{count - max_count}", style=topic.color)
    return t


def render_field(field: Field) -> Group:
    title = Text()
    title.append("\n            ━━━━ ", style=DIM)
    if field.my_name:
        title.append(f"{field.my_name} の畑 ", style=f"bold {ACCENT}")
    else:
        title.append("あなたの畑 ", style=f"bold {ACCENT}")
    title.append("━━━━\n", style=DIM)

    rows = Text()
    for topic in TOPICS:
        rows.append(f"  {topic.name:<5} ", style=f"bold {topic.color}")
        seeds_count = sum(len(p.seeds) for p in field.packets_by_topic(topic.key))
        crops = _crop_row(topic, seeds_count)
        rows.append_text(crops)
        # right-side description
        packets = field.packets_by_topic(topic.key)
        rows.append(f"   {seeds_count} 種  ", style=DIM)
        if packets:
            senders = field.senders_for_topic(topic.key)
            if senders:
                src = "・".join(senders)
                rows.append(f"({len(packets)} 包 / {src})", style=DIM)
            else:
                rows.append(f"({len(packets)} 包)", style=DIM)
        else:
            rows.append("(まだ)", style=DIM)
        rows.append("\n")

    # Activity footer
    footer = Text()
    footer.append("\n")
    last_in = field.latest_received()
    last_out = field.latest_sent()
    if last_in:
        topic = get_or_default(last_in.topic)
        footer.append("  最近もらった: ", style=DIM)
        footer.append(f"「{last_in.name}」", style=f"bold {topic.color}")
        if last_in.sender:
            footer.append(" from ", style=DIM)
            footer.append(last_in.sender, style=ACCENT)
        footer.append(f"  —  {last_in.created_at[:10]}\n", style=DIM)
    if last_out:
        footer.append("  最近送った  : ", style=DIM)
        footer.append(f"「{last_out['name']}」", style=f"bold {INK}")
        if last_out.get("to"):
            footer.append(" to  ", style=DIM)
            footer.append(last_out["to"], style=ACCENT)
        when = (last_out.get("when") or "")[:10]
        if when:
            footer.append(f"  —  {when}", style=DIM)
        footer.append("\n")
    total_exchanged = field.total_packets() + len(field.sent_log)
    footer.append(f"  これまでに交わした包: {total_exchanged}", style=ACCENT)
    footer.append(f"  ／  ことば {field.total_seeds()}\n", style=DIM)

    return Group(title, rows, footer)


def render_packet(packet: Packet) -> Panel:
    topic = get_or_default(packet.topic)
    inner = Text()
    inner.append("\n")
    inner.append(f"  {topic.glyph}  ", style=f"bold {topic.color}")
    inner.append(f"{topic.name}", style=topic.color)
    if packet.language:
        inner.append(f"   〔言語: {packet.language}〕", style=DIM)
    inner.append("\n\n")

    if packet.sender:
        inner.append("  送り主 : ", style=DIM)
        inner.append(f"{packet.sender}", style=f"bold {ACCENT}")
        inner.append("\n")
    if packet.receiver:
        inner.append("  受け取り: ", style=DIM)
        inner.append(f"{packet.receiver}\n", style=INK)
    inner.append("  日付   : ", style=DIM)
    inner.append(f"{packet.created_at[:10]}\n\n", style=INK)

    if packet.letter:
        inner.append("  〜 手紙 〜\n", style=DIM)
        for line in packet.letter.splitlines():
            inner.append(f"  {line}\n", style=f"italic {INK}")
        inner.append("\n")

    inner.append(f"  〜 種 ({packet.size}) 〜\n", style=DIM)
    for i, seed in enumerate(packet.seeds, 1):
        inner.append(f"  {i:>2}. ", style=DIM)
        inner.append(f"{seed.term}", style=f"bold {topic.color}")
        if seed.reading:
            inner.append(f"  〔{seed.reading}〕", style=DIM)
        inner.append("\n")
        if seed.gloss:
            inner.append(f"      → {seed.gloss}\n", style=INK)
        if seed.example:
            inner.append(f"      例: {seed.example}\n", style=f"italic {DIM}")
        if seed.note:
            inner.append(f"      ※ {seed.note}\n", style=f"italic {ACCENT}")
    inner.append("\n")

    return Panel(
        inner,
        title=Text(f" {packet.name} ", style=f"bold {topic.color}"),
        border_style=DIM,
        padding=(0, 2),
    )


def render_stats(field: Field) -> Group:
    t = Text()
    t.append("\n  〜 種交わせ 帳 〜\n\n", style=f"bold {ACCENT}")
    t.append(f"  名前        : {field.my_name or '(まだ)'}\n", style=INK)
    t.append(f"  受けた包    : {field.total_packets():>4} 包\n", style=INK)
    t.append(f"  送った包    : {len(field.sent_log):>4} 包\n", style=INK)
    t.append(f"  畑のことば  : {field.total_seeds():>4} 種\n", style=INK)
    t.append(f"  収穫した    : {len(field.harvested):>4} 種\n", style=INK)
    t.append("\n  トピック別:\n", style=DIM)
    for topic in TOPICS:
        n_seeds = sum(len(p.seeds) for p in field.packets_by_topic(topic.key))
        n_packs = len(field.packets_by_topic(topic.key))
        t.append(f"    {topic.glyph} {topic.name:<5} ", style=topic.color)
        t.append(f"{n_seeds:>3} 種 / {n_packs:>2} 包\n", style=DIM)
    t.append("\n")
    return Group(t)
