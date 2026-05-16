# eiga-ichiba — プロジェクトコンベンション

- C99 標準。Raylib 5.5 を pkg-config 経由で取得
- 全 UI 日本語。Raylib のデフォルトフォントは ASCII しか出ないので、システムフォントを LoadFontEx して使う
- 通貨は「億円」を最小単位として扱い、整数で持つ (端数なし)
- カラー: cinema-red #c5342a, ticker-gold #d4a955, neon-blue #4a8acc, screen-black #0c0e14, paper-light #f1ead2
- ゲームロジックは `game.c` に純粋関数として隔離 (Raylib 依存なし)
- フォント探索: /System/Library/Fonts/ から Hiragino / Yu Gothic / HelveticaNeue を順に試す
