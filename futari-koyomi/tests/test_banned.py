from app.banned import audit_all, find_banned
from app.holidays import list_year, _RITUAL_TEMPLATES  # type: ignore


def test_find_hit_and_miss():
    assert find_banned("ふたり 度 が 高い") == "ふたり 度"
    assert find_banned("お疲れ さま") is None
    assert find_banned("並んで お茶 を 5 分") is None


def test_all_curated_and_generated_holidays_clean():
    strings = []
    for h in list_year():
        strings.append(h.name)
        strings.append(h.source)
        for r in h.rituals:
            strings.append(r)
    hits = audit_all(strings)
    assert hits == [], f"banned words in holidays/rituals: {hits}"


def test_raw_ritual_templates_clean():
    strings = []
    for tag, pool in _RITUAL_TEMPLATES.items():
        strings.extend(pool)
    hits = audit_all(strings)
    assert hits == [], f"banned words in ritual templates: {hits}"


def test_ui_strings_clean():
    ui = [
        "ふたり暦",
        "今宵 5 分 で 一緒 に できる こと",
        "今夜 の 約束 に",
        "やった ね",
        "ふたり の 暦",
        "約束 を 解除",
        "ひと こと (任意)",
        "まだ 何 も 約束 して い ません。",
    ]
    assert audit_all(ui) == []
