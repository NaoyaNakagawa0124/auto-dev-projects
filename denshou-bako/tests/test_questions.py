from datetime import date

from denshou_bako.questions import (
    QUESTIONS,
    by_category,
    question_for,
    total,
)


def test_at_least_365_questions():
    assert total() >= 365


def test_seven_categories_present():
    cats = {q.category for q in QUESTIONS}
    assert cats == {"philosophy", "people", "money", "failure", "tools", "era", "legacy"}


def test_by_category_returns_only_that_category():
    for cat in ("philosophy", "people", "money", "failure", "tools", "era", "legacy"):
        qs = by_category(cat)
        assert qs
        assert all(q.category == cat for q in qs)


def test_question_for_is_deterministic():
    d = date(2026, 5, 17)
    q1 = question_for(d)
    q2 = question_for(d)
    assert q1.id == q2.id
    assert q1.text == q2.text


def test_question_for_different_days_give_different_questions():
    q1 = question_for(date(2026, 1, 1))
    q2 = question_for(date(2026, 1, 2))
    q3 = question_for(date(2026, 1, 3))
    assert {q1.id, q2.id, q3.id} == {q1.id, q2.id, q3.id}
    assert q1.id != q2.id
    assert q2.id != q3.id


def test_categories_rotate_week_over_week():
    """A 7-day window should hit at least 6 distinct categories (interleaving)."""
    start = date(2026, 1, 1)
    cats = set()
    for offset in range(7):
        d = start.fromordinal(start.toordinal() + offset)
        cats.add(question_for(d).category)
    assert len(cats) >= 6


def test_question_for_wraps_after_year():
    q_jan_1 = question_for(date(2026, 1, 1))
    q_dec_31 = question_for(date(2026, 12, 31))
    # day 1 vs day 365 — both valid, different
    assert q_jan_1.id != q_dec_31.id


def test_no_empty_question_texts():
    for q in QUESTIONS:
        assert q.text.strip()
        assert "。" in q.text or "?" in q.text or "？" in q.text or "ください" in q.text
