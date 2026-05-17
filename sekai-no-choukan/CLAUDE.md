# sekai-no-choukan — Conventions

## 哲学
- Intent 1 「美しさで殴る」 が魂。 スクショ撮りたくなるか
- 機能を増やさない、 1 画面の 1 枚の朝刊として完結
- 通知、 タブ、 履歴、 SNS シェア、 検索、 ブックマーク、 ぜんぶ無し
- 5 分で読み終わって閉じる、 朝の儀式としての潔さ

## トーン
- 禁止語: 「絶対」 「必ず」 「ヤバい」 「衝撃」 「驚愕」 「神」 「最強」 「炎上」
- 一文 60 字以内が基本、 長文 (body) でも 1 段落 = 4-6 文程度
- 「最新」 「速報」 を名乗らない、 「2026 年 5 月 中旬 を 想定」 を README に明記

## 配色 (renderer)
- 紙: #faf6ee
- 墨: #1c1814 (見出し用、 漆黒に近い)
- 墨2: #3a3127 (本文)
- 朝: #8c857a (補助、 dim)
- 罫線: rgba(28, 24, 20, 0.18)
- 主見出し帯: #b8945b (鈍金、 アクセント)

## タイポグラフィ
- 見出し: ヒラギノ明朝、 -apple-system Serif、 Georgia、 serif fallback
- 本文: ヒラギノ明朝、 Noto Serif JP、 serif fallback
- 主見出し ドロップキャップ: 4em、 font-weight 700、 letter-spacing -0.02em

## データ形式
```js
{
  id: "us-fed-rate",
  region: "north-america" | "europe" | "east-asia" | "southeast-asia" | "south-america" | "africa",
  category: "politics" | "economics" | "culture" | "science",
  priority: 1 | 2 | 3,
  headline: "短い 見出し",
  subhead: "1 行 の 補足",
  body: "1 段落 の 本文。 4-6 文。"
}
```

## Electron 設定
- contextIsolation: true (絶対)
- nodeIntegration: false (絶対)
- preload.js で contextBridge.exposeInMainWorld
- BrowserWindow vibrancy: "under-window" (macOS 専用、 他 OS は plain background)
- titleBarStyle: "hiddenInset" (macOS) — 信号機 ボタンだけ残す
- 起動時 fullscreen にしない (デスクトップに溶け込む)

## テスト
- Vitest、 unit only
- pure logic (headlines / layout) のみ src/
- main.js は Electron API に依存するので 不可分な test は書かない、 helper functions のみ test
