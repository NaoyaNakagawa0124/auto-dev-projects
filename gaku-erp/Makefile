MCS = mcs
MCSFLAGS = -optimize+
SRCDIR = src
TESTDIR = tests
TARGET = gaku-erp.exe
TEST_TARGET = test-runner.exe

SRCS = $(wildcard $(SRCDIR)/*.cs)
TEST_SRCS = $(TESTDIR)/TestRunner.cs $(filter-out $(SRCDIR)/Program.cs, $(SRCS))

all: $(TARGET)

$(TARGET): $(SRCS)
	$(MCS) $(MCSFLAGS) -out:$@ $^

test: $(TEST_TARGET)
	mono $(TEST_TARGET)

$(TEST_TARGET): $(TEST_SRCS)
	$(MCS) $(MCSFLAGS) -out:$@ $^

clean:
	rm -f $(TARGET) $(TEST_TARGET)

.PHONY: all test clean
