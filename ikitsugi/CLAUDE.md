# ikitsugi — プロジェクトコンベンション

- Manifest V3 (Chrome 拡張機能)
- 全 UI 日本語
- カラー: night #0a0e1a, amber #f5c84a (吸う), blue #82c0ff (吐く), ink #f1ead2, dim rgba(255,255,255,0.5)
- ドットの基本サイズ: 28px、ガイド時は 220px に拡大
- Shadow DOM で全 CSS を隔離 (Web ページのスタイルと干渉しない)
- chrome.storage.local キー: `ikitsugi/settings`, `ikitsugi/stats`
- 副作用ゼロのモジュールは `src/modules/` に置き、Node からも import 可
