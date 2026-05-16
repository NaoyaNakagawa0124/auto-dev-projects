# fukugyou-bubble — プロジェクトコンベンション

- Rust 2021 / Tauri 2.0 (desktop feature 任意)
- フロントは Vanilla HTML/CSS/ES Modules、ビルドステップなし
- 全 UI 日本語、絵文字を多用 (副業 TikTok 文化への目配り)
- カラー: night #0c0e14, glass #ffffff14, pink-tok #ff2d6f, green-cash #16d68d, gold #f5c542, ink #f1ead2
- 通貨は整数で扱う (¥)。表示時に K / M / 億で省略
- 永続化キー: `fukugyou-bubble/state/v1`
- 自動保存は 5 秒間隔
- Rust 側の `Game` は純粋関数で動作、JS 側と 1:1 ミラー
