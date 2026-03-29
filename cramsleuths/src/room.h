#ifndef ROOM_H
#define ROOM_H

#include "raylib.h"
#include <stdbool.h>

#define MAX_WALLS    40
#define MAX_OBJECTS  20
#define MAX_DOORS     4
#define TILE_SIZE    40

typedef struct {
    Rectangle rect;
} Wall;

typedef struct {
    int id;
    Vector2 pos;
    const char *name;
    const char *icon;       /* single emoji-like char for display */
    Color color;
    bool visible;
    bool requires_coop;     /* both players must be near to reveal */
    int clue_id;            /* -1 if not a clue, otherwise clue index */
} RoomObject;

typedef struct {
    Rectangle trigger;
    int target_room;        /* index of room to transition to */
    Vector2 spawn_pos;      /* where players appear in target room */
} Door;

typedef struct {
    int id;
    const char *name;
    Color bg_color;
    Wall walls[MAX_WALLS];
    int wall_count;
    RoomObject objects[MAX_OBJECTS];
    int object_count;
    Door doors[MAX_DOORS];
    int door_count;
    float width;
    float height;
} Room;

/* Pre-built rooms */
Room room_create_library(void);
Room room_create_lab(void);
Room room_create_office(void);

/* Draw the room background, walls, and objects */
void room_draw(const Room *room);

/* Draw an object highlight when a player is near */
void room_draw_object_highlight(const RoomObject *obj);

/* Check collision of a circle (player) against room walls; returns corrected position */
Vector2 room_collide(const Room *room, Vector2 pos, float radius);

/* Find an object the player can interact with; returns index or -1 */
int room_find_interactable(const Room *room, Vector2 player_pos, float radius);

/* Check if a player is touching a door; returns door index or -1 */
int room_check_door(const Room *room, Vector2 player_pos, float radius);

#endif
