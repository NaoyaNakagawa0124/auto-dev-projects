# カブオト (Kabuoto) — Stock Market Sonification

A web app that converts stock market price data into ambient music. Price movements become melodies, volatility controls tempo, and trading volume affects amplitude.

## Features

- **株価の音楽化**: 価格変動→音高、ボラティリティ→テンポ、出来高→音量
- **5銘柄対応**: トヨタ、ソニー、SBG、NTT、アップル（180日分のデータ）
- **6つの音階**: メジャー、マイナー、ペンタトニック、日本音階（都節）、ブルース、クロマチック
- **リアルタイム波形**: オシロスコープ風の波形表示
- **エフェクト**: リバーブ、ディレイ、ローパスフィルター
- **価格チャート**: 再生位置と同期した株価グラフ

## Tech Stack

- Web Audio API (synthesizer + effects)
- Canvas 2D (chart + waveform)
- Vanilla JavaScript
- No dependencies

## How to Run

```bash
open index.html
# or
npx serve .
```
