#include "raylib.h"
#include "game.h"
#include "ui.h"
#include <string.h>

static Game game;

static void handle_title_input(void) {
    if (IsKeyPressed(KEY_ENTER) || IsKeyPressed(KEY_SPACE)) {
        game_start_room(&game, 1);
    }
}

static void handle_story_input(void) {
    if (IsKeyPressed(KEY_ENTER) || IsKeyPressed(KEY_SPACE)) {
        game.state = STATE_PLAYING;
    }
}

static void handle_pattern_input(void) {
    Puzzle *p = &game.puzzle;
    if (IsKeyPressed(KEY_UP) && game.cursor_row > 0) game.cursor_row--;
    if (IsKeyPressed(KEY_DOWN) && game.cursor_row < p->grid_rows - 1) game.cursor_row++;
    if (IsKeyPressed(KEY_LEFT) && game.cursor_col > 0) game.cursor_col--;
    if (IsKeyPressed(KEY_RIGHT) && game.cursor_col < p->grid_cols - 1) game.cursor_col++;

    if (IsKeyPressed(KEY_ENTER)) {
        if (puzzle_check_pattern(p, game.cursor_row, game.cursor_col)) {
            p->solved = true;
            game.state = STATE_SOLVED;
        } else {
            p->mistakes++;
            game.total_mistakes++;
            game.show_wrong = true;
            game.wrong_timer = 0.5f;
        }
    }
}

static void handle_sequence_input(void) {
    Puzzle *p = &game.puzzle;
    if (IsKeyPressed(KEY_UP)) game.selected_answer++;
    if (IsKeyPressed(KEY_DOWN)) game.selected_answer--;
    if (game.selected_answer < 0) game.selected_answer = 0;
    if (game.selected_answer > 999) game.selected_answer = 999;

    if (IsKeyPressed(KEY_ENTER)) {
        if (puzzle_check_sequence(p, game.selected_answer)) {
            p->solved = true;
            game.state = STATE_SOLVED;
        } else {
            p->mistakes++;
            game.total_mistakes++;
            game.show_wrong = true;
            game.wrong_timer = 0.5f;
        }
    }
}

static void handle_switches_input(void) {
    Puzzle *p = &game.puzzle;
    if (IsKeyPressed(KEY_LEFT) && game.cursor_col > 0) game.cursor_col--;
    if (IsKeyPressed(KEY_RIGHT) && game.cursor_col < p->switch_count - 1) game.cursor_col++;

    if (IsKeyPressed(KEY_ENTER) || IsKeyPressed(KEY_SPACE)) {
        puzzle_toggle_switch(p, game.cursor_col);
        if (puzzle_check_switches(p)) {
            p->solved = true;
            game.state = STATE_SOLVED;
        }
    }
}

static void handle_path_input(void) {
    Puzzle *p = &game.puzzle;
    bool moved = false;
    if (IsKeyPressed(KEY_UP))    moved = puzzle_move_path(p, -1, 0);
    if (IsKeyPressed(KEY_DOWN))  moved = puzzle_move_path(p, 1, 0);
    if (IsKeyPressed(KEY_LEFT))  moved = puzzle_move_path(p, 0, -1);
    if (IsKeyPressed(KEY_RIGHT)) moved = puzzle_move_path(p, 0, 1);

    (void)moved;

    if (puzzle_check_path(p)) {
        p->solved = true;
        game.state = STATE_SOLVED;
    }
}

static void handle_cipher_input(void) {
    Puzzle *p = &game.puzzle;
    int max_len = (int)strlen(p->cipher_encoded);

    // Letter input
    for (int key = KEY_A; key <= KEY_Z; key++) {
        if (IsKeyPressed(key) && p->cipher_cursor < max_len) {
            p->cipher_input[p->cipher_cursor] = (char)('A' + (key - KEY_A));
            p->cipher_cursor++;
            p->cipher_input[p->cipher_cursor] = '\0';
        }
    }

    // Backspace
    if (IsKeyPressed(KEY_BACKSPACE) && p->cipher_cursor > 0) {
        p->cipher_cursor--;
        p->cipher_input[p->cipher_cursor] = '\0';
    }

    // Check
    if (IsKeyPressed(KEY_ENTER) && p->cipher_cursor == max_len) {
        if (puzzle_check_cipher(p)) {
            p->solved = true;
            game.state = STATE_SOLVED;
        } else {
            p->mistakes++;
            game.total_mistakes++;
            game.show_wrong = true;
            game.wrong_timer = 0.5f;
        }
    }
}

static void handle_playing_input(void) {
    // Hint toggle
    if (IsKeyPressed(KEY_H)) {
        game.show_hint = !game.show_hint;
    }

    switch (game.puzzle.type) {
        case PUZZLE_PATTERN:  handle_pattern_input(); break;
        case PUZZLE_SEQUENCE: handle_sequence_input(); break;
        case PUZZLE_SWITCHES: handle_switches_input(); break;
        case PUZZLE_PATH:     handle_path_input(); break;
        case PUZZLE_CIPHER:   handle_cipher_input(); break;
        default: break;
    }
}

static void handle_solved_input(void) {
    if (IsKeyPressed(KEY_ENTER) || IsKeyPressed(KEY_SPACE)) {
        game.total_time += game.room_time;
        game_next_room(&game);
    }
}

static void handle_complete_input(void) {
    if (IsKeyPressed(KEY_ENTER) || IsKeyPressed(KEY_SPACE)) {
        game_init(&game);
    }
}

int main(void) {
    InitWindow(SCREEN_W, SCREEN_H, "RonriRoom - Logic Room");
    SetTargetFPS(60);

    game_init(&game);

    while (!WindowShouldClose()) {
        float dt = GetFrameTime();

        // Update
        if (game.state == STATE_PLAYING) {
            game.room_time += dt;
            if (game.show_wrong) {
                game.wrong_timer -= dt;
                if (game.wrong_timer <= 0) game.show_wrong = false;
            }
        }

        // Input
        switch (game.state) {
            case STATE_TITLE:    handle_title_input(); break;
            case STATE_STORY:    handle_story_input(); break;
            case STATE_PLAYING:  handle_playing_input(); break;
            case STATE_SOLVED:   handle_solved_input(); break;
            case STATE_COMPLETE: handle_complete_input(); break;
        }

        // Draw
        BeginDrawing();
        switch (game.state) {
            case STATE_TITLE:    ui_draw_title(&game); break;
            case STATE_STORY:    ui_draw_story(&game); break;
            case STATE_PLAYING:  ui_draw_puzzle(&game); break;
            case STATE_SOLVED:   ui_draw_solved(&game); break;
            case STATE_COMPLETE: ui_draw_complete(&game); break;
        }
        EndDrawing();
    }

    CloseWindow();
    return 0;
}
