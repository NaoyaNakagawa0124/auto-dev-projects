#include "raylib.h"
#include "game.h"
#include "ui.h"
#include <stdlib.h>
#include <time.h>

static Game game;

int main(void) {
    srand((unsigned)time(NULL));
    InitWindow(SCREEN_W, SCREEN_H, "TsunDoku - Book Stacking Puzzle");
    SetTargetFPS(60);

    game_init(&game);

    while (!WindowShouldClose()) {
        float dt = GetFrameTime();

        // Input
        switch (game.state) {
            case GSTATE_TITLE:
                if (IsKeyPressed(KEY_ENTER) || IsKeyPressed(KEY_SPACE)) {
                    game.round = 0;
                    for (int i = 0; i < MAX_ROUNDS; i++) game.round_scores[i] = 0;
                    game.total_time = 0;
                    game_start_round(&game);
                }
                break;

            case GSTATE_PLAYING:
                game_tick(&game, dt);
                if (IsKeyPressed(KEY_LEFT))  game_move(&game, -1);
                if (IsKeyPressed(KEY_RIGHT)) game_move(&game, 1);
                if (IsKeyPressed(KEY_DOWN))  game_drop(&game);
                if (IsKeyPressed(KEY_SPACE)) game_hard_drop(&game);
                if (IsKeyPressed(KEY_Z) || IsKeyPressed(KEY_UP)) game_rotate(&game);
                if (IsKeyPressed(KEY_P)) game.state = GSTATE_PAUSED;

                // Soft drop repeat
                if (IsKeyDown(KEY_DOWN)) {
                    game.drop_timer += dt * 8.0f;
                }
                break;

            case GSTATE_PAUSED:
                if (IsKeyPressed(KEY_P) || IsKeyPressed(KEY_ESCAPE)) {
                    game.state = GSTATE_PLAYING;
                }
                break;

            case GSTATE_ROUND_END:
                if (IsKeyPressed(KEY_ENTER) || IsKeyPressed(KEY_SPACE)) {
                    if (game.round < MAX_ROUNDS) {
                        game_start_round(&game);
                    } else {
                        game.state = GSTATE_GAME_OVER;
                    }
                }
                break;

            case GSTATE_GAME_OVER:
                if (IsKeyPressed(KEY_ENTER) || IsKeyPressed(KEY_SPACE)) {
                    game_init(&game);
                }
                break;
        }

        // Draw
        BeginDrawing();
        switch (game.state) {
            case GSTATE_TITLE:     ui_draw_title(&game); break;
            case GSTATE_PLAYING:   ui_draw_playing(&game); break;
            case GSTATE_PAUSED:
                ui_draw_playing(&game);
                DrawRectangle(0, 0, SCREEN_W, SCREEN_H, (Color){0, 0, 0, 150});
                {
                    const char *t = "PAUSE";
                    int w = MeasureText(t, 40);
                    DrawText(t, (SCREEN_W - w) / 2, SCREEN_H / 2 - 20, 40, (Color){255, 255, 255, 255});
                }
                break;
            case GSTATE_ROUND_END: ui_draw_round_end(&game); break;
            case GSTATE_GAME_OVER: ui_draw_game_over(&game); break;
        }
        EndDrawing();
    }

    CloseWindow();
    return 0;
}
