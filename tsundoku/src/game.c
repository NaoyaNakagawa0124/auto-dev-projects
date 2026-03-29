#include "game.h"
#include <string.h>
#include <stdlib.h>

void game_init(Game *g) {
    memset(g, 0, sizeof(Game));
    g->state = GSTATE_TITLE;
    g->round = 0;
}

void game_start_round(Game *g) {
    g->round++;
    board_init(&g->board);
    g->drop_timer = 0.0f;
    g->drop_interval = game_drop_interval(0);
    g->combo = 0;
    g->max_combo = 0;
    g->game_over = false;
    g->state = GSTATE_PLAYING;
    g->next = piece_random();
    game_spawn_piece(g);
}

void game_spawn_piece(Game *g) {
    g->current = g->next;
    g->current.x = (BOARD_W - piece_width(&g->current)) / 2;
    g->current.y = -1;
    g->next = piece_random();

    if (!board_piece_fits(&g->board, &g->current)) {
        g->game_over = true;
        if (g->round <= MAX_ROUNDS) {
            g->round_scores[g->round - 1] = g->board.score;
        }
        if (game_is_final_round(g)) {
            g->state = GSTATE_GAME_OVER;
        } else {
            g->state = GSTATE_ROUND_END;
        }
    }
}

bool game_move(Game *g, int dx) {
    if (g->state != GSTATE_PLAYING) return false;
    g->current.x += dx;
    if (!board_piece_fits(&g->board, &g->current)) {
        g->current.x -= dx;
        return false;
    }
    return true;
}

bool game_drop(Game *g) {
    if (g->state != GSTATE_PLAYING) return false;
    g->current.y++;
    if (!board_piece_fits(&g->board, &g->current)) {
        g->current.y--;
        // Lock piece
        board_place_piece(&g->board, &g->current);
        int cleared = board_clear_lines(&g->board);
        if (cleared > 0) {
            g->combo++;
            if (g->combo > g->max_combo) g->max_combo = g->combo;
        } else {
            g->combo = 0;
        }
        g->drop_interval = game_drop_interval(g->board.level);
        game_spawn_piece(g);
        return false;  // Piece locked
    }
    return true;
}

void game_hard_drop(Game *g) {
    if (g->state != GSTATE_PLAYING) return;
    while (game_drop(g)) {}
}

void game_rotate(Game *g) {
    if (g->state != GSTATE_PLAYING) return;
    piece_rotate(&g->current);
    if (!board_piece_fits(&g->board, &g->current)) {
        // Try wall kick: shift left, right
        g->current.x--;
        if (board_piece_fits(&g->board, &g->current)) return;
        g->current.x += 2;
        if (board_piece_fits(&g->board, &g->current)) return;
        g->current.x--;
        // Rotation failed, revert
        piece_rotate_back(&g->current);
    }
}

void game_tick(Game *g, float dt) {
    if (g->state != GSTATE_PLAYING) return;
    g->total_time += dt;
    g->drop_timer += dt;
    if (g->drop_timer >= g->drop_interval) {
        g->drop_timer = 0.0f;
        game_drop(g);
    }
}

float game_drop_interval(int level) {
    // Speed increases with level
    float base = 0.8f;
    float decrease = 0.05f * (float)level;
    float min_interval = 0.1f;
    float interval = base - decrease;
    return interval < min_interval ? min_interval : interval;
}

bool game_is_final_round(const Game *g) {
    return g->round >= MAX_ROUNDS;
}

int game_total_score(const Game *g) {
    int total = 0;
    for (int i = 0; i < MAX_ROUNDS; i++) {
        total += g->round_scores[i];
    }
    // Add current round if playing
    if (g->state == GSTATE_PLAYING) {
        total += g->board.score;
    }
    return total;
}

const char *game_grade(int score) {
    if (score >= 10000) return "S";
    if (score >= 7000)  return "A";
    if (score >= 4000)  return "B";
    if (score >= 2000)  return "C";
    if (score >= 1000)  return "D";
    return "F";
}

const char *game_grade_label(int score) {
    if (score >= 10000) return "S - Dokusho no Kami!";
    if (score >= 7000)  return "A - Master Reader!";
    if (score >= 4000)  return "B - Yoku yomimashita!";
    if (score >= 2000)  return "C - Maamaa!";
    if (score >= 1000)  return "D - Ganbare!";
    return "F - Motto yomou!";
}
