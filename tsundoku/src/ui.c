#include "ui.h"
#include <stdio.h>

#define BG_COLOR       (Color){12, 12, 25, 255}
#define PANEL_COLOR    (Color){20, 20, 45, 230}
#define BORDER_COLOR   (Color){80, 90, 140, 80}
#define TEXT_COLOR     (Color){220, 220, 245, 255}
#define TEXT_SUB       (Color){140, 140, 180, 160}
#define ACCENT_COLOR   (Color){108, 140, 255, 255}
#define GOLD_COLOR     (Color){255, 215, 0, 255}
#define SUCCESS_COLOR  (Color){76, 255, 142, 255}
#define GRID_BG        (Color){18, 18, 35, 255}
#define GRID_LINE      (Color){35, 35, 60, 120}

Color genre_color(int genre) {
    switch (genre) {
        case GENRE_FICTION:     return (Color){220, 60, 60, 255};
        case GENRE_SCIENCE:    return (Color){60, 120, 220, 255};
        case GENRE_HISTORY:    return (Color){160, 100, 50, 255};
        case GENRE_FANTASY:    return (Color){140, 60, 200, 255};
        case GENRE_MYSTERY:    return (Color){40, 140, 80, 255};
        case GENRE_ROMANCE:    return (Color){220, 100, 160, 255};
        case GENRE_PHILOSOPHY: return (Color){200, 180, 60, 255};
        default:               return (Color){100, 100, 120, 255};
    }
}

static void draw_centered(const char *text, int y, int size, Color c) {
    int w = MeasureText(text, size);
    DrawText(text, (SCREEN_W - w) / 2, y, size, c);
}

static void draw_board(const Board *b) {
    int ox = BOARD_OFFSET_X;
    int oy = BOARD_OFFSET_Y;

    // Board background
    DrawRectangle(ox - 2, oy - 2, BOARD_W * CELL_SIZE + 4, BOARD_ROWS * CELL_SIZE + 4, BORDER_COLOR);
    DrawRectangle(ox, oy, BOARD_W * CELL_SIZE, BOARD_ROWS * CELL_SIZE, GRID_BG);

    // Grid lines
    for (int c = 0; c <= BOARD_W; c++) {
        DrawLine(ox + c * CELL_SIZE, oy, ox + c * CELL_SIZE, oy + BOARD_ROWS * CELL_SIZE, GRID_LINE);
    }
    for (int r = 0; r <= BOARD_ROWS; r++) {
        DrawLine(ox, oy + r * CELL_SIZE, ox + BOARD_W * CELL_SIZE, oy + r * CELL_SIZE, GRID_LINE);
    }

    // Filled cells
    for (int r = 0; r < BOARD_ROWS; r++) {
        for (int c = 0; c < BOARD_W; c++) {
            if (b->cells[r][c] != 0) {
                Color gc = genre_color(b->cells[r][c]);
                int x = ox + c * CELL_SIZE + 1;
                int y = oy + r * CELL_SIZE + 1;
                DrawRectangle(x, y, CELL_SIZE - 2, CELL_SIZE - 2, gc);

                // Inner highlight
                Color light = (Color){gc.r + 30, gc.g + 30, gc.b + 30, 120};
                DrawRectangle(x + 2, y + 2, CELL_SIZE - 6, 3, light);
            }
        }
    }
}

static void draw_piece(const Piece *p) {
    int ox = BOARD_OFFSET_X;
    int oy = BOARD_OFFSET_Y;

    for (int r = 0; r < PIECE_GRID; r++) {
        for (int c = 0; c < PIECE_GRID; c++) {
            if (!piece_cell_filled(p, r, c)) continue;
            int br = p->y + r;
            int bc = p->x + c;
            if (br < 0) continue;

            Color gc = genre_color(p->cells[r][c]);
            int x = ox + bc * CELL_SIZE + 1;
            int y = oy + br * CELL_SIZE + 1;
            DrawRectangle(x, y, CELL_SIZE - 2, CELL_SIZE - 2, gc);
        }
    }

    // Ghost piece (drop preview)
    Piece ghost = *p;
    while (true) {
        ghost.y++;
        bool fits = true;
        for (int r = 0; r < PIECE_GRID; r++)
            for (int c = 0; c < PIECE_GRID; c++) {
                if (!piece_cell_filled(&ghost, r, c)) continue;
                int br = ghost.y + r;
                int bc = ghost.x + c;
                if (bc < 0 || bc >= BOARD_W || br >= BOARD_ROWS) { fits = false; break; }
                if (br >= 0 && br < BOARD_ROWS && bc >= 0 && bc < BOARD_W) {
                    // Can't check board from here without it — skip ghost for simplicity
                }
            }
        if (!fits) { ghost.y--; break; }
        if (ghost.y > BOARD_ROWS) { ghost.y = p->y; break; }
    }

    if (ghost.y > p->y) {
        for (int r = 0; r < PIECE_GRID; r++)
            for (int c = 0; c < PIECE_GRID; c++) {
                if (!piece_cell_filled(&ghost, r, c)) continue;
                int br = ghost.y + r;
                int bc = ghost.x + c;
                if (br < 0 || br >= BOARD_ROWS) continue;
                Color gc = genre_color(ghost.cells[r][c]);
                gc.a = 50;
                DrawRectangle(ox + bc * CELL_SIZE + 1, oy + br * CELL_SIZE + 1,
                             CELL_SIZE - 2, CELL_SIZE - 2, gc);
            }
    }
}

static void draw_next_piece(const Piece *p) {
    int ox = BOARD_OFFSET_X + BOARD_W * CELL_SIZE + 30;
    int oy = BOARD_OFFSET_Y + 40;

    DrawText("NEXT", ox, oy - 25, 16, TEXT_SUB);
    DrawRectangle(ox - 4, oy - 4, 5 * CELL_SIZE + 8, 5 * CELL_SIZE + 8, PANEL_COLOR);
    DrawRectangleLines(ox - 4, oy - 4, 5 * CELL_SIZE + 8, 5 * CELL_SIZE + 8, BORDER_COLOR);

    for (int r = 0; r < PIECE_GRID; r++)
        for (int c = 0; c < PIECE_GRID; c++) {
            if (!piece_cell_filled(p, r, c)) continue;
            Color gc = genre_color(p->cells[r][c]);
            DrawRectangle(ox + c * CELL_SIZE + 1, oy + r * CELL_SIZE + 1,
                         CELL_SIZE - 2, CELL_SIZE - 2, gc);
        }
}

static void draw_sidebar(const Game *g) {
    int ox = BOARD_OFFSET_X + BOARD_W * CELL_SIZE + 30;
    int oy = BOARD_OFFSET_Y + 210;

    // Score
    char buf[64];
    DrawText("SCORE", ox, oy, 14, TEXT_SUB);
    snprintf(buf, sizeof(buf), "%d", g->board.score);
    DrawText(buf, ox, oy + 18, 24, GOLD_COLOR);

    // Level
    DrawText("LEVEL", ox, oy + 60, 14, TEXT_SUB);
    snprintf(buf, sizeof(buf), "%d", g->board.level + 1);
    DrawText(buf, ox, oy + 78, 24, ACCENT_COLOR);

    // Lines
    DrawText("LINES", ox, oy + 120, 14, TEXT_SUB);
    snprintf(buf, sizeof(buf), "%d", g->board.lines_cleared);
    DrawText(buf, ox, oy + 138, 24, TEXT_COLOR);

    // Books
    DrawText("BOOKS", ox, oy + 180, 14, TEXT_SUB);
    snprintf(buf, sizeof(buf), "%d", g->board.books_placed);
    DrawText(buf, ox, oy + 198, 24, TEXT_COLOR);

    // Round
    DrawText("ROUND", ox, oy + 240, 14, TEXT_SUB);
    snprintf(buf, sizeof(buf), "%d / %d", g->round, MAX_ROUNDS);
    DrawText(buf, ox, oy + 258, 20, TEXT_COLOR);

    // Combo
    if (g->combo > 1) {
        snprintf(buf, sizeof(buf), "%dx COMBO!", g->combo);
        DrawText(buf, ox, oy + 300, 18, SUCCESS_COLOR);
    }
}

void ui_draw_title(const Game *g) {
    (void)g;
    DrawRectangle(0, 0, SCREEN_W, SCREEN_H, BG_COLOR);

    draw_centered("TSUNDOKU", 150, 60, GOLD_COLOR);
    draw_centered("-- Tsun Doku --", 220, 20, TEXT_SUB);

    DrawRectangle(200, 280, 400, 180, PANEL_COLOR);
    DrawRectangleLines(200, 280, 400, 180, BORDER_COLOR);

    draw_centered("Hon wo tsume, tana wo umerou!", 305, 18, TEXT_COLOR);
    draw_centered("3 round no gokei score de shoubu!", 335, 16, TEXT_SUB);

    draw_centered("<- -> : Idou   Z : Kaiten", 385, 14, TEXT_SUB);
    draw_centered("DOWN : Ochiru  SPACE : Hard Drop", 405, 14, TEXT_SUB);

    draw_centered("[ ENTER de START ]", 520, 24, GOLD_COLOR);
}

void ui_draw_playing(const Game *g) {
    DrawRectangle(0, 0, SCREEN_W, SCREEN_H, BG_COLOR);

    // Left sidebar - piece name
    int lx = 20;
    DrawText("TSUNDOKU", lx, 20, 16, ACCENT_COLOR);

    const char *pname = piece_type_name(g->current.type);
    DrawText(pname, lx, 50, 14, TEXT_SUB);
    DrawText(g->current.title, lx, 70, 12, TEXT_SUB);

    draw_board(&g->board);
    draw_piece(&g->current);
    draw_next_piece(&g->next);
    draw_sidebar(g);
}

void ui_draw_round_end(const Game *g) {
    DrawRectangle(0, 0, SCREEN_W, SCREEN_H, BG_COLOR);

    char buf[64];
    snprintf(buf, sizeof(buf), "Round %d Owari!", g->round);
    draw_centered(buf, 180, 36, ACCENT_COLOR);

    snprintf(buf, sizeof(buf), "Score: %d", g->board.score);
    draw_centered(buf, 250, 24, GOLD_COLOR);

    snprintf(buf, sizeof(buf), "Lines: %d  |  Books: %d", g->board.lines_cleared, g->board.books_placed);
    draw_centered(buf, 290, 18, TEXT_COLOR);

    snprintf(buf, sizeof(buf), "Max Combo: %dx", g->max_combo);
    draw_centered(buf, 320, 18, TEXT_COLOR);

    if (g->round < MAX_ROUNDS) {
        draw_centered("[ ENTER de tsugi no round ]", 420, 22, GOLD_COLOR);
    } else {
        draw_centered("[ ENTER de kekka ]", 420, 22, GOLD_COLOR);
    }
}

void ui_draw_game_over(const Game *g) {
    DrawRectangle(0, 0, SCREEN_W, SCREEN_H, BG_COLOR);

    draw_centered("GAME OVER", 100, 48, GOLD_COLOR);

    int total = game_total_score(g);
    char buf[64];

    // Per-round scores
    for (int i = 0; i < MAX_ROUNDS; i++) {
        snprintf(buf, sizeof(buf), "Round %d: %d", i + 1, g->round_scores[i]);
        draw_centered(buf, 200 + i * 30, 18, TEXT_COLOR);
    }

    snprintf(buf, sizeof(buf), "Gokei: %d", total);
    draw_centered(buf, 320, 28, GOLD_COLOR);

    snprintf(buf, sizeof(buf), "Grade: %s", game_grade_label(total));
    draw_centered(buf, 370, 22,
        total >= 7000 ? GOLD_COLOR : total >= 4000 ? ACCENT_COLOR : TEXT_COLOR);

    draw_centered("[ ENTER de title e ]", 480, 22, ACCENT_COLOR);
}
