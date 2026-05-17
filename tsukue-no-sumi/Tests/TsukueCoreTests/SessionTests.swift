import XCTest
@testable import TsukueCore

final class SessionTests: XCTestCase {
    func testIsRunning() {
        let s = Session(client: "acme")
        XCTAssertTrue(s.isRunning)
        var s2 = s
        s2.endedAt = s.startedAt.addingTimeInterval(60)
        XCTAssertFalse(s2.isRunning)
    }

    func testDurationSecondsRunning() {
        let start = Date(timeIntervalSince1970: 1_715_000_000)
        let now = start.addingTimeInterval(125)
        let s = Session(client: "x", startedAt: start)
        XCTAssertEqual(s.durationSeconds(now: now), 125)
    }

    func testDurationSecondsCompleted() {
        let start = Date(timeIntervalSince1970: 1_715_000_000)
        let end = start.addingTimeInterval(3 * 3600 + 27 * 60)
        let s = Session(client: "x", startedAt: start, endedAt: end)
        XCTAssertEqual(s.durationSeconds(now: Date()), 3 * 3600 + 27 * 60)
    }

    func testDurationNotNegative() {
        let start = Date(timeIntervalSince1970: 1_715_000_000)
        let earlier = start.addingTimeInterval(-100)
        let s = Session(client: "x", startedAt: start)
        XCTAssertEqual(s.durationSeconds(now: earlier), 0)
    }

    func testCodableRoundTrip() throws {
        let original = Session(
            client: "acme-corp",
            task: "ランディング 微調整",
            startedAt: Date(timeIntervalSince1970: 1_715_000_000),
            endedAt: Date(timeIntervalSince1970: 1_715_003_600)
        )
        let enc = JSONEncoder()
        enc.dateEncodingStrategy = .iso8601
        let data = try enc.encode(original)
        let dec = JSONDecoder()
        dec.dateDecodingStrategy = .iso8601
        let decoded = try dec.decode(Session.self, from: data)
        XCTAssertEqual(decoded, original)
    }
}
