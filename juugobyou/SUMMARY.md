# juugobyou (十五秒) — Summary

## What was built
ぐったりした時に開く、 15 秒だけの小さなボタン。 タップすると円が 15 秒かけて満ち、 「視界にある〇〇を、 ひとつだけ、 元の場所に。」 のような物体を 1 つだけ指す静かなプロンプトが現れる。 15 秒経つと「ありがとう。 ここまでで、 十分です。」 のフェアウェルに切り替わり、 ボタンは元に戻る。 streak も達成ゲージもなく、 「今日 N 回さわった」 のさわった回数だけが下に残る。

Rust + WASM の超軽量シングル HTML アプリ。 ロジック (40 件の物体プロンプト × 3 声 × farewell) は cargo test だけで検証でき、 ブラウザは init してボタンを描くだけ。

## Discovery Roll
- **Source 14**: フィットネス/ウェルネス/メンタルヘルス
- **Persona 32**: 片付けが苦手な人
- **Platform 10**: Rust + WASM web app
- **Intent 4**: そっと寄り添う — 心拍が下がるか

## Tech Stack
- Rust 1.94 + wasm-bindgen 0.2 + serde / serde-wasm-bindgen 0.6
- wasm-pack (target=web)、 `wasm-opt = false` で古い binaryen を回避
- Vanilla HTML / CSS / ES module、 ビルドは wasm-pack のみ
- localStorage 2 キー (`juugobyou:counter`、 `juugobyou:voice`)
- cargo test で 16 件のユニットテスト

## Features
- 1 つのデカい円形ボタン (220 × 220、 モバイルは 180 × 180)
- 15 秒の SVG ring fill アニメーション (`stroke-dasharray` を `@keyframes` で巻く)
- 40 個の物体プロンプト (コップ / 本 / 紙 / ペン / リモコン / 靴下 / …) を `touchToday % 40` で循環
- 3 種類の声:
  - **静か** (quiet): 「視界にある X を、 ひとつだけ、 元の場所に。」
  - **友達** (friend): 「X を ひとつ、 戻してみない?  それだけでいいよ。」
  - **おかあさん** (mother): 「ねえ、 X を ひとつだけ、 そっと戻してあげてみない?」
- 15 秒終わると 4 秒のフェアウェル → idle に戻る (1 タップ 19 秒のサイクル)
- カウンターは 日付付きで保存され、 日が変われば自動でリセット
- 声選択は localStorage に persist
- Space / Enter キーでもタップ可
- 禁止語チェック — `prompts.rs` の BANNED_WORDS = `["頑張", "怠け", "汚", "ダメ", "クリア", "達成", "完了", "やり遂げ", "諦めず", "努力"]` を全プロンプト × 全声 × farewell に対して cargo test で監査

## Tests (16 passing)
- `tests/prompts.rs` — 8 件 (objects=40 / 重複なし / 各 object が 3 声で render される / banned-word audit / index 範囲外で modulo / 空でない / quiet が「視界」を含む / friend が「ね」を含む)
- `tests/voice.rs` — 8 件 (3 voices / 各 voice の key と label / farewell に「十分」を含む / from_key の fallback / object 注入 / mother が「ねえ」で始まる / quiet が主語を含まない / 比較表現を含まない)

## Files (10 source, ~805 LOC)
```
juugobyou/
├── Cargo.toml            # wasm-bindgen + serde, wasm-opt=false
├── README.md
├── PLAN.md
├── CLAUDE.md             # 禁止語 / 配色 / 声の規約
├── SUMMARY.md            # ← this file
├── src/
│   ├── lib.rs            # wasm-bindgen 公開: prompt/farewell/voices/total_prompts
│   ├── prompts.rs        # 40 件の object + BANNED_WORDS
│   └── voice.rs          # Voice enum + render() + farewell()
├── tests/
│   ├── prompts.rs        # 8 tests
│   └── voice.rs          # 8 tests
└── web/
    ├── index.html        # 単一画面
    ├── style.css         # 紙/墨/金/月の和的パレット
    ├── app.js            # WASM init + 15s タイマー + localStorage
    └── pkg/              # wasm-pack 生成物
```

## How to Run
```bash
cd juugobyou

# ロジックテスト (UI なし)
cargo test                       # 16 tests

# WASM ビルド
wasm-pack build --target web --release --out-dir web/pkg

# ブラウザで開く
python3 -m http.server -d web 8080
# → http://localhost:8080
```

## Challenges & Fixes
- **wasm-opt の古さ**: `[package.metadata.wasm-pack.profile.release] wasm-opt = false` を Cargo.toml に最初から入れて回避 (前 cycle の hibi-no-mukashi で学んだ教訓を予防適用)
- **「達成」「完了」 を避ける言葉選び**: BANNED_WORDS を cargo test で監査して、 「片付けた」 「完了」 「ナイス」 のような期待誘導語が混入しないかを毎ビルドで保証
- **「主語を入れない」 規約**: quiet 声は 「あなたが…」 を一切使わず、 視界・場所・物だけで構成。 voice.rs::tests で正規表現監査 (「あなた」 「君」 「お前」 を含まないこと)
- **タップを「触る」 と呼ぶ**: counter の表示は「今日 N 回さわった」、 「やった」 「完了した」 とは絶対書かない (CLAUDE.md の規約)

## Potential Next Steps
- 「今だけ」 のさわった時刻だけを保存するログ (週ビュー、 streak ではなく振り返り)
- PWA 化 (Service Worker、 オフライン)
- ボタンを長押ししたら「7 秒バージョン」 / 短押しで「15 秒」 の 2 段階
- Web Audio で 15 秒の極小ピアノ単音 (オプトイン)
- 「触らない」 ボタンも置く — 円を見ているだけで 15 秒経つモード
- 物体プロンプトを 40 → 60 にゆっくり拡張、 季節モチーフ追加 (花、 落ち葉、 障子、 etc)
