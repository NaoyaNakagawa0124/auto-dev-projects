// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "tsukue-no-sumi",
    platforms: [
        .macOS(.v13)
    ],
    products: [
        .executable(name: "tsukue", targets: ["tsukue"]),
        .library(name: "TsukueCore", targets: ["TsukueCore"])
    ],
    targets: [
        .target(
            name: "TsukueCore",
            path: "Sources/TsukueCore"
        ),
        .executableTarget(
            name: "tsukue",
            dependencies: ["TsukueCore"],
            path: "Sources/tsukue"
        ),
        .testTarget(
            name: "TsukueCoreTests",
            dependencies: ["TsukueCore"],
            path: "Tests/TsukueCoreTests"
        )
    ]
)
