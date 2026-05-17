# PLAN — 世界の朝刊

## Phase 1: 純ロジック (10 min)
- `src/headlines.js` — 12 stories × { id, region (6 種), category (4 種), priority (1 = 主見出し, 2 = 中, 3 = 小), headline, subhead, body (1 段落) }
- 12 本 が 6 地域 × 4 カテゴリ で バランス、 主見出し は 1 本のみ
- 禁止語 (「絶対」 「必ず」 「ヤバい」 「衝撃」 「驚愕」 「神」) の audit
- `src/layout.js` — `layoutGrid(date)` で deterministic に 12 本 を 3 列 × 4 行 (相当) の grid に配置
  - 主見出し (priority 1) は column 1 (左) に span 2、 ほかは column 2 / 3 に縦並び
  - date を seed として priority 2 / 3 の並び替えだけ shuffled

## Phase 2: vitest (5 min)
- `tests/headlines.test.js`: 12 件、 id 重複なし、 region 6 種カバー、 category 4 種カバー、 主見出し ちょうど 1 本、 BANNED_WORDS フリー、 body 長さの上下限
- `tests/layout.test.js`: deterministic、 同日同レイアウト、 違う日 違うレイアウト、 12 本 全てが配置される、 主見出し位置

## Phase 3: Electron main + preload (5 min)
- `src/main.js` — BrowserWindow 880 × 720、 vibrancy: "under-window" (macOS)、 titleBarStyle: hiddenInset、 frame: true
- `src/preload.js` — contextBridge で 「today」 「prev」 「next」 「refresh」 IPC を expose
- contextIsolation: true、 nodeIntegration: false (セキュア)

## Phase 4: Renderer (10 min)
- `renderer/index.html` — 大きな日付 ヘッダー + 3 段組グリッド
- `renderer/style.css` — セリフ系 (Hiragino Mincho / serif fallback)、 紙色 #faf6ee、 列罫線、 ドロップキャップ
- `renderer/app.js` — IPC で headlines + layout を取得、 DOM に描画、 ←/→ で別日、 r で reload

## Phase 5: 品質 + smoke + commit (5 min)
- npm install (electron 200MB)
- `npx electron --version` で smoke
- `node -e "require('./src/main.js')"` ... これは BrowserWindow 起動するので NG
- main.js の純ロジック関数 (formatDate, pickHeadlinesForDate) だけ Vitest で test
- SUMMARY、 dashboard、 commit、 push
