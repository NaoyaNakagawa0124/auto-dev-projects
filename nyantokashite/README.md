# にゃんとかして (Nyantokashite) — Cat Cleanup Puzzle

A Sokoban-style puzzle game where a cat has knocked items off shelves. Push items back to their correct spots while the cat roams around blocking your path.

## Features

- **倉庫番風パズル**: アイテムを押して正しい場所に戻す
- **20レベル**: リビング→キッチン→書斎→寝室の4部屋
- **ネコ AI**: 3手ごとにネコが動き、道を塞ぐ
- **星評価**: 目標手数以内で★3獲得
- **元に戻す**: Z/Ctrl+Zで一手戻せる
- **ピクセルアート**: キャンバスで描画されたかわいいキャラクター
- **効果音**: Web Audio APIによるサウンド
- **モバイル対応**: タッチ操作＋仮想十字キー

## Tech Stack

- HTML5 Canvas 2D
- Web Audio API
- Vanilla JavaScript
- localStorage for progress

## How to Run

```bash
open index.html
```
