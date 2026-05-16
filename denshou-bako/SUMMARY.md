# 伝承箱 (denshou-bako) — Build Summary

## What was built
Raspberry Pi の枕元の小さな箱に、 シニアが 1 日 1 問ずつ仕事の知恵を吹き
込み、 10 年以上残せるアーカイブを作るデバイスのソフトウェア一式
(Python パッケージ + 配線図 + 部品表 + systemd unit)。

仕様:
- 365 個の B2B 知恵問いを 7 カテゴリにわたって用意 (仕事の哲学 / ひととの
  距離 / お金の感覚 / 失敗から学んだ / 道具と現場 / 時代の変化 / 後輩へ)
- 質問は日付に決定論的に対応、 1 週間でカテゴリが一周するように interleave
- 押しボタン 1 つ・LED 2 つの極小ハードウェア、 espeak-ng で TTS 読み上げ
- arecord で 16 kHz WAV を SD カードに保存、 同時に JSON メタも保存
- アーカイブから Markdown / HTML 「知恵帳」 を生成 (書き起こし欄つき)
- 100 円ショップの木箱に入れれば完成、 概算 ¥14,500

10 年後にこの録音を聞いた孫・後輩・後継者にとって、 本人より価値があると
いうのが設計の主軸 (Intent 6 — 10 年後も価値があるか)。

## Discovery Roll
- **Source: 18** B2B enterprise pain points (CRM, ERP, invoicing, HR, logistics)
- **Persona: 36** 老後を楽しんでいるシニア
- **Platform: 16** Arduino / Raspberry Pi IoT project (code + wiring guide)
- **Intent: 6** 記録して残す (アーカイブ / 思い出 / 個人史) — 10 年後も価値があるか

## Features Built
- **365 問のB2B 知恵問いバンク** (7 カテゴリ × 約 52 問)、 dates → questions は決定論的、 interleave で 1 週間に 7 カテゴリ全部に触れる
- **Backend abstraction** (`Backend` 抽象クラス)、 実装 3 つ:
  - `MockBackend` — 無ハードウェアで動く、 テストと dev 用、 silent WAV を吐く
  - `MacBackend` — `say` + `sox`、 開発者の Mac で動かす用
  - `PiBackend` — `espeak-ng` + `arecord` + RPi.GPIO、 本番
- **`run_session()`** — 1 サイクルのオーケストレーション (TTS → ボタン待ち → 録音 → メタ保存)、 2 秒長押しで「飛ばす」、 タイムアウトでも skip
- **`denshou play-today [DATE]`** — 今日の問いを Rich Panel で表示、 `--speak` で TTS も実行
- **`denshou record --backend pi --out DIR [--loop]`** — 本番のボタン受付ループ、 systemd で永続化
- **`denshou book DIR [--html] [--out FILE]`** — アーカイブから Markdown / HTML の知恵帳を生成。 各エントリに 「書き起こし: ここに貼ってください」 のプレースホルダ
- **`denshou demo --out DIR --days N`** — N 日分の mock 録音 + メタを生成 (ハードウェア無しでも本物のような体験を確認可能)
- **`denshou parts`** — 部品表 (BOM)、 概算 ¥14,500
- **`denshou wiring [--systemd]`** — ASCII 配線図 + ピン配置 + systemd unit
- **RUNNING.md** — Raspberry Pi 上での組み立て・配線・systemd 設定・トラブルシューティングまで一通り

## Tech Stack
- Python 3.10+ (Pi にも入る)
- Rich 13.x (CLI 表示)
- argparse でサブコマンド構成
- 標準 `wave` モジュールで silent WAV (mock)
- 録音は `arecord` / `sox`、 TTS は `espeak-ng` / `say` (subprocess thin wrappers)
- RPi.GPIO (extras: `pi`) は lazy import、 普段の dev に不要
- pytest + capsys

## Key Files
```
denshou-bako/
├── src/denshou_bako/
│   ├── __init__.py
│   ├── cli.py            # argparse + 6 サブコマンド
│   ├── audio.py          # Backend / MockBackend / MacBackend / PiBackend
│   ├── session.py        # run_session() — 1 サイクルの編成
│   ├── book.py           # Markdown / HTML 知恵帳レンダラ
│   ├── questions.py      # 365 問 + interleave + question_for(date)
│   ├── categories.py     # 7 カテゴリの定義
│   └── wiring.py         # 部品表 + ASCII 配線 + systemd unit テンプレート
├── tests/                # categories 5 / questions 8 / audio 7 / session 6 / book 6 / cli 9
├── pyproject.toml
├── README.md / RUNNING.md / PLAN.md / CLAUDE.md
└── SUMMARY.md
```

## How to Run

### 開発機 (Mac/Linux) で
```bash
cd denshou-bako
pip install -e .

denshou                                       # 今日の問いを表示
denshou play-today 2026-05-17 --speak         # TTS も実行
denshou demo --out /tmp/denshou --days 14    # サンプルアーカイブ
denshou book /tmp/denshou                     # Markdown 知恵帳
denshou book /tmp/denshou --html --out wisdom.html
denshou parts                                 # 部品表
denshou wiring --systemd                      # 配線図 + systemd unit

# テスト
pytest -q                                     # 41 tests
```

### Raspberry Pi で
```bash
sudo apt install -y espeak-ng alsa-utils
pip install -e .[pi]
denshou record --backend pi --out ~/denshou-recordings --loop
# (詳細は RUNNING.md を参照)
```

## Tests
**41 passing** (categories 5 / questions 8 / audio 7 / session 6 / book 6 / cli 9)

## Challenges & Fixes
- **質問の並びをカテゴリで block すると 1 週間連続で同じテーマになる** — 最初は `_RAW` の順をそのまま使っていたが、 demo を 7 日生成すると全部 「お金の感覚」 だった。 `_interleave_by_category` で 7 カテゴリを 1 ずつ取り出す形にして、 1 週間で全カテゴリに触れるようにした。
- **ハードウェアなしで信頼できるテストを書く** — `MockBackend` を最初から設計の中心に置き、 `Backend` を抽象クラスにして、 PiBackend は lazy import (RPi.GPIO 未インストールでも import エラーにならない) にした。
- **本物の Pi を持っていない** — テスト不可能な実機部分は RUNNING.md に手動チェックリストとして書き残し、 ソフトウェア側は 41 テストで担保。
- **「書き起こし」 をどう扱うか** — Whisper を組み込むと依存が重い + Pi で動かすには Whisper.cpp が要る。 妥協として 「録音と書き起こし欄を残す」 で止め、 後でユーザーが手動 / Whisper 別経路で埋める前提に。 これは長期保管の哲学にも合う (10 年経って誰かが新しい書き起こし AI で再処理できる)。

## What it means that this is the 100th app

`/loop 30m /auto-dev` で 12 時間以上を経て 100 個目に到達しました。
お題が「シニア × B2B × IoT × アーカイブ」 と 4 つの軸を完全にバラした状態で、
何を作るかが定まるまで時間がかかった分、 出来上がったものは 「本人より、
本人がいなくなった後に価値が出る」 という、 自動ビルドが偶然たどり着いた
小さな哲学物件になりました。

## Potential Next Steps
- Whisper.cpp を Pi 4 でローカル走らせる pipeline (オプション extras)
- 質問の声を espeak-ng → VOICEVOX / Coqui TTS でもっと自然に
- 「家族向け」 と 「業界向け」 で問いの選択を切り替える `--audience` フラグ
- Pi の代わりに macOS Menu Bar アプリ版 (毎晩 22:00 通知 + 録音)
- 「言わなくていい問い」 ── ユーザーが避けたいテーマを設定で除外
- 録音ファイルを E2E 暗号化 (passphrase 必須で 10 年後の家族のみ開封可)
- HTML 知恵帳の カテゴリ別 sparkline (各カテゴリの密度)
