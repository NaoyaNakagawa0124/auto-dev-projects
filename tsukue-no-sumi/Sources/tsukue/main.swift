import Foundation
import TsukueCore

let VERSION = "0.1.0"

let argv = CommandLine.arguments
let args = Array(argv.dropFirst())

func printErr(_ s: String) {
    if let data = (s + "\n").data(using: .utf8) {
        FileHandle.standardError.write(data)
    }
}

let useColor: Bool = {
    if ProcessInfo.processInfo.environment["NO_COLOR"] != nil { return false }
    return isatty(fileno(stdout)) != 0
}()

func paint(_ s: String, _ code: String) -> String {
    if !useColor { return s }
    return "\u{001B}[\(code)m\(s)\u{001B}[0m"
}
func dim(_ s: String) -> String { paint(s, "2") }
func cyan(_ s: String) -> String { paint(s, "36") }
func yellow(_ s: String) -> String { paint(s, "33") }
func green(_ s: String) -> String { paint(s, "32") }
func bold(_ s: String) -> String { paint(s, "1") }

func usage() -> String {
    return """
    机 の 隅 (tsukue-no-sumi)  v\(VERSION)
      カフェ で 作業 する 人 の ため の、 そっと いる ログ。

    \(bold("コマンド"))
      tsukue start <client> [task]     作業 開始 を 記録
      tsukue stop                       進行中 を 終わら せる
      tsukue cancel                     進行中 を 破棄
      tsukue status                     今 の 状況 を 1 行
      tsukue today                      今日 の セッション
      tsukue list [--days N]            直近 N 日 (デフォルト 7)
      tsukue month [--copy]             今月 の Markdown レポート
      tsukue forget [--yes]             全 データ を 削除
      tsukue --help                     この ヘルプ
      tsukue --version                  バージョン

    \(bold("環境変数"))
      TSUKUE_DATA   データ ファイル パス (デフォルト ~/.tsukue-no-sumi/sessions.json)
      NO_COLOR      設定 すれば 色 を 出さ ない
    """
}

let storePath = SessionStore.defaultPath()
let store = SessionStore(path: storePath)

guard let first = args.first else {
    print(usage())
    exit(0)
}

do {
    switch first {
    case "--help", "-h", "help":
        print(usage())
    case "--version", "-v", "version":
        print("tsukue-no-sumi \(VERSION)")
    case "start":
        try runStart(Array(args.dropFirst()))
    case "stop":
        try runStop()
    case "cancel":
        try runCancel()
    case "status":
        try runStatus()
    case "today":
        try runToday()
    case "list":
        try runList(Array(args.dropFirst()))
    case "month":
        try runMonth(Array(args.dropFirst()))
    case "forget":
        try runForget(Array(args.dropFirst()))
    default:
        printErr("わから ない コマンド: \(first)")
        printErr("")
        printErr(usage())
        exit(2)
    }
} catch let e as TsukueError {
    printErr("× \(e.description)")
    switch e {
    case .invalidArgument:
        exit(2)
    default:
        exit(1)
    }
} catch {
    printErr("× 想定外 の エラー: \(error.localizedDescription)")
    exit(1)
}

// MARK: - commands

func runStart(_ rest: [String]) throws {
    guard let client = rest.first else {
        throw TsukueError.invalidArgument("使い方: tsukue start <client> [task]")
    }
    let task = rest.dropFirst().joined(separator: " ").trimmingCharacters(in: .whitespacesAndNewlines)
    let s = try store.start(client: client, task: task.isEmpty ? nil : task)
    let when = TimeFormat.hourMinute(s.startedAt)
    let taskPart = s.task.map { " / \($0)" } ?? ""
    print("机 の 隅 に 置いた。  " + cyan(s.client) + dim(taskPart) + "  " + dim("(\(when))"))
}

func runStop() throws {
    let s = try store.stop()
    let dur = TimeFormat.duration(s.durationSeconds())
    print(green("お疲れ さま。") + "  " + bold(dur) + dim("  \(s.client)"))
}

func runCancel() throws {
    let s = try store.cancel()
    print(dim("セッション を 破棄 しました。  \(s.client)"))
}

func runStatus() throws {
    let sessions = try store.load()
    if let r = try store.runningSession(in: sessions) {
        let from = TimeFormat.hourMinute(r.startedAt)
        let dur = TimeFormat.duration(r.durationSeconds())
        let taskPart = r.task.map { " / \($0)" } ?? ""
        print(cyan("● 進行中") + "  " + bold(r.client) + dim(taskPart) + "  " + dim("\(from) から  経過 \(dur)"))
    } else {
        print(dim("○ 進行中 の セッション は ありません。"))
    }
}

func runToday() throws {
    let now = Date()
    let sessions = try store.load()
    let today = Aggregator.sessionsOnDay(sessions, day: now, now: now)
    print(bold(TimeFormat.dateWithWeekday(now)))
    if today.isEmpty {
        print(dim("  今日 は まだ なし。"))
        return
    }
    for line in TableView.dayLines(today, now: now) {
        print(line)
    }
    print(TableView.totalLine(today, now: now))
}

func runList(_ rest: [String]) throws {
    var days = 7
    var i = 0
    while i < rest.count {
        let a = rest[i]
        if a == "--days" {
            i += 1
            guard i < rest.count, let n = Int(rest[i]), n > 0 else {
                throw TsukueError.invalidArgument("--days に は 正 の 整数 を 渡して ください")
            }
            days = n
        } else {
            throw TsukueError.invalidArgument("不明 な 引数: \(a)")
        }
        i += 1
    }
    let now = Date()
    let sessions = try store.load()
    let list = Aggregator.sessionsInLastDays(sessions, days: days, now: now)
    print(bold("直近 \(days) 日"))
    if list.isEmpty {
        print(dim("  なし。"))
        return
    }
    for line in TableView.multiDayLines(list, now: now) {
        print(line)
    }
    let total = Aggregator.totalSeconds(list, now: now)
    print("")
    print(dim("通期 合計  ") + bold(TimeFormat.duration(total)))
}

func runMonth(_ rest: [String]) throws {
    var copy = false
    for a in rest {
        if a == "--copy" { copy = true }
        else { throw TsukueError.invalidArgument("不明 な 引数: \(a)") }
    }
    let now = Date()
    let sessions = try store.load()
    let report = MarkdownReport.month(sessions: sessions, month: now, now: now)
    if copy {
        try pbcopy(report)
        let ym = TimeFormat.yearMonth(now)
        print(green("コピー しました。") + dim("  \(ym) の レポート を Markdown で。"))
    } else {
        print(report)
    }
}

func runForget(_ rest: [String]) throws {
    var skipConfirm = false
    for a in rest {
        if a == "--yes" || a == "-y" { skipConfirm = true }
        else { throw TsukueError.invalidArgument("不明 な 引数: \(a)") }
    }
    if !skipConfirm {
        print(yellow("全 セッション を 消し ます。 よろしい です か? (y/N) "), terminator: "")
        guard let line = readLine() else {
            print(dim("中止 しました。"))
            return
        }
        let ok = line.trimmingCharacters(in: .whitespaces).lowercased()
        if ok != "y" && ok != "yes" {
            print(dim("中止 しました。"))
            return
        }
    }
    try store.forget()
    print(dim("机 を 拭き ました。"))
}

func pbcopy(_ s: String) throws {
    let p = Process()
    p.launchPath = "/usr/bin/pbcopy"
    let pipe = Pipe()
    p.standardInput = pipe
    do {
        try p.run()
    } catch {
        throw TsukueError.ioFailure("pbcopy 起動 失敗: \(error.localizedDescription)")
    }
    if let data = s.data(using: .utf8) {
        pipe.fileHandleForWriting.write(data)
    }
    pipe.fileHandleForWriting.closeFile()
    p.waitUntilExit()
    if p.terminationStatus != 0 {
        throw TsukueError.ioFailure("pbcopy が status \(p.terminationStatus) で 終了")
    }
}
