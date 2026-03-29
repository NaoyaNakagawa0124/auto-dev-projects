import Foundation

public struct Renderer: Sendable {
    public static func renderStory(_ profile: ExplorerProfile) -> String {
        var lines: [String] = []
        let chapter = storyChapters[profile.currentChapter]

        lines.append("╔══════════════════════════════════════════════╗")
        lines.append("║  Chapter \(chapter.id + 1): \(chapter.title)".padding(toLength: 47, withPad: " ", startingAt: 0) + "║")
        lines.append("╠══════════════════════════════════════════════╣")

        let lineIdx = min(profile.storyProgress, chapter.narrative.count - 1)
        for i in 0...lineIdx {
            let text = "║  \(chapter.narrative[i])"
            lines.append(text.padding(toLength: 47, withPad: " ", startingAt: 0) + "║")
        }

        lines.append("╠══════════════════════════════════════════════╣")

        let progress = getProgressToNextChapter(xp: profile.explorationXP, chapter: profile.currentChapter)
        if let next = progress.nextTitle {
            let barLen = 20
            let filled = progress.percent * barLen / 100
            let bar = String(repeating: "█", count: filled) + String(repeating: "░", count: barLen - filled)
            lines.append("║  [\(bar)] \(progress.percent)%".padding(toLength: 47, withPad: " ", startingAt: 0) + "║")
            lines.append("║  \(progress.remaining) XP to \(next)".padding(toLength: 47, withPad: " ", startingAt: 0) + "║")
        } else {
            lines.append("║  ★ Journey Complete ★".padding(toLength: 47, withPad: " ", startingAt: 0) + "║")
        }

        lines.append("║  Milestone: \(chapter.milestone)".padding(toLength: 47, withPad: " ", startingAt: 0) + "║")
        lines.append("╚══════════════════════════════════════════════╝")

        if profile.storyProgress < chapter.narrative.count - 1 {
            lines.append("  (Use 'starlog story --next' to advance)")
        }

        return lines.joined(separator: "\n")
    }

    public static func renderMap(_ profile: ExplorerProfile) -> String {
        var lines: [String] = []

        lines.append("╔══════════════════════════════════════════════╗")
        lines.append("║           🌌 GALAXY MAP 🌌                  ║")
        lines.append("╠══════════════════════════════════════════════╣")

        // Group anime by genre/nebula
        var nebulae: [Genre: [Anime]] = [:]
        for a in profile.anime {
            nebulae[a.genre, default: []].append(a)
        }

        if nebulae.isEmpty {
            lines.append("║  No star systems charted yet.                ║")
            lines.append("║  Use 'starlog add' to discover your first!   ║")
        } else {
            for genre in Genre.allCases {
                guard let systems = nebulae[genre] else { continue }
                lines.append("║                                              ║")
                lines.append("║  \(genre.icon) \(genre.nebula) (\(systems.count) systems)".padding(toLength: 47, withPad: " ", startingAt: 0) + "║")
                for system in systems {
                    let pct = Int(system.completionPercent)
                    let statusIcon = system.isComplete ? "●" : (system.watchedEpisodes > 0 ? "◐" : "○")
                    let line = "║    \(statusIcon) \(system.starSystemName) — \(system.title) [\(pct)%]"
                    lines.append(line.padding(toLength: 47, withPad: " ", startingAt: 0) + "║")
                }
            }
        }

        lines.append("╠══════════════════════════════════════════════╣")
        lines.append("║  \(profile.rankIcon) \(profile.rank) | XP: \(profile.explorationXP) | Systems: \(profile.totalAnime)".padding(toLength: 47, withPad: " ", startingAt: 0) + "║")
        lines.append("╚══════════════════════════════════════════════╝")

        return lines.joined(separator: "\n")
    }

    public static func renderStats(_ profile: ExplorerProfile) -> String {
        var lines: [String] = []

        lines.append("╔══════════════════════════════════════════════╗")
        lines.append("║           📊 EXPLORER STATS 📊               ║")
        lines.append("╠══════════════════════════════════════════════╣")
        lines.append("║  Rank: \(profile.rankIcon) \(profile.rank)".padding(toLength: 47, withPad: " ", startingAt: 0) + "║")
        lines.append("║  Exploration XP: \(profile.explorationXP)".padding(toLength: 47, withPad: " ", startingAt: 0) + "║")
        lines.append("║  Chapter: \(profile.currentChapter + 1)/\(storyChapters.count)".padding(toLength: 47, withPad: " ", startingAt: 0) + "║")
        lines.append("║                                              ║")
        lines.append("║  Star Systems: \(profile.totalAnime)".padding(toLength: 47, withPad: " ", startingAt: 0) + "║")
        lines.append("║  Fully Explored: \(profile.completedAnime)".padding(toLength: 47, withPad: " ", startingAt: 0) + "║")
        lines.append("║  Episodes Watched: \(profile.totalWatchedEpisodes)".padding(toLength: 47, withPad: " ", startingAt: 0) + "║")
        lines.append("║  Watch Hours: ~\(Int(profile.estimatedWatchHours))h".padding(toLength: 47, withPad: " ", startingAt: 0) + "║")
        lines.append("║  Genre Nebulae: \(profile.uniqueGenres)/\(Genre.allCases.count)".padding(toLength: 47, withPad: " ", startingAt: 0) + "║")

        let avgRating = profile.averageRating
        if avgRating > 0 {
            lines.append("║  Avg Rating: \(String(format: "%.1f", avgRating))/10".padding(toLength: 47, withPad: " ", startingAt: 0) + "║")
        }

        lines.append("╠══════════════════════════════════════════════╣")
        lines.append("║  Achievements: \(profile.achievementsUnlocked.count)/18".padding(toLength: 47, withPad: " ", startingAt: 0) + "║")

        for achId in profile.achievementsUnlocked {
            let name = Engine.getAchievementName(achId)
            lines.append("║    \(name)".padding(toLength: 47, withPad: " ", startingAt: 0) + "║")
        }

        lines.append("╚══════════════════════════════════════════════╝")

        return lines.joined(separator: "\n")
    }

    public static func renderList(_ profile: ExplorerProfile) -> String {
        var lines: [String] = []

        lines.append("╔══════════════════════════════════════════════╗")
        lines.append("║           📋 ANIME CATALOG 📋                ║")
        lines.append("╠══════════════════════════════════════════════╣")

        if profile.anime.isEmpty {
            lines.append("║  No anime logged yet.                        ║")
        } else {
            for (i, a) in profile.anime.enumerated() {
                let statusIcon: String
                switch a.status {
                case .planned: statusIcon = "○"
                case .watching: statusIcon = "◐"
                case .completed: statusIcon = "●"
                case .dropped: statusIcon = "✕"
                }
                let rating = a.rating > 0 ? " ★\(a.rating)" : ""
                let line = "║  \(i+1). \(statusIcon) \(a.title) [\(a.watchedEpisodes)/\(a.totalEpisodes)]\(rating)"
                lines.append(line.padding(toLength: 47, withPad: " ", startingAt: 0) + "║")
                let detail = "║     \(a.genre.icon) \(a.genre.rawValue) | \(a.starSystemName)"
                lines.append(detail.padding(toLength: 47, withPad: " ", startingAt: 0) + "║")
            }
        }

        lines.append("╚══════════════════════════════════════════════╝")
        return lines.joined(separator: "\n")
    }
}
