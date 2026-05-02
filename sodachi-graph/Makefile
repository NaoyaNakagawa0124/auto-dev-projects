CC      ?= clang
CFLAGS  ?= -O2 -Wall -Wextra -Wno-unused-parameter -std=c11
RAYLIB_INC := $(shell pkg-config --cflags raylib 2>/dev/null || echo "-I/opt/homebrew/Cellar/raylib/5.5/include")
RAYLIB_LIB := $(shell pkg-config --libs raylib 2>/dev/null || echo "-L/opt/homebrew/Cellar/raylib/5.5/lib -lraylib")
LDFLAGS := $(RAYLIB_LIB) -framework CoreVideo -framework IOKit -framework Cocoa -framework GLUT -framework OpenGL

SRC := src/main.c src/story.c
OBJ := $(SRC:.c=.o)
TARGET := sodachi-graph

.PHONY: all clean run test

all: $(TARGET)

$(TARGET): $(OBJ)
	$(CC) $(OBJ) -o $@ $(LDFLAGS)

%.o: %.c
	$(CC) $(CFLAGS) $(RAYLIB_INC) -c $< -o $@

run: $(TARGET)
	./$(TARGET)

test: tests/test_endings
	./tests/test_endings

tests/test_endings: tests/test_endings.c src/story.c src/story.h
	$(CC) $(CFLAGS) tests/test_endings.c src/story.c -o tests/test_endings

clean:
	rm -f $(OBJ) $(TARGET) tests/test_endings
