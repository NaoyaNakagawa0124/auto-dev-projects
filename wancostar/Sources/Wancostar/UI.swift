import Foundation

public struct ANSI {
    public static let reset = "\u{1b}[0m"
    public static let bold = "\u{1b}[1m"
    public static let dim = "\u{1b}[2m"
    public static let red = "\u{1b}[31m"
    public static let green = "\u{1b}[32m"
    public static let yellow = "\u{1b}[33m"
    public static let blue = "\u{1b}[34m"
    public static let magenta = "\u{1b}[35m"
    public static let cyan = "\u{1b}[36m"
    public static let white = "\u{1b}[37m"
    public static let gold = "\u{1b}[33;1m"
    public static let brightWhite = "\u{1b}[97m"
    public static let bgBlue = "\u{1b}[44m"
}

public func prompt(_ message: String) -> String {
    print(message, terminator: "")
    return readLine() ?? ""
}

public func promptInt(_ message: String, range: ClosedRange<Int>) -> Int {
    while true {
        let input = prompt(message)
        if let value = Int(input), range.contains(value) {
            return value
        }
        print(WancostarText.invalidInput)
    }
}

public func promptDouble(_ message: String) -> Double {
    while true {
        let input = prompt(message)
        if let value = Double(input), value >= 0 {
            return value
        }
        print(WancostarText.invalidInput)
    }
}

public func printColored(_ text: String, color: String) {
    print("\(color)\(text)\(ANSI.reset)")
}

public func printBox(title: String, lines: [String]) {
    // Calculate the max width needed
    let titleLen = displayWidth(title)
    let maxLineLen = lines.map { displayWidth($0) }.max() ?? 0
    let innerWidth = max(titleLen + 2, maxLineLen + 2, 40)

    let top = "╔" + String(repeating: "═", count: innerWidth) + "╗"
    let titlePad = innerWidth - titleLen - 2
    let titleLine = "║  \(ANSI.bold)\(title)\(ANSI.reset)" + String(repeating: " ", count: max(0, titlePad)) + "║"
    let sep = "╠" + String(repeating: "═", count: innerWidth) + "╣"
    let bottom = "╚" + String(repeating: "═", count: innerWidth) + "╝"

    print(top)
    print(titleLine)
    print(sep)
    for line in lines {
        let pad = innerWidth - displayWidth(line) - 2
        print("║  \(line)" + String(repeating: " ", count: max(0, pad)) + "║")
    }
    print(bottom)
}

public func printTable(headers: [String], rows: [[String]], title: String? = nil) {
    // Calculate column widths
    var colWidths = headers.map { displayWidth($0) }
    for row in rows {
        for (i, cell) in row.enumerated() where i < colWidths.count {
            colWidths[i] = max(colWidths[i], displayWidth(cell))
        }
    }
    // Add padding
    colWidths = colWidths.map { $0 + 2 }

    let totalWidth = colWidths.reduce(0, +) + colWidths.count + 1

    // Top border
    if let title = title {
        print("╔" + String(repeating: "═", count: totalWidth - 2) + "╗")
        let titlePad = totalWidth - 2 - displayWidth(title) - 2
        print("║  \(ANSI.bold)\(title)\(ANSI.reset)" + String(repeating: " ", count: max(0, titlePad)) + "║")
    }

    // Header separator
    var headerSep = title != nil ? "╠" : "╔"
    for (i, w) in colWidths.enumerated() {
        headerSep += String(repeating: "═", count: w)
        headerSep += (i < colWidths.count - 1) ? "╦" : (title != nil ? "╣" : "╗")
    }
    print(headerSep)

    // Header row
    var headerLine = "║"
    for (i, header) in headers.enumerated() {
        let pad = colWidths[i] - displayWidth(header) - 1
        headerLine += " \(ANSI.bold)\(header)\(ANSI.reset)" + String(repeating: " ", count: max(0, pad)) + "║"
    }
    print(headerLine)

    // Header-data separator
    var dataSep = "╠"
    for (i, w) in colWidths.enumerated() {
        dataSep += String(repeating: "═", count: w)
        dataSep += (i < colWidths.count - 1) ? "╬" : "╣"
    }
    print(dataSep)

    // Data rows
    for row in rows {
        var line = "║"
        for (i, cell) in row.enumerated() where i < colWidths.count {
            let pad = colWidths[i] - displayWidth(cell) - 1
            line += " \(cell)" + String(repeating: " ", count: max(0, pad)) + "║"
        }
        // Fill missing columns
        if row.count < colWidths.count {
            for i in row.count..<colWidths.count {
                line += String(repeating: " ", count: colWidths[i]) + "║"
            }
        }
        print(line)
    }

    // Bottom border
    var bottomLine = "╚"
    for (i, w) in colWidths.enumerated() {
        bottomLine += String(repeating: "═", count: w)
        bottomLine += (i < colWidths.count - 1) ? "╩" : "╝"
    }
    print(bottomLine)
}

/// Approximate display width accounting for wide CJK characters and emoji
public func displayWidth(_ s: String) -> Int {
    var width = 0
    var inEscape = false
    for scalar in s.unicodeScalars {
        if scalar == "\u{1b}" {
            inEscape = true
            continue
        }
        if inEscape {
            if scalar == "m" {
                inEscape = false
            }
            continue
        }
        let v = scalar.value
        // CJK, emoji, and wide characters
        if (v >= 0x1100 && v <= 0x115F) ||
           (v >= 0x2E80 && v <= 0x9FFF) ||
           (v >= 0xAC00 && v <= 0xD7AF) ||
           (v >= 0xF900 && v <= 0xFAFF) ||
           (v >= 0xFE10 && v <= 0xFE6F) ||
           (v >= 0xFF01 && v <= 0xFF60) ||
           (v >= 0xFFE0 && v <= 0xFFE6) ||
           (v >= 0x1F000 && v <= 0x1FAFF) ||
           (v >= 0x20000 && v <= 0x2FA1F) {
            width += 2
        } else if v >= 0xFE00 && v <= 0xFE0F {
            // Variation selectors - no width
        } else if v == 0x200D {
            // Zero-width joiner
        } else {
            width += 1
        }
    }
    return width
}

public func progressBar(_ value: Double, maxValue: Double = 5.0, width: Int = 5) -> String {
    let filled = Int((value / maxValue) * Double(width))
    let empty = width - filled
    return String(repeating: "█", count: filled) + String(repeating: "░", count: empty)
}

public func starChar(size: Int) -> String {
    switch size {
    case 1: return "·"
    case 2: return "∗"
    case 3: return "✧"
    case 4: return "✦"
    default: return "★"
    }
}

public func todayString() -> String {
    let formatter = DateFormatter()
    formatter.dateFormat = "yyyy-MM-dd"
    return formatter.string(from: Date())
}

public func formatDate(_ dateStr: String) -> String {
    // "YYYY-MM-DD" -> "MM/DD"
    let parts = dateStr.split(separator: "-")
    guard parts.count == 3 else { return dateStr }
    return "\(parts[1])/\(parts[2])"
}
