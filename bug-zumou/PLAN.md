# PLAN — bug-zumou

## Phase 1 — モデル層
- `Stable`（部屋）/ `Rank`（番付）/ `Puzzle`（取組）/ `Outcome`（結果）
- `Rank.forStreak(n)` で連勝数 → 番付の昇進ロジック
- 不変、Codable、テスト容易

## Phase 2 — コーパス
- 6 部屋 × 4 番 = 24 取組
- 各取組: 言語、コード行配列、バグ行 index、力士名、タイトル、説明
- 取組 ID 一意、`buggyLineIndex` が範囲内、を全件で確認

## Phase 3 — ゲーム状態
- `GameState`（@MainActor ObservableObject）
- フェーズ: idle / playing / revealing(outcome)
- 連勝・最高・総勝・総取組数を `UserDefaults` に永続化
- 60 秒タイマー、直近 6 番のリピート回避
- メソッド: startMatch / pickLine / nextMatch / cancelToIdle / reset

## Phase 4 — SwiftUI ビュー
- `BugZumouApp`（WindowGroup, 760×640 最小）
- `RankHeaderView` — 番付・連勝・最高・勝率の 4 ブロック
- `IdleHeroView` — 番付の称号と短い解説、6 部屋ストリップ
- `PuzzleHeaderView` / `CodePanelView` — 行番号付きの選択可能なコードパネル
- `TimerStripView` — 残り秒、低残量で色変化
- `RevealOverlayView` — 力士名・勝敗バッジ・解説・次の取組ボタン

## Phase 5 — テスト
- `CorpusTests` (6) / `RankTests` (5) / `GameStateTests` (8)
- `swift test` で全部緑

## Phase 6 — 仕上げ
- 全 UI テキストが日本語
- 朱色アクセント・パネル統一
- `swift build -c release` でリリースバイナリ生成可能
