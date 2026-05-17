# 速攻デッキ (sokkou-deck) — Summary

## What was built
効率厨 ゲーマー の ため の、 フラッシュカード スピードラン トレーナー。 デッキ を 選び モード を 選び `ENTER` で run 開始、 ms 単位 で 計測 され、 終わる と PB と の delta を ms 精度 で 比較 する 「フレーム データ」 表 が 出る。 過去 PB との 差分 は run 中 も リアルタイム で 表示 (`-682 ms ahead` / `+412 ms behind`)。 暗記 を ゲーム の ように 詰める Rust + WASM Web アプリ。

## Discovery Roll
- **Source 38**: 教育テック — 学習、 トレーニング、 スキルアップ
- **Persona 7**: 効率厨 ゲーマー
- **Platform 10**: Rust + WASM web app
- **Intent 5**: 夢中にさせる — ゲーム性 / 中毒 / 競う

Source 38 (edu tech) を Persona 7 (効率厨 ゲーマー) に 当てる と、 「学習」 を ゲーム の リプレイ 感覚 で 削る アプリ に なる。 スピードラン 文化 の 語彙 (PB / WR / splits / frame data) を そのまま 持ち込み、 暗記 の 過程 そのもの を 速度 競技 化 した。 Intent 5 (中毒) は ms 単位 の 自分 と の 競争 で 自然 に 成立。 Rust + WASM は cycles 102/103 以来 11 cycle ぶり、 直近 と 被ら ず フレッシュ。

## Tech Stack
- **Rust** 2021 edition (1.94)、 純ロジック (`deck` / `run` / `stats` / `normalize` / `banned`)
- **wasm-bindgen** 0.2 + **serde-wasm-bindgen** 0.6 で JS と の シームレス な 値 渡し
- **wasm-pack** で `target web` ビルド、 `www/pkg/` に出力 (.wasm + ESM)
- **vanilla JS** ES module、 ビルド ツール 不要 (Vite 等 なし)
- **localStorage** で PB / 設定 を 永続化
- **CSS** 完全 自前 — ダーク モノスペース テーマ、 監視 系 HUD 風

## Features
- **3 モード**:
  - `any%` — 全カード を できる だけ 速く、 ミス は 進行 だけ する (正解 率 は 結果 で 集計)
  - `100%` — 全カード 正解 必須、 ミス は run 時間 に +5 秒 ペナルティ
  - `consistency` — 10 問 連続 正解 を 最速 で、 1 ミス で run 失敗
- **5 内蔵 デッキ** (200 枚 計)
  - TOEIC 600 単語 (50 枚)
  - IT パスポート 用語 (40 枚)
  - 元素 記号 (50 枚)
  - JLPT N1 慣用句 (30 枚)
  - 歴代 総理大臣 (30 枚)
- **リアルタイム PB delta**: run 中 timer 横 に `-682` (緑) / `+412` (赤) で 即 反映
- **splits パネル**: 右側 に 1 行 ずつ の 区間 タイム が 流れる、 ミス は 赤 で
- **フレーム データ 表**: run 後 に 1 枚 ずつ の 答え / 判定 / 区間 ms / vs PB delta を 一覧
- **NEW PB アニメ**: PB 更新 時 は 結果 画面 上部 に `★★ NEW PB ★★`
- **入力 正規化**: 半角/全角、 カタカナ ⇔ ひらがな、 句読点、 ASCII 大小 を 揃える
- **複数 答え**: 1 カード 複数 回答 を 配列 で 受ける、 「/」 区切り の 内部 alternatives も 解釈
- **設定 永続化**: 最後 に 使った デッキ / モード を 次回 起動 時 に 復元
- **PB リセット** ボタン (確認 ダイアログ あり)

## Tests (48 passing)
- `tests/normalize_test.rs` (11) — 小文字化、 trim、 全角→半角、 カタカナ→ひらがな、 句読点、 alternatives、 空 入力、 全角 スペース
- `tests/deck_test.rs` (8) — 5 デッキ 存在、 ID 重複、 30 枚 以上、 カード ID 重複、 空 prompt/answers ない、 find_deck、 全 カード の 正規 回答 で is_correct round-trip
- `tests/run_test.rs` (13) — start、 any% 進行、 any% 終了、 100% ペナルティ、 100% 進行、 consistency 失敗、 consistency 終了、 split delta、 total + penalty、 correct_count、 終了 後 no-op、 clamp、 mode labels
- `tests/stats_test.rs` (12) — format_time 4 境界、 format_delta 3 ケース、 annotate (PB 有無)、 compute_result (新 PB / 遅い / 速い / 別 デッキ)
- `tests/banned_test.rs` (4) — find、 全 デッキ 文字列 監査、 UI 文字列 監査

## Files (5 Rust source / 5 test / 3 frontend, ~1,650 LOC)
```
sokkou-deck/
├── Cargo.toml
├── README.md / PLAN.md / CLAUDE.md / SUMMARY.md / .gitignore
├── src/
│   ├── lib.rs               # WASM bindings (8 exports)
│   ├── deck.rs              # 5 built-in decks + DeckSummary
│   ├── run.rs               # Run state machine, 3 modes
│   ├── stats.rs             # PersonalBest, annotate, formatters
│   ├── normalize.rs         # 入力 正規化 / is_correct
│   └── banned.rs            # BANNED_WORDS 監査
├── tests/                   # 5 test files / 48 tests
└── www/                     # 静的 フロントエンド
    ├── index.html           # 3 画面 (home / run / result)
    ├── style.css            # ダーク HUD テーマ
    ├── main.js              # WASM glue, localStorage PB, timer (rAF)
    └── pkg/                 # wasm-pack 出力 (gitignored)
```

## How to Run
```bash
cd sokkou-deck
cargo test                            # 48 tests
wasm-pack build --target web --out-dir www/pkg
cd www && python3 -m http.server 8000
# → http://localhost:8000
```

## Challenges & Fixes
- **mode 文字列 ⇔ enum 表現 の ズレ**: JS 側 で `state.selectedMode = "any%"` と 保持 して いた が、 Rust の `RunMode::AnyPercent` を serde_wasm_bindgen で 返す と `"AnyPercent"` と いう 文字列 に なる。 PB を JS から Rust へ 戻す とき に mode 比較 が 失敗 する 可能性 が あった。 `MODE_CANONICAL` 辞書 で `"any%" → "AnyPercent"` の 変換 を かます よう に
- **clippy の clamp 推奨**: `consistency_target` で `deck_size.min(10).max(1)` を 書いた が clippy が `clamp(1, 10)` を 推奨。 0 入力 で も `clamp(1, 10) == 1` で 期待 通り、 既存 テスト も pass
- **char comparison の 簡略化**: `a.split(|c: char| c == '/' || ...)` を 配列 ろ?パターン `a.split(['/', '、', ','])` に 書き換え (clippy 推奨)
- **`init` 関数 の 命名**: wasm-pack `--target web` 出力 は `__wbg_init as default` で エクスポート。 main.js で `import init from "./pkg/...js"` の デフォルト import で 取れる、 ハマる ポイント

## Potential Next Steps
- **カスタム デッキ 入力**: JSON 貼り付け か CSV import で 自作 デッキ を 取り込み (localStorage に 保存)
- **ゴースト カーソル**: PB の 同 タイミング の splits を リアルタイム で 比較 表示 (現状 は 数字 だけ)
- **Sound Pack**: 正解 / ミス / PB 更新 の SFX (Web Audio で 軽量 generation)
- **デイリー チャレンジ**: 日付 を seed に した 10 枚 ピックアップ、 同日 内 の 自己 PB だけ 比較
- **シェア URL**: 結果 を URL hash に エンコード して 「俺 の PB 抜いて み」 (端末 跨ぎ)
- **タイピング モード**: 答え を 1 文字 ずつ 表示、 タイプ ミス で 再 タイプ 必須 の シビア 版
- **アクセシビリティ**: ハイ コントラスト テーマ、 大 フォント、 reduced-motion 対応
