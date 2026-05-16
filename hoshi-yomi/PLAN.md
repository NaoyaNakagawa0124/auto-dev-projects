# 実装計画 — 星詠み

## Phase 1 — プロジェクト
- `project.godot` (Godot 4.2)
- 1280×720 のキャンバス
- メインシーン = `scenes/Main.tscn`

## Phase 2 — データ
- `data/constellations.json` に 12 星座
- フィールド: id, label_jp, label_target (英語), label_target_pron (カナ), stars [{x, y}], story

## Phase 3 — 星空
- `scenes/Starfield.tscn` — ColorRect (深紺背景) + 多数の Sprite/Polygon の小さな星
- カスタムグローシェーダで星に発光感
- 緩やかなドリフトで星空が動く感覚

## Phase 4 — 星座
- `scenes/Constellation.tscn` — 12 の星をプレイヤーがタップ
- 数字付きヒント表示
- 正しい順で繋がるとライン (Line2D) が金色に光る
- ミス時の優しい揺らぎ

## Phase 5 — UI
- 開始画面: タイトル + "星詠みを始める"
- 夜空辞書: 解き明かした星座リスト + 未解決の星座リスト
- 完成時オーバーレイ: 日本語＋ターゲット言語

## Phase 6 — 永続化
- `user://progress.json` に discovered: [id,...] を保存

## Phase 7 — 検証
- Python スクリプトで JSON とプロジェクト構造を検証
- ファイル参照の整合性
- 単語数・星数のバウンドチェック

## Phase 8 — 仕上げ
- SUMMARY.md
- 日本語チェック
- README に画面遷移図
