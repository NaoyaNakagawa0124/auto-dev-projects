import Foundation

public enum Genre: String, Codable, Sendable, CaseIterable {
    case action = "Action"
    case adventure = "Adventure"
    case comedy = "Comedy"
    case drama = "Drama"
    case fantasy = "Fantasy"
    case horror = "Horror"
    case mecha = "Mecha"
    case mystery = "Mystery"
    case romance = "Romance"
    case scifi = "Sci-Fi"
    case sliceOfLife = "Slice of Life"
    case sports = "Sports"
    case thriller = "Thriller"
    case supernatural = "Supernatural"
    case isekai = "Isekai"

    public var nebula: String {
        switch self {
        case .action: return "Blaze Nebula"
        case .adventure: return "Frontier Nebula"
        case .comedy: return "Prism Nebula"
        case .drama: return "Veil Nebula"
        case .fantasy: return "Arcane Nebula"
        case .horror: return "Void Nebula"
        case .mecha: return "Forge Nebula"
        case .mystery: return "Cipher Nebula"
        case .romance: return "Heart Nebula"
        case .scifi: return "Quantum Nebula"
        case .sliceOfLife: return "Solace Nebula"
        case .sports: return "Olympus Nebula"
        case .thriller: return "Storm Nebula"
        case .supernatural: return "Spirit Nebula"
        case .isekai: return "Portal Nebula"
        }
    }

    public var icon: String {
        switch self {
        case .action: return "⚔️"
        case .adventure: return "🗺️"
        case .comedy: return "😄"
        case .drama: return "🎭"
        case .fantasy: return "🧙"
        case .horror: return "👻"
        case .mecha: return "🤖"
        case .mystery: return "🔍"
        case .romance: return "💕"
        case .scifi: return "🚀"
        case .sliceOfLife: return "🌸"
        case .sports: return "⚽"
        case .thriller: return "⚡"
        case .supernatural: return "✨"
        case .isekai: return "🌀"
        }
    }
}

public enum WatchStatus: String, Codable, Sendable {
    case planned = "Planned"
    case watching = "Watching"
    case completed = "Completed"
    case dropped = "Dropped"
}

public struct Anime: Codable, Sendable {
    public var title: String
    public var genre: Genre
    public var totalEpisodes: Int
    public var watchedEpisodes: Int
    public var rating: Int // 1-10
    public var status: WatchStatus
    public var addedDate: String
    public var starSystemName: String

    public init(title: String, genre: Genre, totalEpisodes: Int, rating: Int = 0) {
        self.title = title
        self.genre = genre
        self.totalEpisodes = max(1, totalEpisodes)
        self.watchedEpisodes = 0
        self.rating = max(0, min(10, rating))
        self.status = .planned
        self.addedDate = ISO8601DateFormatter().string(from: Date())
        self.starSystemName = Anime.generateStarName(from: title)
    }

    public var completionPercent: Double {
        guard totalEpisodes > 0 else { return 0 }
        return Double(watchedEpisodes) / Double(totalEpisodes) * 100.0
    }

    public var isComplete: Bool {
        return watchedEpisodes >= totalEpisodes
    }

    public mutating func watchEpisodes(_ count: Int) {
        watchedEpisodes = min(totalEpisodes, watchedEpisodes + max(0, count))
        if watchedEpisodes >= totalEpisodes {
            status = .completed
        } else if watchedEpisodes > 0 {
            status = .watching
        }
    }

    public mutating func setRating(_ r: Int) {
        rating = max(1, min(10, r))
    }

    static func generateStarName(from title: String) -> String {
        let prefixes = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon",
                        "Zeta", "Eta", "Theta", "Iota", "Kappa",
                        "Lambda", "Mu", "Nu", "Xi", "Omicron"]
        let hash = abs(title.hashValue)
        let prefix = prefixes[hash % prefixes.count]
        let suffix = String(title.prefix(3)).uppercased()
        let num = (hash / prefixes.count) % 999 + 1
        return "\(prefix)-\(suffix)-\(num)"
    }
}

public struct ExplorerProfile: Codable, Sendable {
    public var name: String
    public var explorationXP: Int
    public var currentChapter: Int
    public var storyProgress: Int // line within chapter
    public var anime: [Anime]
    public var achievementsUnlocked: [String]

    public init(name: String = "Explorer") {
        self.name = name
        self.explorationXP = 0
        self.currentChapter = 0
        self.storyProgress = 0
        self.anime = []
        self.achievementsUnlocked = []
    }

    public var totalWatchedEpisodes: Int {
        anime.reduce(0) { $0 + $1.watchedEpisodes }
    }

    public var totalAnime: Int {
        anime.count
    }

    public var completedAnime: Int {
        anime.filter { $0.isComplete }.count
    }

    public var uniqueGenres: Int {
        Set(anime.map { $0.genre }).count
    }

    public var averageRating: Double {
        let rated = anime.filter { $0.rating > 0 }
        guard !rated.isEmpty else { return 0 }
        return Double(rated.reduce(0) { $0 + $1.rating }) / Double(rated.count)
    }

    public var estimatedWatchHours: Double {
        // ~24 min per episode average
        return Double(totalWatchedEpisodes) * 24.0 / 60.0
    }

    public var rank: String {
        switch explorationXP {
        case 0..<100: return "Space Cadet"
        case 100..<500: return "Ensign"
        case 500..<1500: return "Lieutenant"
        case 1500..<3000: return "Commander"
        case 3000..<5000: return "Captain"
        case 5000..<8000: return "Commodore"
        case 8000..<12000: return "Rear Admiral"
        default: return "Fleet Admiral"
        }
    }

    public var rankIcon: String {
        switch explorationXP {
        case 0..<100: return "🔰"
        case 100..<500: return "⭐"
        case 500..<1500: return "⭐⭐"
        case 1500..<3000: return "🌟"
        case 3000..<5000: return "🌟🌟"
        case 5000..<8000: return "💫"
        case 8000..<12000: return "🏅"
        default: return "👑"
        }
    }
}
