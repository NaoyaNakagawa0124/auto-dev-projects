"""Sample anime + Japanese seasonal events for 2026."""
from __future__ import annotations

import datetime as _dt
from dataclasses import dataclass
from typing import List


@dataclass(frozen=True)
class AnimeShow:
    title: str
    start: _dt.date
    end: _dt.date
    episodes: int
    genre: str  # action / drama / slice_of_life / mystery / fantasy / comedy / horror


GENRES = (
    "action",
    "drama",
    "slice_of_life",
    "mystery",
    "fantasy",
    "comedy",
    "horror",
)


def _d(s: str) -> _dt.date:
    return _dt.date.fromisoformat(s)


SAMPLE_ANIME: List[AnimeShow] = [
    # Winter cour 2026-01-06 ~ 2026-03-24
    AnimeShow("夜 桜 食堂", _d("2026-01-08"), _d("2026-03-26"), 12, "drama"),
    AnimeShow("零下 の 約束", _d("2026-01-09"), _d("2026-03-27"), 11, "action"),
    AnimeShow("白菜 と 黒 猫", _d("2026-01-11"), _d("2026-03-29"), 12, "slice_of_life"),
    AnimeShow("逆 時 計 学園", _d("2026-01-12"), _d("2026-03-23"), 11, "mystery"),
    AnimeShow("月 蝕 オーケストラ", _d("2026-01-14"), _d("2026-03-25"), 12, "fantasy"),
    AnimeShow("七 草 探偵 社", _d("2026-01-07"), _d("2026-03-25"), 12, "mystery"),
    AnimeShow("零 番 ホーム の 風", _d("2026-01-15"), _d("2026-03-26"), 11, "drama"),
    AnimeShow("吐息 ドラフト", _d("2026-01-22"), _d("2026-03-26"), 10, "comedy"),
    # Spring cour 2026-04-01 ~ 2026-06-24
    AnimeShow("桜 守 戦線", _d("2026-04-08"), _d("2026-06-24"), 12, "fantasy"),
    AnimeShow("路面 電車 と コーヒー", _d("2026-04-05"), _d("2026-06-21"), 12, "slice_of_life"),
    AnimeShow("4 月 の 嘘", _d("2026-04-04"), _d("2026-06-20"), 12, "drama"),
    AnimeShow("天 文 部 と 双子 座", _d("2026-04-09"), _d("2026-06-25"), 12, "mystery"),
    AnimeShow("ひば り 食 卓", _d("2026-04-12"), _d("2026-06-21"), 11, "slice_of_life"),
    AnimeShow("旋律 と 春雷", _d("2026-04-14"), _d("2026-06-23"), 11, "action"),
    AnimeShow("筍 の 革 命", _d("2026-04-19"), _d("2026-06-21"), 10, "comedy"),
    AnimeShow("八十 八 夜 の 約束", _d("2026-04-22"), _d("2026-07-01"), 11, "drama"),
    # Summer cour 2026-07-01 ~ 2026-09-23
    AnimeShow("湿 度 100 探偵", _d("2026-07-04"), _d("2026-09-19"), 12, "mystery"),
    AnimeShow("夏 至 ストライク", _d("2026-06-26"), _d("2026-09-11"), 11, "action"),
    AnimeShow("青 田 と 妖 怪", _d("2026-07-08"), _d("2026-09-23"), 12, "fantasy"),
    AnimeShow("蝉 時 雨 ロック", _d("2026-07-12"), _d("2026-09-20"), 11, "drama"),
    AnimeShow("素麺 部 の 夏", _d("2026-07-09"), _d("2026-09-17"), 11, "comedy"),
    AnimeShow("入道 雲 観 測 班", _d("2026-07-16"), _d("2026-09-24"), 11, "slice_of_life"),
    AnimeShow("熱帯 夜 怪 談", _d("2026-08-01"), _d("2026-09-26"), 9, "horror"),
    AnimeShow("枝豆 と 銀河", _d("2026-07-23"), _d("2026-10-01"), 11, "fantasy"),
    # Autumn cour 2026-10-01 ~ 2026-12-25
    AnimeShow("十 五 夜 探偵 局", _d("2026-10-02"), _d("2026-12-18"), 12, "mystery"),
    AnimeShow("紅葉 列 車", _d("2026-10-05"), _d("2026-12-21"), 12, "slice_of_life"),
    AnimeShow("彼岸 花 と 鉄道 員", _d("2026-09-25"), _d("2026-12-11"), 12, "drama"),
    AnimeShow("収穫 祭 と 魔 王", _d("2026-10-09"), _d("2026-12-25"), 12, "fantasy"),
    AnimeShow("木 枯 し と 銃 声", _d("2026-10-14"), _d("2026-12-23"), 11, "action"),
    AnimeShow("ストーブ と 図書館", _d("2026-10-17"), _d("2026-12-26"), 11, "slice_of_life"),
    AnimeShow("秋 刀 魚 ナイト", _d("2026-10-21"), _d("2026-12-30"), 11, "comedy"),
    AnimeShow("月 と 山 茶 花", _d("2026-10-24"), _d("2026-12-26"), 10, "drama"),
    # Bridging / long shows
    AnimeShow("二 十 四 節 気 録", _d("2026-04-01"), _d("2026-09-30"), 26, "fantasy"),
    AnimeShow("暦 図 鑑", _d("2026-01-05"), _d("2026-12-28"), 52, "slice_of_life"),
    AnimeShow("旬 旅 行 ガイド", _d("2026-03-30"), _d("2026-12-21"), 39, "comedy"),
    AnimeShow("和 食 探求 編", _d("2026-01-12"), _d("2026-12-27"), 50, "slice_of_life"),
    # Short / OVA-style
    AnimeShow("一 行 詩 アニメ", _d("2026-02-14"), _d("2026-02-28"), 4, "slice_of_life"),
    AnimeShow("梅雨 ロード ムービー", _d("2026-06-08"), _d("2026-06-29"), 4, "drama"),
    AnimeShow("台 風 一 過 漫 画", _d("2026-09-07"), _d("2026-09-21"), 3, "comedy"),
    AnimeShow("初 雪 静 物 画", _d("2026-12-14"), _d("2026-12-28"), 3, "slice_of_life"),
]


@dataclass(frozen=True)
class SeasonalEvent:
    name: str
    start: _dt.date
    end: _dt.date
    category: str   # 節気 / 花 / 野菜 / 魚介 / 果物
    color: str      # hex


SEASONAL_EVENTS: List[SeasonalEvent] = [
    # 二十四節気 (subset, 12)
    SeasonalEvent("小寒", _d("2026-01-05"), _d("2026-01-19"), "節気", "#a8b4c1"),
    SeasonalEvent("立春", _d("2026-02-04"), _d("2026-02-18"), "節気", "#d9a8c1"),
    SeasonalEvent("春分", _d("2026-03-21"), _d("2026-04-04"), "節気", "#f0bed4"),
    SeasonalEvent("立夏", _d("2026-05-05"), _d("2026-05-19"), "節気", "#b9d99a"),
    SeasonalEvent("夏至", _d("2026-06-21"), _d("2026-07-06"), "節気", "#c7d59f"),
    SeasonalEvent("立秋", _d("2026-08-07"), _d("2026-08-22"), "節気", "#e6c587"),
    SeasonalEvent("秋分", _d("2026-09-23"), _d("2026-10-07"), "節気", "#d99a6c"),
    SeasonalEvent("立冬", _d("2026-11-07"), _d("2026-11-21"), "節気", "#b09a8a"),
    SeasonalEvent("大雪", _d("2026-12-07"), _d("2026-12-21"), "節気", "#c3cfd6"),
    SeasonalEvent("冬至", _d("2026-12-22"), _d("2026-12-31"), "節気", "#a8b4c1"),
    SeasonalEvent("啓蟄", _d("2026-03-06"), _d("2026-03-20"), "節気", "#dfc1a8"),
    SeasonalEvent("穀雨", _d("2026-04-20"), _d("2026-05-04"), "節気", "#d4cb9a"),

    # 花 (8)
    SeasonalEvent("梅 開花", _d("2026-02-12"), _d("2026-03-08"), "花", "#f4b3c8"),
    SeasonalEvent("桜 前線", _d("2026-03-25"), _d("2026-04-15"), "花", "#fbcfd9"),
    SeasonalEvent("藤 棚", _d("2026-04-20"), _d("2026-05-12"), "花", "#c8a8d4"),
    SeasonalEvent("あじさい", _d("2026-06-01"), _d("2026-07-05"), "花", "#9aa9d4"),
    SeasonalEvent("朝顔", _d("2026-07-15"), _d("2026-08-25"), "花", "#7da4d4"),
    SeasonalEvent("向日葵", _d("2026-07-20"), _d("2026-08-31"), "花", "#e8c757"),
    SeasonalEvent("金 木 犀", _d("2026-09-25"), _d("2026-10-20"), "花", "#e0a350"),
    SeasonalEvent("紅葉 前線", _d("2026-10-15"), _d("2026-12-05"), "花", "#c46a55"),

    # 野菜 (10)
    SeasonalEvent("大根", _d("2026-01-01"), _d("2026-02-28"), "野菜", "#e6e2d0"),
    SeasonalEvent("白菜", _d("2026-01-01"), _d("2026-02-15"), "野菜", "#dde6b8"),
    SeasonalEvent("菜 の 花", _d("2026-02-10"), _d("2026-04-10"), "野菜", "#e6d878"),
    SeasonalEvent("筍", _d("2026-04-01"), _d("2026-05-15"), "野菜", "#d9c896"),
    SeasonalEvent("そら 豆", _d("2026-04-20"), _d("2026-06-10"), "野菜", "#bbd095"),
    SeasonalEvent("枝豆", _d("2026-06-20"), _d("2026-09-10"), "野菜", "#a8c878"),
    SeasonalEvent("茄子", _d("2026-06-15"), _d("2026-09-30"), "野菜", "#9a7ab0"),
    SeasonalEvent("さつまいも", _d("2026-09-15"), _d("2026-11-30"), "野菜", "#c8896a"),
    SeasonalEvent("カボチャ", _d("2026-09-01"), _d("2026-11-20"), "野菜", "#d9a050"),
    SeasonalEvent("ほうれん草", _d("2026-11-01"), _d("2026-12-31"), "野菜", "#5a9a5a"),

    # 魚介 (6)
    SeasonalEvent("鰤", _d("2026-01-01"), _d("2026-02-28"), "魚介", "#9abbd4"),
    SeasonalEvent("鰹", _d("2026-04-15"), _d("2026-06-15"), "魚介", "#b88a78"),
    SeasonalEvent("鮎", _d("2026-06-01"), _d("2026-08-31"), "魚介", "#a8c4c8"),
    SeasonalEvent("秋 刀 魚", _d("2026-09-01"), _d("2026-11-15"), "魚介", "#8a9aa8"),
    SeasonalEvent("牡蠣", _d("2026-11-15"), _d("2026-12-31"), "魚介", "#a8a08a"),
    SeasonalEvent("鱈", _d("2026-12-01"), _d("2026-12-31"), "魚介", "#d9d4c0"),

    # 果物 (4)
    SeasonalEvent("いちご", _d("2026-01-15"), _d("2026-04-30"), "果物", "#e88a8a"),
    SeasonalEvent("桃", _d("2026-07-01"), _d("2026-08-15"), "果物", "#f0a8b0"),
    SeasonalEvent("ぶどう", _d("2026-08-15"), _d("2026-10-15"), "果物", "#7a5a8a"),
    SeasonalEvent("柿", _d("2026-10-01"), _d("2026-11-30"), "果物", "#d97850"),
]
