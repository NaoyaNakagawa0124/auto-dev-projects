from futari_yoho.models import CheckIn, Day
from futari_yoho.weather import (
    WEATHERS,
    month_trend,
    paired_weather,
    palette_color,
    single_weather,
    tonight_suggestion,
)


def test_single_weather_unknown_for_none_or_unanswered():
    assert single_weather(None).key == "unknown"
    assert single_weather(CheckIn()).key == "unknown"
    # partial
    assert single_weather(CheckIn(mood=3, energy=3, solo_want=0)).key == "unknown"


def test_single_weather_storm_only_when_both_bottomed():
    assert single_weather(CheckIn(mood=1, energy=1, solo_want=3)).key == "storm"
    assert single_weather(CheckIn(mood=1, energy=2, solo_want=3)).key == "rain"


def test_single_weather_rain_for_low_mood():
    assert single_weather(CheckIn(mood=2, energy=5, solo_want=3)).key == "rain"


def test_single_weather_moon_for_quiet_alone():
    # high solo_want + low energy
    assert single_weather(CheckIn(mood=3, energy=2, solo_want=5)).key == "moon"


def test_single_weather_calm_for_perfectly_neutral():
    assert single_weather(CheckIn(mood=3, energy=3, solo_want=3)).key == "calm"


def test_single_weather_sun_for_bright():
    assert single_weather(CheckIn(mood=5, energy=5, solo_want=2)).key == "sun"
    assert single_weather(CheckIn(mood=5, energy=4, solo_want=3)).key == "sun"


def test_single_weather_haze_for_mostly_ok():
    assert single_weather(CheckIn(mood=4, energy=4, solo_want=3)).key == "haze"


def test_paired_weather_both_unknown():
    p = paired_weather(None, None)
    assert "未記入" in p.label
    assert p.palette == "dim"


def test_paired_weather_one_missing():
    p = paired_weather(CheckIn(mood=4, energy=4, solo_want=2), None)
    assert "片方" in p.label
    assert p.icon_pair[0] != "·"
    assert p.icon_pair[1] == "·"


def test_paired_weather_talk_night():
    a = CheckIn(mood=4, energy=4, solo_want=2)
    b = CheckIn(mood=5, energy=4, solo_want=2)
    p = paired_weather(a, b)
    assert p.label == "話す夜"


def test_paired_weather_alone_night():
    a = CheckIn(mood=3, energy=3, solo_want=5)
    b = CheckIn(mood=3, energy=3, solo_want=4)
    p = paired_weather(a, b)
    assert p.label == "ひとりひとりの夜"


def test_paired_weather_side_by_side_when_low_energy():
    a = CheckIn(mood=2, energy=2, solo_want=2)
    b = CheckIn(mood=3, energy=2, solo_want=2)
    p = paired_weather(a, b)
    assert p.label == "並んでいる夜"


def test_paired_weather_quiet_night_fallback():
    a = CheckIn(mood=3, energy=3, solo_want=3)
    b = CheckIn(mood=4, energy=3, solo_want=3)
    p = paired_weather(a, b)
    assert p.label == "静かな夜"


def test_tonight_suggestion_returns_label_string():
    a = CheckIn(mood=4, energy=4, solo_want=2)
    b = CheckIn(mood=5, energy=5, solo_want=2)
    s = tonight_suggestion(a, b)
    assert isinstance(s, str)
    assert s == "話す夜"


def test_month_trend_returns_one_entry_per_day():
    days = [
        Day(date_iso="2026-05-15"),
        Day(date_iso="2026-05-16",
            a=CheckIn(mood=3, energy=3, solo_want=3),
            b=CheckIn(mood=3, energy=3, solo_want=3)),
        Day(date_iso="2026-05-17",
            a=CheckIn(mood=5, energy=5, solo_want=2),
            b=CheckIn(mood=5, energy=4, solo_want=2)),
    ]
    out = month_trend(days)
    assert len(out) == 3
    assert out[0][0] == "2026-05-15"
    assert "未記入" in out[0][1]
    assert out[2][1] == "話す夜"


def test_weathers_table_keys():
    assert {"sun", "haze", "cloud", "rain", "storm", "moon", "calm", "unknown"} <= set(WEATHERS)


def test_palette_color_returns_hex():
    c = palette_color("amber")
    assert c.startswith("#") and len(c) == 7
    # unknown key falls back to a hex color, not blank
    assert palette_color("nope").startswith("#")
