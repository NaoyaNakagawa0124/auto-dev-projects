import XCTest
@testable import TsukueCore

final class TimeFormatTests: XCTestCase {
    func testDurationUnderMinute() {
        XCTAssertEqual(TimeFormat.duration(0), "--")
        XCTAssertEqual(TimeFormat.duration(59), "--")
    }

    func testDurationMinutesOnly() {
        XCTAssertEqual(TimeFormat.duration(60), "1m")
        XCTAssertEqual(TimeFormat.duration(2700), "45m")
        XCTAssertEqual(TimeFormat.duration(3599), "59m")
    }

    func testDurationHoursAndMinutes() {
        XCTAssertEqual(TimeFormat.duration(3600), "1h 00m")
        XCTAssertEqual(TimeFormat.duration(3600 + 7 * 60), "1h 07m")
        XCTAssertEqual(TimeFormat.duration(2 * 3600 + 45 * 60), "2h 45m")
        XCTAssertEqual(TimeFormat.duration(10 * 3600 + 5 * 60), "10h 05m")
    }

    func testHourMinuteJST() {
        // 2026-05-17 05:32 UTC = 14:32 JST
        let d = Date(timeIntervalSince1970: TimeInterval(1_778_995_920))
        let s = TimeFormat.hourMinute(d)
        XCTAssertEqual(s, "14:32")
    }

    func testDateOnlyJST() {
        // 2026-05-16 23:30 UTC = 2026-05-17 08:30 JST
        let d = Date(timeIntervalSince1970: TimeInterval(1_778_974_200))
        let s = TimeFormat.dateOnly(d)
        XCTAssertEqual(s, "2026-05-17")
    }

    func testStartOfDayJST() {
        // 2026-05-17 14:32 JST -> 2026-05-17 00:00 JST = 2026-05-16 15:00 UTC
        let d = Date(timeIntervalSince1970: TimeInterval(1_778_995_920))
        let start = TimeFormat.startOfDayJST(d)
        let f = DateFormatter()
        f.dateFormat = "yyyy-MM-dd HH:mm"
        f.timeZone = TimeZone(identifier: "Asia/Tokyo")
        XCTAssertEqual(f.string(from: start), "2026-05-17 00:00")
    }

    func testMonthRangeJST() {
        // 2026-05-17 JST
        let d = Date(timeIntervalSince1970: TimeInterval(1_778_995_920))
        let r = TimeFormat.monthRangeJST(d)
        let f = DateFormatter()
        f.dateFormat = "yyyy-MM-dd"
        f.timeZone = TimeZone(identifier: "Asia/Tokyo")
        XCTAssertEqual(f.string(from: r.start), "2026-05-01")
        XCTAssertEqual(f.string(from: r.nextStart), "2026-06-01")
    }

    func testYearMonth() {
        let d = Date(timeIntervalSince1970: TimeInterval(1_778_995_920))
        XCTAssertEqual(TimeFormat.yearMonth(d), "2026-05")
    }

    func testWeekdayLabel() {
        // 2026-05-17 は 日曜
        let d = Date(timeIntervalSince1970: TimeInterval(1_778_995_920))
        let s = TimeFormat.dateWithWeekday(d)
        XCTAssertEqual(s, "2026-05-17 Sun")
    }
}
