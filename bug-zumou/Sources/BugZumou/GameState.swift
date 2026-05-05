import Foundation
import Combine

@MainActor
public final class GameState: ObservableObject {

    public enum Phase: Equatable {
        case idle              // not in a match — waiting on user
        case playing           // showing puzzle, timer ticking
        case revealing(Outcome) // showing result, waiting for next
    }

    @Published public private(set) var phase: Phase = .idle
    @Published public private(set) var puzzle: Puzzle?
    @Published public private(set) var streak: Int = 0
    @Published public private(set) var careerBest: Int = 0
    @Published public private(set) var totalMatches: Int = 0
    @Published public private(set) var totalWins: Int = 0
    @Published public private(set) var pickedLineIndex: Int? = nil
    @Published public private(set) var timeRemaining: Double = 60.0

    public var rank: Rank { Rank.forStreak(streak) }
    public var careerRank: Rank { Rank.forStreak(careerBest) }

    private let matchSeconds: Double = 60.0
    private var timer: Timer?
    private var recentIDs: [String] = []  // last 6 puzzle IDs to avoid repeats

    private let defaults: UserDefaults
    private let storeKeyStreak       = "bugzumou.streak"
    private let storeKeyBest         = "bugzumou.best"
    private let storeKeyMatches      = "bugzumou.matches"
    private let storeKeyWins         = "bugzumou.wins"

    public init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
        self.streak       = defaults.integer(forKey: storeKeyStreak)
        self.careerBest   = defaults.integer(forKey: storeKeyBest)
        self.totalMatches = defaults.integer(forKey: storeKeyMatches)
        self.totalWins    = defaults.integer(forKey: storeKeyWins)
    }

    deinit {
        timer?.invalidate()
    }

    // ─── Public actions ────────────────────────────────
    public func startMatch() {
        let p = pickPuzzle()
        puzzle = p
        recentIDs.append(p.id)
        if recentIDs.count > 6 { recentIDs.removeFirst() }
        pickedLineIndex = nil
        timeRemaining = matchSeconds
        phase = .playing
        startTimer()
    }

    public func pickLine(_ index: Int) {
        guard case .playing = phase, let p = puzzle else { return }
        pickedLineIndex = index
        stopTimer()
        if p.isCorrect(pickedLineIndex: index) {
            streak += 1
            totalWins += 1
            totalMatches += 1
            if streak > careerBest { careerBest = streak }
            phase = .revealing(.win)
        } else {
            streak = 0
            totalMatches += 1
            phase = .revealing(.loss)
        }
        persist()
    }

    public func reset() {
        streak = 0
        careerBest = 0
        totalMatches = 0
        totalWins = 0
        recentIDs.removeAll()
        phase = .idle
        puzzle = nil
        pickedLineIndex = nil
        persist()
    }

    public func nextMatch() {
        startMatch()
    }

    public func cancelToIdle() {
        stopTimer()
        phase = .idle
        puzzle = nil
        pickedLineIndex = nil
    }

    // ─── Internals ─────────────────────────────────────
    public func pickPuzzle<G: RandomNumberGenerator>(rng: inout G) -> Puzzle {
        let pool = Corpus.all.filter { !recentIDs.contains($0.id) }
        let candidates = pool.isEmpty ? Corpus.all : pool
        return candidates.randomElement(using: &rng) ?? Corpus.all[0]
    }

    public func _testRecordRecent(_ id: String) {
        recentIDs.append(id)
        if recentIDs.count > 6 { recentIDs.removeFirst() }
    }

    private func pickPuzzle() -> Puzzle {
        var rng = SystemRandomNumberGenerator()
        return pickPuzzle(rng: &rng)
    }

    private func startTimer() {
        stopTimer()
        let t = Timer(timeInterval: 0.1, repeats: true) { [weak self] _ in
            Task { @MainActor [weak self] in
                self?.tick()
            }
        }
        RunLoop.main.add(t, forMode: .common)
        timer = t
    }

    private func stopTimer() {
        timer?.invalidate()
        timer = nil
    }

    private func tick() {
        guard case .playing = phase else { return }
        timeRemaining -= 0.1
        if timeRemaining <= 0 {
            timeRemaining = 0
            handleTimeout()
        }
    }

    private func handleTimeout() {
        stopTimer()
        streak = 0
        totalMatches += 1
        phase = .revealing(.timeout)
        persist()
    }

    private func persist() {
        defaults.set(streak,       forKey: storeKeyStreak)
        defaults.set(careerBest,   forKey: storeKeyBest)
        defaults.set(totalMatches, forKey: storeKeyMatches)
        defaults.set(totalWins,    forKey: storeKeyWins)
    }
}
