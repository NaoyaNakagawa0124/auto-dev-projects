# 足跡日記 (ashiato-nikki) — Summary

## What was built
日記 が 続かない 人 の 9 割 が 投稿 する Quora / Yahoo 知恵袋 の 愚痴 (「毎日 書く 内容 が 思いつかない」 「streak が プレッシャー」 「過去 が 散逸 して 探せない」) を 3 つ とも 同時 に 解決 する Chrome 拡張機能 (MV3)。 ツールバー の 足跡 アイコン を 1 タップ する と、 今 開いて いる ページ の URL + タイトル + 任意 の 1 行 メモ が 「今日 の 足跡」 として 保存 される。 streak / 連勝 / 「N 日 連続!」 / 「書いて ない 日 です よ」 — 全部 なし、 ただ 残す だけ。 オプション 画面 で 月 別 タイムライン と 検索、 JSON / Markdown エクスポート が 可能。

## Discovery Roll
- **Source 29**: A problem you overheard someone complaining about (Quora / 知恵袋 風 愚痴 シミュレーション)
- **Persona 31**: 日記つけたいけど続かない人
- **Platform 5**: Browser extension (Chrome / Firefox MV3)
- **Intent 2**: 困ってる人を助ける — 翌日 も 開きたく なるか

Persona 31 と Source 29 の 接続 が 直球: 「日記 が 続かない」 という 愚痴 は 永遠 に 投稿 され 続けて いる 古典 的 痛み。 既存 ソリューション (Day One、 Bear、 紙 のノート、 etc) は すべて 「日記 を 書く」 を 前提 と する が、 本作 は 「書かない 日記」 という 解釈 で アプローチ。

Browser extension は cycle 23 (hakoake-banner) でも 使った が、 そちら は HN 限定 / 絶妙 に バカっぽい / Intent 3 (笑い) で、 本作 は 任意 URL / 実用 / Intent 2 — 全く 別 性格 の 拡張機能。

## Tech Stack
- Manifest V3 Chrome 拡張 (Firefox 互換)、 Vanilla JS、 ビルド不要
- 純ロジック (storage / dates / entry / diary / exporter) を src/ に分離、 chrome.storage を memoryStorage adapter で 差し替えて Vitest で 単体 検証
- Popup (capture + 今日 の 足跡 リスト) と Options (月別 タイムライン + 検索 + JSON/Markdown エクスポート) の 2 ページ
- 最小権限: `permissions: ["storage", "activeTab"]`、 host_permissions: 空、 background script: なし
- icons は Python PIL で 16/48/128 px の 足跡 (3 つの 趾 + 踵) silhouette を 生成
- Vitest で 51 ユニット テスト

## Features
- **1 タップ で 残す**: 現在 タブ の URL + タイトル を 自動 取得、 メモ は 空 で OK、 ⌘/Ctrl+Enter で 即 保存
- **今日 の 足跡 リスト** (popup): 最新 8 件、 各 entry に 時刻 + タイトル + メモ + 削除 ボタン
- **月別 タイムライン** (options): YYYY-MM ヘッダー で grouping、 日付 H3、 各 entry に 時刻 + リンク + URL + メモ + 削除
- **検索**: タイトル / URL / メモ の 部分 一致 (大小無視)
- **エクスポート**: JSON (parseable + version: 1) と Markdown (h1 / h2 月別 / h3 日別 / リンク 付き bullet)
- **「全部 を 消去」**: 確認 ダイアログ付き、 元 に 戻せない 旨 明記
- **検証 と バリデーション**: URL 必須 / 長さ上限 (URL 2048 / title 300 / note 200)、 不正 entry は listEntries で 静か に drop
- **配色**: 紙白 / 朝色 dim、 アクセント 鈍金 #b8945b、 主アクション ボタン に 影
- **BANNED_WORDS 監査** (「がんばれ」 「努力」 「連勝」 「達成」 「神」 「最強」 「失敗」 「ダメ」 「続けて ない」 「続かない 人」) を exporter の 出力 に 対して Vitest で audit
- **罪悪感 ゼロ 設計**: streak / 「今日 まだ です ね」 / 「N 日 連続」 / ピンク 色 の 警告 — 一切 なし

## Tests (51 passing)
- `tests/storage.test.js` (5) — memoryStorage の get / set / clone protection / remove / getAll
- `tests/dates.test.js` (10) — todayIso 形式 + zero pad、 monthIsoOf、 groupByDay (順序込み)、 groupByMonth、 search (空/title/url/note/多件)
- `tests/entry.test.js` (11) — makeEntry の URL 必須、 note 切り詰め、 URL 長さ 上限、 id 上書き、 at で dateIso、 id ユニーク、 isValidEntry の 各 ケース
- `tests/diary.test.js` (7) — addEntry → list (新着順)、 entriesForDay フィルタ、 removeEntry (成功/失敗)、 clearAll、 invalid entry の silent drop
- `tests/exporter.test.js` (12) — toJson の version + 全件、 toMarkdown の H2 / H3 / link / (無題) / empty / BANNED_WORDS フリー、 BANNED_WORDS の 内容
- `tests/manifest.test.js` (6) — MV3、 storage + activeTab のみ、 host_permissions なし、 popup + options 宣言、 名前/説明 日本語、 3 サイズ アイコン

## Files (13 source files + 6 test files + 3 icons, ~3216 LOC)
```
ashiato-nikki/
├── manifest.json            # MV3, min permissions
├── package.json             # vitest only
├── README.md / PLAN.md / CLAUDE.md / SUMMARY.md
├── .gitignore
├── icons/                   # 16/48/128 PNG (PIL 生成、 足跡 silhouette)
├── src/
│   ├── storage.js           # memoryStorage + chromeStorage adapters
│   ├── dates.js             # todayIso / groupByDay / groupByMonth / search
│   ├── entry.js             # makeEntry + isValidEntry + 長さ上限
│   ├── diary.js             # addEntry / listEntries / entriesForDay / removeEntry / clearAll
│   ├── exporter.js          # toJson + toMarkdown + BANNED_WORDS
│   ├── popup.html/.css/.js  # capture + today's footprints
│   └── options.html/.css/.js # full timeline + search + export
└── tests/                   # 6 files / 51 tests
```

## How to Run
```bash
cd ashiato-nikki
npm install
npm test                            # 51 tests, Chrome 不要

# Chrome / Edge / Brave で:
# 1. chrome://extensions を開く
# 2. デベロッパーモードを ON
# 3. 「パッケージ化されていない拡張機能を読み込む」 で ashiato-nikki/ を選択
# 4. ツールバー の 足跡 アイコン を タップ
```

## Challenges & Fixes
- **chrome.storage は test で 使えない**: storage adapter パターン を 採用、 メモリ 実装 で 単体 検証 と Chrome 実機 動作 の 両方 を カバー
- **MV3 popup で ES module を 使えない**: src/popup.js と src/options.js では `import` を 諦め、 src/ の 純ロジック を ファイル に インライン化。 line bank と 同じ pattern (cycle 23 で 確立)
- **clone protection in memoryStorage**: structuredClone を 使って set/get で reference を 切り離す、 「set 後 に 元 オブジェクト を 変えても store の 値 が 変わらない」 を 保証
- **「invalid entry の silent drop」 設計**: localStorage が 拡張機能 アップデート / 手動編集 / 古い バージョン から の 移行 で 壊れた 場合、 listEntries は isValidEntry で フィルタ する だけ で、 throw しない。 ユーザー の その 他 の 足跡 は 守られる
- **罪悪感 ゼロ の トーン 維持**: BANNED_WORDS を 自分 で 設定 + exporter の Markdown 出力 を Vitest で audit、 「Day N continuous!」 「あなた は 続けて いません」 など の 言葉 が 1 文字 も 入らない こと を 自動 担保

## Potential Next Steps
- **タグ 機能**: 各 entry に hashtag (#仕事 / #読書) を 自由 に 付ける、 タグ 別 タイムライン
- **Daily summary**: 1 日 終わり に 「今日 の 足跡 7 件、 一番 長く 滞在 した の は X」 の ような 集計 (オプトイン)
- **画像 / favicon の キャッシュ**: 各 entry に カードプレビュー を 付ける (Open Graph)
- **2 人 で 共有**: パートナー / 友達 と 同期 (Firebase / 自前 サーバー)、 「2 人 の 共通 足跡」 ビュー
- **音声 メモ**: Web Speech API で 1 行 を 喋って 保存 (車の運転後 などに 便利)
- **iOS Safari extension**: 同 ロジック を Safari Web Extension に 移植
- **Cron で 月次 PDF**: 毎月 初め に 前月 の Markdown を PDF 化 して メール
