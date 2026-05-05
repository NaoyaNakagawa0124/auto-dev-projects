// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "BugZumou",
    platforms: [.macOS(.v14)],
    products: [
        .executable(name: "bug-zumou", targets: ["BugZumou"]),
    ],
    targets: [
        .executableTarget(
            name: "BugZumou",
            path: "Sources/BugZumou"
        ),
        .testTarget(
            name: "BugZumouTests",
            dependencies: ["BugZumou"],
            path: "Tests/BugZumouTests"
        ),
    ]
)
