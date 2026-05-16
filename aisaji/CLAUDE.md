# aisaji — Conventions

## 哲学
- 「2 人が同じ画面を 90 秒だけ見つめる」 が体験の全て
- 1 人プレイモードは作らない (Intent 7: 「2 人で開けるか」 が魂)
- streak / 連勝 / トータルタップ数 は絶対に出さない
- 「決定」 を覆させる UI も作らない — 90 秒経ったら今夜はそれ

## 禁止語 (judge.js のねぎらい文 + result メッセージ)
- 「頑張」 「努力」 「達成」 「ナイス」 「すごい」 「天才」 「クリア」
- 「あなたが」 「君が」 を主語にしない、 短い完結文
- 数字 (「3 連勝!」 など) を出さない

## カラー
- 紙: #faf6ee
- 墨: #2a2520
- 灯: #d77a3a (アクセント、 タイマー針 / 決定リング)
- 朝: #97a7a0 (補助、 secondary text)
- パレット (料理タイル):
  - rice: #efe2c0
  - meat: #c9897a
  - fish: #a8b8c4
  - veg: #adc3a3
  - soup: #d6b88a
  - sweet: #d4a8b1
  - escape: #cdc3b6

## カードデータ形式
```js
{ id: "curry", name: "カレー", glyph: "カ", tone: "meat", kind: "dish" }
```
- glyph は最大 2 文字、 日本語 (漢字 / カタカナ / ひらがな)
- kind: "dish" (家庭料理) or "escape" (外食 / 出前 / 妥協)

## テスト
- Vitest、 unit only、 DOM 触らない
- すべての pure module は src/ にあり、 web/app.js だけが DOM を触る
- 禁止語テストを judge.js のねぎらい文配列に対して必ず実行
