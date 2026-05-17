# 机 の 隅 (tsukue-no-sumi) — Summary

## What was built
カフェ で 作業 する ノマド フリーランス が、 ターミナル で `tsukue start <client> [task]` と 1 行 叩いて 開始、 `tsukue stop` で 終わる だけ の Swift macOS CLI。 通知 し ない、 連勝 を 数え ない、 「集中 して ます か?」 と 聞か ない。 月末 に `tsukue month --copy` で クライアント 別 合計 と 日 別 明細 が 含まれる Markdown が pbcopy 経由 で クリップボード に 入り、 そのまま 請求書 に 貼れる。 机 の 隅 に 置いた ノート みたい な 存在 感 が Intent 4 (そっと寄り添う) の 核。

## Discovery Roll
- **Source 18**: B2B enterprise pain points (CRM, ERP, invoicing, HR, logistics)
- **Persona 30**: カフェ で 作業 する ノマドワーカー
- **Platform 11**: Swift macOS native app
- **Intent 4**: そっと寄り添う — 癒し / メンタル / 静か

Platform 11 (Swift macOS) は cycle 22 (starlog) 以来 5 cycle ぶり、 直近 と かぶら ない 程度 に 新鮮。 Source 18 (B2B 痛み 点) を 「請求 / 工数 管理」 と 解釈 し、 Persona 30 (ノマド) に B2B SaaS の 重い ダッシュボード で は なく ターミナル で 1 行 という 答え を 当てた の が この 作品 の 核。

## Tech Stack
- Swift 5.9+ / macOS 13+
- Swift Package Manager で executable (`tsukue`) + library (`TsukueCore`) + test (`TsukueCoreTests`) の 3 ターゲット 構成
- 依存 ゼロ (Foundation のみ)
- データ 永続化: `~/.tsukue-no-sumi/sessions.json` (UTC ISO8601)、 `TSUKUE_DATA` 環境変数 で 上書き 可
- 表示 は 全 て JST、 `Asia/Tokyo` タイムゾーン 固定
- カラー 出力 は ANSI エスケープ で 軽量、 TTY 判定 + `NO_COLOR` 環境変数 対応
- pbcopy で 月次 Markdown を クリップボード に (macOS 一級 市民)

## Features
- `tsukue start <client> [task]` — 進行中 セッション 1 個 だけ 許容、 二重 開始 は エラー
- `tsukue stop` — 「お疲れ さま」 と 経過 時間 だけ、 評価 数字 は 出さ ない
- `tsukue cancel` — 進行中 を 破棄 (誤 start 用)
- `tsukue status` — 進行中 セッション を 1 行 で 表示
- `tsukue today` — 今日 の セッション を 表 で、 合計 行 付き
- `tsukue list [--days N]` — 直近 N 日 (デフォルト 7) を 日 別 グループ で
- `tsukue month [--copy]` — 今月 の クライアント 別 合計 + 日 別 明細 を Markdown で、 `--copy` で pbcopy
- `tsukue forget [--yes]` — 全 データ 削除 (確認 あり、 `--yes` で skip)
- `tsukue --help` / `tsukue --version`
- CJK 2 字幅 認識 で 表 の 列 が 揃う、 はみ 出し は `…` で 切り詰め
- BANNED_WORDS 監査 (「連勝」 「ストリーク」 「達成 度」 「集中 度」 「効率」 「サボり」 「怠ける」 「頑張れ」 「神 レベル」 「神レベル」) を XCTest で 自動 化

## Tests (65 passing)
- `SessionTests` (5) — isRunning、 durationSeconds (実行中 / 完了 / 過去 now)、 Codable round-trip
- `TimeFormatTests` (9) — duration の 4 境界、 JST 表示 (HH:mm / yyyy-MM-dd / 曜日 / yyyy-MM)、 月境界 / 日境界
- `SessionStoreTests` (19) — load/save round-trip、 親 ディレクトリ 自動 作成、 start/stop/cancel/forget、 二重 start エラー、 空 client 拒否、 タスク 空白 trim、 時間 逆転 拒否、 env override、 corrupt file → ioFailure
- `AggregatorTests` (8) — 日 / 月 / 直近 N 日 フィルタ、 client 別 合計、 ソート、 days clamp、 空 入力
- `MarkdownReportTests` (6) — 空 月、 client 別 / 日 別 明細、 他 月 除外、 パイプ エスケープ、 進行中 表示
- `VisualWidthTests` (8) — ASCII / 日本語 / 混在 の 幅、 pad / truncate
- `TableViewTests` (4) — 日 別 行、 進行中 の `…`、 合計、 複数 日 グルーピング
- `BannedWordsTests` (6) — find、 「神社」 偽陽性 防止、 「神 レベル」 ヒット、 source 文字列 監査

## Files (9 source / 7 test, ~750 LOC)
```
tsukue-no-sumi/
├── Package.swift              # SwiftPM、 lib + exec + test の 3 ターゲット
├── README.md / PLAN.md / CLAUDE.md / SUMMARY.md / .gitignore
├── Sources/
│   ├── TsukueCore/            # 純ロジック
│   │   ├── Session.swift          # Codable struct
│   │   ├── SessionStore.swift     # atomic write, env path
│   │   ├── Aggregator.swift       # today / last N / month / by-client
│   │   ├── MarkdownReport.swift   # 月次 Markdown 生成
│   │   ├── TableView.swift        # 表 行 整形 (CJK 揃え)
│   │   ├── TimeFormat.swift       # JST 表示 / duration / 月境界
│   │   ├── VisualWidth.swift      # CJK 2 字幅 認識
│   │   ├── BannedWords.swift      # 監査
│   │   └── TsukueError.swift
│   └── tsukue/main.swift      # CLI dispatch + pbcopy
└── Tests/TsukueCoreTests/     # 7 test files / 65 tests
```

## How to Run
```bash
cd tsukue-no-sumi
swift build -c release
swift test                                   # 65 tests
.build/release/tsukue --help
.build/release/tsukue start acme-corp "ランディング 微調整"
.build/release/tsukue stop
.build/release/tsukue today
.build/release/tsukue month --copy           # クリップボード に Markdown
cp .build/release/tsukue /usr/local/bin/     # どこ から でも
```

## Challenges & Fixes
- **タイムスタンプ の 大量 誤算**: テスト で 「2026-05-17 14:32 JST」 用 epoch を 暗算 し たら 1779679920 と 書いた が、 それ は 実 際 は 2026-05-25 — 8 日 ズレ。 TimeFormat / Aggregator / Markdown / TableView の 10 テスト が 一斉 に 失敗。 Python で `datetime(...).timestamp()` を 検算 し て 全 数字 を 1778995920 系 に 差し替え。 macOS の `date` コマンド は 24 秒 加算 する 癖 が あり (leap second 関連 ?) 混乱 の もと だった、 Python の `datetime` を 真実 と する
- **defaultPath の env 引数 を 内部 で 無視**: テスト 用 に `env: [String: String]` 引数 を 取って いた が、 内部 ヘルパー の `fileURLForHome()` が `ProcessInfo.processInfo.environment` を 直接 読み、 渡された env が 反映 さ れ ず。 渡さ れた env を そのまま 使う よう ヘルパー を 削除 し て flatten
- **未使用 変数 警告**: Aggregator で `let end = s.endedAt ?? now` を 書い た が 結局 跨ぎ 判定 を 開始日 一本 に した ため 不要 に なった。 `_ = now` で 引数 を 明示 的 に 黙ら せる (関数 シグネチャ は 揃えて おく)
- **進行中 セッション の 表示**: `endedAt: nil` を 表 と Markdown で どう 出す か。 ターミナル 側 は `  …  ` (3 文字 で 終了 時刻 と 同 幅) で 揃え、 Markdown は `進行中` 文字列 と 別 ルート に

## Potential Next Steps
- メニュー バー アプリ (SwiftUI) で 常時 「進行中」 アイコン 表示、 クリック で 1 行 ログ
- `tsukue edit <id>` で 過去 の セッション の client/task/時刻 を 修正
- `tsukue start --back 30m acme` で 「30 分前 から 始まって た こと に する」 (会議 終わり に 思い出 した 用)
- Markdown 出力 を CSV / Numbers 形式 に も
- iCloud Drive 同期 で 複数 Mac 間 共有 (`TSUKUE_DATA=$HOME/Library/Mobile\ Documents/...`)
- 時給 を client 別 に 設定 し 月次 で 概算 請求 額 を 出す (税抜 / 税込)
- `tsukue tap` で セッション 開始 を VoiceOver で 読み上げ さ せる (アクセシビリティ)
