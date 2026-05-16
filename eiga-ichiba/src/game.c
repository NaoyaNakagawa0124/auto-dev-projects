#include "game.h"

#include <string.h>

uint32_t game_rng_next(uint32_t *state) {
    /* xorshift32 */
    uint32_t x = *state;
    if (x == 0) x = 0xDEADBEEF;
    x ^= x << 13;
    x ^= x >> 17;
    x ^= x << 5;
    *state = x;
    return x;
}

static int rng_range(uint32_t *state, int lo_inclusive, int hi_inclusive) {
    int range = hi_inclusive - lo_inclusive + 1;
    if (range <= 0) return lo_inclusive;
    return lo_inclusive + (int)(game_rng_next(state) % (uint32_t)range);
}

void game_init(Game *g, uint32_t seed) {
    memset(g, 0, sizeof(*g));
    g->phase = PHASE_TITLE;
    g->month_index = 0;
    g->current_player = 0;
    g->rng_state = seed == 0 ? 0xDEADBEEFu : seed;
    for (int i = 0; i < PLAYER_COUNT; i++) {
        g->players[i].cash_oku = STARTING_OKU;
        g->players[i].alloc_pct = 0;
    }
}

const Film *game_current_film(const Game *g) {
    return film_get(g->month_index);
}

int game_alloc_amount(const Player *p) {
    return (p->cash_oku * p->alloc_pct) / 100;
}

/* Multiplier formula:
   base = seed_return_x10 / 10.0
   hype factor = 0.55 + hype/100.0 * 0.9   (range 0.55..1.45)
   noise = 0.78..1.22 randomised
   result_x100 = round(base * hype_factor * noise * 100)
   Clamped to [10, 420] (i.e. 0.10x..4.20x).
*/
int game_compute_multiplier(const Film *film, uint32_t *rng) {
    if (!film) return 100;
    int base_x100 = film->seed_return_x10 * 10;            // e.g. 14 -> 140
    int hype_x100 = 55 + (film->hype * 9) / 10;            // 55..145
    int noise_x100 = rng_range(rng, 78, 122);              // 78..122
    long product = (long)base_x100 * hype_x100 * noise_x100;
    int result = (int)(product / 10000L);                  // divide twice by 100
    if (result < 10) result = 10;
    if (result > 420) result = 420;
    return result;
}

void game_set_alloc(Game *g, int pct) {
    if (pct < 0) pct = 0;
    if (pct > 100) pct = 100;
    /* Snap to ALLOC_STEP */
    pct = (pct / ALLOC_STEP) * ALLOC_STEP;
    g->players[g->current_player].alloc_pct = pct;
}

void game_settle(Game *g) {
    int mult = g->month_multiplier_x100;
    for (int i = 0; i < PLAYER_COUNT; i++) {
        Player *p = &g->players[i];
        int invested = (p->cash_oku * p->alloc_pct) / 100;
        int returned = (invested * mult) / 100;
        p->cash_oku = (p->cash_oku - invested) + returned;
        if (p->cash_oku < 0) p->cash_oku = 0;
        p->last_invested = invested;
        p->last_return = returned;
        p->alloc_pct = 0;
    }
    g->history_mult[g->month_index] = mult;
    g->month_played[g->month_index] = 1;
}

void game_advance(Game *g) {
    switch (g->phase) {
        case PHASE_TITLE:
            g->phase = PHASE_PREVIEW;
            break;
        case PHASE_PREVIEW:
            g->current_player = 0;
            g->phase = PHASE_ALLOC_P1;
            break;
        case PHASE_ALLOC_P1:
            g->phase = PHASE_HANDOFF;
            break;
        case PHASE_HANDOFF:
            g->current_player = 1;
            g->phase = PHASE_ALLOC_P2;
            break;
        case PHASE_ALLOC_P2: {
            const Film *f = game_current_film(g);
            g->month_multiplier_x100 = game_compute_multiplier(f, &g->rng_state);
            g->phase = PHASE_REVEAL;
            break;
        }
        case PHASE_REVEAL:
            game_settle(g);
            g->phase = PHASE_MONTH_RESULT;
            break;
        case PHASE_MONTH_RESULT:
            g->month_index += 1;
            if (g->month_index >= FILM_COUNT) {
                g->phase = PHASE_GAME_OVER;
            } else {
                g->phase = PHASE_PREVIEW;
                g->current_player = 0;
            }
            break;
        case PHASE_GAME_OVER:
            /* idle; restart via game_init */
            break;
    }
}

int game_total_value(const Game *g, int p) {
    if (p < 0 || p >= PLAYER_COUNT) return 0;
    return g->players[p].cash_oku;
}

int game_winner(const Game *g) {
    int a = game_total_value(g, 0);
    int b = game_total_value(g, 1);
    if (a > b) return 0;
    if (b > a) return 1;
    return -1;
}
