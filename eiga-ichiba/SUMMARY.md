# 映画市場 (eiga-ichiba) — SUMMARY

## 何を作ったか

二人で同じキーボードを囲むタイプの、映画オタクのためのターン制投資ゲーム。12 ヶ月のシーズンを通じて、毎月 1 本の架空話題作が「上場」する。プレイヤーは 0/25/50/75/100 % のうち手元資金の何 % をその作品に投じるかを決め、月末に運命のリターンが公開される。

「誰かと一緒にやる」(Intent 7) を狙ったので、勝敗そのものより「あの監督なら大ヒットだ」「予算デカいから博打だな」と隣の人と話し合う体験が本体。

## 技術スタック

- **C99 + Raylib 5.5** (Homebrew installed)
- **Build**: pkg-config で raylib をリンク、最適化 `-O2`
- **Font**: macOS のシステムフォント (Hiragino → HelveticaNeue 順に試行) を LoadFontEx で日本語含む codepoint セットを動的に取得
- **Logic isolation**: ゲームロジック (`src/game.c`) は Raylib 完全不依存、別バイナリでテスト可能
- **RNG**: xorshift32、決定論的、シードは起動時の `time()`

## 技術的判断

| 課題 | 解決 |
|---|---|
| Raylib の DrawText は ASCII のみ | macOS のシステムフォントを `LoadFontEx` で読み込み、必要な codepoint セットを手動列挙して埋め込む |
| 12 本の架空映画の差別化 | ジャンル × 監督 × 予算 × 期待度 × seed_return を一意に設計、ピッチライン付き |
| リターンに揺らぎを持たせつつ予測可能性も残す | `multiplier = base × hype_factor × noise(0.78..1.22)` の 3 段階。期待度が高いほど振れ幅大 |
| 2人のパスアンドプレイで秘密を守る | PHASE_HANDOFF を間に挟み、「次のプレイヤーに渡してください」画面でリセット |
| ロジックを Raylib なしでテスト | `game.c` を別ターゲットでビルド、test_game.c から直接リンクして純粋関数として検証 |

## ファイル構成

```
eiga-ichiba/
├── Makefile             pkg-config + raylib リンク
├── README.md, PLAN.md, CLAUDE.md, SUMMARY.md
├── src/
│   ├── film.h, film.c   12 映画データ + ジャンル
│   ├── game.h, game.c   状態機械 + リターン計算 (Raylib 非依存)
│   ├── render.c         Raylib 描画層
│   └── main.c           エントリ + 入力ハンドラ
└── tests/
    └── test_game.c      ユニットテスト (Raylib 非依存)
```

## 動かし方

```bash
brew install raylib   # 前提
cd eiga-ichiba
make                  # ビルド
./eiga-ichiba         # 起動

make test             # ユニットテスト
```

## 数値

- **テスト**: 2566 / 2566 passing (`make test`)
  - 200 試行 × 12 映画 × 1 チェック = 2400 (multiplier bounds)
  - + 166 件のその他チェック (状態機械・割合スナップ・決済・勝敗判定・データ整合性)
- **コード**: C 約 950 行 (src/ + tests/)
- **バイナリ**: 51KB (arm64 release)
- **画面解像度**: 1280×720, 60FPS

## 次のステップ案

- 効果音 — `raylib audio` で投資決定時のチャイム、リターン公開時の歓声/嘆息
- 映画ライブラリの拡張、シーズンごとにシャッフル可能に
- 月例イベント — 「監督のスキャンダル」「コンペで受賞」などサプライズで倍率が変動
- 3 〜 4 人対戦モード
- リプレイ機能 — シーズン後に各プレイヤーの選択を時系列で振り返る
