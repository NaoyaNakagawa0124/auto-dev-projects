#include "raylib.h"
#include <stdlib.h>
#include <time.h>

#include "game.h"

void render_init(void);
void render_unload(void);
void render_frame(const Game *g, float reveal_t);

int main(void) {
    SetConfigFlags(FLAG_MSAA_4X_HINT | FLAG_WINDOW_HIGHDPI);
    InitWindow(1280, 720, "映画市場 — eiga-ichiba");
    SetTargetFPS(60);
    SetExitKey(KEY_F12); /* Don't quit on ESC silently; user picks via Game Over screen */

    render_init();

    Game game;
    game_init(&game, (uint32_t)time(NULL));

    float reveal_t = 0.0f;

    while (!WindowShouldClose()) {
        float dt = GetFrameTime();
        /* Input handling */
        if (game.phase == PHASE_TITLE) {
            if (IsKeyPressed(KEY_ENTER)) game_advance(&game);
        } else if (game.phase == PHASE_PREVIEW) {
            if (IsKeyPressed(KEY_ENTER)) game_advance(&game);
        } else if (game.phase == PHASE_ALLOC_P1 || game.phase == PHASE_ALLOC_P2) {
            int cur = game.players[game.current_player].alloc_pct;
            if (IsKeyPressed(KEY_RIGHT) || IsKeyPressed(KEY_UP)) {
                game_set_alloc(&game, cur + 25);
            } else if (IsKeyPressed(KEY_LEFT) || IsKeyPressed(KEY_DOWN)) {
                game_set_alloc(&game, cur - 25);
            } else if (IsKeyPressed(KEY_ZERO)) {
                game_set_alloc(&game, 0);
            } else if (IsKeyPressed(KEY_ONE)) {
                game_set_alloc(&game, 25);
            } else if (IsKeyPressed(KEY_TWO)) {
                game_set_alloc(&game, 50);
            } else if (IsKeyPressed(KEY_THREE)) {
                game_set_alloc(&game, 75);
            } else if (IsKeyPressed(KEY_FOUR)) {
                game_set_alloc(&game, 100);
            } else if (IsKeyPressed(KEY_ENTER)) {
                game_advance(&game);
                reveal_t = 0.0f;
            }
        } else if (game.phase == PHASE_HANDOFF) {
            if (IsKeyPressed(KEY_ENTER)) game_advance(&game);
        } else if (game.phase == PHASE_REVEAL) {
            reveal_t += dt * 1.4f;
            if (reveal_t > 1.0f) reveal_t = 1.0f;
            if (IsKeyPressed(KEY_ENTER) && reveal_t >= 0.6f) {
                game_advance(&game);
            }
        } else if (game.phase == PHASE_MONTH_RESULT) {
            if (IsKeyPressed(KEY_ENTER)) game_advance(&game);
        } else if (game.phase == PHASE_GAME_OVER) {
            if (IsKeyPressed(KEY_R)) {
                game_init(&game, (uint32_t)time(NULL));
            }
            if (IsKeyPressed(KEY_ESCAPE)) {
                break;
            }
        }

        render_frame(&game, reveal_t);
    }

    render_unload();
    CloseWindow();
    return 0;
}
