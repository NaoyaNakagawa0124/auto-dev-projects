#ifndef SODACHI_STORY_H
#define SODACHI_STORY_H

#define CHAPTER_COUNT 5
#define CHOICES_PER_CHAPTER 2

typedef struct {
    int chi;
    int toku;
    int tai;
    int jou;
} Stats;

typedef struct {
    const char *prompt;
    const char *opt_a;
    const char *opt_b;
    const char *response_a;
    const char *response_b;
    Stats delta_a;
    Stats delta_b;
} ChoicePoint;

typedef struct {
    const char *title;
    const char *age_range;
    const char *intro_1;
    const char *intro_2;
    ChoicePoint choices[CHOICES_PER_CHAPTER];
} Chapter;

extern const Chapter STORY[CHAPTER_COUNT];

typedef struct {
    int min_chi;
    int min_toku;
    int min_tai;
    int min_jou;
    int dominance_threshold;
    const char *title;
    const char *body;
} Ending;

extern const Ending ALL_ENDINGS[];
extern const int ALL_ENDINGS_COUNT;

const Ending *select_ending(Stats s);

#endif
