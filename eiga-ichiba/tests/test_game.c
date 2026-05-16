/* Standalone unit tests for the pure-logic layer.
   Built with `make test`. No Raylib dependency. */

#include "../src/film.h"
#include "../src/game.h"

#include <assert.h>
#include <stdio.h>
#include <string.h>

static int FAILURES = 0;
static int PASSED = 0;

#define CHECK(cond) do { \
    if (cond) { PASSED++; } else { \
        fprintf(stderr, "FAIL %s:%d  %s\n", __FILE__, __LINE__, #cond); \
        FAILURES++; \
    } \
} while (0)

static void test_film_table_well_formed(void) {
    CHECK(film_count() == FILM_COUNT);
    for (int i = 0; i < FILM_COUNT; i++) {
        const Film *f = film_get(i);
        CHECK(f != NULL);
        CHECK(f->title != NULL && f->title[0] != '\0');
        CHECK(f->director != NULL && f->director[0] != '\0');
        CHECK(f->month == i + 1);
        CHECK(f->budget_oku > 0);
        CHECK(f->hype >= 0 && f->hype <= 100);
        CHECK(f->seed_return_x10 >= 3 && f->seed_return_x10 <= 40);
    }
}

static void test_game_init_state(void) {
    Game g;
    game_init(&g, 1);
    CHECK(g.phase == PHASE_TITLE);
    CHECK(g.month_index == 0);
    CHECK(g.players[0].cash_oku == STARTING_OKU);
    CHECK(g.players[1].cash_oku == STARTING_OKU);
}

static void test_state_machine_progresses(void) {
    Game g;
    game_init(&g, 7);
    /* TITLE -> PREVIEW -> ALLOC_P1 -> HANDOFF -> ALLOC_P2 -> REVEAL -> MONTH_RESULT -> PREVIEW */
    game_advance(&g); CHECK(g.phase == PHASE_PREVIEW);
    game_advance(&g); CHECK(g.phase == PHASE_ALLOC_P1);
    CHECK(g.current_player == 0);
    game_advance(&g); CHECK(g.phase == PHASE_HANDOFF);
    game_advance(&g); CHECK(g.phase == PHASE_ALLOC_P2);
    CHECK(g.current_player == 1);
    game_advance(&g); CHECK(g.phase == PHASE_REVEAL);
    /* multiplier should be set when transitioning to REVEAL */
    CHECK(g.month_multiplier_x100 >= 10 && g.month_multiplier_x100 <= 420);
    game_advance(&g); CHECK(g.phase == PHASE_MONTH_RESULT);
    CHECK(g.month_played[0] == 1);
    game_advance(&g); CHECK(g.phase == PHASE_PREVIEW);
    CHECK(g.month_index == 1);
}

static void test_state_machine_reaches_game_over(void) {
    Game g;
    game_init(&g, 1);
    /* Sequence: TITLE then for each month 6 advances; total = 1 + 12*6 */
    game_advance(&g); /* TITLE -> PREVIEW */
    for (int m = 0; m < FILM_COUNT; m++) {
        game_advance(&g); /* PREVIEW -> ALLOC_P1 */
        game_advance(&g); /* ALLOC_P1 -> HANDOFF */
        game_advance(&g); /* HANDOFF  -> ALLOC_P2 */
        game_advance(&g); /* ALLOC_P2 -> REVEAL (mult set) */
        game_advance(&g); /* REVEAL -> MONTH_RESULT (settle) */
        game_advance(&g); /* MONTH_RESULT -> PREVIEW or GAME_OVER */
    }
    CHECK(g.phase == PHASE_GAME_OVER);
}

static void test_alloc_snaps_to_step(void) {
    Game g;
    game_init(&g, 1);
    g.current_player = 0;
    game_set_alloc(&g, 0); CHECK(g.players[0].alloc_pct == 0);
    game_set_alloc(&g, 13); CHECK(g.players[0].alloc_pct == 0);
    game_set_alloc(&g, 25); CHECK(g.players[0].alloc_pct == 25);
    game_set_alloc(&g, 49); CHECK(g.players[0].alloc_pct == 25);
    game_set_alloc(&g, 50); CHECK(g.players[0].alloc_pct == 50);
    game_set_alloc(&g, 100); CHECK(g.players[0].alloc_pct == 100);
    game_set_alloc(&g, 200); CHECK(g.players[0].alloc_pct == 100);
}

static void test_settle_applies_multiplier(void) {
    Game g;
    game_init(&g, 1);
    g.players[0].cash_oku = 100;
    g.players[0].alloc_pct = 50;
    g.players[1].cash_oku = 100;
    g.players[1].alloc_pct = 100;
    g.month_multiplier_x100 = 200; /* 2.0x */
    g.month_index = 0;
    game_settle(&g);
    /* P0: invested 50, returns 100 => cash = 50 + 100 = 150 */
    CHECK(g.players[0].cash_oku == 150);
    /* P1: invested 100, returns 200 => cash = 0 + 200 = 200 */
    CHECK(g.players[1].cash_oku == 200);
    CHECK(g.history_mult[0] == 200);
    CHECK(g.month_played[0] == 1);
}

static void test_multiplier_bounds(void) {
    uint32_t rng = 42;
    for (int trial = 0; trial < 200; trial++) {
        for (int i = 0; i < FILM_COUNT; i++) {
            const Film *f = film_get(i);
            int m = game_compute_multiplier(f, &rng);
            CHECK(m >= 10 && m <= 420);
        }
    }
}

static void test_winner_logic(void) {
    Game g;
    game_init(&g, 1);
    g.players[0].cash_oku = 200;
    g.players[1].cash_oku = 100;
    CHECK(game_winner(&g) == 0);
    g.players[1].cash_oku = 300;
    CHECK(game_winner(&g) == 1);
    g.players[1].cash_oku = 200;
    CHECK(game_winner(&g) == -1);
}

static void test_rng_deterministic(void) {
    uint32_t a = 99, b = 99;
    for (int i = 0; i < 50; i++) {
        CHECK(game_rng_next(&a) == game_rng_next(&b));
    }
}

int main(void) {
    test_film_table_well_formed();
    test_game_init_state();
    test_state_machine_progresses();
    test_state_machine_reaches_game_over();
    test_alloc_snaps_to_step();
    test_settle_applies_multiplier();
    test_multiplier_bounds();
    test_winner_logic();
    test_rng_deterministic();
    int total = PASSED + FAILURES;
    if (FAILURES) {
        fprintf(stderr, "❌ %d/%d failed\n", FAILURES, total);
        return 1;
    }
    printf("✅ %d/%d tests passed\n", PASSED, total);
    return 0;
}
