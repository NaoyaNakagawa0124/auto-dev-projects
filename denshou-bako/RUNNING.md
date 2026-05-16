# 伝承箱 — 組み立てと設置

> Raspberry Pi 4 (推奨) または Pi Zero 2 W、 USB マイク、 押しボタン、
> LED 2 つ、 木の小箱 ─ ハードウェアはこれだけ。

## 部品表 (BOM)

| 部品 | 推奨型番 | 概算 |
|---|---|---:|
| Raspberry Pi 4 (2 GB) / Pi Zero 2 W | Pi 4 Model B | ¥ 7,000 |
| microSD カード | SanDisk Ultra 32 GB | ¥ 900 |
| USB-C 電源 (5.1 V / 3 A) | 公式 PSU | ¥ 1,200 |
| USB マイク | Plantronics / ReSpeaker 2-Mics HAT | ¥ 3,500 |
| 小型スピーカー | 3.5 mm 接続、 100 円 SP でも可 | ¥ 500 |
| 大型押しボタン (60 mm 径推奨) | Adafruit 1009 など | ¥ 600 |
| LED 赤 + 黄 (5 mm) | 一般品 + 330 Ω 抵抗 | ¥ 130 |
| ジャンパーケーブル | メス・メス 10 cm × 8 | ¥ 400 |
| 木の小箱 | 15 × 10 × 8 cm | ¥ 300 |
| **合計** |  | **約 ¥ 14,500** |

`denshou parts` で同じ表をターミナルにも出せます。

## 配線図 (BCM ピン番号)

```
           +---------------------+
           |    Raspberry Pi 4   |
           |                     |
           |  USB ─── マイク     |
           |  3.5mm ── スピーカー
           |                     |
           |  GPIO 17 ─┐         |
           |  GND     ─┤         |
           |           │         |
           |       ┌───┴───┐     |
           |       │ ボタン │    |
           |       └───────┘     |
           |                     |
           |  GPIO 23 ─[330Ω]─[● LED 赤]─ GND
           |  GPIO 24 ─[330Ω]─[● LED 黄]─ GND
           +---------------------+
                  │
                 USB-C 5V/3A
```

`denshou wiring` でターミナル表示も可能。

## ソフトウェア設置 (Pi 上で)

```bash
# 1. Raspberry Pi OS (Bookworm 推奨) を microSD に書き込む。
# 2. SSH で接続して以下を実行:

sudo apt update
sudo apt install -y python3-pip python3-venv espeak-ng alsa-utils

python3 -m venv ~/denshou-env
source ~/denshou-env/bin/activate

git clone <this-repo> ~/denshou-bako
cd ~/denshou-bako
pip install -e .[pi]

# 3. 録音先フォルダを作る
mkdir -p ~/denshou-recordings

# 4. テスト
denshou play-today                    # 今日の問いを表示
denshou record --backend pi --out ~/denshou-recordings   # ボタン待ち 1 回
```

## systemd で自動起動

```bash
sudo tee /etc/systemd/system/denshou.service > /dev/null <<'EOF'
[Unit]
Description=Denshou-bako recording loop
After=sound.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/denshou-bako
ExecStart=/home/pi/denshou-env/bin/python -m denshou_bako.cli record --backend pi --out /home/pi/denshou-recordings --loop
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now denshou.service
sudo systemctl status denshou.service
```

(`denshou wiring --systemd` でこのユニットを再出力できます)

## 操作 (使う人へ)

- 黄色 LED が点いていれば「待機中」 (= ボタンを押すと今日の問いが流れる)
- 一回押す → TTS が今日の問いを読み上げる
- もう一度押す → 赤 LED 点灯、 録音開始 (最長 2 分)
- 3 回目の押し → 録音停止、 ありがとうとアナウンス、 ファイル保存
- 2 秒長押し → その日を飛ばす (「飛ばした」 とメタ記録)

## 録音をパソコンで眺める

SD カードを抜いて、 普段使いのパソコンで:

```bash
# Markdown 帳に
denshou book ~/path/to/recordings > wisdom_book.md

# HTML 帳に
denshou book ~/path/to/recordings --html --out wisdom_book.html
open wisdom_book.html
```

## 10 年後の手順

1. SD カードを取り出す。
2. パソコンに挿し、 `~/denshou-recordings` を NAS / 外付け SSD にコピーする。
3. `denshou book` で HTML を生成し、 家族・後輩・後継者に渡す。
4. 必要であれば各 WAV を Whisper / 専門業者で書き起こす (HTML の「書き起こし」 欄に貼る)。

## トラブルシューティング

| 症状 | 確認すること |
|---|---|
| ボタンを押しても何も起きない | `gpio readall` で GPIO 17 が pull-up になっているか |
| 録音されない | `arecord -l` でマイクが見えるか、 `alsamixer` でゲイン |
| TTS が無音 | `espeak-ng -v ja "テスト"` 単独で動くか、 出力先の設定 |
| LED が点かない | 抵抗の向き / 極性 / GPIO 設定 |
| メタ JSON が壊れる | ディスク残量 (SD カードフル) |
