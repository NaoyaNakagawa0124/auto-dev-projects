import XCTest
@testable import BugZumou

@MainActor
final class GameStateTests: XCTestCase {
    private func freshDefaults() -> UserDefaults {
        let suite = "bugzumou.tests.\(UUID().uuidString)"
        let d = UserDefaults(suiteName: suite)!
        d.removePersistentDomain(forName: suite)
        return d
    }

    func testInitialState() {
        let g = GameState(defaults: freshDefaults())
        XCTAssertEqual(g.streak, 0)
        XCTAssertEqual(g.careerBest, 0)
        XCTAssertEqual(g.totalMatches, 0)
        XCTAssertEqual(g.totalWins, 0)
        XCTAssertEqual(g.rank, .jonokuchi)
        if case .idle = g.phase { /* ok */ } else {
            XCTFail("expected idle, got \(g.phase)")
        }
    }

    func testStartMatchTransitionsToPlayingAndPicksPuzzle() {
        let g = GameState(defaults: freshDefaults())
        g.startMatch()
        XCTAssertNotNil(g.puzzle)
        if case .playing = g.phase { /* ok */ } else {
            XCTFail("expected playing, got \(g.phase)")
        }
    }

    func testCorrectPickIncrementsStreakAndUpdatesRank() {
        let g = GameState(defaults: freshDefaults())
        // pick correct lines repeatedly until rank changes
        for _ in 0..<10 {
            g.startMatch()
            let p = g.puzzle!
            g.pickLine(p.buggyLineIndex)
        }
        XCTAssertEqual(g.streak, 10)
        XCTAssertEqual(g.rank, .juryo)
        XCTAssertEqual(g.careerBest, 10)
        XCTAssertEqual(g.totalWins, 10)
        XCTAssertEqual(g.totalMatches, 10)
    }

    func testWrongPickResetsStreakButPreservesCareerBest() {
        let g = GameState(defaults: freshDefaults())
        for _ in 0..<5 {
            g.startMatch()
            g.pickLine(g.puzzle!.buggyLineIndex)
        }
        XCTAssertEqual(g.streak, 5)
        XCTAssertEqual(g.careerBest, 5)

        g.startMatch()
        let p = g.puzzle!
        let wrong = (p.buggyLineIndex + 1) % p.lines.count
        XCTAssertNotEqual(wrong, p.buggyLineIndex)
        g.pickLine(wrong)
        XCTAssertEqual(g.streak, 0)
        XCTAssertEqual(g.careerBest, 5, "career best preserved across loss")
        XCTAssertEqual(g.totalMatches, 6)
        XCTAssertEqual(g.totalWins, 5)
        if case .revealing(.loss) = g.phase { /* ok */ } else {
            XCTFail("expected revealing loss, got \(g.phase)")
        }
    }

    func testCancelToIdleFromPlaying() {
        let g = GameState(defaults: freshDefaults())
        g.startMatch()
        g.cancelToIdle()
        if case .idle = g.phase { /* ok */ } else { XCTFail("expected idle") }
        XCTAssertNil(g.puzzle)
    }

    func testStreakPersistsAcrossInstances() {
        let suite = "bugzumou.persist.\(UUID().uuidString)"
        let d = UserDefaults(suiteName: suite)!
        defer { d.removePersistentDomain(forName: suite) }

        let g = GameState(defaults: d)
        for _ in 0..<3 {
            g.startMatch()
            g.pickLine(g.puzzle!.buggyLineIndex)
        }
        XCTAssertEqual(g.streak, 3)

        let g2 = GameState(defaults: d)
        XCTAssertEqual(g2.streak, 3)
        XCTAssertEqual(g2.careerBest, 3)
        XCTAssertEqual(g2.rank, .sandanme)
    }

    func testPickPuzzleAvoidsRecentlySeen() {
        let g = GameState(defaults: freshDefaults())
        // Pre-load every-but-one ID into recents
        let lastID = Corpus.all.last!.id
        for p in Corpus.all where p.id != lastID {
            g._testRecordRecent(p.id)
        }
        // recents holds at most 6, so older IDs were trimmed; only most-recent
        // 6 are blocked. Run pickPuzzle many times; we should still see the
        // unblocked last ID at least once.
        var rng = SystemRandomNumberGenerator()
        var seen = Set<String>()
        for _ in 0..<60 {
            seen.insert(g.pickPuzzle(rng: &rng).id)
        }
        XCTAssertTrue(seen.contains(lastID))
    }

    func testResetClearsEverything() {
        let g = GameState(defaults: freshDefaults())
        for _ in 0..<2 {
            g.startMatch()
            g.pickLine(g.puzzle!.buggyLineIndex)
        }
        XCTAssertEqual(g.streak, 2)
        g.reset()
        XCTAssertEqual(g.streak, 0)
        XCTAssertEqual(g.careerBest, 0)
        XCTAssertEqual(g.totalMatches, 0)
        XCTAssertEqual(g.totalWins, 0)
        XCTAssertNil(g.puzzle)
    }
}
