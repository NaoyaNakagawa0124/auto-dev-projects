import Foundation

public enum BannedWords {
    public static let list: [String] = [
        "連勝",
        "ストリーク",
        "達成 度",
        "達成度",
        "集中 度",
        "集中度",
        "効率",
        "サボり",
        "怠ける",
        "頑張れ",
        "神 レベル",
        "神レベル"
    ]

    /// 文字列 に NG ワード が ある か。 ある なら 最初 に 当たった ワード を 返す
    public static func find(in s: String) -> String? {
        for w in list {
            if s.contains(w) { return w }
        }
        return nil
    }

    /// 複数 の 文字列 を 一括 監査
    public static func auditAll(_ strings: [String]) -> [(value: String, hit: String)] {
        var hits: [(String, String)] = []
        for s in strings {
            if let h = find(in: s) {
                hits.append((s, h))
            }
        }
        return hits
    }
}
