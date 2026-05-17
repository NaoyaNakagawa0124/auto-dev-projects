# kyokuori — Conventions

## 哲学
- Intent 1 「美しさで殴る」 が魂。 「スクショ撮りたくなるか」 が判定軸
- 機能を増やすより、 16x16 の grid 1 枚に込められる情報量を上げる
- 曲のメタデータから craft pattern へのマッピングは「完全に deterministic」、 同じ曲は何度開いても同じパターン
- streak / 連勝 / 「お気に入り」 はつけない、 1 セッションが完結する読み物

## トーン
- 曲名 / アーティスト名は公開情報を素直に書く (敬意のため伏字 / 改変はしない)
- ノートブックの説明テキストは「クラフター視点」、 「これがあなたの次の作品の色になります」 程度の主体性
- BANNED_WORDS: 「絶対」 「必ず」 「神」 「最強」 「神曲」 「炎上」 「ヤバい」
- 「これしか聞かない」 「これだけが正解」 のような排他的な書き方をしない

## 配色 (notebook + figure)
- 紙: #faf6ee (背景)
- 墨: #2a2520 (タイトル)
- パレットは曲依存、 固定の枠色だけ統一

## データ
- track: `{ id, title, artist, bpm, key (0-11), mode, energy, valence, danceability, chart_rank }`
  - key: C=0, C#=1, ..., B=11 (Spotify と同じ)
  - mode: 0 = minor, 1 = major
  - energy / valence / danceability: 0.0-1.0
- palette: list of 16 (R, G, B) tuples, 各成分 0.0-1.0
- pattern: numpy ndarray shape (16, 16, 3), dtype float in [0, 1]

## テスト
- pytest、 純ロジックのみ
- matplotlib の Figure / pyplot は test しない (smoke のみ)
- notebook は nbformat で validate するが、 実行はしない (CI で重い)
