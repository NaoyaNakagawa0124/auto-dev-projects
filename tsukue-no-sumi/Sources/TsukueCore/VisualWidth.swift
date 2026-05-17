import Foundation

/// ターミナル 表示 で の 文字幅 (CJK = 2、 ASCII = 1)
public enum VisualWidth {
    public static func of(_ s: String) -> Int {
        var w = 0
        for ch in s.unicodeScalars {
            w += widthOf(ch)
        }
        return w
    }

    private static func widthOf(_ u: Unicode.Scalar) -> Int {
        let v = u.value
        // 制御 文字 は 0
        if v < 0x20 || v == 0x7F { return 0 }
        // CJK / 全角 範囲
        if (0x1100...0x115F).contains(v) { return 2 }            // Hangul Jamo
        if (0x2E80...0x303E).contains(v) { return 2 }            // CJK Radicals / Kangxi
        if (0x3041...0x33FF).contains(v) { return 2 }            // Hiragana/Katakana/CJK Symbols
        if (0x3400...0x4DBF).contains(v) { return 2 }            // CJK Ext A
        if (0x4E00...0x9FFF).contains(v) { return 2 }            // CJK Unified
        if (0xA000...0xA4CF).contains(v) { return 2 }            // Yi
        if (0xAC00...0xD7A3).contains(v) { return 2 }            // Hangul Syllables
        if (0xF900...0xFAFF).contains(v) { return 2 }            // CJK Compatibility
        if (0xFE30...0xFE4F).contains(v) { return 2 }            // CJK Compatibility Forms
        if (0xFF00...0xFF60).contains(v) { return 2 }            // Fullwidth Forms
        if (0xFFE0...0xFFE6).contains(v) { return 2 }            // Fullwidth Signs
        if (0x20000...0x2FFFD).contains(v) { return 2 }          // CJK Ext B-F
        if (0x30000...0x3FFFD).contains(v) { return 2 }          // CJK Ext G+
        return 1
    }

    /// 視覚 幅 を 揃える padding (右側 に スペース)、 はみ 出し は `…`
    public static func padOrTruncate(_ s: String, width: Int) -> String {
        let w = of(s)
        if w == width { return s }
        if w < width {
            return s + String(repeating: " ", count: width - w)
        }
        // 切り詰め
        var out = ""
        var acc = 0
        let ellipsis = "…"
        let ellipsisW = of(ellipsis)
        for ch in s {
            let cw = of(String(ch))
            if acc + cw + ellipsisW > width { break }
            out.append(ch)
            acc += cw
        }
        out.append(ellipsis)
        // 万一 足りなければ space で 埋める
        let finalW = of(out)
        if finalW < width {
            out.append(String(repeating: " ", count: width - finalW))
        }
        return out
    }
}
