import Foundation

public struct Dog: Codable, Equatable {
    public var name: String
    public var breed: String
    public var birthday: String?  // "YYYY-MM-DD"
    public var emoji: String      // "🐕" "🐩" "🦮" etc.

    public init(name: String, breed: String, birthday: String? = nil, emoji: String = "🐕") {
        self.name = name
        self.breed = breed
        self.birthday = birthday
        self.emoji = emoji
    }
}

public struct Walk: Codable, Equatable {
    public let id: String         // UUID string
    public let date: String       // "YYYY-MM-DD"
    public let time: String       // "HH:MM"
    public var duration: Int       // minutes
    public var distance: Double    // km (estimated)
    public var mood: Int           // 1-5 (dog's happiness)
    public var routeType: RouteType
    public var notes: String
    public var infrastructure: InfraRating

    public var starSize: Int {
        if duration < 15 { return 1 }
        if duration < 30 { return 2 }
        if duration < 45 { return 3 }
        if duration < 60 { return 4 }
        return 5
    }

    public var yearMonth: String {
        String(date.prefix(7))  // "YYYY-MM"
    }

    public init(
        id: String = UUID().uuidString,
        date: String,
        time: String,
        duration: Int,
        distance: Double,
        mood: Int,
        routeType: RouteType,
        notes: String = "",
        infrastructure: InfraRating = InfraRating(sidewalk: 3, shade: 3, dogFriendly: 3)
    ) {
        self.id = id
        self.date = date
        self.time = time
        self.duration = duration
        self.distance = distance
        self.mood = mood
        self.routeType = routeType
        self.notes = notes
        self.infrastructure = infrastructure
    }
}

public enum RouteType: String, Codable, CaseIterable {
    case park = "park"
    case neighborhood = "neighborhood"
    case river = "river"
    case mountain = "mountain"
    case city = "city"
    case beach = "beach"

    public var label: String {
        switch self {
        case .park: return "🌳 公園"
        case .neighborhood: return "🏘️ 近所"
        case .river: return "🌊 川沿い"
        case .mountain: return "⛰️ 山道"
        case .city: return "🏙️ 街中"
        case .beach: return "🏖️ 海岸"
        }
    }

    public var starColor: String {
        switch self {
        case .park: return "\u{1b}[32m"
        case .neighborhood: return "\u{1b}[33m"
        case .river: return "\u{1b}[36m"
        case .mountain: return "\u{1b}[35m"
        case .city: return "\u{1b}[37m"
        case .beach: return "\u{1b}[34m"
        }
    }

    public var legendColor: String {
        switch self {
        case .park: return "緑"
        case .neighborhood: return "黄"
        case .river: return "シアン"
        case .mountain: return "マゼンタ"
        case .city: return "白"
        case .beach: return "青"
        }
    }
}

public struct InfraRating: Codable, Equatable {
    public var sidewalk: Int    // 1-5: 歩道の状態
    public var shade: Int       // 1-5: 日陰の多さ
    public var dogFriendly: Int // 1-5: 犬に優しい度

    public init(sidewalk: Int, shade: Int, dogFriendly: Int) {
        self.sidewalk = max(1, min(5, sidewalk))
        self.shade = max(1, min(5, shade))
        self.dogFriendly = max(1, min(5, dogFriendly))
    }
}

public struct WalkLog: Codable {
    public var dog: Dog?
    public var walks: [Walk]
    public var createdAt: String

    public init(dog: Dog? = nil, walks: [Walk] = [], createdAt: String? = nil) {
        self.dog = dog
        self.walks = walks
        self.createdAt = createdAt ?? ISO8601DateFormatter().string(from: Date())
    }
}
