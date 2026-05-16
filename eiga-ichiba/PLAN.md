# 実装計画 — 映画市場

## Phase 1 — プロジェクト
- Makefile (pkg-config で raylib リンク)
- README / PLAN / CLAUDE.md
- `src/film.h` `src/film.c` 映画データ
- `src/game.h` `src/game.c` 純粋ロジック
- `src/render.c` Raylib 描画
- `src/main.c` エントリ

## Phase 2 — データ
- 12 本の架空映画
- 各映画: title, director, genre, budget_oku, hype (0-100), seed_return
- seed_return は固定 (0.3..3.8) で再現性確保

## Phase 3 — ロジック (game.c)
- `GameState`: phase, current_month(0-11), films[12], current_player(0/1), players[2] (cash, allocations)
- 各月のフロー: PreviewFilm → Allocate(P1) → Allocate(P2) → Release → Settle → NextMonth
- リターン計算: `multiplier = seed_return * (0.6 + hype/250) * noise(0.85-1.15)`
- 純粋関数で書き、テスト可能に

## Phase 4 — 描画 (render.c)
- 場面別の DrawXxx 関数
- ポスターの抽象描画 (3つの矩形 + ジャンルアイコン)
- HUD: 月、フェーズ、プレイヤー、現金
- リターン演出: バーが伸びる

## Phase 5 — テスト
- `tests/test_game.c` で純粋ロジックをテスト
- リターン計算が範囲内、ゲーム遷移が正しい、勝者判定

## Phase 6 — 仕上げ
- 日本語 UI の整合性
- README/SUMMARY 整備
