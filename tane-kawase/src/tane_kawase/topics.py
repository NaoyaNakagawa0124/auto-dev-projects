"""Topics: 5 seasonal vegetable themes with crop glyphs."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Topic:
    key: str            # internal stable
    name: str           # Japanese display name
    glyph: str          # single-cell crop character
    color: str          # hex
    blurb: str          # 1-line description


TOPICS: tuple[Topic, ...] = (
    Topic("haru_na",      "春菜",   "ψ", "#6fa05a", "新しいことば、 旬の発見"),
    Topic("natsu_yasai",  "夏野菜", "◯", "#c0563b", "動詞、 元気な表現"),
    Topic("aki_koku",     "秋穀",   "‖", "#c89238", "慣用句、 ことわざ"),
    Topic("fuyu_ne",      "冬根",   "▽", "#6b4a32", "形式・丁寧な言い回し"),
    Topic("kusabana",     "草花",   "✿", "#a08abf", "スラング、 砕けた表現"),
)

BY_KEY: dict[str, Topic] = {t.key: t for t in TOPICS}
BY_NAME: dict[str, Topic] = {t.name: t for t in TOPICS}


def get(key_or_name: str) -> Topic | None:
    if not key_or_name:
        return None
    k = key_or_name.strip().lower()
    if k in BY_KEY:
        return BY_KEY[k]
    # Try canonical key match
    if key_or_name.strip() in BY_NAME:
        return BY_NAME[key_or_name.strip()]
    # Prefix match on key (e.g. "haru" → haru_na)
    for t in TOPICS:
        if t.key.startswith(k):
            return t
    return None


def get_or_default(key: str | None) -> Topic:
    t = get(key) if key else None
    return t or TOPICS[0]
