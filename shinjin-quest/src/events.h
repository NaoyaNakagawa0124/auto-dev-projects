#pragma once
#include "game.h"
#include <vector>
#include <functional>

struct Event {
    std::string title;
    std::string description;
    std::vector<Choice> choices;
};

// Get weekday work choices
std::vector<Choice> getWorkChoices(const Player& p, const DayInfo& day);

// Get weekend/holiday choices
std::vector<Choice> getOffChoices(const Player& p, const DayInfo& day);

// Get random event (may return empty title if no event)
Event getRandomEvent(const Player& p, const DayInfo& day, unsigned int seed);

// Seasonal special events
Event getSeasonalEvent(const DayInfo& day);
