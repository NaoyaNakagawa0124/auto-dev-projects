# 紡ぐ (Tsumugu) — 七十二候×手仕事 Discord ボット

日本の伝統的な暦「七十二候」に基づいて、季節にぴったりの手仕事・クラフトを提案するDiscordボット。

## 特徴

- **七十二候データベース** — 全72候の名前・読み・意味・時期を完全収録
- **季節の手仕事提案** — 各候に合った伝統的な和風クラフトを提案（つまみ細工、水引、刺し子、草木染め等）
- **美しいEmbed表示** — 和風カラーで季節感を演出する Discord Embed
- **スラッシュコマンド** — `/今日の候`, `/次の候`, `/季節の手仕事`, `/暦一覧`
- **CLIモード** — Discordなしでもターミナルで動作確認可能

## 技術スタック

- **Node.js** — ランタイム
- **discord.js v14** — Discord API ラッパー
- **dayjs** — 日付計算

## コマンド一覧

| コマンド | 説明 |
|---------|------|
| `/今日の候` | 今日の七十二候と手仕事を表示 |
| `/次の候` | 次に来る候の情報を表示 |
| `/季節の手仕事` | 現在の季節のおすすめクラフト一覧 |
| `/候を検索 <キーワード>` | キーワードで候を検索 |
| `/暦一覧` | 二十四節気と七十二候の一覧 |

## セットアップ

```bash
cd tsumugu
npm install

# CLIモードで動作確認
node src/cli.js

# Discordボットとして起動（要トークン）
DISCORD_TOKEN=your_token node src/bot.js
```

## CLIモード

Discordなしで全機能をテストできます：

```bash
node src/cli.js today     # 今日の候
node src/cli.js next      # 次の候
node src/cli.js crafts    # 季節の手仕事
node src/cli.js search 桜 # 候を検索
node src/cli.js list      # 暦一覧
```
