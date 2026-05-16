CC := cc
PKG := pkg-config
CFLAGS := -std=c99 -Wall -Wextra -O2 -Isrc $(shell $(PKG) --cflags raylib)
LDFLAGS := $(shell $(PKG) --libs raylib) -lm
APP := eiga-ichiba
TEST := test-game

SRC := src/film.c src/game.c src/render.c src/main.c
OBJ := $(SRC:.c=.o)

.PHONY: all clean test run

all: $(APP)

$(APP): $(OBJ)
	$(CC) -o $@ $(OBJ) $(LDFLAGS)

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

test: $(TEST)
	./$(TEST)

$(TEST): tests/test_game.c src/film.c src/game.c
	$(CC) $(CFLAGS) -o $@ tests/test_game.c src/film.c src/game.c -lm

run: $(APP)
	./$(APP)

clean:
	rm -f $(OBJ) $(APP) $(TEST)
