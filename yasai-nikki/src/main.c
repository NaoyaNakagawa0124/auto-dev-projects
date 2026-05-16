#include "raylib.h"

#include <stdlib.h>
#include <string.h>
#include <time.h>

#include "crop.h"
#include "diary.h"

typedef struct {
    int picker_cursor;
    int card_cursor;
    int card_index;
    int view_calendar;
    float anim_t;
    int pending_reset;
} UiState;

void render_init(void);
void render_unload(void);
void render_frame(const Diary *d, const UiState *ui);

static void handle_chooser_input(Diary *d, UiState *ui) {
    if (IsKeyPressed(KEY_RIGHT)) {
        ui->picker_cursor = (ui->picker_cursor + 1) % CROP_COUNT;
    } else if (IsKeyPressed(KEY_LEFT)) {
        ui->picker_cursor = (ui->picker_cursor + CROP_COUNT - 1) % CROP_COUNT;
    } else if (IsKeyPressed(KEY_SPACE)) {
        CropKind k = (CropKind)ui->picker_cursor;
        if (diary_has_choice(d, k)) {
            diary_remove_choice(d, k);
        } else {
            diary_choose(d, k);
        }
    } else if (IsKeyPressed(KEY_ENTER)) {
        if (d->crop_count > 0) {
            /* No-op needed; just commit by leaving chooser. The render
               function flips automatically once crop_count > 0 and
               picker_cursor doesn't gate it. */
            ui->picker_cursor = 0;
            /* Force-save once initial selection done */
            diary_save_to_file(d, diary_default_path());
        }
    }
}

static int card_choices_count(int card_index) {
    if (card_index == 0) return 5;
    return 4;
}

static int *card_value_ptr(DayEntry *e, int card_index) {
    if (card_index == 0) return &e->leaf_choice;
    if (card_index == 1) return &e->color_choice;
    return &e->mood_choice;
}

static void sync_cursor_to_value(DayEntry *e, UiState *ui) {
    int *v = card_value_ptr(e, ui->card_index);
    if (*v >= 0 && *v < card_choices_count(ui->card_index)) {
        ui->card_cursor = *v;
    } else {
        ui->card_cursor = 0;
    }
}

static void handle_today_input(Diary *d, UiState *ui) {
    DayEntry *e = diary_today(d);
    if (!e) return;
    int n = card_choices_count(ui->card_index);
    if (IsKeyPressed(KEY_RIGHT)) {
        ui->card_cursor = (ui->card_cursor + 1) % n;
    } else if (IsKeyPressed(KEY_LEFT)) {
        ui->card_cursor = (ui->card_cursor + n - 1) % n;
    } else if (IsKeyPressed(KEY_SPACE)) {
        *card_value_ptr(e, ui->card_index) = ui->card_cursor;
    } else if (IsKeyPressed(KEY_ENTER)) {
        *card_value_ptr(e, ui->card_index) = ui->card_cursor;
        /* Advance to next card */
        if (ui->card_index < ENTRY_CARDS - 1) {
            ui->card_index++;
            sync_cursor_to_value(e, ui);
        } else {
            diary_commit_today(d);
            diary_save_to_file(d, diary_default_path());
            ui->card_index = 0;
            ui->card_cursor = 0;
        }
    } else if (IsKeyPressed(KEY_TAB)) {
        ui->card_index = (ui->card_index + 1) % ENTRY_CARDS;
        sync_cursor_to_value(e, ui);
    }
}

int main(void) {
    SetConfigFlags(FLAG_MSAA_4X_HINT | FLAG_WINDOW_HIGHDPI);
    InitWindow(1280, 720, "やさい日記 — yasai-nikki");
    SetTargetFPS(60);
    SetExitKey(KEY_F12);
    render_init();

    Diary diary;
    diary_init(&diary, (int)time(NULL));
    /* Try to load previous session */
    if (diary_load_from_file(&diary, diary_default_path()) != 0) {
        diary_init(&diary, (int)time(NULL));
    }

    UiState ui = { 0 };

    while (!WindowShouldClose()) {
        if (ui.pending_reset) {
            if (IsKeyPressed(KEY_Y)) {
                diary_init(&diary, (int)time(NULL));
                diary_save_to_file(&diary, diary_default_path());
                ui = (UiState){ 0 };
                ui.pending_reset = 0;
            } else if (IsKeyPressed(KEY_N) || IsKeyPressed(KEY_ESCAPE)) {
                ui.pending_reset = 0;
            }
        } else if (diary.crop_count == 0) {
            handle_chooser_input(&diary, &ui);
        } else if (diary.finished || ui.view_calendar) {
            if (IsKeyPressed(KEY_Q)) ui.view_calendar = !ui.view_calendar;
            if (IsKeyPressed(KEY_R)) ui.pending_reset = 1;
            if (IsKeyPressed(KEY_ESCAPE)) break;
        } else {
            if (IsKeyPressed(KEY_Q)) {
                ui.view_calendar = 1;
            } else if (IsKeyPressed(KEY_R)) {
                ui.pending_reset = 1;
            } else if (IsKeyPressed(KEY_ESCAPE)) {
                /* save and exit */
                diary_save_to_file(&diary, diary_default_path());
                break;
            } else {
                handle_today_input(&diary, &ui);
            }
        }
        render_frame(&diary, (void *)&ui);
    }

    diary_save_to_file(&diary, diary_default_path());
    render_unload();
    CloseWindow();
    return 0;
}
