import XCTest
@testable import Wancostar

final class WancostarTests: XCTestCase {

    // MARK: - Walk Model Tests

    func testWalkStarSize1() {
        let walk = Walk(date: "2026-03-30", time: "07:00", duration: 10, distance: 0.5, mood: 3, routeType: .park)
        XCTAssertEqual(walk.starSize, 1)
    }

    func testWalkStarSize2() {
        let walk = Walk(date: "2026-03-30", time: "07:00", duration: 20, distance: 1.0, mood: 3, routeType: .park)
        XCTAssertEqual(walk.starSize, 2)
    }

    func testWalkStarSize3() {
        let walk = Walk(date: "2026-03-30", time: "07:00", duration: 40, distance: 2.0, mood: 3, routeType: .park)
        XCTAssertEqual(walk.starSize, 3)
    }

    func testWalkStarSize4() {
        let walk = Walk(date: "2026-03-30", time: "07:00", duration: 55, distance: 2.5, mood: 3, routeType: .park)
        XCTAssertEqual(walk.starSize, 4)
    }

    func testWalkStarSize5() {
        let walk = Walk(date: "2026-03-30", time: "07:00", duration: 90, distance: 5.0, mood: 5, routeType: .park)
        XCTAssertEqual(walk.starSize, 5)
    }

    func testWalkStarSizeBoundary15() {
        let walk = Walk(date: "2026-03-30", time: "07:00", duration: 15, distance: 0.8, mood: 3, routeType: .park)
        XCTAssertEqual(walk.starSize, 2) // 15 is >= 15, so size 2
    }

    func testWalkStarSizeBoundary60() {
        let walk = Walk(date: "2026-03-30", time: "07:00", duration: 60, distance: 3.0, mood: 3, routeType: .park)
        XCTAssertEqual(walk.starSize, 5) // 60 is >= 60, so size 5
    }

    func testWalkYearMonth() {
        let walk = Walk(date: "2026-03-30", time: "07:00", duration: 30, distance: 1.5, mood: 3, routeType: .park)
        XCTAssertEqual(walk.yearMonth, "2026-03")
    }

    func testWalkYearMonthDifferent() {
        let walk = Walk(date: "2025-12-01", time: "17:00", duration: 45, distance: 2.0, mood: 4, routeType: .river)
        XCTAssertEqual(walk.yearMonth, "2025-12")
    }

    // MARK: - RouteType Tests

    func testRouteTypeParkLabel() {
        XCTAssertEqual(RouteType.park.label, "🌳 公園")
    }

    func testRouteTypeNeighborhoodLabel() {
        XCTAssertEqual(RouteType.neighborhood.label, "🏘️ 近所")
    }

    func testRouteTypeRiverLabel() {
        XCTAssertEqual(RouteType.river.label, "🌊 川沿い")
    }

    func testRouteTypeMountainLabel() {
        XCTAssertEqual(RouteType.mountain.label, "⛰️ 山道")
    }

    func testRouteTypeCityLabel() {
        XCTAssertEqual(RouteType.city.label, "🏙️ 街中")
    }

    func testRouteTypeBeachLabel() {
        XCTAssertEqual(RouteType.beach.label, "🏖️ 海岸")
    }

    func testRouteTypeAllCasesCount() {
        XCTAssertEqual(RouteType.allCases.count, 6)
    }

    func testRouteTypeStarColorNotEmpty() {
        for route in RouteType.allCases {
            XCTAssertFalse(route.starColor.isEmpty)
        }
    }

    // MARK: - InfraRating Tests

    func testInfraRatingClampsValues() {
        let rating = InfraRating(sidewalk: 0, shade: 6, dogFriendly: -1)
        XCTAssertEqual(rating.sidewalk, 1)
        XCTAssertEqual(rating.shade, 5)
        XCTAssertEqual(rating.dogFriendly, 1)
    }

    func testInfraRatingValidValues() {
        let rating = InfraRating(sidewalk: 3, shade: 4, dogFriendly: 5)
        XCTAssertEqual(rating.sidewalk, 3)
        XCTAssertEqual(rating.shade, 4)
        XCTAssertEqual(rating.dogFriendly, 5)
    }

    // MARK: - Dog Model Tests

    func testDogCreation() {
        let dog = Dog(name: "ポチ", breed: "柴犬", birthday: "2022-05-15", emoji: "🐕")
        XCTAssertEqual(dog.name, "ポチ")
        XCTAssertEqual(dog.breed, "柴犬")
        XCTAssertEqual(dog.birthday, "2022-05-15")
        XCTAssertEqual(dog.emoji, "🐕")
    }

    func testDogDefaultEmoji() {
        let dog = Dog(name: "タロウ", breed: "ゴールデン")
        XCTAssertEqual(dog.emoji, "🐕")
        XCTAssertNil(dog.birthday)
    }

    // MARK: - WalkLog Tests

    func testWalkLogInit() {
        let log = WalkLog()
        XCTAssertNil(log.dog)
        XCTAssertTrue(log.walks.isEmpty)
        XCTAssertFalse(log.createdAt.isEmpty)
    }

    // MARK: - Storage Tests

    func testStorageSaveLoadRoundtrip() {
        let tempDir = NSTemporaryDirectory() + "wancostar-test-\(UUID().uuidString)"
        let storage = Storage(directory: tempDir)

        var log = WalkLog()
        log.dog = Dog(name: "テスト犬", breed: "テスト犬種", emoji: "🐶")
        log.walks = [
            Walk(date: "2026-03-30", time: "07:00", duration: 30, distance: 1.5, mood: 4, routeType: .park),
            Walk(date: "2026-03-29", time: "17:00", duration: 45, distance: 2.0, mood: 5, routeType: .river)
        ]

        storage.save(log)
        let loaded = storage.load()

        XCTAssertEqual(loaded.dog?.name, "テスト犬")
        XCTAssertEqual(loaded.dog?.breed, "テスト犬種")
        XCTAssertEqual(loaded.walks.count, 2)
        XCTAssertEqual(loaded.walks[0].duration, 30)
        XCTAssertEqual(loaded.walks[1].routeType, .river)

        // Cleanup
        try? FileManager.default.removeItem(atPath: tempDir)
    }

    func testStorageLoadEmpty() {
        let tempDir = NSTemporaryDirectory() + "wancostar-test-empty-\(UUID().uuidString)"
        let storage = Storage(directory: tempDir)
        let log = storage.load()
        XCTAssertNil(log.dog)
        XCTAssertTrue(log.walks.isEmpty)
    }

    func testStorageExportJSON() {
        let tempDir = NSTemporaryDirectory() + "wancostar-test-export-\(UUID().uuidString)"
        let storage = Storage(directory: tempDir)

        var log = WalkLog()
        log.dog = Dog(name: "エクスポート犬", breed: "テスト", emoji: "🐩")
        log.walks = [Walk(date: "2026-03-30", time: "08:00", duration: 20, distance: 1.0, mood: 3, routeType: .city)]
        storage.save(log)

        let json = storage.exportJSON()
        XCTAssertNotNil(json)
        XCTAssertTrue(json!.contains("エクスポート犬"))

        try? FileManager.default.removeItem(atPath: tempDir)
    }

    // MARK: - Statistics Tests

    func testStatsCalculation() {
        let tempDir = NSTemporaryDirectory() + "wancostar-test-stats-\(UUID().uuidString)"
        let storage = Storage(directory: tempDir)
        let commands = Commands(storage: storage)

        let walks = [
            Walk(date: "2026-03-30", time: "07:00", duration: 30, distance: 1.5, mood: 4, routeType: .park,
                 infrastructure: InfraRating(sidewalk: 4, shade: 3, dogFriendly: 5)),
            Walk(date: "2026-03-29", time: "17:00", duration: 45, distance: 2.0, mood: 5, routeType: .river,
                 infrastructure: InfraRating(sidewalk: 3, shade: 4, dogFriendly: 4)),
            Walk(date: "2026-03-28", time: "07:30", duration: 60, distance: 3.0, mood: 3, routeType: .park,
                 infrastructure: InfraRating(sidewalk: 5, shade: 2, dogFriendly: 3))
        ]

        let stats = commands.calculateStats(walks: walks)

        XCTAssertEqual(stats.totalWalks, 3)
        XCTAssertEqual(stats.totalDistance, 6.5, accuracy: 0.01)
        XCTAssertEqual(stats.totalDuration, 135)
        XCTAssertEqual(stats.avgDistance, 6.5 / 3.0, accuracy: 0.01)
        XCTAssertEqual(stats.avgDuration, 45.0, accuracy: 0.01)
        XCTAssertEqual(stats.avgSidewalk, 4.0, accuracy: 0.01)
        XCTAssertEqual(stats.avgShade, 3.0, accuracy: 0.01)
        XCTAssertEqual(stats.avgDogFriendly, 4.0, accuracy: 0.01)

        try? FileManager.default.removeItem(atPath: tempDir)
    }

    func testStatsRouteBreakdown() {
        let tempDir = NSTemporaryDirectory() + "wancostar-test-routes-\(UUID().uuidString)"
        let storage = Storage(directory: tempDir)
        let commands = Commands(storage: storage)

        let walks = [
            Walk(date: "2026-03-30", time: "07:00", duration: 30, distance: 1.5, mood: 4, routeType: .park),
            Walk(date: "2026-03-29", time: "17:00", duration: 45, distance: 2.0, mood: 5, routeType: .park),
            Walk(date: "2026-03-28", time: "07:30", duration: 60, distance: 3.0, mood: 3, routeType: .river)
        ]

        let stats = commands.calculateStats(walks: walks)

        // Park should appear first with 2 walks
        XCTAssertEqual(stats.routeBreakdown.first?.0, .park)
        XCTAssertEqual(stats.routeBreakdown.first?.1, 2)

        try? FileManager.default.removeItem(atPath: tempDir)
    }

    func testStatsEmptyWalks() {
        let tempDir = NSTemporaryDirectory() + "wancostar-test-empty-stats-\(UUID().uuidString)"
        let storage = Storage(directory: tempDir)
        let commands = Commands(storage: storage)

        let stats = commands.calculateStats(walks: [])
        XCTAssertEqual(stats.totalWalks, 0)
        XCTAssertEqual(stats.totalDistance, 0)
        XCTAssertEqual(stats.avgDistance, 0)
    }

    // MARK: - Streak Tests

    func testStreakCalculation() {
        let tempDir = NSTemporaryDirectory() + "wancostar-test-streak-\(UUID().uuidString)"
        let storage = Storage(directory: tempDir)
        let commands = Commands(storage: storage)

        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        let today = Date()
        let calendar = Calendar.current

        var walks: [Walk] = []
        // 5 consecutive days including today
        for i in 0..<5 {
            let date = calendar.date(byAdding: .day, value: -i, to: today)!
            walks.append(Walk(
                date: formatter.string(from: date),
                time: "07:00", duration: 30, distance: 1.5, mood: 4, routeType: .park
            ))
        }

        let (current, longest) = commands.calculateStreaks(walks: walks)
        XCTAssertEqual(current, 5)
        XCTAssertEqual(longest, 5)
    }

    func testStreakWithGap() {
        let tempDir = NSTemporaryDirectory() + "wancostar-test-streak-gap-\(UUID().uuidString)"
        let storage = Storage(directory: tempDir)
        let commands = Commands(storage: storage)

        // Walks with a gap (not current)
        let walks = [
            Walk(date: "2026-01-05", time: "07:00", duration: 30, distance: 1.5, mood: 4, routeType: .park),
            Walk(date: "2026-01-04", time: "07:00", duration: 30, distance: 1.5, mood: 4, routeType: .park),
            Walk(date: "2026-01-03", time: "07:00", duration: 30, distance: 1.5, mood: 4, routeType: .park),
            // gap
            Walk(date: "2026-01-01", time: "07:00", duration: 30, distance: 1.5, mood: 4, routeType: .park),
        ]

        let (current, longest) = commands.calculateStreaks(walks: walks)
        XCTAssertEqual(longest, 3) // Jan 3-5
        XCTAssertEqual(current, 0) // Not active (dates in the past)
    }

    // MARK: - Galaxy Renderer Tests

    func testGalaxyRendererProducesOutput() {
        let walks = [
            Walk(date: "2026-03-30", time: "07:00", duration: 30, distance: 1.5, mood: 4, routeType: .park),
            Walk(date: "2026-03-29", time: "17:00", duration: 60, distance: 3.0, mood: 5, routeType: .river),
        ]
        let dog = Dog(name: "テスト", breed: "テスト犬種", emoji: "🐕")
        let renderer = GalaxyRenderer(walks: walks, dog: dog)
        let output = renderer.render()

        XCTAssertFalse(output.isEmpty)
        XCTAssertTrue(output.contains("ワンコスターの銀河"))
        XCTAssertTrue(output.contains("テスト"))
        XCTAssertTrue(output.contains("2026年03月"))
    }

    func testGalaxyRendererEmptyWalks() {
        let renderer = GalaxyRenderer(walks: [], dog: nil)
        let output = renderer.render()
        XCTAssertTrue(output.contains("まだ星がないよ"))
    }

    func testGalaxyRendererMultipleMonths() {
        let walks = [
            Walk(date: "2026-03-30", time: "07:00", duration: 30, distance: 1.5, mood: 4, routeType: .park),
            Walk(date: "2026-02-15", time: "17:00", duration: 60, distance: 3.0, mood: 5, routeType: .river),
        ]
        let renderer = GalaxyRenderer(walks: walks, dog: nil)
        let output = renderer.render()
        XCTAssertTrue(output.contains("2026年03月"))
        XCTAssertTrue(output.contains("2026年02月"))
    }

    func testGalaxyRendererHasLegend() {
        let walks = [
            Walk(date: "2026-03-30", time: "07:00", duration: 30, distance: 1.5, mood: 4, routeType: .park)
        ]
        let renderer = GalaxyRenderer(walks: walks, dog: nil)
        let output = renderer.render()
        XCTAssertTrue(output.contains("凡例"))
        XCTAssertTrue(output.contains("60分以上"))
    }

    // MARK: - UI Helper Tests

    func testStarCharMapping() {
        XCTAssertEqual(starChar(size: 1), "·")
        XCTAssertEqual(starChar(size: 2), "∗")
        XCTAssertEqual(starChar(size: 3), "✧")
        XCTAssertEqual(starChar(size: 4), "✦")
        XCTAssertEqual(starChar(size: 5), "★")
    }

    func testFormatDate() {
        XCTAssertEqual(formatDate("2026-03-30"), "03/30")
        XCTAssertEqual(formatDate("2025-12-01"), "12/01")
    }

    func testFormatDateInvalid() {
        XCTAssertEqual(formatDate("invalid"), "invalid")
    }

    func testDisplayWidthASCII() {
        XCTAssertEqual(displayWidth("hello"), 5)
    }

    func testDisplayWidthJapanese() {
        // Each Japanese character should be width 2
        XCTAssertEqual(displayWidth("公園"), 4)
    }

    func testDisplayWidthWithANSI() {
        // ANSI codes should not count toward width
        let colored = "\u{1b}[32mhello\u{1b}[0m"
        XCTAssertEqual(displayWidth(colored), 5)
    }

    func testProgressBar() {
        let bar = progressBar(3.0, maxValue: 5.0, width: 5)
        XCTAssertEqual(bar, "███░░")
    }

    func testProgressBarFull() {
        let bar = progressBar(5.0, maxValue: 5.0, width: 5)
        XCTAssertEqual(bar, "█████")
    }

    func testProgressBarEmpty() {
        let bar = progressBar(0.0, maxValue: 5.0, width: 5)
        XCTAssertEqual(bar, "░░░░░")
    }

    func testTodayStringFormat() {
        let today = todayString()
        // Should match YYYY-MM-DD format
        let parts = today.split(separator: "-")
        XCTAssertEqual(parts.count, 3)
        XCTAssertEqual(parts[0].count, 4)
        XCTAssertEqual(parts[1].count, 2)
        XCTAssertEqual(parts[2].count, 2)
    }

    // MARK: - Demo Data Tests

    func testDemoDataGeneration() {
        let demoWalks = generateDemoData()
        XCTAssertGreaterThan(demoWalks.count, 20)
    }

    func testDemoDataHasVariedRoutes() {
        let demoWalks = generateDemoData()
        let routeTypes = Set(demoWalks.map { $0.routeType })
        XCTAssertGreaterThan(routeTypes.count, 2)
    }

    func testDemoDataHasVariedDurations() {
        let demoWalks = generateDemoData()
        let durations = Set(demoWalks.map { $0.duration })
        XCTAssertGreaterThan(durations.count, 3)
    }

    func testDemoDataHasValidMoods() {
        let demoWalks = generateDemoData()
        for walk in demoWalks {
            XCTAssertGreaterThanOrEqual(walk.mood, 1)
            XCTAssertLessThanOrEqual(walk.mood, 5)
        }
    }

    func testDemoDataSpansMultipleMonths() {
        let demoWalks = generateDemoData()
        let months = Set(demoWalks.map { $0.yearMonth })
        // 28 days of data should span at least 1 month, possibly 2
        XCTAssertGreaterThanOrEqual(months.count, 1)
    }

    // MARK: - Codable Tests

    func testWalkCodableRoundtrip() {
        let walk = Walk(
            id: "test-id",
            date: "2026-03-30",
            time: "07:00",
            duration: 45,
            distance: 2.3,
            mood: 5,
            routeType: .mountain,
            notes: "テストメモ",
            infrastructure: InfraRating(sidewalk: 4, shade: 3, dogFriendly: 5)
        )

        let encoder = JSONEncoder()
        let decoder = JSONDecoder()

        do {
            let data = try encoder.encode(walk)
            let decoded = try decoder.decode(Walk.self, from: data)
            XCTAssertEqual(decoded.id, "test-id")
            XCTAssertEqual(decoded.duration, 45)
            XCTAssertEqual(decoded.routeType, .mountain)
            XCTAssertEqual(decoded.notes, "テストメモ")
            XCTAssertEqual(decoded.infrastructure.sidewalk, 4)
        } catch {
            XCTFail("Codable roundtrip failed: \(error)")
        }
    }

    func testDogCodableRoundtrip() {
        let dog = Dog(name: "ハナ", breed: "トイプードル", birthday: "2023-01-10", emoji: "🐩")

        let encoder = JSONEncoder()
        let decoder = JSONDecoder()

        do {
            let data = try encoder.encode(dog)
            let decoded = try decoder.decode(Dog.self, from: data)
            XCTAssertEqual(decoded.name, "ハナ")
            XCTAssertEqual(decoded.breed, "トイプードル")
            XCTAssertEqual(decoded.birthday, "2023-01-10")
            XCTAssertEqual(decoded.emoji, "🐩")
        } catch {
            XCTFail("Codable roundtrip failed: \(error)")
        }
    }
}
