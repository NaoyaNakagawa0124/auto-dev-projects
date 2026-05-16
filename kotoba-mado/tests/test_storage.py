import json
from pathlib import Path

from kotoba_mado.models import Log, Session
from kotoba_mado.storage import load, save


def test_load_missing_returns_empty_log(tmp_path: Path):
    p = tmp_path / "nope.json"
    log = load(p)
    assert isinstance(log, Log)
    assert log.sessions == []


def test_load_garbage_returns_empty(tmp_path: Path):
    p = tmp_path / "garbage.json"
    p.write_text("not json {{", encoding="utf-8")
    log = load(p)
    assert log.sessions == []


def test_save_then_load_roundtrip(tmp_path: Path):
    p = tmp_path / "log.json"
    log = Log()
    log.add(Session(date="2026-05-17", language="ja", category="read", minutes=30, note="ok"))
    save(log, p)
    assert p.exists()
    raw = json.loads(p.read_text(encoding="utf-8"))
    assert raw["sessions"][0]["minutes"] == 30

    log2 = load(p)
    assert log2.sessions[0].note == "ok"


def test_save_creates_parent_dirs(tmp_path: Path):
    deep = tmp_path / "a" / "b" / "c" / "log.json"
    save(Log(), deep)
    assert deep.exists()


def test_save_leaves_no_temp_files(tmp_path: Path):
    p = tmp_path / "log.json"
    save(Log(), p)
    leftovers = list(tmp_path.glob(".kotoba-mado.*"))
    assert leftovers == []
