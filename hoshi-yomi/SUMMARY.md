# 星詠み (hoshi-yomi) — SUMMARY

## 何を作ったか

夜空をスケッチブックにする語学ゲームを Godot 4 で書きました。

12 の単語にそれぞれ星座を割り当て、プレイヤーは星を順番にタップして繋ぎます。正しい順で繋ぎ終えると、その単語が日本語＋ターゲット言語＋発音記号＋短い詩で夜空に立ち上がります。覚えた星座は「夜空辞書」として永久に星に灯り続けます。

「美しさで殴る」を狙ったので：
- 数百個の小さな星が緩やかにドリフトする背景
- 稀に流れ星が画面を横切る
- 星のグローを `gdshader` で描画
- 連結する線は金色を 3 段階で重ねて、夜空に金箔を貼るような表現

## 技術的判断

| 課題 | 解決 |
|---|---|
| Godot CLI が手元になく実行確認できない | Python の validator スクリプトで構造・JSON・ファイル参照を 238 項目チェック。Godot 4 シーン形式に従って手書きの .tscn と .gd を準備 |
| `Progress.load()` が Godot 組み込みの `load()` と衝突 | 静的メソッド名を `read_state` / `write_state` にリネーム |
| `theme_override_constants/separation` の表記揺れ | Godot 4 の正式表記に統一 |
| 星座の正しい順序をプレイヤーに伝える | タップ済みは金で点り、次に押すべき星には青いリングと番号が表示される。間違った星をタップしても罰せず、優しい微振動だけ |
| 1280×720 の固定座標 → 解像度可変 | データは 0..1 の正規化座標で持ち、`get_viewport_rect().size` × 余白で描画位置を計算 |

## ファイル構成

```
hoshi-yomi/
├── project.godot                Godot 4 プロジェクト設定
├── icon.svg                     アプリアイコン
├── scenes/
│   ├── Main.tscn               タイトル・辞書・トレース・解放のシーン
│   └── ConstellationView.tscn  星座1個を描画するシーン
├── scripts/
│   ├── main.gd                 全体制御
│   ├── starfield.gd            背景星空 (ドリフト＋流れ星)
│   ├── constellation_view.gd   星座のトレース受付＋描画
│   ├── data.gd                 星座データの静的ロード
│   └── progress.gd             進捗 (discovered: [...]) の保存/復元
├── shaders/star_glow.gdshader   星のグロー＋twinkle
├── data/constellations.json    12 星座 / 60 星
└── tests/validate.py           Python による構造チェッカー (238 件)
```

## 動かし方

```bash
# Godot 4.2+ を入手 (https://godotengine.org/)
# エディタで `hoshi-yomi/project.godot` を Import → 再生
# あるいは CLI:
godot --path hoshi-yomi

# 検証 (Godot 不要):
python3 tests/validate.py
```

## 数値

- **検証チェック**: 238 / 238 passed
- **星座**: 12 個 / 60 星
- **GDScript**: 約 380 行 (5 ファイル)
- **シーン**: 2 (.tscn)
- **シェーダ**: 1 (.gdshader)

## 次のステップ案

- 音 — `AudioStreamGenerator` で星を繋いだ瞬間にチャイム、背景に静かなドローン
- 言語切替 — JSON データを多言語化、起動時に「英語/中国語/韓国語/フランス語」を選ぶ
- 「夜の章」 — 12 個を解き明かしたら次の章 (もう12個) が解放される
- スクリーンショット書き出し — 完成した夜空を 16:9 で PNG にエクスポート
- マウス軌跡 — プレイヤーがドラッグした軌跡を流れ星のように残す
