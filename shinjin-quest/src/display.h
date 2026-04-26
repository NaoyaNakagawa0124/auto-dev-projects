#pragma once
#include "game.h"
#include "events.h"
#include <string>
#include <vector>

namespace display {

// ANSI colors
void clearScreen();
void showBanner();
void showStatus(const Player& p, const DayInfo& day);
void showChoices(const std::vector<Choice>& choices);
void showEvent(const Event& event);
void showResult(const std::string& text);
void showGameOver(const Player& p);
void showEnding(const Player& p);
void showHelp();

// Color helpers
std::string bold(const std::string& s);
std::string dim(const std::string& s);
std::string red(const std::string& s);
std::string green(const std::string& s);
std::string yellow(const std::string& s);
std::string cyan(const std::string& s);
std::string magenta(const std::string& s);

// Status bar
std::string hpBar(int hp);
std::string mpBar(int mp);
std::string ratingBar(int rating);

void waitForKey();
int readChoice(int maxChoice);

}
