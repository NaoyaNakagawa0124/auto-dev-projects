# ピクセルホーム (PixelHome) — 引っ越しタスクで部屋を作ろう

新しいタブを開くたびに、あなたのピクセルアートの部屋が見える。引っ越しタスクを完了するたびに、部屋に家具が増えていく！

## 特徴

- **ピクセルアートの部屋** — ドット絵スタイルの新しいタブページ
- **引っ越しチェックリスト** — 一般的な引っ越しタスクがプリセット
- **タスク＝家具** — タスクを完了すると部屋に家具が配置される
- **シークレットアイテム** — 特定の条件で隠しアイテム（ミーム系）が解放

## インストール

1. Chrome で `chrome://extensions` を開く
2. 「デベロッパーモード」をON
3. 「パッケージ化されていない拡張機能を読み込む」でこのフォルダを選択

## Tech Stack

- Chrome Extension (Manifest V3)
- Vanilla JS / HTML / CSS
- Canvas API for pixel art rendering
- chrome.storage for persistence
