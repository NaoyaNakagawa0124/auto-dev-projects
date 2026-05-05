# PLAN — danboaru-za

## Phase 1 — 純粋ロジック (`core.js`)
- `hashLabel(s)` — FNV-1a-ish u32
- `mulberry32(seed)` — シード可能 PRNG
- `placeStar(label, size)` — 決定論的に星の位置・等級・色相
- `nearestNeighborEdges(stars, k=2)` — 星座の線
- `catalogueName(boxes)` — Latin 風カタログ名
- `BoxStore` — 追加・開封・削除・JSON 往復・統計

## Phase 2 — UI レイアウト (`index.html` + `styles.css`)
- 全画面 p5 キャンバス + 右上にガラスパネル
- パネル: 統計ブロック + 登録フォーム + 台帳リスト + 解説脚注
- 完全移住完了オーバーレイ（夜空に戻るボタン）
- モバイル: パネルを画面下にドロワー化

## Phase 3 — キャンバス (`app.js` + p5)
- 背景: 深紫グラデ + 2 つの星雲スポット
- 背景星 200 個、ゆっくりトゥインクル
- 各箱の星: ハロー + コア、色相は暖色系（寒色は 25% で混ぜる）
- 星座線: 2-最近傍のエッジを薄い暖色で描く

## Phase 4 — インタラクション
- 登録フォーム → BoxStore.add → localStorage 保存
- 「開封」 / キャンバス上の星をクリック → 超新星アニメ → BoxStore.open
- 「消す」 → BoxStore.remove
- 「すべて初期化」 → 確認後 reset
- 全部開いたら完全移住完了オーバーレイ

## Phase 5 — テスト
- `node --test test/core.test.mjs`
- 24 ケース: ハッシュ決定論、乱数範囲、星配置、最近傍辺、カタログ名、Store 全部

## Phase 6 — Phase 4.5 仕上げ
- UI が全部日本語であることを確認
- モバイル幅で破綻しない
- スクショ撮りたくなる夜空
