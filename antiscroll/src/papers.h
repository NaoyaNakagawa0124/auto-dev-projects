#ifndef PAPERS_H
#define PAPERS_H

#define MAX_PAPERS 60

typedef struct {
    const char *title;
    const char *field;
} Paper;

typedef struct {
    Paper papers[MAX_PAPERS];
    int count;
} PaperDB;

/* Initialize the paper database with real ArXiv-style titles */
PaperDB papers_init(void);

/* Get a random paper from the database */
const Paper *papers_random(const PaperDB *db);

/* Get paper by index */
const Paper *papers_get(const PaperDB *db, int index);

#endif
