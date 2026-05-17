import XCTest
@testable import TsukueCore

final class SessionStoreTests: XCTestCase {
    var tempDir: URL!
    var storePath: URL!
    var store: SessionStore!

    override func setUpWithError() throws {
        tempDir = FileManager.default.temporaryDirectory
            .appendingPathComponent("tsukue-test-\(UUID().uuidString)")
        try FileManager.default.createDirectory(at: tempDir, withIntermediateDirectories: true)
        storePath = tempDir.appendingPathComponent("sessions.json")
        store = SessionStore(path: storePath)
    }

    override func tearDownWithError() throws {
        try? FileManager.default.removeItem(at: tempDir)
    }

    func testLoadMissingFileReturnsEmpty() throws {
        let sessions = try store.load()
        XCTAssertTrue(sessions.isEmpty)
    }

    func testSaveCreatesParentDirectory() throws {
        let nested = tempDir.appendingPathComponent("a/b/c/sessions.json")
        let s = SessionStore(path: nested)
        try s.save([Session(client: "acme")])
        XCTAssertTrue(FileManager.default.fileExists(atPath: nested.path))
    }

    func testSaveAndLoadRoundTrip() throws {
        let one = Session(client: "acme", task: "デザイン",
                          startedAt: Date(timeIntervalSince1970: 1_715_000_000),
                          endedAt: Date(timeIntervalSince1970: 1_715_003_600))
        let two = Session(client: "self", task: nil,
                          startedAt: Date(timeIntervalSince1970: 1_715_010_000))
        try store.save([one, two])
        let loaded = try store.load()
        XCTAssertEqual(loaded, [one, two])
    }

    func testStartCreatesSession() throws {
        let s = try store.start(client: "acme", task: "x",
                                now: Date(timeIntervalSince1970: 1_715_000_000))
        XCTAssertEqual(s.client, "acme")
        XCTAssertEqual(s.task, "x")
        XCTAssertNil(s.endedAt)
        let all = try store.load()
        XCTAssertEqual(all.count, 1)
    }

    func testStartRejectsEmptyClient() {
        XCTAssertThrowsError(try store.start(client: "   ", task: nil)) { err in
            XCTAssertEqual(err as? TsukueError, .emptyClient)
        }
    }

    func testStartRejectsWhenAlreadyRunning() throws {
        _ = try store.start(client: "first", task: nil)
        XCTAssertThrowsError(try store.start(client: "second", task: nil)) { err in
            guard case .alreadyRunning(let c) = err as? TsukueError else {
                return XCTFail("expected alreadyRunning")
            }
            XCTAssertEqual(c, "first")
        }
    }

    func testStartTrimsEmptyTaskToNil() throws {
        let s = try store.start(client: "x", task: "   ")
        XCTAssertNil(s.task)
    }

    func testStopFinishesSession() throws {
        let start = Date(timeIntervalSince1970: 1_715_000_000)
        let end = start.addingTimeInterval(3600)
        _ = try store.start(client: "x", task: nil, now: start)
        let stopped = try store.stop(now: end)
        XCTAssertEqual(stopped.endedAt, end)
        XCTAssertFalse(stopped.isRunning)
    }

    func testStopWithoutRunningThrows() {
        XCTAssertThrowsError(try store.stop()) { err in
            XCTAssertEqual(err as? TsukueError, .nothingRunning)
        }
    }

    func testStopRejectsTimeTravel() throws {
        let start = Date(timeIntervalSince1970: 1_715_000_000)
        _ = try store.start(client: "x", task: nil, now: start)
        XCTAssertThrowsError(try store.stop(now: start.addingTimeInterval(-10))) { err in
            guard case .invalidArgument = err as? TsukueError else {
                return XCTFail("expected invalidArgument")
            }
        }
    }

    func testCancelRemovesRunning() throws {
        _ = try store.start(client: "x", task: nil)
        let cancelled = try store.cancel()
        XCTAssertEqual(cancelled.client, "x")
        XCTAssertTrue(try store.load().isEmpty)
    }

    func testCancelWithoutRunningThrows() {
        XCTAssertThrowsError(try store.cancel()) { err in
            XCTAssertEqual(err as? TsukueError, .nothingRunning)
        }
    }

    func testRunningSession() throws {
        XCTAssertNil(try store.runningSession())
        _ = try store.start(client: "x", task: nil)
        XCTAssertNotNil(try store.runningSession())
    }

    func testForgetDeletesFile() throws {
        _ = try store.start(client: "x", task: nil)
        XCTAssertTrue(FileManager.default.fileExists(atPath: storePath.path))
        try store.forget()
        XCTAssertFalse(FileManager.default.fileExists(atPath: storePath.path))
    }

    func testForgetOnMissingFileIsNoOp() throws {
        try store.forget()
        XCTAssertFalse(FileManager.default.fileExists(atPath: storePath.path))
    }

    func testDefaultPathUsesEnvOverride() {
        let url = SessionStore.defaultPath(env: ["TSUKUE_DATA": "/tmp/custom.json"])
        XCTAssertEqual(url.path, "/tmp/custom.json")
    }

    func testDefaultPathFallback() {
        let url = SessionStore.defaultPath(env: ["HOME": "/Users/alice"])
        XCTAssertEqual(url.path, "/Users/alice/.tsukue-no-sumi/sessions.json")
    }

    func testEmptyFileLoadsAsEmpty() throws {
        try Data().write(to: storePath)
        let s = try store.load()
        XCTAssertTrue(s.isEmpty)
    }

    func testCorruptFileThrowsIOFailure() throws {
        try "not json".data(using: .utf8)!.write(to: storePath)
        XCTAssertThrowsError(try store.load()) { err in
            guard case .ioFailure = err as? TsukueError else {
                return XCTFail("expected ioFailure")
            }
        }
    }
}
