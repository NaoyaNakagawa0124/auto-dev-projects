#ifndef BOARD_H_INCLUDED
#define BOARD_H_INCLUDED

#include "piece.h"
#include <stdbool.h>

#define BOARD_W 10
#define BOARD_ROWS 20

typedef struct {
    int cells[BOARD_ROWS][BOARD_W];  // 0=empty, genre=filled
    int score;
    int lines_cleared;
    int level;
    int books_placed;
} Board;

void board_init(Board *b);
bool board_piece_fits(const Board *b, const Piece *p);
void board_place_piece(Board *b, const Piece *p);
int board_clear_lines(Board *b);
bool board_is_game_over(const Board *b);
int board_column_height(const Board *b, int col);
int board_max_height(const Board *b);

// Scoring
int board_calc_line_score(int lines, int level);
int board_calc_level(int total_lines);

#endif
