// Test suite for RonriRoom puzzle logic
// Compiled without Raylib (TEST_MODE defined in Makefile)
#include <stdio.h>
#include <string.h>
#include <stdbool.h>
#include "../src/puzzles.h"

static int total = 0, passed = 0, failed = 0;

#define TEST(name) do { \
    total++; \
    printf("    "); \
    if (name) { passed++; printf("\033[32m✓\033[0m "); } \
    else { failed++; printf("\033[31m✗\033[0m "); } \
} while(0)

#define SECTION(name) printf("\n  \033[1m%s\033[0m\n", name)

// ===== Pattern Puzzle Tests =====
static void test_pattern_puzzle(void) {
    SECTION("Pattern Puzzle");

    Puzzle p;
    puzzle_init_pattern(&p, 1);

    TEST(p.type == PUZZLE_PATTERN);
    printf("type should be PUZZLE_PATTERN\n");

    TEST(p.grid_rows == 4 && p.grid_cols == 4);
    printf("grid should be 4x4\n");

    TEST(p.grid[0][0] == 1 && p.grid[0][1] == 2);
    printf("first row starts with 1, 2\n");

    TEST(p.answer_row == 3 && p.answer_col == 3);
    printf("answer is at (3,3)\n");

    TEST(puzzle_check_pattern(&p, 3, 3) == true);
    printf("correct cell (3,3) should be accepted\n");

    TEST(puzzle_check_pattern(&p, 0, 0) == false);
    printf("wrong cell (0,0) should be rejected\n");

    TEST(puzzle_check_pattern(&p, 3, 2) == false);
    printf("wrong cell (3,2) should be rejected\n");
}

// ===== Sequence Puzzle Tests =====
static void test_sequence_puzzle(void) {
    SECTION("Sequence Puzzle");

    Puzzle p;
    puzzle_init_sequence(&p, 2);

    TEST(p.type == PUZZLE_SEQUENCE);
    printf("type should be PUZZLE_SEQUENCE\n");

    TEST(p.sequence_len == 8);
    printf("sequence should have 8 elements\n");

    TEST(p.missing_index == 6);
    printf("missing index should be 6\n");

    TEST(p.missing_answer == 13);
    printf("answer should be 13 (fibonacci)\n");

    TEST(puzzle_check_sequence(&p, 13) == true);
    printf("correct answer 13 should pass\n");

    TEST(puzzle_check_sequence(&p, 12) == false);
    printf("wrong answer 12 should fail\n");

    TEST(puzzle_check_sequence(&p, 0) == false);
    printf("wrong answer 0 should fail\n");

    // Verify fibonacci pattern
    TEST(p.sequence[0] == 1 && p.sequence[1] == 1);
    printf("starts with 1, 1\n");

    TEST(p.sequence[4] == 5 && p.sequence[5] == 8);
    printf("continues 5, 8\n");

    TEST(p.sequence[7] == 21);
    printf("ends with 21\n");
}

// ===== Switches Puzzle Tests =====
static void test_switches_puzzle(void) {
    SECTION("Switches Puzzle");

    Puzzle p;
    puzzle_init_switches(&p, 3);

    TEST(p.type == PUZZLE_SWITCHES);
    printf("type should be PUZZLE_SWITCHES\n");

    TEST(p.switch_count == 6);
    printf("should have 6 switches\n");

    // All start OFF
    bool all_off = true;
    for (int i = 0; i < 6; i++) if (p.switches[i]) all_off = false;
    TEST(all_off);
    printf("all switches should start OFF\n");

    // Target is ON OFF ON OFF ON OFF
    TEST(p.target[0] == true && p.target[1] == false);
    printf("target[0]=ON, target[1]=OFF\n");

    // Not solved initially
    TEST(puzzle_check_switches(&p) == false);
    printf("should not be solved initially\n");

    // Toggle switch 0 → also toggles switch 1 (linked)
    puzzle_toggle_switch(&p, 0);
    TEST(p.switches[0] == true && p.switches[1] == true);
    printf("toggling switch 0 also toggles linked switch 1\n");

    // Toggle switch 1 directly to turn it off
    puzzle_toggle_switch(&p, 1);
    TEST(p.switches[0] == true && p.switches[1] == false);
    printf("toggling switch 1 only affects itself (no link)\n");

    // Links: 0->1, 2->3, 4->5
    TEST(p.linked[0] == 1 && p.linked[2] == 3 && p.linked[4] == 5);
    printf("links should be 0->1, 2->3, 4->5\n");

    // Out of bounds toggle should be safe
    puzzle_toggle_switch(&p, -1);
    puzzle_toggle_switch(&p, 99);
    TEST(true);
    printf("out-of-bounds toggle should not crash\n");

    // Solve it: need ON OFF ON OFF ON OFF
    // Reset
    puzzle_init_switches(&p, 3);
    // Toggle 0 -> 0:ON, 1:ON
    puzzle_toggle_switch(&p, 0);
    // Toggle 1 -> 1:OFF
    puzzle_toggle_switch(&p, 1);
    // Toggle 2 -> 2:ON, 3:ON
    puzzle_toggle_switch(&p, 2);
    // Toggle 3 -> 3:OFF
    puzzle_toggle_switch(&p, 3);
    // Toggle 4 -> 4:ON, 5:ON
    puzzle_toggle_switch(&p, 4);
    // Toggle 5 -> 5:OFF
    puzzle_toggle_switch(&p, 5);
    TEST(puzzle_check_switches(&p) == true);
    printf("should be solved after correct sequence\n");
}

// ===== Path Puzzle Tests =====
static void test_path_puzzle(void) {
    SECTION("Path Puzzle");

    Puzzle p;
    puzzle_init_path(&p, 4);

    TEST(p.type == PUZZLE_PATH);
    printf("type should be PUZZLE_PATH\n");

    TEST(p.grid_rows == 5 && p.grid_cols == 5);
    printf("grid should be 5x5\n");

    TEST(p.path_player_r == 0 && p.path_player_c == 0);
    printf("player starts at (0,0)\n");

    TEST(p.path_goal_r == 4 && p.path_goal_c == 4);
    printf("goal is at (4,4)\n");

    // Not solved at start
    TEST(puzzle_check_path(&p) == false);
    printf("should not be solved at start\n");

    // Move right (0,0) -> (0,1): should succeed
    TEST(puzzle_move_path(&p, 0, 1) == true);
    printf("should move right from start\n");

    TEST(p.path_player_r == 0 && p.path_player_c == 1);
    printf("player should be at (0,1)\n");

    // Move right to (0,2): wall! should fail
    TEST(puzzle_move_path(&p, 0, 1) == false);
    printf("should not move into wall at (0,2)\n");

    TEST(p.path_player_r == 0 && p.path_player_c == 1);
    printf("player should still be at (0,1)\n");

    // Move down to (1,1): wall! should fail
    TEST(puzzle_move_path(&p, 1, 0) == false);
    printf("should not move into wall at (1,1)\n");

    // Move out of bounds
    puzzle_init_path(&p, 4); // reset
    TEST(puzzle_move_path(&p, -1, 0) == false);
    printf("should not move out of bounds (up from 0,0)\n");

    TEST(puzzle_move_path(&p, 0, -1) == false);
    printf("should not move out of bounds (left from 0,0)\n");

    // Navigate to goal
    puzzle_init_path(&p, 4);
    // Path: (0,0)->(1,0)->(2,0)->(2,1)->(2,2)->(1,2)->(1,3)->(0,3)->(0,4)->(1,4) WALL
    // Let's find valid path: down, down, right, right, right(wall at 2,3), need alt route
    puzzle_move_path(&p, 1, 0);  // (1,0)
    puzzle_move_path(&p, 1, 0);  // (2,0)
    puzzle_move_path(&p, 0, 1);  // (2,1)
    puzzle_move_path(&p, 0, 1);  // (2,2)
    puzzle_move_path(&p, 1, 0);  // (3,2) - wall! won't move
    // Try: (2,2) -> down to (3,2) is wall. Go (2,1) -> (3,1)
    // Reset and navigate properly
    puzzle_init_path(&p, 4);
    puzzle_move_path(&p, 1, 0);  // (1,0)
    puzzle_move_path(&p, 1, 0);  // (2,0)
    puzzle_move_path(&p, 1, 0);  // (3,0) wall! won't move
    puzzle_move_path(&p, 0, 1);  // (2,1)
    puzzle_move_path(&p, 1, 0);  // (3,1)
    puzzle_move_path(&p, 1, 0);  // (4,1)
    puzzle_move_path(&p, 0, 1);  // (4,2)
    puzzle_move_path(&p, 0, 1);  // (4,3)
    puzzle_move_path(&p, 0, 1);  // (4,4) GOAL!
    TEST(puzzle_check_path(&p) == true);
    printf("should be solved when reaching goal\n");
}

// ===== Cipher Puzzle Tests =====
static void test_cipher_puzzle(void) {
    SECTION("Cipher Puzzle");

    Puzzle p;
    puzzle_init_cipher(&p, 5);

    TEST(p.type == PUZZLE_CIPHER);
    printf("type should be PUZZLE_CIPHER\n");

    TEST(p.cipher_shift == 3);
    printf("shift should be 3\n");

    TEST(strcmp(p.cipher_encoded, "KHOOR") == 0);
    printf("encoded should be KHOOR\n");

    TEST(strcmp(p.cipher_answer, "HELLO") == 0);
    printf("answer should be HELLO\n");

    // Empty input should not match
    TEST(puzzle_check_cipher(&p) == false);
    printf("empty input should not match\n");

    // Wrong input
    strcpy(p.cipher_input, "WORLD");
    TEST(puzzle_check_cipher(&p) == false);
    printf("wrong input WORLD should not match\n");

    // Correct input
    strcpy(p.cipher_input, "HELLO");
    TEST(puzzle_check_cipher(&p) == true);
    printf("correct input HELLO should match\n");
}

// ===== Puzzle Creation Tests =====
static void test_puzzle_create(void) {
    SECTION("Puzzle Creation");

    Puzzle p1 = puzzle_create(1);
    TEST(p1.type == PUZZLE_PATTERN);
    printf("room 1 should create pattern puzzle\n");

    Puzzle p2 = puzzle_create(2);
    TEST(p2.type == PUZZLE_SEQUENCE);
    printf("room 2 should create sequence puzzle\n");

    Puzzle p3 = puzzle_create(3);
    TEST(p3.type == PUZZLE_SWITCHES);
    printf("room 3 should create switches puzzle\n");

    Puzzle p4 = puzzle_create(4);
    TEST(p4.type == PUZZLE_PATH);
    printf("room 4 should create path puzzle\n");

    Puzzle p5 = puzzle_create(5);
    TEST(p5.type == PUZZLE_CIPHER);
    printf("room 5 should create cipher puzzle\n");

    // All start unsolved
    TEST(!p1.solved && !p2.solved && !p3.solved && !p4.solved && !p5.solved);
    printf("all puzzles should start unsolved\n");
}

// ===== Room Description Tests =====
static void test_room_descriptions(void) {
    SECTION("Room Descriptions");

    TEST(strlen(puzzle_get_room_name(1)) > 0);
    printf("room 1 should have a name\n");

    TEST(strlen(puzzle_get_room_name(5)) > 0);
    printf("room 5 should have a name\n");

    TEST(strlen(puzzle_get_room_name(0)) == 0);
    printf("room 0 should have empty name\n");

    TEST(strlen(puzzle_get_room_name(6)) == 0);
    printf("room 6 should have empty name\n");

    TEST(strlen(puzzle_get_room_desc(1)) > 0);
    printf("room 1 should have a description\n");

    TEST(strlen(puzzle_get_room_hint(1)) > 0);
    printf("room 1 should have a hint\n");

    for (int i = 1; i <= 5; i++) {
        TEST(strlen(puzzle_get_room_name(i)) > 0 &&
             strlen(puzzle_get_room_desc(i)) > 0 &&
             strlen(puzzle_get_room_hint(i)) > 0);
        printf("room %d should have name, desc, and hint\n", i);
    }
}

int main(void) {
    printf("\n\033[1m🧩 RonriRoom Test Suite\033[0m\n");

    test_pattern_puzzle();
    test_sequence_puzzle();
    test_switches_puzzle();
    test_path_puzzle();
    test_cipher_puzzle();
    test_puzzle_create();
    test_room_descriptions();

    printf("\n──────────────────────────────────────────────────\n");
    printf("\033[1m  Results: %d/%d passed\033[0m\n", passed, total);
    if (failed > 0) {
        printf("  \033[31m%d failed\033[0m\n", failed);
        return 1;
    } else {
        printf("  \033[32mAll tests passed! 🧩\033[0m\n");
    }
    printf("\n");
    return 0;
}
