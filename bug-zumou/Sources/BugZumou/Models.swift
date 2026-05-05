import Foundation

// 部屋 (Stable) — a category of bug.
public enum Stable: String, CaseIterable, Codable, Hashable {
    case nullOrNil = "ぬる怪部屋"
    case offByOne = "一つ違ヰ部屋"
    case equality = "等号部屋"
    case regex = "正規表現部屋"
    case concurrency = "並行ノ宿"
    case typing = "罠ノ型部屋"

    public var symbol: String {
        switch self {
        case .nullOrNil:    return "❍"
        case .offByOne:     return "±"
        case .equality:     return "≡"
        case .regex:        return "⌗"
        case .concurrency:  return "⇄"
        case .typing:       return "▣"
        }
    }

    public var blurb: String {
        switch self {
        case .nullOrNil:    return "ぬるの怪が代々住む。油断すると一突きで負ける。"
        case .offByOne:     return "境界の一手で勝負が決まる。配列の最後の一歩を侮るな。"
        case .equality:     return "イコールが一本か二本か。型と参照を見極めよ。"
        case .regex:        return "正規表現の罠師たち。アンカーと貪欲さを見よ。"
        case .concurrency:  return "並びを崩す力士たち。クロージャの捕まえ方に注意。"
        case .typing:       return "型の入れ替わり、暗黙の変換。地味で根深い。"
        }
    }
}

// 番付 (Rank) — banzuke. Order matters: low → high.
public enum Rank: String, CaseIterable, Codable {
    case jonokuchi  = "序ノ口"
    case jonidan    = "序二段"
    case sandanme   = "三段目"
    case makushita  = "幕下"
    case juryo      = "十両"
    case maegashira = "前頭"
    case komusubi   = "小結"
    case sekiwake   = "関脇"
    case ozeki      = "大関"
    case yokozuna   = "横綱"

    public var threshold: Int {
        switch self {
        case .jonokuchi:  return 0
        case .jonidan:    return 1
        case .sandanme:   return 3
        case .makushita:  return 6
        case .juryo:      return 10
        case .maegashira: return 15
        case .komusubi:   return 22
        case .sekiwake:   return 30
        case .ozeki:      return 40
        case .yokozuna:   return 55
        }
    }

    public static func forStreak(_ streak: Int) -> Rank {
        var current: Rank = .jonokuchi
        for r in Rank.allCases where streak >= r.threshold {
            current = r
        }
        return current
    }

    public var honorific: String {
        switch self {
        case .yokozuna: return "横綱"
        case .ozeki:    return "大関"
        case .sekiwake: return "関脇"
        case .komusubi: return "小結"
        default:        return rawValue
        }
    }
}

// 一番 (Puzzle) — a single match.
public struct Puzzle: Codable, Identifiable, Equatable {
    public let id: String
    public let stable: Stable
    public let language: String   // "Python" / "JavaScript" / etc — display only
    public let lines: [String]    // numbered 1..lines.count visually
    public let buggyLineIndex: Int  // 0-based
    public let wrestler: String   // 力士名 (the bug's "name")
    public let title: String      // bug name in plain Japanese
    public let explanation: String

    public var displayName: String { "\(wrestler) ・ \(stable.rawValue)" }

    public func isCorrect(pickedLineIndex: Int) -> Bool {
        pickedLineIndex == buggyLineIndex
    }
}

// 結果 (Outcome)
public enum Outcome: Codable, Equatable {
    case win        // 勝ち
    case loss       // 負け (clicked wrong line)
    case timeout    // 時間切れ
}
