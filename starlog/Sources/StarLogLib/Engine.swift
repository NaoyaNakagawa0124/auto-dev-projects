import Foundation

public struct ActionResult: Sendable {
    public let xpGained: Int
    public let newChapter: Bool
    public let storyEvent: String?
    public let message: String
    public let newAchievements: [String]
}

public struct Engine: Sendable {
    public static func calculateAddXP(genre: Genre, totalEpisodes: Int) -> Int {
        // Base 20 XP for adding, bonus for longer series
        var xp = 20
        if totalEpisodes >= 50 { xp += 15 }
        else if totalEpisodes >= 24 { xp += 10 }
        else if totalEpisodes >= 12 { xp += 5 }
        return xp
    }

    public static func calculateWatchXP(episodesWatched: Int, isCompletion: Bool) -> Int {
        var xp = episodesWatched * 5
        if isCompletion { xp += 50 } // Completion bonus
        return xp
    }

    public static func addAnime(_ profile: inout ExplorerProfile, title: String, genre: Genre, totalEpisodes: Int, rating: Int) -> ActionResult {
        // Check duplicate
        if profile.anime.contains(where: { $0.title.lowercased() == title.lowercased() }) {
            return ActionResult(xpGained: 0, newChapter: false, storyEvent: nil,
                              message: "'\(title)' is already in your star chart.", newAchievements: [])
        }

        let anime = Anime(title: title, genre: genre, totalEpisodes: totalEpisodes, rating: rating)
        let isNewGenre = !profile.anime.contains(where: { $0.genre == genre })
        profile.anime.append(anime)

        let xp = calculateAddXP(genre: genre, totalEpisodes: totalEpisodes)
        let oldChapter = profile.currentChapter
        profile.explorationXP += xp
        profile.currentChapter = getChapterForXP(profile.explorationXP)
        let newChapter = profile.currentChapter > oldChapter
        if newChapter { profile.storyProgress = 0 }

        let trigger = isNewGenre ? "genre_new" : "add"
        let event = getStoryEvent(trigger: trigger, xp: profile.explorationXP)

        let achievements = checkAchievements(&profile)
        let msg = "Star system '\(anime.starSystemName)' added to \(genre.nebula) \(genre.icon)"

        return ActionResult(xpGained: xp, newChapter: newChapter, storyEvent: event,
                          message: msg, newAchievements: achievements)
    }

    public static func watchEpisodes(_ profile: inout ExplorerProfile, title: String, episodes: Int) -> ActionResult {
        guard let idx = profile.anime.firstIndex(where: { $0.title.lowercased() == title.lowercased() }) else {
            return ActionResult(xpGained: 0, newChapter: false, storyEvent: nil,
                              message: "Anime '\(title)' not found in your star chart.", newAchievements: [])
        }

        if profile.anime[idx].isComplete {
            return ActionResult(xpGained: 0, newChapter: false, storyEvent: nil,
                              message: "'\(title)' is already fully explored!", newAchievements: [])
        }

        let beforeComplete = profile.anime[idx].isComplete
        profile.anime[idx].watchEpisodes(episodes)
        let isCompletion = !beforeComplete && profile.anime[idx].isComplete

        let xp = calculateWatchXP(episodesWatched: episodes, isCompletion: isCompletion)
        let oldChapter = profile.currentChapter
        profile.explorationXP += xp
        profile.currentChapter = getChapterForXP(profile.explorationXP)
        let newChapter = profile.currentChapter > oldChapter
        if newChapter { profile.storyProgress = 0 }

        let trigger = isCompletion ? "complete" : "watch"
        let event = getStoryEvent(trigger: trigger, xp: profile.explorationXP)

        let achievements = checkAchievements(&profile)

        var msg: String
        if isCompletion {
            msg = "Star system '\(profile.anime[idx].starSystemName)' fully explored! (\(title))"
        } else {
            msg = "Explored \(episodes) planet(s) in '\(profile.anime[idx].starSystemName)' (\(profile.anime[idx].watchedEpisodes)/\(profile.anime[idx].totalEpisodes))"
        }

        return ActionResult(xpGained: xp, newChapter: newChapter, storyEvent: event,
                          message: msg, newAchievements: achievements)
    }

    public static func checkAchievements(_ profile: inout ExplorerProfile) -> [String] {
        var newAchievements: [String] = []

        let checks: [(String, Bool)] = [
            ("first_star", profile.totalAnime >= 1),
            ("five_stars", profile.totalAnime >= 5),
            ("ten_stars", profile.totalAnime >= 10),
            ("twenty_stars", profile.totalAnime >= 20),
            ("first_survey", profile.completedAnime >= 1),
            ("five_surveys", profile.completedAnime >= 5),
            ("ten_surveys", profile.completedAnime >= 10),
            ("three_nebulae", profile.uniqueGenres >= 3),
            ("five_nebulae", profile.uniqueGenres >= 5),
            ("ten_nebulae", profile.uniqueGenres >= 10),
            ("hundred_episodes", profile.totalWatchedEpisodes >= 100),
            ("five_hundred_episodes", profile.totalWatchedEpisodes >= 500),
            ("thousand_episodes", profile.totalWatchedEpisodes >= 1000),
            ("ensign", profile.explorationXP >= 100),
            ("lieutenant", profile.explorationXP >= 500),
            ("commander", profile.explorationXP >= 1500),
            ("captain", profile.explorationXP >= 3000),
            ("admiral", profile.explorationXP >= 8000),
        ]

        for (id, met) in checks {
            if met && !profile.achievementsUnlocked.contains(id) {
                profile.achievementsUnlocked.append(id)
                newAchievements.append(id)
            }
        }

        return newAchievements
    }

    public static func getAchievementName(_ id: String) -> String {
        switch id {
        case "first_star": return "🌟 First Light — Added your first anime"
        case "five_stars": return "⭐ Star Cluster — 5 anime cataloged"
        case "ten_stars": return "✨ Constellation — 10 anime cataloged"
        case "twenty_stars": return "🌌 Galaxy Arm — 20 anime cataloged"
        case "first_survey": return "🔭 First Survey — Completed your first anime"
        case "five_surveys": return "📡 Deep Scan — 5 anime completed"
        case "ten_surveys": return "🛰️ Full Spectrum — 10 anime completed"
        case "three_nebulae": return "🌈 Prism — Explored 3 genre nebulae"
        case "five_nebulae": return "💎 Spectrum — Explored 5 genre nebulae"
        case "ten_nebulae": return "🏆 Universal — Explored 10 genre nebulae"
        case "hundred_episodes": return "🚀 Warp Speed — 100 episodes watched"
        case "five_hundred_episodes": return "⚡ Lightspeed — 500 episodes watched"
        case "thousand_episodes": return "💫 Hyperdrive — 1000 episodes watched"
        case "ensign": return "⭐ Ensign — Reached 100 XP"
        case "lieutenant": return "⭐⭐ Lieutenant — Reached 500 XP"
        case "commander": return "🌟 Commander — Reached 1500 XP"
        case "captain": return "🌟🌟 Captain — Reached 3000 XP"
        case "admiral": return "🏅 Admiral — Reached 8000 XP"
        default: return id
        }
    }
}
