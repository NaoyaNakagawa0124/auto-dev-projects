from __future__ import annotations

from kyuufu.responder import find_reaction, reply_for, REACTIONS
from kyuufu.messages import BANNED_WORDS


def test_each_reaction_has_replies():
    for r in REACTIONS:
        assert len(r.replies) >= 2
        assert len(r.triggers) >= 1


def test_each_reply_under_80_chars():
    for r in REACTIONS:
        for reply in r.replies:
            assert len(reply) <= 80, f"too long: {reply}"


def test_no_banned_words_in_replies():
    for r in REACTIONS:
        for reply in r.replies:
            for w in BANNED_WORDS:
                assert w not in reply, f"'{w}' in reply: {reply}"


def test_matches_simple_trigger():
    r = find_reaction("あと1勝だけお願い")
    assert r is not None
    assert "1 勝" in r.replies[0] or "1勝" in r.replies[0]


def test_matches_with_spaces():
    r = find_reaction("あと 1 勝 だけ お願い")
    assert r is not None


def test_matches_with_full_width_space():
    r = find_reaction("あと 1 勝 だけ お願い")
    assert r is not None


def test_matches_tired_keyword():
    r = find_reaction("もう疲れた…")
    assert r is not None


def test_no_match_returns_none():
    assert find_reaction("普通の雑談だよ") is None


def test_reply_for_unmatched_returns_none():
    assert reply_for("こんにちは") is None


def test_reply_for_matched_returns_string():
    out = reply_for("あと1勝だけ", seed=1)
    assert isinstance(out, str)
    assert len(out) > 0


def test_reply_for_is_deterministic():
    a = reply_for("もうちょっと", seed=42)
    b = reply_for("もうちょっと", seed=42)
    assert a == b
