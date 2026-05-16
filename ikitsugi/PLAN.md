# 実装計画 — 息継ぎ

## Phase 1 — Manifest と入れ物
- `manifest.json` (V3): content_scripts, action (popup), options_page, storage 権限
- `src/icons/` 16/32/48/128 PNG (アイコン手描き or stub)
- README/PLAN/CLAUDE

## Phase 2 — 呼吸エンジン (modules/breath.js)
- 呼吸法: BOX (4-4-4-4), R478 (4-7-8), F448 (4-4-8)
- 純粋関数: `phaseAt(pattern, t)` → 'inhale' | 'hold-in' | 'exhale' | 'hold-out'
- スケール関数: `scaleAt(pattern, t)` → 0.4..1.0 (吸う→膨らむ、吐く→縮む)
- サイクル長: `cycleLength(pattern)` → 秒

## Phase 3 — スケジューラ
- 自動セッション (有効時は X 分毎、ユーザータブが foreground かつ非フルスクリーン)
- 1 日のセッション数カウントを `chrome.storage.local` に保存
- recent_sessions[] でリストアップ可能に

## Phase 4 — 拡散ドット (content.js)
- 全ページに inject される SVG ドット (Shadow DOM で CSS 干渉を避ける)
- 常時呼吸し続ける (ページ滞在 = breath ローカル時計を進める)
- フルスクリーン / hidden で透明度 0
- クリックで session overlay 表示

## Phase 5 — Popup (popup.html / popup.js)
- 今日のセッション数、累計サイクル数
- 「いま 60 秒」ボタン (現在タブにセッション送信)
- 呼吸法切替

## Phase 6 — Options
- 呼吸法、ドットの位置 (4 隅)、大きさ、自動セッション間隔

## Phase 7 — テスト
- node:test で phaseAt / scaleAt / cycleLength
- 統計の集計

## Phase 8 — 仕上げ
- 静的 HTML で拡張機能を読まずに表示確認
- 日本語チェック
- README/SUMMARY
