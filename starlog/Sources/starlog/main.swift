import Foundation
import StarLogLib

let args = CommandLine.arguments

func printUsage() {
    print("""
    ╔══════════════════════════════════════════════╗
    ║          🚀 STARLOG — Anime Explorer 🚀      ║
    ╠══════════════════════════════════════════════╣
    ║  Your anime watchlist is a galaxy to explore  ║
    ╠══════════════════════════════════════════════╣
    ║  COMMANDS:                                    ║
    ║  add <title> --genre <g> --episodes <n>       ║
    ║      [--rating <1-10>]                        ║
    ║  watch <title> [--episodes <n>]               ║
    ║  story [--next]                               ║
    ║  map                                          ║
    ║  stats                                        ║
    ║  list                                         ║
    ║                                               ║
    ║  GENRES: action, adventure, comedy, drama,    ║
    ║  fantasy, horror, mecha, mystery, romance,    ║
    ║  scifi, sliceoflife, sports, thriller,        ║
    ║  supernatural, isekai                         ║
    ╚══════════════════════════════════════════════╝
    """)
}

func parseGenre(_ s: String) -> Genre? {
    let lower = s.lowercased().replacingOccurrences(of: "-", with: "").replacingOccurrences(of: "_", with: "").replacingOccurrences(of: " ", with: "")
    switch lower {
    case "action": return .action
    case "adventure": return .adventure
    case "comedy": return .comedy
    case "drama": return .drama
    case "fantasy": return .fantasy
    case "horror": return .horror
    case "mecha": return .mecha
    case "mystery": return .mystery
    case "romance": return .romance
    case "scifi": return .scifi
    case "sliceoflife", "sol": return .sliceOfLife
    case "sports": return .sports
    case "thriller": return .thriller
    case "supernatural": return .supernatural
    case "isekai": return .isekai
    default: return nil
    }
}

func getArg(_ flag: String) -> String? {
    guard let idx = args.firstIndex(of: flag), idx + 1 < args.count else { return nil }
    return args[idx + 1]
}

func printResult(_ result: ActionResult) {
    print("  \(result.message)")
    if result.xpGained > 0 { print("  +\(result.xpGained) XP") }
    if let event = result.storyEvent { print("  \(event)") }
    if result.newChapter {
        let ch = storyChapters[getChapterForXP(result.xpGained)]
        print("  🎉 NEW CHAPTER UNLOCKED: \(ch.title)")
    }
    for achId in result.newAchievements {
        print("  🏆 Achievement: \(Engine.getAchievementName(achId))")
    }
}

guard args.count >= 2 else {
    printUsage()
    exit(0)
}

var profile = Storage.load()
let command = args[1].lowercased()

switch command {
case "add":
    guard args.count >= 3 else {
        print("Usage: starlog add <title> --genre <genre> --episodes <n> [--rating <1-10>]")
        exit(1)
    }
    var titleParts: [String] = []
    for i in 2..<args.count {
        if args[i].hasPrefix("--") { break }
        titleParts.append(args[i])
    }
    let title = titleParts.joined(separator: " ")
    guard !title.isEmpty else { print("Error: title required"); exit(1) }

    guard let genreStr = getArg("--genre"), let genre = parseGenre(genreStr) else {
        print("Error: --genre required. Options: action, adventure, comedy, drama, fantasy, horror, mecha, mystery, romance, scifi, sliceoflife, sports, thriller, supernatural, isekai")
        exit(1)
    }
    guard let epStr = getArg("--episodes"), let episodes = Int(epStr) else {
        print("Error: --episodes <number> required")
        exit(1)
    }
    let rating = Int(getArg("--rating") ?? "0") ?? 0

    let result = Engine.addAnime(&profile, title: title, genre: genre, totalEpisodes: episodes, rating: rating)
    printResult(result)
    let _ = Storage.save(profile)

case "watch":
    guard args.count >= 3 else {
        print("Usage: starlog watch <title> [--episodes <n>]")
        exit(1)
    }
    var titleParts: [String] = []
    for i in 2..<args.count {
        if args[i].hasPrefix("--") { break }
        titleParts.append(args[i])
    }
    let title = titleParts.joined(separator: " ")
    let episodes = Int(getArg("--episodes") ?? "1") ?? 1

    let result = Engine.watchEpisodes(&profile, title: title, episodes: episodes)
    printResult(result)
    let _ = Storage.save(profile)

case "story":
    if args.contains("--next") {
        let chapter = storyChapters[profile.currentChapter]
        if profile.storyProgress < chapter.narrative.count - 1 {
            profile.storyProgress += 1
            let _ = Storage.save(profile)
        }
    }
    print(Renderer.renderStory(profile))

case "map":
    print(Renderer.renderMap(profile))

case "stats":
    print(Renderer.renderStats(profile))

case "list":
    print(Renderer.renderList(profile))

case "help", "--help", "-h":
    printUsage()

default:
    print("Unknown command: \(command)")
    printUsage()
    exit(1)
}
