# 伝承箱 — Plan

## Phase 1 — Scaffold
- pyproject (Rich), src layout, entry `denshou`

## Phase 2 — Question bank
- `categories.py`: 7 カテゴリ
- `questions.py`: ~365 問、 `question_for(date)` で決定論的 mapping

## Phase 3 — Audio session module (abstracted)
- `audio.py`:
  - backend abstraction (subprocess command + args)
  - `record_session(question, out_dir)` — TTS + ボタン待ち + 録音
  - `MockBackend` for tests / dev (no hardware)
  - `MacBackend` (say + sox)
  - `PiBackend` (espeak-ng + arecord + RPi.GPIO)
- emits `{date}.wav` + `{date}.json` to out_dir

## Phase 4 — Archiver + CLI
- `book.py`: archive folder → Markdown / HTML (with optional Whisper transcription)
- `cli.py` subcommands:
  - `play-today [DATE]` — TTS で今日の問いを読む (録音はしない)
  - `record [--mock] [--out DIR]` — ボタン待ちループ
  - `book DIR [--html] [--out FILE]` — wisdom book を生成
  - `demo --out DIR` — 7 日分の mock 録音 + meta を生成
  - `parts` — BOM (部品表) を表示
  - `wiring` — 配線図 ASCII を表示

## Phase 5 — Wiring guide (RUNNING.md)
- Parts table (型番 + 推定価格)
- ASCII schematic
- systemd unit file template
- 初期 setup チェックリスト

## Phase 6 — Tests
- `test_categories.py`
- `test_questions.py`
- `test_audio.py` (mock backend)
- `test_book.py`
- `test_cli.py`

## Phase 7 — Polish, dashboard, commit (100 件目)
