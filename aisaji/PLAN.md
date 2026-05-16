# Plan — 相匙 (aisaji)

## Phase 1: Card data + pickHand (5 min)
- `src/cards.js` — 40 件の家庭料理カード + 4 件のエスケープカード
- 各カードに `{ id, name, glyph (1-2 字), tone (色キー), kind: "dish" | "escape" }`
- `src/rand.js` — xorshift32 シードランダム
- `src/pickHand.js` — seed と n を受け取り、 deterministic に n 枚のカードを返す
- エスケープカードは必ず最低 1 枚混じるようにする

## Phase 2: 判定 (3 min)
- `src/judge.js` — `judge({ candidates, leftOks, rightOks, rng })` を実装
  - 両方 ok のカード = 候補
  - 候補が 0 枚 → kind: "noone"
  - 候補が 1 枚 → kind: "decided", card: that
  - 候補が 2+ 枚 → kind: "decided", card: rng で 1 枚
- ねぎらい言葉のテーブル (静かなトーン、 streak 風 NG)

## Phase 3: タイマー (3 min)
- `src/timer.js` — `createTimer({ durationMs, tickMs, onTick, onEnd })`
- pure: setInterval を使わず callback フレンドリーに (テスト可能性)
- フェイクタイマーで step() で進められるパターン

## Phase 4: テスト (5 min)
- `tests/cards.test.js` — 重複なし、 escape 4 件、 各 tone がパレットに含まれる
- `tests/rand.test.js` — 同じ seed で同じ列、 違う seed で違う列
- `tests/pickHand.test.js` — n 枚、 deterministic、 重複なし、 escape を 1 枚以上含む
- `tests/judge.test.js` — 0/1/N 候補のケース、 ねぎらい文に禁止語が含まれない
- `tests/timer.test.js` — tick 回数、 終了 callback、 早期停止

## Phase 5: フロントエンド (10 min)
- `web/index.html` — 単一画面、 タイトル / カード / 左右タップゾーン / 結果
- `web/style.css` — 紙白 + 灯火色のパレット、 大きなカードタイル、 左右半分の touch zone
- `web/app.js` — ES module、 src/ を直接 import、 timer 駆動、 ローカルストレージ履歴

## Phase 6: 品質チェック (3 min)
- 全 UI 日本語確認
- モバイル幅 (375px) で崩れない
- タップフィードバック (色変化 + 軽い振動)
- 初回起動時の説明が明確
