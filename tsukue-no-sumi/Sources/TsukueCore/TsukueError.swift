import Foundation

public enum TsukueError: Error, Equatable, CustomStringConvertible {
    case alreadyRunning(client: String)
    case nothingRunning
    case emptyClient
    case invalidArgument(String)
    case ioFailure(String)
    case notFound(String)

    public var description: String {
        switch self {
        case .alreadyRunning(let c):
            return "すでに 進行中 の セッション が あります (client: \(c))。 先 に tsukue stop で 終わら せて ください。"
        case .nothingRunning:
            return "進行中 の セッション は ありません。"
        case .emptyClient:
            return "client 名 が 空 です。"
        case .invalidArgument(let s):
            return "引数 が おかしい: \(s)"
        case .ioFailure(let s):
            return "ファイル の 読み書き に 失敗: \(s)"
        case .notFound(let s):
            return "見つかり ません: \(s)"
        }
    }
}
