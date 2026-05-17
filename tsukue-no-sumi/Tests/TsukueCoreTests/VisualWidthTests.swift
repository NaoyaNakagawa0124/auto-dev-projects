import XCTest
@testable import TsukueCore

final class VisualWidthTests: XCTestCase {
    func testAsciiWidth() {
        XCTAssertEqual(VisualWidth.of("hello"), 5)
        XCTAssertEqual(VisualWidth.of(""), 0)
    }

    func testJapaneseWidth() {
        XCTAssertEqual(VisualWidth.of("こんにちは"), 10)
        XCTAssertEqual(VisualWidth.of("漢字"), 4)
        XCTAssertEqual(VisualWidth.of("カフェ"), 6)
    }

    func testMixed() {
        XCTAssertEqual(VisualWidth.of("acme コーポ"), 5 + 6)
    }

    func testPadAscii() {
        XCTAssertEqual(VisualWidth.of(VisualWidth.padOrTruncate("hi", width: 5)), 5)
    }

    func testPadJapanese() {
        let out = VisualWidth.padOrTruncate("漢字", width: 10)
        XCTAssertEqual(VisualWidth.of(out), 10)
    }

    func testTruncateAscii() {
        let out = VisualWidth.padOrTruncate("hello world", width: 6)
        XCTAssertEqual(VisualWidth.of(out), 6)
        XCTAssertTrue(out.hasSuffix("…"))
    }

    func testTruncateJapanese() {
        let out = VisualWidth.padOrTruncate("こんにちは世界", width: 6)
        XCTAssertEqual(VisualWidth.of(out), 6)
        XCTAssertTrue(out.contains("…"))
    }

    func testExactFit() {
        let s = "hello"
        XCTAssertEqual(VisualWidth.padOrTruncate(s, width: 5), s)
    }
}
