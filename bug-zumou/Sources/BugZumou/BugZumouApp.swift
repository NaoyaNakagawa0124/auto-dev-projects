import SwiftUI

@main
struct BugZumouApp: App {
    @StateObject private var game = GameState()

    var body: some Scene {
        WindowGroup("バグずもう") {
            ContentView()
                .environmentObject(game)
                .frame(minWidth: 760, minHeight: 640)
        }
        .windowResizability(.contentSize)
    }
}
