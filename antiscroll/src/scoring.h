#ifndef SCORING_H
#define SCORING_H

#include <stdbool.h>

#define MAX_COLLECTED 100

typedef struct {
    int paper_index;
    const char *title;
    const char *field;
} CollectedPaper;

typedef struct {
    int papers_collected;
    int distractions_hit;
    int distractions_dodged;
    float distance;
    int lives;
    int max_lives;
    float speed_mult;           /* anti-difficulty: decreases with papers */
    CollectedPaper collected[MAX_COLLECTED];
    int collected_count;
    int streak;                 /* consecutive papers without a hit */
    int best_streak;
} Score;

Score score_create(void);

/* Called when a paper is collected */
void score_collect_paper(Score *s, int paper_index, const char *title, const char *field);

/* Called when player hits a distraction */
void score_hit_distraction(Score *s);

/* Called when a distraction leaves the screen without hitting player */
void score_dodge_distraction(Score *s);

/* Update distance counter */
void score_update_distance(Score *s, float dt, float base_speed);

/* Get current speed multiplier (anti-difficulty: slower as papers grow) */
float score_get_speed_mult(const Score *s);

/* Is game over? */
bool score_game_over(const Score *s);

#endif
