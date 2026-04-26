#include "game.h"
#include "events.h"
#include "display.h"
#include <iostream>
#include <ctime>
#include <cstdlib>

int main() {
    unsigned int seed = static_cast<unsigned int>(std::time(nullptr));

    display::clearScreen();
    display::showBanner();

    std::cout << display::bold("  入社おめでとうございます！") << "\n";
    std::cout << "  あなたは今日から新社会人。\n";
    std::cout << "  体力、メンタル、貯金、評価を管理しながら\n";
    std::cout << "  1年間を乗り越えましょう。\n\n";
    display::showHelp();
    std::cout << "\n";
    display::waitForKey();

    Player player;

    while (player.day <= TOTAL_DAYS && player.alive) {
        DayInfo day = getDayInfo(player.day);

        display::clearScreen();
        display::showBanner();
        display::showStatus(player, day);

        // Monthly salary on 25th
        if (day.dayOfMonth == 25) {
            applyMonthlySalary(player);
            display::showResult("💰 給料日！手取り ¥" + std::to_string(MONTHLY_SALARY - MONTHLY_EXPENSES) + " が振り込まれた。");
        }

        // Check for seasonal events first
        Event seasonal = getSeasonalEvent(day);
        if (!seasonal.title.empty()) {
            display::showEvent(seasonal);
            display::showChoices(seasonal.choices);
            int choice = display::readChoice(seasonal.choices.size());
            if (choice == -1) break;
            applyChoice(player, seasonal.choices[choice - 1]);
            display::showResult(seasonal.choices[choice - 1].result);
            checkGameOver(player);
            if (!player.alive) break;
            display::waitForKey();
            player.day++;
            continue;
        }

        // Check for random events
        Event random = getRandomEvent(player, day, seed + player.day * 31);
        if (!random.title.empty()) {
            display::showEvent(random);
            display::showChoices(random.choices);
            int choice = display::readChoice(random.choices.size());
            if (choice == -1) break;
            applyChoice(player, random.choices[choice - 1]);
            display::showResult(random.choices[choice - 1].result);

            if (random.choices[choice - 1].hpDelta < 0) player.overtimeCount++;
            checkGameOver(player);
            if (!player.alive) break;
            display::waitForKey();
            player.day++;
            continue;
        }

        // Normal day choices
        std::vector<Choice> choices;
        if (isWorkday(day.type)) {
            choices = getWorkChoices(player, day);
        } else {
            choices = getOffChoices(player, day);
        }

        display::showChoices(choices);
        int choice = display::readChoice(choices.size());
        if (choice == -1) break;

        const Choice& selected = choices[choice - 1];
        applyChoice(player, selected);
        display::showResult(selected.result);

        // Track stats
        if (selected.label.find("残業") != std::string::npos) player.overtimeCount++;
        if (selected.label.find("有給") != std::string::npos) player.daysOff++;
        if (selected.label.find("飲み") != std::string::npos) player.partyCount++;

        checkGameOver(player);
        if (!player.alive) break;

        display::waitForKey();
        player.day++;
    }

    // Show ending
    display::clearScreen();
    display::showBanner();
    display::showEnding(player);

    return 0;
}
