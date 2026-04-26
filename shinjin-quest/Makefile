CXX = c++
CXXFLAGS = -std=c++17 -Wall -Wextra -O2
SRCDIR = src
TESTDIR = tests
TARGET = shinjin-quest
TEST_TARGET = test-runner

SRCS = $(SRCDIR)/main.cpp $(SRCDIR)/game.cpp $(SRCDIR)/events.cpp $(SRCDIR)/display.cpp
OBJS = $(SRCS:.cpp=.o)

TEST_SRCS = $(TESTDIR)/test_main.cpp $(SRCDIR)/game.cpp $(SRCDIR)/events.cpp $(SRCDIR)/display.cpp
TEST_OBJS = $(TEST_SRCS:.cpp=.o)

all: $(TARGET)

$(TARGET): $(OBJS)
	$(CXX) $(CXXFLAGS) -o $@ $^

test: $(TEST_TARGET)
	./$(TEST_TARGET)

$(TEST_TARGET): $(TEST_OBJS)
	$(CXX) $(CXXFLAGS) -o $@ $^

%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c -o $@ $<

clean:
	rm -f $(SRCDIR)/*.o $(TESTDIR)/*.o $(TARGET) $(TEST_TARGET)

.PHONY: all test clean
