#include "ui.h"
#include "runner.h"
#include <stdio.h>

#define BG_COLOR (Color){18, 14, 28, 255}

static void draw_centered(const char *text, int y, int size, Color col)
{
    int tw = MeasureText(text, size);
    DrawText(text, (SCREEN_W - tw) / 2, y, size, col);
}

void ui_draw_background(float scroll_offset)
{
    DrawRectangle(0, 0, SCREEN_W, SCREEN_H, BG_COLOR);

    /* Scrolling window lights (train windows) */
    int spacing = 120;
    int off = (int)scroll_offset % spacing;
    for (int x = -off; x < SCREEN_W + spacing; x += spacing) {
        DrawRectangle(x, 10, 60, 8, (Color){40, 35, 55, 255});
        DrawRectangle(x, SCREEN_H - 18, 60, 8, (Color){40, 35, 55, 255});
    }
}

void ui_draw_lanes(void)
{
    for (int i = 1; i < NUM_LANES; i++) {
        int y = i * LANE_HEIGHT + 20;
        for (int x = 0; x < SCREEN_W; x += 20) {
            DrawLine(x, y, x + 10, y, (Color){40, 35, 55, 180});
        }
    }
}

void ui_draw_hud(const Score *score, float speed_mult)
{
    /* Top bar */
    DrawRectangle(0, 0, SCREEN_W, 22, (Color){0, 0, 0, 180});

    /* Papers collected */
    char buf[64];
    snprintf(buf, sizeof(buf), "Papers: %d", score->papers_collected);
    DrawText(buf, 10, 3, 16, (Color){240, 235, 150, 255});

    /* Lives */
    for (int i = 0; i < score->max_lives; i++) {
        Color c = (i < score->lives) ? (Color){100, 255, 100, 255} : (Color){80, 40, 40, 255};
        DrawCircle(200 + i * 22, 11, 7, c);
    }

    /* Streak */
    if (score->streak > 1) {
        snprintf(buf, sizeof(buf), "Streak: %d", score->streak);
        DrawText(buf, 290, 3, 16, (Color){100, 220, 255, 255});
    }

    /* Speed indicator — lower = calmer = better */
    snprintf(buf, sizeof(buf), "Focus: %.0f%%", (1.0f - (speed_mult - 0.4f) / 1.1f) * 100);
    DrawText(buf, SCREEN_W - 130, 3, 16, (Color){180, 160, 255, 255});

    /* Distance */
    snprintf(buf, sizeof(buf), "%.0fm", score->distance / 10.0f);
    DrawText(buf, SCREEN_W - 260, 3, 16, (Color){120, 120, 140, 255});
}

void ui_draw_menu(void)
{
    DrawRectangle(0, 0, SCREEN_W, SCREEN_H, BG_COLOR);

    draw_centered("ANTISCROLL", 80, 52, (Color){100, 255, 150, 255});
    draw_centered("The Anti-Doomscroll Game", 145, 20, (Color){180, 180, 200, 255});

    draw_centered("Dodge distractions. Collect knowledge.", 210, 16, (Color){150, 150, 170, 255});

    draw_centered("UP/W  DOWN/S : Move", 280, 16, (Color){120, 200, 160, 255});
    draw_centered("SPACE : Focus Boost", 305, 16, (Color){120, 200, 160, 255});

    draw_centered("The game gets CALMER the more you learn", 360, 14, (Color){240, 235, 150, 200});
    draw_centered("(the opposite of every other game)", 380, 12, (Color){140, 140, 160, 180});

    draw_centered("Press ENTER to start", 440, 20, WHITE);
}

void ui_draw_paused(void)
{
    DrawRectangle(0, 0, SCREEN_W, SCREEN_H, (Color){0, 0, 0, 180});
    draw_centered("PAUSED", 180, 40, WHITE);
    draw_centered("Press ESC to resume", 240, 18, (Color){180, 180, 200, 255});
    draw_centered("Press Q to quit", 270, 16, (Color){140, 140, 160, 255});
}

void ui_draw_gameover(const Score *score)
{
    DrawRectangle(0, 0, SCREEN_W, SCREEN_H, (Color){12, 8, 20, 240});

    draw_centered("SESSION COMPLETE", 30, 32, (Color){100, 255, 150, 255});

    char buf[64];
    snprintf(buf, sizeof(buf), "Papers Collected: %d", score->papers_collected);
    draw_centered(buf, 80, 20, (Color){240, 235, 150, 255});

    snprintf(buf, sizeof(buf), "Best Streak: %d  |  Dodged: %d",
             score->best_streak, score->distractions_dodged);
    draw_centered(buf, 110, 16, (Color){180, 180, 200, 255});

    snprintf(buf, sizeof(buf), "Distance: %.0fm", score->distance / 10.0f);
    draw_centered(buf, 135, 14, (Color){140, 140, 160, 255});

    /* List collected papers */
    draw_centered("Your Reading List:", 170, 18, (Color){200, 200, 220, 255});
    DrawLine(100, 192, SCREEN_W - 100, 192, (Color){60, 50, 70, 255});

    int y = 200;
    int max_show = 10;
    int show = score->collected_count < max_show ? score->collected_count : max_show;
    for (int i = 0; i < show; i++) {
        snprintf(buf, sizeof(buf), "[%s]", score->collected[i].field);
        DrawText(buf, 60, y, 11, (Color){100, 180, 255, 255});
        /* Truncate title to fit */
        char title[60] = {0};
        int j = 0;
        const char *t = score->collected[i].title;
        while (t[j] && j < 58) { title[j] = t[j]; j++; }
        if (t[j]) { title[j-1] = '.'; title[j-2] = '.'; title[j-3] = '.'; }
        title[j] = '\0';
        DrawText(title, 140, y, 12, (Color){220, 215, 200, 255});
        y += 20;
    }
    if (score->collected_count > max_show) {
        snprintf(buf, sizeof(buf), "... and %d more", score->collected_count - max_show);
        DrawText(buf, 140, y, 12, (Color){140, 140, 160, 255});
    }

    draw_centered("Press ENTER to play again", 460, 18, WHITE);
}

void ui_draw_paper_flash(const char *title, const char *field, float timer)
{
    if (timer <= 0 || !title) return;
    unsigned char alpha = (unsigned char)(timer * 200);
    if (alpha > 220) alpha = 220;

    DrawRectangle(150, SCREEN_H - 60, SCREEN_W - 300, 45, (Color){20, 40, 30, alpha});
    DrawRectangleLines(150, SCREEN_H - 60, SCREEN_W - 300, 45, (Color){100, 255, 150, alpha});

    char buf[80];
    snprintf(buf, sizeof(buf), "[%s] %s", field ? field : "?", title);
    /* Truncate */
    if (MeasureText(buf, 14) > SCREEN_W - 340) {
        buf[60] = '.'; buf[61] = '.'; buf[62] = '.'; buf[63] = '\0';
    }
    DrawText(buf, 162, SCREEN_H - 48, 14, (Color){240, 235, 200, alpha});
    DrawText("+ Paper collected!", 162, SCREEN_H - 30, 11, (Color){100, 255, 150, alpha});
}
