# 副業バブル (fukugyou-bubble) — SUMMARY

## 何を作ったか

副業 TikTok のバズが日常化したこの時代に、「副業を始めたい」と言いながら一歩を踏み出せない人のための、健全なクリッカー idle ゲーム。8 種類の副業をクリックで稼ぎ、アップグレードで放置収入を増やしながら ¥10,000,000 を目指す Tauri ＆ ブラウザ両対応のゲーム。

90 秒に 1 回程度、「TikTok でバズ中」「AI アートが話題」などの**バイラルイベント**が発生し、特定の副業に 3 倍ボーナスが 30 秒間つく。これがクリック集中の見せ場。

## 特徴

- **8 種類の副業**: 📝テックブログ・🎥YouTube・🛒ドロップシッピング・🎨AIアート・📱TikTok・✏️デザイン・💻プログラミング・👩‍🏫家庭教師
- **クリッカー + idle**: クリック報酬 ¥10〜¥250、放置収入 ¥0.5〜¥15/秒。アップグレードコストは ×1.15 ずつ上昇
- **バイラルイベント**: 90 秒に 1 度、決定論的 RNG で 1 つの副業に 3× ボーナス、30 秒間
- **進捗バー**: 上部にピンク→金→緑のグラデーション、¥10M に対する%
- **ガラスモーフィズム UI**: 半透明カード + ぼかし + ピンク/金/緑の流れるオーブ
- **ポップアップ演出**: クリックで +¥ がフローティング表示、バイラル中はカードが脈動
- **自動保存**: 5 秒毎に localStorage に永続化、ページ離脱時も保存
- **Tauri デスクトップ ＆ ブラウザ両対応**: `desktop` フィーチャー任意で、CLI モードでも動作

## 技術スタック

- **Tauri 2.0** (Rust 1.94 backend + Web frontend)
- **Rust ロジック層**: `game.rs` を純粋関数として隔離、cargo test 26 件
- **Frontend**: Vanilla HTML/CSS/ES Modules、ビルドステップなし
- **JS ロジック層**: `modules/game.js` を Rust と 1:1 ミラー、node:test 17 件
- **永続化**: localStorage (frontend) / Rust 側は Tauri AppData (将来)
- **ガラスモーフィズム**: backdrop-filter + 多層 box-shadow + radial gradient orbs

## 技術的判断

| 課題 | 解決 |
|---|---|
| Tauri CLI なしで動かしたい | `desktop` features を optional 化、`cargo run` は CLI smoke モード |
| Rust と JS で同じロジックを保証 | `game.rs` と `game.js` を 1:1 ミラー、両側で 43 件のユニットテスト |
| バイラル発生をテスト可能に | RNG 値を引数として外から渡せる関数シグネチャ (`try_start_viral(state, rng_value)`) |
| 数値表示が無限に増える | ¥1.2K / ¥3.4M / ¥1.2 億 と桁ごとに省略 (formatYen) |
| クリッカーで「飽き」を防ぐ | 放置収入が一定速度で増え、バイラルが時々爆発する設計でテンポを作る |

## ファイル構成

```
fukugyou-bubble/
├── README.md, PLAN.md, CLAUDE.md, SUMMARY.md
├── src/                          フロント
│   ├── index.html, style.css, app.js
│   ├── modules/game.js           純粋ロジック (Rust と 1:1)
│   └── data/hustles.json         8 副業のデータ
├── src-tauri/
│   ├── Cargo.toml, tauri.conf.json
│   ├── capabilities/default.json
│   └── src/
│       ├── lib.rs                公開 API
│       ├── data.rs               JSON ロード
│       ├── game.rs               状態機械 (26 件のテスト)
│       └── main.rs               Tauri / CLI smoke
└── tests/game.test.mjs           JS テスト (17 件)
```

## 動かし方

```bash
# ブラウザで即試す
cd src
python3 -m http.server 8000

# Tauri デスクトップ
cargo install tauri-cli --version "^2.0"
cd src-tauri
cargo tauri dev --features desktop

# テスト
cd src-tauri && cargo test           # 26 tests
cd .. && node --test "tests/*.test.mjs"  # 17 tests
# 合計 43 件 passing
```

## 数値

- **Rust テスト**: 26 / 26 passing
- **JS テスト**: 17 / 17 passing
- **合計**: 43 件 passing
- **副業**: 8 種
- **コード**: Rust 約 350 行 + JS 約 400 行 + HTML/CSS 約 400 行 ≈ 1,150 LOC
- **目標金額**: ¥10,000,000

## 次のステップ案

- 効果音 — クリック音、バイラル発生音、達成ファンファーレ
- 「副業同士の相乗効果」 — 同じ副業を 25 個アップグレードしたら別の副業に 10% ボーナス
- リーダーボード — ¥10M 達成時間を比較
- バイラル種類の拡張 — ハッシュタグトレンド・税制改正・経済ニュースなど条件付き
- 多通貨対応 — Apple App Store / Google Play 風の「単価」モード
