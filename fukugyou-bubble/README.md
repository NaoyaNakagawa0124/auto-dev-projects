# 副業バブル (fukugyou-bubble)

> 「副業」のクリッカー idle ゲーム。ブログ書きから AI アート販売まで 8 種類の副業を運営し、¥10,000,000 を目指す。Tauri 2.0 + Vanilla JS で動く。

## これは何？

副業 TikTok のバズが日常化したこの時代、「副業始めたい」と言いながら一歩を踏み出せない人は多い。**副業バブル** は、その気持ちを健全なゲーム性で消化するクリッカー idle ゲームです。

- 8 種類の副業 (ブログ・YouTube・ドロップシッピング・AI アート・TikTok・フリーランス・プログラミング・オンライン家庭教師) をクリックで稼ぐ
- 稼いだ円でアップグレードを買うと、その副業の「放置収入」が倍になる
- アップグレードのコストは 1.15 倍ずつ上がる、お決まりの idle ゲーム数列
- 約 90 秒に 1 回、画面に「**バズり中**」のオーバーレイが出て、いずれかの副業に 3 倍ボーナス (30 秒間)
- ¥10,000,000 (1 千万円) 到達でクリア

## 特徴

- **Tauri デスクトップ ＆ ブラウザ両対応** — `tauri build` でネイティブ、`python3 -m http.server` で即試せる
- **完全日本語UI** — フォーマットされた円表示 (¥1.2K、¥3.4M)、温かみのある絵文字 (📝🎥🛒🎨📱✏️💻👩‍🏫)
- **ガラスモーフィズム** — 半透明カード + ぼかし + TikTok ピンク × フィンテック緑 × 黒
- **バイラル演出** — 「TikTokでバズ中」「AIアートが話題」などのオーバーレイで臨場感
- **オフライン完結** — Service Worker なしのシンプル PWA、localStorage 永続化
- **Rust ロジックレイヤ** — game.rs に純粋関数を集約、`cargo test` で 25+ 件のユニットテスト
- **JS 並行実装** — 同等のロジックを `modules/game.js` にミラーし、`node --test` で 検証

## 動かし方

### ブラウザで試す (推奨：早い)

```bash
cd src
python3 -m http.server 8000
# http://localhost:8000 をブラウザで
```

### Tauri デスクトップとして

```bash
cargo install tauri-cli --version "^2.0"
cd src-tauri
cargo tauri dev --features desktop
```

### テスト

```bash
cd src-tauri
cargo test                       # Rust 25+ tests

cd ..
node --test tests/               # JS  10+ tests
```

## 操作

- 副業カードをクリックで 1 回稼ぐ
- 「アップグレード」ボタンで放置収入を増やす
- 「バズり中」が出たら集中クリックでボーナス回収
- `R` で新規ゲーム / `M` で BGM のオン/オフ (未実装)
- 進捗は自動的に localStorage に保存

## ライセンス

MIT
