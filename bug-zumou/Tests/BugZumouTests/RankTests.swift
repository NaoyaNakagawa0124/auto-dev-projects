import XCTest
@testable import BugZumou

final class RankTests: XCTestCase {
    func testRankAtZeroStreakIsJonokuchi() {
        XCTAssertEqual(Rank.forStreak(0), .jonokuchi)
    }

    func testRankAtThresholdsExact() {
        XCTAssertEqual(Rank.forStreak(1),  .jonidan)
        XCTAssertEqual(Rank.forStreak(3),  .sandanme)
        XCTAssertEqual(Rank.forStreak(6),  .makushita)
        XCTAssertEqual(Rank.forStreak(10), .juryo)
        XCTAssertEqual(Rank.forStreak(15), .maegashira)
        XCTAssertEqual(Rank.forStreak(22), .komusubi)
        XCTAssertEqual(Rank.forStreak(30), .sekiwake)
        XCTAssertEqual(Rank.forStreak(40), .ozeki)
        XCTAssertEqual(Rank.forStreak(55), .yokozuna)
    }

    func testRankBetweenThresholds() {
        XCTAssertEqual(Rank.forStreak(2),  .jonidan)
        XCTAssertEqual(Rank.forStreak(5),  .sandanme)
        XCTAssertEqual(Rank.forStreak(9),  .makushita)
        XCTAssertEqual(Rank.forStreak(14), .juryo)
        XCTAssertEqual(Rank.forStreak(50), .ozeki)
    }

    func testRankIsCappedAtYokozuna() {
        XCTAssertEqual(Rank.forStreak(100),  .yokozuna)
        XCTAssertEqual(Rank.forStreak(9999), .yokozuna)
    }

    func testRankOrderingMatchesThresholds() {
        let ordered = Rank.allCases.sorted { $0.threshold < $1.threshold }
        XCTAssertEqual(ordered, Rank.allCases)
    }
}
