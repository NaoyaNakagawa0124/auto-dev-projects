#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "../src/story.h"

static int passed = 0;
static int failed = 0;

#define EXPECT(cond, msg) do { \
    if (cond) { passed++; } \
    else { failed++; fprintf(stderr, "FAIL: %s (line %d)\n", msg, __LINE__); } \
} while (0)

static void test_balanced_ending(void) {
    Stats s = {68, 65, 67, 66};
    const Ending *e = select_ending(s);
    EXPECT(e != NULL, "balanced ending not null");
    EXPECT(strstr(e->title, "全人格") != NULL, "balanced -> 全人格的な大人");
}

static void test_chi_dominant(void) {
    Stats s = {88, 50, 40, 45};
    const Ending *e = select_ending(s);
    EXPECT(e != NULL, "chi-dominant not null");
    EXPECT(strstr(e->title, "学究") != NULL, "chi dominant -> 学究の徒");
}

static void test_toku_dominant(void) {
    Stats s = {50, 92, 50, 50};
    const Ending *e = select_ending(s);
    EXPECT(e != NULL, "toku-dominant not null");
    EXPECT(strstr(e->title, "支える") != NULL, "toku dominant -> 支える人");
}

static void test_tai_dominant(void) {
    Stats s = {40, 45, 90, 50};
    const Ending *e = select_ending(s);
    EXPECT(e != NULL, "tai-dominant not null");
    EXPECT(strstr(e->title, "躍動") != NULL, "tai dominant -> 躍動する人");
}

static void test_jou_dominant(void) {
    Stats s = {50, 45, 40, 87};
    const Ending *e = select_ending(s);
    EXPECT(e != NULL, "jou-dominant not null");
    EXPECT(strstr(e->title, "感性") != NULL, "jou dominant -> 感性の人");
}

static void test_chi_toku_dual(void) {
    Stats s = {78, 76, 40, 45};
    const Ending *e = select_ending(s);
    EXPECT(e != NULL, "chi+toku dual not null");
    EXPECT(strstr(e->title, "賢者") != NULL, "chi+toku -> 賢者");
}

static void test_chi_jou_dual(void) {
    Stats s = {78, 50, 45, 76};
    const Ending *e = select_ending(s);
    EXPECT(e != NULL, "chi+jou dual not null");
    EXPECT(strstr(e->title, "クリエイター") != NULL, "chi+jou -> クリエイター");
}

static void test_toku_jou_dual(void) {
    Stats s = {50, 78, 45, 76};
    const Ending *e = select_ending(s);
    EXPECT(e != NULL, "toku+jou dual not null");
    EXPECT(strstr(e->title, "寄り添う") != NULL, "toku+jou -> 寄り添う支え手");
}

static void test_tai_jou_dual(void) {
    Stats s = {45, 50, 78, 76};
    const Ending *e = select_ending(s);
    EXPECT(e != NULL, "tai+jou dual not null");
    EXPECT(strstr(e->title, "全身") != NULL, "tai+jou -> 全身で表現する人");
}

static void test_low_overall(void) {
    Stats s = {40, 35, 38, 42};
    const Ending *e = select_ending(s);
    EXPECT(e != NULL, "fallback not null");
    EXPECT(strstr(e->title, "自分の道") != NULL, "low overall -> 自分の道を歩む人");
}

static void test_chapter_count(void) {
    EXPECT(CHAPTER_COUNT == 5, "exactly 5 chapters");
    EXPECT(CHOICES_PER_CHAPTER == 2, "exactly 2 choices per chapter");
}

static void test_endings_count(void) {
    EXPECT(ALL_ENDINGS_COUNT == 12, "exactly 12 endings defined");
}

static void test_story_data_integrity(void) {
    for (int i = 0; i < CHAPTER_COUNT; i++) {
        EXPECT(STORY[i].title != NULL && STORY[i].title[0] != 0, "chapter title non-empty");
        EXPECT(STORY[i].age_range != NULL && STORY[i].age_range[0] != 0, "chapter age_range non-empty");
        EXPECT(STORY[i].intro_1 != NULL && STORY[i].intro_1[0] != 0, "chapter intro_1 non-empty");
        EXPECT(STORY[i].intro_2 != NULL && STORY[i].intro_2[0] != 0, "chapter intro_2 non-empty");
        for (int j = 0; j < CHOICES_PER_CHAPTER; j++) {
            const ChoicePoint *cp = &STORY[i].choices[j];
            EXPECT(cp->prompt != NULL && cp->prompt[0] != 0, "choice prompt non-empty");
            EXPECT(cp->opt_a != NULL && cp->opt_a[0] != 0, "choice opt_a non-empty");
            EXPECT(cp->opt_b != NULL && cp->opt_b[0] != 0, "choice opt_b non-empty");
            EXPECT(cp->response_a != NULL && cp->response_a[0] != 0, "choice response_a non-empty");
            EXPECT(cp->response_b != NULL && cp->response_b[0] != 0, "choice response_b non-empty");
            int total_a = cp->delta_a.chi + cp->delta_a.toku + cp->delta_a.tai + cp->delta_a.jou;
            int total_b = cp->delta_b.chi + cp->delta_b.toku + cp->delta_b.tai + cp->delta_b.jou;
            EXPECT(total_a > 0, "choice A delta has positive sum");
            EXPECT(total_b > 0, "choice B delta has positive sum");
        }
    }
}

static void test_ending_selection_total(void) {
    int seen[16] = {0};
    Stats profiles[][1] = {
        {{80, 50, 50, 50}}, {{50, 80, 50, 50}}, {{50, 50, 80, 50}}, {{50, 50, 50, 80}},
        {{75, 75, 50, 50}}, {{75, 50, 75, 50}}, {{75, 50, 50, 75}},
        {{50, 75, 75, 50}}, {{50, 75, 50, 75}}, {{50, 50, 75, 75}},
        {{65, 65, 65, 65}}, {{40, 40, 40, 40}}
    };
    int n = (int)(sizeof(profiles) / sizeof(profiles[0]));
    for (int i = 0; i < n; i++) {
        const Ending *e = select_ending(profiles[i][0]);
        EXPECT(e != NULL, "profile resolves to ending");
        for (int j = 0; j < ALL_ENDINGS_COUNT; j++) {
            if (e == &ALL_ENDINGS[j]) { seen[j] = 1; break; }
        }
    }
    int distinct = 0;
    for (int j = 0; j < ALL_ENDINGS_COUNT; j++) distinct += seen[j];
    EXPECT(distinct >= 10, "at least 10 distinct endings reachable from sample profiles");
}

int main(void) {
    test_balanced_ending();
    test_chi_dominant();
    test_toku_dominant();
    test_tai_dominant();
    test_jou_dominant();
    test_chi_toku_dual();
    test_chi_jou_dual();
    test_toku_jou_dual();
    test_tai_jou_dual();
    test_low_overall();
    test_chapter_count();
    test_endings_count();
    test_story_data_integrity();
    test_ending_selection_total();

    printf("Passed: %d  Failed: %d  Total: %d\n", passed, failed, passed + failed);
    return failed == 0 ? 0 : 1;
}
