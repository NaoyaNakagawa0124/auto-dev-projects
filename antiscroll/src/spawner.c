#include "spawner.h"
#include "runner.h"
#include <stddef.h>

Spawner spawner_create(void)
{
    Spawner s = {0};
    s.spawn_interval = 1.0f;
    s.spawn_timer = 0;
    s.base_speed = 200.0f;
    s.total_spawned = 0;
    for (int i = 0; i < MAX_ENTITIES; i++) {
        s.entities[i].active = false;
        s.entities[i].type = ENT_NONE;
    }
    return s;
}

static int find_free_slot(Spawner *s)
{
    for (int i = 0; i < MAX_ENTITIES; i++) {
        if (!s->entities[i].active) return i;
    }
    return -1;
}

static void spawn_entity(Spawner *s, const PaperDB *db, float speed_mult)
{
    int slot = find_free_slot(s);
    if (slot < 0) return;

    Entity *e = &s->entities[slot];
    e->active = true;
    e->lane = GetRandomValue(0, NUM_LANES - 1);
    e->x = SCREEN_W + 20;
    e->y = runner_lane_y(e->lane) + (LANE_HEIGHT - ENTITY_H) / 4.0f;
    e->speed = s->base_speed * speed_mult * (0.8f + GetRandomValue(0, 40) / 100.0f);

    /* 40% chance paper, 60% distraction */
    if (GetRandomValue(1, 100) <= 40 && db->count > 0) {
        e->type = ENT_PAPER;
        int idx = GetRandomValue(0, db->count - 1);
        const Paper *p = papers_get(db, idx);
        e->paper_index = idx;
        e->paper_title = p ? p->title : "Unknown Paper";
        e->paper_field = p ? p->field : "cs.AI";
        e->dist_kind = 0;
    } else {
        e->type = ENT_DISTRACTION;
        e->dist_kind = (DistractionKind)GetRandomValue(0, 3);
        e->paper_index = -1;
        e->paper_title = NULL;
        e->paper_field = NULL;
    }

    s->total_spawned++;
}

void spawner_update(Spawner *s, float dt, float speed_mult, const PaperDB *db)
{
    /* Spawn timer */
    s->spawn_timer -= dt;
    if (s->spawn_timer <= 0) {
        spawn_entity(s, db, speed_mult);
        s->spawn_timer = s->spawn_interval;
    }

    /* Update entities */
    for (int i = 0; i < MAX_ENTITIES; i++) {
        Entity *e = &s->entities[i];
        if (!e->active) continue;
        e->x -= e->speed * dt;
        if (e->x < -ENTITY_W - 20) {
            e->active = false;
        }
    }
}

void spawner_draw(const Spawner *s)
{
    for (int i = 0; i < MAX_ENTITIES; i++) {
        const Entity *e = &s->entities[i];
        if (!e->active) continue;

        if (e->type == ENT_DISTRACTION) {
            Color col;
            const char *icon;
            switch (e->dist_kind) {
                case DIST_NOTIFICATION: col = (Color){255, 80, 80, 230}; icon = "!"; break;
                case DIST_LIKE:         col = (Color){255, 100, 150, 230}; icon = "<3"; break;
                case DIST_CLICKBAIT:    col = (Color){255, 160, 40, 230}; icon = "??"; break;
                case DIST_AD:           col = (Color){180, 80, 255, 230}; icon = "AD"; break;
                default:                col = RED; icon = "X"; break;
            }
            DrawRectangleRounded((Rectangle){e->x, e->y, ENTITY_W, ENTITY_H}, 0.4f, 4, col);
            int tw = MeasureText(icon, 18);
            DrawText(icon, (int)(e->x + ENTITY_W / 2 - tw / 2), (int)(e->y + 11), 18, WHITE);
        } else if (e->type == ENT_PAPER) {
            /* Paper glow */
            DrawRectangleRounded(
                (Rectangle){e->x - 2, e->y - 2, ENTITY_W + 4, ENTITY_H + 4},
                0.3f, 4, (Color){255, 255, 100, 60});
            /* Paper body */
            DrawRectangleRounded(
                (Rectangle){e->x, e->y, ENTITY_W, ENTITY_H},
                0.3f, 4, (Color){240, 235, 210, 240});
            /* Field label */
            if (e->paper_field) {
                DrawText(e->paper_field, (int)(e->x + 4), (int)(e->y + 4), 10, (Color){60, 60, 80, 255});
            }
            /* Doc icon */
            DrawText("DOC", (int)(e->x + 10), (int)(e->y + 20), 14, (Color){80, 120, 60, 255});
        }
    }
}

int spawner_check_collision(Spawner *s, Rectangle runner_rect)
{
    for (int i = 0; i < MAX_ENTITIES; i++) {
        Entity *e = &s->entities[i];
        if (!e->active) continue;
        Rectangle er = {e->x, e->y, ENTITY_W, ENTITY_H};
        if (CheckCollisionRecs(runner_rect, er)) {
            return i;
        }
    }
    return -1;
}

void spawner_remove(Spawner *s, int index)
{
    if (index >= 0 && index < MAX_ENTITIES) {
        s->entities[index].active = false;
    }
}

int spawner_count_active(const Spawner *s, EntityType type)
{
    int count = 0;
    for (int i = 0; i < MAX_ENTITIES; i++) {
        if (s->entities[i].active && s->entities[i].type == type) count++;
    }
    return count;
}
