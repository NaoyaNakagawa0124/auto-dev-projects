# 星占 (Hoshiura) — 写真カラー×星座占い

写真の色彩を分析し、最も近い星座を判定して宇宙テーマの占い結果を生成するアプリ。

## 特徴

- **写真カラー分析** — 写真の支配的な色を抽出し、12星座のカラーパレットとマッチング
- **星座判定** — 色の組み合わせから最も共鳴する星座を決定
- **運勢生成** — 総合運・恋愛運・仕事運・ラッキーアイテムをランダム生成
- **美しいWeb UI** — 宇宙テーマのダークUI、星座のビジュアル表示
- **Dart CLI** — ターミナルからも占い実行可能

## 技術スタック

- **Dart** — コアロジック（星座判定・占い生成）
- **HTML/CSS/JS** — Web UI（Canvas色分析）
- **宇宙テーマUI** — グラデーション、星空背景、グラスモーフィズム

## 使い方

### CLI
```bash
cd hoshiura
dart pub get
dart run bin/hoshiura.dart         # ランダム占い
dart run bin/hoshiura.dart --rgb 180,100,220  # 色指定占い
```

### Web UI
```bash
cd hoshiura/web
python3 -m http.server 8080
# ブラウザで http://localhost:8080 を開く
```

## テスト
```bash
dart test
```
