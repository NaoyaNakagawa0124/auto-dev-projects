# yozora-tango — Conventions

## トーン
- 「がんばれ」 「あと N 個!」 「連勝記録」 は禁止。 完成した星座を静かに「貯まる」 だけ
- セッション終了時のメッセージは labor だけ:「今夜は 3 つ 集まりました」 「夜が深くなりました」 など
- 数字は事実のみ (「3 つの星座」 OK、 「あと 2 つで全完成!」 はカウントダウン煽りで NG)

## 配色
- 紙: #faf6ee (背景の余白)
- 紺夜空: #1a2238 (canvas 背景)
- 星 (薄い): #4f5d75
- 星 (点灯): #ffd28a (灯火色)
- 線 (星座): #d4b87a (灯火薄)
- ガイド線: rgba(255,210,138,0.18)

## データ構造
```js
// cards.js
{ id: "abandon", en: "abandon", jp: "見捨てる", hint: "v." }

// constellations.js
{
  id: "orion", jp: "オリオン",
  // points are relative positions on a 0..1 unit square
  points: [ { x: 0.20, y: 0.10 }, ... ],   // length = 4..7
  // edges describe which point pairs to connect, by index
  edges: [ [0, 1], [1, 2], ... ]
}
```

## テスト
- Vitest、 unit only、 DOM 触らない (src/* のみ)
- 純ロジック (cards / constellations / game / rand) は web/sketch.js から完全独立

## 禁止語監査
- 「連勝」 「達成」 「完璧」 「神」 「最強」 を Vitest で全 UI 表示文に対して audit
