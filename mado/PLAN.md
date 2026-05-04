# PLAN — mado

## Phase 1 — Rust コア
- `Mado` 構造体（シーン番号・時間・粒子配列）
- `set_scene(idx)` / `tick(dt)` / `gradient()` / `silhouettes()` / `particles()` / `particle_kind()`
- `generate_audio_for(scene, sr, sec)` — 状態を変えない音響合成
- 6 シーン分のグラデーション・シルエット形状・粒子設定・音響レシピ
- `cargo test` で 8 ケース通る

## Phase 2 — WASM ビルド
- `wasm-pack build --target web --out-dir pkg --release`
- `pkg/` に `mado.js` + `mado_bg.wasm`（約 31KB）

## Phase 3 — データ（6 つの窓）
- `data/windows.js` に 6 都市 × 3 フレーズ
- 各フレーズに：原文・読み（カタカナ）・意味・場面メモ

## Phase 4 — UI（HTML + CSS）
- 大きな窓キャンバス → ノートカード → フレーズカード → アクション → 手帳ドロワー
- ガラスモーフィズム、Noto Serif JP / Cormorant Garamond
- モバイル 480px 以下でスタック表示

## Phase 5 — 配線（main.js）
- WASM 初期化、シーン読み込み、Canvas 2D 描画ループ
- Rust 生成音バッファを `AudioContext.createBuffer().copyToChannel()` でループ再生
- フェードイン／アウト、シーン切替、手帳の永続化

## Phase 6 — 品質チェック
- 日本語のみの UI
- モバイル幅で崩れないか
- スクショ撮りたくなるか
