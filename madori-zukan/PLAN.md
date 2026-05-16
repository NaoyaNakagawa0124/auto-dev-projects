# 実装計画 — 間取り図鑑

## Phase 1 — シェル
- `index.html` (PWA shell)
- `manifest.json`, `service-worker.js`, `icons/`
- `style.css` (不動産チラシ + 建築図面のクロスオーバー)

## Phase 2 — データ
- `data/homes.json` に 8 件の物件を収録
- 各物件: id, title, show, year, address, style, total_sqm, floors, rooms[], characters[], scenes[]
- room: name, x, y, w, h, floor, type (entry/living/kitchen/bedroom/bath/wc/work/garden/corridor)

## Phase 3 — レンダラ
- SVG floor plan renderer
- 部屋を矩形で描画、ラベル、面積（畳換算）
- 玄関・窓・ドア表現
- 縮尺バー、方位記号 (N)
- 部屋タップでハイライト＋詳細表示

## Phase 4 — UI/状態
- 物件一覧（カードグリッド）
- 物件詳細（間取り＋情報パネル）
- 観了/お気に入りトグル → localStorage
- アーカイブ統計
- 絞り込み（年代・様式・観了済み）

## Phase 5 — PWA
- Service Worker 全資源キャッシュ
- manifest.json 192/512 アイコン
- start_url, display: standalone

## Phase 6 — テスト
- node:test で geometry/state ロジック
- データ整合性（部屋座標が collide しない、面積が正）

## Phase 7 — 仕上げ
- 縦長375px幅で崩れない確認
- 日本語チェック
- README / SUMMARY 整備
