import Foundation

public struct Commands {
    let storage: Storage

    public init(storage: Storage) {
        self.storage = storage
    }

    // MARK: - Setup

    public func setup() {
        print("")
        printColored(WancostarText.welcomeMessage, color: ANSI.gold)
        print(WancostarText.setupPrompt)
        print("")

        let name = prompt(WancostarText.namePrompt)
        let breed = prompt(WancostarText.breedPrompt)
        let birthday = prompt(WancostarText.birthdayPrompt)

        print(WancostarText.emojiPrompt)
        for (i, emoji) in WancostarText.dogEmojis.enumerated() {
            print("  \(i + 1). \(emoji)")
        }
        let emojiIdx = promptInt("→ ", range: 1...WancostarText.dogEmojis.count) - 1
        let emoji = WancostarText.dogEmojis[emojiIdx]

        let dog = Dog(
            name: name,
            breed: breed,
            birthday: birthday.isEmpty ? nil : birthday,
            emoji: emoji
        )

        var log = storage.load()
        log.dog = dog
        storage.save(log)

        print("")
        printColored(WancostarText.profileComplete, color: ANSI.green)
        print("\(emoji) \(name) (\(breed))")
        printColored(WancostarText.letsStart, color: ANSI.cyan)
        print("")
    }

    // MARK: - Add Walk

    public func addWalk() {
        var log = storage.load()

        // Auto-populate demo data if first use
        if log.walks.isEmpty && log.dog == nil {
            log.dog = Dog(name: "ポチ", breed: "柴犬", birthday: "2022-05-15", emoji: "🐕")
            log.walks = generateDemoData()
            storage.save(log)
            printColored("🌟 デモデータを作成しました！ galaxy コマンドで銀河を見てみよう！", color: ANSI.gold)
            print("")
        }

        print("")
        printColored(WancostarText.addWalkTitle, color: ANSI.gold)
        print("")

        let dateInput = prompt(WancostarText.datePrompt)
        let date = dateInput.isEmpty ? todayString() : dateInput

        let time = prompt(WancostarText.timePrompt)
        let duration = promptInt(WancostarText.durationPrompt, range: 1...300)
        let distance = promptDouble(WancostarText.distancePrompt)
        let mood = promptInt(WancostarText.moodPrompt, range: 1...5)

        print("")
        print(WancostarText.routePrompt)
        for (i, route) in RouteType.allCases.enumerated() {
            print("  \(i + 1). \(route.label)")
        }
        let routeIdx = promptInt("→ ", range: 1...RouteType.allCases.count) - 1
        let routeType = RouteType.allCases[routeIdx]

        print("")
        print(WancostarText.infraTitle)
        let sidewalk = promptInt(WancostarText.sidewalkPrompt, range: 1...5)
        let shade = promptInt(WancostarText.shadePrompt, range: 1...5)
        let dogFriendly = promptInt(WancostarText.dogFriendlyPrompt, range: 1...5)

        print("")
        let notes = prompt(WancostarText.notesPrompt)

        let walk = Walk(
            date: date,
            time: time,
            duration: duration,
            distance: distance,
            mood: mood,
            routeType: routeType,
            notes: notes,
            infrastructure: InfraRating(sidewalk: sidewalk, shade: shade, dogFriendly: dogFriendly)
        )

        log.walks.append(walk)
        log.walks.sort { $0.date > $1.date || ($0.date == $1.date && $0.time > $1.time) }
        storage.save(log)

        print("")
        printColored(WancostarText.walkRecorded, color: ANSI.green)
        printColored(WancostarText.newStar, color: ANSI.gold)
        print("")
    }

    // MARK: - List Walks

    public func listWalks() {
        let log = storage.load()

        if log.walks.isEmpty {
            print("")
            printColored(WancostarText.noWalks, color: ANSI.yellow)
            print("")
            return
        }

        let dogName = log.dog?.name ?? "ワンコ"
        let dogEmoji = log.dog?.emoji ?? "🐕"
        let title = "\(dogEmoji) \(dogName)のお散歩ログ (最新10件)"

        let headers = ["日付", "時刻", "時間", "距離", "⭐", "ルート"]
        let recentWalks = Array(log.walks.prefix(10))

        let rows: [[String]] = recentWalks.map { walk in
            [
                formatDate(walk.date),
                walk.time,
                "\(walk.duration)分",
                String(format: "%.1fkm", walk.distance),
                "⭐\(walk.mood)",
                walk.routeType.label
            ]
        }

        print("")
        printTable(headers: headers, rows: rows, title: title)
        print("")
    }

    // MARK: - Stats

    public func showStats() {
        let log = storage.load()

        if log.walks.isEmpty {
            print("")
            printColored(WancostarText.noWalks, color: ANSI.yellow)
            print("")
            return
        }

        let stats = calculateStats(walks: log.walks)
        var lines: [String] = []

        lines.append("")
        lines.append("\(WancostarText.totalWalks):     \(ANSI.bold)\(stats.totalWalks)回\(ANSI.reset)")
        lines.append("\(WancostarText.totalDistance):          \(ANSI.bold)\(String(format: "%.1f", stats.totalDistance))km\(ANSI.reset)")
        lines.append("\(WancostarText.totalTime):          \(ANSI.bold)\(formatNumber(stats.totalDuration))分\(ANSI.reset)")
        lines.append("\(WancostarText.avgDistance):         \(ANSI.bold)\(String(format: "%.2f", stats.avgDistance))km/回\(ANSI.reset)")
        lines.append("\(WancostarText.avgTime):         \(ANSI.bold)\(String(format: "%.1f", stats.avgDuration))分/回\(ANSI.reset)")
        lines.append("")
        lines.append("\(WancostarText.currentStreak):      \(ANSI.bold)\(stats.currentStreak)日\(ANSI.reset)")
        lines.append("\(WancostarText.longestStreak):      \(ANSI.bold)\(stats.longestStreak)日\(ANSI.reset)")
        lines.append("")
        lines.append(WancostarText.routeBreakdown)

        for (route, count) in stats.routeBreakdown {
            let pct = Double(count) / Double(stats.totalWalks) * 100
            lines.append("\(route.label):      \(count)回 (\(String(format: "%.1f", pct))%)")
        }

        lines.append("")
        lines.append(WancostarText.infraAverage)
        lines.append("\(WancostarText.sidewalkLabel): \(progressBar(stats.avgSidewalk)) \(String(format: "%.1f", stats.avgSidewalk))")
        lines.append("\(WancostarText.shadeLabel): \(progressBar(stats.avgShade)) \(String(format: "%.1f", stats.avgShade))")
        lines.append("\(WancostarText.dogFriendlyLabel): \(progressBar(stats.avgDogFriendly)) \(String(format: "%.1f", stats.avgDogFriendly))")
        lines.append("")

        print("")
        printBox(title: WancostarText.statsTitle, lines: lines)
        print("")
    }

    // MARK: - Galaxy

    public func showGalaxy() {
        var log = storage.load()

        // Auto-populate demo data if empty
        if log.walks.isEmpty {
            log.dog = Dog(name: "ポチ", breed: "柴犬", birthday: "2022-05-15", emoji: "🐕")
            log.walks = generateDemoData()
            storage.save(log)
            printColored("🌟 デモデータを作成しました！", color: ANSI.gold)
        }

        let renderer = GalaxyRenderer(walks: log.walks, dog: log.dog)
        print(renderer.render())
    }

    // MARK: - Export

    public func exportData() {
        if let json = storage.exportJSON() {
            print(json)
        } else {
            printColored(WancostarText.fileError, color: ANSI.red)
        }
    }

    // MARK: - Import

    public func importData(path: String) {
        if storage.importJSON(from: path) {
            printColored(WancostarText.importDone, color: ANSI.green)
        } else {
            printColored(WancostarText.importError, color: ANSI.red)
        }
    }

    // MARK: - Help

    public func showHelp() {
        print("")
        printColored(WancostarText.helpTitle, color: ANSI.gold)
        print("")
        print(WancostarText.helpCommands)
        print("")
    }

    // MARK: - Stats Calculation

    public struct WalkStats {
        var totalWalks: Int
        var totalDistance: Double
        var totalDuration: Int
        var avgDistance: Double
        var avgDuration: Double
        var currentStreak: Int
        var longestStreak: Int
        var routeBreakdown: [(RouteType, Int)]
        var avgSidewalk: Double
        var avgShade: Double
        var avgDogFriendly: Double
    }

    public func calculateStats(walks: [Walk]) -> WalkStats {
        let totalWalks = walks.count
        let totalDistance = walks.reduce(0.0) { $0 + $1.distance }
        let totalDuration = walks.reduce(0) { $0 + $1.duration }
        let avgDistance = totalWalks > 0 ? totalDistance / Double(totalWalks) : 0
        let avgDuration = totalWalks > 0 ? Double(totalDuration) / Double(totalWalks) : 0

        // Route breakdown
        var routeCounts: [RouteType: Int] = [:]
        for walk in walks {
            routeCounts[walk.routeType, default: 0] += 1
        }
        let routeBreakdown = routeCounts.sorted { $0.value > $1.value }

        // Infrastructure averages
        let avgSidewalk = totalWalks > 0 ? Double(walks.reduce(0) { $0 + $1.infrastructure.sidewalk }) / Double(totalWalks) : 0
        let avgShade = totalWalks > 0 ? Double(walks.reduce(0) { $0 + $1.infrastructure.shade }) / Double(totalWalks) : 0
        let avgDogFriendly = totalWalks > 0 ? Double(walks.reduce(0) { $0 + $1.infrastructure.dogFriendly }) / Double(totalWalks) : 0

        // Streak calculation
        let (currentStreak, longestStreak) = calculateStreaks(walks: walks)

        return WalkStats(
            totalWalks: totalWalks,
            totalDistance: totalDistance,
            totalDuration: totalDuration,
            avgDistance: avgDistance,
            avgDuration: avgDuration,
            currentStreak: currentStreak,
            longestStreak: longestStreak,
            routeBreakdown: routeBreakdown,
            avgSidewalk: avgSidewalk,
            avgShade: avgShade,
            avgDogFriendly: avgDogFriendly
        )
    }

    public func calculateStreaks(walks: [Walk]) -> (current: Int, longest: Int) {
        guard !walks.isEmpty else { return (0, 0) }

        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"

        // Get unique dates sorted descending
        let uniqueDates = Array(Set(walks.map { $0.date })).sorted().reversed()
        guard let firstDate = uniqueDates.first,
              let _ = formatter.date(from: firstDate) else {
            return (0, 0)
        }

        let dates = uniqueDates.compactMap { formatter.date(from: $0) }
        guard !dates.isEmpty else { return (0, 0) }

        let calendar = Calendar.current
        var currentStreak = 1
        var longestStreak = 1
        var streak = 1

        // Check if the most recent walk is today or yesterday for current streak
        let today = calendar.startOfDay(for: Date())
        let mostRecent = calendar.startOfDay(for: dates[0])
        let daysDiff = calendar.dateComponents([.day], from: mostRecent, to: today).day ?? 0
        let isCurrentActive = daysDiff <= 1

        for i in 1..<dates.count {
            let prev = calendar.startOfDay(for: dates[i - 1])
            let curr = calendar.startOfDay(for: dates[i])
            let diff = calendar.dateComponents([.day], from: curr, to: prev).day ?? 0

            if diff == 1 {
                streak += 1
                longestStreak = max(longestStreak, streak)
            } else {
                if i <= currentStreak {
                    currentStreak = streak
                }
                streak = 1
            }
        }

        if isCurrentActive {
            currentStreak = max(currentStreak, streak)
        }
        longestStreak = max(longestStreak, streak)

        if !isCurrentActive {
            currentStreak = 0
        }

        return (currentStreak, longestStreak)
    }

    private func formatNumber(_ n: Int) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        return formatter.string(from: NSNumber(value: n)) ?? "\(n)"
    }
}
