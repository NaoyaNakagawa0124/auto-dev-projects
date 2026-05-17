# 夜更けニュース (yofuke-news) — Summary

## What was built
深夜 3 時 に ターミナル で `node src/cli.js` (or `npx yofuke-news`) と 叩く と、 今夜 の indie ゲーム ニュース 5 件 が ASCII カード で 流れる Node CLI。 各 カード に は 作品 タイトル + ジャンル + 価格 + プレイ 時間 目安 と、 「あなた の 睡眠 と 引き換え に N 時間」 「クリア まで に 失う 朝食 N 回」 「○ 朝、 同僚 に 〇〇 と 言える 1 本 です」 の ような 絶妙 に バカっぽい 換算 が 添えられる。 換算 の 「睡眠 係数」 は 時刻 で 変化 (22-0 時 は 1.2、 1-2 時 は 1.0、 3 時 は 0.7、 4-5 時 は 0.4) ので、 同じ ゲーム でも 4 AM に 開く と 「失う 睡眠」 が ぐっと 少なく 表示 される — それ も 笑い の 1 つ。

夜型 ゲーマー が 深夜 に カチカチ ターミナル を 開く 文化 と、 indie ゲーム ニュース と、 「睡眠 を 失う 計算」 の 完全 な 非接続 が Intent 3 (笑い) の 核。

## Discovery Roll
- **Source 10**: Latest gaming news (new releases / indie hits / speedrunning)
- **Persona 20**: 深夜 3 時 が 一番 集中 できる 夜型人間
- **Platform 2**: CLI / terminal tool (Node)
- **Intent 3**: 「こんなのアリ?」 と 笑わせる — 人に話したくなるか

Original Platform 7 (Unreal Engine) を Platform 2 (CLI/Node) に reroll、 ローカル に Unreal の SDK が 無い ため。 Source × Persona × Intent は 完全 オリジナル の 組み合わせ。

## Tech Stack
- Node 22 / ES modules / `package.json` の `bin` で `yofuke-news` を 全システム コマンド に
- chalk 5 (ESM 専用) で 色付け、 `FORCE_COLOR=0` で 無効化
- 純ロジック (news / jokes / clock / rand) と renderer / cli を 完全 分離
- xorshift32 + golden-ratio warmup の date-seeded RNG (cycle 18 以降 の 標準パターン)
- 引数 parse は yargs を 使わず process.argv の 簡易 parse (依存 軽く)
- 配色 は 罫線 dim gray、 数字 yellow bright、 ジャンル magenta、 価格 yellow、 状態 cyan で、 「深夜 に 眩しくない」 トーン
- visualWidth で CJK を 2 字幅 として 計算、 ASCII カード の 罫線 が 揃う
- 過剰 に 長い テキスト は 「…」 で 切り詰め (commentsToTell の 長い テンプレート 対策)

## Features
- 12 件 の indie ゲーム ニュース (2026-05 想定、 創作 タイトル、 ジャンル / 価格 / 時間 / 状態 / 1 行 blurb)
- ジャンル 多様性: メトロイドヴァニア / スローライフ / アドベンチャー / シミュレーション / プラットフォーマー / オープン ワールド / ロギライク / ホラー / パズル / ナラティブ / シミュレーション x2
- 1 タップ = 5 件 (デフォルト) or 12 件 (`--all`)、 30 秒 で 読了
- 「睡眠 係数」 の 時刻 連動 で 同じ ゲーム でも 違う 表情
- 「commentsToTell」 で 「朝 の 雑談 に 使える 1 行」 を 静か に 添える
- 引数: `-a/--all`、 `--no-color`、 `-h/--help`、 `-v/--version`
- BANNED_WORDS 監査 (「夜更かし 注意」 「廃人」 「ダメ人間」 「もう 寝なさい」 「絶対」 「神レベル」 「最強」 「神ゲー」 「クソゲー」 「失敗」) を vitest で 全 12 ニュース の title / jp / genre / short_blurb に 対して audit
- 配色 / 罫線 / 列揃え が ターミナル で きれい に 動く、 `--no-color` で plain text も OK
- ヘッダー に 時間帯 ラベル (夜の入口 / 深夜 / 未明 / 日中) を 添える、 「あなた が 今 どこ に いる か」 を 静か に 示す

## Tests (48 passing)
- `tests/news.test.js` (10) — 12 件、 id / title 重複 なし、 price 範囲、 hours 範囲、 release_kind 3 種、 blurb 長さ、 BANNED_WORDS フリー、 byId、 GENRES 5+
- `tests/jokes.test.js` (12) — sleepFactor 5 phase、 sleepHoursTraded の 0.1 桁、 breakfastsLost の round、 commentsToTell の 全 ニュース で string / deterministic / BANNED_WORDS フリー
- `tests/clock.test.js` (10) — tierFor 4 phase、 範囲外 throw、 pickNewsForNow の n クランプ / 空 / deterministic / hour 違い / 日違い / 重複なし、 formatStamp
- `tests/render.test.js` (12) — visualWidth (ASCII / CJK / mix)、 padToVisualWidth (pad / 等しい / 切り詰め)、 formatHeader / formatCard / render の 構造 と 内容

## Files (10 source files, ~919 LOC)
```
yofuke-news/
├── package.json            # chalk + vitest, bin: yofuke-news
├── README.md / PLAN.md / CLAUDE.md / SUMMARY.md
├── .gitignore
├── src/
│   ├── rand.js             # xorshift32 + warmup
│   ├── news.js             # 12 indie news + BANNED_WORDS
│   ├── jokes.js            # sleepHoursTraded / breakfastsLost / commentsToTell
│   ├── clock.js            # tierFor / pickNewsForNow / formatStamp
│   ├── render.js           # ASCII cards (CJK-aware visualWidth)
│   └── cli.js              # entry, argv parse, --all/--no-color/--help/--version
└── tests/                  # 4 files / 48 tests
```

## How to Run
```bash
cd yofuke-news
npm install
npm test                           # 48 tests
node src/cli.js                    # 5 件 (デフォルト)
node src/cli.js --all              # 12 件 全部
node src/cli.js --no-color         # 色 を 無効化
node src/cli.js --help             # ヘルプ
npm install -g .                   # `yofuke-news` を どこ から でも
```

## Challenges & Fixes
- **「神」 が「神社」 で 偽陽性 を 出す**: 当初 BANNED_WORDS に 「神」 単体 が あった (「神ゲー」 「神レベル」 を 弾く 意図)、 でも 「embers-of-okutama」 の jp に「神社」 が 含まれて テスト fail。 BANNED_WORDS を 「神レベル」 「神ゲー」 に 具体化、 一般語 を 拾わない 設計 に。 CLAUDE.md にも 注釈 追記
- **CJK 文字幅 で 罫線 が 揃わない**: ターミナル で CJK は 通常 2 字幅 だが ASCII は 1 字幅。 visualWidth ヘルパー を 自前 で 実装、 CJK / fullwidth 範囲 (U+3000-U+9FFF, U+FF00-U+FFEF) を 2 と カウント。 罫線 が 揃う
- **長い テンプレート が カード を 突き破る**: commentsToTell で 「『…』 を 知って いる の は 〜」 が news.jp 長文 で 60+ 字 を 越え、 右 罫線 が ズレた。 padToVisualWidth を 切り詰め 対応 に 改修、 「…」 で 終わる ように
- **chalk 5 は ESM 必須**: package.json に `type: "module"` を 設定、 CLI を ES module で 書く。 chalk は import で 取得、 FORCE_COLOR=0 を 設定 してから 動的 import で chalk を 引っ張る (--no-color 対応)

## Potential Next Steps
- 実在 の Steam API / itch.io API を `.env` の API key 経由で 叩いて 動的 取得 (現状 は 静的 12 件)
- `--genre パズル` で ジャンル フィルタ
- 過去 N 日 分 を カバー する `--days 7` モード
- 各 ニュース に 起動 コマンド を 1 行 追加 (Steam app id の deep link)
- 「あなた の 今夜 の プレイ 候補」 を localStorage 風 ファイル に 保存、 翌朝 「昨夜 開いた ニュース」 を 思い出させる
- 同 ロジック を fish / zsh の greeting に 組み込んで、 ターミナル 起動 時 に 1 件 だけ 出る mode
- 季節 イベント (大型 セール、 GOTY、 indie fest) を 検知 して banner を 出す
