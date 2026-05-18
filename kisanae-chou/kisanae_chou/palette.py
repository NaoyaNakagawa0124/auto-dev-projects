"""Monthly + genre palettes."""
from __future__ import annotations

MONTH_PALETTE = {
    1:  ("睦月", "#c3cfd6", "#9aa9b4"),  # 雪 グレー
    2:  ("如月", "#f0c4d4", "#d99ab2"),  # 梅 ピンク
    3:  ("弥生", "#f6cdc6", "#dca395"),  # 桃
    4:  ("卯月", "#fbcfd9", "#e8a3b3"),  # 桜
    5:  ("皐月", "#c3dba8", "#9abf80"),  # 若葉
    6:  ("水無月", "#a8b6d4", "#7c8cbf"),  # あじさい
    7:  ("文月", "#9ab6d4", "#6e95b8"),  # 朝顔 青
    8:  ("葉月", "#f0d878", "#d9b850"),  # 向日葵
    9:  ("長月", "#dcb89a", "#bb9070"),  # 萩
    10: ("神無月", "#e8b076", "#c98a50"),  # 金木犀
    11: ("霜月", "#c46a55", "#a05040"),  # 紅葉
    12: ("師走", "#dcdde0", "#a8acb4"),  # 雪 白
}


GENRE_COLORS = {
    "action":        "#c46a55",
    "drama":         "#7c8cbf",
    "slice_of_life": "#a8c878",
    "mystery":       "#5a4a78",
    "fantasy":       "#bd8ab8",
    "comedy":        "#e8c757",
    "horror":        "#3a4452",
}


CATEGORY_COLORS = {
    "節気": "#b0a890",
    "花":   "#d99ab2",
    "野菜": "#a8c878",
    "魚介": "#9abbd4",
    "果物": "#e88a8a",
}


def month_label(month: int) -> str:
    return MONTH_PALETTE[month][0]


def month_color(month: int, *, dark: bool = False) -> str:
    name, light, deep = MONTH_PALETTE[month]
    return deep if dark else light


def genre_color(genre: str) -> str:
    return GENRE_COLORS.get(genre, "#888888")


def category_color(category: str) -> str:
    return CATEGORY_COLORS.get(category, "#888888")


def year_palette() -> list[tuple[int, str, str]]:
    """Return [(month_idx, name, light hex)] in order."""
    return [(m, MONTH_PALETTE[m][0], MONTH_PALETTE[m][1]) for m in range(1, 13)]
