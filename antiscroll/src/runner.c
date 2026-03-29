#include "runner.h"
#include <math.h>

float runner_lane_y(int lane)
{
    return (float)lane * LANE_HEIGHT + (LANE_HEIGHT - PLAYER_H) / 2.0f + 20;
}

Runner runner_create(void)
{
    Runner r = {0};
    r.lane = 1;
    r.y = runner_lane_y(1);
    r.target_y = r.y;
    r.boosting = false;
    r.boost_timer = 0;
    r.hit_flash = 0;
    return r;
}

void runner_move_up(Runner *r)
{
    if (r->lane > 0) {
        r->lane--;
        r->target_y = runner_lane_y(r->lane);
    }
}

void runner_move_down(Runner *r)
{
    if (r->lane < NUM_LANES - 1) {
        r->lane++;
        r->target_y = runner_lane_y(r->lane);
    }
}

void runner_boost(Runner *r)
{
    if (r->boost_timer <= 0) {
        r->boosting = true;
        r->boost_timer = 0.3f;
    }
}

void runner_update(Runner *r, float dt)
{
    /* Smooth lane transition */
    float diff = r->target_y - r->y;
    if (fabsf(diff) > 1.0f) {
        r->y += diff * 10.0f * dt;
    } else {
        r->y = r->target_y;
    }

    /* Boost timer */
    if (r->boost_timer > 0) {
        r->boost_timer -= dt;
        if (r->boost_timer <= 0) {
            r->boosting = false;
        }
    }

    /* Hit flash */
    if (r->hit_flash > 0) r->hit_flash--;
}

void runner_draw(const Runner *r)
{
    Color body_col = r->hit_flash > 0
        ? RED
        : (r->boosting ? (Color){100, 220, 255, 255} : (Color){60, 180, 120, 255});

    float x = PLAYER_X;
    float y = r->y;

    /* Body */
    DrawRectangleRounded((Rectangle){x, y, PLAYER_W, PLAYER_H}, 0.3f, 4, body_col);
    /* Head */
    DrawCircle((int)(x + PLAYER_W / 2), (int)(y - 8), 12, body_col);
    /* Eyes */
    DrawCircle((int)(x + PLAYER_W / 2 + 4), (int)(y - 10), 2, WHITE);
    /* Book in hand */
    DrawRectangle((int)(x + PLAYER_W - 5), (int)(y + 10), 14, 10, (Color){240, 220, 150, 255});

    /* Boost trail */
    if (r->boosting) {
        for (int i = 1; i <= 3; i++) {
            DrawCircle((int)(x - i * 12), (int)(y + PLAYER_H / 2),
                       (float)(6 - i), (Color){100, 220, 255, (unsigned char)(100 - i * 30)});
        }
    }
}

Rectangle runner_rect(const Runner *r)
{
    return (Rectangle){PLAYER_X, r->y, PLAYER_W, PLAYER_H};
}
