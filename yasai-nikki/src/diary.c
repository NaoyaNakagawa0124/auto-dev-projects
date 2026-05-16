#include "diary.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void diary_init(Diary *d, int season_id) {
    memset(d, 0, sizeof(*d));
    for (int i = 0; i < MAX_CHOSEN; i++) d->crops_chosen[i] = -1;
    d->crop_count = 0;
    d->current_day = 0;
    d->finished = 0;
    for (int i = 0; i < DAYS_PER_SEASON; i++) {
        d->entries[i].leaf_choice = -1;
        d->entries[i].color_choice = -1;
        d->entries[i].mood_choice = -1;
        d->entries[i].filled = 0;
    }
    d->season_id = season_id;
}

int diary_has_choice(const Diary *d, CropKind k) {
    for (int i = 0; i < d->crop_count; i++) {
        if (d->crops_chosen[i] == (int)k) return 1;
    }
    return 0;
}

int diary_choose(Diary *d, CropKind k) {
    if (diary_has_choice(d, k)) return 0;
    if (d->crop_count >= MAX_CHOSEN) return -1;
    d->crops_chosen[d->crop_count++] = (int)k;
    return 0;
}

int diary_remove_choice(Diary *d, CropKind k) {
    int idx = -1;
    for (int i = 0; i < d->crop_count; i++) {
        if (d->crops_chosen[i] == (int)k) { idx = i; break; }
    }
    if (idx < 0) return -1;
    for (int i = idx; i < d->crop_count - 1; i++) {
        d->crops_chosen[i] = d->crops_chosen[i + 1];
    }
    d->crop_count--;
    d->crops_chosen[d->crop_count] = -1;
    return 0;
}

int diary_today_entry_filled(const Diary *d) {
    if (d->current_day < 0 || d->current_day >= DAYS_PER_SEASON) return 1;
    const DayEntry *e = &d->entries[d->current_day];
    return e->leaf_choice >= 0 && e->color_choice >= 0 && e->mood_choice >= 0;
}

DayEntry *diary_today(Diary *d) {
    if (d->current_day < 0 || d->current_day >= DAYS_PER_SEASON) return NULL;
    return &d->entries[d->current_day];
}

void diary_commit_today(Diary *d) {
    DayEntry *e = diary_today(d);
    if (!e) return;
    if (e->leaf_choice < 0 || e->color_choice < 0 || e->mood_choice < 0) return;
    e->filled = 1;
    d->current_day++;
    if (d->current_day >= DAYS_PER_SEASON) {
        d->finished = 1;
    }
}

/* ============= serialization ============= */
/* Compact JSON, hand-written to avoid third-party deps. */

int diary_serialize(const Diary *d, char *out, int out_size) {
    if (!d || !out || out_size <= 0) return -1;
    int n = 0;
    n += snprintf(out + n, out_size - n,
                  "{\"version\":1,\"season_id\":%d,\"current_day\":%d,\"finished\":%d,\"crop_count\":%d,\"crops_chosen\":[",
                  d->season_id, d->current_day, d->finished, d->crop_count);
    for (int i = 0; i < MAX_CHOSEN; i++) {
        n += snprintf(out + n, out_size - n, "%s%d", i == 0 ? "" : ",", d->crops_chosen[i]);
    }
    n += snprintf(out + n, out_size - n, "],\"entries\":[");
    for (int i = 0; i < DAYS_PER_SEASON; i++) {
        const DayEntry *e = &d->entries[i];
        n += snprintf(out + n, out_size - n,
                      "%s{\"leaf\":%d,\"color\":%d,\"mood\":%d,\"filled\":%d}",
                      i == 0 ? "" : ",", e->leaf_choice, e->color_choice, e->mood_choice, e->filled);
    }
    n += snprintf(out + n, out_size - n, "]}");
    return n;
}

/* Tiny ad-hoc parser. Looks for "key":number and reads the integer. */
static int json_get_int(const char *json, const char *key, int *out) {
    if (!json || !key) return -1;
    const char *p = strstr(json, key);
    if (!p) return -1;
    p += strlen(key);
    while (*p && (*p == ' ' || *p == ':')) p++;
    int sign = 1;
    if (*p == '-') { sign = -1; p++; }
    int v = 0, found = 0;
    while (*p >= '0' && *p <= '9') {
        v = v * 10 + (*p - '0');
        p++;
        found = 1;
    }
    if (!found) return -1;
    *out = sign * v;
    return 0;
}

/* Read N integers from an array at "key":[a,b,c]. Fills `out` (length n_required).
   Returns 0 on success, -1 on failure. */
static int json_get_int_array(const char *json, const char *key, int *out, int n_required) {
    const char *p = strstr(json, key);
    if (!p) return -1;
    p = strchr(p, '[');
    if (!p) return -1;
    p++;
    int read = 0;
    while (*p && read < n_required) {
        while (*p == ' ' || *p == ',') p++;
        if (*p == ']') break;
        int sign = 1;
        if (*p == '-') { sign = -1; p++; }
        int v = 0, digits = 0;
        while (*p >= '0' && *p <= '9') {
            v = v * 10 + (*p - '0');
            p++;
            digits++;
        }
        if (digits == 0) return -1;
        out[read++] = sign * v;
    }
    return read == n_required ? 0 : -1;
}

int diary_deserialize(Diary *d, const char *json) {
    if (!d || !json) return -1;
    diary_init(d, 0);

    int v;
    if (json_get_int(json, "\"season_id\"", &v) == 0) d->season_id = v;
    if (json_get_int(json, "\"current_day\"", &v) == 0) d->current_day = v;
    if (json_get_int(json, "\"finished\"", &v) == 0) d->finished = v;
    if (json_get_int(json, "\"crop_count\"", &v) == 0) d->crop_count = v;

    int chosen[MAX_CHOSEN];
    if (json_get_int_array(json, "\"crops_chosen\"", chosen, MAX_CHOSEN) == 0) {
        for (int i = 0; i < MAX_CHOSEN; i++) d->crops_chosen[i] = chosen[i];
    }

    /* Parse entries array by scanning each "{...}" occurrence past "entries":[ */
    const char *p = strstr(json, "\"entries\"");
    if (p) {
        p = strchr(p, '[');
        if (p) {
            p++;
            for (int i = 0; i < DAYS_PER_SEASON; i++) {
                while (*p == ' ' || *p == ',') p++;
                if (*p != '{') break;
                const char *obj_end = strchr(p, '}');
                if (!obj_end) break;
                /* Extract scoped fields by searching within [p, obj_end] using a snippet */
                char snippet[256];
                int len = (int)(obj_end - p + 1);
                if (len >= (int)sizeof(snippet)) len = (int)sizeof(snippet) - 1;
                memcpy(snippet, p, len);
                snippet[len] = '\0';
                int leaf = -1, color = -1, mood = -1, filled = 0;
                json_get_int(snippet, "\"leaf\"", &leaf);
                json_get_int(snippet, "\"color\"", &color);
                json_get_int(snippet, "\"mood\"", &mood);
                json_get_int(snippet, "\"filled\"", &filled);
                d->entries[i].leaf_choice = leaf;
                d->entries[i].color_choice = color;
                d->entries[i].mood_choice = mood;
                d->entries[i].filled = filled;
                p = obj_end + 1;
            }
        }
    }

    /* Sanity bounds */
    if (d->current_day < 0) d->current_day = 0;
    if (d->current_day > DAYS_PER_SEASON) d->current_day = DAYS_PER_SEASON;
    if (d->crop_count < 0 || d->crop_count > MAX_CHOSEN) d->crop_count = 0;
    return 0;
}

int diary_save_to_file(const Diary *d, const char *path) {
    char buf[16384];
    int n = diary_serialize(d, buf, sizeof(buf));
    if (n <= 0) return -1;
    FILE *f = fopen(path, "w");
    if (!f) return -1;
    size_t written = fwrite(buf, 1, (size_t)n, f);
    fclose(f);
    return written == (size_t)n ? 0 : -1;
}

int diary_load_from_file(Diary *d, const char *path) {
    FILE *f = fopen(path, "r");
    if (!f) return -1;
    fseek(f, 0, SEEK_END);
    long sz = ftell(f);
    fseek(f, 0, SEEK_SET);
    if (sz <= 0 || sz > 1 << 20) {
        fclose(f);
        return -1;
    }
    char *buf = malloc((size_t)sz + 1);
    if (!buf) { fclose(f); return -1; }
    size_t r = fread(buf, 1, (size_t)sz, f);
    fclose(f);
    buf[r] = '\0';
    int rc = diary_deserialize(d, buf);
    free(buf);
    return rc;
}

const char *diary_default_path(void) {
    static char path[1024];
    const char *home = getenv("HOME");
    if (!home) home = ".";
    snprintf(path, sizeof(path), "%s/.yasai-nikki.json", home);
    return path;
}
