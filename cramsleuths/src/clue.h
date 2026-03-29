#ifndef CLUE_H
#define CLUE_H

#include <stdbool.h>

#define MAX_CLUES       16
#define MAX_CHOICES      4
#define CLUE_DESC_LEN  128

typedef struct {
    int id;
    const char *name;
    const char *description;
    bool found;
    int found_by;           /* player id who found it, -1 if not found */
    bool requires_coop;
} Clue;

typedef struct {
    const char *text;
    bool correct;
} DeductionChoice;

typedef struct {
    Clue clues[MAX_CLUES];
    int clue_count;
    int found_count;
    /* Case narrative */
    const char *case_title;
    const char *case_intro;
    const char *case_solution;
    DeductionChoice choices[MAX_CHOICES];
    int choice_count;
} ClueSystem;

/* Initialize the clue system with the campus mystery case */
ClueSystem clue_system_init(void);

/* Mark a clue as found */
bool clue_find(ClueSystem *sys, int clue_id, int player_id);

/* Check if a clue has been found */
bool clue_is_found(const ClueSystem *sys, int clue_id);

/* Get clue by id; returns NULL if invalid */
const Clue *clue_get(const ClueSystem *sys, int clue_id);

/* Check if all clues are found */
bool clue_all_found(const ClueSystem *sys);

/* Count of found clues */
int clue_found_count(const ClueSystem *sys);

/* Check if the selected choice is correct */
bool clue_check_answer(const ClueSystem *sys, int choice_idx);

#endif
