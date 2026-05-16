# PLAN — 世界話題帳

## Phase 1: globe.py (純ロジック、 5 min)
- 12 都市の経度を hard-code (Tokyo=139, NY=-74, etc)
- `Globe(rotation_deg)` 状態を持ち、 `visible_city()` で現在 spotlight に入る都市を返す
- `rotate(deg)` で度数を加算 (-180..+180 にラップ)
- braille (U+2800) を使った 8x4 アスキー globe レンダリング、 spotlight 都市は ● で表示
- `render_globe(width, height, spotlight_idx) -> str` で複数行の str を返す

## Phase 2: cities.py (静的データ、 5 min)
- 12 都市 × { name, jp, longitude, event, talking_point } を Python の dict のリストで持つ
- event は「今日 (2026-05-17) この都市で起きていそう or 文化的に意味のあること」 を 1 行
- talking_point は「就活面接で使える雑学引き出し」 1 行
- 禁止語: 「頑張」 「努力」 「がんばれ」 「絶対」 「成功」 「勝ち組」

## Phase 3: dossier.py (5 min)
- JSON atomic write (tempfile + rename) で `~/.sekai-wadaichou/dossier.json` に保存
- `add(city_id, note=None)` / `list_collected()` / `is_collected(city_id)`
- 同じ city_id は重複しない

## Phase 4: pytest (5 min)
- `tests/test_globe.py`: rotation のラッピング、 visibility、 braille サイズ
- `tests/test_cities.py`: 12 件、 重複なし、 禁止語フリー、 経度ソートで地球を一周
- `tests/test_dossier.py`: add/list、 atomic save、 同 city 重複しない

## Phase 5: Textual app.py (10 min)
- `WadaichouApp(App)`、 2 screen: GlobeScreen と DossierScreen
- GlobeScreen: 左 1/2 に braille globe、 右 1/2 に現在都市カード (event + talking_point)
- 矢印キーで rotate、 Enter で collect、 Tab で screen 切替
- DossierScreen: 綴じた都市カードのリスト
- **`_render` メソッドは絶対定義しない**、 redraw helper は `_refresh_view` を使う
