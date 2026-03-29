#include "scoring.h"
#include <string.h>

Score score_create(void)
{
    Score s = {0};
    s.lives = 3;
    s.max_lives = 3;
    s.speed_mult = 1.0f;
    s.streak = 0;
    s.best_streak = 0;
    s.collected_count = 0;
    return s;
}

void score_collect_paper(Score *s, int paper_index, const char *title, const char *field)
{
    s->papers_collected++;
    s->streak++;
    if (s->streak > s->best_streak) s->best_streak = s->streak;

    /* Record collected paper */
    if (s->collected_count < MAX_COLLECTED) {
        s->collected[s->collected_count].paper_index = paper_index;
        s->collected[s->collected_count].title = title;
        s->collected[s->collected_count].field = field;
        s->collected_count++;
    }

    /* Anti-difficulty: slow down by 2% per paper, min 0.4x */
    s->speed_mult = score_get_speed_mult(s);
}

void score_hit_distraction(Score *s)
{
    s->distractions_hit++;
    s->lives--;
    s->streak = 0;

    /* Getting hit speeds things up slightly (anti-calm) */
    s->speed_mult += 0.05f;
    if (s->speed_mult > 1.5f) s->speed_mult = 1.5f;
}

void score_dodge_distraction(Score *s)
{
    s->distractions_dodged++;
}

void score_update_distance(Score *s, float dt, float base_speed)
{
    s->distance += base_speed * s->speed_mult * dt;
}

float score_get_speed_mult(const Score *s)
{
    /* Anti-difficulty curve: each paper slows by 2%, floor at 0.4 */
    float mult = 1.0f - (s->papers_collected * 0.02f);
    if (mult < 0.4f) mult = 0.4f;
    /* Add hit penalty */
    mult += s->distractions_hit * 0.05f;
    if (mult > 1.5f) mult = 1.5f;
    return mult;
}

bool score_game_over(const Score *s)
{
    return s->lives <= 0;
}
