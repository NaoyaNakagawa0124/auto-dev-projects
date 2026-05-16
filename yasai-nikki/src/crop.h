#ifndef YASAI_CROP_H
#define YASAI_CROP_H

#define CROP_COUNT 5
#define STAGE_COUNT 6
#define DAYS_PER_SEASON 28

typedef enum {
    CROP_TOMATO,
    CROP_CUCUMBER,
    CROP_PEPPER,
    CROP_EGGPLANT,
    CROP_CORN,
} CropKind;

typedef enum {
    STAGE_SEED,
    STAGE_SPROUT,
    STAGE_LEAFY,
    STAGE_BUD,
    STAGE_FLOWER,
    STAGE_FRUIT,
} Stage;

const char *crop_name_jp(CropKind k);
const char *crop_emoji(CropKind k);
const char *stage_name_jp(Stage s);
Stage stage_at_day(int day);          /* day: 0..27 */

#endif
