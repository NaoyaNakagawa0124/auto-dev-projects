import json
from datetime import date
from pathlib import Path

from denshou_bako.audio import MockBackend
from denshou_bako.session import read_meta, run_session, session_paths


def test_session_paths_uses_iso_date(tmp_path: Path):
    audio, meta = session_paths(tmp_path, date(2026, 5, 17))
    assert audio.name == "2026-05-17.wav"
    assert meta.name == "2026-05-17.json"
    assert audio.parent == tmp_path
    assert tmp_path.exists()


def test_run_session_recorded_when_pressed(tmp_path: Path):
    b = MockBackend()
    b.queue_press("press")
    result = run_session(b, tmp_path, day=date(2026, 5, 17), max_record_s=5.0)
    assert result.skipped is False
    assert result.duration_s > 0
    audio = Path(result.audio_path)
    meta = Path(result.meta_path)
    assert audio.exists()
    assert meta.exists()
    raw = json.loads(meta.read_text(encoding="utf-8"))
    assert raw["date_iso"] == "2026-05-17"
    assert raw["skipped"] is False


def test_run_session_skipped_when_long_press(tmp_path: Path):
    b = MockBackend()
    b.queue_press("long")
    result = run_session(b, tmp_path, day=date(2026, 5, 17))
    assert result.skipped is True
    assert result.audio_path is None
    assert Path(result.meta_path).exists()


def test_run_session_skipped_when_timeout(tmp_path: Path):
    b = MockBackend()
    # no queued press → timeout
    result = run_session(b, tmp_path, day=date(2026, 5, 17), press_timeout_s=0.01)
    assert result.skipped is True


def test_run_session_announces_question_via_tts(tmp_path: Path):
    b = MockBackend()
    b.queue_press("press")
    result = run_session(b, tmp_path, day=date(2026, 5, 17))
    # First speak() call should contain "今日の問い"
    assert b.spoken
    assert "今日の問い" in b.spoken[0]
    # last speak should be 'thank you'
    assert any("ありがとう" in s for s in b.spoken)


def test_read_meta_roundtrip(tmp_path: Path):
    b = MockBackend()
    b.queue_press("press")
    result = run_session(b, tmp_path, day=date(2026, 5, 17))
    loaded = read_meta(Path(result.meta_path))
    assert loaded.date_iso == result.date_iso
    assert loaded.question_id == result.question_id
    assert loaded.skipped == result.skipped
