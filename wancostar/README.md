# ワンコスター (Wancostar) — Dog Walk Cosmos

A Swift macOS CLI app that turns your dog's daily walks into a beautiful cosmic galaxy in the terminal. Each walk becomes a star.

## Features

- **お散歩記録**: 日時、時間、距離、ルート、ワンコのご機嫌を記録
- **コスモス表示**: お散歩履歴が月ごとの星座として美しく表示される
- **統計表示**: 総距離、平均時間、連続記録、ルート別集計
- **インフラ評価**: 歩道・日陰・犬に優しい度の3軸で評価
- **6つのルート**: 公園、近所、川沿い、山道、街中、海岸
- **デモデータ**: 初回起動で28件のサンプルデータが自動生成

## Tech Stack

- Swift 5.9+ / Swift Package Manager
- ANSI color codes for terminal coloring
- Unicode box drawing characters
- JSON file persistence (~/.wancostar/)

## How to Run

```bash
swift build
swift run Wancostar help
swift run Wancostar galaxy    # コスモスを表示
swift run Wancostar stats     # 統計を表示
swift run Wancostar list      # 最近のお散歩一覧
swift test                     # 51 tests
```
