# inu-saiten — Conventions

## トーン (絶対)
- これ は **コメディ 拡張** で あって 栄養 指導 で は ない。 README と 表示 オーバーレイ に 「飼育 助言 で は あり ません」 と 明記
- 危険 材料 表示 は 事実 ベース (玉ねぎ / ニンニク / チョコ 等 は 犬 に 有毒) だが、 文体 は あくまで 「犬 視点 の リアクション」 で 笑い に する
- 「致命 的」 「死亡」 「殺す」 等 の 過剰 な 言葉 は NG、 「部屋 の 隅 に 退避」 「私 が 警報 を 鳴らし ます」 等 の 行動 描写 で
- BANNED_WORDS: 「殺す」 「死ぬ」 「致命」 「劇毒」 「クソ」 「無能」 「飼い主 失格」 「お前」

## 犬 キャラ
1. **お利口 ポチ** (ボーダー コリー、 5 歳、 几帳面) — 評点 は 厳しめ、 文体 は 端正
2. **シニア マロ** (柴犬、 12 歳、 達観) — 「もう 何 でも いい です ね」 系、 評点 は 中庸
3. **ヤンチャ タロウ** (トイ プードル、 1 歳、 全肯定) — 何 で も 90 点 超、 全力 で 喜ぶ
4. **哲学者 ジョン** (ラブラドール、 8 歳、 内省 的) — 「肉 と は 何 か」 系 の メタ コメント

## レシピ サイト の 検出 戦略
- domain で primary 判定: cookpad.com / kurashiru.com / delishkitchen.tv / nyt cooking / allrecipes.com
- 各 サイト の 材料 リスト の CSS selector を ハード コード (sites.js に マップ)
- マッチ し ない とき は generic `<ul>` 内 の 「g/ml/個/枚/匙」 を 含む `<li>` を 候補 に
- 検出 さ れ ない とき は 拡張 は 何 も しない (popup から 手動 起動 も できる)

## 採点 アルゴリズム
- 各 材料 に スコア (0-100) と カテゴリ (`love` / `meh` / `danger`) を 持つ 辞書
- danger が 1 つ でも あれば 上限 80、 2 つ で 上限 60、 3 つ 以上 で 上限 50
- love の 平均 が 80+ で +5 ボーナス、 90+ で +10
- meh のみ の レシピ は 40-60 で 中央 値
- 最終 スコア は 0-100、 5 段階 で 星 表示 (20 ずつ)

## レビュー 文 生成
- テンプレート 駆動、 キャラ × 採点 帯 × 検出 材料 で 文 を 組み合わせ
- 「肉 を 褒める」 「危険 材料 を 嘆く」 「meh で 達観 する」 の 3 ピース を 連結
- 同 レシピ + 同 キャラ で は deterministic (URL を seed)

## chrome.storage 構造
```js
{
  "inu-saiten:settings": { dog: "pochi", enabled: true },
  "inu-saiten:history": [{ url, title, score, dog, timestamp }]
}
```

## オーバーレイ デザイン
- Glassmorphism (半 透明 + backdrop-filter blur)
- 右上 に X (閉じる) ボタン、 ページ あたり 1 回 まで 閉じ た こと を 記憶 (URL ベース)
- ページ の z-index 高 (99999)、 fixed position 上部 中央
- モバイル サイズ (375px) で も 崩れ ない

## テスト
- Vitest only、 純ロジック (scorer / review / detector / character) を 重点 的 に
- DOM テスト は jsdom を 持ち込ま ない、 純 関数 で 全部 検証
- BANNED_WORDS audit は test に 含める
