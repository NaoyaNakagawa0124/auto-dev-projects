#include "raylib.h"
#include "game.h"
#include "ui.h"

#define SCREEN_W 900
#define SCREEN_H 520

int main(void)
{
    InitWindow(SCREEN_W, SCREEN_H, "CramSleuths - Co-op Detective Game");
    SetTargetFPS(60);

    Game game = game_create();

    while (!WindowShouldClose()) {
        float dt = GetFrameTime();
        game_update(&game, dt);

        BeginDrawing();

        switch (game.state) {
        case STATE_MENU:
            ui_draw_menu();
            break;

        case STATE_INTRO:
            ui_draw_intro(&game);
            break;

        case STATE_PLAYING:
            /* Draw room (in the left 640px) */
            room_draw(&game.rooms[game.current_room]);
            /* Draw players */
            player_draw(&game.players[0]);
            player_draw(&game.players[1]);
            /* HUD overlay */
            ui_draw_hud(&game);
            /* Sidebar inventory */
            ui_draw_inventory(&game);
            break;

        case STATE_DEDUCTION:
            ui_draw_deduction(&game);
            break;

        case STATE_WIN:
            ui_draw_win(&game);
            break;

        case STATE_LOSE:
            ui_draw_lose(&game);
            break;
        }

        EndDrawing();
    }

    CloseWindow();
    return 0;
}
