import Foundation

public enum TimeFormat {
    /// 1h 07m / 45m / -- 形式 へ
    public static func duration(_ seconds: Int) -> String {
        if seconds < 60 { return "--" }
        let h = seconds / 3600
        let m = (seconds % 3600) / 60
        if h == 0 { return "\(m)m" }
        return String(format: "%dh %02dm", h, m)
    }

    /// HH:mm 形式 (JST)
    public static func hourMinute(_ date: Date) -> String {
        let f = DateFormatter()
        f.dateFormat = "HH:mm"
        f.timeZone = TimeZone(identifier: "Asia/Tokyo")
        return f.string(from: date)
    }

    /// yyyy-MM-dd 形式 (JST)
    public static func dateOnly(_ date: Date) -> String {
        let f = DateFormatter()
        f.dateFormat = "yyyy-MM-dd"
        f.timeZone = TimeZone(identifier: "Asia/Tokyo")
        return f.string(from: date)
    }

    /// yyyy-MM-dd EEE (例: 2026-05-17 Sat)
    public static func dateWithWeekday(_ date: Date) -> String {
        let f = DateFormatter()
        f.dateFormat = "yyyy-MM-dd EEE"
        f.locale = Locale(identifier: "en_US_POSIX")
        f.timeZone = TimeZone(identifier: "Asia/Tokyo")
        return f.string(from: date)
    }

    /// yyyy-MM (例: 2026-05)
    public static func yearMonth(_ date: Date) -> String {
        let f = DateFormatter()
        f.dateFormat = "yyyy-MM"
        f.timeZone = TimeZone(identifier: "Asia/Tokyo")
        return f.string(from: date)
    }

    /// JST で 今日 の 0:00 を 返す
    public static func startOfDayJST(_ date: Date) -> Date {
        var cal = Calendar(identifier: .gregorian)
        cal.timeZone = TimeZone(identifier: "Asia/Tokyo")!
        return cal.startOfDay(for: date)
    }

    /// JST で 月初 と 翌月初 を 返す
    public static func monthRangeJST(_ date: Date) -> (start: Date, nextStart: Date) {
        var cal = Calendar(identifier: .gregorian)
        cal.timeZone = TimeZone(identifier: "Asia/Tokyo")!
        let comps = cal.dateComponents([.year, .month], from: date)
        let start = cal.date(from: comps)!
        let nextStart = cal.date(byAdding: .month, value: 1, to: start)!
        return (start, nextStart)
    }
}
