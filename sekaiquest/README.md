# 世界クエスト (Sekaiquest) - ASCII世界地図エクスプローラー

A Textual TUI world map explorer. Navigate an ASCII world map, discover destinations, collect passport stamps, and learn fun facts.

## Features

- **ASCII世界地図**: ターミナルに描かれた世界地図をカーソルで探索
- **25+の目的地**: 各都市に面白い豆知識とトレンド情報
- **パスポートスタンプ**: 訪れた都市を記録してコレクション
- **地域情報パネル**: 選択した都市の詳細情報を表示
- **検索機能**: 都市名で素早くジャンプ
- **達成度追跡**: 何%の都市を訪問したか

## How to Run

```bash
pip install textual rich
python3 app.py
```

## Controls

- **矢印キー / WASD**: マップ移動
- **Enter**: 都市を訪問（スタンプ獲得）
- **Tab**: パスポート表示
- **/**: 都市検索
- **Q**: 終了
