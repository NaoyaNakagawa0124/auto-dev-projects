# PLAN — 足跡日記

## Phase 1: 純ロジック (10 min)
- `src/storage.js` — adapter pattern:
  - `memoryStorage()` — Map ベース、 テスト用
  - `chromeStorage()` — chrome.storage.local ラップ、 拡張機能 で 使う
  - 共通 API: `get(key) -> Promise<value>`, `set(key, value) -> Promise<void>`, `getAll() -> Promise<object>`
- `src/entry.js`:
  - `makeEntry({ url, title, note, at }) -> Entry` (バリデーション)
  - `Entry` 形: `{ id, url, title, note, dateIso (YYYY-MM-DD), at (ISO timestamp) }`
- `src/dates.js`:
  - `todayIso()` — local time の今日を YYYY-MM-DD で返す
  - `groupByMonth(entries) -> Map<YYYY-MM, Entry[]>`
  - `groupByDay(entries) -> Map<YYYY-MM-DD, Entry[]>`
  - `search(entries, query) -> Entry[]` (URL + title + note の部分一致、 大小無視)
- `src/diary.js` — 高レベル API:
  - `addEntry(storage, raw)` — entry を作って保存
  - `listEntries(storage) -> Entry[]` (新しい順)
  - `entriesForDay(storage, dateIso)`
  - `removeEntry(storage, id)`
- `src/exporter.js`:
  - `toJson(entries) -> string`
  - `toMarkdown(entries) -> string`

## Phase 2: vitest (5 min)
- `tests/storage.test.js`: memory adapter で round-trip
- `tests/entry.test.js`: makeEntry の必須 / 任意、 URL バリデーション、 note が空 OK
- `tests/dates.test.js`: todayIso 形式、 groupByMonth、 groupByDay、 search 動作
- `tests/diary.test.js`: addEntry → listEntries で取得、 removeEntry、 entriesForDay
- `tests/exporter.test.js`: toJson が parse 可能、 toMarkdown が h2/h3 セクションで整形、 BANNED_WORDS フリー
- `tests/manifest.test.js`: MV3、 storage 権限、 host_permissions なし (activeTab のみ)、 popup と options 宣言

## Phase 3: popup.html / popup.js / popup.css (7 min)
- 1 タップ ボタン: 「今 の ページ を 足跡 に 残す」 (大きい アクション ボタン)
- メモ 欄: optional、 placeholder 「ひとこと (任意)」
- 今日 の 足跡 リスト: 最新 5 件 を 表示、 各 entry は 時刻 + タイトル + url + メモ + 削除ボタン
- フッター: 「足跡 全部」 で options 画面 を 開く
- 配色: 紙白 + 朝色 dim、 メイン カラー 鈍金 #b8945b

## Phase 4: options.html / options.js / options.css (5 min)
- ヘッダー: タイトル + 検索ボックス
- 月別 タイムライン: 月ヘッダー で grouping、 各日付の下に entry リスト
- 各 entry: 時刻 + タイトル (URL リンク) + メモ + 削除ボタン
- フッター: 「JSON で エクスポート」 + 「Markdown で エクスポート」 ボタン (ブラウザの a.download で保存)

## Phase 5: icons + smoke + dashboard + commit (3 min)
- icons は PIL で 足跡 (足の裏) の 簡単な silhouette を 16/48/128 で
- manifest sanity check + npm test + dashboard 更新
