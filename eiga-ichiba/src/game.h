#ifndef EIGA_GAME_H
#define EIGA_GAME_H

#include <stdint.h>
#include "film.h"

#define STARTING_OKU 100
#define ALLOC_STEP 25         // % step
#define PLAYER_COUNT 2

typedef enum {
    PHASE_TITLE,
    PHASE_PREVIEW,        // showing the film, prompt to start allocating
    PHASE_ALLOC_P1,       // player 1 picks allocation
    PHASE_HANDOFF,        // pass-and-play prompt
    PHASE_ALLOC_P2,       // player 2 picks
    PHASE_REVEAL,         // reveal both allocations + multiplier
    PHASE_MONTH_RESULT,   // settle, animate bars
    PHASE_GAME_OVER,      // final standings
} Phase;

typedef struct {
    int cash_oku;          // current cash on hand
    int alloc_pct;         // selected allocation this month (0/25/50/75/100)
    int last_invested;     // most recent invested amount (oku)
    int last_return;       // most recent return amount (oku)
} Player;

typedef struct {
    Phase phase;
    int month_index;       // 0..11
    int current_player;    // 0 or 1 (used during alloc phases)
    Player players[PLAYER_COUNT];
    /* multiplier for the current month, x100 (e.g. 145 means 1.45x).
       Set when transitioning to REVEAL. */
    int month_multiplier_x100;
    uint32_t rng_state;
    /* Cached: monthly history of multipliers per month */
    int history_mult[FILM_COUNT];
    /* Whether month has been played */
    int month_played[FILM_COUNT];
} Game;

void game_init(Game *g, uint32_t seed);
const Film *game_current_film(const Game *g);
void game_advance(Game *g);                       // primary state-machine step
void game_set_alloc(Game *g, int pct);            // for current player
int  game_compute_multiplier(const Film *film, uint32_t *rng);
void game_settle(Game *g);                        // apply multiplier to allocations
int  game_winner(const Game *g);                  // 0/1, or -1 for tie
int  game_total_value(const Game *g, int p);      // just cash on hand (we settle to cash each month)
int  game_alloc_amount(const Player *p);          // amount of oku player would invest at current pct

uint32_t game_rng_next(uint32_t *state);

#endif
