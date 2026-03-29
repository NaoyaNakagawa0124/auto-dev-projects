#ifndef GAME_H
#define GAME_H

#include "board.h"
#include "piece.h"

typedef enum {
    GSTATE_TITLE,
    GSTATE_PLAYING,
    GSTATE_PAUSED,
    GSTATE_ROUND_END,
    GSTATE_GAME_OVER,
} GameState;

#define MAX_ROUNDS 3

typedef struct {
    GameState state;
    Board board;
    Piece current;
    Piece next;
    int round;              // 1-3
    int round_scores[MAX_ROUNDS];
    float drop_timer;
    float drop_interval;    // Decreases with level
    int combo;
    int max_combo;
    bool game_over;
    float total_time;
    int high_score;
} Game;

void game_init(Game *g);
void game_start_round(Game *g);
void game_spawn_piece(Game *g);
bool game_move(Game *g, int dx);
bool game_drop(Game *g);
void game_hard_drop(Game *g);
void game_rotate(Game *g);
void game_tick(Game *g, float dt);
float game_drop_interval(int level);
bool game_is_final_round(const Game *g);
int game_total_score(const Game *g);

// Grade based on total score
const char *game_grade(int score);
const char *game_grade_label(int score);

#endif
