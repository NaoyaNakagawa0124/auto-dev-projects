#ifndef YASAI_DIARY_H
#define YASAI_DIARY_H

#include "crop.h"

#define MAX_CHOSEN 3
#define ENTRY_CARDS 3

/* Card 0 = leaf count: 0..4 (=1, 2, 3, 4, 5+) */
/* Card 1 = color:     0..3 (=みどり, きみどり, きいろ, ちゃいろ) */
/* Card 2 = mood:      0..3 (=😊 たのしい, 😌 おだやか, 🤔 ふしぎ, 😟 しんぱい) */

typedef struct {
    /* -1 = not yet answered */
    int leaf_choice;
    int color_choice;
    int mood_choice;
    int filled;     /* 1 once committed */
} DayEntry;

typedef struct {
    int crops_chosen[MAX_CHOSEN]; /* CropKind values, or -1 if unused */
    int crop_count;
    int current_day;              /* 0..DAYS_PER_SEASON-1; advances after entry */
    int finished;                 /* 1 after final day */
    DayEntry entries[DAYS_PER_SEASON];
    int season_id;                /* unix-time seed to identify seasons across restarts */
} Diary;

void diary_init(Diary *d, int season_id);
int  diary_choose(Diary *d, CropKind k);   /* returns 0 ok, -1 full */
int  diary_remove_choice(Diary *d, CropKind k);
int  diary_has_choice(const Diary *d, CropKind k);
int  diary_today_entry_filled(const Diary *d);
DayEntry *diary_today(Diary *d);
void diary_commit_today(Diary *d);          /* mark today filled, advance day */

/* Save/load — pure helpers operating on strings. The caller handles IO. */
int  diary_serialize(const Diary *d, char *out, int out_size);
int  diary_deserialize(Diary *d, const char *json);

/* IO conveniences using fopen */
int diary_save_to_file(const Diary *d, const char *path);
int diary_load_from_file(Diary *d, const char *path);

/* Resolve the default path: $HOME/.yasai-nikki.json */
const char *diary_default_path(void);

#endif
