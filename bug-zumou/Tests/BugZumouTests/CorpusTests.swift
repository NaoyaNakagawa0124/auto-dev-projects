import XCTest
@testable import BugZumou

final class CorpusTests: XCTestCase {
    func testCorpusIsNotEmpty() {
        XCTAssertGreaterThan(Corpus.all.count, 0)
    }

    func testEveryStableHasAtLeastFourPuzzles() {
        for stable in Stable.allCases {
            let puzzles = Corpus.byStable(stable)
            XCTAssertGreaterThanOrEqual(
                puzzles.count, 4,
                "\(stable.rawValue) needs at least 4 puzzles"
            )
        }
    }

    func testAllPuzzleIDsAreUnique() {
        let ids = Corpus.all.map(\.id)
        XCTAssertEqual(Set(ids).count, ids.count, "Puzzle IDs must be unique")
    }

    func testBuggyLineIndexIsInRange() {
        for p in Corpus.all {
            XCTAssertGreaterThanOrEqual(p.buggyLineIndex, 0, "\(p.id): negative index")
            XCTAssertLessThan(p.buggyLineIndex, p.lines.count, "\(p.id): index past end")
        }
    }

    func testEveryPuzzleHasMinimumStructure() {
        for p in Corpus.all {
            XCTAssertGreaterThanOrEqual(p.lines.count, 2, "\(p.id) has too few lines")
            XCTAssertFalse(p.wrestler.isEmpty, "\(p.id) missing wrestler")
            XCTAssertFalse(p.title.isEmpty, "\(p.id) missing title")
            XCTAssertFalse(p.explanation.isEmpty, "\(p.id) missing explanation")
            XCTAssertFalse(p.language.isEmpty, "\(p.id) missing language")
        }
    }

    func testIsCorrectMatchesIndex() {
        for p in Corpus.all {
            XCTAssertTrue(p.isCorrect(pickedLineIndex: p.buggyLineIndex))
            let other = (p.buggyLineIndex + 1) % p.lines.count
            if other != p.buggyLineIndex {
                XCTAssertFalse(p.isCorrect(pickedLineIndex: other))
            }
        }
    }
}
