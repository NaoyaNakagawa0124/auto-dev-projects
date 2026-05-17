# 曲織 (kyokuori)

> 今週の音楽チャートを、 刺繍 / 編み物 / モザイク のパターンに織り直す Jupyter ノートブック。

「Espresso (Sabrina Carpenter)」 や「Fortnight (Taylor Swift)」 や「APT. (Rosé & Bruno Mars)」 を、 BPM / key / energy / valence / danceability / mode の 6 つの特徴量から、 5 種類の craft pattern (Cross stitch / Knit / Quilt / Mosaic / Beading) に変換する。

DIY クラフターが「今週のチャート 1 位の曲が、 刺繍だったらこんなパターン」 を見て、 そのまま自分の作品にインスピレーションを持ち込めるのが目的。 streak も得点も無し。 美しさで殴ること が この notebook の魂。

## できること

- 30 曲分の代表データ (アーティスト + 6 つの音楽特徴量、 2026 年 5 月時点の チャート上位 を 想定)
- 各曲を deterministic に **HSL 16 色** のパレットに変換 (key から hue、 valence から saturation、 energy から lightness)
- 5 種類の craft pattern として 16×16 grid をレンダリング:
  - **Cross stitch** (×) — 1 ピクセル = 1 つの ×
  - **Knit** (knit/purl) — 1 ピクセル = 1 つの編み目記号
  - **Quilt** (triangles) — 4 ピクセル単位で 1 つの quilt ブロック
  - **Mosaic** (squares) — 不規則な四角形のタイル
  - **Beading** (rounds) — 1 ピクセル = 1 つのビーズ
- matplotlib で 1 曲につき 5 パターンを並べる「曲の plate」 を notebook 内に描画
- BANNED_WORDS 監査 (アーティスト名 / 曲名に 不適切表現が無いか)

## 走らせる

```bash
cd kyokuori
pip install -e ".[test,notebook]"
pytest                           # 純ロジックの ユニット テスト
jupyter notebook notebooks/kyokuori.ipynb
```

## ライセンス

データセットは 公開チャート情報の シミュレーション 値 (実 API は 叩かない、 教育 / 美術 目的)。 アーティスト名 / 曲名 は 出典 として 参照、 楽曲 や その 特徴値 は 創作 です。
