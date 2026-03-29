#include "puzzles.h"
#include <string.h>
#include <stdlib.h>

// ===== Room descriptions (Japanese) =====

static const char *room_names[] = {
    "Room 1: The empty room (placeholder)",
    "\xe7\xac\xac\x31\xe5\xae\xa4: \xe3\x83\x91\xe3\x82\xbf\xe3\x83\xbc\xe3\x83\xb3\xe8\xaa\x8d\xe8\xad\x98",  // 第1室: パターン認識
    "\xe7\xac\xac\x32\xe5\xae\xa4: \xe6\x95\xb0\xe5\x88\x97\xe3\x81\xae\xe8\xac\x8e",  // 第2室: 数列の謎
    "\xe7\xac\xac\x33\xe5\xae\xa4: \xe3\x82\xb9\xe3\x82\xa4\xe3\x83\x83\xe3\x83\x81\xe3\x83\x91\xe3\x82\xba\xe3\x83\xab",  // 第3室: スイッチパズル
    "\xe7\xac\xac\x34\xe5\xae\xa4: \xe8\xbf\xb7\xe8\xb7\xaf\xe8\x84\xb1\xe5\x87\xba",  // 第4室: 迷路脱出
    "\xe7\xac\xac\x35\xe5\xae\xa4: \xe6\x9a\x97\xe5\x8f\xb7\xe8\xa7\xa3\xe8\xaa\xad",  // 第5室: 暗号解読
};

static const char *room_descs[] = {
    "(placeholder)",
    "Grid no naka kara pattern wo mitsukete, kaketa cell wo erabe.",
    "Suuji no kisoku wo mitsukete, ? ni hairu kazu wo atero.",
    "Switch wo kirikae, target no joutai ni awasero. Renketsu switch ni chuui!",
    "Start kara Goal made no michi wo sagase. Kabe ni butsukaru na!",
    "Angou wo tokiakase. Moji wo shift sasete, kotae wo nyuuryoku seyo.",
};

static const char *room_hints[] = {
    "(placeholder)",
    "Hint: Look at rows and columns for a pattern.",
    "Hint: Try +2, x2, or fibonacci-like rules.",
    "Hint: Some switches are linked - toggling one toggles another!",
    "Hint: Use arrow keys to move. Backtracking is ok.",
    "Hint: Caesar cipher - each letter is shifted by a fixed amount.",
};

const char *puzzle_get_room_name(int room) {
    if (room < 1 || room > 5) return "";
    return room_names[room];
}

const char *puzzle_get_room_desc(int room) {
    if (room < 1 || room > 5) return "";
    return room_descs[room];
}

const char *puzzle_get_room_hint(int room) {
    if (room < 1 || room > 5) return "";
    return room_hints[room];
}

// ===== Puzzle initialization =====

void puzzle_init_pattern(Puzzle *p, int room) {
    memset(p, 0, sizeof(Puzzle));
    p->type = PUZZLE_PATTERN;
    p->room_number = room;
    p->grid_rows = 4;
    p->grid_cols = 4;

    // Pattern: each row sums to 10, find the missing cell
    // Row 0: 1 2 3 4
    // Row 1: 2 3 4 1
    // Row 2: 3 4 1 2
    // Row 3: 4 1 2 ?  (answer: 3)
    int pattern[4][4] = {
        {1, 2, 3, 4},
        {2, 3, 4, 1},
        {3, 4, 1, 2},
        {4, 1, 2, 0},  // 0 = missing
    };
    for (int r = 0; r < 4; r++)
        for (int c = 0; c < 4; c++)
            p->grid[r][c] = pattern[r][c];

    p->answer_row = 3;
    p->answer_col = 3;
    // The answer value is 3 (stored in grid as 0, player selects from options)
}

void puzzle_init_sequence(Puzzle *p, int room) {
    memset(p, 0, sizeof(Puzzle));
    p->type = PUZZLE_SEQUENCE;
    p->room_number = room;

    // Fibonacci-like: 1, 1, 2, 3, 5, 8, ?, 21
    int seq[] = {1, 1, 2, 3, 5, 8, 0, 21};
    p->sequence_len = 8;
    for (int i = 0; i < 8; i++) p->sequence[i] = seq[i];
    p->missing_index = 6;
    p->missing_answer = 13;
}

void puzzle_init_switches(Puzzle *p, int room) {
    memset(p, 0, sizeof(Puzzle));
    p->type = PUZZLE_SWITCHES;
    p->room_number = room;
    p->switch_count = 6;

    // Initial state: all off
    for (int i = 0; i < 6; i++) {
        p->switches[i] = false;
        p->linked[i] = -1;
    }

    // Target: specific pattern
    bool tgt[] = {true, false, true, false, true, false};
    for (int i = 0; i < 6; i++) p->target[i] = tgt[i];

    // Links: switch 0 also toggles 1, switch 2 also toggles 3, switch 4 also toggles 5
    p->linked[0] = 1;
    p->linked[2] = 3;
    p->linked[4] = 5;
}

void puzzle_init_path(Puzzle *p, int room) {
    memset(p, 0, sizeof(Puzzle));
    p->type = PUZZLE_PATH;
    p->room_number = room;
    p->grid_rows = 5;
    p->grid_cols = 5;

    // Start at (0,0), Goal at (4,4)
    p->path_start_r = 0;
    p->path_start_c = 0;
    p->path_goal_r = 4;
    p->path_goal_c = 4;
    p->path_player_r = 0;
    p->path_player_c = 0;

    // Walls
    bool walls[5][5] = {
        {false, false, true,  false, false},
        {false, true,  false, false, true },
        {false, false, false, true,  false},
        {true,  false, true,  false, false},
        {false, false, false, false, false},
    };
    for (int r = 0; r < 5; r++)
        for (int c = 0; c < 5; c++)
            p->path_walls[r][c] = walls[r][c];
}

void puzzle_init_cipher(Puzzle *p, int room) {
    memset(p, 0, sizeof(Puzzle));
    p->type = PUZZLE_CIPHER;
    p->room_number = room;

    // Caesar cipher: shift by 3
    // "HELLO" -> "KHOOR"
    p->cipher_shift = 3;
    strcpy(p->cipher_encoded, "KHOOR");
    strcpy(p->cipher_answer, "HELLO");
    memset(p->cipher_input, 0, sizeof(p->cipher_input));
    p->cipher_cursor = 0;
}

Puzzle puzzle_create(int room_number) {
    Puzzle p;
    memset(&p, 0, sizeof(Puzzle));
    switch (room_number) {
        case 1: puzzle_init_pattern(&p, room_number); break;
        case 2: puzzle_init_sequence(&p, room_number); break;
        case 3: puzzle_init_switches(&p, room_number); break;
        case 4: puzzle_init_path(&p, room_number); break;
        case 5: puzzle_init_cipher(&p, room_number); break;
        default: break;
    }
    return p;
}

// ===== Puzzle logic =====

bool puzzle_check_pattern(const Puzzle *p, int row, int col) {
    (void)row; (void)col;
    // The pattern: each row is a rotation of {1,2,3,4}
    // Row 3 should be {4,1,2,3}, so answer is 3
    return (row == p->answer_row && col == p->answer_col);
}

bool puzzle_check_sequence(const Puzzle *p, int answer) {
    return answer == p->missing_answer;
}

bool puzzle_check_switches(const Puzzle *p) {
    for (int i = 0; i < p->switch_count; i++) {
        if (p->switches[i] != p->target[i]) return false;
    }
    return true;
}

bool puzzle_check_path(const Puzzle *p) {
    return (p->path_player_r == p->path_goal_r &&
            p->path_player_c == p->path_goal_c);
}

bool puzzle_check_cipher(const Puzzle *p) {
    return strcmp(p->cipher_input, p->cipher_answer) == 0;
}

void puzzle_toggle_switch(Puzzle *p, int index) {
    if (index < 0 || index >= p->switch_count) return;
    p->switches[index] = !p->switches[index];
    if (p->linked[index] >= 0 && p->linked[index] < p->switch_count) {
        p->switches[p->linked[index]] = !p->switches[p->linked[index]];
    }
}

bool puzzle_move_path(Puzzle *p, int dr, int dc) {
    int nr = p->path_player_r + dr;
    int nc = p->path_player_c + dc;

    // Bounds check
    if (nr < 0 || nr >= p->grid_rows || nc < 0 || nc >= p->grid_cols) return false;
    // Wall check
    if (p->path_walls[nr][nc]) return false;

    p->path_player_r = nr;
    p->path_player_c = nc;
    return true;
}
