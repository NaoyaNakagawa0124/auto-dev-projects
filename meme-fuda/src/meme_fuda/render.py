"""Pure render functions — return Rich renderables.

The goal is a calm, large, "和紙" feel — generous padding, soft borders,
no harsh colors. Suitable for senior eyes.
"""

from __future__ import annotations

from rich.console import Group
from rich.panel import Panel
from rich.text import Text

from .models import Card
from .templates import Template, get_or_default


PALETTES = {
    "gold":   "#b8945b",
    "rouge":  "#c47b76",
    "indigo": "#5b6f8c",
}
INK = "#2b2820"
INK_BOLD = "bold #2b2820"
DIM = "#7a7466"
DIM_FRAME = "#9a9080"
PAPER_HINT = "#c0b8a4"  # for unfilled top/bottom


def _accent(template: Template) -> str:
    return PALETTES.get(template.accent, PALETTES["gold"])


def render_card(card: Card, template: Template | None = None) -> Panel:
    """Render a fully-shaped meme card as a Rich Panel.

    Empty `top` / `bottom` are rendered as faint hint text using template's hints.
    """
    template = template or get_or_default(card.template_id)
    accent = _accent(template)

    inner = Text(justify="center")
    inner.append("\n")

    # Top text
    if card.top:
        inner.append(card.top + "\n", style=INK_BOLD)
    else:
        inner.append(f"({template.hint_top})\n", style=PAPER_HINT)
    inner.append("\n")

    # Kaomoji body
    for line in template.kaomoji_lines:
        inner.append(line + "\n", style=accent)
    inner.append("\n")

    # Bottom text
    if card.bottom:
        inner.append(card.bottom + "\n", style=INK_BOLD)
    else:
        inner.append(f"({template.hint_bottom})\n", style=PAPER_HINT)

    # Footer
    footer = Text(justify="center")
    footer.append("\n")
    parts: list[str] = []
    if card.speaker:
        parts.append(f"話: {card.speaker}")
    if card.writer:
        parts.append(f"書: {card.writer}")
    if card.created_at:
        date_part = card.created_at[:10]
        parts.append(date_part)
    if parts:
        footer.append("  ／  ".join(parts), style=DIM)
    if card.tags:
        footer.append("\n")
        footer.append("  ".join(f"#{t}" for t in card.tags), style=accent)

    return Panel(
        Group(inner, footer),
        title=Text(f" {template.name} ", style=f"bold {accent}"),
        border_style=DIM_FRAME,
        padding=(0, 4),
        width=44,
    )


def render_card_plain(card: Card, template: Template | None = None) -> str:
    """Plain-text render — useful for tests and `--export` later."""
    template = template or get_or_default(card.template_id)
    lines: list[str] = []
    lines.append(f"╭─── {template.name} ───╮")
    lines.append(card.top or f"({template.hint_top})")
    lines.append("")
    lines.extend(template.kaomoji_lines)
    lines.append("")
    lines.append(card.bottom or f"({template.hint_bottom})")
    foot_parts: list[str] = []
    if card.speaker:
        foot_parts.append(f"話: {card.speaker}")
    if card.writer:
        foot_parts.append(f"書: {card.writer}")
    if card.created_at:
        foot_parts.append(card.created_at[:10])
    if foot_parts:
        lines.append("─" * 20)
        lines.append("  ／  ".join(foot_parts))
    if card.tags:
        lines.append("  ".join(f"#{t}" for t in card.tags))
    lines.append("╰─────────────────╯")
    return "\n".join(lines)


def render_thumbnail(card: Card, template: Template | None = None, width: int = 28) -> Text:
    """A small one-line-per-section preview for deck list views."""
    template = template or get_or_default(card.template_id)
    accent = _accent(template)
    t = Text(no_wrap=True)
    t.append(f" {template.name:<5} ", style=f"bold {accent}")
    short_top = (card.top or template.hint_top)[:18]
    short_bottom = (card.bottom or template.hint_bottom)[:18]
    t.append(f" {short_top:<20}", style=INK)
    t.append(" ／ ", style=DIM)
    t.append(f"{short_bottom:<20} ", style=INK)
    return t
