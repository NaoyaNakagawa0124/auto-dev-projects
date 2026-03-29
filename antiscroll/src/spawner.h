#ifndef SPAWNER_H
#define SPAWNER_H

#include "raylib.h"
#include "papers.h"
#include <stdbool.h>

#define MAX_ENTITIES 32
#define ENTITY_W 50
#define ENTITY_H 40

typedef enum {
    ENT_NONE,
    ENT_DISTRACTION,
    ENT_PAPER
} EntityType;

typedef enum {
    DIST_NOTIFICATION,
    DIST_LIKE,
    DIST_CLICKBAIT,
    DIST_AD
} DistractionKind;

typedef struct {
    EntityType type;
    float x, y;
    float speed;
    int lane;
    bool active;
    /* Distraction-specific */
    DistractionKind dist_kind;
    /* Paper-specific */
    int paper_index;
    const char *paper_title;
    const char *paper_field;
} Entity;

typedef struct {
    Entity entities[MAX_ENTITIES];
    float spawn_timer;
    float spawn_interval;
    float base_speed;
    int total_spawned;
} Spawner;

Spawner spawner_create(void);
void spawner_update(Spawner *s, float dt, float speed_mult, const PaperDB *db);
void spawner_draw(const Spawner *s);

/* Check collision with runner rect; returns entity index or -1 */
int spawner_check_collision(Spawner *s, Rectangle runner_rect);

/* Deactivate an entity */
void spawner_remove(Spawner *s, int index);

/* Count active entities by type */
int spawner_count_active(const Spawner *s, EntityType type);

#endif
