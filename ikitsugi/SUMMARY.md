# 息継ぎ (ikitsugi) — Build Summary

## What was built
A Chrome/Firefox Manifest V3 browser extension that injects a tiny breathing dot into every web page. The dot quietly pulses in sync with a chosen breathing pattern (4-4-8, box, or 4-7-8). Click it to open a 60-second guided session overlay; the dot expands to a 220px ring that grows with each inhale and shrinks on each exhale, with a phase label and countdown. Sessions are recorded to per-day stats (sessions, cycles, total duration) and shown in the popup with a "今日のセッション" counter and "連続日数" streak.

Designed for the **効率厨ゲーマー** persona — someone who hyper-focuses for hours and forgets to breathe. The dot is intentionally subtle (28px default, glassmorphism background, blue↔amber color blend) and auto-hides during fullscreen / large video playback so it never gets in the way.

## Discovery Roll
- **Source: 35** デベロッパーツール (IDE, CLI, DevOps, CI/CD系の課題)
- **Persona: 7** 効率厨のゲーマー
- **Platform: 5** ブラウザ拡張機能 (Chrome/Firefox MV3)
- **Intent: 4** そっと寄り添う (癒し / 静か)

## Features Built
- **常在の呼吸ドット** — Shadow DOM で全 CSS を隔離した SVG/CSS の小さな点を全ページに inject。タブ滞在中ずっと呼吸し続ける。
- **3 パターンの呼吸**: 4-4-8 (リラックス) / box 4-4-4-4 (集中) / 4-7-8 (鎮静)。`fullnessAt` で 0..1 を出し、`colorAt` で blue↔amber を補間。
- **60 秒ガイドセッション** — ドットをクリックすると 220px の集中オーバーレイに展開。リング、フェーズラベル、残り秒数、プログレスバーが連動。
- **邪魔しない仕組み** — `document.fullscreenElement` 検出、`<video>` の画面占有率検出 (>= 60%) で自動的に opacity:0。タブが hidden の間も停止。
- **設定の永続化** — `chrome.storage.local` に `ikitsugi/settings` と `ikitsugi/stats` を保存。設定変更は `onChanged` 経由でリアルタイムにドット側へ反映。
- **統計** — 1 セッション (= 10秒以上 / 1サイクル以上) 完了でカウント。今日のセッション数、連続日数、累計サイクル数。
- **Popup** — 今日 / 連続 / パターン切り替え / 表示 ON-OFF / 「いま 60 秒」即発。
- **Options** — 全設定 (パターン、表示、位置 [4 隅]、ドットサイズ 18-48、フェーズラベル、邪魔しない設定、統計リセット)。
- **アイコン** — amber の丸を 16/32/48/128 で同梱。

## Tech Stack
- **Manifest V3** ブラウザ拡張機能 (Chrome / Firefox MV3 共通)
- **Vanilla JS** (ES2022)、依存ゼロ
- **Shadow DOM (closed)** で content script のスタイルを完全隔離
- **chrome.storage.local** に永続化、`onChanged` で双方向同期
- **node:test** で 27 テスト (breath / stats / settings / smoke)
- **Pure-logic modules** (`src/modules/`) — Chrome API を一切呼ばず Node からも import 可

## Key Files
```
ikitsugi/
├── src/
│   ├── manifest.json       # MV3 マニフェスト
│   ├── content.js          # 呼吸ドット本体 (Shadow DOM)
│   ├── background.js       # session-complete を受けて統計を蓄積
│   ├── popup.html/.js      # ブラウザアクション popup
│   ├── options.html/.js    # 詳細設定ページ
│   ├── icons/              # 16/32/48/128 px amber dot
│   └── modules/
│       ├── breath.js       # PATTERNS, phaseAt, fullnessAt, colorAt, cyclesIn
│       ├── stats.js        # emptyStats, recordSession, streak, recent
│       └── settings.js     # DEFAULTS, normalize
└── tests/
    ├── breath.test.mjs     # 12 tests
    ├── stats.test.mjs      # 7 tests
    ├── settings.test.mjs   # 6 tests
    └── smoke.test.mjs      # 2 tests (content.js IIFE 無事故実行)
```

## How to Run
1. `chrome://extensions` を開く → 「デベロッパーモード」を ON
2. 「パッケージ化されていない拡張機能を読み込む」 → `ikitsugi/src/` フォルダを選択
3. 任意のページで右下 (デフォルト) に amber 〜 blue で脈打つ小さな点が出る
4. クリックで 60 秒ガイドセッション開始
5. テストは `cd ikitsugi && node --test "tests/*.test.mjs"`

## Tests
**27 passing** (breath: 12 / stats: 7 / settings: 6 / smoke: 2)

## Challenges & Fixes
- **Content scripts と ES modules**: MV3 でも content_scripts は通常の script として動くので、`breath.js` のロジックを `content.js` に inline でミラーした (Rust↔JS のときと同じパターン)。テストでは module 版を別途検証。
- **任意のページ上の CSS 干渉**: Shadow DOM (closed) + `:host { all: initial }` で全 CSS をリセットし、 `position:fixed; z-index:2147483647` を持つ host だけがページに残るようにした。
- **大画面動画検出**: `<video>` 要素のうち、画面の 60% 以上を占めて再生中のものがあれば隠す。YouTube / Twitch / Netflix で意図せず邪魔しないように。
- **smoke test querySelector**: 最小 DOM スタブで innerHTML 経由の子要素を再現するのは現実的でないので、`querySelector` は常に新規スタブ要素を返すようにし、初期化フェーズが例外を投げないことだけ検証する形に倒した。

## Potential Next Steps
- 呼吸履歴のグラフ (recent N 日) を options に追加
- macOS / Windows のシステム通知で「20 分集中したよ。一息どう?」プロンプト (chrome.alarms 既に permission 確保済)
- ボイスガイド (Web Speech API で「吸って」「吐いて」)
- ユーザー定義パターン (吸 X 秒 / 止 Y 秒 / 吐 Z 秒)
- 心拍計 / Apple Watch との連携 (将来的)
