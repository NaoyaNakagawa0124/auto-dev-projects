#include "display.h"
#include <iostream>
#include <sstream>
#include <iomanip>

namespace display {

// ANSI escape codes
static const char* RESET = "\033[0m";
static const char* BOLD = "\033[1m";
static const char* DIM = "\033[2m";
static const char* RED = "\033[31m";
static const char* GREEN = "\033[32m";
static const char* YELLOW = "\033[33m";
static const char* BLUE = "\033[34m";
static const char* MAGENTA = "\033[35m";
static const char* CYAN = "\033[36m";
static const char* BG_BLACK = "\033[40m";

std::string bold(const std::string& s) { return std::string(BOLD) + s + RESET; }
std::string dim(const std::string& s) { return std::string(DIM) + s + RESET; }
std::string red(const std::string& s) { return std::string(RED) + s + RESET; }
std::string green(const std::string& s) { return std::string(GREEN) + s + RESET; }
std::string yellow(const std::string& s) { return std::string(YELLOW) + s + RESET; }
std::string cyan(const std::string& s) { return std::string(CYAN) + s + RESET; }
std::string magenta(const std::string& s) { return std::string(MAGENTA) + s + RESET; }

void clearScreen() {
    std::cout << "\033[2J\033[H";
}

void showBanner() {
    std::cout << "\n";
    std::cout << cyan("  ┌──────────────────────────────┐") << "\n";
    std::cout << cyan("  │") << bold(" 🏢 新人クエスト              ") << cyan("│") << "\n";
    std::cout << cyan("  │") << dim("  新卒サバイバルシミュレーション  ") << cyan("│") << "\n";
    std::cout << cyan("  └──────────────────────────────┘") << "\n";
    std::cout << "\n";
}

std::string hpBar(int hp) {
    int filled = hp / 5; // 0-20
    std::string bar;
    for (int i = 0; i < 20; i++) {
        if (i < filled) bar += "█";
        else bar += "░";
    }
    std::string color;
    if (hp > 60) color = GREEN;
    else if (hp > 30) color = YELLOW;
    else color = RED;
    return std::string(color) + bar + RESET;
}

std::string mpBar(int mp) {
    int filled = mp / 5;
    std::string bar;
    for (int i = 0; i < 20; i++) {
        if (i < filled) bar += "█";
        else bar += "░";
    }
    std::string color;
    if (mp > 60) color = CYAN;
    else if (mp > 30) color = YELLOW;
    else color = RED;
    return std::string(color) + bar + RESET;
}

std::string ratingBar(int rating) {
    int stars = rating / 20; // 0-5
    std::string bar;
    for (int i = 0; i < 5; i++) {
        if (i < stars) bar += "★";
        else bar += "☆";
    }
    return std::string(YELLOW) + bar + RESET;
}

void showStatus(const Player& p, const DayInfo& day) {
    std::string seasonEmoji = getSeasonEmoji(day.season);
    std::string dayType = getDayTypeName(day.type);

    std::cout << dim("  ─────────────────────────────────") << "\n";
    std::cout << "  " << seasonEmoji << " "
              << bold(std::to_string(day.month) + "月" + std::to_string(day.dayOfMonth) + "日")
              << dim(" (" + dayType + ")")
              << dim(" — " + std::to_string(p.day) + "/365日目") << "\n";

    if (!day.holiday.empty()) {
        std::cout << "  🎌 " << yellow(day.holiday) << "\n";
    }

    std::cout << "\n";
    std::cout << "  体力   " << hpBar(p.hp) << " " << std::to_string(p.hp) << "/" << MAX_HP << "\n";
    std::cout << "  メンタル " << mpBar(p.mp) << " " << std::to_string(p.mp) << "/" << MAX_MP << "\n";
    std::cout << "  貯金   " << (p.money >= 0 ? green("¥") : red("¥")) << (p.money >= 0 ? green(std::to_string(p.money)) : red(std::to_string(p.money))) << "\n";
    std::cout << "  評価   " << ratingBar(p.rating) << " " << std::to_string(p.rating) << "/100\n";
    std::cout << dim("  ─────────────────────────────────") << "\n";
}

void showChoices(const std::vector<Choice>& choices) {
    std::cout << "\n  " << bold("どうする？") << "\n\n";
    for (size_t i = 0; i < choices.size(); i++) {
        std::cout << "  " << cyan(std::to_string(i + 1) + ".") << " " << choices[i].label << "\n";
    }
    std::cout << "\n";
}

void showEvent(const Event& event) {
    std::cout << "\n";
    std::cout << "  " << bold(event.title) << "\n";
    std::cout << "  " << event.description << "\n";
}

void showResult(const std::string& text) {
    std::cout << "\n  " << dim("→ ") << text << "\n";
}

void showGameOver(const Player& p) {
    std::cout << "\n";
    std::cout << red("  ┌──────────────────────────────┐") << "\n";
    std::cout << red("  │") << bold(red(" GAME OVER                     ")) << red("│") << "\n";
    std::cout << red("  └──────────────────────────────┘") << "\n";
    std::cout << "\n";
    std::cout << "  " << p.deathReason << "\n";
    std::cout << "  " << dim(std::to_string(p.day) + "日目で脱落...") << "\n";
}

void showEnding(const Player& p) {
    Ending ending = getEnding(p);
    int score = calculateScore(p);

    std::cout << "\n";
    if (ending == Ending::LEGEND) {
        std::cout << yellow("  ╔══════════════════════════════╗") << "\n";
        std::cout << yellow("  ║") << bold(yellow(" 🏆 " + getEndingTitle(ending))) << yellow("         ║") << "\n";
        std::cout << yellow("  ╚══════════════════════════════╝") << "\n";
    } else if (ending == Ending::PROMOTED) {
        std::cout << green("  ┌──────────────────────────────┐") << "\n";
        std::cout << green("  │") << bold(green(" 🎊 " + getEndingTitle(ending))) << green("             │") << "\n";
        std::cout << green("  └──────────────────────────────┘") << "\n";
    } else if (ending == Ending::SURVIVED) {
        std::cout << cyan("  ┌──────────────────────────────┐") << "\n";
        std::cout << cyan("  │") << bold(cyan(" ✨ " + getEndingTitle(ending))) << cyan("               │") << "\n";
        std::cout << cyan("  └──────────────────────────────┘") << "\n";
    } else {
        showGameOver(p);
    }

    std::cout << "\n  " << getEndingDescription(ending) << "\n";
    std::cout << "\n";
    std::cout << dim("  ── 最終ステータス ──") << "\n\n";
    std::cout << "  体力: " << std::to_string(p.hp) << "  メンタル: " << std::to_string(p.mp) << "\n";
    std::cout << "  貯金: ¥" << std::to_string(p.money) << "  評価: " << std::to_string(p.rating) << "/100\n";
    std::cout << "  スキル: " << std::to_string(p.skillPoints) << "pt\n";
    std::cout << "  残業: " << std::to_string(p.overtimeCount) << "回  有給: " << std::to_string(p.daysOff) << "日\n";
    std::cout << "\n";
    std::cout << "  " << bold("総合スコア: " + std::to_string(score) + "点") << "\n";
    std::cout << "\n";
}

void showHelp() {
    std::cout << dim("  操作: 番号を入力してEnter / q で終了") << "\n";
}

void waitForKey() {
    std::cout << dim("  [Enterで次へ]");
    std::string dummy;
    std::getline(std::cin, dummy);
}

int readChoice(int maxChoice) {
    while (true) {
        std::cout << "  > ";
        std::string input;
        if (!std::getline(std::cin, input)) return -1;
        if (input == "q" || input == "Q") return -1;
        try {
            int choice = std::stoi(input);
            if (choice >= 1 && choice <= maxChoice) return choice;
        } catch (...) {}
        std::cout << red("  1〜" + std::to_string(maxChoice) + "の数字を入力してください") << "\n";
    }
}

}
