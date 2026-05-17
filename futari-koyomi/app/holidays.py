"""Curated micro-holidays + deterministic generator for the rest of the year.

Public API:
    Holiday(date_key, name, source, tag, rituals)
    get_holiday(date) -> Holiday
    list_year() -> [Holiday]  (366 entries Jan 1 .. Dec 31, including Feb 29)
"""
from __future__ import annotations

import datetime as _dt
from dataclasses import dataclass
from typing import List, Tuple


@dataclass(frozen=True)
class Holiday:
    date_key: str       # "MM-DD"
    name: str
    source: str         # "日本 記念 日" / "国際 デー" / "暦 の 区切り" / "創作"
    tag: str            # see TAGS
    rituals: Tuple[str, str, str]


TAGS = (
    "food",      # 食べ 物 系
    "nature",    # 季節 / 天気
    "culture",   # 文化 / 行事
    "work",      # 仕事 / 暮らし
    "love",      # 関係 性
    "rest",      # 休息 / 静か
    "play",      # 遊び / 試す
    "memory",    # 思い出 / 振り返り
)


# ── Curated entries (date_key MM-DD → (name, source, tag)) ─────────────────
_CURATED: dict[str, Tuple[str, str, str]] = {
    # ── 1月 ──
    "01-01": ("元日", "暦 の 区切り", "milestone"),
    "01-07": ("七草 の 日", "日本 記念 日", "food"),
    "01-11": ("鏡開き", "日本 暦", "food"),
    "01-15": ("小正月", "日本 暦", "milestone"),
    "01-22": ("カレー の 日", "日本 記念 日", "food"),
    "01-26": ("コラーゲン の 日", "創作", "rest"),
    "01-31": ("愛妻 の 日", "日本 記念 日", "love"),
    # ── 2月 ──
    "02-02": ("夫婦 の 日", "創作", "love"),
    "02-06": ("お風呂 の 日", "日本 記念 日", "rest"),
    "02-09": ("肉 の 日", "日本 記念 日", "food"),
    "02-14": ("バレンタイン デー", "国際 デー", "love"),
    "02-22": ("猫 の 日", "日本 記念 日", "play"),
    "02-23": ("富士山 の 日", "日本 記念 日", "nature"),
    # ── 3月 ──
    "03-03": ("ひな祭り", "日本 暦", "culture"),
    "03-08": ("国際 女性 デー", "国際 デー", "culture"),
    "03-14": ("ホワイト デー", "日本 暦", "love"),
    "03-20": ("国際 幸福 デー", "国際 デー", "rest"),
    "03-21": ("世界 詩 の 日", "国際 デー", "culture"),
    "03-27": ("さくら の 日", "日本 記念 日", "nature"),
    # ── 4月 ──
    "04-01": ("新 年度 の 1 日", "暦 の 区切り", "milestone"),
    "04-04": ("どら 焼き の 日", "日本 記念 日", "food"),
    "04-07": ("世界 保健 デー", "国際 デー", "rest"),
    "04-14": ("オレンジ デー", "日本 記念 日", "love"),
    "04-22": ("アース デー", "国際 デー", "nature"),
    "04-29": ("昭和 の 日 (休日)", "日本 祝日", "memory"),
    # ── 5月 ──
    "05-01": ("メーデー", "国際 デー", "work"),
    "05-04": ("みどり の 日", "日本 祝日", "nature"),
    "05-05": ("こども の 日", "日本 祝日", "culture"),
    "05-09": ("アイス クリーム の 日", "日本 記念 日", "food"),
    "05-12": ("国際 看護 の 日", "国際 デー", "work"),
    "05-17": ("世界 子守唄 の 日", "創作", "memory"),
    "05-20": ("ロー マ字 の 日", "日本 記念 日", "play"),
    "05-30": ("ごみ ゼロ の 日", "日本 記念 日", "work"),
    # ── 6月 ──
    "06-01": ("写真 の 日", "日本 記念 日", "memory"),
    "06-04": ("虫歯 予防 デー", "日本 記念 日", "rest"),
    "06-10": ("時 の 記念 日", "日本 記念 日", "memory"),
    "06-16": ("和菓子 の 日", "日本 記念 日", "food"),
    "06-21": ("夏至", "二十四 節気", "nature"),
    "06-23": ("国連 公務員 デー", "国際 デー", "work"),
    # ── 7月 ──
    "07-01": ("半 期 の 始まり", "暦 の 区切り", "milestone"),
    "07-07": ("七夕", "日本 暦", "culture"),
    "07-10": ("納豆 の 日", "日本 記念 日", "food"),
    "07-20": ("月 面 着陸 記念 日", "創作", "memory"),
    "07-25": ("かき 氷 の 日", "日本 記念 日", "food"),
    "07-29": ("アマチュア 無線 の 日", "創作", "play"),
    # ── 8月 ──
    "08-01": ("水 の 日", "日本 記念 日", "nature"),
    "08-08": ("そろばん の 日", "日本 記念 日", "play"),
    "08-11": ("山 の 日", "日本 祝日", "nature"),
    "08-15": ("お盆 の 中日", "日本 暦", "memory"),
    "08-21": ("献血 の 日", "日本 記念 日", "work"),
    "08-29": ("焼肉 の 日", "日本 記念 日", "food"),
    # ── 9月 ──
    "09-01": ("防災 の 日", "日本 記念 日", "work"),
    "09-09": ("重陽 の 節句", "日本 暦", "culture"),
    "09-15": ("敬老 の 日 (近似)", "日本 祝日", "memory"),
    "09-20": ("バス の 日", "日本 記念 日", "play"),
    "09-23": ("秋分 の 日", "日本 祝日", "nature"),
    "09-29": ("招き猫 の 日", "日本 記念 日", "play"),
    # ── 10月 ──
    "10-01": ("コーヒー の 日", "日本 記念 日", "food"),
    "10-05": ("世界 教師 の 日", "国際 デー", "memory"),
    "10-13": ("豆乳 の 日", "日本 記念 日", "food"),
    "10-17": ("世界 貧困 撲滅 デー", "国際 デー", "culture"),
    "10-26": ("柿 の 日", "日本 記念 日", "food"),
    "10-31": ("ハロウィン", "国際 デー", "play"),
    # ── 11月 ──
    "11-03": ("文化 の 日", "日本 祝日", "culture"),
    "11-08": ("いい 歯 の 日", "日本 記念 日", "rest"),
    "11-15": ("七五三", "日本 暦", "memory"),
    "11-22": ("いい 夫婦 の 日", "日本 記念 日", "love"),
    "11-23": ("勤労 感謝 の 日", "日本 祝日", "work"),
    "11-29": ("いい 肉 の 日", "日本 記念 日", "food"),
    # ── 12月 ──
    "12-01": ("師走 の 始まり", "暦 の 区切り", "milestone"),
    "12-08": ("事 始め", "日本 暦", "culture"),
    "12-12": ("漢字 の 日", "日本 記念 日", "play"),
    "12-22": ("冬至", "二十四 節気", "nature"),
    "12-24": ("クリスマス イブ", "国際 デー", "love"),
    "12-25": ("クリスマス", "国際 デー", "love"),
    "12-31": ("大晦日", "暦 の 区切り", "milestone"),
    # ── うるう年 補完 ──
    "02-29": ("4 年 に 1 度 の 余白", "暦 の 区切り", "milestone"),
}

# Tag-based ritual templates (≥6 per tag, picked deterministically by date+tag)
_RITUAL_TEMPLATES: dict[str, List[str]] = {
    "food": [
        "「{name}」 に ちなんで、 冷蔵庫 に ある もの で 1 品 を 2 人 で 5 分 で 作る",
        "「{name}」 を 連想 する 食べ物 を お互い 1 つ ずつ 挙げる、 理由 も 1 行 で",
        "並んで コーヒー を 淹れる、 お互い の 好き な 濃さ を 観察 する",
        "今日 食べた 中 で 「これ は 良かった」 を 1 つ ずつ 共有",
        "「{name}」 を 検索 し、 出て きた 写真 を 30 秒 ずつ 見る",
        "週末 に 食べたい もの を 1 品 ずつ 言う、 紙 に 書か なくて も いい",
    ],
    "nature": [
        "ベランダ や 窓 を 開け、 5 分 だけ 外 の 音 を 並んで 聴く",
        "今日 の 空 の 色 を スマホ で 1 枚 ずつ 撮る、 見せ合う",
        "「{name}」 に ちなんで、 今 季 の 好きな 風景 を 1 つ ずつ 挙げる",
        "外 を 1 周 (2 分) 歩く、 帰って 来たら 「何 が 見えた か」 を 1 行 で",
        "明日 の 天気 予報 を 一緒 に 見て、 1 つ 約束 を する",
        "窓 辺 で 並んで 深呼吸 を 10 回、 数 を 互い に 数える",
    ],
    "culture": [
        "「{name}」 に つい て 知って いる こと を 1 つ ずつ シェア (Wikipedia OK)",
        "今日 の 出来事 を 575 で 1 句 作る、 添削 し合う",
        "好きな 漢字 を 1 文字 ずつ 紙 に 書く、 理由 を 添える",
        "今日 「これ は 自分 ら しい」 と 思った 瞬間 を 30 秒 で 話す",
        "「{name}」 を 5 歳 の 子 に 説明 する 練習 を、 互い に",
        "好きな 詩 や 歌詞 を 1 行 ずつ 共有",
    ],
    "work": [
        "今日 1 番 疲れた 5 分 を 振り返り、 1 行 で 言葉 に する",
        "明日 の 自分 に 1 つ だけ 「やめて おく こと」 を 伝える",
        "今日 助かった 同僚 や 通り すがり の 親切 を 1 つ シェア",
        "「{name}」 か ら 連想 して、 今 の 仕事 で 好きな 動作 を 1 つ 挙げる",
        "明日 着る 服 を 並べて 置く、 一緒 に",
        "「お疲れ さま」 と 言って、 5 分 だけ ソファ で 並ぶ",
    ],
    "love": [
        "出会った 頃 の 写真 を 1 枚 ずつ 探して 見せる",
        "「{name}」 に ちなんで、 直近 1 週間 で 嬉しかった 互い の 行動 を 1 つ",
        "互い の 好き な ところ を 1 つ ずつ、 5 秒 ずつ 言う",
        "5 年 後 に やって みたい こと を、 1 文 で 互い に",
        "明日 互い に 1 つ ずつ 「小さな 約束」 を 交わす",
        "並んで 座って、 5 分 だけ 何 も しゃべら ない",
    ],
    "rest": [
        "肩 を 互い に 1 分 ずつ 揉む",
        "5 分 だけ ストレッチ、 互い に 真似 し合う",
        "今日 1 番 リラックス した 瞬間 を 1 行 で",
        "「{name}」 に ちなんで、 今夜 早く 寝る 時間 を 約束 する",
        "ハーブ ティー か 白湯 を 並んで 飲む、 言葉 数 は 少な め に",
        "目 を 閉じて 30 秒、 互い の 呼吸 を 数える",
    ],
    "play": [
        "「{name}」 を しり とり の 最初 の お題 に、 5 周 だけ",
        "互い に 即興 で 10 秒 物語 を 作って 1 つ ずつ 披露",
        "好きな ゲーム や マンガ を 1 つ ずつ 挙げ、 推し ポイント を 1 行 で",
        "じゃんけん 5 回、 負けた 方 が 今夜 の 飲み物 を 用意",
        "互い に 出題 — 1 問 だけ クイズ、 答え は 1 文 で",
        "携帯 を 30 秒 だけ 互い の 手 に 置いて、 何 を 開いて いた か 1 つ 共有",
    ],
    "memory": [
        "今 月 で 一 番 印象 に 残った 1 日 を、 互い に 1 文 で",
        "5 年 前 の 今日 何 を して いた か、 思い出して みる",
        "「{name}」 か ら 連想 する 子供 の 頃 の 記憶 を 1 つ ずつ",
        "携帯 の 写真 を 適当 に 1 枚 開いて、 撮った 時 の こと を 話す",
        "今日 を 1 文 で 日記 に、 互い に 1 文 ずつ 書く",
        "明日 思い出 し たい 今日 の 「いい 瞬間」 を、 互い に 1 つ",
    ],
    "milestone": [
        "「{name}」 を 言葉 で 締める、 互い に 1 文 ずつ",
        "今 期 の 始まり (or 終わり) に 互い に 1 つ ずつ 「変えて みたい こと」 を 言う",
        "今日 を 1 漢字 で 表す、 互い に 紙 に 書いて 見せる",
        "5 分 だけ 並んで、 今日 1 日 を 振り返る",
        "「{name}」 を 来年 も やる か、 ささ やか に 約束 する",
        "明日 1 番 楽しみ な こと を、 互い に 1 つ ずつ",
    ],
    "generic": [
        "並んで お茶 を 5 分、 言葉 数 は 少な め に",
        "今日 良かった こと を 1 つ ずつ、 30 秒 で",
        "明日 楽しみ な こと を 1 つ ずつ、 短く",
        "互い の 顔 を 5 秒 見つめる、 笑って も OK",
        "5 年 後 の 今日 やって い そう な こと を 1 つ ずつ",
        "互い に 「お疲れ さま」 と 5 回 言う、 言い方 を 工夫",
    ],
}

# Monthly themes (for non-curated days) — name + tag rotation
_MONTHLY_NAMES = [
    ("睦 月 の", "milestone"),
    ("如 月 の", "rest"),
    ("弥 生 の", "nature"),
    ("卯 月 の", "milestone"),
    ("皐 月 の", "nature"),
    ("水 無 月 の", "rest"),
    ("文 月 の", "memory"),
    ("葉 月 の", "play"),
    ("長 月 の", "memory"),
    ("神 無 月 の", "culture"),
    ("霜 月 の", "rest"),
    ("師 走 の", "milestone"),
]

# Day-of-week-ish modifiers for filler names
_DAY_MODIFIERS = [
    ("整える 日", "rest"),
    ("試す 日", "play"),
    ("並ぶ 日", "love"),
    ("数える 日", "memory"),
    ("見る 日", "culture"),
    ("作る 日", "play"),
    ("休む 日", "rest"),
]


def _stable_hash(s: str) -> int:
    h = 2166136261
    for ch in s:
        h ^= ord(ch)
        h = (h * 16777619) & 0xFFFFFFFF
    return h


def _pick_rituals(name: str, tag: str, date_key: str) -> Tuple[str, str, str]:
    pool = _RITUAL_TEMPLATES.get(tag, _RITUAL_TEMPLATES["generic"])
    # Deterministic 3 unique picks using stable hash of date_key
    seed = _stable_hash(date_key + "|" + tag)
    n = len(pool)
    # Generate 3 distinct indices
    idxs: List[int] = []
    while len(idxs) < 3:
        idx = seed % n
        if idx not in idxs:
            idxs.append(idx)
        seed = (seed * 1103515245 + 12345) & 0xFFFFFFFF
    picks = tuple(pool[i].replace("{name}", name) for i in idxs)
    return picks  # type: ignore[return-value]


def _generate_filler(date_key: str) -> Tuple[str, str, str]:
    month, day = date_key.split("-")
    month_idx = int(month) - 1
    day_int = int(day)
    base_name, base_tag = _MONTHLY_NAMES[month_idx]
    mod_name, mod_tag = _DAY_MODIFIERS[(day_int - 1) % len(_DAY_MODIFIERS)]
    name = f"{base_name}{mod_name}"
    # Prefer modifier tag, but fall back to month tag if collision
    tag = mod_tag
    return (name, "暦 の 余白", tag)


def get_holiday(d: _dt.date) -> Holiday:
    """Return the Holiday for the given date."""
    key = d.strftime("%m-%d")
    if key in _CURATED:
        name, source, tag = _CURATED[key]
    else:
        name, source, tag = _generate_filler(key)
    rituals = _pick_rituals(name, tag, key)
    return Holiday(date_key=key, name=name, source=source, tag=tag, rituals=rituals)


def list_year() -> List[Holiday]:
    """All 366 holidays Jan 1 .. Dec 31 (inclusive of Feb 29)."""
    base_year = 2024  # leap year so Feb 29 is included
    start = _dt.date(base_year, 1, 1)
    out: List[Holiday] = []
    for i in range(366):
        d = start + _dt.timedelta(days=i)
        out.append(get_holiday(d))
    return out


def curated_count() -> int:
    return len(_CURATED)


def all_tags() -> Tuple[str, ...]:
    return TAGS
