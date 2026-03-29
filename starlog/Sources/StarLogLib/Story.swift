import Foundation

public struct StoryChapter: Sendable {
    public let id: Int
    public let title: String
    public let xpRequired: Int
    public let narrative: [String]
    public let milestone: String
}

public let storyChapters: [StoryChapter] = [
    StoryChapter(
        id: 0,
        title: "First Light",
        xpRequired: 0,
        narrative: [
            "Captain's Log, Stardate 2026.088.",
            "You awaken aboard the research vessel 'Otaku Maru', orbiting Earth.",
            "The ship's AI, NAVI, greets you: \"Welcome aboard, Explorer.\"",
            "\"Your mission: chart the Anime Universe — a cosmos where every story is a star.\"",
            "\"Each anime you discover becomes a star system in your personal galaxy map.\"",
            "Through the viewport, you see the first nebula shimmering in the distance.",
            "NAVI adds: \"Just as Artemis 2 carries humans around the Moon...\"",
            "\"...you will carry stories across the stars. Begin your exploration.\""
        ],
        milestone: "Add your first anime to begin the journey."
    ),
    StoryChapter(
        id: 1,
        title: "The First Nebula",
        xpRequired: 100,
        narrative: [
            "Your first nebula comes into view — a swirling cloud of genre-light.",
            "NAVI analyzes the spectral signatures: stories emit unique wavelengths.",
            "\"Action anime burn red. Romance glows pink. Sci-fi pulses blue.\"",
            "You name the nebula after its dominant genre. It's YOUR discovery.",
            "A transmission crackles in: \"This is Mission Control. JWST has found something.\"",
            "\"A red galaxy at redshift 11.45 — light from when the universe was young.\"",
            "\"Just as those ancient photons traveled billions of years to reach us...\"",
            "\"...the stories you explore have traveled through decades of creators' hearts.\""
        ],
        milestone: "Explore 3 different genre nebulae."
    ),
    StoryChapter(
        id: 2,
        title: "Lightning of Jupiter",
        xpRequired: 500,
        narrative: [
            "The Otaku Maru passes through a turbulent sector of the Anime Universe.",
            "Electromagnetic storms rage — NAVI identifies them as 'genre clashes.'",
            "\"Recent Juno data shows Jupiter's lightning is a million times stronger than Earth's.\"",
            "\"Similarly, when genres collide — action meets romance, horror meets comedy —\"",
            "\"— the resulting stories are often the most powerful of all.\"",
            "You watch as two genre-nebulae interact, their colors merging into something new.",
            "NAVI: \"Your watch history shows range, Explorer. That's how you find the best stories.\"",
            "\"The universe rewards those who explore beyond their comfort nebula.\""
        ],
        milestone: "Watch episodes across 5+ genres."
    ),
    StoryChapter(
        id: 3,
        title: "The Lunar Archive",
        xpRequired: 1500,
        narrative: [
            "You discover an ancient station orbiting a barren moon: The Archive.",
            "Inside: records of every anime ever created, etched in light-crystal.",
            "NAVI: \"NASA is searching for ice at the Moon's south pole with subatomic particles.\"",
            "\"They're detecting what's hidden beneath the surface.\"",
            "\"You've been doing the same — digging beneath surface impressions of anime.\"",
            "\"Finding the hidden gems. The underwatched masterpieces.\"",
            "The Archive grants you access to its deepest vault.",
            "\"Your completion rate proves you're a true explorer, not just a tourist.\""
        ],
        milestone: "Complete 10+ anime with ratings."
    ),
    StoryChapter(
        id: 4,
        title: "The Celestial Fleet",
        xpRequired: 3500,
        narrative: [
            "A signal from deep space: you're not alone.",
            "Other explorer ships appear on sensors — the Celestial Fleet.",
            "NAVI: \"ESA launched Celeste satellites to augment Earth's navigation.\"",
            "\"In the same way, other explorers augment your understanding of the cosmos.\"",
            "The Fleet Admiral hails you: \"Your galaxy map is impressive, Explorer.\"",
            "\"Few have charted so many nebulae with such dedication.\"",
            "\"We'd like you to join our ranks. But first — a final test.\"",
            "\"Show us you can see the beauty in the smallest star systems, not just the brightest.\""
        ],
        milestone: "Reach 200+ watched episodes across your catalog."
    ),
    StoryChapter(
        id: 5,
        title: "Admiral of the Anime Universe",
        xpRequired: 6000,
        narrative: [
            "The ceremony takes place at the heart of the Anime Universe.",
            "A supermassive story — the ur-narrative from which all genres emerged.",
            "NAVI, now your trusted companion for thousands of episodes, speaks:",
            "\"When Artemis 2 launches, it won't just orbit the Moon.\"",
            "\"It will carry human curiosity further than ever before.\"",
            "\"You've done the same. Every anime you watched was a small act of exploration.\"",
            "\"Every rating, a measurement. Every completion, a discovery.\"",
            "The Fleet Admiral pins the insignia to your chest. \"Welcome, Admiral.\""
        ],
        milestone: "You've mastered the Anime Universe. Your journey is legendary."
    ),
]

public struct StoryEvent: Sendable {
    public let trigger: String // "add", "watch", "complete", "genre_new"
    public let minXP: Int
    public let text: String
}

public let storyEvents: [StoryEvent] = [
    StoryEvent(trigger: "add", minXP: 0, text: "NAVI: \"New star system detected! Plotting coordinates...\""),
    StoryEvent(trigger: "add", minXP: 100, text: "NAVI: \"Another system cataloged. Your galaxy grows, Explorer.\""),
    StoryEvent(trigger: "watch", minXP: 0, text: "The star system brightens as you explore more of its planets."),
    StoryEvent(trigger: "watch", minXP: 200, text: "NAVI: \"Steady progress. Like JWST, you reveal what was hidden.\""),
    StoryEvent(trigger: "watch", minXP: 500, text: "NAVI: \"Jupiter's lightning couldn't stop Juno. Nothing stops you.\""),
    StoryEvent(trigger: "complete", minXP: 0, text: "Star system fully explored! Its light now shines permanently on your map."),
    StoryEvent(trigger: "complete", minXP: 300, text: "NAVI: \"Another complete survey. The Archive would be impressed.\""),
    StoryEvent(trigger: "complete", minXP: 1000, text: "NAVI: \"You've charted more systems than most explorers dream of.\""),
    StoryEvent(trigger: "genre_new", minXP: 0, text: "A new nebula appears on sensors! You're the first to map this genre-region."),
    StoryEvent(trigger: "genre_new", minXP: 500, text: "NAVI: \"New nebula discovered. Your range is remarkable, Explorer.\""),
]

public func getStoryEvent(trigger: String, xp: Int) -> String? {
    let matching = storyEvents.filter { $0.trigger == trigger && $0.minXP <= xp }
    guard let best = matching.max(by: { $0.minXP < $1.minXP }) else { return nil }
    return best.text
}

public func getChapterForXP(_ xp: Int) -> Int {
    for i in stride(from: storyChapters.count - 1, through: 0, by: -1) {
        if xp >= storyChapters[i].xpRequired { return i }
    }
    return 0
}

public func getProgressToNextChapter(xp: Int, chapter: Int) -> (percent: Int, remaining: Int, nextTitle: String?) {
    guard chapter + 1 < storyChapters.count else {
        return (100, 0, nil)
    }
    let current = storyChapters[chapter]
    let next = storyChapters[chapter + 1]
    let rangeTotal = next.xpRequired - current.xpRequired
    let rangeCurrent = xp - current.xpRequired
    let percent = min(100, rangeTotal > 0 ? rangeCurrent * 100 / rangeTotal : 100)
    let remaining = next.xpRequired - xp
    return (percent, remaining, next.title)
}
