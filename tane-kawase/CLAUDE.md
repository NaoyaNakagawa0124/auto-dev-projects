# tane-kawase — Conventions

## Tone (絶対)
- 教育アプリではなく、 友人どうしの儀式アプリ
- 「正解 / 不正解」 を採点しない、 「マスター率」 などのスコアを出さない
- 数字は出すが、 励みのためだけ ("14 包 交わしました")

## Visual
- 土の色: #1f1b13 (背景的)
- 若草: #6fa05a (春菜)
- 朱赤: #c0563b (夏野菜)
- 黄金: #c89238 (秋穀)
- 焦茶: #6b4a32 (冬根)
- 薄紫: #a08abf (草花)
- アクセント (送り主): #d4b06a
- dim: #6b6458

## Crop glyphs (固定)
- 春菜  ψ
- 夏野菜 ◯
- 秋穀  ‖
- 冬根  ▽
- 草花  ✿
- 空    ·

## Data
- field: `~/.tane-kawase/field.json` schema: { version, my_name, packets[], harvested[] }
- packet: `Packet(id, name, topic, sender, receiver, language, seeds[], letter, created_at)`
- Packet を JSON file として扱える (UTF-8, indent=2)
- 1 包 = 1-10 seeds

## Tests
- pytest only (no async)
- Rich の `Console(record=True, force_terminal=False, color_system=None)` でテキスト捕捉
- CLI は capsys
- 対話モードはテストから外す (interactive prompts 不要にする path を用意)
