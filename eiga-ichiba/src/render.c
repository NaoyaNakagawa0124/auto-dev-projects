#include "raylib.h"

#include <stdio.h>
#include <string.h>

#include "game.h"
#include "film.h"

/* ============= colors ============= */
#define COL_BG         (Color){ 12, 14, 20, 255 }
#define COL_PAPER      (Color){ 241, 234, 210, 255 }
#define COL_INK        (Color){ 28, 28, 30, 255 }
#define COL_INK_SOFT   (Color){ 80, 78, 70, 255 }
#define COL_NEON_BLUE  (Color){ 74, 138, 204, 255 }
#define COL_NEON_GOLD  (Color){ 212, 169, 85, 255 }
#define COL_CINEMA_RED (Color){ 197, 52, 42, 255 }
#define COL_LINE       (Color){ 110, 100, 80, 200 }

#define PLAYER_COLOR(i) ((i) == 0 ? COL_NEON_BLUE : COL_CINEMA_RED)

/* ============= font ============= */
static Font g_jp_font;
static int g_font_loaded = 0;

/* A wide-but-finite codepoint set that covers the Japanese strings in this
   project. Computed once at startup to keep LoadFontEx cheap. */
static int *build_codepoints(int *count_out) {
    /* ASCII */
    static int buf[8192];
    int n = 0;
    for (int c = 32; c < 127; c++) buf[n++] = c;
    /* The exact codepoints used in our strings. Listed manually to keep the
       font payload small. Add new characters here as the UI grows. */
    static const char *all_jp_chars =
        "映画市場！？・の一二三四五六七八九十百千万億円月日年公開前期予算興行率倍"
        "監督ジャンル度ハイプ予測結果ラウンドプレイヤー勝者引き分け次へ進む退場画面"
        "投資割合手元現金資金交代タイトル開幕本決定総括月初場次回作スコア対戦終了"
        "アクションドラマコメディホラーアニメドキュメンタリー氷都北原真理子極寒で繰り広げ"
        "られる雪上日常地層ファングェン世代年を1つの団地族劇ロボット俺ジョンパーカー壊れた"
        "中男が織りなす春深森声アナカーソンに消えた配信者最後動が月面ピクニックヘニーWカー"
        "2058年、月の表4人出会うも絵筆都市高峰千尋蘇らせる少女ロームービー海底図書館エルザ"
        "ロビン沈没豪華客船室を舞台静謐な群像氷河発電所ヤンモリス直下に建設追ったキュメ"
        "赤い列車斎藤慎平満員密室クライねむれない王女ソフィアキム眠れな旅す子守歌星検査官"
        "マハトサミー銀河系全惑質公務員話灯火少女森桃子冬至夜街灯点歩く17歳画券面パスアンド"
        "コントローラー一つ囲んで遊ぶ作品話題で上場し各プレイヤーは交互に投ぼ手元の何%か決定値"
        "上下キー選択Enterまた決まで運命の出始映ます最終勝負まできた配球宣戦布告総結果あなた"
        "ベストポートフォリオAB赤と青同点引分入力割合 0% 25% 50% 75% 100% 投じる予想"
        "億 円資出口入リターン変動率倍率記録 12 ヶ月パーセント率% 株お互い友人映画オタク振"
        "返競う高い低安低中買い売り運用見守る上昇下落初週末動暴騰暴落終わ新規再戦";
    /* Each unique unicode codepoint */
    int seen[0x10000] = {0};
    const char *p = all_jp_chars;
    while (*p) {
        int codepoint_size = 0;
        int cp = GetCodepoint(p, &codepoint_size);
        if (cp != 0xFFFD && cp >= 0 && cp < 0x10000 && !seen[cp]) {
            seen[cp] = 1;
            buf[n++] = cp;
            if (n >= 8192) break;
        }
        p += (codepoint_size > 0 ? codepoint_size : 1);
    }
    *count_out = n;
    return buf;
}

static void try_load_jp_font(void) {
    int count = 0;
    int *codepoints = build_codepoints(&count);
    const char *fonts_to_try[] = {
        "/System/Library/Fonts/HelveticaNeue.ttc",
        "/System/Library/Fonts/Hiragino Sans GB.ttc",
        "/System/Library/Fonts/Supplemental/Helvetica.ttc",
        "/System/Library/Fonts/Avenir Next.ttc",
        "/Library/Fonts/Arial Unicode.ttf",
        NULL,
    };
    /* Prefer Hiragino if available */
    const char *preferred[] = {
        "/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc",
        "/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc",
        "/System/Library/Fonts/Hiragino Sans W3.ttc",
        NULL,
    };
    for (int i = 0; preferred[i] != NULL; i++) {
        if (FileExists(preferred[i])) {
            g_jp_font = LoadFontEx(preferred[i], 36, codepoints, count);
            if (g_jp_font.texture.id != 0) {
                g_font_loaded = 1;
                return;
            }
        }
    }
    for (int i = 0; fonts_to_try[i] != NULL; i++) {
        if (FileExists(fonts_to_try[i])) {
            g_jp_font = LoadFontEx(fonts_to_try[i], 36, codepoints, count);
            if (g_jp_font.texture.id != 0) {
                g_font_loaded = 1;
                return;
            }
        }
    }
    g_jp_font = GetFontDefault();
    g_font_loaded = 0;
}

static void draw_text(const char *text, float x, float y, float size, Color tint) {
    if (g_font_loaded) {
        DrawTextEx(g_jp_font, text, (Vector2){ x, y }, size, 0, tint);
    } else {
        DrawText(text, (int)x, (int)y, (int)size, tint);
    }
}

static Vector2 measure_text(const char *text, float size) {
    if (g_font_loaded) {
        return MeasureTextEx(g_jp_font, text, size, 0);
    }
    return (Vector2){ (float)MeasureText(text, (int)size), size };
}

static void draw_text_centered(const char *text, float cx, float y, float size, Color tint) {
    Vector2 m = measure_text(text, size);
    draw_text(text, cx - m.x / 2.0f, y, size, tint);
}

/* ============= poster rendering ============= */
static Color genre_palette(Genre g) {
    switch (g) {
        case GENRE_ACTION:      return (Color){ 197, 52, 42, 255 };
        case GENRE_DRAMA:       return (Color){ 74, 96, 138, 255 };
        case GENRE_COMEDY:      return (Color){ 212, 169, 85, 255 };
        case GENRE_HORROR:      return (Color){ 50, 26, 30, 255 };
        case GENRE_SF:          return (Color){ 70, 138, 168, 255 };
        case GENRE_ANIMATION:   return (Color){ 230, 130, 96, 255 };
        case GENRE_DOCUMENTARY: return (Color){ 110, 120, 100, 255 };
    }
    return COL_INK;
}

static void draw_poster(const Film *f, Rectangle box) {
    Color base = genre_palette(f->genre);
    DrawRectangleRec(box, base);
    /* darker tint at top */
    Color top = (Color){
        (unsigned char)(base.r * 0.55), (unsigned char)(base.g * 0.55),
        (unsigned char)(base.b * 0.55), 255 };
    DrawRectangle((int)box.x, (int)box.y, (int)box.width, (int)(box.height * 0.45f), top);
    /* mid band */
    DrawRectangle((int)box.x, (int)(box.y + box.height * 0.45f), (int)box.width, 4,
                  (Color){ 255, 240, 200, 60 });
    /* genre badge */
    Rectangle badge = { box.x + 8, box.y + 8, 92, 22 };
    DrawRectangleRec(badge, (Color){ 0, 0, 0, 180 });
    draw_text(genre_label_jp(f->genre), badge.x + 6, badge.y + 3, 14, COL_PAPER);
    /* title */
    draw_text(f->title, box.x + 14, box.y + box.height * 0.5f, 22, COL_PAPER);
    /* director */
    char buf[128];
    snprintf(buf, sizeof(buf), "監督  %s", f->director);
    draw_text(buf, box.x + 14, box.y + box.height * 0.5f + 30, 14,
              (Color){ 255, 240, 200, 200 });
    /* sticker stripes — abstract */
    for (int i = 0; i < 3; i++) {
        DrawRectangle((int)(box.x + box.width - 40), (int)(box.y + 50 + i * 14),
                      28, 6, (Color){ 255, 240, 200, 60 + i * 40 });
    }
}

/* ============= HUD ============= */
static void draw_hud(const Game *g) {
    const Film *f = game_current_film(g);
    char buf[128];
    /* Top status bar */
    DrawRectangle(0, 0, GetScreenWidth(), 50, (Color){ 24, 26, 36, 230 });
    snprintf(buf, sizeof(buf), "%d月  /  全12ヶ月", g->month_index + 1);
    draw_text(buf, 24, 16, 20, COL_PAPER);
    if (f) {
        snprintf(buf, sizeof(buf), "「%s」", f->title);
        draw_text(buf, 220, 16, 20, COL_NEON_GOLD);
    }
    /* Player cash badges */
    for (int i = 0; i < PLAYER_COUNT; i++) {
        const Player *p = &g->players[i];
        Color c = PLAYER_COLOR(i);
        int x = GetScreenWidth() - 280 + i * 140;
        DrawRectangle(x, 8, 130, 34, (Color){ 0, 0, 0, 120 });
        DrawRectangle(x, 8, 5, 34, c);
        snprintf(buf, sizeof(buf), "P%d  %d億", i + 1, p->cash_oku);
        draw_text(buf, x + 14, 16, 18, COL_PAPER);
    }
}

/* ============= screens ============= */
static void draw_title(void) {
    int sw = GetScreenWidth();
    int sh = GetScreenHeight();
    DrawRectangle(0, 0, sw, sh, COL_BG);
    /* Title block */
    draw_text_centered("映 画 市 場", (float)sw / 2.0f, sh * 0.20f, 78, COL_NEON_GOLD);
    draw_text_centered("eiga-ichiba", (float)sw / 2.0f, sh * 0.28f, 18,
                       (Color){ 200, 200, 200, 180 });
    draw_text_centered("二人で囲む、映画オタクの株式投資ゲーム", (float)sw / 2.0f,
                       sh * 0.36f, 22, COL_PAPER);

    /* Rules block */
    Rectangle box = { (float)sw / 2.0f - 320, sh * 0.46f, 640, 200 };
    DrawRectangleLinesEx(box, 1, COL_LINE);
    const char *rules[] = {
        "・パスアンドプレイ。一つのキーボードを 2 人で交代しながら遊ぶ",
        "・毎月 1 本、話題作が上場。手元資金の 0/25/50/75/100 % を投資する",
        "・公開後、運命の興行リターンが公開。投資額 × 倍率が手元に戻る",
        "・12 ヶ月終わったとき、現金が多い方が勝者",
    };
    for (int i = 0; i < 4; i++) {
        draw_text(rules[i], box.x + 20, box.y + 22 + i * 36, 18, COL_PAPER);
    }
    draw_text_centered("Enter で開幕", (float)sw / 2.0f, sh * 0.82f, 22, COL_CINEMA_RED);
}

static void draw_preview(const Game *g) {
    int sw = GetScreenWidth();
    int sh = GetScreenHeight();
    DrawRectangle(0, 0, sw, sh, COL_BG);
    draw_hud(g);
    const Film *f = game_current_film(g);
    Rectangle poster = { (float)sw / 2.0f - 160, 90, 320, 440 };
    draw_poster(f, poster);
    /* Pitch */
    draw_text_centered(f->pitch, (float)sw / 2.0f, 555, 18,
                       (Color){ 220, 220, 220, 220 });
    /* Stats card */
    char buf[128];
    Rectangle stats = { (float)sw / 2.0f - 240, 595, 480, 60 };
    DrawRectangleLinesEx(stats, 1, COL_LINE);
    snprintf(buf, sizeof(buf), "予算 %d 億円  /  期待度 %d  /  公開予定 %d 月",
             f->budget_oku, f->hype, f->month);
    draw_text(buf, stats.x + 18, stats.y + 18, 18, COL_PAPER);
    /* Action prompt */
    draw_text_centered("Enter で予測ラウンドへ進む",
                       (float)sw / 2.0f, sh - 36, 18, COL_NEON_GOLD);
}

static void draw_allocator(const Game *g) {
    int sw = GetScreenWidth();
    int sh = GetScreenHeight();
    DrawRectangle(0, 0, sw, sh, COL_BG);
    draw_hud(g);
    int player_idx = g->current_player;
    Color pc = PLAYER_COLOR(player_idx);
    char buf[128];
    snprintf(buf, sizeof(buf), "プレイヤー %d  ➜  投資割合を選ぶ", player_idx + 1);
    draw_text_centered(buf, (float)sw / 2.0f, 80, 28, pc);

    const Player *p = &g->players[player_idx];
    snprintf(buf, sizeof(buf), "手元資金  %d 億円", p->cash_oku);
    draw_text_centered(buf, (float)sw / 2.0f, 130, 18, COL_PAPER);

    /* Bar of options */
    int opts[5] = { 0, 25, 50, 75, 100 };
    float w = 140, h = 90, gap = 12;
    float total_w = w * 5 + gap * 4;
    float ox = (float)sw / 2.0f - total_w / 2.0f;
    float oy = sh * 0.32f;
    for (int i = 0; i < 5; i++) {
        Rectangle r = { ox + i * (w + gap), oy, w, h };
        int selected = (p->alloc_pct == opts[i]);
        DrawRectangleRec(r, selected ? pc : (Color){ 32, 36, 50, 255 });
        DrawRectangleLinesEx(r, 1, selected ? COL_PAPER : COL_LINE);
        snprintf(buf, sizeof(buf), "%d %%", opts[i]);
        draw_text_centered(buf, r.x + r.width / 2.0f, r.y + 18, 28,
                           selected ? COL_INK : COL_PAPER);
        snprintf(buf, sizeof(buf), "%d 億", (p->cash_oku * opts[i]) / 100);
        draw_text_centered(buf, r.x + r.width / 2.0f, r.y + 56, 16,
                           selected ? COL_INK : (Color){ 200, 200, 200, 200 });
    }
    draw_text_centered("← → で選択、Enter で決定", (float)sw / 2.0f, oy + h + 30,
                       18, COL_PAPER);

    /* Poster reminder */
    const Film *f = game_current_film(g);
    Rectangle small = { 24, sh - 200, 160, 170 };
    draw_poster(f, small);
}

static void draw_handoff(const Game *g) {
    int sw = GetScreenWidth();
    int sh = GetScreenHeight();
    DrawRectangle(0, 0, sw, sh, COL_BG);
    Color pc = PLAYER_COLOR(1);
    draw_text_centered("プレイヤー 1 の入力完了", (float)sw / 2.0f, sh * 0.36f, 26,
                       COL_PAPER);
    draw_text_centered("コントローラーをプレイヤー 2 に渡してください",
                       (float)sw / 2.0f, sh * 0.46f, 22, pc);
    draw_text_centered("Enter で続行", (float)sw / 2.0f, sh * 0.62f, 22,
                       COL_NEON_GOLD);
    (void)g;
}

static void draw_reveal(const Game *g, float reveal_t) {
    int sw = GetScreenWidth();
    int sh = GetScreenHeight();
    DrawRectangle(0, 0, sw, sh, COL_BG);
    draw_hud(g);
    char buf[128];
    draw_text_centered("公開！運命の興行リターン", (float)sw / 2.0f, 90, 28,
                       COL_CINEMA_RED);
    int mult = g->month_multiplier_x100;
    /* Multiplier bar */
    float bar_w = 600 * (mult / 420.0f);
    if (bar_w < 80) bar_w = 80;
    if (reveal_t < 1.0f) bar_w *= reveal_t;
    float bx = (float)sw / 2.0f - 300;
    Rectangle frame = { bx, 150, 600, 50 };
    DrawRectangleLinesEx(frame, 2, COL_LINE);
    DrawRectangle((int)frame.x, (int)frame.y, (int)bar_w, (int)frame.height,
                  mult >= 100 ? COL_NEON_GOLD : COL_CINEMA_RED);
    snprintf(buf, sizeof(buf), "× %.2f", mult / 100.0f);
    draw_text_centered(buf, (float)sw / 2.0f, 215, 36, COL_PAPER);

    /* Show each player's allocation */
    for (int i = 0; i < PLAYER_COUNT; i++) {
        const Player *p = &g->players[i];
        Color c = PLAYER_COLOR(i);
        int invested = game_alloc_amount(p);
        int returned = (invested * mult) / 100;
        int net = returned - invested;
        Rectangle card = { (float)sw / 2.0f - 320 + i * 320, 280, 300, 200 };
        DrawRectangleLinesEx(card, 1, c);
        snprintf(buf, sizeof(buf), "プレイヤー %d", i + 1);
        draw_text(buf, card.x + 16, card.y + 14, 22, c);
        snprintf(buf, sizeof(buf), "投資割合  %d%%", p->alloc_pct);
        draw_text(buf, card.x + 16, card.y + 50, 18, COL_PAPER);
        snprintf(buf, sizeof(buf), "投入  %d 億 ➜  回収  %d 億", invested, returned);
        draw_text(buf, card.x + 16, card.y + 84, 18, COL_PAPER);
        Color delta = net > 0 ? COL_NEON_GOLD : (net < 0 ? COL_CINEMA_RED : COL_PAPER);
        snprintf(buf, sizeof(buf), "%s%d 億", net >= 0 ? "+" : "", net);
        draw_text(buf, card.x + 16, card.y + 120, 28, delta);
    }
    draw_text_centered("Enter で月末締めへ", (float)sw / 2.0f, sh - 36, 18,
                       COL_NEON_GOLD);
}

static void draw_month_result(const Game *g) {
    int sw = GetScreenWidth();
    int sh = GetScreenHeight();
    DrawRectangle(0, 0, sw, sh, COL_BG);
    draw_hud(g);
    char buf[128];
    int month = g->month_index + 1;
    snprintf(buf, sizeof(buf), "%d 月 締め", month);
    draw_text_centered(buf, (float)sw / 2.0f, 100, 32, COL_NEON_GOLD);
    /* Current standings */
    for (int i = 0; i < PLAYER_COUNT; i++) {
        const Player *p = &g->players[i];
        Color c = PLAYER_COLOR(i);
        int y = 200 + i * 130;
        snprintf(buf, sizeof(buf), "プレイヤー %d", i + 1);
        draw_text(buf, 80, y, 22, c);
        snprintf(buf, sizeof(buf), "現金残高  %d 億円", p->cash_oku);
        draw_text(buf, 80, y + 36, 24, COL_PAPER);
        snprintf(buf, sizeof(buf), "(直近: 投入 %d → 回収 %d)",
                 p->last_invested, p->last_return);
        draw_text(buf, 80, y + 70, 16,
                  (Color){ 200, 200, 200, 180 });
        /* Bar */
        float max_cash = 600.0f;
        float bw = (p->cash_oku / max_cash) * 700.0f;
        if (bw < 0) bw = 0;
        if (bw > 700) bw = 700;
        DrawRectangle(420, y + 10, (int)bw, 56, c);
        DrawRectangleLines(420, y + 10, 700, 56, COL_LINE);
    }
    if (g->month_index + 1 < FILM_COUNT) {
        draw_text_centered("Enter で次の月へ", (float)sw / 2.0f, sh - 36, 18,
                           COL_NEON_GOLD);
    } else {
        draw_text_centered("Enter で総括へ", (float)sw / 2.0f, sh - 36, 18,
                           COL_CINEMA_RED);
    }
}

static void draw_game_over(const Game *g) {
    int sw = GetScreenWidth();
    int sh = GetScreenHeight();
    DrawRectangle(0, 0, sw, sh, COL_BG);
    draw_text_centered("シーズン総括", (float)sw / 2.0f, 80, 38, COL_NEON_GOLD);
    int winner = game_winner(g);
    const char *result =
        (winner == -1) ? "引き分け" :
        (winner == 0)  ? "プレイヤー 1 の勝利" :
                         "プレイヤー 2 の勝利";
    Color rc = (winner == -1) ? COL_PAPER : PLAYER_COLOR(winner);
    draw_text_centered(result, (float)sw / 2.0f, 140, 32, rc);

    char buf[128];
    for (int i = 0; i < PLAYER_COUNT; i++) {
        const Player *p = &g->players[i];
        int x = (i == 0) ? 80 : sw / 2 + 20;
        Color c = PLAYER_COLOR(i);
        Rectangle card = { (float)x, 220, sw / 2.0f - 100, 380 };
        DrawRectangleLinesEx(card, 1, c);
        snprintf(buf, sizeof(buf), "プレイヤー %d", i + 1);
        draw_text(buf, card.x + 18, card.y + 18, 24, c);
        snprintf(buf, sizeof(buf), "最終残高  %d 億円", p->cash_oku);
        draw_text(buf, card.x + 18, card.y + 60, 22, COL_PAPER);
        int diff = p->cash_oku - STARTING_OKU;
        Color dc = diff > 0 ? COL_NEON_GOLD : (diff < 0 ? COL_CINEMA_RED : COL_PAPER);
        snprintf(buf, sizeof(buf), "初期 100 → %s%d 億",
                 diff >= 0 ? "+" : "", diff);
        draw_text(buf, card.x + 18, card.y + 96, 18, dc);

        draw_text("月別倍率", card.x + 18, card.y + 140, 16, COL_PAPER);
        for (int m = 0; m < FILM_COUNT; m++) {
            int mult = g->history_mult[m];
            const Film *f = film_get(m);
            snprintf(buf, sizeof(buf), "%2d月 %s  ×%.2f", m + 1,
                     f ? f->title : "?", mult / 100.0f);
            draw_text(buf, card.x + 18, card.y + 168 + m * 18, 14, COL_PAPER);
        }
    }
    draw_text_centered("R で再戦  /  ESC で終了", (float)sw / 2.0f, sh - 36, 18,
                       COL_NEON_GOLD);
}

void render_init(void) {
    try_load_jp_font();
}

void render_unload(void) {
    if (g_font_loaded) {
        UnloadFont(g_jp_font);
        g_font_loaded = 0;
    }
}

void render_frame(const Game *g, float reveal_t) {
    BeginDrawing();
    ClearBackground(COL_BG);
    switch (g->phase) {
        case PHASE_TITLE:        draw_title(); break;
        case PHASE_PREVIEW:      draw_preview(g); break;
        case PHASE_ALLOC_P1:
        case PHASE_ALLOC_P2:     draw_allocator(g); break;
        case PHASE_HANDOFF:      draw_handoff(g); break;
        case PHASE_REVEAL:       draw_reveal(g, reveal_t); break;
        case PHASE_MONTH_RESULT: draw_month_result(g); break;
        case PHASE_GAME_OVER:    draw_game_over(g); break;
    }
    EndDrawing();
}
