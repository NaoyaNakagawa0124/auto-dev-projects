#include "piece.h"
#include <stdlib.h>
#include <string.h>

// Piece shapes defined as 4x4 grids (1=filled, 0=empty)
static const int shapes[PIECE_TYPE_COUNT][PIECE_GRID][PIECE_GRID] = {
    // Type 0: Tankobon (文庫本) - vertical 1x2
    {{1,0,0,0}, {1,0,0,0}, {0,0,0,0}, {0,0,0,0}},
    // Type 1: Hardcover (単行本) - vertical 1x3
    {{1,0,0,0}, {1,0,0,0}, {1,0,0,0}, {0,0,0,0}},
    // Type 2: Manga set (漫画セット) - 2x2 square
    {{1,1,0,0}, {1,1,0,0}, {0,0,0,0}, {0,0,0,0}},
    // Type 3: Encyclopedia (百科事典) - L-shape
    {{1,0,0,0}, {1,0,0,0}, {1,1,0,0}, {0,0,0,0}},
    // Type 4: Art book (画集) - horizontal 3x1
    {{1,1,1,0}, {0,0,0,0}, {0,0,0,0}, {0,0,0,0}},
    // Type 5: Pocket book (新書) - single 1x1
    {{1,0,0,0}, {0,0,0,0}, {0,0,0,0}, {0,0,0,0}},
    // Type 6: Box set (BOXセット) - T-shape
    {{1,1,1,0}, {0,1,0,0}, {0,0,0,0}, {0,0,0,0}},
};

static const char *type_names[] = {
    "Bunkobon",
    "Tankoubon",
    "Manga Set",
    "Hyakkajiten",
    "Gashuu",
    "Shinsho",
    "BOX Set",
};

static const char *book_titles[] = {
    "Ningen Shikkaku",
    "Kokoro",
    "Botchan",
    "Genji Monogatari",
    "Rashomon",
    "Kitchen",
    "Norwegian Wood",
    "Musashi",
    "Ring",
    "Battle Royale",
};

void piece_init(Piece *p, int type, Genre genre) {
    memset(p, 0, sizeof(Piece));
    p->type = type % PIECE_TYPE_COUNT;
    p->genre = genre;
    p->rotation = 0;
    p->x = 3;  // Start centered
    p->y = 0;

    for (int r = 0; r < PIECE_GRID; r++)
        for (int c = 0; c < PIECE_GRID; c++)
            p->cells[r][c] = shapes[p->type][r][c] ? (int)genre : 0;

    p->title = book_titles[rand() % 10];
}

void piece_rotate(Piece *p) {
    int temp[PIECE_GRID][PIECE_GRID];
    memset(temp, 0, sizeof(temp));

    // Rotate 90 degrees clockwise
    for (int r = 0; r < PIECE_GRID; r++)
        for (int c = 0; c < PIECE_GRID; c++)
            temp[c][PIECE_GRID - 1 - r] = p->cells[r][c];

    memcpy(p->cells, temp, sizeof(temp));
    p->rotation = (p->rotation + 1) % 4;
}

void piece_rotate_back(Piece *p) {
    int temp[PIECE_GRID][PIECE_GRID];
    memset(temp, 0, sizeof(temp));

    // Rotate 90 degrees counter-clockwise
    for (int r = 0; r < PIECE_GRID; r++)
        for (int c = 0; c < PIECE_GRID; c++)
            temp[PIECE_GRID - 1 - c][r] = p->cells[r][c];

    memcpy(p->cells, temp, sizeof(temp));
    p->rotation = (p->rotation + 3) % 4;
}

bool piece_cell_filled(const Piece *p, int r, int c) {
    if (r < 0 || r >= PIECE_GRID || c < 0 || c >= PIECE_GRID) return false;
    return p->cells[r][c] != 0;
}

int piece_width(const Piece *p) {
    int max_c = 0;
    for (int r = 0; r < PIECE_GRID; r++)
        for (int c = 0; c < PIECE_GRID; c++)
            if (p->cells[r][c] != 0 && c + 1 > max_c) max_c = c + 1;
    return max_c;
}

int piece_height(const Piece *p) {
    int max_r = 0;
    for (int r = 0; r < PIECE_GRID; r++)
        for (int c = 0; c < PIECE_GRID; c++)
            if (p->cells[r][c] != 0 && r + 1 > max_r) max_r = r + 1;
    return max_r;
}

Piece piece_random(void) {
    Piece p;
    int type = rand() % PIECE_TYPE_COUNT;
    Genre genre = (Genre)(1 + rand() % 7);
    piece_init(&p, type, genre);
    return p;
}

const char *piece_type_name(int type) {
    if (type < 0 || type >= PIECE_TYPE_COUNT) return "Unknown";
    return type_names[type];
}
