/*
 * AntiScroll — Unit Tests
 * Tests game logic without opening a window.
 */

#include <stdio.h>
#include <math.h>
#include <string.h>
#include <stddef.h>
#include "../src/runner.h"
#include "../src/spawner.h"
#include "../src/papers.h"
#include "../src/scoring.h"

static int passed = 0;
static int failed = 0;

#define ASSERT(cond, msg) do { \
    if (cond) { passed++; } \
    else { failed++; printf("  FAIL: %s\n", msg); } \
} while(0)

/* ── Paper Tests ──────────────────────────────────────────── */

static void test_papers(void)
{
    printf("\n--- Paper Database ---\n");

    PaperDB db = papers_init();
    ASSERT(db.count >= 50, "at least 50 papers");

    /* All papers have title and field */
    for (int i = 0; i < db.count; i++) {
        ASSERT(db.papers[i].title != NULL, "paper has title");
        ASSERT(db.papers[i].field != NULL, "paper has field");
        ASSERT(strlen(db.papers[i].title) > 5, "title not empty");
        ASSERT(strlen(db.papers[i].field) > 1, "field not empty");
    }

    /* Get by index */
    const Paper *p = papers_get(&db, 0);
    ASSERT(p != NULL, "get index 0");
    ASSERT(papers_get(&db, -1) == NULL, "get -1 returns NULL");
    ASSERT(papers_get(&db, 999) == NULL, "get 999 returns NULL");

    /* Random (just check it doesn't crash) */
    for (int i = 0; i < 20; i++) {
        const Paper *rp = papers_random(&db);
        ASSERT(rp != NULL, "random paper not NULL");
    }
}

/* ── Runner Tests ─────────────────────────────────────────── */

static void test_runner(void)
{
    printf("\n--- Runner ---\n");

    Runner r = runner_create();
    ASSERT(r.lane == 1, "starts in middle lane");
    ASSERT(!r.boosting, "not boosting initially");
    ASSERT(r.hit_flash == 0, "no hit flash initially");

    /* Move up */
    runner_move_up(&r);
    ASSERT(r.lane == 0, "moved to lane 0");
    runner_move_up(&r);
    ASSERT(r.lane == 0, "can't go above lane 0");

    /* Move down */
    r.lane = 1;
    r.target_y = runner_lane_y(1);
    runner_move_down(&r);
    ASSERT(r.lane == 2, "moved to lane 2");
    runner_move_down(&r);
    ASSERT(r.lane == 2, "can't go below lane 2");

    /* Boost */
    runner_boost(&r);
    ASSERT(r.boosting, "boosting after boost()");
    ASSERT(r.boost_timer > 0, "boost timer set");

    /* Rect */
    Rectangle rect = runner_rect(&r);
    ASSERT(rect.width == PLAYER_W, "rect width");
    ASSERT(rect.height == PLAYER_H, "rect height");
    ASSERT(rect.x == PLAYER_X, "rect x");

    /* Lane Y */
    float y0 = runner_lane_y(0);
    float y1 = runner_lane_y(1);
    float y2 = runner_lane_y(2);
    ASSERT(y0 < y1, "lane 0 above lane 1");
    ASSERT(y1 < y2, "lane 1 above lane 2");
}

/* ── Scoring Tests ────────────────────────────────────────── */

static void test_scoring(void)
{
    printf("\n--- Scoring ---\n");

    Score s = score_create();
    ASSERT(s.papers_collected == 0, "0 papers initially");
    ASSERT(s.lives == 3, "3 lives");
    ASSERT(!score_game_over(&s), "not game over");
    ASSERT(s.streak == 0, "streak 0");

    /* Collect papers */
    score_collect_paper(&s, 0, "Test Paper 1", "cs.AI");
    ASSERT(s.papers_collected == 1, "1 paper collected");
    ASSERT(s.streak == 1, "streak 1");
    ASSERT(s.collected_count == 1, "1 collected record");
    ASSERT(strcmp(s.collected[0].title, "Test Paper 1") == 0, "collected title");
    ASSERT(strcmp(s.collected[0].field, "cs.AI") == 0, "collected field");

    /* Anti-difficulty: speed should decrease */
    float mult1 = score_get_speed_mult(&s);
    score_collect_paper(&s, 1, "Test Paper 2", "cs.CV");
    float mult2 = score_get_speed_mult(&s);
    ASSERT(mult2 < mult1 || (mult2 == mult1 && mult1 <= 0.4f), "speed decreases with papers");

    /* Streak */
    ASSERT(s.streak == 2, "streak 2");
    ASSERT(s.best_streak == 2, "best streak 2");

    /* Hit distraction */
    score_hit_distraction(&s);
    ASSERT(s.lives == 2, "2 lives after hit");
    ASSERT(s.distractions_hit == 1, "1 hit");
    ASSERT(s.streak == 0, "streak reset on hit");
    ASSERT(s.best_streak == 2, "best streak preserved");

    /* Dodge */
    score_dodge_distraction(&s);
    ASSERT(s.distractions_dodged == 1, "1 dodged");

    /* Game over */
    score_hit_distraction(&s);
    score_hit_distraction(&s);
    ASSERT(score_game_over(&s), "game over at 0 lives");

    /* Anti-difficulty floor */
    Score s2 = score_create();
    for (int i = 0; i < 50; i++) {
        score_collect_paper(&s2, i, "P", "f");
    }
    float floor_mult = score_get_speed_mult(&s2);
    ASSERT(floor_mult >= 0.4f, "speed mult floor at 0.4");

    /* Distance */
    Score s3 = score_create();
    score_update_distance(&s3, 1.0f, 100.0f);
    ASSERT(s3.distance > 0, "distance increases");
}

/* ── Spawner Tests ────────────────────────────────────────── */

static void test_spawner(void)
{
    printf("\n--- Spawner ---\n");

    Spawner s = spawner_create();
    ASSERT(s.spawn_interval > 0, "spawn interval positive");
    ASSERT(s.base_speed > 0, "base speed positive");
    ASSERT(spawner_count_active(&s, ENT_DISTRACTION) == 0, "no distractions initially");
    ASSERT(spawner_count_active(&s, ENT_PAPER) == 0, "no papers initially");

    /* Remove */
    s.entities[0].active = true;
    s.entities[0].type = ENT_DISTRACTION;
    ASSERT(spawner_count_active(&s, ENT_DISTRACTION) == 1, "1 distraction");
    spawner_remove(&s, 0);
    ASSERT(spawner_count_active(&s, ENT_DISTRACTION) == 0, "0 after remove");

    /* Out of range remove doesn't crash */
    spawner_remove(&s, -1);
    spawner_remove(&s, 999);
    ASSERT(1, "out of range remove safe");

    /* Count */
    s.entities[1].active = true;
    s.entities[1].type = ENT_PAPER;
    s.entities[2].active = true;
    s.entities[2].type = ENT_PAPER;
    s.entities[3].active = true;
    s.entities[3].type = ENT_DISTRACTION;
    ASSERT(spawner_count_active(&s, ENT_PAPER) == 2, "2 papers active");
    ASSERT(spawner_count_active(&s, ENT_DISTRACTION) == 1, "1 distraction active");
}

/* ── Main ──────────────────────────────────────────────────── */

int main(void)
{
    printf("AntiScroll Test Suite\n");
    printf("=====================\n");

    test_papers();
    test_runner();
    test_scoring();
    test_spawner();

    printf("\n%d passed, %d failed\n", passed, failed);
    return failed > 0 ? 1 : 0;
}
