#include "game.h"
#include <string.h>

void game_init(Game *g) {
    memset(g, 0, sizeof(Game));
    g->state = STATE_TITLE;
    g->current_room = 0;
}

void game_start_room(Game *g, int room) {
    g->current_room = room;
    g->puzzle = puzzle_create(room);
    g->state = STATE_STORY;
    g->room_time = 0.0f;
    g->cursor_row = 0;
    g->cursor_col = 0;
    g->selected_answer = 0;
    g->show_hint = false;
    g->show_wrong = false;
    g->wrong_timer = 0.0f;
}

void game_next_room(Game *g) {
    if (g->current_room < PUZZLE_COUNT) {
        game_start_room(g, g->current_room + 1);
    } else {
        g->state = STATE_COMPLETE;
    }
}

bool game_is_complete(const Game *g) {
    return g->current_room > PUZZLE_COUNT;
}
