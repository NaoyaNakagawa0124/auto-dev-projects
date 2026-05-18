from kisanae_chou.banned import audit_all, find_banned
from kisanae_chou.data import SAMPLE_ANIME, SEASONAL_EVENTS


def test_find_banned_hit():
    assert find_banned("これ は 神アニメ だ") == "神アニメ"
    assert find_banned("お前 が 主役") == "お前"


def test_find_banned_miss():
    assert find_banned("夜 桜 食堂") is None
    assert find_banned("桜 前線") is None


def test_anime_titles_clean():
    strings = [a.title for a in SAMPLE_ANIME]
    assert audit_all(strings) == []


def test_seasonal_event_names_clean():
    strings = [e.name for e in SEASONAL_EVENTS]
    assert audit_all(strings) == []


def test_ui_strings_clean():
    ui = [
        "季 重ね 帖",
        "アニメ × 季節 × 旬",
        "この 月 の アニメ",
        "この 月 の 旬 と 季節",
        "月 別 パレット",
        "(この 月 に 重なる 作品 は なし)",
        "生成 完了",
    ]
    assert audit_all(ui) == []
