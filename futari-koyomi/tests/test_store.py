import datetime as dt
import json
import tempfile
from pathlib import Path

import pytest

from app.store import Promise, State, Store, TimelineEntry, default_path


@pytest.fixture
def tmp_store(tmp_path, monkeypatch):
    path = tmp_path / "state.json"
    s = Store(path=path)
    return s


def test_load_missing_returns_empty(tmp_store):
    state = tmp_store.load()
    assert state.promise is None
    assert state.timeline == []


def test_default_path_env_override(monkeypatch):
    monkeypatch.setenv("FUTARI_DATA", "/tmp/some-state.json")
    assert default_path() == Path("/tmp/some-state.json")


def test_set_promise_persists(tmp_store):
    p = tmp_store.set_promise("05-17", 1, "並んで お茶 を 5 分")
    assert p.holiday_id == "05-17"
    assert p.ritual_index == 1
    assert p.status == "set"
    loaded = tmp_store.load()
    assert loaded.promise is not None
    assert loaded.promise.holiday_id == "05-17"


def test_mark_done_updates_status(tmp_store):
    tmp_store.set_promise("05-17", 0, "ritual a")
    p = tmp_store.mark_done(note="楽しかった")
    assert p.status == "done"
    assert p.note == "楽しかった"


def test_mark_done_without_promise_returns_none(tmp_store):
    p = tmp_store.mark_done()
    assert p is None


def test_clear_promise(tmp_store):
    tmp_store.set_promise("05-17", 0, "x")
    tmp_store.clear_promise()
    assert tmp_store.load().promise is None


def test_set_promise_overwrites_previous(tmp_store):
    tmp_store.set_promise("05-17", 0, "first")
    p = tmp_store.set_promise("05-17", 2, "second")
    assert p.ritual_index == 2
    assert p.ritual_text == "second"


def test_rollover_moves_yesterday_to_timeline(tmp_path):
    # Use a custom clock to fake "yesterday → today"
    fake_now = [dt.datetime(2026, 5, 17, 21, 0, 0)]
    store = Store(path=tmp_path / "state.json", clock=lambda: fake_now[0])
    store.set_promise("05-17", 0, "yesterday ritual")
    store.mark_done(note="やった")
    # advance one day
    fake_now[0] = dt.datetime(2026, 5, 18, 9, 0, 0)
    state = store.get_state()
    assert state.promise is None
    assert len(state.timeline) == 1
    assert state.timeline[0].date == "2026-05-17"
    assert state.timeline[0].status == "done"
    assert state.timeline[0].note == "やった"


def test_rollover_unfinished_marked_skipped(tmp_path):
    fake_now = [dt.datetime(2026, 5, 17, 21, 0, 0)]
    store = Store(path=tmp_path / "state.json", clock=lambda: fake_now[0])
    store.set_promise("05-17", 0, "unfinished")
    fake_now[0] = dt.datetime(2026, 5, 18, 9, 0, 0)
    state = store.get_state()
    assert state.timeline[0].status == "skipped"


def test_recent_timeline_reverse_order(tmp_path):
    fake_now = [dt.datetime(2026, 5, 15, 21, 0, 0)]
    store = Store(path=tmp_path / "state.json", clock=lambda: fake_now[0])
    for offset in range(3):
        store.set_promise(f"05-{15+offset:02d}", 0, f"day {offset}")
        store.mark_done()
        fake_now[0] += dt.timedelta(days=1)
    # rollover the last one
    store.get_state()
    recent = store.recent_timeline(3)
    assert len(recent) == 3
    # Most recent first
    assert recent[0].date >= recent[-1].date


def test_corrupt_file_returns_empty(tmp_store):
    tmp_store.path.parent.mkdir(parents=True, exist_ok=True)
    tmp_store.path.write_text("{ not valid json")
    state = tmp_store.load()
    assert state.promise is None
    assert state.timeline == []


def test_save_atomic_no_tmp_left_behind(tmp_store):
    tmp_store.set_promise("01-01", 0, "x")
    tmp_dir = tmp_store.path.parent
    leftover = list(tmp_dir.glob("*.tmp"))
    assert not leftover
