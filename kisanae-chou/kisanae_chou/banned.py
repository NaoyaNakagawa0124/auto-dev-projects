BANNED_WORDS = [
    "神 アニメ",
    "神アニメ",
    "クソ アニメ",
    "クソアニメ",
    "神 回",
    "神回",
    "ランキング",
    "TOP 5",
    "TOP 10",
    "最強",
    "お前",
    "ダメ",
]


def find_banned(s: str):
    for w in BANNED_WORDS:
        if w in s:
            return w
    return None


def audit_all(strings):
    return [(s, find_banned(s)) for s in strings if find_banned(s)]
