"""Parts list and ASCII wiring schematic (printed by `denshou parts/wiring`)."""

from __future__ import annotations

PARTS = (
    # (name, model_hint, approx_yen, note)
    ("Raspberry Pi 4 (2 GB) or Pi Zero 2 W", "Raspberry Pi 4 Model B", 7000, "Pi 4 推奨。Pi Zero 2 W でも可"),
    ("microSD カード (16 GB+)",              "SanDisk Ultra 32 GB",     900,  "Class 10 以上"),
    ("USB-C 電源 (5.1 V / 3 A)",            "公式 PSU",                  1200, "Pi 4 用"),
    ("USB マイク (or ReSpeaker 2-Mics)",    "Plantronics, Mantis, etc.", 3500, "USB マイクが最も安定"),
    ("小型パッシブスピーカー",              "100 円 SP + 3.5mm 配線",   500,  "HDMI モニタの SP でも可"),
    ("大型押しボタン (5 cm 径)",            "Adafruit 16 mm or 60 mm 径", 600, "GPIO 17 へ"),
    ("LED 赤 (録音中)",                     "5 mm 一般",                 50,   "330 Ω と直列、GPIO 23"),
    ("LED 黄 (待機)",                       "5 mm 一般",                 50,   "330 Ω と直列、GPIO 24"),
    ("抵抗 330 Ω × 2",                      "1/4 W カーボン",            30,   ""),
    ("ジャンパーケーブル",                  "10 cm メス・メス",          400,  "GPIO 用"),
    ("木の小箱 (15 × 10 × 8 cm)",          "100 円ショップでも可",       300,  "雰囲気作りに"),
)


PINOUT = """\
  GPIO ピン配置 (BCM):

      ┌──────────────────────────────┐
      │  17  ←  押しボタン (もう片方は GND)
      │  23  ←  LED 赤 (アノード) ─ 330 Ω ─ ピン、 カソード ─ GND
      │  24  ←  LED 黄 (アノード) ─ 330 Ω ─ ピン、 カソード ─ GND
      │  3V3 ←  ボタン内蔵プルアップは Pi 側 (GPIO 設定で有効化)
      │  GND ←  共通グランド
      └──────────────────────────────┘
"""


SCHEMATIC = r"""
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
                  │   │
                 USB-C 5V/3A
"""


SYSTEMD_UNIT = """\
[Unit]
Description=Denshou-bako recording loop
After=sound.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/denshou-bako
ExecStart=/usr/bin/python3 -m denshou_bako.cli record --backend pi --out /home/pi/denshou-recordings
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
"""
