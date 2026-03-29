#ifndef UI_H
#define UI_H

#include "scoring.h"
#include "runner.h"

typedef enum {
    STATE_MENU,
    STATE_PLAYING,
    STATE_PAUSED,
    STATE_GAMEOVER
} GameState;

void ui_draw_background(float scroll_offset);
void ui_draw_lanes(void);
void ui_draw_hud(const Score *score, float speed_mult);
void ui_draw_menu(void);
void ui_draw_paused(void);
void ui_draw_gameover(const Score *score);
void ui_draw_paper_flash(const char *title, const char *field, float timer);

#endif
