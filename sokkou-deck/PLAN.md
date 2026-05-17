# sokkou-deck — 実装 計画

## Phase 1: Cargo Scaffold
- Cargo.toml (lib, cdylib + rlib, wasm-bindgen, serde)
- README / CLAUDE / PLAN / .gitignore

## Phase 2: Rust 純ロジック
- `src/normalize.rs` — 入力 正規化 / 答え 判定
- `src/deck.rs` — Card / Deck struct + 5 内蔵 デッキ
- `src/run.rs` — Run state machine, advance/submit_answer
- `src/stats.rs` — Split, PersonalBest, delta 計算
- `src/banned.rs` — BANNED_WORDS 監査

## Phase 3: WASM Bindings
- `src/lib.rs` — public WASM API:
  - `list_decks() -> JsValue` (deck index)
  - `start_run(deck_id, mode, started_at_ms) -> JsValue` (run handle JSON)
  - `submit_answer(run_json, answer, now_ms) -> JsValue` (updated run)
  - `compute_result(run_json, pb_json) -> JsValue` (result with deltas)
  - `normalize_answer(s) -> String`

## Phase 4: Tests
- `tests/deck_test.rs` — 全 デッキ の カード 構造、 ID 重複 なし
- `tests/normalize_test.rs` — 半角/全角、 小文字、 カタカナ ↔ ひらがな
- `tests/run_test.rs` — start/submit/advance/finish の 状態 遷移
- `tests/stats_test.rs` — splits の delta、 PB 比較
- `tests/banned_test.rs` — 全 ユーザー 向け 文字列 を 監査

## Phase 5: WASM Build
- `wasm-pack build --target web --out-dir www/pkg`
- ビルド エラー が あれば 直す

## Phase 6: Frontend
- `www/index.html` — ホーム / ラン / リザルト の 3 画面
- `www/style.css` — スピードラン 風 ダーク モノスペース テーマ
- `www/main.js` — WASM glue, localStorage PB, タイマー (requestAnimationFrame)

## Phase 7: Polish
- BANNED_WORDS 監査 完走
- UI smoke (ブラウザ で 起動 して 動作 確認)
- README / CLAUDE 最終
- AUTO_DEV_LOG / STATE / root README 更新
- commit + push
