#pragma once
#include <string>
#include <vector>
#include <cstdint>

// ===== Constants =====
constexpr int MAX_HP = 100;
constexpr int MAX_MP = 100;
constexpr int STARTING_MONEY = 50000;  // 初任給前の貯金
constexpr int STARTING_RATING = 50;
constexpr int MAX_RATING = 100;
constexpr int MONTHLY_SALARY = 220000;
constexpr int MONTHLY_EXPENSES = 150000;
constexpr int TOTAL_DAYS = 365;

// ===== Enums =====
enum class DayType { WEEKDAY, SATURDAY, SUNDAY, HOLIDAY };
enum class Season { SPRING, SUMMER, AUTUMN, WINTER };
enum class Ending { FIRED, BURNOUT, BROKE, SURVIVED, PROMOTED, LEGEND };

// ===== Player State =====
struct Player {
    int hp = MAX_HP;
    int mp = MAX_MP;
    int money = STARTING_MONEY;
    int rating = STARTING_RATING;
    int day = 1;          // 1-365 (April 1 start)
    int overtimeCount = 0;
    int daysOff = 0;
    int partyCount = 0;
    int skillPoints = 0;
    bool alive = true;
    std::string deathReason;
};

// ===== Choice =====
struct Choice {
    std::string label;
    int hpDelta;
    int mpDelta;
    int moneyDelta;
    int ratingDelta;
    int skillDelta;
    std::string result;
};

// ===== Calendar =====
struct DayInfo {
    int month;      // 1-12
    int dayOfMonth; // 1-31
    DayType type;
    Season season;
    std::string holiday; // empty if not a holiday
};

// ===== Game Functions =====
DayInfo getDayInfo(int dayNumber);
Season getSeason(int month);
std::string getSeasonName(Season s);
std::string getSeasonEmoji(Season s);
std::string getDayTypeName(DayType t);
bool isWorkday(DayType t);

void applyChoice(Player& p, const Choice& c);
void applyMonthlySalary(Player& p);
void checkGameOver(Player& p);
Ending getEnding(const Player& p);
std::string getEndingTitle(Ending e);
std::string getEndingDescription(Ending e);
int calculateScore(const Player& p);

void clampStats(Player& p);
