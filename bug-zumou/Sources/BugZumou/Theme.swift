import SwiftUI

enum Theme {
    static let bg          = Color(red: 0.07,  green: 0.07,  blue: 0.09)
    static let panel       = Color(red: 0.10,  green: 0.10,  blue: 0.13)
    static let panelStrong = Color(red: 0.13,  green: 0.13,  blue: 0.17)
    static let line        = Color.white.opacity(0.08)
    static let ink         = Color(red: 0.94,  green: 0.93,  blue: 0.88)
    static let inkSoft     = Color(red: 0.74,  green: 0.72,  blue: 0.65)
    static let inkFaint    = Color(red: 0.50,  green: 0.48,  blue: 0.42)
    static let accent      = Color(red: 0.96,  green: 0.55,  blue: 0.27)  // 朱色 (vermillion)
    static let win         = Color(red: 0.46,  green: 0.78,  blue: 0.55)
    static let loss        = Color(red: 0.85,  green: 0.41,  blue: 0.38)
    static let timeout     = Color(red: 0.93,  green: 0.78,  blue: 0.32)
    static let codeBg      = Color(red: 0.06,  green: 0.06,  blue: 0.08)

    static let mono       = Font.system(size: 14, weight: .regular, design: .monospaced)
    static let monoBig    = Font.system(size: 15, weight: .regular, design: .monospaced)
    static let serif      = Font.system(size: 14, design: .serif)
    static let serifTitle = Font.system(size: 22, weight: .medium, design: .serif)
    static let display    = Font.system(size: 36, weight: .light, design: .serif)
    static let label      = Font.system(size: 11, weight: .regular)
    static let labelTight = Font.system(size: 10, weight: .medium)
}
