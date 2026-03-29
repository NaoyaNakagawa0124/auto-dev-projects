import Foundation

public struct Storage: Sendable {
    public static func defaultPath() -> String {
        let home = FileManager.default.homeDirectoryForCurrentUser.path
        return "\(home)/.starlog_data.json"
    }

    public static func load(from path: String? = nil) -> ExplorerProfile {
        let filePath = path ?? defaultPath()
        guard FileManager.default.fileExists(atPath: filePath),
              let data = FileManager.default.contents(atPath: filePath) else {
            return ExplorerProfile()
        }
        do {
            return try JSONDecoder().decode(ExplorerProfile.self, from: data)
        } catch {
            return ExplorerProfile()
        }
    }

    public static func save(_ profile: ExplorerProfile, to path: String? = nil) -> Bool {
        let filePath = path ?? defaultPath()
        do {
            let data = try JSONEncoder().encode(profile)
            return FileManager.default.createFile(atPath: filePath, contents: data)
        } catch {
            return false
        }
    }
}
