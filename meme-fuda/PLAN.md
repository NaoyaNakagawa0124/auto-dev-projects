# ミーム札 — Plan

## Phase 1 — Scaffold
- pyproject (Textual, Rich), src layout, entry `meme-fuda`

## Phase 2 — Templates + models
- `templates.py`: 12 TEMPLATES with id, name, kaomoji_lines, hint_top, hint_bottom
- `models.py`: `Card(id, template_id, top, bottom, speaker, writer, tags, created_at)`,
  `Deck(version, cards)`
- `storage.py`: atomic JSON at `~/.meme-fuda/deck.json`

## Phase 3 — Card renderer
- `render.py`:
  - `render_card(card_or_preview, template) -> Panel` — frame, top text, kaomoji body, bottom text, footer (話: X / 書: Y / YYYY-MM-DD)
  - `render_card_text(preview, template) -> str` — plain text version (for tests / export)
  - subtle dimmed border, generous padding, large font weights

## Phase 4 — Textual TUI
- `app.py`: MemeFudaApp with screens
- `screens/setup.py`: 「話す人」「書く人」を入力する起動画面 (defaults: おじいちゃん/おばあちゃん, 孫)
- `screens/compose.py`: テンプレート picker (← → で切替) + Live preview + 上下テキスト入力
- `screens/deck.py`: 保存済み札を ← → で 1 枚ずつめくる
- Modal: 「これを札に?」確認

## Phase 5 — Tests
- `tests/test_templates.py`
- `tests/test_models.py`
- `tests/test_storage.py`
- `tests/test_render.py`
- `tests/test_app_smoke.py` (run_test pilot)

## Phase 6 — Polish + ship
- SUMMARY, dashboard, state, commit
