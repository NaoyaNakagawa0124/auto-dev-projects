import Foundation

public enum Aggregator {
    /// 指定 日 (JST) の セッション を 開始 時刻 順 で
    public static func sessionsOnDay(_ sessions: [Session], day: Date, now: Date = Date()) -> [Session] {
        let start = TimeFormat.startOfDayJST(day)
        var cal = Calendar(identifier: .gregorian)
        cal.timeZone = TimeZone(identifier: "Asia/Tokyo")!
        let nextStart = cal.date(byAdding: .day, value: 1, to: start)!
        _ = now
        return sessions
            .filter { s in
                s.startedAt >= start && s.startedAt < nextStart
            }
            .sorted { $0.startedAt < $1.startedAt }
    }

    /// 直近 N 日 (今日 含む)
    public static func sessionsInLastDays(_ sessions: [Session], days: Int, now: Date = Date()) -> [Session] {
        let n = max(1, days)
        var cal = Calendar(identifier: .gregorian)
        cal.timeZone = TimeZone(identifier: "Asia/Tokyo")!
        let todayStart = TimeFormat.startOfDayJST(now)
        let from = cal.date(byAdding: .day, value: -(n - 1), to: todayStart)!
        return sessions
            .filter { $0.startedAt >= from }
            .sorted { $0.startedAt < $1.startedAt }
    }

    /// 指定 月 の セッション (JST 月境界)
    public static func sessionsInMonth(_ sessions: [Session], month: Date) -> [Session] {
        let range = TimeFormat.monthRangeJST(month)
        return sessions
            .filter { $0.startedAt >= range.start && $0.startedAt < range.nextStart }
            .sorted { $0.startedAt < $1.startedAt }
    }

    /// client ごと の 合計 秒
    public static func totalByClient(_ sessions: [Session], now: Date = Date()) -> [(client: String, seconds: Int)] {
        var map: [String: Int] = [:]
        for s in sessions {
            map[s.client, default: 0] += s.durationSeconds(now: now)
        }
        return map
            .map { (client: $0.key, seconds: $0.value) }
            .sorted { $0.seconds > $1.seconds }
    }

    /// 全 合計 秒
    public static func totalSeconds(_ sessions: [Session], now: Date = Date()) -> Int {
        sessions.reduce(0) { $0 + $1.durationSeconds(now: now) }
    }
}
