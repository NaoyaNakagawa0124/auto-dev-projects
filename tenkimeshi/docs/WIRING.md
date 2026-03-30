# テンキメシ 配線ガイド

## 概要

テンキメシは以下のディスプレイに対応しています:
- SSD1306 OLED ディスプレイ (I2C接続) — 小型プロトタイプ向け
- e-Paper ディスプレイ (SPI接続) — 常時表示向け
- HDMI ディスプレイ — ターミナル出力そのまま

## 必要なパーツ

`BOM.md` を参照してください。

---

## 配線図

### SSD1306 OLED ディスプレイ (I2C接続)

```
  Raspberry Pi                SSD1306 OLED
  ────────────                ────────────
  ┌──────────┐                ┌──────────┐
  │ Pin 1    │── 3.3V ───────│ VCC      │
  │ Pin 3    │── GPIO2(SDA) ─│ SDA      │
  │ Pin 5    │── GPIO3(SCL) ─│ SCL      │
  │ Pin 6    │── GND ────────│ GND      │
  └──────────┘                └──────────┘
```

#### ピン配置詳細

```
  Raspberry Pi GPIO ヘッダー (上から見た図)
  ┌────┬────┐
  │3V3 │ 5V │  ← Pin 1, 2
  ├────┼────┤
  │SDA │ 5V │  ← Pin 3 (GPIO2), Pin 4
  ├────┼────┤
  │SCL │GND │  ← Pin 5 (GPIO3), Pin 6
  ├────┼────┤
  │GP4 │TXD │  ← Pin 7, 8
  ├────┼────┤
  │GND │RXD │  ← Pin 9, 10
  └────┴────┘
  ... (以下省略)
```

#### I2C 有効化手順

1. `sudo raspi-config` を実行
2. `Interface Options` → `I2C` → `Yes`
3. 再起動: `sudo reboot`
4. 接続確認: `i2cdetect -y 1`

```
     0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
00:          -- -- -- -- -- -- -- -- -- -- -- -- --
10: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
20: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
30: -- -- -- -- -- -- -- -- -- -- -- -- 3c -- -- --
40: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
```

`3c` が表示されれば SSD1306 が正しく接続されています。

---

### e-Paper ディスプレイ (SPI接続)

```
  Raspberry Pi                e-Paper 2.13"
  ────────────                ──────────────
  ┌──────────┐                ┌──────────┐
  │ Pin 17   │── 3.3V ───────│ VCC      │
  │ Pin 20   │── GND ────────│ GND      │
  │ Pin 19   │── MOSI ───────│ DIN      │
  │ Pin 23   │── SCLK ───────│ CLK      │
  │ Pin 24   │── CE0 ────────│ CS       │
  │ Pin 22   │── GPIO25 ─────│ DC       │
  │ Pin 11   │── GPIO17 ─────│ RST      │
  │ Pin 18   │── GPIO24 ─────│ BUSY     │
  └──────────┘                └──────────┘
```

#### SPI 有効化手順

1. `sudo raspi-config` を実行
2. `Interface Options` → `SPI` → `Yes`
3. 再起動: `sudo reboot`
4. 確認: `ls /dev/spidev*` で `/dev/spidev0.0` が表示されること

---

### HDMI ディスプレイ（最も簡単）

HDMI ケーブルでディスプレイに接続し、ターミナルで直接実行:

```bash
cd src/
python3 tenkimeshi.py
```

自動起動設定:

```bash
# /etc/rc.local に追加
python3 /home/pi/tenkimeshi/src/tenkimeshi.py &
```

または systemd サービスとして:

```ini
# /etc/systemd/system/tenkimeshi.service
[Unit]
Description=テンキメシ — 天気で決める今日のごはん
After=network-online.target

[Service]
ExecStart=/usr/bin/python3 /home/pi/tenkimeshi/src/tenkimeshi.py
WorkingDirectory=/home/pi/tenkimeshi/src
Restart=always
User=pi

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable tenkimeshi
sudo systemctl start tenkimeshi
```

---

## トラブルシューティング

| 症状 | 対処法 |
|------|--------|
| I2C デバイスが見つからない | 配線を確認、`raspi-config` で I2C を有効化 |
| SPI デバイスが見つからない | `raspi-config` で SPI を有効化 |
| 画面が真っ白 | RST ピンの接続を確認 |
| 文字化け | フォント設定を確認、UTF-8 ロケール設定 |
| API 接続エラー | WiFi 接続を確認、`--demo` モードで動作確認 |
