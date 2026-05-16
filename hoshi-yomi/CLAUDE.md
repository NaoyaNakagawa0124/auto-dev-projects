# hoshi-yomi — プロジェクトコンベンション

- 全 UI 日本語＋ターゲット言語 (英) を併記
- Godot 4.2+ を想定。4.x 互換の構文のみ使う
- カラー: night (#0a0e1f), star (#fdfbf3), star-glow (#fff4d8), gold (#d4a955), seal (#5e75a8)
- フォント: システム既定 (DynamicFont でJP対応)
- 星座 .tscn は手書きしないでスクリプト内で `_ready()` で構成する
- データの位置情報 (x, y) は 0..1 の正規化座標。ビューポートサイズに掛けて使う
- ユーザー進捗は user://progress.json (JSON。Godot の Resource はあえて使わない)
