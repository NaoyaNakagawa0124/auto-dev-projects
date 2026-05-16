# 実装計画 — ごちそう暦

## Phase 1 — プロジェクト
- `pyproject.toml` (textual>=8.0, rich)
- パッケージ `src/gochisou_goyomi/`
- `__init__.py`, `__main__.py`, `app.py`, `data.py`, `state.py`

## Phase 2 — データ
- `holidays.py` に 80 件の文化暦エントリ
- 各エントリ: id, date (MM-DD or "movable:..."), country_jp, country_flag, holiday_jp, holiday_en, dish_jp, dish_en, where (home/store/specialty), description

## Phase 3 — ロジック (data.py + state.py)
- `holiday_for_date(iso)` — 今日が該当 → 提案。なければ ±3 日探索
- `Log` クラス — 食事ログ (date, holiday_id, ate_suggested, dish, rating, note)
- 永続化: `~/.gochisou-goyomi/state.json`
- 統計: 今年の国数、最高 streak、お気に入り料理

## Phase 4 — TUI
- Today / Calendar / Stats の 3 画面
- ヘッダ: 今日の日付、踏破国数
- フッタ: キーバインド

## Phase 5 — テスト
- pytest で data.py / state.py のロジックを検証
- 境界: ±3 日探索、空ログ、ストリーク

## Phase 6 — 仕上げ
- 日本語チェック
- 起動テスト
- README/SUMMARY
