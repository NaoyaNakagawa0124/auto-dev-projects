import XCTest
@testable import TsukueCore

final class TableViewTests: XCTestCase {
    let mayMorning = Date(timeIntervalSince1970: 1_778_976_000)
    let mayLater = Date(timeIntervalSince1970: 1_778_995_920)

    func makeSession(_ client: String, _ task: String?, start: Date, durationSec: Int? = 3600) -> Session {
        Session(client: client, task: task, startedAt: start,
                endedAt: durationSec.map { start.addingTimeInterval(TimeInterval($0)) })
    }

    func testDayLinesPresent() {
        let s = makeSession("acme", "ロゴ", start: mayMorning)
        let lines = TableView.dayLines([s], now: mayMorning.addingTimeInterval(3600))
        XCTAssertEqual(lines.count, 1)
        XCTAssertTrue(lines[0].contains("acme"))
        XCTAssertTrue(lines[0].contains("ロゴ"))
        XCTAssertTrue(lines[0].contains("1h 00m"))
    }

    func testRunningSessionShownWithEllipsis() {
        let s = makeSession("x", nil, start: mayMorning, durationSec: nil)
        let lines = TableView.dayLines([s], now: mayMorning.addingTimeInterval(600))
        XCTAssertEqual(lines.count, 1)
        XCTAssertTrue(lines[0].contains("…"))
    }

    func testTotalLineSumsCorrectly() {
        let a = makeSession("a", nil, start: mayMorning, durationSec: 3600)
        let b = makeSession("b", nil, start: mayLater, durationSec: 1800)
        let line = TableView.totalLine([a, b], now: mayLater.addingTimeInterval(1800))
        XCTAssertTrue(line.contains("合計"))
        XCTAssertTrue(line.contains("1h 30m"))
    }

    func testMultiDayGroupsByDay() {
        // 2026-05-16 22:00 JST vs 2026-05-17 09:00 JST
        let yesterday = Date(timeIntervalSince1970: 1_778_936_400)
        let a = makeSession("a", nil, start: yesterday)
        let b = makeSession("b", nil, start: mayMorning)
        let lines = TableView.multiDayLines([a, b], now: mayMorning.addingTimeInterval(3600))
        let header16 = lines.contains { $0.contains("2026-05-16") }
        let header17 = lines.contains { $0.contains("2026-05-17") }
        XCTAssertTrue(header16)
        XCTAssertTrue(header17)
    }
}
