"""Meme card templates — kaomoji + structure.

Twelve gentle, family-friendly templates. Each template has:
- id: stable string key
- name: short Japanese name
- kaomoji_lines: 1-3 lines of ASCII art (centered in card)
- hint_top: example top text (situation)
- hint_bottom: example bottom text (punchline)
- accent: palette key for the title chip
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Template:
    id: str
    name: str
    kaomoji_lines: tuple[str, ...]
    hint_top: str
    hint_bottom: str
    accent: str = "gold"


TEMPLATES: tuple[Template, ...] = (
    Template(
        id="ureshii",
        name="うれしい",
        kaomoji_lines=("    (◕‿◕)    ", "   ╰ ─ ─ ╯   "),
        hint_top="孫が遊びに来た",
        hint_bottom="お茶うけ全部出しちゃう",
        accent="gold",
    ),
    Template(
        id="komatta",
        name="こまった",
        kaomoji_lines=("   σ(´• ω •`)   ", "    ノ─ノ    "),
        hint_top="リモコンが行方不明",
        hint_bottom="今日もテレビは諦める",
        accent="rouge",
    ),
    Template(
        id="natsukashii",
        name="なつかしい",
        kaomoji_lines=("   (´∀｀ )っ   ", "   ──♡── ", "    アルバム    "),
        hint_top="あの旅行、覚えてる?",
        hint_bottom="お父さん、まだ髪あったね",
        accent="rouge",
    ),
    Template(
        id="gussuri",
        name="ぐっすり",
        kaomoji_lines=("    (-_-)    ", "   ─zzZ─   "),
        hint_top="テレビ見ながら",
        hint_bottom="知らない間にコックリ",
        accent="indigo",
    ),
    Template(
        id="bikkuri",
        name="びっくり",
        kaomoji_lines=("    ( ⊙_⊙ )    ",),
        hint_top="孫がもう中学生?",
        hint_bottom="この前ヨチヨチだったのに",
        accent="gold",
    ),
    Template(
        id="omoidashita",
        name="思い出した",
        kaomoji_lines=("    (｀・ω・´)ゞ    ", "   コレダ！   "),
        hint_top="言いたかった名前",
        hint_bottom="3 日後に思い出した",
        accent="gold",
    ),
    Template(
        id="hokorashii",
        name="ほこらしい",
        kaomoji_lines=("    (｡•̀ᴗ-)✧    ", "   ──━─── ", "    やったね    "),
        hint_top="孫が運動会で 1 等",
        hint_bottom="うちの孫はやっぱり一番",
        accent="gold",
    ),
    Template(
        id="naisho",
        name="ないしょ",
        kaomoji_lines=("   ( ´థ౪థ)    ", "   シー…    "),
        hint_top="おばあちゃんと",
        hint_bottom="親に内緒のおやつ",
        accent="rouge",
    ),
    Template(
        id="yurushita",
        name="ゆるした",
        kaomoji_lines=("    (´ω`)    ", "   ──♡── "),
        hint_top="孫が湯のみ割っちゃった",
        hint_bottom="まあ、 形あるものだから",
        accent="indigo",
    ),
    Template(
        id="manzoku",
        name="まんぞく",
        kaomoji_lines=("   (´。• ᵕ •。`)   ", "    ─── ─ ───    "),
        hint_top="風呂上がりの",
        hint_bottom="一杯のお茶が最高",
        accent="gold",
    ),
    Template(
        id="tomadou",
        name="とまどう",
        kaomoji_lines=("    (｡•́︿•̀｡)    ",),
        hint_top="スマホ、 また通知が",
        hint_bottom="押していい?  押さなくていい?",
        accent="indigo",
    ),
    Template(
        id="ohayou",
        name="おはよう",
        kaomoji_lines=("   ( ´ ▽ ` )ﾉ    ", "    ──☼──    "),
        hint_top="今日もちゃんと",
        hint_bottom="目が覚めた、 ありがたい",
        accent="gold",
    ),
)


BY_ID: dict[str, Template] = {t.id: t for t in TEMPLATES}


def get(template_id: str) -> Template | None:
    return BY_ID.get(template_id)


def get_or_default(template_id: str | None) -> Template:
    if template_id and template_id in BY_ID:
        return BY_ID[template_id]
    return TEMPLATES[0]
