# ryogae-kan — プロジェクトコンベンション

- Rust エディション 2021、wasm-bindgen ベース
- 全UI日本語、ターゲット言語は通貨名のみ ISO 表記 (USD, JPY等)
- カラー: stamp-red #c5342a, paper #f1ead2, ink #1f2d3a, gold #c8a14a
- 価格は整数で扱う (小数を持たない実用文化)
- 為替レートはハードコード (2026年5月時点のおおよそ)。アプリは練習用なので厳密性より体験を重視
- judge 閾値: cheap < 0.7、fair 0.7..1.3、expensive >= 1.3 (`include 1.3 as expensive`)
