#include "ui.h"
#include <stdio.h>

#define SCREEN_W 900
#define SCREEN_H 520
#define SIDEBAR_W 260

static void draw_centered_text(const char *text, int y, int size, Color col)
{
    int tw = MeasureText(text, size);
    DrawText(text, (SCREEN_W - tw) / 2, y, size, col);
}

void ui_draw_menu(void)
{
    DrawRectangle(0, 0, SCREEN_W, SCREEN_H, (Color){15, 10, 25, 255});

    draw_centered_text("CRAMSLEUTHS", 100, 48, (Color){240, 200, 80, 255});
    draw_centered_text("A Co-op Detective Game", 160, 20, (Color){180, 180, 200, 255});

    draw_centered_text("Player 1: WASD + E", 240, 16, (Color){80, 140, 240, 255});
    draw_centered_text("Player 2: Arrows + Space", 265, 16, (Color){240, 90, 90, 255});
    draw_centered_text("Tab: Deduction  |  Walk to green doors to move between rooms", 300, 14, (Color){150, 150, 150, 255});

    draw_centered_text("Press ENTER to start", 380, 20, WHITE);

    draw_centered_text("Best played at 2am with a friend", 460, 12, (Color){100, 100, 120, 255});
}

void ui_draw_intro(const Game *g)
{
    DrawRectangle(0, 0, SCREEN_W, SCREEN_H, (Color){15, 10, 25, 240});

    draw_centered_text("THE CASE", 40, 32, (Color){240, 200, 80, 255});
    draw_centered_text(g->clues.case_title, 85, 24, WHITE);

    /* Word-wrap the intro text manually */
    int y = 140;
    const char *text = g->clues.case_intro;
    while (*text) {
        char line[80] = {0};
        int i = 0;
        while (*text && *text != '\n' && i < 79) {
            line[i++] = *text++;
        }
        line[i] = '\0';
        if (*text == '\n') text++;
        draw_centered_text(line, y, 16, (Color){200, 200, 220, 255});
        y += 22;
    }

    draw_centered_text("Press ENTER to begin investigation", 420, 18, (Color){100, 200, 100, 255});
}

void ui_draw_hud(const Game *g)
{
    const Room *room = &g->rooms[g->current_room];

    /* Room name */
    DrawRectangle(0, 0, 200, 28, (Color){0, 0, 0, 150});
    DrawText(room->name, 10, 6, 18, WHITE);

    /* Timer */
    int mins = (int)g->timer / 60;
    int secs = (int)g->timer % 60;
    char timer_buf[16];
    snprintf(timer_buf, sizeof(timer_buf), "%02d:%02d", mins, secs);
    DrawText(timer_buf, 560, 6, 18, (Color){200, 200, 200, 255});

    /* Clue count */
    char clue_buf[32];
    snprintf(clue_buf, sizeof(clue_buf), "Clues: %d/%d",
             g->clues.found_count, g->clues.clue_count);
    DrawText(clue_buf, 420, 6, 16, YELLOW);

    /* Tab hint */
    if (g->clues.found_count >= 5) {
        DrawText("[TAB] Solve Case", 240, 6, 14, (Color){100, 255, 100, 255});
    }

    /* Message */
    if (g->message && g->message_timer > 0) {
        int tw = MeasureText(g->message, 16);
        int mx = (640 - tw) / 2;
        DrawRectangle(mx - 10, 440, tw + 20, 28, (Color){0, 0, 0, 200});
        DrawText(g->message, mx, 446, 16, WHITE);
    }

    /* Object highlights for both players */
    for (int i = 0; i < 2; i++) {
        int idx = room_find_interactable(room, g->players[i].pos, g->players[i].size);
        if (idx >= 0 && room->objects[idx].visible) {
            room_draw_object_highlight(&room->objects[idx]);
        }
    }
}

void ui_draw_inventory(const Game *g)
{
    int x = 640;
    DrawRectangle(x, 0, SIDEBAR_W, SCREEN_H, (Color){20, 15, 30, 240});
    DrawLine(x, 0, x, SCREEN_H, (Color){80, 60, 100, 255});

    DrawText("EVIDENCE", x + 10, 10, 18, (Color){240, 200, 80, 255});
    DrawLine(x + 10, 32, x + SIDEBAR_W - 10, 32, (Color){60, 50, 70, 255});

    int y = 42;
    for (int i = 0; i < g->clues.clue_count; i++) {
        const Clue *c = &g->clues.clues[i];
        if (c->found) {
            Color col = (c->found_by == 0)
                ? (Color){80, 140, 240, 255}
                : (Color){240, 90, 90, 255};
            DrawText(c->name, x + 14, y, 13, col);
            y += 18;
            /* Truncated description */
            char desc[48] = {0};
            int len = 0;
            while (c->description[len] && len < 45) {
                desc[len] = c->description[len];
                len++;
            }
            if (c->description[len]) {
                desc[len - 1] = '.';
                desc[len - 2] = '.';
                desc[len - 3] = '.';
            }
            desc[len] = '\0';
            DrawText(desc, x + 20, y, 10, (Color){150, 150, 170, 255});
            y += 16;
        } else {
            DrawText("???", x + 14, y, 13, (Color){80, 80, 80, 255});
            y += 34;
        }
    }

    /* Player stats */
    y = SCREEN_H - 70;
    DrawLine(x + 10, y - 5, x + SIDEBAR_W - 10, y - 5, (Color){60, 50, 70, 255});
    char p1[32], p2[32];
    snprintf(p1, sizeof(p1), "P1 (Blue): %d clues", g->players[0].clue_count);
    snprintf(p2, sizeof(p2), "P2 (Red):  %d clues", g->players[1].clue_count);
    DrawText(p1, x + 14, y, 13, (Color){80, 140, 240, 255});
    DrawText(p2, x + 14, y + 20, 13, (Color){240, 90, 90, 255});
}

void ui_draw_deduction(const Game *g)
{
    DrawRectangle(0, 0, SCREEN_W, SCREEN_H, (Color){10, 5, 20, 240});

    draw_centered_text("DEDUCTION", 40, 32, (Color){240, 200, 80, 255});
    draw_centered_text("Who stole Professor Chen's thesis?", 85, 18, (Color){200, 200, 220, 255});

    int y = 150;
    for (int i = 0; i < g->clues.choice_count; i++) {
        bool selected = (i == g->selected_choice);
        Color bg = selected ? (Color){60, 50, 100, 255} : (Color){30, 25, 40, 255};
        Color fg = selected ? WHITE : (Color){150, 150, 170, 255};
        DrawRectangle(150, y, 600, 40, bg);
        if (selected) DrawRectangleLines(150, y, 600, 40, YELLOW);
        char buf[8];
        snprintf(buf, sizeof(buf), "%d.", i + 1);
        DrawText(buf, 165, y + 12, 16, fg);
        DrawText(g->clues.choices[i].text, 195, y + 12, 16, fg);
        y += 55;
    }

    draw_centered_text("UP/DOWN to select  |  ENTER to submit  |  ESC to go back", 430, 14, (Color){120, 120, 140, 255});

    char clue_buf[48];
    snprintf(clue_buf, sizeof(clue_buf), "Evidence collected: %d/%d",
             g->clues.found_count, g->clues.clue_count);
    draw_centered_text(clue_buf, 460, 14, YELLOW);
}

void ui_draw_win(const Game *g)
{
    DrawRectangle(0, 0, SCREEN_W, SCREEN_H, (Color){10, 25, 10, 240});

    draw_centered_text("CASE SOLVED!", 60, 40, (Color){100, 255, 100, 255});

    int mins = (int)g->timer / 60;
    int secs = (int)g->timer % 60;
    char time_buf[32];
    snprintf(time_buf, sizeof(time_buf), "Time: %02d:%02d", mins, secs);
    draw_centered_text(time_buf, 115, 20, WHITE);

    /* Solution text */
    int y = 170;
    const char *text = g->clues.case_solution;
    while (*text) {
        char line[80] = {0};
        int i = 0;
        while (*text && *text != '\n' && i < 79) {
            line[i++] = *text++;
        }
        line[i] = '\0';
        if (*text == '\n') text++;
        draw_centered_text(line, y, 15, (Color){200, 220, 200, 255});
        y += 22;
    }

    draw_centered_text("Press ENTER to play again", 420, 18, (Color){200, 200, 200, 255});
}

void ui_draw_lose(const Game *g)
{
    (void)g;
    DrawRectangle(0, 0, SCREEN_W, SCREEN_H, (Color){30, 10, 10, 240});

    draw_centered_text("WRONG ANSWER!", 120, 36, (Color){255, 80, 80, 255});
    draw_centered_text("The case remains unsolved...", 175, 18, (Color){200, 150, 150, 255});
    draw_centered_text("Press ENTER to try again", 350, 18, (Color){200, 200, 200, 255});
}
