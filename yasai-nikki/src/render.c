#include "raylib.h"

#include <math.h>
#include <stdio.h>
#include <string.h>

#include "crop.h"
#include "diary.h"

#define COL_SKY        (Color){ 206, 232, 255, 255 }
#define COL_SOIL       (Color){ 91, 57, 36, 255 }
#define COL_SOIL_DARK  (Color){ 64, 38, 24, 255 }
#define COL_LEAF       (Color){ 127, 189, 94, 255 }
#define COL_LEAF_DEEP  (Color){ 58, 108, 42, 255 }
#define COL_CREAM      (Color){ 254, 247, 214, 255 }
#define COL_SUNSET     (Color){ 255, 179, 92, 255 }
#define COL_PINK       (Color){ 255, 204, 224, 255 }
#define COL_INK        (Color){ 59, 47, 35, 255 }
#define COL_INK_SOFT   (Color){ 110, 90, 65, 255 }
#define COL_TOMATO     (Color){ 230, 80, 60, 255 }
#define COL_EGGPLANT   (Color){ 110, 60, 130, 255 }
#define COL_CORN_YEL   (Color){ 250, 210, 90, 255 }
#define COL_CUCUMBER   (Color){ 84, 156, 78, 255 }
#define COL_PEPPER     (Color){ 90, 165, 90, 255 }
#define COL_HIGHLIGHT  (Color){ 240, 184, 80, 255 }

static Font g_font;
static int g_font_loaded;

static int *build_codepoints(int *count_out) {
    static int buf[8192];
    int n = 0;
    for (int c = 32; c < 127; c++) buf[n++] = c;
    static const char *all_jp_chars =
        "やさい日記ひがらきょうかとま 28 日後完成"
        "トマトキュウリピーマンナストウモロコシ"
        "たねめはつぼみはなじゅくしたみどりきみどりきいろちゃいろ"
        "たのしいおだやかふしぎしんぱい"
        "葉のかずいろきょうのきもち"
        "つぎへもどる決定植えるはじめる選ぶえらぶ"
        "観察カレンダーを見るしんき今日はの今日まで日が経った"
        "ぜんぶえらべた残り保存しました。本だけ。"
        "1234567890%歳年月日週ヶ月"
        "は前に進む後にスタートおわり収穫しゅうかくおめでとうきせつ"
        "ようこそ書き残せ振り返るあなたの育てたいやさいをえらんで"
        "枚以上同じ青空畑育ちました"
        "始まる"
        "ひだりみぎえらんでで決定Enterスペース"
        "あすまたあえるよきょうのきろくぼくのわたしの"
        "Esc終了Q眺める";
    int seen[0x10000] = {0};
    const char *p = all_jp_chars;
    while (*p) {
        int sz = 0;
        int cp = GetCodepoint(p, &sz);
        if (cp != 0xFFFD && cp >= 0 && cp < 0x10000 && !seen[cp]) {
            seen[cp] = 1;
            buf[n++] = cp;
            if (n >= 8192) break;
        }
        p += sz > 0 ? sz : 1;
    }
    *count_out = n;
    return buf;
}

void render_init(void) {
    int count = 0;
    int *cps = build_codepoints(&count);
    const char *candidates[] = {
        "/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc",
        "/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc",
        "/System/Library/Fonts/Hiragino Sans W6.ttc",
        "/System/Library/Fonts/HelveticaNeue.ttc",
        "/System/Library/Fonts/Supplemental/Helvetica.ttc",
        NULL,
    };
    g_font_loaded = 0;
    for (int i = 0; candidates[i]; i++) {
        if (!FileExists(candidates[i])) continue;
        g_font = LoadFontEx(candidates[i], 40, cps, count);
        if (g_font.texture.id != 0) {
            g_font_loaded = 1;
            return;
        }
    }
    g_font = GetFontDefault();
}

void render_unload(void) {
    if (g_font_loaded) UnloadFont(g_font);
}

static void T(const char *s, float x, float y, float size, Color c) {
    if (g_font_loaded) DrawTextEx(g_font, s, (Vector2){ x, y }, size, 0, c);
    else DrawText(s, (int)x, (int)y, (int)size, c);
}

static Vector2 M(const char *s, float size) {
    if (g_font_loaded) return MeasureTextEx(g_font, s, size, 0);
    return (Vector2){ (float)MeasureText(s, (int)size), size };
}

static void TC(const char *s, float cx, float y, float size, Color c) {
    Vector2 m = M(s, size);
    T(s, cx - m.x / 2.0f, y, size, c);
}

/* ============= pixel crop drawing ============= */
/* Each crop is drawn into a 64x64 area centered at (cx, cy).
   Stage 0 = seed (tiny brown dot in soil)
   Stage 1 = sprout (a couple of leaves)
   Stage 2 = leafy (3-4 leaves)
   Stage 3 = bud (stem + a closed bud)
   Stage 4 = flower (stem + open flower)
   Stage 5 = fruit (the actual vegetable colored) */

static Color crop_color(CropKind k) {
    switch (k) {
        case CROP_TOMATO:   return COL_TOMATO;
        case CROP_CUCUMBER: return COL_CUCUMBER;
        case CROP_PEPPER:   return COL_PEPPER;
        case CROP_EGGPLANT: return COL_EGGPLANT;
        case CROP_CORN:     return COL_CORN_YEL;
    }
    return COL_LEAF;
}

static Color flower_color(CropKind k) {
    switch (k) {
        case CROP_TOMATO:   return (Color){ 255, 235, 130, 255 };
        case CROP_CUCUMBER: return (Color){ 255, 235, 100, 255 };
        case CROP_PEPPER:   return (Color){ 240, 240, 240, 255 };
        case CROP_EGGPLANT: return (Color){ 184, 142, 220, 255 };
        case CROP_CORN:     return COL_CORN_YEL;
    }
    return COL_PINK;
}

static void draw_soil(float cx, float cy, float w) {
    /* small soil mound at the base */
    DrawEllipse((int)cx, (int)cy + 26, (int)(w * 0.55f), 8, COL_SOIL_DARK);
    DrawEllipse((int)cx, (int)cy + 24, (int)(w * 0.45f), 6, COL_SOIL);
}

static void draw_leaves(float cx, float cy, int count) {
    Color leaf = COL_LEAF;
    Color shade = COL_LEAF_DEEP;
    /* center stem (no need to be tall here) */
    DrawRectangle((int)cx - 1, (int)cy - 4, 3, 26, shade);
    /* leaf pairs */
    for (int i = 0; i < count; i++) {
        float yOffset = -3 - i * 6;
        float side = (i % 2 == 0) ? -1.0f : 1.0f;
        DrawEllipse((int)(cx + side * 7), (int)(cy + yOffset), 7, 4, leaf);
        DrawEllipse((int)(cx + side * 7), (int)(cy + yOffset), 5, 3, shade);
    }
}

static void draw_crop_at_stage(CropKind k, Stage s, float cx, float cy) {
    draw_soil(cx, cy, 60.0f);
    switch (s) {
        case STAGE_SEED: {
            DrawCircle((int)cx, (int)cy + 18, 4, COL_INK);
            DrawCircle((int)cx - 1, (int)cy + 17, 1, COL_CREAM);
            break;
        }
        case STAGE_SPROUT: {
            DrawRectangle((int)cx - 1, (int)cy + 6, 2, 16, COL_LEAF_DEEP);
            DrawEllipse((int)cx - 6, (int)cy + 4, 6, 3, COL_LEAF);
            DrawEllipse((int)cx + 6, (int)cy + 4, 6, 3, COL_LEAF);
            break;
        }
        case STAGE_LEAFY: {
            draw_leaves(cx, cy + 5, 3);
            break;
        }
        case STAGE_BUD: {
            draw_leaves(cx, cy + 5, 4);
            DrawEllipse((int)cx, (int)cy - 14, 5, 7, COL_LEAF);
            DrawEllipse((int)cx, (int)cy - 14, 3, 6, COL_LEAF_DEEP);
            break;
        }
        case STAGE_FLOWER: {
            draw_leaves(cx, cy + 5, 4);
            Color fc = flower_color(k);
            DrawCircle((int)cx, (int)cy - 14, 8, fc);
            for (int i = 0; i < 6; i++) {
                float a = i * 6.2831f / 6.0f;
                DrawCircle((int)(cx + cosf(a) * 8.0f), (int)(cy - 14 + sinf(a) * 8.0f), 5, fc);
            }
            DrawCircle((int)cx, (int)cy - 14, 3, COL_HIGHLIGHT);
            break;
        }
        case STAGE_FRUIT: {
            draw_leaves(cx, cy + 5, 4);
            Color cc = crop_color(k);
            if (k == CROP_CUCUMBER) {
                DrawRectangleRounded(
                    (Rectangle){ cx - 4, cy - 26, 8, 30 }, 0.5f, 8, cc);
                /* spots */
                for (int i = 0; i < 5; i++) {
                    DrawCircle((int)cx - 2, (int)(cy - 22 + i * 5), 1, COL_LEAF_DEEP);
                }
            } else if (k == CROP_CORN) {
                DrawRectangleRounded(
                    (Rectangle){ cx - 6, cy - 24, 12, 26 }, 0.4f, 8, cc);
                /* kernels */
                for (int r = 0; r < 5; r++) {
                    for (int col = 0; col < 3; col++) {
                        DrawCircle((int)(cx - 4 + col * 4),
                                   (int)(cy - 20 + r * 4), 1, COL_INK);
                    }
                }
                /* husk */
                DrawTriangle((Vector2){ cx - 6, cy - 24 }, (Vector2){ cx - 12, cy - 26 },
                             (Vector2){ cx - 4, cy - 18 }, COL_LEAF_DEEP);
                DrawTriangle((Vector2){ cx + 6, cy - 24 }, (Vector2){ cx + 12, cy - 26 },
                             (Vector2){ cx + 4, cy - 18 }, COL_LEAF_DEEP);
            } else if (k == CROP_EGGPLANT) {
                DrawEllipse((int)cx, (int)cy - 14, 9, 14, cc);
                /* stem */
                DrawTriangle((Vector2){ cx - 6, cy - 26 }, (Vector2){ cx + 6, cy - 26 },
                             (Vector2){ cx, cy - 18 }, COL_LEAF_DEEP);
            } else if (k == CROP_PEPPER) {
                DrawEllipse((int)cx, (int)cy - 14, 10, 12, cc);
                DrawRectangle((int)cx - 2, (int)cy - 28, 4, 6, COL_LEAF_DEEP);
            } else { /* tomato */
                DrawCircle((int)cx, (int)cy - 14, 12, cc);
                DrawCircle((int)cx - 4, (int)cy - 18, 3, COL_HIGHLIGHT);
                /* leaf top */
                DrawTriangle((Vector2){ cx - 6, cy - 26 }, (Vector2){ cx + 6, cy - 26 },
                             (Vector2){ cx, cy - 20 }, COL_LEAF_DEEP);
            }
            break;
        }
    }
}

/* ============= screens ============= */
typedef struct {
    int  picker_cursor;        /* 0..4 in chooser */
    int  card_cursor;          /* 0..3 in observation card option grid */
    int  card_index;           /* 0..2 which card the player is on (leaf/color/mood) */
    int  view_calendar;        /* boolean override */
    float anim_t;              /* growth animation time */
    int  pending_reset;        /* show "really start over?" prompt */
} UiState;

static const char *MOOD_LABELS[4] = { "たのしい", "おだやか", "ふしぎ", "しんぱい" };
static const char *MOOD_GLYPHS[4] = { "😊", "😌", "🤔", "😟" };
static const char *COLOR_LABELS[4] = { "みどり", "きみどり", "きいろ", "ちゃいろ" };
static const Color COLOR_SWATCH[4] = {
    (Color){ 80, 156, 80, 255 },
    (Color){ 178, 210, 80, 255 },
    (Color){ 250, 215, 100, 255 },
    (Color){ 160, 110, 65, 255 },
};
static const char *LEAF_LABELS[5] = { "1まい", "2まい", "3まい", "4まい", "5まい以上" };

static void draw_header(const Diary *d) {
    int sw = GetScreenWidth();
    DrawRectangle(0, 0, sw, 56, (Color){ 250, 248, 230, 235 });
    DrawRectangle(0, 56, sw, 2, COL_INK_SOFT);
    T("やさい日記", 24, 12, 28, COL_INK);
    char buf[128];
    if (!d->finished) {
        snprintf(buf, sizeof(buf), "%d 日目 / 28 日", d->current_day + 1);
        T(buf, sw - 220, 18, 18, COL_INK_SOFT);
    } else {
        T("しゅうかく！28 日を むかえました 🎉", sw - 460, 18, 18, COL_SUNSET);
    }
}

/* Crop picker shown when no crops chosen yet */
void render_chooser(const Diary *d, const UiState *ui) {
    int sw = GetScreenWidth();
    int sh = GetScreenHeight();
    ClearBackground(COL_SKY);
    draw_header(d);

    TC("ようこそ、やさい日記へ", (float)sw / 2.0f, 84, 30, COL_INK);
    TC("そだてたいやさいを 1 〜 3 つ えらぼう", (float)sw / 2.0f, 124, 18, COL_INK_SOFT);

    float gap = 14.0f;
    float card_w = 180.0f;
    float card_h = 220.0f;
    float total_w = card_w * CROP_COUNT + gap * (CROP_COUNT - 1);
    float ox = (float)sw / 2.0f - total_w / 2.0f;
    float oy = 180.0f;

    for (int i = 0; i < CROP_COUNT; i++) {
        Rectangle r = { ox + i * (card_w + gap), oy, card_w, card_h };
        int chosen = diary_has_choice(d, (CropKind)i);
        int focused = (ui->picker_cursor == i);
        Color bg = chosen ? (Color){ 255, 232, 200, 255 } : (Color){ 255, 252, 240, 255 };
        DrawRectangleRounded(r, 0.12f, 8, bg);
        DrawRectangleRoundedLines(r, 0.12f, 8, focused ? COL_SUNSET : COL_INK_SOFT);
        draw_crop_at_stage((CropKind)i, STAGE_FRUIT, r.x + card_w / 2.0f, r.y + 110);
        TC(crop_name_jp((CropKind)i), r.x + card_w / 2.0f, r.y + 158, 20, COL_INK);
        TC(chosen ? "★ えらんだ" : "Space で えらぶ", r.x + card_w / 2.0f, r.y + 190, 13,
           chosen ? COL_SUNSET : COL_INK_SOFT);
    }

    char buf[128];
    snprintf(buf, sizeof(buf), "(あと %d つ えらべる)", MAX_CHOSEN - d->crop_count);
    TC(buf, (float)sw / 2.0f, oy + card_h + 30, 16, COL_INK_SOFT);
    if (d->crop_count > 0) {
        TC("Enter で 日記を はじめる", (float)sw / 2.0f, sh - 56, 22, COL_LEAF_DEEP);
    } else {
        TC("← → で 選んで Space で えらぶ", (float)sw / 2.0f, sh - 56, 18, COL_INK_SOFT);
    }
}

/* Garden + today's observation card view */
void render_diary_today(const Diary *d, const UiState *ui) {
    int sw = GetScreenWidth();
    int sh = GetScreenHeight();
    ClearBackground(COL_SKY);
    /* sun */
    DrawCircle(sw - 90, 90, 36, COL_SUNSET);
    DrawCircle(sw - 90, 90, 28, (Color){ 255, 220, 130, 255 });
    draw_header(d);

    /* garden row */
    float gy = 220.0f;
    int slots = d->crop_count;
    if (slots == 0) slots = 1;
    float gw = (float)sw / (slots + 1);
    Stage s = stage_at_day(d->current_day);
    for (int i = 0; i < d->crop_count; i++) {
        float gx = gw * (i + 1);
        draw_crop_at_stage((CropKind)d->crops_chosen[i], s, gx, gy);
        TC(crop_name_jp((CropKind)d->crops_chosen[i]), gx, gy + 48, 14, COL_INK);
    }
    /* ground stripe */
    DrawRectangle(0, (int)gy + 28, sw, 6, COL_SOIL_DARK);

    /* observation card */
    Rectangle card = { (float)sw / 2.0f - 360, 320, 720, 280 };
    DrawRectangleRounded(card, 0.08f, 12, COL_CREAM);
    DrawRectangleRoundedLines(card, 0.08f, 12, COL_INK_SOFT);

    char buf[128];
    snprintf(buf, sizeof(buf), "%d 日目  きょうの 観察", d->current_day + 1);
    T(buf, card.x + 22, card.y + 18, 22, COL_INK);
    T(stage_name_jp(s), card.x + 22, card.y + 50, 16, COL_INK_SOFT);

    const DayEntry *e = &d->entries[d->current_day];
    int active = ui->card_index;
    const char *card_titles[ENTRY_CARDS] = { "葉の かず は？", "いろ は？", "きょうの きもち は？" };
    T(card_titles[active], card.x + 22, card.y + 86, 22, COL_INK);

    if (active == 0) {
        /* leaf count */
        for (int i = 0; i < 5; i++) {
            Rectangle b = { card.x + 22 + i * 140, card.y + 130, 124, 80 };
            int chosen = e->leaf_choice == i;
            int focused = ui->card_cursor == i;
            DrawRectangleRounded(b, 0.18f, 6, chosen ? COL_HIGHLIGHT : (Color){ 250, 240, 210, 255 });
            DrawRectangleRoundedLines(b, 0.18f, 6, focused ? COL_LEAF_DEEP : COL_INK_SOFT);
            TC(LEAF_LABELS[i], b.x + b.width / 2.0f, b.y + 28, 18, chosen ? COL_INK : COL_INK);
        }
    } else if (active == 1) {
        for (int i = 0; i < 4; i++) {
            Rectangle b = { card.x + 22 + i * 175, card.y + 130, 160, 80 };
            int chosen = e->color_choice == i;
            int focused = ui->card_cursor == i;
            DrawRectangleRounded(b, 0.18f, 6, chosen ? COL_HIGHLIGHT : (Color){ 250, 240, 210, 255 });
            DrawRectangleRoundedLines(b, 0.18f, 6, focused ? COL_LEAF_DEEP : COL_INK_SOFT);
            DrawCircle((int)(b.x + 28), (int)(b.y + 38), 16, COLOR_SWATCH[i]);
            T(COLOR_LABELS[i], b.x + 56, b.y + 28, 18, COL_INK);
        }
    } else {
        for (int i = 0; i < 4; i++) {
            Rectangle b = { card.x + 22 + i * 175, card.y + 130, 160, 80 };
            int chosen = e->mood_choice == i;
            int focused = ui->card_cursor == i;
            DrawRectangleRounded(b, 0.18f, 6, chosen ? COL_HIGHLIGHT : (Color){ 250, 240, 210, 255 });
            DrawRectangleRoundedLines(b, 0.18f, 6, focused ? COL_LEAF_DEEP : COL_INK_SOFT);
            T(MOOD_GLYPHS[i], b.x + 14, b.y + 16, 36, COL_INK);
            T(MOOD_LABELS[i], b.x + 60, b.y + 28, 18, COL_INK);
        }
    }

    /* progress dots */
    for (int i = 0; i < ENTRY_CARDS; i++) {
        Color c = (i == active) ? COL_SUNSET : COL_INK_SOFT;
        DrawCircle((int)(card.x + 22 + i * 28), (int)(card.y + card.height - 26), 6, c);
    }

    /* hint */
    TC("← → で えらぶ、Enter で 決定。Q で カレンダー",
       (float)sw / 2.0f, sh - 36, 16, COL_INK_SOFT);
}

void render_finished(const Diary *d) {
    int sw = GetScreenWidth();
    int sh = GetScreenHeight();
    ClearBackground(COL_CREAM);
    draw_header(d);
    TC("28 日 ぶんの 観察 カレンダー", (float)sw / 2.0f, 84, 30, COL_INK);
    TC("えらんだ やさい が この 28 日 で どう そだった のか、ながめてみよう", (float)sw / 2.0f,
       124, 16, COL_INK_SOFT);

    /* 4 weeks x 7 days */
    int cols = 7;
    float cell_w = 130, cell_h = 100;
    float ox = (float)sw / 2.0f - (cell_w * cols) / 2.0f;
    float oy = 170.0f;
    static const char *days_jp[7] = { "月", "火", "水", "木", "金", "土", "日" };
    for (int c = 0; c < cols; c++) {
        T(days_jp[c], ox + c * cell_w + cell_w / 2.0f - 8, oy - 24, 14, COL_INK_SOFT);
    }
    for (int i = 0; i < DAYS_PER_SEASON; i++) {
        int r = i / cols;
        int c = i % cols;
        Rectangle cell = { ox + c * cell_w, oy + r * cell_h, cell_w - 6, cell_h - 6 };
        DrawRectangleRounded(cell, 0.1f, 6, (Color){ 254, 251, 234, 255 });
        DrawRectangleRoundedLines(cell, 0.1f, 6, COL_INK_SOFT);
        char buf[16];
        snprintf(buf, sizeof(buf), "%d", i + 1);
        T(buf, cell.x + 8, cell.y + 6, 14, COL_INK_SOFT);
        const DayEntry *e = &d->entries[i];
        if (!e->filled) continue;
        Stage s = stage_at_day(i);
        if (d->crop_count > 0) {
            draw_crop_at_stage((CropKind)d->crops_chosen[0], s,
                               cell.x + cell.width / 2.0f,
                               cell.y + cell.height / 2.0f - 4);
        }
        T(MOOD_GLYPHS[e->mood_choice], cell.x + cell.width - 28, cell.y + 4, 18, COL_INK);
        DrawCircle((int)(cell.x + cell.width / 2.0f),
                   (int)(cell.y + cell.height - 12), 7, COLOR_SWATCH[e->color_choice]);
    }
    TC("Q を おして 今日の 観察 にもどる",
       (float)sw / 2.0f, sh - 36, 16, COL_INK_SOFT);
}

void render_reset_prompt(void) {
    int sw = GetScreenWidth();
    int sh = GetScreenHeight();
    DrawRectangle(0, 0, sw, sh, (Color){ 0, 0, 0, 140 });
    Rectangle box = { (float)sw / 2.0f - 260, (float)sh / 2.0f - 100, 520, 200 };
    DrawRectangleRounded(box, 0.06f, 8, COL_CREAM);
    DrawRectangleRoundedLines(box, 0.06f, 8, COL_INK);
    TC("あたらしい 日記を はじめる？", (float)sw / 2.0f, box.y + 28, 22, COL_INK);
    TC("いま の 観察 は すべて 消えるよ", (float)sw / 2.0f, box.y + 70, 16, COL_INK_SOFT);
    TC("Y はい / N いいえ", (float)sw / 2.0f, box.y + 130, 18, COL_LEAF_DEEP);
}

void render_frame(const Diary *d, const UiState *ui) {
    BeginDrawing();
    ClearBackground(COL_SKY);
    int show_calendar = ui->view_calendar || d->finished;
    if (d->crop_count == 0) {
        render_chooser(d, ui);
    } else if (show_calendar) {
        render_finished(d);
    } else {
        render_diary_today(d, ui);
    }
    if (ui->pending_reset) {
        render_reset_prompt();
    }
    EndDrawing();
}
