#include "room.h"
#include "player.h"
#include <math.h>

/* ── Helpers ───────────────────────────────────────────────────── */

static Wall make_wall(float x, float y, float w, float h)
{
    return (Wall){ .rect = { x, y, w, h } };
}

static RoomObject make_obj(int id, float x, float y, const char *name,
                           const char *icon, Color col, bool coop, int clue_id)
{
    return (RoomObject){
        .id = id, .pos = {x, y}, .name = name, .icon = icon,
        .color = col, .visible = !coop, .requires_coop = coop, .clue_id = clue_id
    };
}

static Door make_door(float x, float y, float w, float h, int target, float sx, float sy)
{
    return (Door){ .trigger = {x, y, w, h}, .target_room = target, .spawn_pos = {sx, sy} };
}

/* ── Room Builders ─────────────────────────────────────────────── */

Room room_create_library(void)
{
    Room r = {0};
    r.id = 0;
    r.name = "Library";
    r.bg_color = (Color){25, 20, 35, 255};
    r.width = 640;
    r.height = 480;

    /* Walls (border) */
    r.walls[r.wall_count++] = make_wall(0, 0, 640, 10);        /* top */
    r.walls[r.wall_count++] = make_wall(0, 470, 640, 10);      /* bottom */
    r.walls[r.wall_count++] = make_wall(0, 0, 10, 480);        /* left */
    r.walls[r.wall_count++] = make_wall(630, 0, 10, 480);      /* right */
    /* Interior walls */
    r.walls[r.wall_count++] = make_wall(200, 100, 10, 200);    /* bookshelf wall */
    r.walls[r.wall_count++] = make_wall(400, 180, 10, 200);    /* divider */

    /* Objects */
    r.objects[r.object_count++] = make_obj(0, 100, 200, "Torn Page",
        "P", (Color){200, 180, 100, 255}, false, 0);
    r.objects[r.object_count++] = make_obj(1, 300, 150, "Old Book",
        "B", (Color){139, 90, 43, 255}, false, 1);
    r.objects[r.object_count++] = make_obj(2, 500, 350, "Hidden Note",
        "?", (Color){255, 215, 0, 255}, true, 2);  /* requires co-op */
    r.objects[r.object_count++] = make_obj(3, 150, 400, "Desk Lamp",
        "L", (Color){255, 255, 150, 255}, false, -1);

    /* Doors */
    r.doors[r.door_count++] = make_door(630, 200, 10, 60, 1, 30, 240); /* to Lab */
    r.doors[r.door_count++] = make_door(300, 470, 60, 10, 2, 320, 30); /* to Office */

    return r;
}

Room room_create_lab(void)
{
    Room r = {0};
    r.id = 1;
    r.name = "Lab";
    r.bg_color = (Color){20, 30, 25, 255};
    r.width = 640;
    r.height = 480;

    r.walls[r.wall_count++] = make_wall(0, 0, 640, 10);
    r.walls[r.wall_count++] = make_wall(0, 470, 640, 10);
    r.walls[r.wall_count++] = make_wall(0, 0, 10, 480);
    r.walls[r.wall_count++] = make_wall(630, 0, 10, 480);
    r.walls[r.wall_count++] = make_wall(250, 0, 10, 180);
    r.walls[r.wall_count++] = make_wall(250, 300, 10, 180);

    r.objects[r.object_count++] = make_obj(4, 400, 100, "Chemical Report",
        "C", (Color){100, 255, 100, 255}, false, 3);
    r.objects[r.object_count++] = make_obj(5, 500, 350, "Broken Beaker",
        "X", (Color){200, 50, 50, 255}, false, 4);
    r.objects[r.object_count++] = make_obj(6, 150, 400, "Safe (Locked)",
        "S", (Color){180, 180, 180, 255}, true, 5);  /* co-op */
    r.objects[r.object_count++] = make_obj(7, 100, 100, "Microscope",
        "M", (Color){150, 150, 200, 255}, false, -1);

    r.doors[r.door_count++] = make_door(0, 200, 10, 60, 0, 610, 220); /* to Library */

    return r;
}

Room room_create_office(void)
{
    Room r = {0};
    r.id = 2;
    r.name = "Office";
    r.bg_color = (Color){30, 20, 20, 255};
    r.width = 640;
    r.height = 480;

    r.walls[r.wall_count++] = make_wall(0, 0, 640, 10);
    r.walls[r.wall_count++] = make_wall(0, 470, 640, 10);
    r.walls[r.wall_count++] = make_wall(0, 0, 10, 480);
    r.walls[r.wall_count++] = make_wall(630, 0, 10, 480);
    r.walls[r.wall_count++] = make_wall(300, 150, 200, 10);

    r.objects[r.object_count++] = make_obj(8, 500, 100, "Laptop",
        "W", (Color){100, 200, 255, 255}, false, 6);
    r.objects[r.object_count++] = make_obj(9, 150, 350, "Locked Drawer",
        "D", (Color){160, 120, 80, 255}, true, 7);  /* co-op */
    r.objects[r.object_count++] = make_obj(10, 400, 400, "Whiteboard",
        "=", (Color){240, 240, 240, 255}, false, -1);
    r.objects[r.object_count++] = make_obj(11, 100, 100, "Coffee Mug",
        "U", (Color){180, 120, 60, 255}, false, 8);

    r.doors[r.door_count++] = make_door(300, 0, 60, 10, 0, 320, 450); /* to Library */

    return r;
}

/* ── Drawing ───────────────────────────────────────────────────── */

void room_draw(const Room *room)
{
    /* Background */
    DrawRectangle(0, 0, (int)room->width, (int)room->height, room->bg_color);

    /* Floor grid */
    for (int x = 0; x < (int)room->width; x += TILE_SIZE) {
        for (int y = 0; y < (int)room->height; y += TILE_SIZE) {
            Color tile = ((x / TILE_SIZE + y / TILE_SIZE) % 2 == 0)
                ? (Color){room->bg_color.r + 8, room->bg_color.g + 8, room->bg_color.b + 8, 255}
                : room->bg_color;
            DrawRectangle(x, y, TILE_SIZE, TILE_SIZE, tile);
        }
    }

    /* Walls */
    for (int i = 0; i < room->wall_count; i++) {
        DrawRectangleRec(room->walls[i].rect, (Color){60, 50, 70, 255});
    }

    /* Doors */
    for (int i = 0; i < room->door_count; i++) {
        DrawRectangleRec(room->doors[i].trigger, (Color){100, 200, 100, 180});
    }

    /* Objects */
    for (int i = 0; i < room->object_count; i++) {
        const RoomObject *obj = &room->objects[i];
        if (!obj->visible) {
            /* Draw mystery indicator for co-op objects */
            DrawCircleV(obj->pos, 12, (Color){100, 100, 100, 100});
            DrawText("?", (int)obj->pos.x - 4, (int)obj->pos.y - 7, 14, (Color){150, 150, 150, 150});
        } else {
            DrawCircleV(obj->pos, 14, obj->color);
            int tw = MeasureText(obj->icon, 16);
            DrawText(obj->icon, (int)obj->pos.x - tw / 2, (int)obj->pos.y - 8, 16, WHITE);
        }
    }
}

void room_draw_object_highlight(const RoomObject *obj)
{
    if (!obj) return;
    DrawCircleLines((int)obj->pos.x, (int)obj->pos.y, 20, YELLOW);
    int tw = MeasureText(obj->name, 12);
    DrawText(obj->name, (int)obj->pos.x - tw / 2, (int)obj->pos.y - 30, 12, YELLOW);
}

/* ── Collision ─────────────────────────────────────────────────── */

Vector2 room_collide(const Room *room, Vector2 pos, float radius)
{
    for (int i = 0; i < room->wall_count; i++) {
        Rectangle w = room->walls[i].rect;
        /* Find closest point on rect to circle center */
        float cx = fmaxf(w.x, fminf(pos.x, w.x + w.width));
        float cy = fmaxf(w.y, fminf(pos.y, w.y + w.height));
        float dx = pos.x - cx;
        float dy = pos.y - cy;
        float dist = sqrtf(dx * dx + dy * dy);
        if (dist < radius && dist > 0) {
            float overlap = radius - dist;
            pos.x += (dx / dist) * overlap;
            pos.y += (dy / dist) * overlap;
        }
    }
    /* Clamp to room bounds */
    pos.x = fmaxf(radius, fminf(pos.x, room->width - radius));
    pos.y = fmaxf(radius, fminf(pos.y, room->height - radius));
    return pos;
}

int room_find_interactable(const Room *room, Vector2 player_pos, float radius)
{
    for (int i = 0; i < room->object_count; i++) {
        const RoomObject *obj = &room->objects[i];
        float dx = player_pos.x - obj->pos.x;
        float dy = player_pos.y - obj->pos.y;
        float dist = sqrtf(dx * dx + dy * dy);
        if (dist <= INTERACT_RADIUS + radius) {
            return i;
        }
    }
    return -1;
}

int room_check_door(const Room *room, Vector2 player_pos, float radius)
{
    for (int i = 0; i < room->door_count; i++) {
        Rectangle d = room->doors[i].trigger;
        float cx = fmaxf(d.x, fminf(player_pos.x, d.x + d.width));
        float cy = fmaxf(d.y, fminf(player_pos.y, d.y + d.height));
        float dx = player_pos.x - cx;
        float dy = player_pos.y - cy;
        if (sqrtf(dx * dx + dy * dy) <= radius) {
            return i;
        }
    }
    return -1;
}
