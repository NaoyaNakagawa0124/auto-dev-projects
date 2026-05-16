"""Today's cultural event somewhere in the world, indexed by month.

Each month points to one event (deliberately gentle and outward-facing).
The bot prepends a single framing phrase: "ゲーム を 閉じて 30 秒、 これに 思いを 馳せて みませんか。"
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date


@dataclass(frozen=True)
class CulturalEvent:
    month: int
    place: str
    title: str
    blurb: str   # one-line cultural detail, <= 80 chars


EVENTS: tuple[CulturalEvent, ...] = (
    CulturalEvent(1, "京都",       "初詣の松の内",         "三が日を過ぎても、 1 月の 7 日まで 京都の社寺は 静かに 訪れる人を 受けます。"),
    CulturalEvent(2, "ヴェネツィア", "謝肉祭 (カーニバル)", "仮面と運河の街が、 中世から続く仮装の祭で 2 月の冬を 照らします。"),
    CulturalEvent(3, "東京",       "桜の蕾の硬さ",        "ソメイヨシノは 3 月後半に開きますが、 蕾の段階で見上げる人が増えます。"),
    CulturalEvent(4, "アムステルダム", "国王の日",         "オランダ全土がオレンジ色に染まる 1 日、 街のあちこちで蚤の市が立ちます。"),
    CulturalEvent(5, "カンヌ",     "国際映画祭",          "5 月のカンヌは映画と海の街、 世界の物語が一度に集まる 2 週間です。"),
    CulturalEvent(6, "上海",       "梅雨の蘇州河",        "雨の路面に映る赤い灯籠が、 倉庫リノベのカフェ街を 不思議な質感にします。"),
    CulturalEvent(7, "ヘルシンキ",  "白夜の入口",          "7 月のフィンランドは 24 時間の薄明、 街中の人が湖畔のサウナへ向かいます。"),
    CulturalEvent(8, "ニューオリンズ", "ジャズ・サウンド",  "8 月の街角で、 ストリート・ジャズが空気の湿度ごと運ばれてきます。"),
    CulturalEvent(9, "京都",       "中秋の名月",          "旧暦 8 月 15 日の月を眺める習慣、 9 月の夜は団子と ススキが添えられます。"),
    CulturalEvent(10, "オアハカ",   "死者の日の準備",     "10 月末、 メキシコのオアハカでは家ごとに祭壇 (オフレンダ) が組まれ始めます。"),
    CulturalEvent(11, "リヨン",    "光の祭典の準備",     "11 月末からのリヨン光祭、 大聖堂や旧市街を 4 日間 光で包む準備期間です。"),
    CulturalEvent(12, "レイキャビク", "オーロラ晴間",     "12 月のアイスランドは 1 日 4 時間の太陽、 残りはオーロラの空が広がります。"),
)


def for_month(month: int) -> CulturalEvent:
    if not 1 <= month <= 12:
        raise ValueError(f"month out of range: {month}")
    return EVENTS[month - 1]


def for_date(d: date) -> CulturalEvent:
    return for_month(d.month)


PREFIX = "ゲーム を 閉じて 30 秒、 これに 思いを 馳せて みません か。"


def framed(d: date) -> str:
    e = for_date(d)
    return f"{PREFIX}\n{e.place} — {e.title}: {e.blurb}"
