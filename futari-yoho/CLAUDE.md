# futari-yoho — Conventions

## Tone (絶対)
- 判定しない・スコア化しない・「もっと頑張ろう」を言わない
- 提案も「指示」ではなく「呟き」 (「〜してみては」ではなく「〜な夜」)
- 派手な絵文字・☆★・パーセンテージ・進捗バーは禁止

## Visual
- 夜の照明: 紺 #1a2436 / 砂 #e8d6b3 / 月光 #c8b4d6 / 鈍金 #b8945b / 薄墨 rgba(232,214,179,0.4)
- 余白を多めに
- 罫線は dim
- 天気アイコンは Unicode (☀ ☁ ☂ ⛅ ☾ 〜 凪) — 絵文字ではなく文字

## Data
- 1 日 1 partner = 1 check-in、上書き OK (「あ、寝る前にちょっと変わった」を許す)
- `~/.futari-yoho/data.json` の schema: { version, partners: {a, b}, days: { "YYYY-MM-DD": { a?: CheckIn, b?: CheckIn } } }

## Tests
- pytest、`run_test()` で headless TUI スモーク
- 純ロジックは TUI から分離して並行テスト可能に
