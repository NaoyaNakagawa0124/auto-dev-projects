import Foundation

public class Storage {
    public let dataDirectory: String
    public let dataFilePath: String

    public init(directory: String? = nil) {
        if let dir = directory {
            self.dataDirectory = dir
        } else {
            let home = FileManager.default.homeDirectoryForCurrentUser.path
            self.dataDirectory = "\(home)/.wancostar"
        }
        self.dataFilePath = "\(dataDirectory)/data.json"
    }

    public func load() -> WalkLog {
        let fm = FileManager.default

        guard fm.fileExists(atPath: dataFilePath),
              let data = fm.contents(atPath: dataFilePath) else {
            return WalkLog()
        }

        do {
            let decoder = JSONDecoder()
            return try decoder.decode(WalkLog.self, from: data)
        } catch {
            printColored("\(WancostarText.fileError) (\(error.localizedDescription))", color: ANSI.red)
            return WalkLog()
        }
    }

    public func save(_ log: WalkLog) {
        let fm = FileManager.default

        // Create directory if needed
        if !fm.fileExists(atPath: dataDirectory) {
            do {
                try fm.createDirectory(atPath: dataDirectory, withIntermediateDirectories: true)
            } catch {
                printColored("\(WancostarText.fileError) (\(error.localizedDescription))", color: ANSI.red)
                return
            }
        }

        do {
            let encoder = JSONEncoder()
            encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
            let data = try encoder.encode(log)

            // Atomic write via temp file
            let tempPath = "\(dataFilePath).tmp"
            fm.createFile(atPath: tempPath, contents: data)
            if fm.fileExists(atPath: dataFilePath) {
                try fm.removeItem(atPath: dataFilePath)
            }
            try fm.moveItem(atPath: tempPath, toPath: dataFilePath)
        } catch {
            printColored("\(WancostarText.fileError) (\(error.localizedDescription))", color: ANSI.red)
        }
    }

    public func exportJSON() -> String? {
        let log = load()
        do {
            let encoder = JSONEncoder()
            encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
            let data = try encoder.encode(log)
            return String(data: data, encoding: .utf8)
        } catch {
            return nil
        }
    }

    public func importJSON(from path: String) -> Bool {
        let fm = FileManager.default
        guard let data = fm.contents(atPath: path) else {
            return false
        }

        do {
            let decoder = JSONDecoder()
            let imported = try decoder.decode(WalkLog.self, from: data)
            var current = load()

            // Merge walks (avoid duplicates by ID)
            let existingIds = Set(current.walks.map { $0.id })
            let newWalks = imported.walks.filter { !existingIds.contains($0.id) }
            current.walks.append(contentsOf: newWalks)
            current.walks.sort { $0.date > $1.date }

            // Use imported dog profile if current doesn't have one
            if current.dog == nil {
                current.dog = imported.dog
            }

            save(current)
            return true
        } catch {
            return false
        }
    }
}
