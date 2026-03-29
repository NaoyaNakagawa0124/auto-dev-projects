#ifndef PIECE_H
#define PIECE_H

#include <stdbool.h>

// Book pieces - different shapes representing books of various sizes
// Each piece is a 4x4 grid with filled cells

#define PIECE_GRID 4
#define PIECE_TYPE_COUNT 7

// Book genres (colors)
typedef enum {
    GENRE_FICTION = 1,   // Red
    GENRE_SCIENCE,       // Blue
    GENRE_HISTORY,       // Brown
    GENRE_FANTASY,       // Purple
    GENRE_MYSTERY,       // Dark green
    GENRE_ROMANCE,       // Pink
    GENRE_PHILOSOPHY,    // Gold
} Genre;

typedef struct {
    int cells[PIECE_GRID][PIECE_GRID];  // 0=empty, genre=filled
    int type;       // 0-6 piece type
    int rotation;   // 0-3
    int x, y;       // Position on board
    Genre genre;
    const char *title;  // Japanese book title
} Piece;

// Piece definitions (shapes)
// Type 0: Tankobon (文庫本) - 1x2 vertical book
// Type 1: Hardcover (単行本) - 1x3 vertical
// Type 2: Manga set (漫画セット) - 2x2 square
// Type 3: Encyclopedia (百科事典) - 2x3 L-shape
// Type 4: Art book (画集) - 3x1 horizontal
// Type 5: Pocket book (新書) - 1x1 single
// Type 6: Box set (BOXセット) - 2x2 T-shape

void piece_init(Piece *p, int type, Genre genre);
void piece_rotate(Piece *p);
void piece_rotate_back(Piece *p);
bool piece_cell_filled(const Piece *p, int r, int c);
int piece_width(const Piece *p);
int piece_height(const Piece *p);
Piece piece_random(void);
const char *piece_type_name(int type);

#endif
