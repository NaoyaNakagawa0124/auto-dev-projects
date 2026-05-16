# 両替勘 (ryogae-kan) — SUMMARY

## 何を作ったか

**両替勘** は、海外旅行中の値段感覚を 5 秒で鍛える Rust+WASM Webゲームです。

異国の通貨で価格 (€38, ₹4,500, ₩12,000, ฿420, Rp 78,000…) が次々に提示され、プレイヤーは円換算でのコスト感を勘で「**安い / 妥当 / 高い**」と判定する。電卓は使わず、感覚で。連続正解でストリークが伸び、難しい通貨 (TRY, BRL, MXN…) が解放される。間違えたら即ゲームオーバー。

「夢中にさせる」(Intent 5) を狙ったので、判定窓が 5 秒 → 3 秒へ段階的に縮み、スコアは判定速度のボーナスを含む。次のラウンドが瞬時に始まる「もう 1 ラウンド」のループ。

## 技術スタック

- **Core**: Rust 1.94 + wasm-bindgen 0.2.121 (cdylib)
- **Frontend**: Vanilla HTML/CSS/JS + ES Modules
- **Bundle**: 38KB wasm + 7.6KB JS glue (release ビルド)
- **永続化**: localStorage (high_score, high_streak)
- **テスト**: cargo test (23 件)

## 技術的判断

| 課題 | 解決 |
|---|---|
| 厳密な為替 vs 練習目的 | 為替レートはハードコード (2026年5月時点の概算)。アプリの目的は勘の訓練で、リアルタイム精度より体験を優先 |
| 通貨の難度をどう伝えるか | 各通貨に difficulty (1〜4) を付与、ストリーク 0/5/10/15+ で順次解放 |
| ラウンド生成の偏りを抑える | 33% cheap / 34% fair / 33% expensive のバケットを先に選び、その範囲内で価格を生成 |
| 表示価格の桁を通貨ごとに調整 | display_step (USD=1, KRW=100, VND=1000, IDR=500…) で四捨五入 |
| スコアにテンポ感を出す | base 100 + speed_bonus 10〜100 (残り時間に比例)。同じ正解でも素早いほうが点が高い |
| RNG を決定論的に | xorshift64 を Rust 側に実装。シードは `Date.now() ^ Math.random()` で起動毎に変える |

## ファイル構成

```
ryogae-kan/
├── Cargo.toml, Makefile
├── README.md, PLAN.md, CLAUDE.md, SUMMARY.md
├── src/
│   ├── lib.rs          Engine (wasm_bindgen)
│   ├── currencies.rs   15 通貨 + 難度
│   ├── items.rs        10 品目 + 参考JPY
│   ├── judge.rs        Verdict (cheap/fair/expensive)
│   ├── rng.rs          xorshift64 (決定論的)
│   ├── round.rs        ラウンド生成 (バケット式)
│   └── game.rs         Game state + scoring
└── www/
    ├── index.html      タイトル / ゲーム / リザルト
    ├── style.css       パスポートスタンプ意匠
    ├── app.js          WASM glue + RAF loop
    └── pkg/            wasm-pack 出力
```

## 動かし方

```bash
# 初回
wasm-pack build --target web --out-dir www/pkg --release
cd www && python3 -m http.server 8000
# http://localhost:8000 をブラウザで開く

# あるいは
make dev

# テスト
cargo test
```

## 数値

- **Rust テスト**: 23 / 23 passing
- **通貨**: 15 / **品目**: 10 / **総組み合わせ**: 150
- **WASM サイズ**: 38KB (release + wasm-opt)
- **コード**: Rust 約 500 行 / フロント 約 500 行

## 次のステップ案

- AudioContext で「カチン」と判定音、背景にエスニックな環境音
- 都市表示 — 「今あなたは バンコク にいる」フレーバーで没入感
- 為替レートを実 API (exchangerate.host 等) から起動時にフェッチ
- 「品目解放」も追加 — ストリーク 20+ で「医療費」「短期航空券」など高額品目
- リーダーボード (Cloudflare Workers + KV)
- 「ロケットモード」(時間制限なしの教育モード)
