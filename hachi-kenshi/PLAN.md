# hachi-kenshi — 実装 計画

## Phase 1: Cargo Scaffold
- Cargo.toml (lib, cdylib + rlib, wasm-bindgen, serde)
- README / PLAN / CLAUDE / .gitignore

## Phase 2: Rust 純ロジック
- `src/cause.rs` — `Cause` enum, label / alibi
- `src/case.rs` — `Case` struct, `Chapter` enum, 12 件 の データ
- `src/verdict.rs` — 起訴 判定 (correct / wrong + 解説)
- `src/score.rs` — 採点 + PB 構造
- `src/banned.rs` — BANNED_WORDS 監査

## Phase 3: WASM Bindings
- `src/lib.rs` — public API:
  - `listChapters() -> JsValue`
  - `getCase(id) -> JsValue`
  - `submitVerdict(case_id, accused_cause) -> JsValue` (correct, explanation)
  - `computeScore(results, total_ms) -> JsValue`
  - `causeLabel(cause)` / `chapterLabel(chapter)`

## Phase 4: Tests
- `tests/case_test.rs` — 12 件、 ID 重複 なし、 全 章 3 件 ずつ、 culprit は suspects に 含まれる
- `tests/cause_test.rs` — 7 cause、 各 cause の label / alibi が 空 でない
- `tests/verdict_test.rs` — 正解 / 誤起訴、 explanation 取得
- `tests/score_test.rs` — base 12 件 全 正解 / 誤起訴 / 章 ボーナス / タイム ボーナス
- `tests/banned_test.rs` — 全 case 文字列 + cause label/alibi を 監査

## Phase 5: WASM ビルド
- `wasm-pack build --target web --out-dir www/pkg`

## Phase 6: Frontend (www/)
- `index.html` — ホーム / 事件 / 結果 / 完了
- `style.css` — セピア ノワール テーマ
- `main.js` — WASM glue, localStorage progress + PB

## Phase 7: Polish + commit
- BANNED audit、 clippy、 README / CLAUDE / SUMMARY 最終
- 親 dashboard + commit + push
