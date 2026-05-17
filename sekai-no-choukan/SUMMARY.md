# 世界の朝刊 (sekai-no-choukan) — Summary

## What was built
就活生 が 朝、 コーヒー を 淹れた 5 分 だけ 開く、 美しい デスクトップ 朝刊。 Electron で 880×720 の native ウィンドウ を 起動、 12 本 の 世界 ニュース (北米 / 欧州 / 東アジア / 東南アジア / 南米 / アフリカ × 政治 / 経済 / 文化 / 科学 で バランス) を 3 段組 で 配置 する。 主見出し は 左 列 に 大きく ドロップキャップ つき、 他 11 本 は 中 列 と 右 列 に round-robin で 配分。 同じ日 開けば 同じ レイアウト、 ←/→ で 前後 7 日 を 行き来 できる。 SNS シェア・通知・履歴・検索・ブックマーク — 全部 無し。 5 分 で 閉じる 朝 の 儀式 として 完結 する。

## Discovery Roll
- **Source 1**: Today's top world news headlines (CNN / BBC / NHK / Reuters)
- **Persona 23**: 就活中の大学生
- **Platform 9**: Electron desktop app
- **Intent 1**: 美しさで殴る — スクショ撮りたくなるか

Persona 23 は cycle 19 (sekai-wadaichou) で TUI 版「世界話題帳」 をやったが、 こちら は 「Electron で デスクトップ に 朝 だけ 開く 紙 1 枚」 という 全く 違う 形 と トーン。 Intent 1 は cycle 24 (kyokuori) に 続く 2 回目 — 「美しさ で 殴る」 が 連続 する が、 一方 は 編み物 パターン、 もう 一方 は 朝刊 タイポ という 全く 別 ドメイン。

## Tech Stack
- Electron 31.7 (CommonJS、 contextIsolation + sandbox + nodeIntegration false で セキュア)
- BrowserWindow に `vibrancy: "under-window"` + `titleBarStyle: "hiddenInset"` で macOS の 半透明 + 信号機 のみ
- preload.js で contextBridge.exposeInMainWorld、 renderer は window.choukan だけ 経由
- IPC: `paper:today` / `paper:forDate` を main で handle、 renderer から invoke
- 純ロジック (headlines / layout) は src/ に 分離、 Electron 非依存 で Vitest で 直接 test 可能
- main.js の payloadForDate は vi.mock("electron") で stub すれば test できる
- CSP: `default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'`
- xorshift32 + golden-ratio warmup (連続 cycle で 使い回している 既知 パターン)

## Features
- 12 本 の 世界 ニュース、 6 地域 × 4 カテゴリ で バランス
  - 主見出し: 米 FRB 5 月 据え置き (政治・経済 の 国際 関心)
  - 中: EU AI 法 改定、 日本 春闘 後 の 最賃 議論、 ナイジェリア 映像 産業 拡充、 ブラジル アマゾン 監視、 カンヌ 中盤 など
  - 小: シンガポール 港、 韓国 半導体、 インドネシア 新首都、 ケニア モバイル 送金 19 年、 リオ 美術館 拡張、 カナダ デブリ 観測 連携
- セリフ系 タイポ (ヒラギノ明朝 / Noto Serif JP / Georgia)、 紙色 #faf6ee、 列 罫線
- 主見出し に ドロップキャップ (`::first-letter` 2.8em、 ink #1c1814)
- 5 つの 操作 だけ: 前日 / 翌日 / 今日 / クリック / 閉じる (キーボード ←/→/t も)
- BANNED_WORDS 監査 (「絶対」 「必ず」 「ヤバい」 「衝撃」 「驚愕」 「神」 「最強」 「炎上」) を headline + subhead + body 全件 に対して Vitest で audit
- レスポンシブ: 720px 以下 で 3 段 → 1 段 に 切り替え
- 「公開 情報 ベース + 創作」 の disclaimer を README + アプリ byline に 明記

## Tests (28 passing)
- `tests/headlines.test.js` (13) — 12 件、 id / headline 重複なし、 lead が 1 件、 全 region カバー、 全 category カバー、 priority 1-3、 region/category 辞書、 body 60-400 字、 headline / subhead 10-80 字、 BANNED_WORDS フリー、 byId
- `tests/layout.test.js` (13) — lead + 2 columns、 lead は priority 1、 12 件 全配置、 deterministic、 違う日 違う レイアウト、 round-robin で ±1 件 以内、 formatHeaderDate (2 件)、 shiftDate +/-、 dateSeed、 makeRng deterministic、 shuffleInPlace 要素保存
- `tests/main.test.js` (2) — vi.mock("electron") で Electron stub、 payloadForDate の shape、 deterministic

## Files (12 source files, ~1041 LOC)
```
sekai-no-choukan/
├── package.json            # electron 31 + vitest
├── README.md / PLAN.md / CLAUDE.md / SUMMARY.md
├── .gitignore              # node_modules / package-lock 等
├── src/
│   ├── headlines.js        # 12 stories + BANNED_WORDS
│   ├── layout.js           # date-seeded round-robin layout
│   ├── main.js             # Electron main process + payloadForDate
│   └── preload.js          # contextBridge IPC bridge
├── renderer/
│   ├── index.html          # masthead + 3 段組 grid + footer
│   ├── style.css           # 紙色 + 明朝 + drop cap + column rules
│   └── app.js              # IPC fetch + DOM 描画 + キーボード
└── tests/                  # 3 files / 28 tests
```

## How to Run
```bash
cd sekai-no-choukan
npm install                          # electron ~200MB + vitest
npm test                             # 28 tests, Electron 不要
npm start                            # electron .
```

開いた 瞬間、 880 × 720 の 紙色 ウィンドウ に 朝刊 が 描かれる。 macOS では 信号機 ボタン のみ、 ウィンドウ 背景 が 下 を 通って 半透明 に なる。

## Challenges & Fixes
- **`vi.mock('electron')` で main.js を テスト**: src/main.js は require("electron") を トップ で 呼ぶ ので、 Vitest で 普通 に import すると Electron native binding を ロード しようとして 失敗。 `vi.mock` で stub し、 動的 import で 後で 取得 する パターン (`const { payloadForDate } = await import("../src/main.js")`)
- **`require.main === module` で 実行コンテキスト 分岐**: Electron が main.js を 直接 起動 した 時 だけ BrowserWindow / IPC を 立ち上げる、 test 時 は payloadForDate だけ export — モジュール の 単体 検証 を 維持
- **CSP の `script-src 'self'`**: 厳しめ の CSP を かけて おく ことで、 inline / eval / 外部 CDN が 完全 に 禁止。 これで renderer から の 任意 コード 実行 を 最初 から 塞ぐ
- **macOS 専用 の vibrancy を 他 OS で 無害化**: Electron は `vibrancy` を サポート しない OS では 自動 無視。 backgroundColor を fallback として 紙色 で 指定、 視覚的 デグレードを 避けた

## Potential Next Steps
- 「今日 の 単語」 — 12 本 から 拾う 重要 ボキャブラリー 3 つ (面接 で 使える 言い回し) を 別 セクション で
- 12 本 を 30 本 に 拡張 し、 月 ごと の 朝刊 アーカイブ
- 「読了 マーク」 を localStorage に 静か に 残す (streak で は ない、 単純 な 読了 記録)
- 印刷 用 CSS (B4 で 出して 朝食 と 一緒 に 読める)
- 別 言語 版 (英語 / 中国語) の 朝刊 を タブ なし で 切り替える
- 主見出し を AI 編集 が 翌日 を 予測 する 創作 ニュース モード
- 「朝刊 を 印刷 する」 PDF エクスポート (face-up 印刷 で 折り紙 風 に 読める)
