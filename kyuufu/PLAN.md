# PLAN — 休符

## Phase 1: messages.py (純ロジック、 5 min)
- 40 件の rest message (60 字以内、 命令形なし)
- 禁止語: 「頑張」 「努力」 「寝ろ」 「やめろ」 「効率」 (効率厨を否定する文脈で) 「ダメ」 「だから」
- `pick_message(seed_or_now)` で deterministic にランダム 1 件返す
- BANNED_WORDS は pytest で全文に対して audit

## Phase 2: scheduler.py (時間帯別の選び方、 3 min)
- 22:00–23:59 = 「夜の入口」、 やんわり区切りを示唆
- 00:00–02:59 = 「深夜」、 もうここまでで充分のトーン
- 03:00–05:59 = 「未明」、 明日に渡そうのトーン
- 06:00–21:59 = 「日中」、 雑談トーン (深夜帯メッセージは出さない)
- `tier_for(hour)` で時間帯ラベル / `pick_by_tier(tier, seed)` で時間帯に合った 1 行

## Phase 3: cultural.py (3 min)
- 12 ヶ月分の「世界のどこかで起きている文化イベント」 を 1 件ずつ、 静的データ
- `today_event(date)` で月別 + 「ゲームを閉じて 30 秒、 これに思いを馳せませんか」 の枕詞を付けた 1 行

## Phase 4: responder.py (3 min)
- キーワード反応 (「あと1勝」 「もうちょっと」 「ラスト 1 回」 「あと少し」 「next ファイト」)
- 各キーワードに 2-3 件の non-judgmental 返答、 deterministic random で 1 件選ぶ
- 「わかる、 でも 今日 の 1 勝 は もう 取れて いる」 など、 否定せず認める

## Phase 5: pytest (5 min)
- `tests/test_messages.py`: 40 件、 重複なし、 60 字以内、 禁止語フリー、 pick deterministic
- `tests/test_scheduler.py`: tier_for の境界、 pick_by_tier が空でない
- `tests/test_cultural.py`: 12 件、 today_event が月から正しく取得、 禁止語フリー
- `tests/test_responder.py`: 各キーワードで応答が出る、 禁止語フリー

## Phase 6: bot.py (10 min)
- discord.py Client + app_commands.CommandTree
- スラッシュコマンド: /yasumi /yamedoki /kyou /oyasumi-time
- `tasks.loop(minutes=1)` で毎分時刻チェック、 設定された hh:mm に来たら指定チャンネルに送信
- token は env DISCORD_TOKEN から取得、 無ければ「token を 設定 してね」 と stderr に表示して exit
- bot.py 自体は import 時にコネクションを作らない (テスト可能性)
