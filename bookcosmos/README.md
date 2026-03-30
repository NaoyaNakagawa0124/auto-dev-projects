# ブックコスモス (Book Cosmos) — Your Library as a Living Universe

A Three.js physics simulation where your reading history becomes a cosmos. Each book is a celestial body with real n-body gravitational physics.

## Features

- **N体重力シミュレーション**: 同ジャンルの本が引き合い、銀河クラスターを形成
- **12ジャンル対応**: 小説、SF、ミステリー、ファンタジー、科学など
- **超新星エフェクト**: 500ページ以上の本を追加すると爆発演出
- **3Dナビゲーション**: ズーム、回転、パンで宇宙を探索
- **本の管理**: 追加、検索、フィルター、評価、削除
- **著者の星座線**: 同じ著者の本が線で繋がる
- **統計ダッシュボード**: 総冊数、ページ数、ジャンル分布
- **データ永続化**: localStorage + JSON エクスポート/インポート

## Tech Stack

- Three.js (3D rendering + OrbitControls)
- Custom GLSL shaders (star glow, twinkling)
- N-body physics (Euler integration)
- Web Audio API (supernova sound)
- Vanilla JavaScript

## How to Run

```bash
npx serve .
# or
python3 -m http.server 8000
```
