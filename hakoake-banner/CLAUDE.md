# hakoake-banner — Conventions

## トーン (絶対)
- 「絶対」 「神」 「最強」 「ヤバい」 「失敗」 「ダメ人間」 「お疲れさま!」 は禁止 (煽り)
- 命令形は使わない (「箱を開けろ」 「片付けろ」 → NG)
- ユーザーを馬鹿にしない (「あなたは怠惰です」 のような断定は禁止)
- ただ「絶妙にバカっぽい事実」 を一行で告げる、 ユーザーは自分と引っ越しの非接続を「笑う側」 になる
- 数字は誇張 OK (「箱 -32 個」 「137 日目」 など)、 でも煽り口調にしない

## 配色 (content.css と popup.css)
- 紙: #faf6ee
- 紙2: #f3eddf
- 墨: #2a2520
- 鈍金: #b8945b (バナー下辺、 数字)
- 朝: #97a7a0 (補助、 dim)
- 段ボール: #c79b6c (バナー背景アクセント)

## データ
- 引っ越し開始日 (installedAt): localStorage["hakoake-banner:installedAt"] (epoch ms)
- 訪問回数 (visits): localStorage["hakoake-banner:visits"] (int)
- 直近のバナー履歴: localStorage["hakoake-banner:recent"] (array of strings, max 5)

## phase 定義
- fresh:     daysSinceMove ∈ [0, 6]
- settling:  [7, 29]
- stale:     [30, 89]
- ghost:     [90, +∞)

## BANNED_WORDS (lines.js + bannerText)
- 「絶対」 「必ず」 「神」 「最強」 「ヤバい」 「失敗」 「ダメ人間」 「お疲れさま」 「がんばれ」 「努力」 「天才」 「すごい」

## テスト
- Vitest、 unit only、 DOM 触らない (chrome API も触らない)
- pure logic (stats / lines) のみ src/、 content / popup は薄いラッパー
