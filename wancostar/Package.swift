// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "Wancostar",
    platforms: [.macOS(.v13)],
    targets: [
        .executableTarget(
            name: "Wancostar",
            path: "Sources/Wancostar"
        ),
        .testTarget(
            name: "WancostarTests",
            dependencies: ["Wancostar"],
            path: "Tests/WancostarTests"
        ),
    ]
)
