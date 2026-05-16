# 十五秒 — Plan

## Phase 1 — Scaffold
- Cargo.toml (wasm-bindgen + serde-wasm-bindgen)
- src/{lib.rs,prompts.rs,voice.rs}
- web/{index.html,style.css,app.js}, web/pkg (generated)

## Phase 2 — Prompts + voices
- `voice.rs`: 3 voices (quiet / friend / mother), each has 「promptへの語り口」 が違う
- `prompts.rs`: 40 micro-prompts (object-of-interest only), voice ごとに rendering を変える
- 鍵: 1 prompt + 1 voice → 1 final string

## Phase 3 — WASM API
- `prompt_at(touch_index_today: u32, voice_key: &str) -> JsValue`
- `voices() -> JsValue` (UI 用)
- `banned_words()` and `farewell(voice_key)` (画面遷移 で表示)

## Phase 4 — Frontend
- index.html: 1 button (今だけ)、 大きな円、 prompt 表示エリア、 farewell エリア
- 状態: idle → counting (15s) → fading → idle
- カウンタは localStorage に `{date: YYYY-MM-DD, count: N}`
- 「声を変える」 セレクタ (3 ボタン)
- アクセシビリティ: 大きなフォント、 高コントラスト OFF (うるさいから)

## Phase 5 — Tests
- `tests/prompts.rs`: 40 件以上、 各 60 chars 以内、 banned words なし
- `tests/voice.rs`: 各 voice の rendering テスト、 farewell が banned words なし
- `tests/wasm_api.rs` 不要 (純 Rust ロジックで十分)

## Phase 6 — Polish + commit
- wasm-pack build
- python3 -m http.server で smoke
- SUMMARY、 dashboard、 commit
