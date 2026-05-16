# sekai-wadaichou — Conventions

## 絶対ルール (Textual)
- **`_render(self)` メソッドを Screen / Widget サブクラスに定義しない**
  - Textual 内部の `Widget._render` を shadow して、 画面が None で描画される
  - 過去 3 回踏んだバグ (gochisou-goyomi / futari-yoho / meme-fuda)
  - 再描画は `_refresh_view`、 `_redraw`、 `_render_step`、 `_build_panel` 等の名前を使う
- イベントハンドラ (action_*, on_*) は素直に Textual のドキュメント通りに書く

## 禁止語 (cities の talking_point / event、 全 UI テキスト)
- 「頑張」 「努力」 「がんばれ」 「絶対」 「成功」 「勝ち組」
- 「あなたの志望業界は」 「正解はこれ」 のような決めつけ
- 「面接で受かる!」 のような誇張

## トーン
- 1 行 60 文字以内、 体言止め / 「だ」 「である」 ではなく 「です / ます」 推奨
- 数字を出すなら控えめ (「12 都市」 はいいが 「あと 11 都市!」 は煽り)
- 「明日も」 「次の都市は…」 のような未来予約はしない

## 配色 (Textual CSS)
- 紙: #faf6ee
- 墨: #2a2520
- 灯: #d77a3a (アクセント、 spotlight)
- 朝: #97a7a0 (補助、 dim)

## データ形式 (cities.py)
```python
{ "id": "tokyo", "jp": "東京", "lon": 139.7,
  "event": "...",            # 今日 (2026-05-17) のイベント or 文化
  "talking_point": "..." }   # 面接で使える 1 行雑学
```

## テスト
- pytest、 unit only (no Textual screen tests)
- 純ロジック (globe / cities / dossier) のみ、 UI は手動確認
