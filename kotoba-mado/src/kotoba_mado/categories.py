"""Categories: ordered list of activity kinds with their colors and glyphs."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Category:
    key: str
    label: str        # short Japanese label
    color: str        # hex string e.g. "#2a3f6e"
    glyph: str        # single-cell glyph for cell rendering


# Order matters — appears in legend, summary table, palette grouping
CATEGORIES: tuple[Category, ...] = (
    Category("read",    "読む",   "#2a3f6e", "▓"),  # 藍
    Category("listen",  "聴く",   "#d49a3f", "▒"),  # 琥珀
    Category("speak",   "話す",   "#a8453c", "░"),  # 朱
    Category("write",   "書く",   "#4a7d5a", "▚"),  # 翠
    Category("vocab",   "単語",   "#7a5a8c", "▞"),  # 紫
    Category("grammar", "文法",   "#c8a248", "◆"),  # 金
)


CATEGORY_KEYS: tuple[str, ...] = tuple(c.key for c in CATEGORIES)
BY_KEY: dict[str, Category] = {c.key: c for c in CATEGORIES}


def get(key: str) -> Category | None:
    return BY_KEY.get(key)


def normalize_key(s: str) -> str | None:
    """Accept fuzzy input — partial, English, Japanese — return canonical key."""
    if not s:
        return None
    s = s.strip().lower()
    if s in BY_KEY:
        return s
    # match prefix
    for c in CATEGORIES:
        if c.key.startswith(s) or s.startswith(c.key):
            return c.key
    # Japanese labels
    label_to_key = {
        "読む": "read", "読": "read", "リーディング": "read",
        "聴く": "listen", "聴": "listen", "リスニング": "listen",
        "話す": "speak", "話": "speak", "スピーキング": "speak",
        "書く": "write", "書": "write", "ライティング": "write",
        "単語": "vocab", "語彙": "vocab", "ボキャブ": "vocab",
        "文法": "grammar", "グラマー": "grammar",
    }
    return label_to_key.get(s)
