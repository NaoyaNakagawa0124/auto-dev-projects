# ネタメモ (Netamemo) — Collaborative Content Idea Clipboard

A Chrome extension for aspiring YouTubers/TikTokers to collect, organize, and collaboratively vote on content ideas.

## Features

- **右クリックで保存**: 任意のWebページを「ネタ」としてワンクリック保存
- **ボード管理**: カテゴリ別にアイデアを整理（チュートリアル、レビュー、Vlog等）
- **評価システム**: ポテンシャル・工数・トレンド度の3軸で評価
- **コラボ機能**: 共有コードでアイデア��ードを友達と共有・マージ
- **投票**: マージしたボードでベストアイデアに投票
- **サイドパネル**: ブラウジングしながらアイデアを閲覧・追加

## Tech Stack

- Chrome Extension Manifest V3
- Vanilla JS + CSS (no framework)
- chrome.storage.local for persistence
- Base64 JSON encoding for sharing

## Install

1. `chrome://extensions` を開く
2. 「デベロッパーモード」をON
3. 「パッケージ化されていない拡張機能を読み込む」でこのフォルダを選択
