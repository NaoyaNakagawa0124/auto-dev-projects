CC := cc
PKG := pkg-config
CFLAGS := -std=c99 -Wall -Wextra -O2 -Isrc $(shell $(PKG) --cflags raylib)
LDFLAGS := $(shell $(PKG) --libs raylib) -lm
APP := yasai-nikki
TEST := test-diary

SRC := src/crop.c src/diary.c src/render.c src/main.c
OBJ := $(SRC:.c=.o)

.PHONY: all clean test run

all: $(APP)

$(APP): $(OBJ)
	$(CC) -o $@ $(OBJ) $(LDFLAGS)

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

test: $(TEST)
	./$(TEST)

$(TEST): tests/test_diary.c src/crop.c src/diary.c
	$(CC) $(CFLAGS) -o $@ tests/test_diary.c src/crop.c src/diary.c -lm

run: $(APP)
	./$(APP)

clean:
	rm -f $(OBJ) $(APP) $(TEST)
