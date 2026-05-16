"""Weather mapping — pure functions, no Textual / Rich dependency.

Maps a single CheckIn (mood + energy + solo_want) to a 'weather' token,
and combines two partners' weathers into a couple-weather.
The point is to convey state without judging or scoring.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

from .models import CheckIn


@dataclass(frozen=True)
class Weather:
    key: str       # internal token: sun / haze / cloud / rain / storm / moon / calm / unknown
    icon: str      # single-char Unicode glyph (not emoji)
    label: str     # short Japanese label
    palette: str   # palette key (amber / haze / cloud / rain / storm / moon / calm / dim)


WEATHERS: dict[str, Weather] = {
    "sun":     Weather("sun",     "☀", "晴れ",   "amber"),
    "haze":    Weather("haze",    "⛅", "薄日",   "haze"),
    "cloud":   Weather("cloud",   "☁", "雲",     "cloud"),
    "rain":    Weather("rain",    "☂", "雨",     "rain"),
    "storm":   Weather("storm",   "⚡", "嵐",     "storm"),
    "moon":    Weather("moon",    "☾", "月夜",   "moon"),
    "calm":    Weather("calm",    "〜", "凪",     "calm"),
    "unknown": Weather("unknown", "·", "—",      "dim"),
}


def single_weather(check: Optional[CheckIn]) -> Weather:
    """Map a single check-in to one weather. None / unanswered → unknown."""
    if check is None or not check.answered:
        return WEATHERS["unknown"]

    mood, energy, solo = check.mood, check.energy, check.solo_want

    # Storm = mood 1 + energy 1 (both bottomed out)
    if mood == 1 and energy == 1:
        return WEATHERS["storm"]
    # Rain = mood 1 or 2 (heavy heart)
    if mood <= 2:
        return WEATHERS["rain"]
    # Moon = high solo wanted + low energy (quiet alone night)
    if solo >= 4 and energy <= 2:
        return WEATHERS["moon"]
    # Calm = mood 3, energy 3, solo 3 (perfectly neutral)
    if mood == 3 and energy == 3 and solo == 3:
        return WEATHERS["calm"]
    # Sun = mood 5, energy 4-5 (bright and full)
    if mood >= 5 and energy >= 4:
        return WEATHERS["sun"]
    # Haze = mood 4 (mostly OK)
    if mood == 4:
        return WEATHERS["haze"]
    # Cloud = catch-all for mid (mood 3, energy varies, solo varies)
    return WEATHERS["cloud"]


@dataclass(frozen=True)
class CoupleWeather:
    label: str          # 二人の今日, e.g. "話す夜", "並んでいる夜"
    whisper: str        # one-line gentle comment
    icon_pair: tuple[str, str]  # (icon_a, icon_b)
    palette: str        # palette key for the combined card


def paired_weather(a: Optional[CheckIn], b: Optional[CheckIn]) -> CoupleWeather:
    wa = single_weather(a)
    wb = single_weather(b)
    icons = (wa.icon, wb.icon)

    if wa.key == "unknown" and wb.key == "unknown":
        return CoupleWeather(
            label="まだ二人とも未記入",
            whisper="今夜、思い出したら触れてみて。",
            icon_pair=icons,
            palette="dim",
        )
    if wa.key == "unknown" or wb.key == "unknown":
        present = wa if wa.key != "unknown" else wb
        return CoupleWeather(
            label="片方だけの空",
            whisper=f"片方は {present.label}。もう片方の空はまだ。",
            icon_pair=icons,
            palette=present.palette,
        )

    # Both answered. Build composite.
    a_solo = (a.solo_want if a else 3)
    b_solo = (b.solo_want if b else 3)
    avg_mood = ((a.mood + b.mood) / 2) if a and b else 3
    avg_energy = ((a.energy + b.energy) / 2) if a and b else 3
    avg_solo = (a_solo + b_solo) / 2

    # Both want each other and have energy → 話す夜
    if avg_solo <= 2.5 and avg_energy >= 3.5:
        return CoupleWeather(
            label="話す夜",
            whisper="今夜は声を交わしやすそう。",
            icon_pair=icons,
            palette="amber",
        )
    # Both want alone-time → ひとりひとりの夜
    if avg_solo >= 4:
        return CoupleWeather(
            label="ひとりひとりの夜",
            whisper="それぞれの部屋でいい夜。",
            icon_pair=icons,
            palette="moon",
        )
    # Both low energy or one rain → 並んでいる夜
    if avg_energy <= 2.5 or wa.key == "rain" or wb.key == "rain":
        return CoupleWeather(
            label="並んでいる夜",
            whisper="話さなくていい。隣にいる、それで十分。",
            icon_pair=icons,
            palette="rain",
        )
    # Mid everywhere → 静かな夜
    return CoupleWeather(
        label="静かな夜",
        whisper="どちらでもない、ゆるい空。",
        icon_pair=icons,
        palette="calm",
    )


def tonight_suggestion(a: Optional[CheckIn], b: Optional[CheckIn]) -> str:
    """A *whisper* — not a directive. Returns plain text."""
    return paired_weather(a, b).label


def month_trend(days: list) -> list[tuple[str, str]]:
    """Return [(date_iso, paired.label), ...] for a list of Day objects."""
    out: list[tuple[str, str]] = []
    for day in days:
        a = getattr(day, "a", None)
        b = getattr(day, "b", None)
        out.append((day.date_iso, paired_weather(a, b).label))
    return out


def palette_color(key: str) -> str:
    """Return a Rich/Textual-compatible color for a palette key."""
    table = {
        "amber":  "#f5c84a",
        "haze":   "#d9c79b",
        "cloud":  "#a9b3c4",
        "rain":   "#7f9bb8",
        "storm":  "#6b6f7d",
        "moon":   "#c8b4d6",
        "calm":   "#a3b4a8",
        "dim":    "#5a6470",
    }
    return table.get(key, "#a9b3c4")
