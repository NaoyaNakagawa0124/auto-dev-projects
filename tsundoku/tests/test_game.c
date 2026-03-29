#include <stdio.h>
#include <string.h>
#include <stdbool.h>
#include <stdlib.h>
#include <time.h>
#include "../src/piece.h"
#include "../src/board.h"
#include "../src/game.h"

static int total = 0, passed = 0, failed = 0;

#define TEST(cond) do { \
    total++; printf("    "); \
    if (cond) { passed++; printf("\033[32m✓\033[0m "); } \
    else { failed++; printf("\033[31m✗\033[0m "); } \
} while(0)

#define SECTION(name) printf("\n  \033[1m%s\033[0m\n", name)

static void test_piece(void) {
    SECTION("Piece");

    Piece p;
    piece_init(&p, 0, GENRE_FICTION);
    TEST(p.type == 0);
    printf("type 0 should be Tankobon\n");

    TEST(piece_cell_filled(&p, 0, 0));
    printf("cell (0,0) should be filled\n");

    TEST(piece_cell_filled(&p, 1, 0));
    printf("cell (1,0) should be filled (1x2 vertical)\n");

    TEST(!piece_cell_filled(&p, 0, 1));
    printf("cell (0,1) should be empty\n");

    TEST(piece_width(&p) == 1);
    printf("width should be 1\n");

    TEST(piece_height(&p) == 2);
    printf("height should be 2\n");

    // Type 2: 2x2 square
    piece_init(&p, 2, GENRE_SCIENCE);
    TEST(piece_width(&p) == 2 && piece_height(&p) == 2);
    printf("manga set should be 2x2\n");

    // Type 4: 3x1 horizontal
    piece_init(&p, 4, GENRE_HISTORY);
    TEST(piece_width(&p) == 3 && piece_height(&p) == 1);
    printf("art book should be 3x1\n");

    // Type 5: 1x1
    piece_init(&p, 5, GENRE_FANTASY);
    TEST(piece_width(&p) == 1 && piece_height(&p) == 1);
    printf("pocket book should be 1x1\n");

    // Rotation
    piece_init(&p, 0, GENRE_FICTION); // 1x2 vertical
    int w_before = piece_width(&p);
    int h_before = piece_height(&p);
    piece_rotate(&p);
    // After rotation, width and height swap (or close to it)
    TEST(piece_width(&p) >= 1 && piece_height(&p) >= 1);
    printf("rotated piece should have valid dimensions (was %dx%d)\n", w_before, h_before);

    // Rotate back
    piece_rotate_back(&p);
    TEST(piece_width(&p) == 1 && piece_height(&p) == 2);
    printf("rotate back should restore 1x2\n");

    // Full rotation cycle
    piece_init(&p, 3, GENRE_MYSTERY);
    int orig[PIECE_GRID][PIECE_GRID];
    memcpy(orig, p.cells, sizeof(orig));
    for (int i = 0; i < 4; i++) piece_rotate(&p);
    TEST(memcmp(orig, p.cells, sizeof(orig)) == 0);
    printf("4 rotations should return to original\n");

    // Random piece
    srand(42);
    Piece rp = piece_random();
    TEST(rp.type >= 0 && rp.type < PIECE_TYPE_COUNT);
    printf("random piece should have valid type\n");

    TEST(rp.genre >= 1 && rp.genre <= 7);
    printf("random piece should have valid genre\n");

    // Type name
    TEST(piece_type_name(0) != NULL && strlen(piece_type_name(0)) > 0);
    printf("type 0 should have a name\n");

    TEST(strlen(piece_type_name(99)) > 0);
    printf("invalid type should return something\n");
}

static void test_board(void) {
    SECTION("Board");

    Board b;
    board_init(&b);

    TEST(b.score == 0 && b.lines_cleared == 0);
    printf("should start with 0 score and 0 lines\n");

    // Piece should fit on empty board
    Piece p;
    piece_init(&p, 5, GENRE_FICTION); // 1x1
    p.x = 5; p.y = 18;
    TEST(board_piece_fits(&b, &p));
    printf("1x1 piece should fit on empty board\n");

    // Out of bounds right
    p.x = BOARD_W; p.y = 10;
    TEST(!board_piece_fits(&b, &p));
    printf("piece out of right bound should not fit\n");

    // Out of bounds bottom
    p.x = 5; p.y = BOARD_ROWS;
    TEST(!board_piece_fits(&b, &p));
    printf("piece out of bottom should not fit\n");

    // Place piece
    p.x = 5; p.y = 18;
    board_place_piece(&b, &p);
    TEST(b.cells[18][5] != 0);
    printf("placed piece should fill cell\n");

    TEST(b.books_placed == 1);
    printf("books placed should be 1\n");

    // Collision
    Piece p2;
    piece_init(&p2, 5, GENRE_SCIENCE);
    p2.x = 5; p2.y = 18;
    TEST(!board_piece_fits(&b, &p2));
    printf("should not fit where piece already exists\n");

    // Column height
    TEST(board_column_height(&b, 5) == 2); // row 18 = height 2 from bottom
    printf("column 5 height should be 2\n");

    TEST(board_column_height(&b, 0) == 0);
    printf("empty column should have height 0\n");

    // Game over check
    TEST(!board_is_game_over(&b));
    printf("should not be game over initially\n");

    // Fill top row for game over
    for (int c = 0; c < BOARD_W; c++) b.cells[0][c] = 1;
    TEST(board_is_game_over(&b));
    printf("should be game over when top row is filled\n");
}

static void test_line_clearing(void) {
    SECTION("Line Clearing");

    Board b;
    board_init(&b);

    // Fill bottom row completely
    for (int c = 0; c < BOARD_W; c++) {
        b.cells[BOARD_ROWS - 1][c] = GENRE_FICTION;
    }

    int cleared = board_clear_lines(&b);
    TEST(cleared == 1);
    printf("should clear 1 line\n");

    TEST(b.lines_cleared == 1);
    printf("total lines should be 1\n");

    TEST(b.score > 0);
    printf("score should increase\n");

    // Row should be empty after clearing
    bool row_empty = true;
    for (int c = 0; c < BOARD_W; c++) {
        if (b.cells[BOARD_ROWS - 1][c] != 0) row_empty = false;
    }
    TEST(row_empty);
    printf("cleared row should be empty\n");

    // No lines to clear
    board_init(&b);
    cleared = board_clear_lines(&b);
    TEST(cleared == 0);
    printf("should clear 0 on empty board\n");

    // Double line clear
    board_init(&b);
    for (int c = 0; c < BOARD_W; c++) {
        b.cells[BOARD_ROWS - 1][c] = 1;
        b.cells[BOARD_ROWS - 2][c] = 2;
    }
    cleared = board_clear_lines(&b);
    TEST(cleared == 2);
    printf("should clear 2 lines\n");
}

static void test_scoring(void) {
    SECTION("Scoring");

    TEST(board_calc_line_score(1, 0) == 100);
    printf("single line level 0 = 100\n");

    TEST(board_calc_line_score(2, 0) == 300);
    printf("double line level 0 = 300\n");

    TEST(board_calc_line_score(4, 0) == 800);
    printf("quad line level 0 = 800\n");

    TEST(board_calc_line_score(1, 1) == 200);
    printf("single line level 1 = 200\n");

    TEST(board_calc_line_score(4, 2) == 2400);
    printf("quad line level 2 = 2400\n");

    // Level calculation
    TEST(board_calc_level(0) == 0);
    printf("0 lines = level 0\n");

    TEST(board_calc_level(10) == 1);
    printf("10 lines = level 1\n");

    TEST(board_calc_level(25) == 2);
    printf("25 lines = level 2\n");
}

static void test_game(void) {
    SECTION("Game Logic");

    Game g;
    game_init(&g);
    TEST(g.state == GSTATE_TITLE);
    printf("should start in title state\n");

    TEST(g.round == 0);
    printf("should start at round 0\n");

    // Start round
    srand(42);
    game_start_round(&g);
    TEST(g.state == GSTATE_PLAYING);
    printf("should be playing after start\n");

    TEST(g.round == 1);
    printf("should be round 1\n");

    // Move
    int orig_x = g.current.x;
    game_move(&g, 1);
    TEST(g.current.x == orig_x + 1);
    printf("move right should work\n");

    game_move(&g, -1);
    TEST(g.current.x == orig_x);
    printf("move left should work\n");

    // Move to wall
    for (int i = 0; i < 20; i++) game_move(&g, -1);
    TEST(g.current.x >= 0);
    printf("should not move past left wall\n");

    for (int i = 0; i < 20; i++) game_move(&g, 1);
    TEST(g.current.x + piece_width(&g.current) <= BOARD_W);
    printf("should not move past right wall\n");

    // Drop interval
    float fast = game_drop_interval(10);
    float slow = game_drop_interval(0);
    TEST(fast < slow);
    printf("higher level should have faster drop\n");

    TEST(game_drop_interval(100) >= 0.1f);
    printf("drop interval should have minimum\n");

    // Grade
    TEST(strcmp(game_grade(10000), "S") == 0);
    printf("10000+ should be S grade\n");

    TEST(strcmp(game_grade(500), "F") == 0);
    printf("500 should be F grade\n");

    TEST(strlen(game_grade_label(5000)) > 0);
    printf("grade label should have text\n");

    // Final round check
    g.round = MAX_ROUNDS;
    TEST(game_is_final_round(&g));
    printf("round 3 should be final\n");

    g.round = 1;
    TEST(!game_is_final_round(&g));
    printf("round 1 should not be final\n");

    // Total score
    g.round_scores[0] = 100;
    g.round_scores[1] = 200;
    g.round_scores[2] = 300;
    g.state = GSTATE_GAME_OVER;
    TEST(game_total_score(&g) == 600);
    printf("total score should sum all rounds\n");
}

int main(void) {
    printf("\n\033[1m📚 TsunDoku Test Suite\033[0m\n");

    test_piece();
    test_board();
    test_line_clearing();
    test_scoring();
    test_game();

    printf("\n──────────────────────────────────────────────────\n");
    printf("\033[1m  Results: %d/%d passed\033[0m\n", passed, total);
    if (failed > 0) {
        printf("  \033[31m%d failed\033[0m\n", failed);
        return 1;
    }
    printf("  \033[32mAll tests passed! 📚\033[0m\n\n");
    return 0;
}
