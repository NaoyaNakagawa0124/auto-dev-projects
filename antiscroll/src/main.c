#include "raylib.h"
#include <stddef.h>
#include "runner.h"
#include "spawner.h"
#include "papers.h"
#include "scoring.h"
#include "ui.h"

int main(void)
{
    InitWindow(SCREEN_W, SCREEN_H, "AntiScroll - The Anti-Doomscroll Game");
    SetTargetFPS(60);

    PaperDB db = papers_init();
    Runner player = runner_create();
    Spawner spawner = spawner_create();
    Score score = score_create();
    GameState state = STATE_MENU;
    float scroll_offset = 0;
    float paper_flash_timer = 0;
    const char *flash_title = NULL;
    const char *flash_field = NULL;

    while (!WindowShouldClose()) {
        float dt = GetFrameTime();

        /* ── Input & Update ───────────────────────────────── */
        switch (state) {
        case STATE_MENU:
            if (IsKeyPressed(KEY_ENTER)) {
                player = runner_create();
                spawner = spawner_create();
                score = score_create();
                scroll_offset = 0;
                paper_flash_timer = 0;
                state = STATE_PLAYING;
            }
            break;

        case STATE_PLAYING:
            if (IsKeyPressed(KEY_ESCAPE)) { state = STATE_PAUSED; break; }

            /* Player input */
            if (IsKeyPressed(KEY_UP) || IsKeyPressed(KEY_W)) runner_move_up(&player);
            if (IsKeyPressed(KEY_DOWN) || IsKeyPressed(KEY_S)) runner_move_down(&player);
            if (IsKeyPressed(KEY_SPACE)) runner_boost(&player);

            runner_update(&player, dt);
            score.speed_mult = score_get_speed_mult(&score);
            spawner_update(&spawner, dt, score.speed_mult, &db);
            score_update_distance(&score, dt, spawner.base_speed);
            scroll_offset += spawner.base_speed * score.speed_mult * dt;

            /* Flash timer */
            if (paper_flash_timer > 0) paper_flash_timer -= dt;

            /* Collision loop */
            {
                Rectangle pr = runner_rect(&player);
                for (int i = 0; i < MAX_ENTITIES; i++) {
                    Entity *e = &spawner.entities[i];
                    if (!e->active) continue;
                    Rectangle er = {e->x, e->y, ENTITY_W, ENTITY_H};
                    if (!CheckCollisionRecs(pr, er)) continue;

                    if (e->type == ENT_PAPER) {
                        score_collect_paper(&score, e->paper_index,
                                            e->paper_title, e->paper_field);
                        flash_title = e->paper_title;
                        flash_field = e->paper_field;
                        paper_flash_timer = 2.0f;
                    } else if (e->type == ENT_DISTRACTION) {
                        score_hit_distraction(&score);
                        player.hit_flash = 15;
                    }
                    spawner_remove(&spawner, i);
                }
            }

            if (score_game_over(&score)) {
                state = STATE_GAMEOVER;
            }
            break;

        case STATE_PAUSED:
            if (IsKeyPressed(KEY_ESCAPE)) state = STATE_PLAYING;
            if (IsKeyPressed(KEY_Q)) state = STATE_MENU;
            break;

        case STATE_GAMEOVER:
            if (IsKeyPressed(KEY_ENTER)) state = STATE_MENU;
            break;
        }

        /* ── Drawing ──────────────────────────────────────── */
        BeginDrawing();

        switch (state) {
        case STATE_MENU:
            ui_draw_menu();
            break;

        case STATE_PLAYING:
            ui_draw_background(scroll_offset);
            ui_draw_lanes();
            spawner_draw(&spawner);
            runner_draw(&player);
            ui_draw_hud(&score, score.speed_mult);
            ui_draw_paper_flash(flash_title, flash_field, paper_flash_timer);
            break;

        case STATE_PAUSED:
            ui_draw_background(scroll_offset);
            ui_draw_lanes();
            spawner_draw(&spawner);
            runner_draw(&player);
            ui_draw_paused();
            break;

        case STATE_GAMEOVER:
            ui_draw_gameover(&score);
            break;
        }

        EndDrawing();
    }

    CloseWindow();
    return 0;
}
