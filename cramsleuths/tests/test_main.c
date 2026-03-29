/*
 * CramSleuths — Unit Tests
 * Tests game logic, clue system, collision, and room data without rendering.
 * Links against raylib but doesn't open a window.
 */

#include <stdio.h>
#include <math.h>
#include <string.h>
#include "../src/player.h"
#include "../src/room.h"
#include "../src/clue.h"
#include "../src/game.h"

static int passed = 0;
static int failed = 0;

#define ASSERT(cond, msg) do { \
    if (cond) { passed++; } \
    else { failed++; printf("  FAIL: %s\n", msg); } \
} while(0)

#define ASSERT_EQ_INT(a, b, msg) ASSERT((a) == (b), msg)
#define ASSERT_EQ_FLOAT(a, b, eps, msg) ASSERT(fabs((a) - (b)) < (eps), msg)
#define ASSERT_TRUE(a, msg) ASSERT((a), msg)
#define ASSERT_FALSE(a, msg) ASSERT(!(a), msg)

/* ── Clue System Tests ─────────────────────────────────────── */

static void test_clue_system(void)
{
    printf("\n--- Clue System ---\n");

    ClueSystem sys = clue_system_init();

    ASSERT_EQ_INT(sys.clue_count, 9, "9 clues total");
    ASSERT_EQ_INT(sys.found_count, 0, "0 found initially");
    ASSERT_EQ_INT(sys.choice_count, 4, "4 deduction choices");
    ASSERT_TRUE(sys.case_title != NULL, "has case title");
    ASSERT_TRUE(sys.case_intro != NULL, "has case intro");
    ASSERT_TRUE(sys.case_solution != NULL, "has case solution");

    /* Find a clue */
    ASSERT_TRUE(clue_find(&sys, 0, 0), "find clue 0");
    ASSERT_EQ_INT(sys.found_count, 1, "1 found after finding clue 0");
    ASSERT_TRUE(clue_is_found(&sys, 0), "clue 0 is found");
    ASSERT_FALSE(clue_is_found(&sys, 1), "clue 1 not found yet");

    /* Can't find same clue twice */
    ASSERT_FALSE(clue_find(&sys, 0, 1), "can't re-find clue 0");
    ASSERT_EQ_INT(sys.found_count, 1, "still 1 found");

    /* Find all clues */
    for (int i = 1; i < sys.clue_count; i++) {
        clue_find(&sys, i, i % 2);
    }
    ASSERT_TRUE(clue_all_found(&sys), "all clues found");
    ASSERT_EQ_INT(clue_found_count(&sys), 9, "found_count is 9");

    /* Get clue */
    const Clue *c = clue_get(&sys, 0);
    ASSERT_TRUE(c != NULL, "get clue 0");
    ASSERT_TRUE(strcmp(c->name, "Torn Page") == 0, "clue 0 name");
    ASSERT_EQ_INT(c->found_by, 0, "clue 0 found by player 0");

    ASSERT_TRUE(clue_get(&sys, 99) == NULL, "invalid clue id returns NULL");

    /* Check answer */
    ASSERT_TRUE(clue_check_answer(&sys, 1), "choice 1 is correct");
    ASSERT_FALSE(clue_check_answer(&sys, 0), "choice 0 is wrong");
    ASSERT_FALSE(clue_check_answer(&sys, 2), "choice 2 is wrong");
    ASSERT_FALSE(clue_check_answer(&sys, 3), "choice 3 is wrong");
    ASSERT_FALSE(clue_check_answer(&sys, -1), "invalid choice");
    ASSERT_FALSE(clue_check_answer(&sys, 99), "out of range choice");
}

/* ── Room Tests ────────────────────────────────────────────── */

static void test_rooms(void)
{
    printf("\n--- Room Tests ---\n");

    Room lib = room_create_library();
    ASSERT_EQ_INT(lib.id, 0, "library id");
    ASSERT_TRUE(lib.wall_count > 0, "library has walls");
    ASSERT_TRUE(lib.object_count > 0, "library has objects");
    ASSERT_TRUE(lib.door_count > 0, "library has doors");
    ASSERT_EQ_FLOAT(lib.width, 640, 0.1, "library width 640");
    ASSERT_EQ_FLOAT(lib.height, 480, 0.1, "library height 480");

    Room lab = room_create_lab();
    ASSERT_EQ_INT(lab.id, 1, "lab id");
    ASSERT_TRUE(lab.wall_count > 0, "lab has walls");

    Room off = room_create_office();
    ASSERT_EQ_INT(off.id, 2, "office id");
    ASSERT_TRUE(off.object_count > 0, "office has objects");

    /* Check co-op objects exist */
    int coop_count = 0;
    for (int i = 0; i < lib.object_count; i++) {
        if (lib.objects[i].requires_coop) coop_count++;
    }
    ASSERT_TRUE(coop_count > 0, "library has co-op objects");

    /* Collision: point inside room should stay */
    Vector2 inside = {320, 240};
    Vector2 result = room_collide(&lib, inside, 20);
    ASSERT_EQ_FLOAT(result.x, 320, 1.0, "inside point x unchanged");
    ASSERT_EQ_FLOAT(result.y, 240, 1.0, "inside point y unchanged");

    /* Collision: point outside room should be clamped */
    Vector2 outside = {-50, -50};
    result = room_collide(&lib, outside, 20);
    ASSERT_TRUE(result.x >= 20, "clamped x >= radius");
    ASSERT_TRUE(result.y >= 20, "clamped y >= radius");

    /* Find interactable */
    /* Place position near first object */
    Vector2 near_obj = {lib.objects[0].pos.x + 10, lib.objects[0].pos.y};
    int idx = room_find_interactable(&lib, near_obj, 20);
    ASSERT_EQ_INT(idx, 0, "found object 0 nearby");

    /* Far away position */
    Vector2 far = {600, 400};
    idx = room_find_interactable(&lib, far, 20);
    /* May or may not find one depending on layout; just check it doesn't crash */
    ASSERT_TRUE(idx >= -1, "find_interactable returns valid result");

    /* Door check */
    /* Library door 0 is at (630, 200, 10, 60) */
    Vector2 at_door = {635, 230};
    int door = room_check_door(&lib, at_door, 20);
    ASSERT_EQ_INT(door, 0, "found door at edge");

    Vector2 away = {100, 100};
    door = room_check_door(&lib, away, 20);
    ASSERT_EQ_INT(door, -1, "no door far away");
}

/* ── Game State Tests ──────────────────────────────────────── */

static void test_game(void)
{
    printf("\n--- Game Tests ---\n");

    Game g = game_create();

    ASSERT_EQ_INT(g.state, STATE_MENU, "starts in MENU");
    ASSERT_EQ_INT(g.current_room, 0, "starts in room 0");
    ASSERT_EQ_FLOAT(g.timer, 0, 0.01, "timer starts at 0");
    ASSERT_FALSE(g.solved, "not solved initially");
    ASSERT_EQ_INT(g.players[0].id, 0, "player 1 id");
    ASSERT_EQ_INT(g.players[1].id, 1, "player 2 id");

    /* Room change */
    game_change_room(&g, 1, (Vector2){100, 200});
    ASSERT_EQ_INT(g.current_room, 1, "changed to room 1");
    ASSERT_EQ_FLOAT(g.players[0].pos.x, 100, 0.1, "player 1 at spawn x");
    ASSERT_EQ_FLOAT(g.players[0].pos.y, 200, 0.1, "player 1 at spawn y");

    /* Invalid room change */
    game_change_room(&g, -1, (Vector2){0, 0});
    ASSERT_EQ_INT(g.current_room, 1, "invalid room change ignored");
    game_change_room(&g, 99, (Vector2){0, 0});
    ASSERT_EQ_INT(g.current_room, 1, "out of range room ignored");

    /* Message */
    game_show_message(&g, "Test message");
    ASSERT_TRUE(g.message != NULL, "message set");
    ASSERT_TRUE(g.message_timer > 0, "message timer set");

    /* Clue interaction */
    game_change_room(&g, 0, (Vector2){100, 200});
    /* Move player near object 0 (Torn Page at 100, 200) */
    g.players[0].pos = (Vector2){100, 200};
    g.players[0].interacting = true;
    game_interact(&g, 0);
    ASSERT_TRUE(clue_is_found(&g.clues, 0), "clue 0 found via interact");
    ASSERT_EQ_INT(g.players[0].clue_count, 1, "player 1 clue count");
}

/* ── Player Tests ──────────────────────────────────────────── */

static void test_player(void)
{
    printf("\n--- Player Tests ---\n");

    Player p1 = player_create(0, (Vector2){100, 200});
    ASSERT_EQ_INT(p1.id, 0, "p1 id");
    ASSERT_EQ_FLOAT(p1.pos.x, 100, 0.1, "p1 start x");
    ASSERT_EQ_FLOAT(p1.pos.y, 200, 0.1, "p1 start y");
    ASSERT_EQ_FLOAT(p1.size, PLAYER_SIZE, 0.1, "p1 size");
    ASSERT_EQ_INT(p1.clue_count, 0, "p1 starts with 0 clues");

    Player p2 = player_create(1, (Vector2){300, 400});
    ASSERT_EQ_INT(p2.id, 1, "p2 id");
    ASSERT_TRUE(p2.color.r != p1.color.r || p2.color.b != p1.color.b,
                "different colors");

    /* can_interact */
    ASSERT_TRUE(player_can_interact(&p1, (Vector2){120, 200}), "close point is interactable");
    ASSERT_FALSE(player_can_interact(&p1, (Vector2){500, 500}), "far point is not interactable");
}

/* ── Main ──────────────────────────────────────────────────── */

int main(void)
{
    printf("CramSleuths Test Suite\n");
    printf("======================\n");

    test_clue_system();
    test_rooms();
    test_game();
    test_player();

    printf("\n%d passed, %d failed\n", passed, failed);
    return failed > 0 ? 1 : 0;
}
