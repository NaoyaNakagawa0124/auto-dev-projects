#ifndef PUZZLES_H
#define PUZZLES_H

#include <stdbool.h>

// Puzzle types
typedef enum {
    PUZZLE_PATTERN,     // Room 1: Find the pattern in a grid
    PUZZLE_SEQUENCE,    // Room 2: Complete the number sequence
    PUZZLE_SWITCHES,    // Room 3: Toggle switches to match target
    PUZZLE_PATH,        // Room 4: Find path through grid
    PUZZLE_CIPHER,      // Room 5: Decode the cipher
    PUZZLE_COUNT
} PuzzleType;

// Grid-based puzzle (used by most types)
#define GRID_MAX 6
#define SEQUENCE_MAX 8
#define SWITCHES_MAX 8

typedef struct {
    PuzzleType type;
    int room_number;        // 1-5

    // Pattern puzzle: select the cell that completes the pattern
    int grid[GRID_MAX][GRID_MAX];
    int grid_rows;
    int grid_cols;
    int answer_row;
    int answer_col;

    // Sequence puzzle: fill in the missing number
    int sequence[SEQUENCE_MAX];
    int sequence_len;
    int missing_index;
    int missing_answer;

    // Switches puzzle: toggle switches to match target state
    bool switches[SWITCHES_MAX];
    bool target[SWITCHES_MAX];
    int switch_count;
    // Toggle rules: toggling switch i also toggles linked[i] (or -1 for none)
    int linked[SWITCHES_MAX];

    // Path puzzle: navigate from start to goal on grid
    int path_start_r, path_start_c;
    int path_goal_r, path_goal_c;
    bool path_walls[GRID_MAX][GRID_MAX];
    int path_player_r, path_player_c;

    // Cipher puzzle: decode letters by shift
    int cipher_shift;
    char cipher_encoded[32];
    char cipher_answer[32];
    char cipher_input[32];
    int cipher_cursor;

    bool solved;
    int mistakes;
} Puzzle;

// Puzzle generation
void puzzle_init_pattern(Puzzle *p, int room);
void puzzle_init_sequence(Puzzle *p, int room);
void puzzle_init_switches(Puzzle *p, int room);
void puzzle_init_path(Puzzle *p, int room);
void puzzle_init_cipher(Puzzle *p, int room);
Puzzle puzzle_create(int room_number);

// Puzzle logic (pure functions, testable without Raylib)
bool puzzle_check_pattern(const Puzzle *p, int row, int col);
bool puzzle_check_sequence(const Puzzle *p, int answer);
bool puzzle_check_switches(const Puzzle *p);
bool puzzle_check_path(const Puzzle *p);
bool puzzle_check_cipher(const Puzzle *p);
void puzzle_toggle_switch(Puzzle *p, int index);
bool puzzle_move_path(Puzzle *p, int dr, int dc);

// Room descriptions (Japanese)
const char *puzzle_get_room_name(int room);
const char *puzzle_get_room_desc(int room);
const char *puzzle_get_room_hint(int room);

#endif
