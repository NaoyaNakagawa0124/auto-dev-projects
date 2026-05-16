# 二人予報 — Implementation Plan

## Phase 1 — Scaffold
- pyproject.toml (Textual 8.x, Rich), src layout, entry point `futari-yoho`
- README, PLAN, CLAUDE.md

## Phase 2 — Domain models + storage
- `models.py`: `Partner` (id="a"|"b", name, accent_color), `CheckIn` (date, mood 1-5, energy 1-5, solo_want 1-5, note), `Day` (date, a:CheckIn?, b:CheckIn?)
- `storage.py`: load/save JSON, atomic write via temp file + rename, schema version
- `dates.py`: today, week_dates(n), iso_date

## Phase 3 — Weather mapping (pure)
- `weather.py`:
  - `single_weather(mood, energy)` → icon + label (晴 / 薄日 / 雲 / 雨 / 嵐 / 月夜 / 凪)
  - `paired_weather(check_a, check_b)` → label + 一言 + accent color
  - `tonight_suggestion(check_a, check_b)` → text (話す夜 / 並んでいる夜 / ひとりひとりの夜 / 静かな夜)
  - `month_trend(days)` → list of (date, paired_label)

## Phase 4 — Textual TUI
- `app.py`: main FutariYohoApp with screens
- `screens/main.py`: today panel | week grid | suggestion | month sparkline
- `screens/checkin.py`: 4-step modal (mood→energy→solo→note), arrow-key driven, no mouse needed
- `widgets/weather_card.py`: a card showing one partner's check-in
- `widgets/sky_grid.py`: 7-day paired weather grid

## Phase 5 — Tests
- `tests/test_models.py`
- `tests/test_storage.py` (tmp_path)
- `tests/test_weather.py`
- `tests/test_dates.py`
- `tests/test_app_smoke.py` — Textual `App.run_test()` smoke

## Phase 6 — Polish + ship
- First-run setup writes default partners 「あ」「い」 (renamable in settings)
- `--demo` flag fills in a sample week so people can preview without check-ins
- SUMMARY.md, AUTO_DEV_LOG.md, AUTO_DEV_STATE.json, README.md, commit & push
