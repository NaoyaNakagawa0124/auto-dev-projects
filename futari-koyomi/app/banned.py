BANNED_WORDS = [
    "streak",
    "Streak",
    "STREAK",
    "連勝",
    "達成 度",
    "達成度",
    "効率",
    "義務",
    "サボり",
    "お前",
    "クソ",
    "無能",
    "ふたり 度",
    "夫婦 力",
    "夫婦力",
]


def find_banned(s: str):
    for w in BANNED_WORDS:
        if w in s:
            return w
    return None


def audit_all(strings):
    hits = []
    for s in strings:
        w = find_banned(s)
        if w:
            hits.append((s, w))
    return hits
