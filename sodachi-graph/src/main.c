#include <raylib.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <stdbool.h>
#include <math.h>
#include "story.h"

#define SCREEN_W 1280
#define SCREEN_H 720
#define FONT_PX 96

#define COL_BG       (Color){0xFA, 0xF6, 0xE9, 0xFF}
#define COL_BG_DARK  (Color){0xEF, 0xE8, 0xD2, 0xFF}
#define COL_TEXT     (Color){0x2D, 0x31, 0x42, 0xFF}
#define COL_MUTED    (Color){0x6B, 0x6F, 0x7B, 0xFF}
#define COL_ACCENT   (Color){0xE8, 0x7A, 0x5D, 0xFF}
#define COL_PANEL    (Color){0xFF, 0xFF, 0xFF, 0xF2}
#define COL_PANEL_BD (Color){0x2D, 0x31, 0x42, 0x33}
#define COL_BTN      (Color){0xFF, 0xFF, 0xFF, 0xFF}
#define COL_BTN_HOV  (Color){0xFF, 0xE6, 0xC9, 0xFF}
#define COL_BTN_BD   (Color){0xE8, 0x7A, 0x5D, 0xFF}
#define COL_CHI      (Color){0x4D, 0x96, 0xCB, 0xFF}
#define COL_TOKU     (Color){0x88, 0xB7, 0x6B, 0xFF}
#define COL_TAI      (Color){0xE8, 0x7A, 0x5D, 0xFF}
#define COL_JOU      (Color){0xCB, 0x6F, 0xA9, 0xFF}

typedef enum {
    SCENE_TITLE = 0,
    SCENE_CHAPTER_TITLE,
    SCENE_INTRO_1,
    SCENE_INTRO_2,
    SCENE_CHOICE_1,
    SCENE_RESPONSE_1,
    SCENE_CHOICE_2,
    SCENE_RESPONSE_2,
    SCENE_DASHBOARD,
    SCENE_ENDING
} Scene;

typedef struct {
    Scene scene;
    int chapter;
    int last_choice_idx;
    int choice_made[CHAPTER_COUNT][CHOICES_PER_CHAPTER];
    Stats stats;
    Stats prev_stats;
    Stats target_stats;
    float dash_anim;
    float fade;
    const Ending *ending;
} Game;

static Font g_font;

static void game_reset(Game *g) {
    g->scene = SCENE_TITLE;
    g->chapter = 0;
    g->last_choice_idx = 0;
    for (int i = 0; i < CHAPTER_COUNT; i++)
        for (int j = 0; j < CHOICES_PER_CHAPTER; j++)
            g->choice_made[i][j] = -1;
    g->stats = (Stats){50, 50, 50, 50};
    g->prev_stats = g->stats;
    g->target_stats = g->stats;
    g->dash_anim = 0.0f;
    g->fade = 1.0f;
    g->ending = NULL;
}

static char *gather_text_buffer(void) {
    size_t cap = 131072;
    char *buf = (char*)malloc(cap);
    buf[0] = 0;
    size_t len = 0;

    const char *ui_strings[] = {
        "育ちグラフ",
        "親と子の選択が、未来を描く",
        "ビジュアルノベル × データダッシュボード",
        "クリックではじめる",
        "クリックで進む",
        "選んでください",
        "成長レポート",
        "智 知性",
        "徳 思いやり",
        "体 健やかさ",
        "情 感性",
        "今回の章で",
        "育ちの結末",
        "もう一度はじめる",
        "あなたの育てた子は……",
        "第一章 第二章 第三章 第四章 第五章",
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "abcdefghijklmnopqrstuvwxyz",
        "0123456789",
        "歳〜",
        "・、。「」（）／：；！？　 ",
        "+−"
    };
    int n = (int)(sizeof(ui_strings)/sizeof(ui_strings[0]));
    for (int i = 0; i < n; i++) {
        size_t add = strlen(ui_strings[i]);
        if (len + add + 2 < cap) {
            memcpy(buf + len, ui_strings[i], add);
            len += add;
            buf[len++] = '\n';
        }
    }

    for (int i = 0; i < CHAPTER_COUNT; i++) {
        const Chapter *c = &STORY[i];
        const char *parts[] = {c->title, c->age_range, c->intro_1, c->intro_2};
        for (int k = 0; k < 4; k++) {
            size_t add = strlen(parts[k]);
            if (len + add + 2 < cap) { memcpy(buf+len, parts[k], add); len += add; buf[len++] = '\n'; }
        }
        for (int j = 0; j < CHOICES_PER_CHAPTER; j++) {
            const ChoicePoint *cp = &c->choices[j];
            const char *cparts[] = {cp->prompt, cp->opt_a, cp->opt_b, cp->response_a, cp->response_b};
            for (int k = 0; k < 5; k++) {
                size_t add = strlen(cparts[k]);
                if (len + add + 2 < cap) { memcpy(buf+len, cparts[k], add); len += add; buf[len++] = '\n'; }
            }
        }
    }

    for (int i = 0; i < ALL_ENDINGS_COUNT; i++) {
        const char *parts[] = {ALL_ENDINGS[i].title, ALL_ENDINGS[i].body};
        for (int k = 0; k < 2; k++) {
            size_t add = strlen(parts[k]);
            if (len + add + 2 < cap) { memcpy(buf+len, parts[k], add); len += add; buf[len++] = '\n'; }
        }
    }
    buf[len] = 0;
    return buf;
}

static void load_japanese_font(void) {
    char *txt = gather_text_buffer();
    int cp_count = 0;
    int *codepoints = LoadCodepoints(txt, &cp_count);

    int *unique = (int*)calloc(cp_count + 8, sizeof(int));
    int unique_n = 0;
    for (int i = 0; i < cp_count; i++) {
        bool dup = false;
        for (int j = 0; j < unique_n; j++) if (unique[j] == codepoints[i]) { dup = true; break; }
        if (!dup) unique[unique_n++] = codepoints[i];
    }

    g_font = LoadFontEx("assets/NotoSansJP.ttf", FONT_PX, unique, unique_n);
    SetTextureFilter(g_font.texture, TEXTURE_FILTER_BILINEAR);

    UnloadCodepoints(codepoints);
    free(unique);
    free(txt);
}

static void draw_text_ex(const char *text, float x, float y, float size, Color color) {
    DrawTextEx(g_font, text, (Vector2){x, y}, size, 1.0f, color);
}

static Vector2 measure_text(const char *text, float size) {
    return MeasureTextEx(g_font, text, size, 1.0f);
}

static void draw_text_centered(const char *text, float cx, float y, float size, Color color) {
    Vector2 sz = measure_text(text, size);
    DrawTextEx(g_font, text, (Vector2){cx - sz.x*0.5f, y}, size, 1.0f, color);
}

static void draw_wrapped(const char *text, Rectangle rect, float size, float line_h, Color color) {
    char line[2048];
    line[0] = 0;
    int line_len = 0;
    float y = rect.y;
    const char *p = text;

    while (*p) {
        int cp_size = 0;
        int cp = GetCodepointNext(p, &cp_size);
        if (cp == 0) break;

        if (cp == '\n') {
            line[line_len] = 0;
            DrawTextEx(g_font, line, (Vector2){rect.x, y}, size, 1.0f, color);
            y += line_h;
            line_len = 0;
            p += cp_size;
            continue;
        }

        if (line_len + cp_size >= (int)sizeof(line) - 1) {
            line[line_len] = 0;
            DrawTextEx(g_font, line, (Vector2){rect.x, y}, size, 1.0f, color);
            y += line_h;
            line_len = 0;
        }

        memcpy(line + line_len, p, cp_size);
        line_len += cp_size;
        line[line_len] = 0;

        Vector2 sz = MeasureTextEx(g_font, line, size, 1.0f);
        if (sz.x > rect.width) {
            line_len -= cp_size;
            line[line_len] = 0;
            DrawTextEx(g_font, line, (Vector2){rect.x, y}, size, 1.0f, color);
            y += line_h;
            line_len = 0;
            memcpy(line + line_len, p, cp_size);
            line_len += cp_size;
            line[line_len] = 0;
        }
        p += cp_size;
    }
    if (line_len > 0) {
        line[line_len] = 0;
        DrawTextEx(g_font, line, (Vector2){rect.x, y}, size, 1.0f, color);
    }
}

static void draw_panel(Rectangle r, Color fill, Color border) {
    DrawRectangleRounded(r, 0.04f, 12, fill);
    DrawRectangleRoundedLines(r, 0.04f, 12, border);
}

static bool button(Rectangle r, const char *label, bool *was_hovered) {
    Vector2 m = GetMousePosition();
    bool hover = CheckCollisionPointRec(m, r);
    if (was_hovered) *was_hovered = hover;
    Color fill = hover ? COL_BTN_HOV : COL_BTN;
    DrawRectangleRounded(r, 0.18f, 12, fill);
    DrawRectangleRoundedLines(r, 0.18f, 12, COL_BTN_BD);

    Rectangle text_r = {r.x + 24, r.y + 14, r.width - 48, r.height - 28};
    draw_wrapped(label, text_r, 22.0f, 30.0f, COL_TEXT);

    return hover && IsMouseButtonPressed(MOUSE_BUTTON_LEFT);
}

static void draw_chapter_bg(int chapter, float t) {
    (void)t;
    switch (chapter) {
        case 0: {
            DrawRectangleGradientV(0, 0, SCREEN_W, SCREEN_H,
                (Color){0xFF, 0xE3, 0xC8, 0xFF}, (Color){0xFD, 0xC8, 0xCB, 0xFF});
            DrawCircle(SCREEN_W - 220, 160, 80, (Color){0xFF, 0xF1, 0xC1, 0xFF});
            for (int i = 0; i < 14; i++) {
                int x = (i * 137) % SCREEN_W;
                int y = 80 + (i * 53) % 200;
                DrawCircle(x, y, 3, (Color){0xFF, 0xFF, 0xFF, 0x88});
            }
            break;
        }
        case 1: {
            DrawRectangleGradientV(0, 0, SCREEN_W, SCREEN_H,
                (Color){0xC4, 0xE2, 0xF1, 0xFF}, (Color){0xE9, 0xF4, 0xD7, 0xFF});
            DrawCircle(180, 140, 60, (Color){0xFF, 0xE5, 0x77, 0xFF});
            DrawCircle(180, 140, 70, (Color){0xFF, 0xE5, 0x77, 0x55});
            DrawTriangle((Vector2){SCREEN_W - 240, 540}, (Vector2){SCREEN_W - 320, 380}, (Vector2){SCREEN_W - 160, 380},
                         (Color){0x6B, 0xA1, 0x5C, 0xFF});
            DrawRectangle(SCREEN_W - 260, 540, 40, 60, (Color){0x80, 0x52, 0x33, 0xFF});
            break;
        }
        case 2: {
            DrawRectangleGradientV(0, 0, SCREEN_W, SCREEN_H,
                (Color){0xFF, 0xD8, 0x9E, 0xFF}, (Color){0xFD, 0xEA, 0xC8, 0xFF});
            DrawRectangle(SCREEN_W - 380, 380, 240, 220, (Color){0xE8, 0xC0, 0x9C, 0xFF});
            DrawTriangle((Vector2){SCREEN_W - 380, 380}, (Vector2){SCREEN_W - 260, 300}, (Vector2){SCREEN_W - 140, 380},
                         (Color){0xC4, 0x6B, 0x4C, 0xFF});
            for (int i = 0; i < 4; i++) {
                DrawRectangle(SCREEN_W - 360 + i*60, 420, 30, 40, (Color){0x88, 0xB7, 0xCB, 0xFF});
            }
            break;
        }
        case 3: {
            DrawRectangleGradientV(0, 0, SCREEN_W, SCREEN_H,
                (Color){0x9E, 0xC4, 0xE0, 0xFF}, (Color){0xF4, 0xE5, 0xC8, 0xFF});
            DrawTriangle((Vector2){0, 540}, (Vector2){280, 320}, (Vector2){560, 540},
                         (Color){0x6B, 0x82, 0x95, 0xFF});
            DrawTriangle((Vector2){380, 540}, (Vector2){640, 380}, (Vector2){900, 540},
                         (Color){0x55, 0x6E, 0x82, 0xFF});
            DrawTriangle((Vector2){720, 540}, (Vector2){960, 360}, (Vector2){SCREEN_W, 540},
                         (Color){0x40, 0x59, 0x70, 0xFF});
            break;
        }
        case 4: {
            DrawRectangleGradientV(0, 0, SCREEN_W, SCREEN_H,
                (Color){0xCA, 0x96, 0xC4, 0xFF}, (Color){0xFD, 0xCB, 0x9C, 0xFF});
            for (int i = 0; i < 30; i++) {
                int x = (i * 211) % SCREEN_W;
                int y = (i * 97) % 320 + 40;
                DrawCircle(x, y, 2, (Color){0xFF, 0xFF, 0xFF, 0xCC});
            }
            DrawCircle(SCREEN_W/2, 580, 90, (Color){0xFF, 0xC0, 0x6B, 0xFF});
            DrawTriangle((Vector2){SCREEN_W/2 - 200, 600}, (Vector2){SCREEN_W/2, 480}, (Vector2){SCREEN_W/2 + 200, 600},
                         (Color){0x40, 0x40, 0x59, 0x66});
            break;
        }
    }
    DrawRectangle(0, 0, SCREEN_W, SCREEN_H, (Color){0xFA, 0xF6, 0xE9, 0x33});
}

static void draw_title_bg(float t) {
    DrawRectangleGradientV(0, 0, SCREEN_W, SCREEN_H,
        (Color){0xFF, 0xE3, 0xC8, 0xFF}, (Color){0xC4, 0xE2, 0xF1, 0xFF});
    for (int i = 0; i < 60; i++) {
        float fx = (float)((i * 233) % SCREEN_W);
        float fy = (float)((i * 79) % SCREEN_H);
        float r = 1.5f + (i % 3);
        float a = 0.5f + 0.5f * sinf(t * 0.6f + i * 0.7f);
        DrawCircle((int)fx, (int)fy, r, (Color){0xFF, 0xFF, 0xFF, (unsigned char)(120 * a)});
    }
}

static void draw_dialogue_panel(const char *text) {
    Rectangle r = {80, SCREEN_H - 240, SCREEN_W - 160, 180};
    draw_panel(r, COL_PANEL, COL_PANEL_BD);
    Rectangle inner = {r.x + 32, r.y + 24, r.width - 64, r.height - 48};
    draw_wrapped(text, inner, 28.0f, 44.0f, COL_TEXT);

    if ((int)(GetTime() * 2) % 2 == 0) {
        const char *hint = "▶ クリックで進む";
        Vector2 sz = measure_text(hint, 18.0f);
        DrawTextEx(g_font, hint, (Vector2){r.x + r.width - sz.x - 24, r.y + r.height - sz.y - 12}, 18.0f, 1.0f, COL_MUTED);
    }
}

static void draw_chapter_header(int chapter) {
    char small[128];
    snprintf(small, sizeof(small), "%s   %s", STORY[chapter].title, STORY[chapter].age_range);
    Vector2 sz = measure_text(small, 22.0f);
    Rectangle r = {40, 24, sz.x + 40, 56};
    draw_panel(r, (Color){0xFF, 0xFF, 0xFF, 0xC8}, COL_PANEL_BD);
    draw_text_ex(small, r.x + 20, r.y + 16, 22.0f, COL_TEXT);
}

static void draw_choice_screen(const ChoicePoint *cp, int *out_pick, int *hover_a, int *hover_b) {
    Rectangle prompt_r = {120, 220, SCREEN_W - 240, 110};
    draw_panel(prompt_r, COL_PANEL, COL_PANEL_BD);
    Rectangle inner = {prompt_r.x + 32, prompt_r.y + 22, prompt_r.width - 64, prompt_r.height - 44};
    draw_wrapped(cp->prompt, inner, 28.0f, 40.0f, COL_TEXT);

    Rectangle btn_a = {180, 380, SCREEN_W - 360, 110};
    Rectangle btn_b = {180, 510, SCREEN_W - 360, 110};
    bool ha = false, hb = false;
    if (button(btn_a, cp->opt_a, &ha)) *out_pick = 0;
    if (button(btn_b, cp->opt_b, &hb)) *out_pick = 1;
    if (hover_a) *hover_a = ha ? 1 : 0;
    if (hover_b) *hover_b = hb ? 1 : 0;

    const char *hint = "選んでください";
    Vector2 sz = measure_text(hint, 20.0f);
    DrawTextEx(g_font, hint, (Vector2){SCREEN_W*0.5f - sz.x*0.5f, 350.0f}, 20.0f, 1.0f, COL_MUTED);
}

static void apply_delta(Stats *s, Stats d) {
    s->chi += d.chi; s->toku += d.toku; s->tai += d.tai; s->jou += d.jou;
    if (s->chi > 100) s->chi = 100;
    if (s->toku > 100) s->toku = 100;
    if (s->tai > 100) s->tai = 100;
    if (s->jou > 100) s->jou = 100;
    if (s->chi < 0) s->chi = 0;
    if (s->toku < 0) s->toku = 0;
    if (s->tai < 0) s->tai = 0;
    if (s->jou < 0) s->jou = 0;
}

static void draw_stat_bar(float x, float y, float w, float h, const char *label, int prev, int target, float t, Color c) {
    int v = (int)(prev + (target - prev) * t);
    DrawRectangleRounded((Rectangle){x, y, w, h}, 0.4f, 8, (Color){0xE5, 0xDF, 0xCC, 0xFF});

    float fill_w = w * (v / 100.0f);
    DrawRectangleRounded((Rectangle){x, y, fill_w, h}, 0.4f, 8, c);

    char left[64];
    snprintf(left, sizeof(left), "%s", label);
    draw_text_ex(left, x - 200, y + h*0.5f - 16, 26.0f, COL_TEXT);

    char val[16];
    snprintf(val, sizeof(val), "%d", v);
    Vector2 sz = measure_text(val, 26.0f);
    draw_text_ex(val, x + w + 20, y + h*0.5f - 16, 26.0f, COL_TEXT);

    int delta = target - prev;
    if (delta != 0) {
        char d[16];
        snprintf(d, sizeof(d), "%s%d", delta > 0 ? "+" : "−", delta > 0 ? delta : -delta);
        Color dc = delta > 0 ? (Color){0x6B, 0x9F, 0x5C, 0xFF} : (Color){0xCB, 0x6F, 0x6F, 0xFF};
        draw_text_ex(d, x + w + 70, y + h*0.5f - 16, 26.0f, dc);
    }
    (void)sz;
}

static void draw_dashboard(int chapter, Stats prev, Stats cur, float t) {
    DrawRectangleGradientV(0, 0, SCREEN_W, SCREEN_H,
        (Color){0xFF, 0xF8, 0xE5, 0xFF}, (Color){0xE9, 0xF4, 0xD7, 0xFF});

    const char *ch_kanji[] = {"一", "二", "三", "四", "五"};
    char title[128];
    snprintf(title, sizeof(title), "第%s章 終了 — 成長レポート", ch_kanji[chapter]);

    draw_text_centered(title, SCREEN_W*0.5f, 80.0f, 38.0f, COL_TEXT);
    draw_text_centered(STORY[chapter].title, SCREEN_W*0.5f, 130.0f, 22.0f, COL_MUTED);

    float bar_x = 380, bar_w = 540, bar_h = 36;
    float spacing = 80;
    float start_y = 220;

    draw_stat_bar(bar_x, start_y + 0*spacing, bar_w, bar_h, "智 — 知性",      prev.chi,  cur.chi,  t, COL_CHI);
    draw_stat_bar(bar_x, start_y + 1*spacing, bar_w, bar_h, "徳 — 思いやり",   prev.toku, cur.toku, t, COL_TOKU);
    draw_stat_bar(bar_x, start_y + 2*spacing, bar_w, bar_h, "体 — 健やかさ",   prev.tai,  cur.tai,  t, COL_TAI);
    draw_stat_bar(bar_x, start_y + 3*spacing, bar_w, bar_h, "情 — 感性",      prev.jou,  cur.jou,  t, COL_JOU);

    Rectangle hint_r = {SCREEN_W*0.5f - 160, SCREEN_H - 100, 320, 56};
    draw_panel(hint_r, COL_PANEL, COL_PANEL_BD);
    const char *hint = (t >= 1.0f) ? "▶ クリックで次の章へ" : "...";
    Vector2 sz = measure_text(hint, 22.0f);
    draw_text_ex(hint, hint_r.x + (hint_r.width - sz.x)*0.5f, hint_r.y + 16, 22.0f, COL_TEXT);
}

static void draw_dashboard_final(Stats prev, Stats cur, float t) {
    DrawRectangleGradientV(0, 0, SCREEN_W, SCREEN_H,
        (Color){0xFF, 0xF8, 0xE5, 0xFF}, (Color){0xE9, 0xF4, 0xD7, 0xFF});

    draw_text_centered("第五章 終了 — 最終成長レポート", SCREEN_W*0.5f, 80.0f, 38.0f, COL_TEXT);
    draw_text_centered("選択がここまでの「育ち」を形作りました", SCREEN_W*0.5f, 130.0f, 22.0f, COL_MUTED);

    float bar_x = 380, bar_w = 540, bar_h = 36;
    float spacing = 80;
    float start_y = 220;
    draw_stat_bar(bar_x, start_y + 0*spacing, bar_w, bar_h, "智 — 知性",    prev.chi,  cur.chi,  t, COL_CHI);
    draw_stat_bar(bar_x, start_y + 1*spacing, bar_w, bar_h, "徳 — 思いやり", prev.toku, cur.toku, t, COL_TOKU);
    draw_stat_bar(bar_x, start_y + 2*spacing, bar_w, bar_h, "体 — 健やかさ", prev.tai,  cur.tai,  t, COL_TAI);
    draw_stat_bar(bar_x, start_y + 3*spacing, bar_w, bar_h, "情 — 感性",    prev.jou,  cur.jou,  t, COL_JOU);

    Rectangle hint_r = {SCREEN_W*0.5f - 200, SCREEN_H - 100, 400, 56};
    draw_panel(hint_r, COL_PANEL, COL_PANEL_BD);
    const char *hint = (t >= 1.0f) ? "▶ クリックで結末を見る" : "集計中…";
    Vector2 sz = measure_text(hint, 22.0f);
    draw_text_ex(hint, hint_r.x + (hint_r.width - sz.x)*0.5f, hint_r.y + 16, 22.0f, COL_TEXT);
}

static void draw_ending(const Ending *e, Stats s) {
    DrawRectangleGradientV(0, 0, SCREEN_W, SCREEN_H,
        (Color){0x2D, 0x31, 0x42, 0xFF}, (Color){0x55, 0x4D, 0x6E, 0xFF});

    for (int i = 0; i < 80; i++) {
        int x = (i * 211) % SCREEN_W;
        int y = (i * 97) % SCREEN_H;
        int sz = 1 + (i % 3);
        unsigned char a = (unsigned char)(120 + (i % 6) * 20);
        DrawCircle(x, y, sz, (Color){0xFF, 0xFF, 0xFF, a});
    }

    draw_text_centered("育ちの結末", SCREEN_W*0.5f, 70.0f, 28.0f,
                       (Color){0xFA, 0xF6, 0xE9, 0xCC});

    char title_buf[256];
    snprintf(title_buf, sizeof(title_buf), "✦  %s  ✦", e->title);
    draw_text_centered(title_buf, SCREEN_W*0.5f, 130.0f, 48.0f,
                       (Color){0xFA, 0xF6, 0xE9, 0xFF});

    Rectangle body_r = {180, 230, SCREEN_W - 360, 240};
    draw_panel(body_r, (Color){0xFA, 0xF6, 0xE9, 0xE5}, (Color){0xFA, 0xF6, 0xE9, 0x88});
    Rectangle inner = {body_r.x + 36, body_r.y + 28, body_r.width - 72, body_r.height - 56};
    draw_wrapped(e->body, inner, 24.0f, 38.0f, COL_TEXT);

    char stat_line[256];
    snprintf(stat_line, sizeof(stat_line), "智 %d   徳 %d   体 %d   情 %d",
             s.chi, s.toku, s.tai, s.jou);
    draw_text_centered(stat_line, SCREEN_W*0.5f, 510.0f, 24.0f, (Color){0xFA, 0xF6, 0xE9, 0xCC});

    Rectangle hint_r = {SCREEN_W*0.5f - 200, SCREEN_H - 100, 400, 60};
    draw_panel(hint_r, (Color){0xFA, 0xF6, 0xE9, 0xCC}, (Color){0xFA, 0xF6, 0xE9, 0x88});
    const char *hint = "▶ クリックでもう一度はじめる";
    Vector2 sz = measure_text(hint, 22.0f);
    draw_text_ex(hint, hint_r.x + (hint_r.width - sz.x)*0.5f, hint_r.y + 18, 22.0f, COL_TEXT);
}

static bool advance_clicked(void) {
    return IsMouseButtonPressed(MOUSE_BUTTON_LEFT)
        || IsKeyPressed(KEY_SPACE)
        || IsKeyPressed(KEY_ENTER);
}

int main(void) {
    SetConfigFlags(FLAG_WINDOW_HIGHDPI | FLAG_MSAA_4X_HINT | FLAG_VSYNC_HINT);
    InitWindow(SCREEN_W, SCREEN_H, "育ちグラフ — sodachi-graph");
    SetTargetFPS(60);

    load_japanese_font();

    Game g;
    game_reset(&g);

    while (!WindowShouldClose()) {
        float dt = GetFrameTime();
        float t = (float)GetTime();

        switch (g.scene) {
            case SCENE_TITLE:
                if (advance_clicked()) {
                    g.scene = SCENE_CHAPTER_TITLE;
                }
                break;
            case SCENE_CHAPTER_TITLE:
                if (advance_clicked()) g.scene = SCENE_INTRO_1;
                break;
            case SCENE_INTRO_1:
                if (advance_clicked()) g.scene = SCENE_INTRO_2;
                break;
            case SCENE_INTRO_2:
                if (advance_clicked()) g.scene = SCENE_CHOICE_1;
                break;
            case SCENE_CHOICE_1: break;
            case SCENE_RESPONSE_1:
                if (advance_clicked()) g.scene = SCENE_CHOICE_2;
                break;
            case SCENE_CHOICE_2: break;
            case SCENE_RESPONSE_2:
                if (advance_clicked()) {
                    g.prev_stats = g.stats;
                    g.target_stats = g.stats;
                    Stats anim_start = g.prev_stats;
                    int idx0 = g.choice_made[g.chapter][0];
                    int idx1 = g.choice_made[g.chapter][1];
                    Stats d0 = (idx0 == 0) ? STORY[g.chapter].choices[0].delta_a : STORY[g.chapter].choices[0].delta_b;
                    Stats d1 = (idx1 == 0) ? STORY[g.chapter].choices[1].delta_a : STORY[g.chapter].choices[1].delta_b;
                    anim_start.chi -= (d0.chi + d1.chi);
                    anim_start.toku -= (d0.toku + d1.toku);
                    anim_start.tai -= (d0.tai + d1.tai);
                    anim_start.jou -= (d0.jou + d1.jou);
                    g.prev_stats = anim_start;
                    g.target_stats = g.stats;
                    g.dash_anim = 0.0f;
                    g.scene = SCENE_DASHBOARD;
                }
                break;
            case SCENE_DASHBOARD:
                g.dash_anim += dt * 0.6f;
                if (g.dash_anim > 1.0f) g.dash_anim = 1.0f;
                if (g.dash_anim >= 1.0f && advance_clicked()) {
                    g.chapter++;
                    if (g.chapter >= CHAPTER_COUNT) {
                        g.ending = select_ending(g.stats);
                        g.scene = SCENE_ENDING;
                    } else {
                        g.scene = SCENE_CHAPTER_TITLE;
                    }
                }
                break;
            case SCENE_ENDING:
                if (advance_clicked()) {
                    game_reset(&g);
                }
                break;
        }

        BeginDrawing();
        ClearBackground(COL_BG);

        if (g.scene == SCENE_TITLE) {
            draw_title_bg(t);
            draw_text_centered("育ちグラフ", SCREEN_W*0.5f, 200.0f, 96.0f, COL_TEXT);
            draw_text_centered("親と子の選択が、未来を描く", SCREEN_W*0.5f, 320.0f, 28.0f, COL_TEXT);
            draw_text_centered("ビジュアルノベル × データダッシュボード", SCREEN_W*0.5f, 360.0f, 22.0f, COL_MUTED);

            float pulse = 0.6f + 0.4f * sinf(t * 2.0f);
            unsigned char alpha = (unsigned char)(180 * pulse);
            const char *go = "▶ クリックではじめる";
            draw_text_centered(go, SCREEN_W*0.5f, 480.0f, 26.0f, (Color){0x2D, 0x31, 0x42, alpha});

            draw_text_centered("Roll 40・39・20・43", SCREEN_W*0.5f, SCREEN_H - 60, 16.0f, COL_MUTED);
        }
        else if (g.scene == SCENE_CHAPTER_TITLE) {
            draw_chapter_bg(g.chapter, t);
            const char *t_str = STORY[g.chapter].title;
            const char *a_str = STORY[g.chapter].age_range;
            Rectangle box = {180, 240, SCREEN_W - 360, 220};
            draw_panel(box, COL_PANEL, COL_PANEL_BD);
            draw_text_centered(t_str, SCREEN_W*0.5f, box.y + 50, 44.0f, COL_TEXT);
            draw_text_centered(a_str, SCREEN_W*0.5f, box.y + 130, 26.0f, COL_ACCENT);

            float pulse = 0.5f + 0.5f * sinf(t * 2.0f);
            DrawCircle(SCREEN_W*0.5f, SCREEN_H - 120, 6.0f * pulse, COL_ACCENT);
            draw_text_centered("▶ クリックで進む", SCREEN_W*0.5f, SCREEN_H - 80, 20.0f, COL_MUTED);
        }
        else if (g.scene == SCENE_INTRO_1) {
            draw_chapter_bg(g.chapter, t);
            draw_chapter_header(g.chapter);
            draw_dialogue_panel(STORY[g.chapter].intro_1);
        }
        else if (g.scene == SCENE_INTRO_2) {
            draw_chapter_bg(g.chapter, t);
            draw_chapter_header(g.chapter);
            draw_dialogue_panel(STORY[g.chapter].intro_2);
        }
        else if (g.scene == SCENE_CHOICE_1 || g.scene == SCENE_CHOICE_2) {
            draw_chapter_bg(g.chapter, t);
            draw_chapter_header(g.chapter);
            int ci = (g.scene == SCENE_CHOICE_1) ? 0 : 1;
            int pick = -1;
            int ha = 0, hb = 0;
            draw_choice_screen(&STORY[g.chapter].choices[ci], &pick, &ha, &hb);
            if (pick != -1) {
                g.choice_made[g.chapter][ci] = pick;
                Stats d = (pick == 0)
                    ? STORY[g.chapter].choices[ci].delta_a
                    : STORY[g.chapter].choices[ci].delta_b;
                apply_delta(&g.stats, d);
                g.last_choice_idx = pick;
                g.scene = (g.scene == SCENE_CHOICE_1) ? SCENE_RESPONSE_1 : SCENE_RESPONSE_2;
            }
        }
        else if (g.scene == SCENE_RESPONSE_1 || g.scene == SCENE_RESPONSE_2) {
            draw_chapter_bg(g.chapter, t);
            draw_chapter_header(g.chapter);
            int ci = (g.scene == SCENE_RESPONSE_1) ? 0 : 1;
            int p = g.choice_made[g.chapter][ci];
            const char *resp = (p == 0)
                ? STORY[g.chapter].choices[ci].response_a
                : STORY[g.chapter].choices[ci].response_b;
            draw_dialogue_panel(resp);

            Stats d = (p == 0)
                ? STORY[g.chapter].choices[ci].delta_a
                : STORY[g.chapter].choices[ci].delta_b;
            char chip[256];
            int n = 0;
            char tmp[64];
            chip[0] = 0;
            if (d.chi)  { snprintf(tmp, sizeof(tmp), "智+%d  ", d.chi);  strcat(chip, tmp); n++; }
            if (d.toku) { snprintf(tmp, sizeof(tmp), "徳+%d  ", d.toku); strcat(chip, tmp); n++; }
            if (d.tai)  { snprintf(tmp, sizeof(tmp), "体+%d  ", d.tai);  strcat(chip, tmp); n++; }
            if (d.jou)  { snprintf(tmp, sizeof(tmp), "情+%d  ", d.jou);  strcat(chip, tmp); n++; }
            (void)n;
            Rectangle r = {SCREEN_W*0.5f - 220, 200, 440, 50};
            draw_panel(r, (Color){0xFF, 0xFF, 0xFF, 0xCC}, COL_PANEL_BD);
            draw_text_centered(chip, SCREEN_W*0.5f, r.y + 12, 24.0f, COL_ACCENT);
        }
        else if (g.scene == SCENE_DASHBOARD) {
            float te = g.dash_anim;
            te = te < 0.5f ? 2.0f * te * te : 1.0f - powf(-2.0f * te + 2.0f, 2.0f) * 0.5f;
            if (g.chapter == CHAPTER_COUNT - 1) {
                draw_dashboard_final(g.prev_stats, g.target_stats, te);
            } else {
                draw_dashboard(g.chapter, g.prev_stats, g.target_stats, te);
            }
        }
        else if (g.scene == SCENE_ENDING) {
            draw_ending(g.ending, g.stats);
        }

        EndDrawing();
    }

    UnloadFont(g_font);
    CloseWindow();
    return 0;
}
