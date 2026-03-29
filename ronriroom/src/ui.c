#include "ui.h"
#include <stdio.h>
#include <string.h>

static void draw_centered_text(const char *text, int y, int size, Color color) {
    int w = MeasureText(text, size);
    DrawText(text, (SCREEN_W - w) / 2, y, size, color);
}

static void draw_panel(int x, int y, int w, int h) {
    DrawRectangle(x, y, w, h, PANEL_COLOR);
    DrawRectangleLines(x, y, w, h, (Color){100, 120, 255, 60});
}

void ui_draw_title(const Game *g) {
    (void)g;
    DrawRectangle(0, 0, SCREEN_W, SCREEN_H, BG_COLOR);

    draw_centered_text("RONRI ROOM", 120, 50, ACCENT_COLOR);
    draw_centered_text("-- Logic Room --", 180, 20, TEXT_SUB_COLOR);

    draw_panel(200, 250, 400, 200);
    draw_centered_text("Nyuusha shonichi, office ni", 275, 18, TEXT_COLOR);
    draw_centered_text("tojikomerareta!", 300, 18, TEXT_COLOR);
    draw_centered_text("Ronri puzzle wo toite dasshutsu seyo!", 330, 18, TEXT_COLOR);

    draw_centered_text("[ ENTER de START ]", 490, 22, GOLD_COLOR);
}

void ui_draw_story(const Game *g) {
    DrawRectangle(0, 0, SCREEN_W, SCREEN_H, BG_COLOR);

    const char *name = puzzle_get_room_name(g->current_room);
    draw_centered_text(name, 80, 28, ACCENT_COLOR);

    draw_panel(100, 160, 600, 260);

    const char *desc = puzzle_get_room_desc(g->current_room);
    draw_centered_text(desc, 220, 18, TEXT_COLOR);

    // Room-specific intro text
    switch (g->current_room) {
        case 1:
            draw_centered_text("Grid no pattern wo kansei sasero.", 260, 16, TEXT_SUB_COLOR);
            draw_centered_text("Tadashii cell wo erande Enter!", 285, 16, TEXT_SUB_COLOR);
            break;
        case 2:
            draw_centered_text("? no bubun ni hairu suuji wo atero.", 260, 16, TEXT_SUB_COLOR);
            draw_centered_text("UP/DOWN de suuji wo erabi, Enter!", 285, 16, TEXT_SUB_COLOR);
            break;
        case 3:
            draw_centered_text("Switch wo kirikae target ni awasero.", 260, 16, TEXT_SUB_COLOR);
            draw_centered_text("LEFT/RIGHT de erabi, Enter de toggle!", 285, 16, TEXT_SUB_COLOR);
            break;
        case 4:
            draw_centered_text("Arrow key de idou. Goal made tadorituke!", 260, 16, TEXT_SUB_COLOR);
            break;
        case 5:
            draw_centered_text("A-Z key de moji wo nyuuryoku.", 260, 16, TEXT_SUB_COLOR);
            draw_centered_text("Backspace de sakujo. Enter de kakunin!", 285, 16, TEXT_SUB_COLOR);
            break;
    }

    draw_centered_text("[ ENTER de puzzle kaishi ]", 480, 20, GOLD_COLOR);
}

static void draw_pattern_puzzle(const Game *g) {
    const Puzzle *p = &g->puzzle;
    int ox = GRID_OFFSET_X + 60;
    int oy = GRID_OFFSET_Y;

    draw_centered_text("Pattern wo kansei sasero! (? no cell wo erabu)", 120, 18, TEXT_SUB_COLOR);

    for (int r = 0; r < p->grid_rows; r++) {
        for (int c = 0; c < p->grid_cols; c++) {
            int x = ox + c * CELL_SIZE;
            int y = oy + r * CELL_SIZE;

            bool is_cursor = (r == g->cursor_row && c == g->cursor_col);
            bool is_missing = (r == p->answer_row && c == p->answer_col);

            Color bg = is_cursor ? CELL_HL_COLOR : CELL_COLOR;
            if (is_cursor) {
                DrawRectangle(x - 2, y - 2, CELL_SIZE + 4, CELL_SIZE + 4, ACCENT_COLOR);
            }
            DrawRectangle(x, y, CELL_SIZE - 4, CELL_SIZE - 4, bg);

            char buf[8];
            if (is_missing) {
                snprintf(buf, sizeof(buf), "?");
                int tw = MeasureText(buf, 28);
                DrawText(buf, x + (CELL_SIZE - 4 - tw) / 2, y + 14, 28, GOLD_COLOR);
            } else {
                snprintf(buf, sizeof(buf), "%d", p->grid[r][c]);
                int tw = MeasureText(buf, 24);
                DrawText(buf, x + (CELL_SIZE - 4 - tw) / 2, y + 16, 24, TEXT_COLOR);
            }
        }
    }

    draw_centered_text("Arrow keys de idou, Enter de sentaku", 440, 16, TEXT_SUB_COLOR);
}

static void draw_sequence_puzzle(const Game *g) {
    const Puzzle *p = &g->puzzle;
    int ox = 80;
    int oy = 200;

    draw_centered_text("Suuji no kisoku wo mitsukero!", 120, 18, TEXT_SUB_COLOR);

    for (int i = 0; i < p->sequence_len; i++) {
        int x = ox + i * 80;
        int y = oy;
        bool is_missing = (i == p->missing_index);

        draw_panel(x, y, 70, 60);

        char buf[16];
        if (is_missing) {
            snprintf(buf, sizeof(buf), "%d", g->selected_answer);
            int tw = MeasureText(buf, 28);
            DrawText(buf, x + (70 - tw) / 2, y + 16, 28, GOLD_COLOR);

            // Up/down arrows
            DrawTriangle(
                (Vector2){(float)(x + 35), (float)(y - 10)},
                (Vector2){(float)(x + 25), (float)(y)},
                (Vector2){(float)(x + 45), (float)(y)},
                ACCENT_COLOR
            );
            DrawTriangle(
                (Vector2){(float)(x + 35), (float)(y + 70)},
                (Vector2){(float)(x + 45), (float)(y + 60)},
                (Vector2){(float)(x + 25), (float)(y + 60)},
                ACCENT_COLOR
            );
        } else {
            snprintf(buf, sizeof(buf), "%d", p->sequence[i]);
            int tw = MeasureText(buf, 24);
            DrawText(buf, x + (70 - tw) / 2, y + 18, 24, TEXT_COLOR);
        }
    }

    draw_centered_text("UP/DOWN de suuji henkou, Enter de kakunin", 440, 16, TEXT_SUB_COLOR);
}

static void draw_switches_puzzle(const Game *g) {
    const Puzzle *p = &g->puzzle;
    int ox = (SCREEN_W - p->switch_count * 90) / 2;

    draw_centered_text("Switch wo kirikae target ni awasero!", 100, 18, TEXT_SUB_COLOR);

    // Target row
    draw_centered_text("TARGET:", 155, 14, TEXT_SUB_COLOR);
    for (int i = 0; i < p->switch_count; i++) {
        int x = ox + i * 90;
        Color c = p->target[i] ? TARGET_ON : TARGET_OFF;
        DrawRectangleRounded((Rectangle){(float)x, 175, 70, 30}, 0.3f, 4, c);
        const char *txt = p->target[i] ? "ON" : "OFF";
        int tw = MeasureText(txt, 14);
        DrawText(txt, x + (70 - tw) / 2, 183, 14, BG_COLOR);
    }

    // Current switches
    draw_centered_text("CURRENT:", 235, 14, TEXT_SUB_COLOR);
    for (int i = 0; i < p->switch_count; i++) {
        int x = ox + i * 90;
        int y = 260;
        bool is_sel = (g->cursor_col == i);

        if (is_sel) {
            DrawRectangleRounded((Rectangle){(float)(x - 3), (float)(y - 3), 76, 56}, 0.3f, 4, ACCENT_COLOR);
        }

        Color c = p->switches[i] ? SWITCH_ON : SWITCH_OFF;
        DrawRectangleRounded((Rectangle){(float)x, (float)y, 70, 50}, 0.3f, 4, c);
        const char *txt = p->switches[i] ? "ON" : "OFF";
        int tw = MeasureText(txt, 18);
        DrawText(txt, x + (70 - tw) / 2, y + 15, 18, BG_COLOR);

        // Show link
        if (p->linked[i] >= 0) {
            char lbuf[16];
            snprintf(lbuf, sizeof(lbuf), "->%d", p->linked[i] + 1);
            int lw = MeasureText(lbuf, 12);
            DrawText(lbuf, x + (70 - lw) / 2, y + 55, 12, TEXT_SUB_COLOR);
        }
    }

    draw_centered_text("LEFT/RIGHT de erabi, Enter de toggle", 440, 16, TEXT_SUB_COLOR);
}

static void draw_path_puzzle(const Game *g) {
    const Puzzle *p = &g->puzzle;
    int ox = (SCREEN_W - p->grid_cols * CELL_SIZE) / 2;
    int oy = 160;

    draw_centered_text("START kara GOAL made susume!", 120, 18, TEXT_SUB_COLOR);

    for (int r = 0; r < p->grid_rows; r++) {
        for (int c = 0; c < p->grid_cols; c++) {
            int x = ox + c * CELL_SIZE;
            int y = oy + r * CELL_SIZE;

            if (p->path_walls[r][c]) {
                DrawRectangle(x, y, CELL_SIZE - 2, CELL_SIZE - 2, WALL_COLOR);
                DrawText("X", x + 22, y + 18, 20, (Color){100, 100, 130, 200});
            } else {
                DrawRectangle(x, y, CELL_SIZE - 2, CELL_SIZE - 2, CELL_COLOR);
            }

            // Start
            if (r == p->path_start_r && c == p->path_start_c) {
                DrawText("S", x + 20, y + 16, 24, ACCENT_COLOR);
            }
            // Goal
            if (r == p->path_goal_r && c == p->path_goal_c) {
                DrawText("G", x + 18, y + 16, 24, GOLD_COLOR);
            }
            // Player
            if (r == p->path_player_r && c == p->path_player_c) {
                DrawCircle(x + CELL_SIZE / 2 - 1, y + CELL_SIZE / 2 - 1, 18, SUCCESS_COLOR);
            }
        }
    }

    draw_centered_text("Arrow keys de idou", 480, 16, TEXT_SUB_COLOR);
}

static void draw_cipher_puzzle(const Game *g) {
    const Puzzle *p = &g->puzzle;

    draw_centered_text("Angou wo kaidoku seyo!", 100, 18, TEXT_SUB_COLOR);

    // Show encoded text
    char enc_label[64];
    snprintf(enc_label, sizeof(enc_label), "Angou: %s", p->cipher_encoded);
    draw_centered_text(enc_label, 180, 24, ERROR_COLOR);

    char shift_label[32];
    snprintf(shift_label, sizeof(shift_label), "Shift: %d", p->cipher_shift);
    draw_centered_text(shift_label, 220, 16, TEXT_SUB_COLOR);

    // Input field
    draw_panel(200, 280, 400, 60);
    int input_len = (int)strlen(p->cipher_input);

    // Draw input characters
    for (int i = 0; i < (int)strlen(p->cipher_encoded); i++) {
        int x = 220 + i * 40;
        if (i < input_len) {
            char ch[2] = {p->cipher_input[i], 0};
            DrawText(ch, x + 8, 295, 28, TEXT_COLOR);
        }
        // Cursor
        if (i == p->cipher_cursor) {
            DrawRectangle(x + 5, 325, 25, 3, ACCENT_COLOR);
        }
        // Underline
        DrawRectangle(x + 5, 330, 25, 1, TEXT_SUB_COLOR);
    }

    draw_centered_text("A-Z de nyuuryoku, Backspace de sakujo, Enter de kakunin", 440, 16, TEXT_SUB_COLOR);
}

void ui_draw_puzzle(const Game *g) {
    DrawRectangle(0, 0, SCREEN_W, SCREEN_H, BG_COLOR);

    // Room header
    char header[64];
    snprintf(header, sizeof(header), "Room %d / %d", g->current_room, PUZZLE_COUNT);
    DrawText(header, 20, 20, 16, TEXT_SUB_COLOR);

    // Timer
    char timer[32];
    snprintf(timer, sizeof(timer), "Time: %.0fs", g->room_time);
    int tw = MeasureText(timer, 16);
    DrawText(timer, SCREEN_W - tw - 20, 20, 16, TEXT_SUB_COLOR);

    // Mistakes
    char mistakes[32];
    snprintf(mistakes, sizeof(mistakes), "Miss: %d", g->puzzle.mistakes);
    DrawText(mistakes, SCREEN_W - tw - 20, 42, 16,
             g->puzzle.mistakes > 0 ? ERROR_COLOR : TEXT_SUB_COLOR);

    // Hint button
    if (g->show_hint) {
        draw_panel(50, 50, 700, 40);
        draw_centered_text(puzzle_get_room_hint(g->current_room), 58, 14, GOLD_COLOR);
    } else {
        DrawText("[H] Hint", 20, 50, 14, TEXT_SUB_COLOR);
    }

    // Draw puzzle based on type
    switch (g->puzzle.type) {
        case PUZZLE_PATTERN:  draw_pattern_puzzle(g); break;
        case PUZZLE_SEQUENCE: draw_sequence_puzzle(g); break;
        case PUZZLE_SWITCHES: draw_switches_puzzle(g); break;
        case PUZZLE_PATH:     draw_path_puzzle(g); break;
        case PUZZLE_CIPHER:   draw_cipher_puzzle(g); break;
        default: break;
    }

    // Wrong answer flash
    if (g->show_wrong) {
        DrawRectangle(0, 0, SCREEN_W, SCREEN_H, (Color){255, 0, 0, 40});
        draw_centered_text("X  WRONG!", 550, 24, ERROR_COLOR);
    }
}

void ui_draw_solved(const Game *g) {
    DrawRectangle(0, 0, SCREEN_W, SCREEN_H, BG_COLOR);

    draw_centered_text("CLEAR!", 150, 48, SUCCESS_COLOR);

    char room_label[64];
    snprintf(room_label, sizeof(room_label), "Room %d Cleared!", g->current_room);
    draw_centered_text(room_label, 220, 22, ACCENT_COLOR);

    char time_str[32];
    snprintf(time_str, sizeof(time_str), "Time: %.1f sec", g->room_time);
    draw_centered_text(time_str, 280, 18, TEXT_COLOR);

    char miss_str[32];
    snprintf(miss_str, sizeof(miss_str), "Mistakes: %d", g->puzzle.mistakes);
    draw_centered_text(miss_str, 310, 18,
                       g->puzzle.mistakes == 0 ? GOLD_COLOR : TEXT_COLOR);

    if (g->current_room < PUZZLE_COUNT) {
        draw_centered_text("[ ENTER de tsugi no room e ]", 420, 20, GOLD_COLOR);
    } else {
        draw_centered_text("[ ENTER de kekka hyouji ]", 420, 20, GOLD_COLOR);
    }
}

void ui_draw_complete(const Game *g) {
    DrawRectangle(0, 0, SCREEN_W, SCREEN_H, BG_COLOR);

    draw_centered_text("ALL CLEAR!", 100, 50, GOLD_COLOR);
    draw_centered_text("Dasshutsu seikou!", 165, 22, SUCCESS_COLOR);

    draw_panel(150, 220, 500, 200);

    char total[64];
    snprintf(total, sizeof(total), "Total Time: %.1f sec", g->total_time);
    draw_centered_text(total, 250, 20, TEXT_COLOR);

    char miss[64];
    snprintf(miss, sizeof(miss), "Total Mistakes: %d", g->total_mistakes);
    draw_centered_text(miss, 285, 20, TEXT_COLOR);

    // Grade
    const char *grade;
    if (g->total_mistakes == 0 && g->total_time < 120.0f) grade = "S - Tensai!";
    else if (g->total_mistakes <= 2 && g->total_time < 180.0f) grade = "A - Sugoi!";
    else if (g->total_mistakes <= 5) grade = "B - Yoku dekimashita!";
    else grade = "C - Ganbare!";

    char grade_str[64];
    snprintf(grade_str, sizeof(grade_str), "Grade: %s", grade);
    draw_centered_text(grade_str, 340, 24, GOLD_COLOR);

    draw_centered_text("[ ENTER de title e ]", 480, 20, ACCENT_COLOR);
}
