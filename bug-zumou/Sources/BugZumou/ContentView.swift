import SwiftUI

struct ContentView: View {
    @EnvironmentObject var game: GameState

    var body: some View {
        ZStack {
            Theme.bg.ignoresSafeArea()
            VStack(spacing: 24) {
                RankHeaderView()
                Spacer(minLength: 0)
                centerArea
                Spacer(minLength: 0)
                bottomBar
            }
            .padding(.horizontal, 28)
            .padding(.vertical, 22)

            if case .revealing(let outcome) = game.phase {
                RevealOverlayView(outcome: outcome)
                    .transition(.opacity.combined(with: .scale(scale: 0.98)))
                    .zIndex(10)
            }
        }
        .animation(.easeInOut(duration: 0.25), value: phaseKey)
    }

    private var phaseKey: String {
        switch game.phase {
        case .idle: return "idle"
        case .playing: return "playing"
        case .revealing(let o): return "revealing-\(o)"
        }
    }

    @ViewBuilder
    private var centerArea: some View {
        switch game.phase {
        case .idle:
            IdleHeroView()
        case .playing, .revealing:
            if let p = game.puzzle {
                VStack(spacing: 18) {
                    PuzzleHeaderView(puzzle: p)
                    CodePanelView(puzzle: p)
                    if case .playing = game.phase {
                        TimerStripView()
                    }
                }
            }
        }
    }

    @ViewBuilder
    private var bottomBar: some View {
        switch game.phase {
        case .idle:
            HStack {
                Spacer()
                Button(action: { game.startMatch() }) {
                    Text("取組を始める")
                        .font(.system(size: 14, weight: .medium))
                        .padding(.horizontal, 28)
                        .padding(.vertical, 14)
                        .frame(minWidth: 220)
                        .background(Theme.accent)
                        .foregroundStyle(Color.black)
                        .clipShape(Capsule())
                }
                .buttonStyle(.plain)
                .keyboardShortcut(.return, modifiers: [])
                Spacer()
            }
        case .playing:
            HStack {
                Text("バグの行をクリック")
                    .font(Theme.label)
                    .foregroundStyle(Theme.inkFaint)
                    .tracking(2)
                Spacer()
                Button("中断", action: { game.cancelToIdle() })
                    .buttonStyle(.plain)
                    .font(Theme.label)
                    .foregroundStyle(Theme.inkFaint)
            }
        case .revealing:
            EmptyView()
        }
    }
}

// ─── Rank header ────────────────────────────────────
struct RankHeaderView: View {
    @EnvironmentObject var game: GameState

    var body: some View {
        HStack(alignment: .firstTextBaseline) {
            VStack(alignment: .leading, spacing: 2) {
                Text("バグずもう")
                    .font(Theme.serifTitle)
                    .foregroundStyle(Theme.ink)
                    .tracking(6)
                Text("BUG-ZUMOU")
                    .font(Theme.labelTight)
                    .foregroundStyle(Theme.inkFaint)
                    .tracking(8)
            }
            Spacer()
            statBlock(label: "番付",  value: game.rank.rawValue, accent: Theme.accent)
            divider
            statBlock(label: "連勝",  value: "\(game.streak)",     accent: Theme.ink)
            divider
            statBlock(label: "最高",  value: "\(game.careerBest)", accent: Theme.inkSoft)
            divider
            statBlock(label: "勝率",
                      value: game.totalMatches == 0 ? "—" :
                             "\(Int(Double(game.totalWins) / Double(game.totalMatches) * 100))%",
                      accent: Theme.inkSoft)
        }
        .padding(.bottom, 8)
        .overlay(alignment: .bottom) {
            Rectangle().fill(Theme.line).frame(height: 1)
        }
    }

    private var divider: some View {
        Rectangle().fill(Theme.line).frame(width: 1, height: 28)
    }

    private func statBlock(label: String, value: String, accent: Color) -> some View {
        VStack(alignment: .center, spacing: 4) {
            Text(label)
                .font(Theme.labelTight)
                .foregroundStyle(Theme.inkFaint)
                .tracking(4)
            Text(value)
                .font(.system(size: 17, weight: .medium, design: .serif))
                .foregroundStyle(accent)
                .monospacedDigit()
        }
        .frame(minWidth: 64)
    }
}

// ─── Idle hero ──────────────────────────────────────
struct IdleHeroView: View {
    @EnvironmentObject var game: GameState

    var body: some View {
        VStack(spacing: 16) {
            Text(game.rank.rawValue)
                .font(Theme.display)
                .foregroundStyle(Theme.ink)
                .tracking(12)

            Text(rankBlurb(game.rank))
                .font(Theme.serif)
                .foregroundStyle(Theme.inkSoft)
                .multilineTextAlignment(.center)
                .frame(maxWidth: 460)
                .lineSpacing(6)

            Text("制限時間 60 秒。バグの行を見抜けば一勝。")
                .font(Theme.label)
                .foregroundStyle(Theme.inkFaint)
                .tracking(2)
                .padding(.top, 4)

            // Stables strip
            HStack(spacing: 10) {
                ForEach(Stable.allCases, id: \.self) { s in
                    VStack(spacing: 4) {
                        Text(s.symbol)
                            .font(.system(size: 16, weight: .light, design: .serif))
                            .foregroundStyle(Theme.accent)
                        Text(s.rawValue)
                            .font(.system(size: 10))
                            .foregroundStyle(Theme.inkFaint)
                            .tracking(1)
                    }
                    .frame(width: 90, height: 52)
                    .background(Theme.panel)
                    .overlay(RoundedRectangle(cornerRadius: 6).stroke(Theme.line, lineWidth: 1))
                    .clipShape(RoundedRectangle(cornerRadius: 6))
                }
            }
            .padding(.top, 24)
        }
    }

    private func rankBlurb(_ r: Rank) -> String {
        switch r {
        case .jonokuchi:  return "土俵の入り口に立つ。\n一勝で序二段、横綱は遠い。"
        case .jonidan:    return "ようこそ序二段。\nまだバグは三勝で三段目。"
        case .sandanme:   return "三段目、勘が冴え始める頃。"
        case .makushita:  return "幕下。次は十両、関取の入り口。"
        case .juryo:      return "十両、関取衆の末席。\n本場所の景色が変わる。"
        case .maegashira: return "前頭。番付表の中央に名がある。"
        case .komusubi:   return "小結。三役の隅に座る。"
        case .sekiwake:   return "関脇。横綱への階段の半ば。"
        case .ozeki:      return "大関。あと一段、しかしその一段が遠い。"
        case .yokozuna:   return "横綱。\n土俵の上で、最も静かな場所。"
        }
    }
}

// ─── Puzzle header ──────────────────────────────────
struct PuzzleHeaderView: View {
    let puzzle: Puzzle

    var body: some View {
        HStack(alignment: .center, spacing: 14) {
            Text(puzzle.stable.symbol)
                .font(.system(size: 22, weight: .regular, design: .serif))
                .foregroundStyle(Theme.accent)
                .frame(width: 32, height: 32)
                .background(Theme.panel)
                .clipShape(Circle())
                .overlay(Circle().stroke(Theme.line, lineWidth: 1))

            VStack(alignment: .leading, spacing: 2) {
                HStack(spacing: 8) {
                    Text(puzzle.stable.rawValue)
                        .font(Theme.serif)
                        .foregroundStyle(Theme.ink)
                        .tracking(3)
                    Text("・")
                        .foregroundStyle(Theme.inkFaint)
                    Text(puzzle.language)
                        .font(Theme.label)
                        .foregroundStyle(Theme.inkFaint)
                        .tracking(2)
                }
                Text(puzzle.stable.blurb)
                    .font(.system(size: 11))
                    .foregroundStyle(Theme.inkFaint)
            }
            Spacer()
        }
    }
}

// ─── Code panel ─────────────────────────────────────
struct CodePanelView: View {
    @EnvironmentObject var game: GameState
    let puzzle: Puzzle

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            ForEach(Array(puzzle.lines.enumerated()), id: \.offset) { idx, line in
                lineRow(idx: idx, line: line)
                if idx < puzzle.lines.count - 1 {
                    Rectangle().fill(Theme.line.opacity(0.4)).frame(height: 1)
                }
            }
        }
        .background(Theme.codeBg)
        .clipShape(RoundedRectangle(cornerRadius: 10))
        .overlay(RoundedRectangle(cornerRadius: 10).stroke(Theme.line, lineWidth: 1))
    }

    @ViewBuilder
    private func lineRow(idx: Int, line: String) -> some View {
        let isPicked = game.pickedLineIndex == idx
        let isBuggy  = puzzle.buggyLineIndex == idx
        let revealed = isRevealing
        HStack(spacing: 0) {
            Text(String(format: "%2d", idx + 1))
                .font(Theme.mono)
                .foregroundStyle(Theme.inkFaint)
                .frame(width: 38, alignment: .trailing)
                .padding(.trailing, 12)
            Text(line.isEmpty ? " " : line)
                .font(Theme.monoBig)
                .foregroundStyle(textColor(picked: isPicked, buggy: isBuggy, revealed: revealed))
                .frame(maxWidth: .infinity, alignment: .leading)
            Spacer(minLength: 0)
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 8)
        .background(rowBackground(picked: isPicked, buggy: isBuggy, revealed: revealed))
        .contentShape(Rectangle())
        .onTapGesture {
            if case .playing = game.phase {
                game.pickLine(idx)
            }
        }
        .onHover { hovering in
            if hovering, case .playing = game.phase {
                NSCursor.pointingHand.set()
            }
        }
    }

    private var isRevealing: Bool {
        if case .revealing = game.phase { return true }
        return false
    }

    private func textColor(picked: Bool, buggy: Bool, revealed: Bool) -> Color {
        if revealed && buggy { return Theme.win }
        if revealed && picked && !buggy { return Theme.loss }
        return Theme.ink
    }

    private func rowBackground(picked: Bool, buggy: Bool, revealed: Bool) -> Color {
        if revealed && buggy { return Theme.win.opacity(0.16) }
        if revealed && picked && !buggy { return Theme.loss.opacity(0.16) }
        if picked { return Theme.accent.opacity(0.18) }
        return .clear
    }
}

// ─── Timer strip ────────────────────────────────────
struct TimerStripView: View {
    @EnvironmentObject var game: GameState

    var body: some View {
        let total = 60.0
        let remaining = max(0, game.timeRemaining)
        let fraction = remaining / total
        let lowTime = remaining < 15
        VStack(spacing: 6) {
            HStack {
                Text("残り")
                    .font(Theme.labelTight)
                    .foregroundStyle(Theme.inkFaint)
                    .tracking(3)
                Spacer()
                Text(String(format: "%.1f s", remaining))
                    .font(.system(size: 13, weight: .medium, design: .monospaced))
                    .monospacedDigit()
                    .foregroundStyle(lowTime ? Theme.timeout : Theme.ink)
            }
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Capsule().fill(Theme.panel)
                    Capsule()
                        .fill(lowTime ? Theme.timeout : Theme.accent)
                        .frame(width: max(2, geo.size.width * fraction))
                        .animation(.linear(duration: 0.1), value: fraction)
                }
            }
            .frame(height: 4)
        }
    }
}

// ─── Reveal overlay ─────────────────────────────────
struct RevealOverlayView: View {
    @EnvironmentObject var game: GameState
    let outcome: Outcome

    var body: some View {
        if let p = game.puzzle {
            ZStack {
                Theme.bg.opacity(0.78).ignoresSafeArea()
                VStack(spacing: 14) {
                    outcomeBadge

                    Text(p.wrestler)
                        .font(.system(size: 30, weight: .medium, design: .serif))
                        .foregroundStyle(outcomeColor)
                        .tracking(3)
                        .padding(.top, 4)

                    Text(p.stable.rawValue + " ・ " + p.title)
                        .font(Theme.serif)
                        .foregroundStyle(Theme.ink)
                        .tracking(2)

                    Text(p.explanation)
                        .font(.system(size: 13))
                        .foregroundStyle(Theme.inkSoft)
                        .multilineTextAlignment(.leading)
                        .lineSpacing(6)
                        .frame(maxWidth: 540)
                        .padding(.top, 4)

                    HStack(spacing: 14) {
                        Button(action: { game.cancelToIdle() }) {
                            Text("土俵を降りる")
                                .font(.system(size: 13))
                                .frame(minWidth: 130)
                                .padding(.vertical, 12)
                                .background(Theme.panel)
                                .foregroundStyle(Theme.inkSoft)
                                .overlay(Capsule().stroke(Theme.line, lineWidth: 1))
                                .clipShape(Capsule())
                        }
                        .buttonStyle(.plain)

                        Button(action: { game.nextMatch() }) {
                            Text("次の取組")
                                .font(.system(size: 13, weight: .medium))
                                .frame(minWidth: 130)
                                .padding(.vertical, 12)
                                .background(Theme.accent)
                                .foregroundStyle(.black)
                                .clipShape(Capsule())
                        }
                        .buttonStyle(.plain)
                        .keyboardShortcut(.return, modifiers: [])
                    }
                    .padding(.top, 18)
                }
                .padding(36)
                .frame(maxWidth: 620)
                .background(Theme.panelStrong)
                .overlay(RoundedRectangle(cornerRadius: 14).stroke(Theme.line, lineWidth: 1))
                .clipShape(RoundedRectangle(cornerRadius: 14))
                .shadow(color: .black.opacity(0.5), radius: 30, y: 12)
            }
        }
    }

    private var outcomeColor: Color {
        switch outcome {
        case .win: return Theme.win
        case .loss: return Theme.loss
        case .timeout: return Theme.timeout
        }
    }

    private var outcomeBadge: some View {
        HStack(spacing: 10) {
            Image(systemName: outcomeIcon)
                .font(.system(size: 18, weight: .medium))
            Text(outcomeText)
                .font(.system(size: 14, weight: .medium))
                .tracking(8)
        }
        .foregroundStyle(outcomeColor)
        .padding(.horizontal, 18)
        .padding(.vertical, 8)
        .background(outcomeColor.opacity(0.10))
        .overlay(Capsule().stroke(outcomeColor.opacity(0.5), lineWidth: 1))
        .clipShape(Capsule())
    }

    private var outcomeIcon: String {
        switch outcome {
        case .win: return "checkmark.seal.fill"
        case .loss: return "xmark.octagon.fill"
        case .timeout: return "hourglass"
        }
    }

    private var outcomeText: String {
        switch outcome {
        case .win: return "勝ち越し"
        case .loss: return "黒星"
        case .timeout: return "時間切れ"
        }
    }
}
