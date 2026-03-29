// swift-tools-version: 6.1
import PackageDescription

let package = Package(
    name: "starlog",
    targets: [
        .target(
            name: "StarLogLib",
            path: "Sources/StarLogLib"),
        .executableTarget(
            name: "starlog",
            dependencies: ["StarLogLib"],
            path: "Sources/starlog"),
        .testTarget(
            name: "StarLogTests",
            dependencies: ["StarLogLib"]),
    ]
)
