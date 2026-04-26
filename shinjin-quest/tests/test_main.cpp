#include "../src/game.h"
#include "../src/events.h"
#include "../src/display.h"
#include <iostream>
#include <cassert>
#include <cstring>

static int passed = 0;
static int failed = 0;
static const char* currentSuite = "";

void suite(const char* name) {
    currentSuite = name;
    std::cout << "\n\033[33m  " << name << "\033[0m\n";
}

void check(const char* testName, bool condition) {
    if (condition) {
        std::cout << "    \033[32m✓\033[0m " << testName << "\n";
        passed++;
    } else {
        std::cout << "    \033[31m✗\033[0m " << testName << "\n";
        failed++;
    }
}

int main() {
    std::cout << "\033[1m🏢 新人クエスト テストスイート\033[0m\n";

    // ===== Calendar Tests =====
    suite("カレンダー");

    DayInfo day1 = getDayInfo(1);
    check("Day 1 = 4月1日", day1.month == 4 && day1.dayOfMonth == 1);

    DayInfo day30 = getDayInfo(30);
    check("Day 30 = 4月30日", day30.month == 4 && day30.dayOfMonth == 30);

    DayInfo day31 = getDayInfo(31);
    check("Day 31 = 5月1日", day31.month == 5 && day31.dayOfMonth == 1);

    DayInfo day61 = getDayInfo(61);
    check("Day 61 = 5月31日", day61.month == 5 && day61.dayOfMonth == 31);

    DayInfo day62 = getDayInfo(62);
    check("Day 62 = 6月1日", day62.month == 6 && day62.dayOfMonth == 1);

    // Season
    check("4月 = 春", getSeason(4) == Season::SPRING);
    check("5月 = 春", getSeason(5) == Season::SPRING);
    check("6月 = 夏", getSeason(6) == Season::SUMMER);
    check("7月 = 夏", getSeason(7) == Season::SUMMER);
    check("9月 = 秋", getSeason(9) == Season::AUTUMN);
    check("12月 = 冬", getSeason(12) == Season::WINTER);
    check("1月 = 冬", getSeason(1) == Season::WINTER);
    check("3月 = 冬", getSeason(3) == Season::WINTER);

    // Season names
    check("春の名前", getSeasonName(Season::SPRING) == "春");
    check("夏の名前", getSeasonName(Season::SUMMER) == "夏");
    check("秋の名前", getSeasonName(Season::AUTUMN) == "秋");
    check("冬の名前", getSeasonName(Season::WINTER) == "冬");

    // Season emoji
    check("春の絵文字", getSeasonEmoji(Season::SPRING) == "🌸");
    check("夏の絵文字", getSeasonEmoji(Season::SUMMER) == "🌻");

    // Day types
    check("平日の名前", getDayTypeName(DayType::WEEKDAY) == "平日");
    check("祝日の名前", getDayTypeName(DayType::HOLIDAY) == "祝日");
    check("平日 = 勤務日", isWorkday(DayType::WEEKDAY) == true);
    check("日曜 ≠ 勤務日", isWorkday(DayType::SUNDAY) == false);
    check("祝日 ≠ 勤務日", isWorkday(DayType::HOLIDAY) == false);

    // Holidays
    DayInfo gw = getDayInfo(33); // May 3 = Day 33 (30 days in April + 3)
    check("5月3日 = 憲法記念日", gw.holiday == "憲法記念日");
    check("5月3日 = 祝日タイプ", gw.type == DayType::HOLIDAY);

    // Year wrap (Day 276 = January 1: April(30) + May(31) + Jun(30) + Jul(31) + Aug(31) + Sep(30) + Oct(31) + Nov(30) + Dec(31) + 1 = 276)
    DayInfo newYear = getDayInfo(276);
    check("Day 276 = 1月1日", newYear.month == 1 && newYear.dayOfMonth == 1);
    check("1月1日 = 元日", newYear.holiday == "元日");

    // ===== Player & Stats Tests =====
    suite("プレイヤー & ステータス");

    Player p;
    check("初期HP = 100", p.hp == MAX_HP);
    check("初期MP = 100", p.mp == MAX_MP);
    check("初期貯金 = 50000", p.money == STARTING_MONEY);
    check("初期評価 = 50", p.rating == STARTING_RATING);
    check("初期日 = 1", p.day == 1);
    check("生存中", p.alive == true);

    // Apply choice
    Choice c1 = {"テスト", -10, -5, 3000, 2, 1, "結果"};
    applyChoice(p, c1);
    check("HP減少: 90", p.hp == 90);
    check("MP減少: 95", p.mp == 95);
    check("貯金増加: 53000", p.money == 53000);
    check("評価増加: 52", p.rating == 52);
    check("スキル増加: 1", p.skillPoints == 1);

    // Clamp
    Player p2;
    p2.hp = 120;
    clampStats(p2);
    check("HPクランプ上限: 100", p2.hp == MAX_HP);

    p2.hp = -10;
    clampStats(p2);
    check("HPクランプ下限: 0", p2.hp == 0);

    p2.rating = 150;
    clampStats(p2);
    check("評価クランプ上限: 100", p2.rating == MAX_RATING);

    // Monthly salary
    Player p3;
    int before = p3.money;
    applyMonthlySalary(p3);
    check("月給加算", p3.money == before + MONTHLY_SALARY - MONTHLY_EXPENSES);

    // ===== Game Over Tests =====
    suite("ゲームオーバー判定");

    Player pDead;
    pDead.hp = 0;
    checkGameOver(pDead);
    check("HP=0 → 死亡", pDead.alive == false);
    check("HP=0 → 入院メッセージ", pDead.deathReason.find("体力") != std::string::npos);

    Player pMP;
    pMP.mp = 0;
    checkGameOver(pMP);
    check("MP=0 → 死亡", pMP.alive == false);
    check("MP=0 → 休職メッセージ", pMP.deathReason.find("メンタル") != std::string::npos);

    Player pBroke;
    pBroke.money = -200000;
    checkGameOver(pBroke);
    check("借金超過 → 死亡", pBroke.alive == false);

    Player pFired;
    pFired.rating = 0;
    checkGameOver(pFired);
    check("評価0 → 解雇", pFired.alive == false);

    Player pAlive;
    pAlive.hp = 50;
    pAlive.mp = 50;
    pAlive.money = 10000;
    pAlive.rating = 30;
    checkGameOver(pAlive);
    check("全ステ正常 → 生存", pAlive.alive == true);

    // ===== Ending Tests =====
    suite("エンディング");

    Player pLegend;
    pLegend.hp = 100;
    pLegend.mp = 100;
    pLegend.rating = 100;
    pLegend.skillPoints = 50;
    pLegend.money = 500000;
    check("伝説エンド条件", getEnding(pLegend) == Ending::LEGEND);

    Player pPromoted;
    pPromoted.hp = 80;
    pPromoted.mp = 70;
    pPromoted.rating = 80;
    pPromoted.skillPoints = 20;
    pPromoted.money = 300000;
    check("昇進エンド条件", getEnding(pPromoted) == Ending::PROMOTED);

    Player pSurvived;
    pSurvived.hp = 50;
    pSurvived.mp = 40;
    pSurvived.rating = 40;
    pSurvived.skillPoints = 5;
    pSurvived.money = 50000;
    check("生存エンド条件", getEnding(pSurvived) == Ending::SURVIVED);

    Player pBurnout;
    pBurnout.alive = false;
    pBurnout.hp = 0;
    check("燃え尽きエンド", getEnding(pBurnout) == Ending::BURNOUT);

    // Ending titles
    check("解雇エンドタイトル", getEndingTitle(Ending::FIRED) == "解雇エンド");
    check("伝説エンドタイトル", getEndingTitle(Ending::LEGEND) == "伝説の新人エンド");
    check("生存エンドタイトル", getEndingTitle(Ending::SURVIVED) == "生存エンド");

    // Ending descriptions exist
    check("解雇エンド説明", !getEndingDescription(Ending::FIRED).empty());
    check("伝説エンド説明", !getEndingDescription(Ending::LEGEND).empty());

    // Score calculation
    check("スコア計算 > 0", calculateScore(pLegend) > 0);
    check("伝説 > 昇進スコア", calculateScore(pLegend) > calculateScore(pPromoted));
    check("昇進 > 生存スコア", calculateScore(pPromoted) > calculateScore(pSurvived));

    // ===== Event Tests =====
    suite("イベント");

    // Work choices
    auto workChoices = getWorkChoices(p, day1);
    check("平日選択肢 >= 3", workChoices.size() >= 3);
    check("定時帰り選択肢あり", workChoices[0].label.find("定時") != std::string::npos);
    check("残業選択肢あり", workChoices[1].label.find("残業") != std::string::npos);
    check("有給選択肢あり", workChoices[2].label.find("有給") != std::string::npos);

    // Off choices
    auto offChoices = getOffChoices(p, getDayInfo(6)); // First Saturday
    check("休日選択肢 >= 4", offChoices.size() >= 4);
    check("家でゆっくり選択肢", offChoices[0].label.find("ゆっくり") != std::string::npos);

    // Low money triggers extra option
    Player pPoor;
    pPoor.money = 10000;
    auto poorChoices = getOffChoices(pPoor, getDayInfo(6));
    check("貧乏 → 副業選択肢", poorChoices.size() >= 5);

    // Random events
    Event re1 = getRandomEvent(p, day1, 42);
    // May or may not have event — just check it doesn't crash
    check("ランダムイベント生成（クラッシュなし）", true);

    // Test various seeds to get events
    bool foundEvent = false;
    for (unsigned int s = 0; s < 1000; s++) {
        Event re = getRandomEvent(p, day1, s);
        if (!re.title.empty()) {
            foundEvent = true;
            check("イベントに選択肢あり", re.choices.size() > 0);
            break;
        }
    }
    check("1000シード中にイベント発生", foundEvent);

    // Seasonal events
    DayInfo gwDay = getDayInfo(33); // May 3
    Event gwEvent = getSeasonalEvent(gwDay);
    check("GWイベント", gwEvent.title.find("ゴールデン") != std::string::npos);
    check("GW選択肢3つ", gwEvent.choices.size() == 3);

    DayInfo bonusDay;
    bonusDay.month = 6;
    bonusDay.dayOfMonth = 25;
    Event bonusEvent = getSeasonalEvent(bonusDay);
    check("夏ボーナスイベント", bonusEvent.title.find("ボーナス") != std::string::npos);

    DayInfo newYearDay;
    newYearDay.month = 1;
    newYearDay.dayOfMonth = 1;
    Event nyEvent = getSeasonalEvent(newYearDay);
    check("新年イベント", nyEvent.title.find("おめでとう") != std::string::npos);

    // ===== Display Tests =====
    suite("表示関数");

    check("hpBar長さ > 0", display::hpBar(50).length() > 0);
    check("mpBar長さ > 0", display::mpBar(50).length() > 0);
    check("ratingBar長さ > 0", display::ratingBar(50).length() > 0);
    check("bold関数", display::bold("test").find("test") != std::string::npos);
    check("red関数", display::red("error").find("error") != std::string::npos);
    check("green関数", display::green("ok").find("ok") != std::string::npos);

    // ===== Constants =====
    suite("定数");

    check("MAX_HP = 100", MAX_HP == 100);
    check("MAX_MP = 100", MAX_MP == 100);
    check("TOTAL_DAYS = 365", TOTAL_DAYS == 365);
    check("初任給 > 0", MONTHLY_SALARY > 0);
    check("生活費 > 0", MONTHLY_EXPENSES > 0);
    check("手取り > 0", MONTHLY_SALARY > MONTHLY_EXPENSES);

    // ===== Summary =====
    int total = passed + failed;
    std::cout << "\n";
    for (int i = 0; i < 40; i++) std::cout << "─";
    std::cout << "\n";
    if (failed == 0) {
        std::cout << "\033[32m✓ " << passed << "/" << total << " テスト全て通過\033[0m\n";
    } else {
        std::cout << "\033[31m✗ " << failed << "/" << total << " テスト失敗\033[0m\n";
    }

    return failed > 0 ? 1 : 0;
}
