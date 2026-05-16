import pytest

from kotoba_mado.models import Log, Session


def test_session_validates_date_and_category():
    with pytest.raises(ValueError):
        Session(date="not-a-date", language="en", category="read", minutes=10)
    with pytest.raises(ValueError):
        Session(date="2026-05-17", language="en", category="not-a-cat", minutes=10)


def test_session_clamps_minutes_negative_to_zero():
    s = Session(date="2026-05-17", language="en", category="read", minutes=-5)
    assert s.minutes == 0


def test_session_normalizes_language_and_note():
    s = Session(date="2026-05-17", language="EN", category="read", minutes=10,
                note="  hello  ")
    assert s.language == "en"
    assert s.note == "hello"


def test_session_roundtrip():
    s = Session(date="2026-05-17", language="ja", category="vocab", minutes=42, note="ok")
    d = s.to_dict()
    assert d == {"date": "2026-05-17", "language": "ja", "category": "vocab",
                 "minutes": 42, "note": "ok"}
    assert Session.from_dict(d) == s


def test_log_add_and_extend():
    log = Log()
    s1 = Session(date="2026-05-17", language="ja", category="read", minutes=30)
    s2 = Session(date="2026-05-17", language="ja", category="listen", minutes=20)
    log.add(s1)
    log.extend([s2])
    assert len(log.sessions) == 2


def test_log_roundtrip():
    log = Log()
    log.add(Session(date="2026-05-17", language="ja", category="read", minutes=30))
    d = log.to_dict()
    assert d["version"] == 1
    assert len(d["sessions"]) == 1
    log2 = Log.from_dict(d)
    assert len(log2.sessions) == 1
    assert log2.sessions[0].minutes == 30


def test_log_from_empty_dict():
    log = Log.from_dict(None)
    assert log.sessions == []
    log2 = Log.from_dict({})
    assert log2.sessions == []
