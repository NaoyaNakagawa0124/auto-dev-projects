# 日々の昔 — Plan

## Phase 1 — Scaffold
- Cargo.toml (wasm-bindgen, serde, serde-json), crate-type cdylib + rlib
- README / PLAN / CLAUDE
- web/ ディレクトリで静的ファイル

## Phase 2 — Vignettes + selection logic
- `src/vignettes.rs`: ~40 件の hand-written vignette (`Vignette { date_md, year, title, body, motif, mood }`)
- `src/lib.rs`: `find_for_date(date_iso)` → `(Vignette, is_nearby: bool)` (近い日にフォールバック)
- すべてピュア・関数、 wasm 抜きで cargo test 可能

## Phase 3 — Motifs (SVG)
- `src/motifs.rs`: 8〜12 個のミニ SVG <path d="...">、 motif_id → path string
- モチーフ: 花、 ランプ、 手、 葉、 椀、 籠、 鳥、 雲、 月、 影、 階段、 木戸

## Phase 4 — WASM API
- wasm-bindgen で公開する関数:
  - `vignette_for(date_iso: &str) -> JsValue` (Vignette JSON)
  - `vignette_at(date_iso: &str) -> JsValue` (allow date pick)
  - `motif_svg(motif_id: &str) -> String`
  - `available_dates() -> JsValue` (UI で「歴日」 一覧用)

## Phase 5 — Frontend
- `web/index.html` + `web/style.css` + `web/app.js`
- WASM を import、 今日の vignette を初期表示、 前後の日付ナビ
- 「今夜の思い」 入力欄 → localStorage に date keyed で保存
- soft cream + ink palette、 余白多め

## Phase 6 — Tests
- `tests/vignettes.rs`: dataset 一貫性、 selection logic、 nearby fallback
- (WASM-bindgen API は wasm-bindgen-test を使うと wasm-pack test --node が必要なので、 ロジック側で十分カバー)

## Phase 7 — Build + polish
- wasm-pack build --target web --release
- web/ 直下に pkg ディレクトリが生成、 静的サーブで動作確認
- SUMMARY、 dashboard、 commit
