#include "game.h"
#include <algorithm>

// Month lengths for a non-leap year
static const int MONTH_DAYS[] = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};

// Japanese holidays (approximate, month/day)
struct Holiday { int month; int day; const char* name; };
static const Holiday HOLIDAYS[] = {
    {4, 29, "昭和の日"},
    {5, 3,  "憲法記念日"},
    {5, 4,  "みどりの日"},
    {5, 5,  "こどもの日"},
    {7, 21, "海の日"},
    {8, 11, "山の日"},
    {8, 13, "お盆"},
    {8, 14, "お盆"},
    {8, 15, "お盆"},
    {9, 23, "秋分の日"},
    {10, 14, "スポーツの日"},
    {11, 3,  "文化の日"},
    {11, 23, "勤労感謝の日"},
    {12, 29, "年末休暇"},
    {12, 30, "年末休暇"},
    {12, 31, "大晦日"},
    {1, 1,  "元日"},
    {1, 2,  "正月休み"},
    {1, 3,  "正月休み"},
    {2, 11, "建国記念の日"},
    {2, 23, "天皇誕生日"},
    {3, 21, "春分の日"},
};

DayInfo getDayInfo(int dayNumber) {
    DayInfo info;
    // Start from April 1st
    // Day 1 = April 1, Day 30 = April 30, Day 31 = May 1, etc.
    int remaining = dayNumber;
    int month = 4; // Start in April

    while (remaining > MONTH_DAYS[month]) {
        remaining -= MONTH_DAYS[month];
        month++;
        if (month > 12) month = 1;
    }

    info.month = month;
    info.dayOfMonth = remaining;
    info.season = getSeason(month);

    // Check holidays
    info.holiday = "";
    for (const auto& h : HOLIDAYS) {
        if (h.month == month && h.day == info.dayOfMonth) {
            info.holiday = h.name;
            break;
        }
    }

    // Determine day type
    if (!info.holiday.empty()) {
        info.type = DayType::HOLIDAY;
    } else {
        // Calculate day of week (April 1, 2026 is Wednesday = 3)
        int dow = (2 + dayNumber) % 7; // 0=Mon, 5=Sat, 6=Sun
        if (dow == 5) info.type = DayType::SATURDAY;
        else if (dow == 6) info.type = DayType::SUNDAY;
        else info.type = DayType::WEEKDAY;
    }

    return info;
}

Season getSeason(int month) {
    if (month >= 4 && month <= 5) return Season::SPRING;
    if (month >= 6 && month <= 8) return Season::SUMMER;
    if (month >= 9 && month <= 11) return Season::AUTUMN;
    return Season::WINTER;
}

std::string getSeasonName(Season s) {
    switch (s) {
        case Season::SPRING: return "春";
        case Season::SUMMER: return "夏";
        case Season::AUTUMN: return "秋";
        case Season::WINTER: return "冬";
    }
    return "";
}

std::string getSeasonEmoji(Season s) {
    switch (s) {
        case Season::SPRING: return "🌸";
        case Season::SUMMER: return "🌻";
        case Season::AUTUMN: return "🍁";
        case Season::WINTER: return "❄️";
    }
    return "";
}

std::string getDayTypeName(DayType t) {
    switch (t) {
        case DayType::WEEKDAY: return "平日";
        case DayType::SATURDAY: return "土曜";
        case DayType::SUNDAY: return "日曜";
        case DayType::HOLIDAY: return "祝日";
    }
    return "";
}

bool isWorkday(DayType t) {
    return t == DayType::WEEKDAY;
}

void applyChoice(Player& p, const Choice& c) {
    p.hp += c.hpDelta;
    p.mp += c.mpDelta;
    p.money += c.moneyDelta;
    p.rating += c.ratingDelta;
    p.skillPoints += c.skillDelta;
    clampStats(p);
}

void clampStats(Player& p) {
    p.hp = std::clamp(p.hp, 0, MAX_HP);
    p.mp = std::clamp(p.mp, 0, MAX_MP);
    p.rating = std::clamp(p.rating, 0, MAX_RATING);
}

void applyMonthlySalary(Player& p) {
    p.money += MONTHLY_SALARY - MONTHLY_EXPENSES;
}

void checkGameOver(Player& p) {
    if (p.hp <= 0) {
        p.alive = false;
        p.deathReason = "体力が尽きて倒れました...入院です。";
    } else if (p.mp <= 0) {
        p.alive = false;
        p.deathReason = "メンタルが限界を超えました...休職です。";
    } else if (p.money < -100000) {
        p.alive = false;
        p.deathReason = "借金が膨らみすぎました...生活破綻です。";
    } else if (p.rating <= 0) {
        p.alive = false;
        p.deathReason = "評価がゼロに...試用期間で解雇されました。";
    }
}

Ending getEnding(const Player& p) {
    if (!p.alive) {
        if (p.hp <= 0) return Ending::BURNOUT;
        if (p.mp <= 0) return Ending::BURNOUT;
        if (p.money < -100000) return Ending::BROKE;
        return Ending::FIRED;
    }
    int score = calculateScore(p);
    if (score >= 900) return Ending::LEGEND;
    if (score >= 600) return Ending::PROMOTED;
    return Ending::SURVIVED;
}

std::string getEndingTitle(Ending e) {
    switch (e) {
        case Ending::FIRED: return "解雇エンド";
        case Ending::BURNOUT: return "燃え尽きエンド";
        case Ending::BROKE: return "金欠エンド";
        case Ending::SURVIVED: return "生存エンド";
        case Ending::PROMOTED: return "昇進エンド";
        case Ending::LEGEND: return "伝説の新人エンド";
    }
    return "";
}

std::string getEndingDescription(Ending e) {
    switch (e) {
        case Ending::FIRED: return "試用期間をクリアできませんでした。次の職場では頑張ろう。";
        case Ending::BURNOUT: return "体も心も限界でした。健康はなにより大事です。";
        case Ending::BROKE: return "社会人の金銭管理は難しい。来世で頑張ろう。";
        case Ending::SURVIVED: return "1年間お疲れさまでした。立派な社会人の第一歩です。";
        case Ending::PROMOTED: return "優秀な成績を収め、早くもリーダー候補に。順調なキャリアの始まりです。";
        case Ending::LEGEND: return "全ステータス最高！社長賞を受賞し「伝説の新人」と呼ばれるように。";
    }
    return "";
}

int calculateScore(const Player& p) {
    return p.hp * 2 + p.mp * 2 + p.rating * 5 + p.skillPoints * 3 + (p.money / 10000);
}
