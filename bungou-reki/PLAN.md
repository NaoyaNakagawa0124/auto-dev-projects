# 実装計画 — 文豪暦

## Phase 1: データ層
- `src/data/authors.json` に 50+ 名の作家データを収録
- 各作家: id, name, name_en, country, born (YYYY-MM-DD), died (null|YYYY-MM-DD), works[], stats (literary/prolific/influence/longevity), portrait_initial, era
- `src-tauri/src/data.rs` で読み込み、`today_summons(date)` 関数を実装

## Phase 2: バックエンド (Rust/Tauri)
- `commands::today_summons(date) -> Vec<Card>`: 今日が誕生日・命日・代表作刊行日の作家を返す
- `commands::recruit(card_id)`: コレクションに追加（日付ロック）
- `commands::collection_load() / save()`: ローカルJSON永続化
- `commands::log_reading(author_id, book, pages)`: 読書記録と XP 加算
- `commands::battle(deck_ids, opponent_seed) -> BattleResult`: 3ラウンド対戦解決
- `commands::calendar(month) -> Vec<DayEvents>`: 暦ビュー

## Phase 3: フロントエンド
- 5タブ構成: 召喚 / 蔵書 / 対戦 / 読書ログ / 暦
- 古書館アエステティック (セピア背景 + 金縁カード + 明朝体)
- カードコンポーネント (作家名/国/時代/4ステータスの星)
- 対戦アニメーション (ステータス比較を順番に開く)

## Phase 4: テスト
- Rust: 戦闘ロジック (battle_round, resolve), データ整合性
- JS: カード描画ユニット、状態機械

## Phase 5: 仕上げ
- 全UI日本語チェック
- モバイル/小ウィンドウ対応
- README/SUMMARY 整備
