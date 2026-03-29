#ifndef UI_H
#define UI_H

#include "game.h"

/* Draw the HUD overlay (clue count, room name, timer, message) */
void ui_draw_hud(const Game *g);

/* Draw the main menu screen */
void ui_draw_menu(void);

/* Draw the case introduction screen */
void ui_draw_intro(const Game *g);

/* Draw the deduction screen */
void ui_draw_deduction(const Game *g);

/* Draw the win screen */
void ui_draw_win(const Game *g);

/* Draw the lose screen */
void ui_draw_lose(const Game *g);

/* Draw the clue inventory sidebar */
void ui_draw_inventory(const Game *g);

#endif
