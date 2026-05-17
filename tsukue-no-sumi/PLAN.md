# tsukue-no-sumi — 実装 計画

## Phase 1: Scaffold
- Package.swift (executable + library + test)
- README.md / CLAUDE.md / PLAN.md / .gitignore
- ディレクトリ 構造

## Phase 2: TsukueCore (純ロジック)
- `Session.swift` — Session struct, Codable, Equatable
- `SessionStore.swift` — JSON read/write, atomic save, env var path
- `TsukueError.swift` — エラー 型
- `TimeFormat.swift` — 時間 ↔ 文字列 (1h 07m)
- `Aggregator.swift` — today / list / month の 集計 ロジック
- `MarkdownReport.swift` — 月次 を Markdown へ
- `BannedWords.swift` — 監査 用

## Phase 3: CLI (Sources/tsukue)
- `main.swift` — エントリ、 argv parse、 dispatch
- `Commands/start.swift` — `tsukue start <client> [task]`
- `Commands/stop.swift` — `tsukue stop`
- `Commands/cancel.swift` — `tsukue cancel`
- `Commands/status.swift` — `tsukue status`
- `Commands/today.swift` — `tsukue today`
- `Commands/list.swift` — `tsukue list [--days N]`
- `Commands/month.swift` — `tsukue month [--copy]`
- `Commands/forget.swift` — `tsukue forget` (確認 あり、 `--yes` で skip)
- ヘルプ / バージョン / pbcopy ラッパー

## Phase 4: Tests
- `SessionStoreTests` — read/write/atomic、 env path、 空 ファイル
- `AggregatorTests` — today/月次/直近 N 日
- `TimeFormatTests` — 各 境界
- `MarkdownReportTests` — テーブル の 列 揃え
- `BannedWordsTests` — 全 文字列 リソース を 走査

## Phase 5: Verify
- `swift build -c release` で バイナリ
- `swift test` で 全 PASS
- バイナリ で smoke (start/stop/today を 一連 で)

## Phase 6: Polish
- BANNED_WORDS audit
- README / CLAUDE 最終 確認
- AUTO_DEV_LOG.md / STATE.json / root README 更新
- commit + push
