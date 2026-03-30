import Foundation

public struct GalaxyRenderer {
    let walks: [Walk]
    let dog: Dog?

    public init(walks: [Walk], dog: Dog?) {
        self.walks = walks
        self.dog = dog
    }

    public func render() -> String {
        var output = ""

        // Title
        output += "\n"
        output += "    \(ANSI.gold)\(WancostarText.galaxyTitle)\(ANSI.reset)\n"
        if let dog = dog {
            output += "    \(dog.emoji) \(ANSI.bold)\(dog.name)\(ANSI.reset)のコスモス\n"
        }
        output += "\n"

        if walks.isEmpty {
            output += "    まだ星がないよ。お散歩を記録して銀河を作ろう！\n\n"
            return output
        }

        // Group walks by month
        let grouped = Dictionary(grouping: walks) { $0.yearMonth }
        let sortedMonths = grouped.keys.sorted().reversed()

        for month in sortedMonths {
            guard let monthWalks = grouped[month] else { continue }
            output += renderMonthHeader(month)
            output += renderConstellation(monthWalks)
            output += "\n"
        }

        // Legend
        output += renderLegend()

        return output
    }

    private func renderMonthHeader(_ yearMonth: String) -> String {
        let parts = yearMonth.split(separator: "-")
        guard parts.count == 2 else { return "" }
        let label = "\(parts[0])年\(parts[1])月"
        return "    \(ANSI.gold)═══ \(label) ═══\(ANSI.reset)\n\n"
    }

    private func renderConstellation(_ walks: [Walk]) -> String {
        let width = 56
        let height = 7

        // Create grid
        var grid: [[String]] = Array(repeating: Array(repeating: " ", count: width), count: height)

        for walk in walks {
            // Deterministic position from walk ID and date
            let hash = deterministicHash(walk.id + walk.date + walk.time)
            let x = 4 + (hash % (width - 8))
            let y = hash / width % height

            let star = starChar(size: walk.starSize)
            let coloredStar = "\(walk.routeType.starColor)\(star)\(ANSI.reset)"

            grid[y][x] = coloredStar

            // Add sparkle for high mood
            if walk.mood >= 4 {
                let sparkleX = min(x + 1, width - 1)
                if grid[y][sparkleX] == " " {
                    grid[y][sparkleX] = "\(ANSI.gold)✨\(ANSI.reset)"
                }
            }

            // Add dim dots around stars for atmosphere
            let positions = [(x-2, y), (x+2, y), (x-1, y-1), (x+1, y+1)]
            for (px, py) in positions {
                if px >= 0 && px < width && py >= 0 && py < height && grid[py][px] == " " {
                    let dimDot = (hash + px + py) % 4 == 0
                    if dimDot {
                        grid[py][px] = "\(ANSI.dim)·\(ANSI.reset)"
                    }
                }
            }
        }

        var result = ""
        for row in grid {
            result += "    " + row.joined() + "\n"
        }
        return result
    }

    private func renderLegend() -> String {
        var output = ""
        output += "    \(ANSI.dim)\(WancostarText.legendTitle)\(ANSI.reset)\n"
        output += "    \(WancostarText.legendSizes)\n"
        output += "    "

        let routeLegends = RouteType.allCases.map { route in
            "\(route.label) = \(route.starColor)\(route.legendColor)\(ANSI.reset)"
        }
        output += routeLegends.joined(separator: "  ")
        output += "\n\n"

        return output
    }

    private func deterministicHash(_ s: String) -> Int {
        var hash = 5381
        for char in s.utf8 {
            hash = ((hash << 5) &+ hash) &+ Int(char)
        }
        return abs(hash)
    }
}
