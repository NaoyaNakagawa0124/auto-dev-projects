import Testing
import Foundation
@testable import StarLogLib

// ============ Model Tests ============

@Suite("Genre Tests")
struct GenreTests {
    @Test("All genres have nebula names")
    func genreNebulae() {
        for genre in Genre.allCases {
            #expect(!genre.nebula.isEmpty)
            #expect(genre.nebula.hasSuffix("Nebula"))
        }
    }

    @Test("All genres have icons")
    func genreIcons() {
        for genre in Genre.allCases {
            #expect(!genre.icon.isEmpty)
        }
    }

    @Test("There are 15 genres")
    func genreCount() {
        #expect(Genre.allCases.count == 15)
    }

    @Test("Genre raw values are readable")
    func genreRawValues() {
        #expect(Genre.action.rawValue == "Action")
        #expect(Genre.scifi.rawValue == "Sci-Fi")
        #expect(Genre.sliceOfLife.rawValue == "Slice of Life")
    }
}

@Suite("Anime Tests")
struct AnimeTests {
    @Test("Create anime with defaults")
    func createAnime() {
        let a = Anime(title: "Attack on Titan", genre: .action, totalEpisodes: 87)
        #expect(a.title == "Attack on Titan")
        #expect(a.genre == .action)
        #expect(a.totalEpisodes == 87)
        #expect(a.watchedEpisodes == 0)
        #expect(a.rating == 0)
        #expect(a.status == .planned)
        #expect(!a.starSystemName.isEmpty)
    }

    @Test("Anime with rating")
    func createWithRating() {
        let a = Anime(title: "Steins;Gate", genre: .scifi, totalEpisodes: 24, rating: 10)
        #expect(a.rating == 10)
    }

    @Test("Rating clamped to 0-10")
    func ratingClamped() {
        let a = Anime(title: "Test", genre: .comedy, totalEpisodes: 12, rating: 15)
        #expect(a.rating == 10)
        let b = Anime(title: "Test2", genre: .comedy, totalEpisodes: 12, rating: -3)
        #expect(b.rating == 0)
    }

    @Test("Total episodes minimum 1")
    func minEpisodes() {
        let a = Anime(title: "Test", genre: .comedy, totalEpisodes: 0)
        #expect(a.totalEpisodes == 1)
    }

    @Test("Completion percent")
    func completionPercent() {
        var a = Anime(title: "Test", genre: .comedy, totalEpisodes: 10)
        #expect(a.completionPercent == 0.0)
        a.watchEpisodes(5)
        #expect(a.completionPercent == 50.0)
        a.watchEpisodes(5)
        #expect(a.completionPercent == 100.0)
    }

    @Test("Watch episodes updates status")
    func watchUpdatesStatus() {
        var a = Anime(title: "Test", genre: .comedy, totalEpisodes: 12)
        #expect(a.status == .planned)
        a.watchEpisodes(1)
        #expect(a.status == .watching)
        a.watchEpisodes(11)
        #expect(a.status == .completed)
        #expect(a.isComplete)
    }

    @Test("Watch episodes caps at total")
    func watchCapped() {
        var a = Anime(title: "Test", genre: .comedy, totalEpisodes: 12)
        a.watchEpisodes(20)
        #expect(a.watchedEpisodes == 12)
    }

    @Test("Watch negative episodes ignored")
    func watchNegative() {
        var a = Anime(title: "Test", genre: .comedy, totalEpisodes: 12)
        a.watchEpisodes(-5)
        #expect(a.watchedEpisodes == 0)
    }

    @Test("Set rating")
    func setRating() {
        var a = Anime(title: "Test", genre: .comedy, totalEpisodes: 12)
        a.setRating(8)
        #expect(a.rating == 8)
        a.setRating(0)
        #expect(a.rating == 1) // clamped to 1
        a.setRating(15)
        #expect(a.rating == 10)
    }

    @Test("Star system name generated")
    func starNameGenerated() {
        let a = Anime(title: "Naruto", genre: .action, totalEpisodes: 220)
        #expect(!a.starSystemName.isEmpty)
        #expect(a.starSystemName.contains("-"))
    }

    @Test("Different titles get different star names")
    func uniqueStarNames() {
        let a = Anime(title: "Naruto", genre: .action, totalEpisodes: 220)
        let b = Anime(title: "One Piece", genre: .action, totalEpisodes: 1000)
        #expect(a.starSystemName != b.starSystemName)
    }
}

@Suite("Explorer Profile Tests")
struct ProfileTests {
    @Test("Default profile")
    func defaultProfile() {
        let p = ExplorerProfile()
        #expect(p.name == "Explorer")
        #expect(p.explorationXP == 0)
        #expect(p.currentChapter == 0)
        #expect(p.anime.isEmpty)
        #expect(p.rank == "Space Cadet")
        #expect(p.rankIcon == "🔰")
    }

    @Test("Rank progression")
    func rankProgression() {
        var p = ExplorerProfile()
        #expect(p.rank == "Space Cadet")
        p.explorationXP = 100
        #expect(p.rank == "Ensign")
        p.explorationXP = 500
        #expect(p.rank == "Lieutenant")
        p.explorationXP = 1500
        #expect(p.rank == "Commander")
        p.explorationXP = 3000
        #expect(p.rank == "Captain")
        p.explorationXP = 5000
        #expect(p.rank == "Commodore")
        p.explorationXP = 8000
        #expect(p.rank == "Rear Admiral")
        p.explorationXP = 12000
        #expect(p.rank == "Fleet Admiral")
    }

    @Test("Profile computed properties")
    func computedProperties() {
        var p = ExplorerProfile()
        p.anime = [
            Anime(title: "A", genre: .action, totalEpisodes: 12, rating: 8),
            Anime(title: "B", genre: .comedy, totalEpisodes: 24, rating: 7),
        ]
        p.anime[0].watchEpisodes(12) // Complete
        p.anime[1].watchEpisodes(10) // Partial

        #expect(p.totalAnime == 2)
        #expect(p.completedAnime == 1)
        #expect(p.totalWatchedEpisodes == 22)
        #expect(p.uniqueGenres == 2)
        #expect(p.averageRating == 7.5)
        #expect(p.estimatedWatchHours > 0)
    }

    @Test("Average rating with no ratings")
    func noRatings() {
        var p = ExplorerProfile()
        p.anime = [Anime(title: "A", genre: .action, totalEpisodes: 12)]
        #expect(p.averageRating == 0.0)
    }
}

// ============ Story Tests ============

@Suite("Story Tests")
struct StoryTests {
    @Test("6 chapters exist")
    func chapterCount() {
        #expect(storyChapters.count == 6)
    }

    @Test("Chapters have increasing XP")
    func chaptersIncreasingXP() {
        for i in 1..<storyChapters.count {
            #expect(storyChapters[i].xpRequired > storyChapters[i-1].xpRequired)
        }
    }

    @Test("Chapter 0 starts at 0 XP")
    func chapter0XP() {
        #expect(storyChapters[0].xpRequired == 0)
    }

    @Test("All chapters have narrative lines")
    func chaptersHaveNarrative() {
        for ch in storyChapters {
            #expect(!ch.narrative.isEmpty)
            #expect(!ch.title.isEmpty)
            #expect(!ch.milestone.isEmpty)
        }
    }

    @Test("getChapterForXP")
    func chapterForXP() {
        #expect(getChapterForXP(0) == 0)
        #expect(getChapterForXP(50) == 0)
        #expect(getChapterForXP(100) == 1)
        #expect(getChapterForXP(499) == 1)
        #expect(getChapterForXP(500) == 2)
        #expect(getChapterForXP(1500) == 3)
        #expect(getChapterForXP(3500) == 4)
        #expect(getChapterForXP(6000) == 5)
        #expect(getChapterForXP(99999) == 5)
    }

    @Test("Progress to next chapter")
    func progressToNext() {
        let p1 = getProgressToNextChapter(xp: 0, chapter: 0)
        #expect(p1.percent == 0)
        #expect(p1.remaining == 100)
        #expect(p1.nextTitle == "The First Nebula")

        let p2 = getProgressToNextChapter(xp: 50, chapter: 0)
        #expect(p2.percent == 50)
        #expect(p2.remaining == 50)

        let p3 = getProgressToNextChapter(xp: 6000, chapter: 5)
        #expect(p3.percent == 100)
        #expect(p3.nextTitle == nil)
    }

    @Test("Story events exist")
    func storyEventsExist() {
        #expect(!storyEvents.isEmpty)
    }

    @Test("getStoryEvent returns matching event")
    func getEvent() {
        let e1 = getStoryEvent(trigger: "add", xp: 0)
        #expect(e1 != nil)

        let e2 = getStoryEvent(trigger: "complete", xp: 1000)
        #expect(e2 != nil)

        let e3 = getStoryEvent(trigger: "nonexistent", xp: 0)
        #expect(e3 == nil)
    }

    @Test("Higher XP gets more specific event")
    func eventSpecificity() {
        let e1 = getStoryEvent(trigger: "watch", xp: 0)!
        let e2 = getStoryEvent(trigger: "watch", xp: 500)!
        #expect(e1 != e2)
    }
}

// ============ Engine Tests ============

@Suite("Engine Tests")
struct EngineTests {
    @Test("Calculate add XP")
    func addXP() {
        #expect(Engine.calculateAddXP(genre: .action, totalEpisodes: 10) == 20)
        #expect(Engine.calculateAddXP(genre: .action, totalEpisodes: 12) == 25)
        #expect(Engine.calculateAddXP(genre: .action, totalEpisodes: 24) == 30)
        #expect(Engine.calculateAddXP(genre: .action, totalEpisodes: 50) == 35)
    }

    @Test("Calculate watch XP")
    func watchXP() {
        #expect(Engine.calculateWatchXP(episodesWatched: 1, isCompletion: false) == 5)
        #expect(Engine.calculateWatchXP(episodesWatched: 10, isCompletion: false) == 50)
        #expect(Engine.calculateWatchXP(episodesWatched: 1, isCompletion: true) == 55)
    }

    @Test("Add anime to profile")
    func addAnime() {
        var p = ExplorerProfile()
        let result = Engine.addAnime(&p, title: "Naruto", genre: .action, totalEpisodes: 220, rating: 8)
        #expect(result.xpGained > 0)
        #expect(p.anime.count == 1)
        #expect(p.anime[0].title == "Naruto")
        #expect(p.explorationXP > 0)
        #expect(!result.message.isEmpty)
    }

    @Test("Cannot add duplicate")
    func addDuplicate() {
        var p = ExplorerProfile()
        let _ = Engine.addAnime(&p, title: "Naruto", genre: .action, totalEpisodes: 220, rating: 8)
        let r2 = Engine.addAnime(&p, title: "naruto", genre: .action, totalEpisodes: 220, rating: 8)
        #expect(r2.xpGained == 0)
        #expect(p.anime.count == 1)
    }

    @Test("Add new genre triggers genre_new event")
    func newGenreEvent() {
        var p = ExplorerProfile()
        let r1 = Engine.addAnime(&p, title: "Naruto", genre: .action, totalEpisodes: 220, rating: 8)
        #expect(r1.storyEvent != nil)
    }

    @Test("Watch episodes on anime")
    func watchEpisodes() {
        var p = ExplorerProfile()
        let _ = Engine.addAnime(&p, title: "Naruto", genre: .action, totalEpisodes: 220, rating: 8)
        let r = Engine.watchEpisodes(&p, title: "Naruto", episodes: 10)
        #expect(r.xpGained == 50) // 10 * 5
        #expect(p.anime[0].watchedEpisodes == 10)
    }

    @Test("Watch completes anime")
    func watchCompletes() {
        var p = ExplorerProfile()
        let _ = Engine.addAnime(&p, title: "Test", genre: .comedy, totalEpisodes: 12, rating: 0)
        let r = Engine.watchEpisodes(&p, title: "Test", episodes: 12)
        #expect(p.anime[0].isComplete)
        #expect(r.xpGained == 110) // 12*5 + 50 completion bonus
    }

    @Test("Watch nonexistent anime")
    func watchNonexistent() {
        var p = ExplorerProfile()
        let r = Engine.watchEpisodes(&p, title: "Nobody", episodes: 5)
        #expect(r.xpGained == 0)
        #expect(r.message.contains("not found"))
    }

    @Test("Watch already complete anime")
    func watchComplete() {
        var p = ExplorerProfile()
        let _ = Engine.addAnime(&p, title: "Test", genre: .comedy, totalEpisodes: 12, rating: 0)
        let _ = Engine.watchEpisodes(&p, title: "Test", episodes: 12)
        let r = Engine.watchEpisodes(&p, title: "Test", episodes: 1)
        #expect(r.xpGained == 0)
    }

    @Test("Chapter advancement")
    func chapterAdvance() {
        var p = ExplorerProfile()
        #expect(p.currentChapter == 0)

        // Add enough anime to gain XP
        for i in 0..<10 {
            let _ = Engine.addAnime(&p, title: "Anime\(i)", genre: Genre.allCases[i % Genre.allCases.count], totalEpisodes: 24, rating: 7)
        }

        #expect(p.currentChapter >= 1)
    }

    @Test("Achievement unlocking")
    func achievementUnlock() {
        var p = ExplorerProfile()
        let r = Engine.addAnime(&p, title: "Test", genre: .action, totalEpisodes: 12, rating: 8)
        #expect(r.newAchievements.contains("first_star"))
        #expect(p.achievementsUnlocked.contains("first_star"))
    }

    @Test("Achievement not re-unlocked")
    func achievementNoReUnlock() {
        var p = ExplorerProfile()
        let _ = Engine.addAnime(&p, title: "Test1", genre: .action, totalEpisodes: 12, rating: 8)
        let r2 = Engine.addAnime(&p, title: "Test2", genre: .comedy, totalEpisodes: 12, rating: 8)
        #expect(!r2.newAchievements.contains("first_star"))
    }

    @Test("All achievement names exist")
    func achievementNames() {
        let ids = ["first_star", "five_stars", "ten_stars", "twenty_stars",
                   "first_survey", "five_surveys", "ten_surveys",
                   "three_nebulae", "five_nebulae", "ten_nebulae",
                   "hundred_episodes", "five_hundred_episodes", "thousand_episodes",
                   "ensign", "lieutenant", "commander", "captain", "admiral"]
        for id in ids {
            let name = Engine.getAchievementName(id)
            #expect(name != id, "Achievement \(id) has a display name")
        }
    }
}

// ============ Renderer Tests ============

@Suite("Renderer Tests")
struct RendererTests {
    @Test("Render story")
    func renderStory() {
        let p = ExplorerProfile()
        let output = Renderer.renderStory(p)
        #expect(output.contains("Chapter 1"))
        #expect(output.contains("First Light"))
        #expect(output.contains("╔"))
    }

    @Test("Render empty map")
    func renderEmptyMap() {
        let p = ExplorerProfile()
        let output = Renderer.renderMap(p)
        #expect(output.contains("GALAXY MAP"))
        #expect(output.contains("No star systems"))
    }

    @Test("Render map with anime")
    func renderMapWithAnime() {
        var p = ExplorerProfile()
        let _ = Engine.addAnime(&p, title: "Test", genre: .action, totalEpisodes: 12, rating: 8)
        let output = Renderer.renderMap(p)
        #expect(output.contains("Blaze Nebula"))
    }

    @Test("Render stats")
    func renderStats() {
        let p = ExplorerProfile()
        let output = Renderer.renderStats(p)
        #expect(output.contains("EXPLORER STATS"))
        #expect(output.contains("Space Cadet"))
    }

    @Test("Render empty list")
    func renderEmptyList() {
        let p = ExplorerProfile()
        let output = Renderer.renderList(p)
        #expect(output.contains("ANIME CATALOG"))
        #expect(output.contains("No anime"))
    }

    @Test("Render list with anime")
    func renderListWithAnime() {
        var p = ExplorerProfile()
        let _ = Engine.addAnime(&p, title: "Test", genre: .action, totalEpisodes: 12, rating: 8)
        let output = Renderer.renderList(p)
        #expect(output.contains("Test"))
        #expect(output.contains("Action"))
    }
}

// ============ Integration Tests ============

@Suite("Integration Tests")
struct IntegrationTests {
    @Test("Full playthrough")
    func fullPlaythrough() {
        var p = ExplorerProfile()
        var totalXP = 0

        // Add 15 anime across different genres
        let genres: [Genre] = [.action, .comedy, .drama, .scifi, .romance,
                               .fantasy, .mecha, .mystery, .horror, .thriller,
                               .adventure, .sports, .sliceOfLife, .supernatural, .isekai]
        for (i, genre) in genres.enumerated() {
            let eps = 12 + (i * 2)
            let r = Engine.addAnime(&p, title: "Anime \(i+1)", genre: genre, totalEpisodes: eps, rating: 5 + (i % 6))
            totalXP += r.xpGained
        }

        #expect(p.totalAnime == 15)
        #expect(p.uniqueGenres == 15)
        #expect(p.explorationXP == totalXP)

        // Watch episodes
        for i in 0..<15 {
            let eps = p.anime[i].totalEpisodes
            let r = Engine.watchEpisodes(&p, title: "Anime \(i+1)", episodes: eps)
            totalXP += r.xpGained
        }

        #expect(p.completedAnime == 15)
        #expect(p.explorationXP == totalXP)
        #expect(p.currentChapter > 0)
        #expect(p.achievementsUnlocked.count > 5)
    }

    @Test("Chapter progression through play")
    func chapterProgression() {
        var p = ExplorerProfile()
        var chaptersReached = Set<Int>()
        chaptersReached.insert(0)

        // Simulate heavy usage
        for i in 0..<30 {
            let genre = Genre.allCases[i % Genre.allCases.count]
            let _ = Engine.addAnime(&p, title: "Show\(i)", genre: genre, totalEpisodes: 24, rating: 7)
            let _ = Engine.watchEpisodes(&p, title: "Show\(i)", episodes: 24)
            chaptersReached.insert(p.currentChapter)
        }

        #expect(chaptersReached.count >= 3, "Reached at least 3 chapters")
    }

    @Test("XP consistency")
    func xpConsistency() {
        var p = ExplorerProfile()
        var manualXP = 0

        let r1 = Engine.addAnime(&p, title: "A", genre: .action, totalEpisodes: 24, rating: 8)
        manualXP += r1.xpGained

        let r2 = Engine.watchEpisodes(&p, title: "A", episodes: 10)
        manualXP += r2.xpGained

        let r3 = Engine.watchEpisodes(&p, title: "A", episodes: 14)
        manualXP += r3.xpGained

        #expect(p.explorationXP == manualXP)
    }

    @Test("Renderer handles large profile")
    func largeProfile() {
        var p = ExplorerProfile()
        for i in 0..<50 {
            let genre = Genre.allCases[i % Genre.allCases.count]
            let _ = Engine.addAnime(&p, title: "BigShow\(i)", genre: genre, totalEpisodes: 12, rating: (i % 10) + 1)
        }

        let story = Renderer.renderStory(p)
        let map = Renderer.renderMap(p)
        let stats = Renderer.renderStats(p)
        let list = Renderer.renderList(p)

        #expect(!story.isEmpty)
        #expect(!map.isEmpty)
        #expect(!stats.isEmpty)
        #expect(!list.isEmpty)
    }
}

// ============ Storage Tests ============

@Suite("Storage Tests")
struct StorageTests {
    @Test("Save and load profile")
    func saveAndLoad() {
        let tmpPath = "/tmp/starlog_test_\(ProcessInfo.processInfo.processIdentifier).json"
        defer { try? FileManager.default.removeItem(atPath: tmpPath) }

        var p = ExplorerProfile(name: "TestExplorer")
        let _ = Engine.addAnime(&p, title: "Test", genre: .action, totalEpisodes: 12, rating: 8)
        let _ = Engine.watchEpisodes(&p, title: "Test", episodes: 5)

        let saved = Storage.save(p, to: tmpPath)
        #expect(saved)

        let loaded = Storage.load(from: tmpPath)
        #expect(loaded.name == "TestExplorer")
        #expect(loaded.anime.count == 1)
        #expect(loaded.anime[0].watchedEpisodes == 5)
        #expect(loaded.explorationXP > 0)
    }

    @Test("Load from nonexistent file returns default")
    func loadNonexistent() {
        let p = Storage.load(from: "/tmp/nonexistent_starlog_file.json")
        #expect(p.name == "Explorer")
        #expect(p.anime.isEmpty)
    }
}
