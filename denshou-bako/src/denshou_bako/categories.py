"""Seven categories of wisdom questions."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Category:
    key: str
    name: str       # Japanese display
    glyph: str      # one-cell glyph for CLI display
    color: str      # hex
    blurb: str


CATEGORIES: tuple[Category, ...] = (
    Category("philosophy",  "仕事の哲学",     "★", "#c89238", "なぜ働いてきたか"),
    Category("people",      "ひととの距離",   "◯", "#c0563b", "上司・部下・取引先"),
    Category("money",       "お金の感覚",     "¥", "#6fa05a", "予算・損益・投資"),
    Category("failure",     "失敗から学んだ", "✕", "#a0563b", "高くついた判断"),
    Category("tools",       "道具と現場",     "⌶", "#6b4a32", "ものと身体の記憶"),
    Category("era",         "時代の変化",     "↻", "#a08abf", "業界の 30 年"),
    Category("legacy",      "後輩へ",         "→", "#b8945b", "もし 1 人だけ伝えるなら"),
)


BY_KEY: dict[str, Category] = {c.key: c for c in CATEGORIES}


def get(key: str) -> Category | None:
    return BY_KEY.get(key)
