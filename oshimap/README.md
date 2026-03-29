# 推しマップ (OshiMap) — 推しの活動を地図で追え

推しのツアー・イベント・聖地巡礼を地図上にマッピング。Rust+WASMで高速描画。

## 特徴

- **日本地図** — SVG描画の47都道府県マップ
- **イベント登録** — 推しが訪れた場所を記録
- **ルート表示** — イベント間を線で結び、ツアールートを可視化
- **カバー率** — 全都道府県の征服率を表示
- **Rust+WASM** — 高速な地理計算とルート最適化

## ビルドと実行

```bash
wasm-pack build --target web
python3 -m http.server 8080
# ブラウザで http://localhost:8080/www/ を開く
```

## Tech Stack

- Rust / wasm-bindgen / wasm-pack
- HTML / CSS / JavaScript (frontend)
- SVG (map rendering)
