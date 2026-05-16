# chika-channel — Conventions

## Tone (絶対)
- ゲーム性最優先 (Intent 5)。 教育・教訓は出さない。
- 駅 = 動画、 線 = テーマ、 視聴者 = 乗客、 という比喩を全部の UI で貫く。
- 統計テキストは数字優先 (「登録者 1,234」、 「週 +312」)。

## Visual
- 紙地下鉄図風: 背景 #f4eee0 (淡い紙)、 線色は topic ごとに彩度を抑える
- 駅は白丸 + 太縁、 transfer 駅は二重丸
- 紙の縦線で日付帯を描く (毎日 1 セル)
- 派手な ON / OFF アニメーションは控えめ、 視聴者点だけは生き生き

## Topics (固定 6)
| key      | name       | color     | shape |
|----------|------------|-----------|-------|
| cooking  | 料理       | #d49a3f   | ○     |
| gaming   | ゲーム     | #6b6f9c   | □     |
| vlog     | Vlog       | #c47b76   | △     |
| edu      | 学び       | #4a7d5a   | ✕     |
| comedy   | 笑い       | #b8945b   | ◇     |
| shorts   | ショート   | #a08abf   | ▽     |

## Data
- Network: { stations: Station[], lines: Line[] }
- Station: { id, topic, vibe (1-5), x, y, age_days, line_ids[] }
- Line: { id, topic, station_ids: string[] }
- Game: { network, day, week, subscribers, action_points, weather, history[] }

## Tests
- bun:test (assert, beforeEach...)
- 純ロジックは fixed RNG で決定論的に
- server は Bun.fetch で routes を叩く smoke
