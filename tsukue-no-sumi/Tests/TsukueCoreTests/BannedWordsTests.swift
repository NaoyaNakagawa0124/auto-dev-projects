import XCTest
@testable import TsukueCore

final class BannedWordsTests: XCTestCase {
    func testFindHit() {
        XCTAssertEqual(BannedWords.find(in: "今日 は 3 連勝!"), "連勝")
        XCTAssertEqual(BannedWords.find(in: "効率 を 上げよう"), "効率")
    }

    func testFindMiss() {
        XCTAssertNil(BannedWords.find(in: "お疲れ さま"))
        XCTAssertNil(BannedWords.find(in: "机 の 隅"))
    }

    func testShrineDoesNotMatch() {
        // 「神」 単独 で 弾かない こと (「神社」 など 巻き込み を 避ける)
        XCTAssertNil(BannedWords.find(in: "近所 の 神社 で 休憩"))
        XCTAssertNil(BannedWords.find(in: "神田 の カフェ"))
    }

    func testNeuLevelHit() {
        XCTAssertNotNil(BannedWords.find(in: "今日 は 神 レベル の 集中"))
        XCTAssertNotNil(BannedWords.find(in: "神レベル の 効率"))
    }

    func testAuditAll() {
        let hits = BannedWords.auditAll([
            "お疲れ さま",
            "連勝 中",
            "コーヒー を 飲む"
        ])
        XCTAssertEqual(hits.count, 1)
        XCTAssertEqual(hits.first?.hit, "連勝")
    }

    func testSourceResourcesAreClean() {
        // CLI / コア に 「人 が 読む 文字列」 が NG ワード を 含まない こと
        let strings = [
            "机 の 隅 (tsukue-no-sumi)",
            "机 の 隅 に 置いた。",
            "お疲れ さま。",
            "○ 進行中 の セッション は ありません。",
            "● 進行中",
            "セッション を 破棄 しました。",
            "机 を 拭き ました。",
            "コピー しました。",
            "今日 は まだ なし。"
        ]
        let hits = BannedWords.auditAll(strings)
        XCTAssertTrue(hits.isEmpty, "ヒット: \(hits)")
    }
}
