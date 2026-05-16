# bungou-reki — プロジェクトコンベンション

- 全UIテキストは日本語。明朝系フォント (Hiragino Mincho ProN, Yu Mincho, serif fallback)
- カラー: parchment (#f5ecd7), ink (#1a1410), gold (#c8a44c), seal (#a8351a)
- Rust: chrono + serde_json。tauri 2 commands は async fn にして Result<T, String> を返す
- Frontend: ES modules。Tauriバインドは `window.__TAURI__` 経由、ブラウザ単体起動時は localStorage fallback
- 作家データの編集は `src/data/authors.json` のみ。Rust側は読み込み専用
- 日付は ISO 8601 (YYYY-MM-DD)。月日のみのマッチは "MM-DD" 文字列
- テスト: 戦闘・スコア計算は純粋関数として実装し、Rust側でユニットテスト
