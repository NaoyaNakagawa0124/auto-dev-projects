#ifndef RUNNER_H
#define RUNNER_H

#include "raylib.h"
#include <stdbool.h>

#define SCREEN_W 900
#define SCREEN_H 500
#define NUM_LANES 3
#define LANE_HEIGHT (SCREEN_H / NUM_LANES)
#define PLAYER_W 40
#define PLAYER_H 50
#define PLAYER_X 80

typedef struct {
    int lane;           /* 0, 1, 2 (top, mid, bottom) */
    float y;            /* actual y position (smooth) */
    float target_y;     /* target y for lane */
    bool boosting;
    float boost_timer;
    int hit_flash;      /* frames remaining for hit flash */
} Runner;

Runner runner_create(void);
void runner_update(Runner *r, float dt);
void runner_draw(const Runner *r);
void runner_move_up(Runner *r);
void runner_move_down(Runner *r);
void runner_boost(Runner *r);
Rectangle runner_rect(const Runner *r);
float runner_lane_y(int lane);

#endif
