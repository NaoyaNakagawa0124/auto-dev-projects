import Foundation

public enum TableView {
    /// 1 日 の セッション を 表 で 整形 (ヘッダー 含まず)
    public static func dayLines(_ sessions: [Session], now: Date = Date()) -> [String] {
        var lines: [String] = []
        let clientW = 10
        let taskW = 22
        for s in sessions {
            let from = TimeFormat.hourMinute(s.startedAt)
            let to = s.endedAt.map { TimeFormat.hourMinute($0) } ?? "  …  "
            let client = VisualWidth.padOrTruncate(s.client, width: clientW)
            let task = VisualWidth.padOrTruncate(s.task ?? "-", width: taskW)
            let dur = TimeFormat.duration(s.durationSeconds(now: now))
            lines.append("  \(from)-\(to)  \(client)  \(task)  \(dur)")
        }
        return lines
    }

    /// 日 の 合計 行
    public static func totalLine(_ sessions: [Session], now: Date = Date()) -> String {
        let total = Aggregator.totalSeconds(sessions, now: now)
        let label = "合計"
        // 表 の 右側 に 揃える 計算: prefix space + "HH:mm-HH:mm" (11) + 2 spaces + clientW(10) + 2 + taskW(22) + 2
        // = 2 + 11 + 2 + 10 + 2 + 22 + 2 = 51 - "合計" の 視覚 幅 (4)
        let leftPad = 51 - VisualWidth.of(label)
        let pad = String(repeating: " ", count: max(1, leftPad))
        return "\(pad)\(label)   \(TimeFormat.duration(total))"
    }

    /// 複数日 を 日付 ごと に グループ し、 表 を つくる
    public static func multiDayLines(_ sessions: [Session], now: Date = Date()) -> [String] {
        var cal = Calendar(identifier: .gregorian)
        cal.timeZone = TimeZone(identifier: "Asia/Tokyo")!
        var grouped: [(day: Date, list: [Session])] = []
        for s in sessions {
            let day = cal.startOfDay(for: s.startedAt)
            if let i = grouped.firstIndex(where: { $0.day == day }) {
                grouped[i].list.append(s)
            } else {
                grouped.append((day, [s]))
            }
        }
        grouped.sort { $0.day < $1.day }

        var lines: [String] = []
        for (i, group) in grouped.enumerated() {
            if i > 0 { lines.append("") }
            lines.append(TimeFormat.dateWithWeekday(group.day))
            lines.append(contentsOf: dayLines(group.list, now: now))
            lines.append(totalLine(group.list, now: now))
        }
        return lines
    }
}
