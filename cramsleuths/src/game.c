#include "game.h"
#include <string.h>

Game game_create(void)
{
    Game g = {0};
    g.state = STATE_MENU;
    g.current_room = 0;
    g.timer = 0;
    g.selected_choice = 0;
    g.message = NULL;
    g.message_timer = 0;
    g.solved = false;

    /* Build rooms */
    g.rooms[0] = room_create_library();
    g.rooms[1] = room_create_lab();
    g.rooms[2] = room_create_office();

    /* Init players */
    g.players[0] = player_create(0, (Vector2){80, 240});
    g.players[1] = player_create(1, (Vector2){160, 240});

    /* Init clue system */
    g.clues = clue_system_init();

    return g;
}

void game_show_message(Game *g, const char *msg)
{
    g->message = msg;
    g->message_timer = 3.0f;
}

void game_interact(Game *g, int player_id)
{
    Room *room = &g->rooms[g->current_room];
    Player *p = &g->players[player_id];

    int idx = room_find_interactable(room, p->pos, p->size);
    if (idx < 0) return;

    RoomObject *obj = &room->objects[idx];

    /* If not visible yet (co-op only), can't interact */
    if (!obj->visible) {
        game_show_message(g, "Both detectives needed here...");
        return;
    }

    /* If it has a clue, collect it */
    if (obj->clue_id >= 0) {
        if (clue_is_found(&g->clues, obj->clue_id)) {
            const Clue *c = clue_get(&g->clues, obj->clue_id);
            if (c) game_show_message(g, c->description);
        } else {
            clue_find(&g->clues, obj->clue_id, player_id);
            p->clue_count++;
            const Clue *c = clue_get(&g->clues, obj->clue_id);
            if (c) game_show_message(g, c->description);
        }
    } else {
        /* Non-clue object — just flavor text */
        game_show_message(g, "Nothing unusual here.");
    }
}

void game_check_coop_reveals(Game *g)
{
    Room *room = &g->rooms[g->current_room];
    for (int i = 0; i < room->object_count; i++) {
        RoomObject *obj = &room->objects[i];
        if (obj->requires_coop && !obj->visible) {
            bool p1_near = player_can_interact(&g->players[0], obj->pos);
            bool p2_near = player_can_interact(&g->players[1], obj->pos);
            if (p1_near && p2_near) {
                obj->visible = true;
                game_show_message(g, "Co-op reveal! A hidden clue appeared!");
            }
        }
    }
}

void game_change_room(Game *g, int room_idx, Vector2 spawn)
{
    if (room_idx < 0 || room_idx >= NUM_ROOMS) return;
    g->current_room = room_idx;
    /* Move both players to spawn */
    g->players[0].pos = spawn;
    g->players[1].pos = (Vector2){spawn.x + 40, spawn.y};
}

void game_update(Game *g, float dt)
{
    if (g->state == STATE_MENU) {
        if (IsKeyPressed(KEY_ENTER)) {
            g->state = STATE_INTRO;
        }
        return;
    }

    if (g->state == STATE_INTRO) {
        if (IsKeyPressed(KEY_ENTER)) {
            g->state = STATE_PLAYING;
        }
        return;
    }

    if (g->state == STATE_PLAYING) {
        g->timer += dt;

        /* Update message timer */
        if (g->message_timer > 0) {
            g->message_timer -= dt;
            if (g->message_timer <= 0) g->message = NULL;
        }

        /* Update players */
        for (int i = 0; i < 2; i++) {
            player_update(&g->players[i], dt);
            /* Collision with walls */
            g->players[i].pos = room_collide(
                &g->rooms[g->current_room],
                g->players[i].pos,
                g->players[i].size
            );
        }

        /* Check co-op reveals */
        game_check_coop_reveals(g);

        /* Handle interactions */
        for (int i = 0; i < 2; i++) {
            if (g->players[i].interacting) {
                game_interact(g, i);
            }
        }

        /* Check doors */
        for (int i = 0; i < 2; i++) {
            int door_idx = room_check_door(
                &g->rooms[g->current_room],
                g->players[i].pos, g->players[i].size
            );
            if (door_idx >= 0) {
                Door *d = &g->rooms[g->current_room].doors[door_idx];
                game_change_room(g, d->target_room, d->spawn_pos);
                game_show_message(g, g->rooms[g->current_room].name);
                break;
            }
        }

        /* Tab key opens deduction when enough clues found */
        if (IsKeyPressed(KEY_TAB)) {
            if (g->clues.found_count >= 5) {
                g->state = STATE_DEDUCTION;
                g->selected_choice = 0;
            } else {
                game_show_message(g, "Need more clues before deduction...");
            }
        }
        return;
    }

    if (g->state == STATE_DEDUCTION) {
        if (IsKeyPressed(KEY_UP) || IsKeyPressed(KEY_W)) {
            g->selected_choice--;
            if (g->selected_choice < 0) g->selected_choice = g->clues.choice_count - 1;
        }
        if (IsKeyPressed(KEY_DOWN) || IsKeyPressed(KEY_S)) {
            g->selected_choice++;
            if (g->selected_choice >= g->clues.choice_count) g->selected_choice = 0;
        }
        if (IsKeyPressed(KEY_ENTER)) {
            if (clue_check_answer(&g->clues, g->selected_choice)) {
                g->solved = true;
                g->state = STATE_WIN;
            } else {
                g->state = STATE_LOSE;
            }
        }
        if (IsKeyPressed(KEY_ESCAPE)) {
            g->state = STATE_PLAYING;
        }
        return;
    }

    if (g->state == STATE_WIN || g->state == STATE_LOSE) {
        if (IsKeyPressed(KEY_ENTER)) {
            *g = game_create();
        }
        return;
    }
}
