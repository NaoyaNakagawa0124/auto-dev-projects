# 実装計画 — 両替勘

## Phase 1 — Cargo セットアップ
- `Cargo.toml` (cdylib, wasm-bindgen, getrandom features)
- `src/lib.rs` 空エントリ
- `Makefile` ビルドコマンド

## Phase 2 — データとロジック
- `currencies` モジュール: 15 通貨を ISO コード+JPY換算レート+表示記号で定義
- `items` モジュール: 10 品目を参考JPY価格+ノイズ範囲で定義
- `round` モジュール: ランダムに通貨×品目を選び、価格にランダムノイズをかけ、正解ラベルを計算
- `judge` モジュール: 70% 未満=安い、130% 超=高い、それ以外=妥当 (調整可能)

## Phase 3 — ゲーム状態
- `Game` 構造体: streak, score, time_remaining, current_round, high_streak
- `tick(delta_ms)`: 時間経過、タイムアウト判定
- `answer(verdict)`: 判定、ストリーク更新、次ラウンド生成
- 通貨難度: ストリークが 5/10/15 を超えると追加通貨解放

## Phase 4 — WASM バインディング
- `#[wasm_bindgen]` で Game を公開
- JS から `new_game()`, `tick(delta)`, `answer(0|1|2)`, `state_json()` を呼ぶ

## Phase 5 — フロントエンド
- index.html: タイトル + ゲーム画面
- ゲーム画面: 品目名、価格表示、3 ボタン、タイマー輪、ストリーク、スコア
- result overlay: 正解/不正解、円換算、参考価格、解説
- パスポートスタンプ風 CSS

## Phase 6 — テスト
- judge(): 境界値 (0.69, 0.70, 1.30, 1.31)
- round 生成が範囲内
- streak / time の遷移
- 高ストリークで難度上昇

## Phase 7 — 仕上げ
- 日本語チェック
- 375px モバイル幅対応
- README/SUMMARY
