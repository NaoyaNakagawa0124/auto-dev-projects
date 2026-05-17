import Foundation

public final class SessionStore {
    public let path: URL
    private let fm: FileManager
    private let encoder: JSONEncoder
    private let decoder: JSONDecoder

    public init(path: URL, fileManager: FileManager = .default) {
        self.path = path
        self.fm = fileManager
        let enc = JSONEncoder()
        enc.outputFormatting = [.prettyPrinted, .sortedKeys]
        enc.dateEncodingStrategy = .iso8601
        self.encoder = enc
        let dec = JSONDecoder()
        dec.dateDecodingStrategy = .iso8601
        self.decoder = dec
    }

    /// ~/.tsukue-no-sumi/sessions.json (TSUKUE_DATA で 上書き 可)
    public static func defaultPath(env: [String: String] = ProcessInfo.processInfo.environment) -> URL {
        if let custom = env["TSUKUE_DATA"], !custom.isEmpty {
            return URL(fileURLWithPath: custom)
        }
        let home: URL
        if let h = env["HOME"], !h.isEmpty {
            home = URL(fileURLWithPath: h)
        } else {
            home = URL(fileURLWithPath: NSHomeDirectory())
        }
        return home.appendingPathComponent(".tsukue-no-sumi").appendingPathComponent("sessions.json")
    }

    public func load() throws -> [Session] {
        guard fm.fileExists(atPath: path.path) else { return [] }
        do {
            let data = try Data(contentsOf: path)
            if data.isEmpty { return [] }
            let store = try decoder.decode(StoreFile.self, from: data)
            return store.sessions
        } catch {
            throw TsukueError.ioFailure("読み込み 失敗: \(error.localizedDescription)")
        }
    }

    public func save(_ sessions: [Session]) throws {
        let dir = path.deletingLastPathComponent()
        if !fm.fileExists(atPath: dir.path) {
            do {
                try fm.createDirectory(at: dir, withIntermediateDirectories: true)
            } catch {
                throw TsukueError.ioFailure("ディレクトリ 作成 失敗: \(error.localizedDescription)")
            }
        }
        let store = StoreFile(sessions: sessions)
        do {
            let data = try encoder.encode(store)
            let tmp = path.appendingPathExtension("tmp")
            try data.write(to: tmp, options: .atomic)
            if fm.fileExists(atPath: path.path) {
                try fm.removeItem(at: path)
            }
            try fm.moveItem(at: tmp, to: path)
        } catch let e as TsukueError {
            throw e
        } catch {
            throw TsukueError.ioFailure("書き込み 失敗: \(error.localizedDescription)")
        }
    }

    public func forget() throws {
        if fm.fileExists(atPath: path.path) {
            do {
                try fm.removeItem(at: path)
            } catch {
                throw TsukueError.ioFailure("削除 失敗: \(error.localizedDescription)")
            }
        }
    }

    public func runningSession(in sessions: [Session]? = nil) throws -> Session? {
        let list = try sessions ?? load()
        return list.first(where: { $0.isRunning })
    }

    public func start(client: String, task: String?, now: Date = Date()) throws -> Session {
        let trimmed = client.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed.isEmpty { throw TsukueError.emptyClient }
        var list = try load()
        if let running = list.first(where: { $0.isRunning }) {
            throw TsukueError.alreadyRunning(client: running.client)
        }
        let taskTrim = task?.trimmingCharacters(in: .whitespacesAndNewlines)
        let session = Session(
            client: trimmed,
            task: (taskTrim?.isEmpty ?? true) ? nil : taskTrim,
            startedAt: now
        )
        list.append(session)
        try save(list)
        return session
    }

    public func stop(now: Date = Date()) throws -> Session {
        var list = try load()
        guard let idx = list.firstIndex(where: { $0.isRunning }) else {
            throw TsukueError.nothingRunning
        }
        var s = list[idx]
        if now < s.startedAt {
            throw TsukueError.invalidArgument("終了 時刻 が 開始 時刻 より 前 です")
        }
        s.endedAt = now
        list[idx] = s
        try save(list)
        return s
    }

    public func cancel() throws -> Session {
        var list = try load()
        guard let idx = list.firstIndex(where: { $0.isRunning }) else {
            throw TsukueError.nothingRunning
        }
        let s = list.remove(at: idx)
        try save(list)
        return s
    }

    private struct StoreFile: Codable {
        let sessions: [Session]
    }
}
