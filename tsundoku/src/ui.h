#ifndef UI_H
#define UI_H

#include "game.h"
#include "raylib.h"

#define SCREEN_W 800
#define SCREEN_H 700
#define CELL_SIZE 30
#define BOARD_OFFSET_X 200
#define BOARD_OFFSET_Y 40

// Colors for genres
Color genre_color(int genre);

void ui_draw_title(const Game *g);
void ui_draw_playing(const Game *g);
void ui_draw_round_end(const Game *g);
void ui_draw_game_over(const Game *g);

#endif
