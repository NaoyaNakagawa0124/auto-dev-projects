# tsukue-no-sumi — Conventions

## トーン (絶対)
- 通知 / リマインド / 「集中 し ましょう」 系 は 全部 NG
- 「連勝」 「ストリーク」 「達成 度」 「集中 度 %」 を 出さ ない
- 数字 は 時間 と 金額 だけ。 「3 連勝」 や 「あなた は 上位 12%」 を 絶対 出さ ない
- ねぎらい は 「お疲れ さま」 「いい 1 日 でした ね」 程度 まで。 「すごい!」 や 「最高!」 は 過剰
- BANNED_WORDS: 「連勝」 「ストリーク」 「達成 度」 「集中 度」 「効率」 「サボり」 「怠ける」 「もっと」 「頑張れ」 「神」 (神社 は OK な ので 「神 レベル」 を 単語 単位 で 弾く)

## Swift スタイル
- Swift 5.9+, macOS 13+
- struct を 第一 選択、 class は 必要 な とき だけ
- 純ロジック (TsukueCore) と CLI 入出力 (tsukue) は 完全 分離
- `Foundation` の `Date` / `JSONEncoder` / `FileManager` を 使う
- `print` は CLI 層 だけ、 ロジック 層 は 値 を 返す
- 例外 は `throws` + `enum TsukueError: Error`、 try? で 握り潰さ ない
- 日付 表示 は JST (`TimeZone(identifier: "Asia/Tokyo")`)、 保存 は UTC ISO8601

## CLI 仕様
- exit code 0 = 正常、 1 = 内部 エラー、 2 = 引数 エラー
- `--help` / `-h` で 使い方、 `--version` / `-v` で バージョン
- ない 引数 や 不明 な サブコマンド は exit 2 で エラー メッセージ + 簡易 ヘルプ
- カラー 出力 は ANSI エスケープ で 軽く、 `NO_COLOR` 環境変数 で 無効化
- 進行中 セッション の 二重 start は エラー (確認 を 求める)
- データ ファイル パス は 環境変数 `TSUKUE_DATA` で 上書き 可能 (テスト用)

## データ
```swift
struct Session: Codable, Equatable {
    let id: UUID
    let client: String       // クライアント 名、 任意 文字 (空 は NG)
    let task: String?        // 任意 メモ、 nil OK
    let startedAt: Date
    var endedAt: Date?       // nil なら 進行中
}

struct SessionStore: Codable {
    var sessions: [Session]
}
```

## 表示 ルール
- 時間 は `1h 07m` 形式 (1 時間 7 分)
- 1 時間 未満 は `45m`、 1 分 未満 は `--`
- 表 の 列幅 は client 12、 task 24 で padding、 はみ 出し は `…`
- 日本語 は CJK 2 字幅 と して 計算 (Swift String.count で は なく Locale 依存)
- 月次 レポート の Markdown は シンプル な テーブル、 そのまま 請求書 に 貼れる

## テスト
- XCTest only、 TsukueCore 100% カバー を 目指す
- CLI は smoke build (swift build) で 確認、 unit test は 書か ない
- 時刻 依存 テスト は `Date(timeIntervalSince1970:)` で 固定
- ファイル I/O テスト は `FileManager.default.temporaryDirectory` で 隔離

## やら ない こと
- メニュー バー アプリ 化 (SwiftUI/AppKit) は スコープ 外、 別 プロジェクト
- クラウド 同期、 アカウント、 ログイン は なし
- 通知 (`NSUserNotification`, `UNUserNotificationCenter`) は 使わ ない
- アナリティクス、 テレメトリ、 ログ 送信 は ゼロ
