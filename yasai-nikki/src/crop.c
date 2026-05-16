#include "crop.h"

const char *crop_name_jp(CropKind k) {
    switch (k) {
        case CROP_TOMATO:   return "トマト";
        case CROP_CUCUMBER: return "キュウリ";
        case CROP_PEPPER:   return "ピーマン";
        case CROP_EGGPLANT: return "ナス";
        case CROP_CORN:     return "トウモロコシ";
    }
    return "?";
}

const char *crop_emoji(CropKind k) {
    switch (k) {
        case CROP_TOMATO:   return "🍅";
        case CROP_CUCUMBER: return "🥒";
        case CROP_PEPPER:   return "🫑";
        case CROP_EGGPLANT: return "🍆";
        case CROP_CORN:     return "🌽";
    }
    return "🌱";
}

const char *stage_name_jp(Stage s) {
    switch (s) {
        case STAGE_SEED:   return "たね";
        case STAGE_SPROUT: return "め";
        case STAGE_LEAFY:  return "は";
        case STAGE_BUD:    return "つぼみ";
        case STAGE_FLOWER: return "はな";
        case STAGE_FRUIT:  return "じゅくした";
    }
    return "?";
}

/* 28 days mapped to 6 stages.
   Day 0:        SEED
   Days 1-4:     SPROUT
   Days 5-10:    LEAFY
   Days 11-16:   BUD
   Days 17-22:   FLOWER
   Days 23-27:   FRUIT
*/
Stage stage_at_day(int day) {
    if (day <= 0) return STAGE_SEED;
    if (day <= 4) return STAGE_SPROUT;
    if (day <= 10) return STAGE_LEAFY;
    if (day <= 16) return STAGE_BUD;
    if (day <= 22) return STAGE_FLOWER;
    return STAGE_FRUIT;
}
