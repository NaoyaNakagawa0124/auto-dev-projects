#ifndef UI_H
#define UI_H

#include "game.h"
#include "raylib.h"

#define SCREEN_W 800
#define SCREEN_H 600
#define CELL_SIZE 60
#define GRID_OFFSET_X 200
#define GRID_OFFSET_Y 160

// Colors
#define BG_COLOR       (Color){15, 15, 30, 255}
#define PANEL_COLOR    (Color){25, 25, 55, 220}
#define ACCENT_COLOR   (Color){108, 140, 255, 255}
#define GOLD_COLOR     (Color){255, 215, 0, 255}
#define SUCCESS_COLOR  (Color){76, 255, 142, 255}
#define ERROR_COLOR    (Color){239, 68, 68, 255}
#define TEXT_COLOR     (Color){230, 230, 255, 255}
#define TEXT_SUB_COLOR (Color){160, 160, 200, 180}
#define WALL_COLOR     (Color){60, 60, 90, 255}
#define CELL_COLOR     (Color){35, 35, 70, 255}
#define CELL_HL_COLOR  (Color){55, 55, 100, 255}
#define SWITCH_ON      (Color){76, 255, 142, 255}
#define SWITCH_OFF     (Color){80, 80, 120, 255}
#define TARGET_ON      (Color){255, 215, 0, 200}
#define TARGET_OFF     (Color){50, 50, 80, 200}

void ui_draw_title(const Game *g);
void ui_draw_story(const Game *g);
void ui_draw_puzzle(const Game *g);
void ui_draw_solved(const Game *g);
void ui_draw_complete(const Game *g);

#endif
