from __future__ import annotations

from kyuufu.messages import MESSAGES, BANNED_WORDS, by_tier, pick


def test_message_count():
    assert len(MESSAGES) == 40


def test_message_ids_unique():
    ids = [m.id for m in MESSAGES]
    assert len(set(ids)) == len(ids)


def test_message_texts_unique():
    texts = [m.text for m in MESSAGES]
    assert len(set(texts)) == len(texts)


def test_messages_terminate_with_period():
    for m in MESSAGES:
        assert m.text.endswith("。"), f"missing period: {m.id}"


def test_messages_under_60_chars():
    for m in MESSAGES:
        assert len(m.text) <= 60, f"{m.id} is {len(m.text)} chars: {m.text}"


def test_no_banned_words():
    for m in MESSAGES:
        for w in BANNED_WORDS:
            assert w not in m.text, f"'{w}' found in {m.id}: {m.text}"


def test_tiers_have_10_each():
    for tier in ("evening", "deep", "predawn", "day"):
        assert len(by_tier(tier)) == 10, f"tier {tier} has wrong count"


def test_pick_is_deterministic_for_same_seed():
    a = pick(7)
    b = pick(7)
    assert a.id == b.id


def test_pick_with_tier_returns_that_tier():
    for tier in ("evening", "deep", "predawn", "day"):
        m = pick(seed=1, tier=tier)
        assert m.tier == tier


def test_no_commanding_endings():
    """Catch lazy command-form leaks like '寝なさい' or '止めなさい'."""
    for m in MESSAGES:
        assert "なさい" not in m.text, f"command-form in {m.id}: {m.text}"


def test_no_comparison_phrases():
    for m in MESSAGES:
        assert "他の人" not in m.text
        assert "みんな" not in m.text
        assert "ランカー" not in m.text
