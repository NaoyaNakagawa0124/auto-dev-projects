import Foundation

public struct Session: Codable, Equatable, Identifiable {
    public let id: UUID
    public let client: String
    public let task: String?
    public let startedAt: Date
    public var endedAt: Date?

    public init(
        id: UUID = UUID(),
        client: String,
        task: String? = nil,
        startedAt: Date = Date(),
        endedAt: Date? = nil
    ) {
        self.id = id
        self.client = client
        self.task = task
        self.startedAt = startedAt
        self.endedAt = endedAt
    }

    public var isRunning: Bool { endedAt == nil }

    /// 秒数。 進行中 なら 今 まで の 経過 を 返す (now を 渡す)
    public func durationSeconds(now: Date = Date()) -> Int {
        let end = endedAt ?? now
        return max(0, Int(end.timeIntervalSince(startedAt)))
    }
}
