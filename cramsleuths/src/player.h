#ifndef PLAYER_H
#define PLAYER_H

#include "raylib.h"

#define PLAYER_SIZE 20.0f
#define PLAYER_SPEED 150.0f
#define INTERACT_RADIUS 30.0f

typedef struct {
    int id;             /* 0 = player1, 1 = player2 */
    Vector2 pos;
    Color color;
    float size;
    float speed;
    int clue_count;
    bool interacting;   /* true on the frame interact key is pressed */
} Player;

/* Initialise a player at a given position */
Player player_create(int id, Vector2 start_pos);

/* Read input and update position; does NOT handle collision (caller does that) */
void player_update(Player *p, float dt);

/* Draw the player */
void player_draw(const Player *p);

/* Check if player is close enough to a world point to interact */
bool player_can_interact(const Player *p, Vector2 target);

#endif
