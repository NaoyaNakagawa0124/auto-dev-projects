import Foundation

let storage = Storage()
let commands = Commands(storage: storage)

let args = CommandLine.arguments
let command = args.count > 1 ? args[1] : "help"

switch command {
case "setup":
    commands.setup()
case "add":
    commands.addWalk()
case "list":
    commands.listWalks()
case "stats":
    commands.showStats()
case "galaxy":
    commands.showGalaxy()
case "export":
    commands.exportData()
case "import":
    if args.count > 2 {
        commands.importData(path: args[2])
    } else {
        printColored(WancostarText.importUsage, color: ANSI.yellow)
    }
case "help", "--help", "-h":
    commands.showHelp()
default:
    printColored(WancostarText.unknownCommand, color: ANSI.red)
    commands.showHelp()
}
