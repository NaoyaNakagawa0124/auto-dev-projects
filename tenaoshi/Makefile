CC = cc
CFLAGS = -std=c11 -Wall -Wextra -O2 $(shell pkg-config --cflags raylib)
LDFLAGS = $(shell pkg-config --libs raylib) -framework OpenGL -framework Cocoa -framework IOKit -framework CoreAudio -framework CoreVideo

TARGET = tenaoshi
SRC = main.c

all: $(TARGET)

$(TARGET): $(SRC)
	$(CC) $(CFLAGS) -o $(TARGET) $(SRC) $(LDFLAGS)

test: test_game
	./test_game

test_game: test_game.c
	$(CC) -std=c11 -Wall -Wextra -O2 -o test_game test_game.c -lm

clean:
	rm -f $(TARGET) test_game

.PHONY: all clean test
