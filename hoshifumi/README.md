# 星文 (Hoshifumi) — Star Letters

A Three.js generative art typing game inspired by Van Gogh's birthday (March 30, 1853).

Type messages at speed — watch them transform into constellations drifting through a Starry Night-inspired sky.

## Features

- **タイピングゲーム**: 画面に表示される文章を素早く正確にタイプ
- **星座生成**: タイプした文字が星となり、夜空に星座として浮かび上がる
- **コンボシステム**: 連続正確タイプでコンボ倍率アップ、星がより明るく輝く
- **ゴッホ風ビジュアル**: 渦巻く夜空、うねる星雲、印象派風のポストプロセッシング
- **手紙モード**: 自由にメッセージを書いて星座として夜空に残す
- **WPM/正確率トラッキング**: ゲーマー向けの詳細な統計表示

## Tech Stack

- Three.js (3D rendering)
- Custom GLSL shaders (Van Gogh swirl effect)
- Vanilla JavaScript (no framework)
- HTML5/CSS3

## How to Run

```bash
# Any static file server works
npx serve .
# or
python3 -m http.server 8000
```

Open `http://localhost:3000` (or `:8000`) in your browser.
