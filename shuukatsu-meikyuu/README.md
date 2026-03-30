# 就活迷宮 (Shuukatsu Meikyuu) — Job Search Roguelike

A Rust+WASM roguelike dungeon crawler where the dungeon is the Japanese job search process. Each run generates a unique labyrinth of companies, interviews, and challenges.

## Features

- **ローグライク就活**: 5フロアの迷宮を攻略（ES地獄→GD→一次面接→技術試験→最終面接）
- **プロシージャル生成**: 毎回異なるマップ、企業、イベントが生成される
- **4つのステータス**: コミュ力・技術力・表現力・メンタルを成長させる
- **企業ランダム生成**: プレフィックス×サフィックス×業界×規模の組み合わせ
- **アイテムシステム**: 完璧なES、ポートフォリオ、推薦状など最大3つ持てる
- **ダッシュボード**: ラン履歴、到達フロア、スキル成長をグラフで表示
- **47のRustテスト**: ダンジョン生成、プレイヤー、エンカウンター全てテスト済み

## Tech Stack

- Rust + wasm-bindgen + wasm-pack
- HTML5 Canvas (dungeon map rendering)
- Vanilla JS frontend
- localStorage for run history

## How to Run

```bash
# Build WASM (requires wasm-pack)
wasm-pack build --target web --out-dir www/pkg

# Serve the frontend
cd www && python3 -m http.server 8000
```

Open `http://localhost:8000` in your browser.

## Run Tests

```bash
cargo test
```
