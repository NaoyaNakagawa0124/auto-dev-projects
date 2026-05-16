# 休符 (kyuufu) — Summary

## What was built
効率厨のゲーマー が深夜 2 時に「あと 1 勝だけ」 を言わなくても良くなる、 静かな Discord bot。 「もう寝ろ」 「効率悪い」 「廃人」 のような命令や蔑称は絶対に言わず、 1 行だけ、 やさしく許可を出す。 4 つのスラッシュコマンド + キーワード反応 + 毎日 hh:mm の自動投稿で構成される。

「休符」 は楽譜の中の意図的な無音、 次の音を意味あるものにするための大切な沈黙。 効率を求める耳には、 ただの「止まれ」 ではなく「ここを休符にする」 という言い回しが届きやすい。

## Discovery Roll
- **Source 27**: Random holiday / cultural event happening today somewhere
- **Persona 7**: 効率厨のゲーマー
- **Platform 8**: Discord / Slack / LINE bot (Discord)
- **Intent 4**: そっと寄り添う — 心拍が下がるか

Persona 7 × Intent 4 の組み合わせが本作の魂。 効率厨が最も嫌うのは命令されること。 「許可」 の形でだけ伝えるという制約が、 トーン全体を決めた。

## Tech Stack
- Python 3.10+ / discord.py 2.7 / dataclasses
- 純ロジック (messages / scheduler / cultural / responder) は src/kyuufu/ に分離、 完全に Discord 非依存でテスト可能
- bot.py は薄いラッパー — yasumi_text() / yamedoki_text() / kyou_text() のヘルパーを介して pure logic を呼ぶ
- スラッシュコマンド 4 種、 毎分 tick の `tasks.loop`、 DM/メンションでのキーワード反応
- pytest で 49 ユニットテスト + 1 動作確認 (KyuufuClient 構築 + slash commands 登録) を bare-import で実施

## Features
- `/yasumi` — 「今日 は ここまで」 を背中で押す 1 行 (時間帯別 40 種類からランダム)
- `/yamedoki <時間>` — あと N 時間でやめたい時の自然な区切り (22:00 / 22:30 / 23:00 ... 02:00 から最適 1 つ)
- `/kyou` — 今日 (世界のどこか) の文化イベント、 月別 12 件 (1 月 京都初詣、 5 月 カンヌ、 7 月 ヘルシンキ白夜、 etc) + 「ゲームを閉じて 30 秒、 これに思いを馳せませんか」
- `/oyasumi-time <hh:mm>` — 毎日 hh:mm に、 自動で /yasumi の 1 行をそのチャンネルへ投稿
- DM / メンションで「あと 1 勝だけ」 「もうちょっと」 「ラスト 1 回」 「ねむい」 「やめる」 などのキーワードに静かに反応
- 時間帯別の語調:
  - 22-23 時 (evening): 「ちょうど 良い 時間 です」 と区切りを示唆
  - 0-2 時 (deep): 「もう 十分 です」 「ゲーム は 明日 も そこに あります」
  - 3-5 時 (predawn): 「明日 へ そっと 受け 渡す 時間 です」
  - 6-21 時 (day): 「窓 の 外 の 光 を 5 秒 だけ」 のような軽い雑談トーン

## Tests (49 passing)
- `tests/test_messages.py` (11) — 40 件、 id / text 重複なし、 句点で終わる、 60 字以内、 BANNED_WORDS フリー、 tier ごと 10 件、 pick 決定的、 命令形「なさい」 無し、 比較表現 (「他の人」 「みんな」 「ランカー」) 無し
- `tests/test_scheduler.py` (11) — tier_for 境界、 全 24 時間が定義される、 quiet hour 判定、 suggest_stop 動作 + 真夜中ラップ
- `tests/test_cultural.py` (8) — 12 月分、 月→event、 framed が prefix で始まる、 BANNED_WORDS フリー
- `tests/test_responder.py` (11) — 各 reaction に 2+ replies、 80 字以内、 BANNED_WORDS フリー、 半角/全角スペース対応、 deterministic
- `tests/test_bot_helpers.py` (8) — yasumi/yamedoki/kyou_text 動作、 deterministic、 BANNED_WORDS フリー、 5 月 → カンヌ確認、 token 無しで import 可能

## Files (10 source files, ~900 LOC)
```
kyuufu/
├── pyproject.toml         # discord.py + pytest-asyncio
├── README.md / PLAN.md / CLAUDE.md / SUMMARY.md
├── .env.example / .gitignore
├── src/kyuufu/
│   ├── __init__.py
│   ├── messages.py        # 40 件 + BANNED_WORDS + tier-aware pick()
│   ├── scheduler.py       # tier_for / suggest_stop / is_quiet_hour
│   ├── cultural.py        # 12 月分の文化イベント + framed()
│   ├── responder.py       # キーワード -> 静かな返事
│   └── bot.py             # discord.py 統合 (helpers + KyuufuClient)
└── tests/                 # 5 files / 49 tests
```

## How to Run
```bash
cd kyuufu
pip install -e ".[test]"
pytest                    # 49 tests, Discord 非依存

# 実機テスト
export DISCORD_TOKEN="..."   # Discord Dev Portal で発行
kyuufu                       # Discord に接続
```

招待 URL は `https://discord.com/api/oauth2/authorize?client_id=<APP_ID>&scope=bot+applications.commands&permissions=2048`。

## Challenges & Fixes
- **トーン制約の自己監査**: 「効率厨を否定しない」 「命令しない」 「比較しない」 を自分で破らないために、 BANNED_WORDS リスト + 命令形「なさい」 検出 + 比較表現「他の人」 「みんな」 「ランカー」 検出を pytest で必ず通すようにした。 1 回 dy01 で 「セーブ で 守って くれます」 と書いたのは命令形ではなく許可形なので OK
- **bot.py が token 無しで import 可能であること**: テスト時に DISCORD_TOKEN を要求されると CI で詰まる。 `main()` 関数の中でだけ os.environ を読むようにし、 モジュール import / KyuufuClient 構築 自体は token 不要に
- **discord.py の app_commands と tasks.loop の組み合わせ**: setup_hook で tree.sync() + tick.start() を呼ぶパターン。 これがないと slash command が登録されない / scheduled task が動かない
- **「あと 1 勝」 のような全角・半角混在の入力に反応**: responder.find_reaction で半角スペース・全角スペースを除去してから部分一致 (「あと1勝」 「あと 1 勝」 「あと　1　勝」 すべてヒット)

## Potential Next Steps
- Slack / LINE bot 版 (responder / messages / cultural は完全に再利用可)
- ユーザーごとの「やすみ時刻」 を JSON で永続化 (現在は in-memory)
- 「7 日に 1 度、 寝た時間のフィードバックを 1 行」 (streak ではなく自己観察ログ)
- 効率厨向けの「最適化された休符」 — 7 分 30 秒の REM サイクル目安など、 数字を出すけど煽らない使い方
- Voice Channel に「やすみ用音楽」 を 1 曲だけ流す機能 (静かなアンビエント)
- 12 ヶ月分の cultural event を倍に拡張、 北半球/南半球の切り替え
