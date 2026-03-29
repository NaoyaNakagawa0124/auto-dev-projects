#ifndef GAME_H
#define GAME_H

#include "player.h"
#include "room.h"
#include "clue.h"

#define NUM_ROOMS 3

typedef enum {
    STATE_MENU,
    STATE_INTRO,
    STATE_PLAYING,
    STATE_DEDUCTION,
    STATE_WIN,
    STATE_LOSE
} GameState;

typedef struct {
    GameState state;
    Player players[2];
    Room rooms[NUM_ROOMS];
    int current_room;
    ClueSystem clues;
    float timer;
    int selected_choice;
    const char *message;
    float message_timer;
    bool solved;
} Game;

/* Create and initialize a new game */
Game game_create(void);

/* Update game logic for one frame */
void game_update(Game *g, float dt);

/* Show a temporary message on screen */
void game_show_message(Game *g, const char *msg);

/* Try to interact with objects in the current room */
void game_interact(Game *g, int player_id);

/* Handle co-op reveals: both players near a co-op object */
void game_check_coop_reveals(Game *g);

/* Transition to another room */
void game_change_room(Game *g, int room_idx, Vector2 spawn);

#endif
