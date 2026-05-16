# 実装計画 — やさい日記

## Phase 1 — プロジェクト
- Makefile (pkg-config raylib)
- src/crop.h crop.c (5 種類の野菜、6 段階)
- src/diary.h diary.c (純粋ロジック、永続化)
- src/render.c (Raylib 描画)
- src/main.c (入力)

## Phase 2 — データ
- 5 crops: トマト, キュウリ, ピーマン, ナス, トウモロコシ
- 6 stages: SEED, SPROUT, LEAFY, BUD, FLOWER, FRUIT
- 28 日 (DAYS_PER_SEASON)

## Phase 3 — ロジック
- DiaryState: season_id, crops_chosen[3], current_day, entries[28][3]
- entry: leaf_count_choice (0-4), color_choice (0-3), mood_choice (0-3)
- crop_stage_at_day(day) → どの段階か
- diary_save/load to JSON

## Phase 4 — 描画
- pixel-art crops: 6 stages × 5 crops = 30 ミニチュア (関数で描画)
- 観察カードはレイアウト固定で 3 つの選択肢
- カレンダー: 4 週 × 7 日 = 28 セル、各セルに mood emoji と veggie stage

## Phase 5 — テスト
- tests/test_diary.c で純粋ロジックをテスト
- crop_stage_at_day の境界
- save/load round trip
- 入力選択の保存

## Phase 6 — 仕上げ
- 日本語チェック
- 完成テンション 「だいすき！」「すばらしい!」 ポップアップ
