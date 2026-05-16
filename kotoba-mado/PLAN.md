# 言葉の窓 — Implementation Plan

## Phase 1 — Scaffold
- pyproject.toml (Rich), src layout, entry `kotoba-mado`
- README, PLAN, CLAUDE

## Phase 2 — Models + storage
- `models.py`: `Session(date, language, category, minutes, note)`, `Log(sessions[])`
- `categories.py`: 6 categories with palette colors, glyph chars
- `storage.py`: `~/.kotoba-mado/log.json`, atomic write, schema version
- `aggregate.py`: `by_day(log) -> dict[date_iso, list[Session]]`,
  `day_summary(sessions) -> DaySummary(minutes, dominant_category, mix)`

## Phase 3 — Renderer (pure)
- `render.py`:
  - `render_year(log, year)` → Rich `Panel` with title + mosaic + legend
  - `render_month(log, year, month)` → bigger calendar with day numbers
  - `render_today(log, date)` → close-up window with stats
  - `render_streak(log, today)` → ASCII flame + days count
  - color intensity: 0 / 1-15 / 16-30 / 31-60 / 60-120 / 120+ min
  - cell glyph for dominant category, with two-tone for mixed days
- All functions pure: take data, return Rich renderables

## Phase 4 — CLI
- `cli.py`: argparse with subcommands
  - `year [--year YYYY]`
  - `month [YYYY-MM]`
  - `today [YYYY-MM-DD]`
  - `streak`
  - `add [category] [minutes] [language] [--note ...] [--date YYYY-MM-DD]`
  - `import CSV`
  - `demo`
- All read from `--data PATH` or `~/.kotoba-mado/log.json`

## Phase 5 — Tests
- `tests/test_models.py`
- `tests/test_storage.py`
- `tests/test_aggregate.py`
- `tests/test_render.py` — assert structural facts on rendered output (color tags, day numbers, legend, etc.)
- `tests/test_cli.py` — argparse subcommands, demo, add, import roundtrip

## Phase 6 — Ship
- SUMMARY, dashboard, state, README, commit & push
