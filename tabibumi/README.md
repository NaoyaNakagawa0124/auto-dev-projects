# 旅文 (Tabibumi) — エモい旅日記 CLI

一人旅の感情を記録し、美しい「旅の手紙」に変える CLI ツール。ノスタルジア心理学の研究に基づき、やさしい質問で旅の記憶を引き出します。

## 特徴

- **やさしい問いかけ** — 心理学に基づく質問で、旅の感情を丁寧に記録
- **旅の手紙** — 記録した断片から、未来の自分への手紙を自動生成
- **時間と場所の記憶** — タイムスタンプと場所を自動記録
- **美しいターミナル出力** — ANSI色と罫線で、温かみのある表示
- **旅の統計** — 日数、記録数、感情の変化をまとめて表示
- **エクスポート** — Markdown形式で旅の記録を書き出し

## 技術スタック

- **Bun** — 高速ランタイム
- **TypeScript** — 型安全
- **SQLite (bun:sqlite)** — ローカルデータベース

## 使い方

```bash
# インストール不要 — Bunで直接実行
bun run src/cli.ts

# 旅を始める
bun run src/cli.ts start "パリ"

# 今の気持ちを記録
bun run src/cli.ts write

# 旅の記録を振り返る
bun run src/cli.ts read

# 旅の手紙を生成
bun run src/cli.ts letter

# 旅を終える
bun run src/cli.ts end

# 過去の旅一覧
bun run src/cli.ts trips

# Markdownでエクスポート
bun run src/cli.ts export
```
