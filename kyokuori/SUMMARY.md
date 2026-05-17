# 曲織 (kyokuori) — Summary

## What was built
30 曲の代表チャート曲 (2026-05 想定) を、 6 つの音楽特徴量 (BPM / key / mode / energy / valence / danceability) から 5 種類のクラフトパターン (Cross stitch / Knit / Quilt / Mosaic / Beading) に決定論的に変換する Jupyter ノートブック + Python ライブラリ。 DIY クラフター が「今週のチャート 1 位の曲を、 刺繍 / 編み物 / モザイクの図案として 持ち込めるか」 を 16×16 grid 1 枚に込めて見せる、 Intent 1 (美しさで殴る) 直球の試み。

実例: Espresso (Sabrina Carpenter, BPM 104 / D♯ major / energy 0.78 / valence 0.86) は黄緑＋朱色の 軽快な対角クロスステッチ。 Fortnight (Taylor Swift, BPM 94 / A minor / energy 0.42 / valence 0.31) は紺紫の落ち着いた knit ストライプ。 同じ曲は何度開いても同じパターン。

## Discovery Roll
- **Source 8**: Current music charts (Billboard / Spotify Global Top 50)
- **Persona 37**: DIY / 手作りクラフター
- **Platform 12**: Jupyter notebook / data visualization
- **Intent 1**: 美しさで殴る — スクショ撮りたくなるか

Intent 1 は cycle 102-109 で 0 回、 今回のリブートポイント。 「音楽 × 手芸」 という非接続のクロスは、 普通の data viz チュートリアルとは違う、 触覚を持ち帰れるアートピース。

## Tech Stack
- Python 3.10+ / NumPy 2.2 / matplotlib 3.10 / colorsys (標準ライブラリ)
- pure logic (tracks / palette / patterns / renderer) を src/kyokuori/ に分離
- HSL → RGB 変換は colorsys.hls_to_rgb で実装
- 全パターンは決定論的 (BPM・key・rank を seed 化した numpy.random.default_rng でも mosaic だけは shuffled anchor placement に使用)
- Jupyter notebook: 15 セル (Markdown + コード混在)、 nbformat で生成 + 検証、 nbconvert --execute で 142KB の end-to-end 実行確認
- pytest で 28 ユニットテスト

## Features
- 30 曲の代表チャートデータ (Sabrina Carpenter / Taylor Swift / Billie Eilish / Kendrick Lamar / Rosé & Bruno Mars / Charli xcx / Beyoncé / Olivia Rodrigo など)
- 16 色 HSL パレット生成: hue base = key×30° + (minor なら +15°)、 saturation 0.30+valence×0.60、 lightness 0.30+energy×0.45、 ±60° の spread + danceability 駆動の wobble
- 5 パターン:
  - **Cross stitch**: `(r + c + key) % 16` の対角ストライプ
  - **Knit**: 行ごと 1 色、 valence で shift、 偶数行は ×0.92 で knit/purl のニュアンス
  - **Quilt**: 4×4 ブロックを 2 色で三角分割 (`(dr + dc) < block` でカット)
  - **Mosaic**: 12 アンカーで擬似 Voronoi (numpy.default_rng seeded で deterministic)
  - **Beading**: 行が偶奇で 1 列ずれる hex 配置、 半数おきにオフセット
- 「plate」 = 5 パターン横並びの figure、 「palette_strip」 = 16 色帯
- 配色: 紙白 #faf6ee 背景、 タイトル墨色 #2a2520、 枠色 鈍金 #b8945b で統一感
- BANNED_WORDS 監査 (「絶対」 「必ず」 「神」 「最強」 「神曲」 「炎上」 「ヤバい」) を全 30 曲の artist + title に対して pytest で audit
- 3 つのデモ PNG (espresso, apt, fortnight) を `images/` に保存

## Tests (28 passing)
- `tests/test_tracks.py` (10) — 30 件、 id 重複なし、 chart_rank が 1-30 uniq、 BPM 範囲、 key/mode 範囲、 unit interval、 BANNED_WORDS フリー、 by_id、 top_n
- `tests/test_palette.py` (6) — サイズ 16、 deterministic、 違う track で違う、 RGB 0-1、 hsl_to_rgb 純赤、 全 track で 4 色以上の variety
- `tests/test_patterns.py` (9) — 5 patterns 各 shape/range、 全 track でも shape OK、 deterministic、 違う track で違う、 mosaic は 4 色以上
- `tests/test_renderer.py` (3) — plate が 5 サブプロット、 palette_strip 動作、 plate のタイトルに artist + title が含まれる

## Files (13 source files, ~830 LOC + 3 demo PNGs)
```
kyokuori/
├── pyproject.toml          # numpy + matplotlib + pytest + jupyter
├── README.md / PLAN.md / CLAUDE.md / SUMMARY.md
├── .gitignore
├── src/kyokuori/
│   ├── __init__.py
│   ├── tracks.py           # 30 曲 + BANNED_WORDS
│   ├── palette.py          # HSL 16 色生成
│   ├── patterns.py         # 5 種類のパターン (numpy)
│   └── renderer.py         # matplotlib plate / palette_strip
├── tests/                  # 4 files / 28 tests
├── notebooks/
│   └── kyokuori.ipynb      # 15 cells (Markdown + code)
└── images/                 # espresso.png / apt.png / fortnight.png (demo)
```

## How to Run
```bash
cd kyokuori
pip install -e ".[test,notebook]"
pytest                                  # 28 tests
jupyter notebook notebooks/kyokuori.ipynb
```

## Challenges & Fixes
- **HSL の hue が「24 半音 × 2 mode」 で 24 段階になり過ぎないか**: key (12 半音) × mode (2 通り) で 24 通り、 ただし mode minor を +15° だけずらすことで、 major と minor が完全に重ならず違うトーンに分離。 これで「Fortnight (A minor)」 が「Snooze (A♭ minor)」 と隣同士でも 別パレットになる
- **mosaic のランダム性が test を壊さないか**: numpy.random.default_rng を BPM + key + rank の hash で seed することで、 同じ track は同じ mosaic、 違う track は違う mosaic。 これで「deterministic」 と「変化に富む」 を両立
- **Jupyter notebook の自動実行**: CLAUDE.md の規約で「test では実行しない (CI で重い)」 と書いた手前、 一度だけ nbconvert --execute で end-to-end の動作確認をして、 生成された 142KB の executed notebook は .gitignore で除外。 確認は手動で行う方針を維持
- **アーティスト / 曲名 の取り扱い**: 公開チャート上位曲を 30 曲書き起こす中で、 オリジナルの artist 名 / title を素直に書く一方、 音楽特徴値はシミュレーションであることを README に明記 (Spotify API は叩いていない、 創作値)

## Potential Next Steps
- 実際の Spotify API を `.env.token` 経由で叩いて、 リアルタイムチャート + 実特徴量で生成
- 1 曲 1 plate を高解像度 PDF にエクスポート (図案として印刷)
- 32×32 や 24×24 の grid サイズ選択 (細かい刺繍向け)
- アーティスト 1 人 の 全曲 を 並べる「アルバム plate」
- BPM だけでなく song duration を「ストライプの段数」 に追加 mapping
- Plotly 化して hover で曲名 / 特徴量を表示するインタラクティブ版
- ユーザーが自分の Spotify プレイリストを CSV で投入できる入力 mode
