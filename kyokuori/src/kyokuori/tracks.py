"""30 representative chart tracks circa 2026-05.

Feature values (bpm/energy/valence/danceability) are creative reconstructions
for a craft-pattern demo — not pulled from a live API. Artist + title are
real public chart entries; song characteristics are illustrative.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Track:
    id: str
    title: str
    artist: str
    bpm: int
    key: int          # 0=C, 1=C#, ..., 11=B
    mode: int         # 0=minor, 1=major
    energy: float     # 0.0-1.0
    valence: float    # 0.0-1.0 (mood positivity)
    danceability: float  # 0.0-1.0
    chart_rank: int   # 1-30


TRACKS: tuple[Track, ...] = (
    Track("espresso",          "Espresso",                  "Sabrina Carpenter", 104,  3, 1, 0.78, 0.86, 0.78,  1),
    Track("apt",               "APT.",                      "Rosé & Bruno Mars", 149,  4, 1, 0.85, 0.79, 0.74,  2),
    Track("fortnight",         "Fortnight",                 "Taylor Swift",      94,   9, 0, 0.42, 0.31, 0.55,  3),
    Track("good-luck-babe",    "Good Luck, Babe!",          "Chappell Roan",     117,  0, 1, 0.73, 0.66, 0.68,  4),
    Track("birds-of-a-feather","Birds of a Feather",        "Billie Eilish",     105,  2, 1, 0.51, 0.45, 0.62,  5),
    Track("not-like-us",       "Not Like Us",               "Kendrick Lamar",    101,  7, 0, 0.66, 0.53, 0.90,  6),
    Track("a-bar-song",        "A Bar Song (Tipsy)",        "Shaboozey",         81,   8, 1, 0.74, 0.74, 0.71,  7),
    Track("please-please",     "Please Please Please",      "Sabrina Carpenter", 107,  5, 1, 0.58, 0.69, 0.79,  8),
    Track("die-with-a-smile",  "Die With A Smile",          "Lady Gaga & Bruno", 84,   6, 1, 0.55, 0.46, 0.52,  9),
    Track("taste",             "Taste",                     "Sabrina Carpenter", 113,  4, 1, 0.74, 0.78, 0.75, 10),
    Track("guess",             "Guess",                     "Charli xcx",        125,  1, 1, 0.80, 0.61, 0.83, 11),
    Track("texas-hold-em",     "Texas Hold 'Em",            "Beyoncé",           110, 11, 1, 0.69, 0.78, 0.74, 12),
    Track("we-cant-be-friends","we can't be friends",       "Ariana Grande",     107,  3, 0, 0.53, 0.32, 0.58, 13),
    Track("end-of-beginning",  "End of Beginning",          "Djo",               118,  0, 1, 0.63, 0.45, 0.49, 14),
    Track("lose-control",      "Lose Control",              "Teddy Swims",       89,   9, 1, 0.71, 0.58, 0.61, 15),
    Track("beautiful-things",  "Beautiful Things",          "Benson Boone",      109,  4, 1, 0.66, 0.40, 0.51, 16),
    Track("stick-season",      "Stick Season",              "Noah Kahan",        130, 11, 1, 0.62, 0.41, 0.45, 17),
    Track("agora-hills",       "Agora Hills",               "Doja Cat",          84,   2, 0, 0.65, 0.55, 0.73, 18),
    Track("greedy",            "Greedy",                    "Tate McRae",        111,  6, 1, 0.74, 0.79, 0.74, 19),
    Track("dance-the-night",   "Dance The Night",           "Dua Lipa",          110,  6, 1, 0.84, 0.75, 0.80, 20),
    Track("flowers",           "Flowers",                   "Miley Cyrus",       118,  0, 1, 0.69, 0.65, 0.71, 21),
    Track("snooze",            "Snooze",                    "SZA",               143,  8, 1, 0.59, 0.55, 0.61, 22),
    Track("paint-the-town",    "Paint The Town Red",        "Doja Cat",          100,  1, 1, 0.73, 0.62, 0.84, 23),
    Track("lovin-on-me",       "Lovin On Me",               "Jack Harlow",       104,  2, 0, 0.69, 0.71, 0.78, 24),
    Track("water",             "Water",                     "Tyla",              112,  0, 0, 0.61, 0.66, 0.80, 25),
    Track("vampire",           "Vampire",                   "Olivia Rodrigo",    137,  2, 1, 0.62, 0.32, 0.51, 26),
    Track("dancing-in-flames", "Dancing in the Flames",     "The Weeknd",        125,  4, 0, 0.71, 0.42, 0.67, 27),
    Track("messy",             "Messy",                     "Lola Young",        115,  3, 1, 0.65, 0.58, 0.74, 28),
    Track("a-little-piece",    "A Little Piece of Heaven",  "Avenged Sevenfold", 105,  9, 0, 0.83, 0.42, 0.45, 29),
    Track("disease",           "Disease",                   "Lady Gaga",         118,  8, 0, 0.75, 0.37, 0.58, 30),
)


BANNED_WORDS: tuple[str, ...] = (
    "絶対", "必ず", "神", "最強", "神曲", "炎上", "ヤバい",
)


def by_id(track_id: str) -> Track | None:
    for t in TRACKS:
        if t.id == track_id:
            return t
    return None


def top_n(n: int) -> tuple[Track, ...]:
    ranked = sorted(TRACKS, key=lambda t: t.chart_rank)
    return tuple(ranked[:n])
