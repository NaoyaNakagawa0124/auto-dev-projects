CC = cc
CFLAGS = -std=c99 -Wall -Wextra -O2 $(shell pkg-config --cflags raylib 2>/dev/null || echo "-I/opt/homebrew/include")
LDFLAGS = $(shell pkg-config --libs raylib 2>/dev/null || echo "-L/opt/homebrew/lib -lraylib") -framework IOKit -framework Cocoa -framework OpenGL

SRC = src/main.c src/player.c src/room.c src/clue.c src/game.c src/ui.c
OBJ = $(SRC:.c=.o)
TARGET = cramsleuths

TEST_SRC = tests/test_main.c src/player.c src/room.c src/clue.c src/game.c
TEST_TARGET = test_runner

.PHONY: all clean test

all: $(TARGET)

$(TARGET): $(OBJ)
	$(CC) $(OBJ) -o $(TARGET) $(LDFLAGS)

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

test: $(TEST_TARGET)
	./$(TEST_TARGET)

$(TEST_TARGET): $(TEST_SRC)
	$(CC) $(CFLAGS) -DTESTING $(TEST_SRC) -o $(TEST_TARGET) $(LDFLAGS)

clean:
	rm -f $(OBJ) $(TARGET) $(TEST_TARGET)
