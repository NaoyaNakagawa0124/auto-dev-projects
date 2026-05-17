import XCTest
@testable import TsukueCore

final class MarkdownReportTests: XCTestCase {
    let mayLater = Date(timeIntervalSince1970: 1_778_995_920)
    let mayMorning = Date(timeIntervalSince1970: 1_778_976_000)
    let aprLate = Date(timeIntervalSince1970: 1_777_557_600)

    func testEmptyMonth() {
        let md = MarkdownReport.month(sessions: [], month: mayLater)
        XCTAssertTrue(md.contains("# 作業 ログ — 2026-05"))
        XCTAssertTrue(md.contains("セッション は ありません"))
    }

    func testIncludesClientTotals() {
        let sessions = [
            Session(client: "acme", task: "デザイン",
                    startedAt: mayMorning,
                    endedAt: mayMorning.addingTimeInterval(3600)),
            Session(client: "self", task: "副業",
                    startedAt: mayLater,
                    endedAt: mayLater.addingTimeInterval(1800))
        ]
        let md = MarkdownReport.month(sessions: sessions, month: mayLater)
        XCTAssertTrue(md.contains("## クライアント 別"))
        XCTAssertTrue(md.contains("acme"))
        XCTAssertTrue(md.contains("self"))
        XCTAssertTrue(md.contains("1h 00m"))
        XCTAssertTrue(md.contains("30m"))
        XCTAssertTrue(md.contains("**合計**"))
    }

    func testIncludesDayDetails() {
        let s = Session(client: "acme", task: "ロゴ",
                        startedAt: mayMorning,
                        endedAt: mayMorning.addingTimeInterval(3600))
        let md = MarkdownReport.month(sessions: [s], month: mayLater)
        XCTAssertTrue(md.contains("| 日付 | 開始 | 終了"))
        XCTAssertTrue(md.contains("2026-05-17"))
        XCTAssertTrue(md.contains("ロゴ"))
    }

    func testIgnoresOtherMonths() {
        let s = Session(client: "old", task: nil,
                        startedAt: aprLate,
                        endedAt: aprLate.addingTimeInterval(3600))
        let md = MarkdownReport.month(sessions: [s], month: mayLater)
        XCTAssertFalse(md.contains("old"))
    }

    func testEscapesPipeCharacters() {
        let s = Session(client: "a|b", task: "x|y",
                        startedAt: mayMorning,
                        endedAt: mayMorning.addingTimeInterval(60))
        let md = MarkdownReport.month(sessions: [s], month: mayLater)
        XCTAssertTrue(md.contains("a\\|b"))
        XCTAssertTrue(md.contains("x\\|y"))
    }

    func testRunningSessionShownAsProgress() {
        let s = Session(client: "x", task: nil, startedAt: mayMorning)
        let md = MarkdownReport.month(sessions: [s], month: mayLater, now: mayMorning.addingTimeInterval(600))
        XCTAssertTrue(md.contains("進行中"))
    }
}
