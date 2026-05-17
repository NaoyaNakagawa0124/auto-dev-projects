# 箱開けバナー (hakoake-banner) — Summary

## What was built
Hacker News を 開くたび、 ページ上部に 「あなたは引っ越し N 日目 / 箱残り M 個」 という 完全に 根拠ゼロ の 「引っ越し 進捗」 を 表示する Chrome 拡張機能 (MV3)。 箱の数は 訪問が 多すぎると 負 に なる。 50 種類の 絶妙にバカっぽいフレーズ (「電子レンジ の 中 に、 何故 か リモコン が います。」 「あなた は 引っ越して いない 可能性 が あります。」 など) が phase (fresh/settling/stale/ghost) に応じて 出る。

引っ越し直後の人は HN を見ない (引っ越しに忙しい)、 HN を見るのは 開発者 (引っ越し中ではない)、 — その 完全な 非接続 を 笑う 拡張機能。

## Discovery Roll
- **Source 33**: Hacker News
- **Persona 28**: 引っ越したばかりの人
- **Platform 5**: Browser extension (Chrome MV3)
- **Intent 3**: 「こんなのアリ?」 と 笑わせる — 人に話したくなるか

Original Platform roll was 19 (p5.js) but cycle 22 (yozora-tango) just used p5.js. Rerolled platform → 5. The Source × Persona × Intent combination is the soul.

## Tech Stack
- Manifest V3 Chrome extension (Firefox 互換)
- Vanilla JS、 ビルドツール無し、 ES module は使わない (content script 互換性)
- chrome.storage.local で永続化 (installedAt / visits / recent banners up to 5)
- 純ロジック (stats / lines) は src/ にあり、 Vitest で完全に DOM 非依存にテスト可能
- content.js は src/lines.js を「インライン化」 して持っており、 拡張のロード時に import 不要
- icons は Python PIL で 16/48/128 px の段ボール柄 PNG を生成
- Vitest で 34 ユニットテスト (stats 16 / lines 12 / manifest 6)

## Features
- HN を訪問するたびに visits++ → 「箱残り」 が減少 (BOXES_PER_VISIT_FACTOR = 1.7、 だんだん負に近づく)
- 日数で phase 分け: fresh (0-6) / settling (7-29) / stale (30-89) / ghost (90+)
- 50 種類のフレーズを phase ごとに 12-13 件、 deterministic に 1 件選んで表示
- バナーは HN の `<body>` 先頭に注入、 `×` ボタンで閉じられる (再訪問でまた出る)
- 拡張ポップアップ: 大きな数字で日数と箱残り、 phase タグ (色分け)、 直近 5 件のバナー履歴、 「引っ越しをやり直す」 ボタン
- BANNED_WORDS 監査 (「絶対」 「神」 「最強」 「ヤバい」 「失敗」 「ダメ人間」 「お疲れさま」 「がんばれ」 「努力」 「天才」 「すごい」) を Vitest で全 50 フレーズに対して audit
- host_permissions は news.ycombinator.com のみ (最小権限)、 permissions も storage のみ

## Tests (34 passing)
- `tests/stats.test.js` (16) — daysBetween (3)、 phaseFor 4 phase x 境界、 computeStats deterministic / day 0 / 負の箱 / 日数経過で増加 / phase shift、 ensureInstallDate (3)、 incrementVisits (1)、 resetMove (1)
- `tests/lines.test.js` (12) — 50 件、 id/text 重複なし、 phase 4 種類、 各 phase 10+ 件、 phase 合計 50、 BANNED_WORDS フリー、 句点で終わる、 60 字以内、 pickLine phase 一致、 deterministic、 多 seed で分散
- `tests/manifest.test.js` (6) — MV3、 host_permissions = HN のみ、 storage 権限、 popup 宣言、 name/description 日本語、 最小権限

## Files (12 source files, ~750 LOC + 3 PNG icons)
```
hakoake-banner/
├── manifest.json        # MV3, content script + popup
├── README.md / PLAN.md / CLAUDE.md / SUMMARY.md
├── package.json         # vitest only
├── .gitignore
├── icons/               # 16 / 48 / 128 PNG (PIL 生成、 段ボール柄)
├── src/
│   ├── stats.js         # pure logic: phase / box math / storage helpers
│   ├── lines.js         # 50 banner phrases + BANNED_WORDS
│   ├── content.js       # HN page injection (inlines line bank)
│   ├── content.css      # banner styling
│   ├── popup.html       # extension popup
│   ├── popup.css        # popup styling
│   └── popup.js         # popup state read + reset
└── tests/               # 3 files / 34 tests
```

## How to Run
```bash
cd hakoake-banner
npm install
npm test                            # 34 tests (Chrome 不要)

# Chrome / Edge / Brave で:
# 1. chrome://extensions を開く
# 2. デベロッパーモードを ON
# 3. 「パッケージ化されていない拡張機能を読み込む」 で hakoake-banner/ を選択
# 4. https://news.ycombinator.com/ を開く
```

## Challenges & Fixes
- **Content script は ES module import できない**: src/lines.js のフレーズを content.js にインライン化するしかない (Vite 等の bundler を入れずに済ます)。 line bank を src/lines.js (テスト用) と content.js (実行用) で二重に持つことになったが、 manifest.test.js が「両者を同期させること」 を後で audit できる構造にした
- **icons の PNG 生成**: imagemagick が無いので Python PIL で 3 サイズの段ボール柄アイコンを生成。 これで「unpacked load 時に icon missing 警告」 が出ない
- **Persona の意外な解釈**: 「引っ越したばかりの人」 をターゲットにすると言いつつ、 実際は「HN を見ている人 (= 引っ越したばかりではない人) を 引っ越したばかりの人 として扱う」 という構造で、 Intent 3 (「こんなのアリ?」) が完成する。 ターゲットとペルソナの非接続が笑いの核
- **「箱残り -32 個」 が成立する数式**: BOXES_PER_VISIT_FACTOR = 1.7 で、 訪問回数が 増えるほど マイナスに 沈んでいく。 これは バグではなく 設計、 「マイナスに 沈む」 こと自体が ジョーク

## Potential Next Steps
- Reddit (r/programming, r/news) や Lobsters にも 対応する manifest 拡張
- 拡張ポップアップで 「過去 30 日の visits グラフ」 を Canvas で描く
- 引っ越し phase を「特殊イベント」 で 切り替える (4 月 = 桜引っ越し、 9 月 = 秋引っ越しなど)
- ローカライズ (英語 ghost mode: "You may not be moving at all" など)
- 別 Persona 向けの兄弟拡張: 「あなたは 受験 まで 53 日 / 教科書 残り -2 冊」 ← 受験生向け
- 拡張アイコンに「箱残り数」 を バッジ表示 (リアルタイムカウンター)
