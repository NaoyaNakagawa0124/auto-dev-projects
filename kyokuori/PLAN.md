# PLAN — 曲織

## Phase 1: 純ロジック (15 min)
- `src/kyokuori/tracks.py` — 30 曲の代表データ (2026-05 想定):
  - `{ id, title, artist, bpm, key (0-11), mode (0=minor, 1=major), energy 0-1, valence 0-1, danceability 0-1, chart_rank }`
  - 公開チャート (Billboard / Spotify Global) からの代表曲を 30 件
  - BANNED_WORDS audit (オリジナル+アーティスト名)
- `src/kyokuori/palette.py` — track → 16 色 HSL パレット (deterministic):
  - hue base = key * 30° + (mode == minor ? 15° : 0°)
  - saturation = 30% + valence * 60%
  - lightness = 30% + energy * 45%
  - 16 色は base hue を中心に ±60° で 16 等分 (variations)
  - HSL → RGB 変換
- `src/kyokuori/patterns.py` — 5 種類の pattern generator:
  - `cross_stitch(track) -> ndarray (16, 16, 3) RGB`
  - `knit(track) -> ndarray (16, 16, 3)`  (横方向に並ぶ knit/purl)
  - `quilt(track) -> ndarray (16, 16, 3)` (4x4 ブロック単位の三角分割)
  - `mosaic(track) -> ndarray (16, 16, 3)` (BPM seed で voronoi っぽい不規則)
  - `beading(track) -> ndarray (16, 16, 3)` (1 ピクセル = 1 ビーズ、 偶奇でシフト)
  - 全部 deterministic、 track の特徴 + seed で同じ画像
- `src/kyokuori/renderer.py` — matplotlib で render:
  - `plate(track) -> Figure` (5 パターンを横並びで描く)
  - `palette_strip(track) -> Figure` (16 色のパレットだけを横帯で)

## Phase 2: pytest (5 min)
- `tests/test_tracks.py` — 30 件、 id 重複なし、 BPM 範囲、 BANNED_WORDS フリー、 key/mode 範囲
- `tests/test_palette.py` — 同 track で同 palette、 違う track で違う、 色が 16 個、 RGB は 0-1 範囲
- `tests/test_patterns.py` — 各 pattern が (16, 16, 3) を返す、 deterministic、 値域 [0, 1]
- `tests/test_renderer.py` — plate が Figure を返す、 5 個のサブプロット (smoke test)

## Phase 3: notebook (5 min)
- `notebooks/kyokuori.ipynb` — 5-6 曲を選んで、 各曲の plate を notebook で描く
- 序盤に「コンセプト」 を Markdown で説明、 中盤で曲ごとに plate、 終わりに「自分の作品にどう使うか」 のヒント

## Phase 4: 品質チェック + commit (5 min)
- pytest を最後にもう 1 度
- nbformat で notebook を validate (実行はしない、 outputs は空でも OK)
- SUMMARY、 dashboard、 state、 root README、 commit、 push
