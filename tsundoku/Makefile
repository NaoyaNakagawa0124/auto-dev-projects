CC = cc
CFLAGS = -std=c99 -Wall -Wextra -O2 $(shell pkg-config --cflags raylib)
LDFLAGS = $(shell pkg-config --libs raylib)
SRC = src/main.c src/game.c src/board.c src/piece.c src/ui.c
OBJ = $(SRC:.c=.o)
TARGET = tsundoku
TEST_SRC = tests/test_game.c src/board.c src/piece.c src/game.c
TEST_TARGET = tests/run_tests

.PHONY: all clean test

all: $(TARGET)

$(TARGET): $(OBJ)
	$(CC) $(OBJ) -o $@ $(LDFLAGS)

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

test: $(TEST_TARGET)
	./$(TEST_TARGET)

$(TEST_TARGET): $(TEST_SRC)
	$(CC) -std=c99 -Wall -O2 -DTEST_MODE $(TEST_SRC) -o $@ -lm

clean:
	rm -f $(OBJ) $(TARGET) $(TEST_TARGET)
