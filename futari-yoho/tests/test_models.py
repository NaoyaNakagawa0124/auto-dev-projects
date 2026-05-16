from datetime import date

import pytest

from futari_yoho.models import CheckIn, Day, Partner, State, clamp_scale


def test_clamp_scale_clamps_and_rejects_garbage():
    assert clamp_scale(3) == 3
    assert clamp_scale(0) == 0
    assert clamp_scale(-2) == 0
    assert clamp_scale(99) == 5
    assert clamp_scale("3") == 3
    assert clamp_scale("hello") == 0
    assert clamp_scale(None) == 0


def test_checkin_clamps_on_construction():
    c = CheckIn(mood=99, energy=-1, solo_want="2", note="  hi  ")
    assert c.mood == 5
    assert c.energy == 0
    assert c.solo_want == 2
    assert c.note == "hi"


def test_checkin_answered_requires_all_three_scales():
    assert CheckIn(mood=3, energy=3, solo_want=3).answered is True
    assert CheckIn(mood=3, energy=3, solo_want=0).answered is False
    assert CheckIn().answered is False


def test_checkin_note_is_truncated():
    c = CheckIn(mood=3, energy=3, solo_want=3, note="x" * 200)
    assert len(c.note) == 140


def test_checkin_roundtrip():
    c = CheckIn(mood=4, energy=2, solo_want=5, note="ok")
    d = c.to_dict()
    c2 = CheckIn.from_dict(d)
    assert c2 == c
    assert CheckIn.from_dict(None) is None
    assert CheckIn.from_dict({}) == CheckIn()


def test_partner_id_validation():
    with pytest.raises(ValueError):
        Partner(id="c")
    p = Partner(id="a", name="ナオヤ")
    assert p.id == "a"


def test_day_get_set():
    d = Day(date_iso="2026-05-17")
    assert d.get("a") is None
    d.set("a", CheckIn(mood=3, energy=3, solo_want=3))
    assert d.get("a").mood == 3
    with pytest.raises(ValueError):
        d.set("c", CheckIn())


def test_state_record_and_serialize():
    s = State()
    s.record("a", date(2026, 5, 17), CheckIn(mood=4, energy=4, solo_want=2, note="まる"))
    s.record("b", "2026-05-17", CheckIn(mood=2, energy=3, solo_want=4))
    raw = s.to_dict()
    assert raw["version"] == 1
    assert "2026-05-17" in raw["days"]
    assert raw["days"]["2026-05-17"]["a"]["mood"] == 4
    assert raw["days"]["2026-05-17"]["b"]["solo_want"] == 4

    s2 = State.from_dict(raw)
    assert s2.day("2026-05-17").a.note == "まる"
    assert s2.day("2026-05-17").b.solo_want == 4
    assert s2.partners["a"].name == "あ"


def test_state_default_partners_present():
    s = State()
    assert set(s.partners.keys()) == {"a", "b"}
    assert s.partners["a"].id == "a"
