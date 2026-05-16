# 実装計画 — 副業バブル

## Phase 1 — プロジェクト
- `src-tauri/Cargo.toml` (cdylib, desktop feature optional)
- `src-tauri/tauri.conf.json`
- `src/index.html` `style.css` `app.js`
- README / PLAN / CLAUDE

## Phase 2 — データ
- `data/hustles.json` に 8 副業
- フィールド: id, name_jp, emoji, click_reward, base_income, upgrade_base_cost, cost_growth (1.15)

## Phase 3 — Rust ロジック
- `src-tauri/src/game.rs` 純粋関数
  - `upgrade_cost(base, growth, count)` 
  - `auto_income_per_sec(hustles, upgrades, viral)`
  - `apply_viral(state, hustle_id, multiplier, duration)`
  - `step(state, delta_ms)` — 時刻進行
  - `click(state, hustle_id)` — 即時収入
  - `buy_upgrade(state, hustle_id)` — コスト引き落とし＋アップグレード追加
  - `roll_viral(state, rng)` — バイラル発生判定
- `cargo test` で 25+ ケース

## Phase 4 — JS ロジック (1:1 ミラー)
- `modules/game.js` 同等関数
- node:test で検証

## Phase 5 — UI
- 8 つのカードを 4×2 グリッド
- 各カード: emoji, name, アップグレード数, /秒, クリックボタン, アップグレードボタン
- 上部: 現金, /秒, 進捗バー (¥10M に対する%)
- バイラル時に派手なオーバーレイ＋カードハイライト
- クリアバナー
- ガラスモーフィズム CSS

## Phase 6 — 永続化
- localStorage に cash, upgrades[], started_at, viral history
- 5 秒毎に自動保存

## Phase 7 — 仕上げ
- 日本語チェック
- モバイル幅 375px
- README/SUMMARY
