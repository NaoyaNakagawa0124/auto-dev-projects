"""Keyword-based responder for free-text DMs / mentions.

The user types something like 「あと 1 勝だけ」 — the bot acknowledges without
judging, and gives gentle permission to either continue or close.
"""

from __future__ import annotations

import random
from dataclasses import dataclass


@dataclass(frozen=True)
class Reaction:
    triggers: tuple[str, ...]
    replies: tuple[str, ...]


REACTIONS: tuple[Reaction, ...] = (
    Reaction(
        triggers=("あと1勝", "あと 1 勝", "あといっしょう", "もう1勝"),
        replies=(
            "わかります。 今夜 の 1 勝 は、 もう 取れて います。",
            "「あと 1 勝」、 明日 の 自分 への プレゼント に ちょうど いい です。",
            "ここで 閉じて、 朝 1 番 に 取りに行く 1 勝 でも 構いません。",
        ),
    ),
    Reaction(
        triggers=("もうちょっと", "もう ちょっと", "あと少し", "あと ちょっと"),
        replies=(
            "「ちょっと」 が 30 分 に 育つ こと、 あります。",
            "あと 少し、 を 自分 で 認める 時間 で 良い です。",
            "ここで 区切る 選択 も、 「もう ちょっと」 と 同じ くらい きれい です。",
        ),
    ),
    Reaction(
        triggers=("ラスト1回", "ラスト 1 回", "ラスト1戦"),
        replies=(
            "ラスト の 1 回、 終わったら 静か に 閉じ ましょう。",
            "勝っても 負けても、 ここで セーブ で 良い です。",
            "「ラスト」 を 「ラスト」 で 終わら せる の は、 一番 難しい 1 戦 です。",
        ),
    ),
    Reaction(
        triggers=("ねむ", "ねむい", "眠い", "つかれた", "疲れた"),
        replies=(
            "目 が 重く なる 前 が、 一番 きれい な 撤退 です。",
            "気付いて あげる だけ で、 もう 十分 です。",
            "肩 を 1 度 だけ、 大きく 回して みません か。",
        ),
    ),
    Reaction(
        triggers=("やめる", "やめます", "閉じる", "落ち"),
        replies=(
            "今日 は ここまで で、 きちんと しています。",
            "明日 も ゲーム は そこに あります。 おやすみなさい。",
            "セーブ で、 ここまで の あなた を 守って くれます。",
        ),
    ),
)


def find_reaction(text: str) -> Reaction | None:
    """Return the first matching Reaction or None."""
    norm = text.replace(" ", "").replace("　", "")
    for r in REACTIONS:
        for t in r.triggers:
            if t.replace(" ", "") in norm:
                return r
    return None


def reply_for(text: str, seed: int = 0) -> str | None:
    r = find_reaction(text)
    if r is None:
        return None
    rng = random.Random(seed)
    return rng.choice(r.replies)
