#include "board.h"
#include <string.h>

void board_init(Board *b) {
    memset(b, 0, sizeof(Board));
}

bool board_piece_fits(const Board *b, const Piece *p) {
    for (int r = 0; r < PIECE_GRID; r++) {
        for (int c = 0; c < PIECE_GRID; c++) {
            if (!piece_cell_filled(p, r, c)) continue;

            int br = p->y + r;
            int bc = p->x + c;

            // Out of bounds
            if (bc < 0 || bc >= BOARD_W || br >= BOARD_ROWS) return false;
            // Above board is ok (for spawning)
            if (br < 0) continue;
            // Collision with existing piece
            if (b->cells[br][bc] != 0) return false;
        }
    }
    return true;
}

void board_place_piece(Board *b, const Piece *p) {
    for (int r = 0; r < PIECE_GRID; r++) {
        for (int c = 0; c < PIECE_GRID; c++) {
            if (!piece_cell_filled(p, r, c)) continue;
            int br = p->y + r;
            int bc = p->x + c;
            if (br >= 0 && br < BOARD_ROWS && bc >= 0 && bc < BOARD_W) {
                b->cells[br][bc] = p->cells[r][c];
            }
        }
    }
    b->books_placed++;
}

int board_clear_lines(Board *b) {
    int cleared = 0;

    for (int r = BOARD_ROWS - 1; r >= 0; r--) {
        bool full = true;
        for (int c = 0; c < BOARD_W; c++) {
            if (b->cells[r][c] == 0) { full = false; break; }
        }

        if (full) {
            cleared++;
            // Shift everything down
            for (int rr = r; rr > 0; rr--) {
                memcpy(b->cells[rr], b->cells[rr - 1], sizeof(int) * BOARD_W);
            }
            memset(b->cells[0], 0, sizeof(int) * BOARD_W);
            r++;  // Recheck this row
        }
    }

    if (cleared > 0) {
        int points = board_calc_line_score(cleared, b->level);
        b->score += points;
        b->lines_cleared += cleared;
        b->level = board_calc_level(b->lines_cleared);
    }

    return cleared;
}

bool board_is_game_over(const Board *b) {
    // Game over if top row has any filled cells
    for (int c = 0; c < BOARD_W; c++) {
        if (b->cells[0][c] != 0) return true;
    }
    return false;
}

int board_column_height(const Board *b, int col) {
    if (col < 0 || col >= BOARD_W) return 0;
    for (int r = 0; r < BOARD_ROWS; r++) {
        if (b->cells[r][col] != 0) return BOARD_ROWS - r;
    }
    return 0;
}

int board_max_height(const Board *b) {
    int max = 0;
    for (int c = 0; c < BOARD_W; c++) {
        int h = board_column_height(b, c);
        if (h > max) max = h;
    }
    return max;
}

int board_calc_line_score(int lines, int level) {
    // Book-themed scoring: more lines at once = exponentially more points
    // Single: 100, Double: 300, Triple: 500, Quad: 800
    int base;
    switch (lines) {
        case 1: base = 100; break;
        case 2: base = 300; break;
        case 3: base = 500; break;
        case 4: base = 800; break;
        default: base = lines * 200; break;
    }
    return base * (level + 1);
}

int board_calc_level(int total_lines) {
    return total_lines / 10;  // Level up every 10 lines
}
