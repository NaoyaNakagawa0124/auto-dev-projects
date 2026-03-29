#ifndef GAME_H
#define GAME_H

#include "puzzles.h"

typedef enum {
    STATE_TITLE,
    STATE_STORY,
    STATE_PLAYING,
    STATE_SOLVED,
    STATE_COMPLETE,
} GameState;

typedef struct {
    GameState state;
    int current_room;       // 1-5
    Puzzle puzzle;
    int total_mistakes;
    float total_time;
    float room_time;
    int cursor_row;
    int cursor_col;
    int selected_answer;    // For sequence puzzle number input
    bool show_hint;
    bool show_wrong;
    float wrong_timer;
} Game;

void game_init(Game *g);
void game_start_room(Game *g, int room);
void game_next_room(Game *g);
bool game_is_complete(const Game *g);

#endif
