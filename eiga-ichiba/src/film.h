#ifndef EIGA_FILM_H
#define EIGA_FILM_H

#include <stdint.h>

#define FILM_COUNT 12

typedef enum {
    GENRE_ACTION,
    GENRE_DRAMA,
    GENRE_COMEDY,
    GENRE_HORROR,
    GENRE_SF,
    GENRE_ANIMATION,
    GENRE_DOCUMENTARY,
} Genre;

typedef struct {
    const char *title;
    const char *director;
    Genre genre;
    int month;              // 1..12
    int budget_oku;         // 億円
    int hype;               // 0..100
    /* Predetermined base return multiplier (×0.1). The actual return is
       hype-modulated and randomized at settle time. */
    int seed_return_x10;
    /* Short, evocative pitch line displayed on the poster. */
    const char *pitch;
} Film;

const Film *film_get(int index);
int film_count(void);
const char *genre_label_jp(Genre g);

#endif
