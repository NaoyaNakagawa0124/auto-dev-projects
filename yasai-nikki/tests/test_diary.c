/* Pure-logic tests for crop + diary. No Raylib dependency. */

#include "../src/crop.h"
#include "../src/diary.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int FAILURES = 0;
static int PASSED = 0;

#define CHECK(cond) do { \
    if (cond) { PASSED++; } else { \
        fprintf(stderr, "FAIL %s:%d  %s\n", __FILE__, __LINE__, #cond); \
        FAILURES++; \
    } \
} while (0)

static void test_stage_progression(void) {
    CHECK(stage_at_day(0) == STAGE_SEED);
    CHECK(stage_at_day(1) == STAGE_SPROUT);
    CHECK(stage_at_day(4) == STAGE_SPROUT);
    CHECK(stage_at_day(5) == STAGE_LEAFY);
    CHECK(stage_at_day(10) == STAGE_LEAFY);
    CHECK(stage_at_day(11) == STAGE_BUD);
    CHECK(stage_at_day(16) == STAGE_BUD);
    CHECK(stage_at_day(17) == STAGE_FLOWER);
    CHECK(stage_at_day(22) == STAGE_FLOWER);
    CHECK(stage_at_day(23) == STAGE_FRUIT);
    CHECK(stage_at_day(27) == STAGE_FRUIT);
}

static void test_crop_names_well_defined(void) {
    for (int k = 0; k < CROP_COUNT; k++) {
        const char *n = crop_name_jp((CropKind)k);
        CHECK(n != NULL);
        CHECK(strlen(n) > 0);
    }
    for (int s = 0; s < STAGE_COUNT; s++) {
        const char *n = stage_name_jp((Stage)s);
        CHECK(n != NULL);
        CHECK(strlen(n) > 0);
    }
}

static void test_diary_choose_dedups(void) {
    Diary d;
    diary_init(&d, 100);
    CHECK(diary_choose(&d, CROP_TOMATO) == 0);
    CHECK(diary_choose(&d, CROP_CUCUMBER) == 0);
    CHECK(diary_choose(&d, CROP_TOMATO) == 0); /* dedup, still ok */
    CHECK(d.crop_count == 2);
}

static void test_diary_remove_choice(void) {
    Diary d;
    diary_init(&d, 1);
    diary_choose(&d, CROP_TOMATO);
    diary_choose(&d, CROP_CUCUMBER);
    diary_choose(&d, CROP_EGGPLANT);
    CHECK(d.crop_count == 3);
    CHECK(diary_remove_choice(&d, CROP_CUCUMBER) == 0);
    CHECK(d.crop_count == 2);
    CHECK(diary_has_choice(&d, CROP_TOMATO));
    CHECK(diary_has_choice(&d, CROP_EGGPLANT));
    CHECK(!diary_has_choice(&d, CROP_CUCUMBER));
}

static void test_max_three_crops(void) {
    Diary d;
    diary_init(&d, 1);
    CHECK(diary_choose(&d, CROP_TOMATO) == 0);
    CHECK(diary_choose(&d, CROP_CUCUMBER) == 0);
    CHECK(diary_choose(&d, CROP_PEPPER) == 0);
    CHECK(diary_choose(&d, CROP_EGGPLANT) == -1); /* full */
    CHECK(d.crop_count == 3);
}

static void test_commit_today_advances(void) {
    Diary d;
    diary_init(&d, 5);
    DayEntry *e = diary_today(&d);
    CHECK(e != NULL);
    /* incomplete: commit should not advance */
    e->leaf_choice = 1;
    diary_commit_today(&d);
    CHECK(d.current_day == 0);
    e->color_choice = 0;
    e->mood_choice = 2;
    diary_commit_today(&d);
    CHECK(d.current_day == 1);
    CHECK(d.entries[0].filled == 1);
}

static void test_serialize_roundtrip(void) {
    Diary a;
    diary_init(&a, 42);
    diary_choose(&a, CROP_TOMATO);
    diary_choose(&a, CROP_CORN);
    a.entries[0].leaf_choice = 1;
    a.entries[0].color_choice = 2;
    a.entries[0].mood_choice = 0;
    a.entries[0].filled = 1;
    a.current_day = 1;

    char buf[16384];
    int n = diary_serialize(&a, buf, sizeof(buf));
    CHECK(n > 0);

    Diary b;
    diary_init(&b, 0);
    CHECK(diary_deserialize(&b, buf) == 0);
    CHECK(b.season_id == 42);
    CHECK(b.current_day == 1);
    CHECK(b.crop_count == 2);
    CHECK(b.crops_chosen[0] == CROP_TOMATO);
    CHECK(b.crops_chosen[1] == CROP_CORN);
    CHECK(b.entries[0].leaf_choice == 1);
    CHECK(b.entries[0].color_choice == 2);
    CHECK(b.entries[0].mood_choice == 0);
    CHECK(b.entries[0].filled == 1);
}

static void test_save_load_file(void) {
    Diary a;
    diary_init(&a, 99);
    diary_choose(&a, CROP_PEPPER);
    a.entries[3].leaf_choice = 4;
    a.entries[3].color_choice = 1;
    a.entries[3].mood_choice = 2;
    a.entries[3].filled = 1;
    a.current_day = 4;

    const char *tmp = "/tmp/yasai-nikki-test.json";
    CHECK(diary_save_to_file(&a, tmp) == 0);

    Diary b;
    diary_init(&b, 0);
    CHECK(diary_load_from_file(&b, tmp) == 0);
    CHECK(b.season_id == 99);
    CHECK(b.current_day == 4);
    CHECK(b.crop_count == 1);
    CHECK(b.crops_chosen[0] == CROP_PEPPER);
    CHECK(b.entries[3].leaf_choice == 4);
    CHECK(b.entries[3].mood_choice == 2);
    remove(tmp);
}

static void test_finished_flag_at_28(void) {
    Diary d;
    diary_init(&d, 1);
    for (int day = 0; day < DAYS_PER_SEASON; day++) {
        DayEntry *e = diary_today(&d);
        CHECK(e != NULL);
        e->leaf_choice = 0;
        e->color_choice = 0;
        e->mood_choice = 0;
        diary_commit_today(&d);
    }
    CHECK(d.current_day == DAYS_PER_SEASON);
    CHECK(d.finished == 1);
}

int main(void) {
    test_stage_progression();
    test_crop_names_well_defined();
    test_diary_choose_dedups();
    test_diary_remove_choice();
    test_max_three_crops();
    test_commit_today_advances();
    test_serialize_roundtrip();
    test_save_load_file();
    test_finished_flag_at_28();
    int total = PASSED + FAILURES;
    if (FAILURES) {
        fprintf(stderr, "❌ %d/%d failed\n", FAILURES, total);
        return 1;
    }
    printf("✅ %d/%d tests passed\n", PASSED, total);
    return 0;
}
