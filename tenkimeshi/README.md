# テンキメシ (Tenkimeshi) — Weather-Based Food Recommender IoT Device

A Raspberry Pi IoT project that recommends food based on current weather and generates ASCII restaurant floor plans. Also includes a web simulator.

## Features

- **天気連動レコメンド**: OpenMeteo APIから天気を取得、最適な料理カテゴリを提案
- **10カテゴリ対応**: 冷たい麺、鍋物、ラーメン、カレー、焼肉、寿司、カフェ、居酒屋、中華、洋食
- **間取り生成**: 天気に合わせた理想のレストランフロアプランをASCIIアートで表示
- **Webシミュレーター**: ブラウザで動くIoTデバイスモックアップ
- **配線ガイド**: SSD1306 OLED / e-Paper / HDMI接続の詳細ガイド

## Tech Stack

- Python 3.10+ (標準ライブラリのみ、外部依存なし)
- OpenMeteo API (無料、キー不要)
- HTML/CSS/JS (Webシミュレーター)

## How to Run

```bash
# デモモード（ネットワーク不要）
python3 src/tenkimeshi.py --demo --once

# ライブモード（天気API使用）
python3 src/tenkimeshi.py --once

# 継続表示モード（30分ごと更新）
python3 src/tenkimeshi.py

# Webシミュレーター
open simulator/index.html

# テスト
python3 tests/run_tests.py
```
