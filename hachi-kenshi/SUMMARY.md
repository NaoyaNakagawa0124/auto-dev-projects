# 鉢検視 (hachi-kenshi) — Summary

## What was built
枯らした 観葉 植物 を 「事件」 と して 検視 する ノワール 推理 ゲーム。 各 事件 は 被害 者 (植物 名 + 学名 + 享年)、 発見 時 の 条件、 5-7 ヶ条 の 物的 証拠、 4-5 名 の 容疑 者 (死因) で 構成 さ れる。 容疑 者 は それぞれ 「私 が 犯人 なら 〜 の は ず」 と 自己 弁明 を 述べ、 プレイヤー は 証拠 と 弁明 の 矛盾 を 突いて 真 の 死因 を 起訴 する。 12 件 (4 章 × 3 件)、 各 章 を 3/3 で クリア で 次 章 解放、 全 12 件 を 解く と 得点 と タイム の PB が 確定。

実は 教育 的 — 各 解説 で 過湿 / 根腐れ の 連鎖、 サボテン の 凍害 ライン、 多肉 の 徒長 メカニズム 等 の ケア 豆 知識 が 学べる。 「植物 を 枯らし まくる プラント キラー」 (Persona 18) を 「では 次 こそ 殺さ ない 為 に」 と 推理 ゲーム で 巻き 込む 設計。

## Discovery Roll
- **Source 25**: True crime, mystery, or puzzle culture
- **Persona 18**: 植物 を 枯らし まくる プラント キラー
- **Platform 10**: Rust + WASM web app (re-rolled from 5 since browser ext was used cycle 30)
- **Intent 5**: 夢中にさせる — ゲーム性 / 中毒 / 競う

ミステリ 文化 × プラント キラー × Rust+WASM × 中毒 — の 4 軸 が 「事件 簿 を 開く 推理 ゲーム」 で 1 つ に。 ノワール の 文体 (1 人称 容疑 者、 起訴 → 判決 → 解説) を 植物 ケア の 教育 内容 と 接合 する の が この 作品 の 一番 の 面白 さ。

## Tech Stack
- Rust 2021 / wasm-bindgen 0.2 / serde-wasm-bindgen 0.6
- wasm-pack `--target web`、 vanilla ES module JS、 ビルド ツール (Vite 等) なし
- localStorage で progress / PB
- セピア 紙 風 CSS テーマ (古い 検視 メモ 帳)、 セリフ 体 (Hiragino Mincho) + 等幅 (タイム 表示)
- 7 死因 enum (Dryness / Overwatering / RootRot / LowLight / Cold / Pest / FertilizerBurn)
- 各 死因 に 「私 で は ない」 弁明 文 が 紐付く、 ボタン 押下 で 表示

## Features
- **12 件 の 事件** (観葉 / サボテン / ハーブ / 多肉 各 3 件)
- **章 ロック** — 前 章 を 3/3 で クリア する と 次 章 解放
- **証拠 → 容疑 者 → 起訴** の 3 段 推理 構造、 容疑 者 カード に 弁明 文 表示
- **判決 + 解説** — 正解 で 「起訴 認容」 (緑)、 誤起訴 で 「再 調査 が 必要」 (赤)、 解説 文 で 植物 ケア 知識
- **タイム アタック** — RAF ベース の リアルタイム タイマー、 全 完走 で 合計 タイム を PB と 比較
- **採点** — 正解 +100 / 誤起訴 -30 / 章 完走 +50 / 全 完走 +200 / 5 分 以内 +100
- **進捗 永続化** — localStorage、 ホーム の 章 ボード で 緑 (正解) / 赤 (誤起訴) で 視認 化
- **進捗 リセット** ボタン (確認 ダイアログ 付き)
- **モバイル 幅** 対応 (520px 以下 で 章 ボード 1 列)

## Tests (37 passing)
- `tests/case_test.rs` (12) — 12 件、 ID 重複 なし、 各 章 3 件、 culprit ∈ suspects、 4+ suspects、 5+ evidence、 explanation 長 さ、 find_case 既知 / 未知、 chapter label、 suspects unique、 chapter 分布
- `tests/cause_test.rs` (5) — 7 cause、 label / alibi 非 空、 label unique、 equality
- `tests/verdict_test.rs` (5) — 正解 / 誤起訴、 explanation、 judge_by_id 既知 / 未知
- `tests/score_test.rs` (10) — 空 / 全 正解 + 時 / 全 正解 - 時 / 章 単独 / 誤起訴 減点 / 章 進捗 / 第 1 章 開放 / 次 章 解放 / 部分 章 未 解放 / time_bonus 条件
- `tests/banned_test.rs` (5) — find hit/miss、 全 case 文字列 + cause 文字列 + UI 文字列 監査

## Files (6 Rust src / 5 test / 3 frontend, ~1,400 LOC)
```
hachi-kenshi/
├── Cargo.toml
├── README.md / PLAN.md / CLAUDE.md / SUMMARY.md / .gitignore
├── src/
│   ├── lib.rs                  # WASM bindings (10 exports)
│   ├── cause.rs                # 7 cause enum + label + alibi
│   ├── case.rs                 # Case struct + 12 件 データ + Chapter enum
│   ├── verdict.rs              # judge / judge_by_id
│   ├── score.rs                # 採点 + 章 進捗 / unlock
│   └── banned.rs               # BANNED_WORDS 監査
├── tests/                      # 5 files / 37 tests
└── www/
    ├── index.html / style.css / main.js
    └── pkg/                    # wasm-pack 出力 (gitignored)
```

## How to Run
```bash
cd hachi-kenshi
cargo test                                       # 37 tests
wasm-pack build --target web --out-dir www/pkg
cd www && python3 -m http.server 8000
# → http://localhost:8000
```

## Challenges & Fixes
- **「殺人犯」 vs 「殺す」 — どこ まで NG に する か**: 「枯らす = 植物 を 殺す」 と いう 比喩 を 軸 に した 作品 なので、 「殺す」 「殺害」 単独 は 観葉 植物 の 文脈 で 軽く 使え る よう に 残し、 「殺人犯」 「凶悪」 「死刑」 等 の 重 い 名詞 だけ を BANNED_WORDS に。 banned_test で 全 case + UI 文字列 を 監査 し て バランス を 確保
- **章 ロック を Rust と JS の どちら で 持つ か**: Rust 側 に `chapter_unlocked` を 実装 した が、 JS 側 でも 同 ロジック を 軽量 に 持つ こと に した (Wasm 往復 を 減らす)。 ロジック の 真実 は Rust テスト で 保証、 JS は 表示 用 の 簡易 ミラー
- **Rust enum の JS 表現**: serde は `Cause::Dryness` を そのまま 文字列 `"Dryness"` に シリアライズ。 JS で は そのまま 文字列 として 渡し、 `causeLabel("Dryness")` で 日本語 ラベル を 取得 する 設計。 cycle 29 (sokkou-deck) と 同じ パターン
- **判決 の 「やり直し」 を 許す か**: 1 度 起訴 する と 結果 が 確定 する 設計 に した (誤起訴 は -30 で 残る)。 やり直し 可能 に する と 推理 の 緊張 感 が 失われる ため、 「最初 の 一発 で 当てる」 ゲーム 性 を 優先

## Potential Next Steps
- **複合 死因 事件**: 上級 編 で 「過湿 + 寒さ」 等 の 2 犯 同時 起訴 を 必要 と する 事件
- **被害 者 一覧 メモリアル**: 全 12 件 を 解いた プレイヤー 専用 の 「鎮魂 録」 ページ、 解説 を 一覧 で 振り返れる
- **写真 機能**: 実 植物 の 写真 を upload し、 「あなた の 植物 の 死因 を 当てる」 セルフ 検視 モード
- **24 件 / 36 件 へ 拡張**: ベゴニア / シダ / ラン / 食 虫 植物 の 章 を 追加、 季節 イベント
- **共有 リプレイ**: 自分 の 検視 結果 + タイム を hash 共有 し て 「友人 が 何 件 当てた か」 を 比較
- **音 効果**: 起訴 ボタン の 「ドン!」 SFX、 判決 の ハンコ 押す 音
- **アクセシビリティ**: high-contrast テーマ、 reduced-motion 対応
