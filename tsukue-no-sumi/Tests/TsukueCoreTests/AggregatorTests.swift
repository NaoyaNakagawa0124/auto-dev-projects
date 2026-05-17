import XCTest
@testable import TsukueCore

final class AggregatorTests: XCTestCase {
    /// 2026-05-17 14:32 JST
    let mayLater = Date(timeIntervalSince1970: 1_778_995_920)
    /// 2026-05-17 09:00 JST
    let mayMorning = Date(timeIntervalSince1970: 1_778_976_000)
    /// 2026-05-16 22:00 JST
    let mayDayBefore = Date(timeIntervalSince1970: 1_778_936_400)
    /// 2026-04-30 23:00 JST
    let aprLate = Date(timeIntervalSince1970: 1_777_557_600)

    func makeSession(_ client: String, start: Date, durationSec: Int? = 3600) -> Session {
        Session(client: client,
                task: nil,
                startedAt: start,
                endedAt: durationSec.map { start.addingTimeInterval(TimeInterval($0)) })
    }

    func testSessionsOnDay() {
        let now = mayLater
        let all = [
            makeSession("a", start: mayMorning),
            makeSession("b", start: mayLater),
            makeSession("c", start: mayDayBefore),
            makeSession("d", start: aprLate)
        ]
        let today = Aggregator.sessionsOnDay(all, day: mayLater, now: now)
        XCTAssertEqual(today.map(\.client), ["a", "b"])
    }

    func testSessionsOnDaySortedByStart() {
        let all = [
            makeSession("late", start: mayLater),
            makeSession("morning", start: mayMorning)
        ]
        let today = Aggregator.sessionsOnDay(all, day: mayLater, now: mayLater)
        XCTAssertEqual(today.map(\.client), ["morning", "late"])
    }

    func testSessionsInLastDaysIncludesToday() {
        let all = [
            makeSession("today", start: mayLater),
            makeSession("yesterday", start: mayDayBefore),
            makeSession("ancient", start: aprLate)
        ]
        let result = Aggregator.sessionsInLastDays(all, days: 2, now: mayLater)
        XCTAssertEqual(Set(result.map(\.client)), ["today", "yesterday"])
    }

    func testSessionsInLastDaysClampsLow() {
        let all = [makeSession("today", start: mayLater)]
        let r = Aggregator.sessionsInLastDays(all, days: 0, now: mayLater)
        XCTAssertEqual(r.count, 1)
    }

    func testSessionsInMonth() {
        let all = [
            makeSession("may1", start: mayMorning),
            makeSession("may2", start: mayLater),
            makeSession("apr", start: aprLate)
        ]
        let r = Aggregator.sessionsInMonth(all, month: mayLater)
        XCTAssertEqual(Set(r.map(\.client)), ["may1", "may2"])
    }

    func testTotalByClient() {
        let all = [
            makeSession("acme", start: mayMorning, durationSec: 3600),
            makeSession("acme", start: mayLater, durationSec: 1800),
            makeSession("self", start: mayMorning, durationSec: 7200)
        ]
        let totals = Aggregator.totalByClient(all)
        XCTAssertEqual(totals.first?.client, "self")
        XCTAssertEqual(totals.first?.seconds, 7200)
        XCTAssertEqual(totals.last?.client, "acme")
        XCTAssertEqual(totals.last?.seconds, 5400)
    }

    func testTotalSecondsIgnoresRunningWithoutNow() {
        let s1 = makeSession("a", start: mayMorning, durationSec: 3600)
        let s2 = makeSession("b", start: mayLater, durationSec: nil)
        // running session uses `now` so we pass exactly its start → 0
        let total = Aggregator.totalSeconds([s1, s2], now: mayLater)
        XCTAssertEqual(total, 3600)
    }

    func testEmptySessions() {
        XCTAssertEqual(Aggregator.totalSeconds([], now: mayLater), 0)
        XCTAssertTrue(Aggregator.totalByClient([], now: mayLater).isEmpty)
    }
}
