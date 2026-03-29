#include "player.h"
#include <math.h>

Player player_create(int id, Vector2 start_pos)
{
    Player p = {0};
    p.id = id;
    p.pos = start_pos;
    p.color = (id == 0) ? (Color){80, 140, 240, 255} : (Color){240, 90, 90, 255};
    p.size = PLAYER_SIZE;
    p.speed = PLAYER_SPEED;
    p.clue_count = 0;
    p.interacting = false;
    return p;
}

void player_update(Player *p, float dt)
{
    Vector2 vel = {0, 0};
    p->interacting = false;

    if (p->id == 0) {
        /* Player 1: WASD + E to interact */
        if (IsKeyDown(KEY_W)) vel.y -= 1;
        if (IsKeyDown(KEY_S)) vel.y += 1;
        if (IsKeyDown(KEY_A)) vel.x -= 1;
        if (IsKeyDown(KEY_D)) vel.x += 1;
        if (IsKeyPressed(KEY_E)) p->interacting = true;
    } else {
        /* Player 2: Arrow keys + Space to interact */
        if (IsKeyDown(KEY_UP))    vel.y -= 1;
        if (IsKeyDown(KEY_DOWN))  vel.y += 1;
        if (IsKeyDown(KEY_LEFT))  vel.x -= 1;
        if (IsKeyDown(KEY_RIGHT)) vel.x += 1;
        if (IsKeyPressed(KEY_SPACE)) p->interacting = true;
    }

    /* Normalise diagonal movement */
    float len = sqrtf(vel.x * vel.x + vel.y * vel.y);
    if (len > 0) {
        vel.x = (vel.x / len) * p->speed * dt;
        vel.y = (vel.y / len) * p->speed * dt;
        p->pos.x += vel.x;
        p->pos.y += vel.y;
    }
}

void player_draw(const Player *p)
{
    /* Body */
    DrawCircleV(p->pos, p->size, p->color);
    /* Outline */
    DrawCircleLines((int)p->pos.x, (int)p->pos.y, (int)p->size, WHITE);
    /* Label */
    const char *label = (p->id == 0) ? "P1" : "P2";
    int tw = MeasureText(label, 14);
    DrawText(label, (int)p->pos.x - tw / 2, (int)p->pos.y - 7, 14, WHITE);
}

bool player_can_interact(const Player *p, Vector2 target)
{
    float dx = p->pos.x - target.x;
    float dy = p->pos.y - target.y;
    return sqrtf(dx * dx + dy * dy) <= INTERACT_RADIUS + p->size;
}
