# ネオンリーダー (Neon Reader) — Cyberpunk Reader Mode

A Chrome extension that transforms any webpage into a clean, cyberpunk-styled reading experience. Designed for seniors who deserve cool tech too.

## Features

- **ワンクリック変換**: 任意のWebページをサイバーパンク風リーダーモードに
- **大きな文字**: デフォルト24px、最大32pxまで調整可能
- **4つのカラーテーマ**: ネオングリーン / サイバーシアン / アンバー / ホワイト
- **読書ガイド**: マウス位置に追従する行ハイライト
- **HUD表示**: 文字数・読了時間・進捗をサイバーパンク風に表示
- **スキャンライン効果**: さりげないCRTモニター風演出
- **タイプライター演出**: タイトルが1文字ずつ表示される演出
- **キーボードショートカット**: Alt+R でトグル

## Tech Stack

- Chrome Extension Manifest V3
- Vanilla JS + CSS
- chrome.storage.local
- Custom GLSL-free scanline effects (pure CSS)

## Install

1. `chrome://extensions` を開く
2. 「デベロッパーモード」をON
3. 「パッケージ化されていない拡張機能を読み込む」でこのフォルダを選択
4. 任意のWebページで拡張機能アイコンをクリック → 「リーダーモード起動」
