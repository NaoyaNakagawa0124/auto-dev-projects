"""Rest messages tagged by time-tier.

Each message is one line, <= 60 Japanese chars, period-terminated, and free
of banned words (the test suite enforces this).
"""

from __future__ import annotations

import random
from dataclasses import dataclass
from typing import Literal

Tier = Literal["evening", "deep", "predawn", "day"]


@dataclass(frozen=True)
class Message:
    id: str
    tier: Tier
    text: str


MESSAGES: tuple[Message, ...] = (
    # evening (22:00–23:59)
    Message("ev01", "evening", "今夜 の 区切り に、 ちょうど 良い 時間 です。"),
    Message("ev02", "evening", "ここまで の 進捗 は、 セーブ で 守って くれます。"),
    Message("ev03", "evening", "ボス は あなたの 睡眠 を 待って くれます。"),
    Message("ev04", "evening", "明日 の あなた に、 1 戦 残して おきませんか。"),
    Message("ev05", "evening", "今日 の 1 勝 は、 もう 取れて います。"),
    Message("ev06", "evening", "ここで 閉じる 選択 も、 とても 上手 です。"),
    Message("ev07", "evening", "「あと 1 戦」 は、 明日 の 自分 への プレゼント に。"),
    Message("ev08", "evening", "ここまで の あなた で、 きちんと しています。"),
    Message("ev09", "evening", "目 が 重く なる 前 が、 一番 きれい な 撤退 です。"),
    Message("ev10", "evening", "操作 が 雑 に なる 前 に、 セーブ し てみませんか。"),
    # deep (00:00–02:59)
    Message("dp01", "deep", "今日 の 進捗 は、 もう 十分 です。"),
    Message("dp02", "deep", "深夜 の 1 勝 は、 朝 の 1 勝 と 同じ 重さ です。"),
    Message("dp03", "deep", "ゲーム は、 明日 も そこに あります。"),
    Message("dp04", "deep", "ここまで で、 きちんと した 1 日 です。"),
    Message("dp05", "deep", "勝率 を 上げる 一番 速い 方法 は、 今 寝る こと です。"),
    Message("dp06", "deep", "もう 一戦 の 前 に、 水 を 一杯。"),
    Message("dp07", "deep", "今夜 の あなた の 勝負 は、 ここまで で 十分 です。"),
    Message("dp08", "deep", "コントローラー を、 そっと 置いて みません か。"),
    Message("dp09", "deep", "肩 が 上がって いる 気 が しません か。"),
    Message("dp10", "deep", "光 を 落として、 画面 から 目 を 離して みません か。"),
    # predawn (03:00–05:59)
    Message("pd01", "predawn", "夜 が 明け かけて います。 ここで 渡し ましょう。"),
    Message("pd02", "predawn", "明日 へ、 そっと 受け 渡す 時間 です。"),
    Message("pd03", "predawn", "ここまで で、 もう 十分 です。 朝 が 来ます。"),
    Message("pd04", "predawn", "鳥 が 起き る 前 に、 一旦 セーブ を。"),
    Message("pd05", "predawn", "あなた の 持ち時間 は、 明日 にも あります。"),
    Message("pd06", "predawn", "外 が 白み 始める 前 に、 静か な 撤退 を。"),
    Message("pd07", "predawn", "今 の 1 戦 は、 朝 起きて から の 自分 に 渡し ませんか。"),
    Message("pd08", "predawn", "勝負 は ここまで。 残り は 朝 で 良い です。"),
    Message("pd09", "predawn", "起きた 朝 の 自分 が、 今夜 の あなた に 礼 を 言います。"),
    Message("pd10", "predawn", "「もう 1 回」 の 重さ が、 朝 と は 違って います。"),
    # day (06:00–21:59) — gentler, non-urgent
    Message("dy01", "day", "今 の 1 戦 が 終わる 頃 に、 一息 つきません か。"),
    Message("dy02", "day", "次 の マッチ の 前 に、 立って みません か。"),
    Message("dy03", "day", "肩 を 一度、 大きく 回して みません か。"),
    Message("dy04", "day", "水 を、 ひと 口 だけ どうぞ。"),
    Message("dy05", "day", "窓 の 外 の 光 を、 5 秒 だけ どうぞ。"),
    Message("dy06", "day", "目 を、 遠く に 一度 だけ 向けて みません か。"),
    Message("dy07", "day", "深呼吸 を ひとつ、 試して みません か。"),
    Message("dy08", "day", "次 の 区切り の セーブ で、 1 杯 の お茶 を どうぞ。"),
    Message("dy09", "day", "今 の マッチ の リザルト を、 ゆっくり 眺めて みません か。"),
    Message("dy10", "day", "椅子 から 1 度 だけ、 立って みません か。"),
)


BANNED_WORDS: tuple[str, ...] = (
    "頑張", "努力", "寝ろ", "やめろ", "もう遅い", "ダメ", "だから",
    "効率悪い", "効率厨", "廃人",
)


def all_messages() -> tuple[Message, ...]:
    return MESSAGES


def by_tier(tier: Tier) -> tuple[Message, ...]:
    return tuple(m for m in MESSAGES if m.tier == tier)


def pick(seed: int, tier: Tier | None = None) -> Message:
    pool = by_tier(tier) if tier else MESSAGES
    if not pool:
        raise ValueError(f"no messages in tier {tier!r}")
    rng = random.Random(seed)
    return rng.choice(pool)
