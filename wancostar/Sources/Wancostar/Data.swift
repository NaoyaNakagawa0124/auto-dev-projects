import Foundation

public struct WancostarText {
    // App
    static let appName = "ワンコスター"
    static let appSubtitle = "犬のお散歩コスモス"

    // Emojis
    static let dogEmojis = ["🐕", "🐩", "🦮", "🐶", "🐾"]

    // Setup
    static let welcomeMessage = "🐕 ワンコスターへようこそ！"
    static let setupPrompt = "まずはあなたのワンコの情報を教えてね。"
    static let namePrompt = "名前: "
    static let breedPrompt = "犬種: "
    static let birthdayPrompt = "誕生日 (YYYY-MM-DD、わからなければ空欄): "
    static let emojiPrompt = "絵文字を選んでね:"
    static let profileComplete = "✨ プロフィール登録完了！"
    static let letsStart = "さあ、お散歩の記録を始めよう！"

    // Add walk
    static let addWalkTitle = "🌟 新しいお散歩を記録するよ！"
    static let datePrompt = "日付 (YYYY-MM-DD、今日なら空欄): "
    static let timePrompt = "時刻 (HH:MM): "
    static let durationPrompt = "散歩時間（分）: "
    static let distancePrompt = "距離の目安（km）: "
    static let moodPrompt = "ワンコのご機嫌（1-5）⭐: "
    static let routePrompt = "ルートタイプを選んでね:"
    static let infraTitle = "インフラ評価:"
    static let sidewalkPrompt = "  歩道の状態（1-5）: "
    static let shadePrompt = "  日陰の多さ（1-5）: "
    static let dogFriendlyPrompt = "  犬に優しい度（1-5）: "
    static let notesPrompt = "メモ（なければ空欄）: "
    static let walkRecorded = "✨ お散歩を記録しました！"
    static let newStar = "新しい星がコスモスに追加されたよ ✦"

    // List
    static let noWalks = "まだお散歩の記録がないよ。 wancostar add で最初のお散歩を記録しよう！"
    static let noDog = "まずプロフィールを設定してね。 wancostar setup を実行してね！"

    // Stats
    static let statsTitle = "📊 お散歩統計"
    static let totalWalks = "総お散歩回数"
    static let totalDistance = "総距離"
    static let totalTime = "総時間"
    static let avgDistance = "平均距離"
    static let avgTime = "平均時間"
    static let currentStreak = "🔥 連続記録"
    static let longestStreak = "📅 最長記録"
    static let routeBreakdown = "── ルート別 ──"
    static let infraAverage = "── インフラ平均 ──"
    static let sidewalkLabel = "歩道"
    static let shadeLabel = "日陰"
    static let dogFriendlyLabel = "犬度"

    // Galaxy
    static let galaxyTitle = "✨ ワンコスターの銀河 ✨"
    static let legendTitle = "── 凡例 ──"
    static let legendSizes = "★ = 60分以上  ✦ = 45分  ✧ = 30分  · = 15分以下"

    // Help
    static let helpTitle = "🌟 ワンコスター — 犬のお散歩コスモス"
    static let helpCommands = """
    コマンド:
      setup    ワンコのプロフィールを設定
      add      お散歩を記録
      list     最近のお散歩を一覧表示
      stats    統計情報を表示
      galaxy   お散歩コスモスを表示
      export   データをJSONでエクスポート
      import   JSONデータをインポート
      help     このヘルプを表示

    使い方:
      wancostar setup
      wancostar add
      wancostar galaxy
    """

    // Errors
    static let invalidInput = "⚠️ 入力が正しくありません。もう一度お試しください。"
    static let fileError = "⚠️ ファイルの読み書きに問題が発生しました。"
    static let unknownCommand = "⚠️ 不明なコマンドです。 wancostar help でコマンド一覧を確認してね。"

    // Export/Import
    static let exportDone = "✨ データをエクスポートしました。"
    static let importDone = "✨ データをインポートしました。"
    static let importError = "⚠️ インポートに失敗しました。ファイルを確認してください。"
    static let importUsage = "使い方: wancostar import <ファイルパス>"
}

public func generateDemoData() -> [Walk] {
    let calendar = Calendar.current
    let today = Date()
    var walks: [Walk] = []

    let routes: [RouteType] = [.park, .neighborhood, .river, .mountain, .city, .beach]
    let durations = [10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80]
    let times = ["06:30", "07:00", "07:30", "08:00", "16:00", "16:30", "17:00", "17:30", "18:00"]

    // Deterministic seed based on structure, not random
    let noteOptions = [
        "今日もご機嫌だった！",
        "蝶々を追いかけてた",
        "他の犬と仲良く遊んだ",
        "水たまりに突っ込んだ",
        "いい天気で気持ちよさそう",
        "少し疲れてたかな",
        "新しいルートを発見！",
        "帰り道でおやつタイム",
        "風が強かったけど元気だった",
        "",
        "",
        ""
    ]

    for i in 0..<28 {
        guard let walkDate = calendar.date(byAdding: .day, value: -i, to: today) else { continue }
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        let dateStr = formatter.string(from: walkDate)

        // Some days have two walks
        let walkCount = (i % 5 == 0) ? 2 : 1

        for w in 0..<walkCount {
            let routeIdx = (i * 3 + w * 2) % routes.count
            let durIdx = (i * 7 + w * 5) % durations.count
            let timeIdx = (w == 0) ? (i % 4) : (4 + (i % 5))
            let mood = max(1, min(5, 3 + (i % 3) - (w)))
            let dist = Double(durations[durIdx]) * 0.055 + Double(i % 3) * 0.2

            let walk = Walk(
                id: UUID().uuidString,
                date: dateStr,
                time: times[timeIdx % times.count],
                duration: durations[durIdx],
                distance: (dist * 10).rounded() / 10,
                mood: mood,
                routeType: routes[routeIdx],
                notes: noteOptions[(i + w) % noteOptions.count],
                infrastructure: InfraRating(
                    sidewalk: max(1, min(5, 3 + (i % 3))),
                    shade: max(1, min(5, 2 + (i + w) % 4)),
                    dogFriendly: max(1, min(5, 3 + (i * 2) % 3))
                )
            )
            walks.append(walk)
        }
    }

    return walks
}
