# ashiato-nikki — Conventions

## トーン (絶対)
- 「がんばれ」 「書いて ない 日 です よ」 「N 日 連続」 「continue streak」 「今日 まだ 書いて ません」 など、 罪悪感や強制を煽る言葉は禁止
- 「日記 を 書く」 と言わない (重い)。 「足跡 を 残す」 と言う (軽い)
- 「無理」 「面倒」 「続かない」 のような ネガ語 で ユーザー を 名指し しない
- BANNED_WORDS (UI + エクスポート文): 「がんばれ」 「努力」 「連勝」 「達成」 「神」 「最強」 「失敗」 「ダメ」 「続けて ない」 「続かない 人」

## 配色
- 紙: #faf6ee
- 紙2: #f3eddf
- 墨: #2a2520
- 墨2: #4d4538 (本文)
- 朝: #97a7a0 (補助、 dim)
- 鈍金: #b8945b (アクセント、 主ボタン)
- 罫線: rgba(42,37,32,0.08)

## データ
```ts
type Entry = {
  id: string;          // crypto.randomUUID() か 簡易 hash
  url: string;
  title: string;       // ページ タイトル (空文字 OK)
  note: string;        // 任意 メモ (空文字 OK)
  dateIso: string;     // "YYYY-MM-DD" (local)
  at: string;          // ISO timestamp
};
```

ストレージ キー:
- `ashiato-nikki:entries` — Array<Entry> (新しい順)
- `ashiato-nikki:options` — { exportFormat: "json" | "markdown" } など

## 最小権限
- permissions: `storage` + `activeTab` のみ
- host_permissions: なし (activeTab で十分)
- background script: なし (popup のみ)

## テスト
- Vitest、 unit only
- chrome.storage は memoryStorage adapter で test
- DOM は触らない、 純ロジックのみ
