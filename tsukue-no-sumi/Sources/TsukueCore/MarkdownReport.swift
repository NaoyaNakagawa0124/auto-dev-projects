import Foundation

public enum MarkdownReport {
    /// 月次 レポート を Markdown で
    public static func month(sessions: [Session], month: Date, now: Date = Date()) -> String {
        let ym = TimeFormat.yearMonth(month)
        let filtered = Aggregator.sessionsInMonth(sessions, month: month)
        var lines: [String] = []
        lines.append("# 作業 ログ — \(ym)")
        lines.append("")
        if filtered.isEmpty {
            lines.append("_この 月 の セッション は ありません。_")
            return lines.joined(separator: "\n") + "\n"
        }

        // クライアント 別 サマリー
        let totals = Aggregator.totalByClient(filtered, now: now)
        let grand = Aggregator.totalSeconds(filtered, now: now)
        lines.append("## クライアント 別")
        lines.append("")
        lines.append("| クライアント | 合計 |")
        lines.append("|---|---:|")
        for t in totals {
            lines.append("| \(escape(t.client)) | \(TimeFormat.duration(t.seconds)) |")
        }
        lines.append("| **合計** | **\(TimeFormat.duration(grand))** |")
        lines.append("")

        // 日 別 明細
        lines.append("## 日 別 明細")
        lines.append("")
        lines.append("| 日付 | 開始 | 終了 | クライアント | タスク | 時間 |")
        lines.append("|---|---|---|---|---|---:|")
        for s in filtered {
            let date = TimeFormat.dateOnly(s.startedAt)
            let from = TimeFormat.hourMinute(s.startedAt)
            let to = s.endedAt.map { TimeFormat.hourMinute($0) } ?? "進行中"
            let task = s.task ?? "-"
            let dur = TimeFormat.duration(s.durationSeconds(now: now))
            lines.append("| \(date) | \(from) | \(to) | \(escape(s.client)) | \(escape(task)) | \(dur) |")
        }
        lines.append("")
        return lines.joined(separator: "\n") + "\n"
    }

    /// Markdown テーブル の `|` を エスケープ
    private static func escape(_ s: String) -> String {
        s.replacingOccurrences(of: "|", with: "\\|")
    }
}
