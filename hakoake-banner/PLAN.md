# PLAN — 箱開けバナー

## Phase 1: stats.js (純ロジック、 5 min)
- `computeStats({ installedAt, visits, now })` で:
  - daysSinceMove = (now - installedAt) / 86400000 を整数で
  - boxesOpened = visits
  - boxesRemaining = (INITIAL_BOXES + daysSinceMove) - visits * BOXES_PER_VISIT_FACTOR
    - INITIAL_BOXES = 35
    - BOXES_PER_VISIT_FACTOR = 1.7 (訪問が増えると負になりやすい)
  - phase: daysSinceMove < 7 ? "fresh" : daysSinceMove < 30 ? "settling" : daysSinceMove < 90 ? "stale" : "ghost"
  - 結果: `{ daysSinceMove, boxesRemaining, phase, asOf: now }`
- 完全 deterministic、 random なし

## Phase 2: lines.js (50 件のフレーズ、 5 min)
- 各 line は phase によってフィルタされる:
  - fresh (0-6 日): 「箱 を 開けて いない の は あなた だけ では ない」 系
  - settling (7-29 日): 「ダンボール、 もう そろそろ 」 系
  - stale (30-89 日): 「冷凍餃子 が 在庫切れ です」 「箱 が 家具 に なって しまった」
  - ghost (90+ 日): 「あなた は 引っ越して いない 可能性 が あります」 「箱 は 別 の 次元 に あります」
- 50 件、 phase ごとに 12-13 件
- pickLine(seed, phase) で deterministic
- BANNED_WORDS audit: 「絶対」 「神」 「最強」 「ヤバい」 「失敗」 「ダメ人間」 など

## Phase 3: content.js + content.css (5 min)
- HN の `<body>` 先頭に `<div id="hakoake-banner">` を注入
- background: 紙色、 border-bottom: 鈍金、 padding 10px
- 中央 1 行: 「📦 あなたは引っ越し N 日目 / 箱 残り: M 個」 + 1 行: pickLine の絶妙にバカっぽいフレーズ
- 訪問のたびに visits++ して保存

## Phase 4: popup.html / popup.js (5 min)
- 拡張アイコンを押すと、 現在の引っ越し統計を見られる小さなポップアップ
- リセットボタン (「引っ越し やり直す」)
- 過去 5 件のバナー履歴 (localStorage)

## Phase 5: vitest (5 min)
- `tests/stats.test.js`: deterministic、 phase 境界、 負の box、 install_at 取り扱い
- `tests/lines.test.js`: 50 件、 phase ごとの数、 BANNED_WORDS フリー、 pickLine deterministic + phase に合う

## Phase 6: smoke + dashboard + commit (5 min)
- manifest.json の sanity check
- README に load-unpacked の手順
- dashboard + state + root README update
