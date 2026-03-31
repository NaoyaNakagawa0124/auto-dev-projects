/***********************************************************************
 * 波音 (Namioto) - 呼吸で波を操る瞑想ゲーム
 * One-hand ocean meditation game - Raylib
 ***********************************************************************/

#include "raylib.h"
#include "raymath.h"
#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// ─── Constants ──────────────────────────────────────────────────
#define SCREEN_W 960
#define SCREEN_H 640
#define WAVE_POINTS 120
#define MAX_BUBBLES 60
#define MAX_BIRDS 8
#define BREATH_CYCLE_TARGET 4.0f  // ideal seconds per inhale/exhale

// ─── Game State ─────────────────────────────────────────────────
typedef enum { STATE_TITLE, STATE_PLAYING, STATE_RESULT } GameState;

typedef struct {
    float x, y;
    float size;
    float speed;
    float alpha;
} Bubble;

typedef struct {
    float x, y;
    float speed;
    float wingPhase;
} Bird;

// ─── Globals ────────────────────────────────────────────────────
static GameState state = STATE_TITLE;
static float breathLevel = 0.0f;     // 0=exhaled, 1=fully inhaled
static float breathTarget = 0.0f;    // where we're heading
static float breathSmooth = 0.0f;    // smoothed level for waves
static float calmness = 0.5f;        // 0=storm, 1=perfect calm
static float calmAccum = 0.0f;       // accumulated calm seconds
static float sessionTime = 0.0f;
static int breathCycles = 0;

// Rhythm tracking
static float lastBreathToggle = 0.0f;
static float inhaleTime = 0.0f;
static float exhaleTime = 0.0f;
static bool isInhaling = false;
static float rhythmScore = 0.0f;     // how steady the rhythm is

// Wave
static float wavePhase = 0.0f;
static float waveAmplitude = 20.0f;
static float waveTargetAmp = 20.0f;

// Sky
static float skyClarity = 0.3f;      // 0=stormy, 1=clear
static float cloudDarkness = 0.5f;

// Particles
static Bubble bubbles[MAX_BUBBLES];
static int bubbleCount = 0;
static Bird birds[MAX_BIRDS];
static int birdCount = 0;

// Font
static Font jpFont;
static bool fontLoaded = false;

static float titleAlpha = 0.0f;

// ─── Color Helpers ──────────────────────────────────────────────
static Color LerpColor(Color a, Color b, float t) {
    return (Color){
        (unsigned char)(a.r + (b.r - a.r) * t),
        (unsigned char)(a.g + (b.g - a.g) * t),
        (unsigned char)(a.b + (b.b - a.b) * t),
        (unsigned char)(a.a + (b.a - a.a) * t),
    };
}

// ─── Sky Colors Based on Calmness ───────────────────────────────
static Color GetSkyTop(void) {
    Color stormy = {40, 40, 60, 255};
    Color clear = {70, 130, 210, 255};
    return LerpColor(stormy, clear, skyClarity);
}

static Color GetSkyBottom(void) {
    Color stormy = {60, 55, 70, 255};
    Color clear = {180, 210, 240, 255};
    return LerpColor(stormy, clear, skyClarity);
}

static Color GetOceanTop(void) {
    Color stormy = {30, 50, 70, 255};
    Color calm = {40, 120, 170, 255};
    return LerpColor(stormy, calm, skyClarity);
}

static Color GetOceanBottom(void) {
    Color stormy = {10, 20, 40, 255};
    Color calm = {15, 60, 100, 255};
    return LerpColor(stormy, calm, skyClarity);
}

// ─── Bubbles ────────────────────────────────────────────────────
static void SpawnBubble(void) {
    if (bubbleCount >= MAX_BUBBLES) return;
    Bubble *b = &bubbles[bubbleCount++];
    b->x = (float)GetRandomValue(50, SCREEN_W - 50);
    b->y = (float)SCREEN_H + 10;
    b->size = 2.0f + (float)GetRandomValue(0, 40) / 10.0f;
    b->speed = 0.3f + (float)GetRandomValue(0, 20) / 10.0f;
    b->alpha = 0.2f + (float)GetRandomValue(0, 30) / 100.0f;
}

static void UpdateBubbles(void) {
    for (int i = bubbleCount - 1; i >= 0; i--) {
        bubbles[i].y -= bubbles[i].speed;
        bubbles[i].x += sinf(bubbles[i].y * 0.02f + bubbles[i].size) * 0.3f;
        float waterLine = SCREEN_H * 0.55f + breathSmooth * 30.0f;
        if (bubbles[i].y < waterLine - 20) {
            bubbles[i] = bubbles[--bubbleCount];
        }
    }
    // Spawn rate based on breathing
    if (isInhaling && GetRandomValue(0, 10) < 3) SpawnBubble();
}

static void DrawBubbles(void) {
    for (int i = 0; i < bubbleCount; i++) {
        Bubble *b = &bubbles[i];
        Color c = GetOceanTop();
        c.a = (unsigned char)(b->alpha * 255);
        DrawCircle((int)b->x, (int)b->y, b->size, (Color){180, 220, 255, (unsigned char)(b->alpha * 150)});
        DrawCircleLines((int)b->x, (int)b->y, b->size, (Color){200, 240, 255, (unsigned char)(b->alpha * 200)});
    }
}

// ─── Birds ──────────────────────────────────────────────────────
static void SpawnBird(void) {
    if (birdCount >= MAX_BIRDS) return;
    Bird *b = &birds[birdCount++];
    b->x = -30.0f;
    b->y = 30.0f + (float)GetRandomValue(0, 120);
    b->speed = 0.5f + (float)GetRandomValue(0, 15) / 10.0f;
    b->wingPhase = (float)GetRandomValue(0, 628) / 100.0f;
}

static void UpdateBirds(void) {
    for (int i = birdCount - 1; i >= 0; i--) {
        birds[i].x += birds[i].speed;
        birds[i].wingPhase += 0.08f;
        if (birds[i].x > SCREEN_W + 30) {
            birds[i] = birds[--birdCount];
        }
    }
    if (skyClarity > 0.6f && birdCount < 4 && GetRandomValue(0, 300) == 0) SpawnBird();
}

static void DrawBirds(void) {
    for (int i = 0; i < birdCount; i++) {
        Bird *b = &birds[i];
        float wing = sinf(b->wingPhase) * 6.0f;
        Color c = {60, 60, 80, 180};
        DrawLine((int)(b->x - 8), (int)(b->y + wing), (int)b->x, (int)b->y, c);
        DrawLine((int)b->x, (int)b->y, (int)(b->x + 8), (int)(b->y + wing), c);
    }
}

// ─── Wave Drawing ───────────────────────────────────────────────
static void DrawOcean(void) {
    float waterBase = SCREEN_H * 0.55f;
    float t = GetTime();

    // Ocean body gradient
    Color oceanTop = GetOceanTop();
    Color oceanBot = GetOceanBottom();

    // Draw multiple wave layers
    for (int layer = 2; layer >= 0; layer--) {
        float layerOffset = (float)layer * 15.0f;
        float layerAmp = waveAmplitude * (1.0f - (float)layer * 0.2f);
        float layerSpeed = 1.0f + (float)layer * 0.3f;
        float layerAlpha = 1.0f - (float)layer * 0.15f;

        Color layerColor = LerpColor(oceanTop, oceanBot, (float)layer * 0.3f);
        layerColor.a = (unsigned char)(layerAlpha * 255);

        // Draw as filled shape
        Vector2 points[WAVE_POINTS + 4];
        for (int i = 0; i < WAVE_POINTS; i++) {
            float x = (float)i / (WAVE_POINTS - 1) * SCREEN_W;
            float phase1 = sinf(x * 0.008f + t * layerSpeed + wavePhase) * layerAmp;
            float phase2 = sinf(x * 0.015f + t * 0.7f * layerSpeed + 2.0f) * layerAmp * 0.4f;
            float phase3 = sinf(x * 0.003f + t * 0.3f) * layerAmp * 0.6f;
            float breathWave = breathSmooth * 25.0f * sinf(x * 0.005f + t * 0.5f);
            float y = waterBase + layerOffset + phase1 + phase2 + phase3 + breathWave;
            points[i] = (Vector2){x, y};
        }

        // Close shape
        points[WAVE_POINTS] = (Vector2){SCREEN_W, SCREEN_H};
        points[WAVE_POINTS + 1] = (Vector2){0, SCREEN_H};

        // Draw as triangles
        for (int i = 0; i < WAVE_POINTS - 1; i++) {
            DrawTriangle(
                points[i],
                (Vector2){points[i + 1].x, SCREEN_H},
                (Vector2){points[i].x, SCREEN_H},
                layerColor
            );
            DrawTriangle(
                points[i],
                points[i + 1],
                (Vector2){points[i + 1].x, SCREEN_H},
                layerColor
            );
        }

        // Wave foam on top wave only
        if (layer == 0) {
            for (int i = 0; i < WAVE_POINTS - 1; i++) {
                float foamAlpha = (0.1f + skyClarity * 0.15f) * (0.5f + 0.5f * sinf(points[i].x * 0.02f + t));
                Color foam = {240, 250, 255, (unsigned char)(foamAlpha * 255)};
                DrawLineEx(points[i], points[i + 1], 2.0f, foam);
            }
        }
    }
}

// ─── Sky Drawing ────────────────────────────────────────────────
static void DrawSky(void) {
    Color top = GetSkyTop();
    Color bot = GetSkyBottom();

    // Gradient
    for (int y = 0; y < (int)(SCREEN_H * 0.55f); y++) {
        float t = (float)y / (SCREEN_H * 0.55f);
        Color c = LerpColor(top, bot, t);
        DrawLine(0, y, SCREEN_W, y, c);
    }

    // Sun/Moon glow
    float sunX = SCREEN_W * 0.5f;
    float sunY = SCREEN_H * 0.2f;
    float sunSize = 30.0f + skyClarity * 20.0f;
    Color sunColor = {255, 240, 200, (unsigned char)(skyClarity * 200)};

    // Glow
    for (int r = (int)(sunSize * 3); r > (int)sunSize; r -= 2) {
        float a = (1.0f - (float)(r - sunSize) / (sunSize * 2)) * skyClarity * 0.15f;
        DrawCircle((int)sunX, (int)sunY, (float)r, (Color){255, 240, 200, (unsigned char)(a * 255)});
    }
    DrawCircle((int)sunX, (int)sunY, sunSize, sunColor);

    // Clouds (darker when stormy)
    float t = GetTime();
    for (int i = 0; i < 6; i++) {
        float cx = fmodf(100.0f + (float)i * 180.0f + t * (8.0f + (float)i * 3.0f), SCREEN_W + 200) - 100;
        float cy = 40.0f + (float)i * 30.0f + sinf(t * 0.2f + (float)i) * 10.0f;
        float cw = 80.0f + (float)(i % 3) * 40.0f;
        float ch = 20.0f + (float)(i % 2) * 10.0f;
        unsigned char ca = (unsigned char)((0.3f + cloudDarkness * 0.5f) * 255);
        Color cloudColor = LerpColor(
            (Color){200, 210, 220, ca},
            (Color){80, 80, 90, ca},
            cloudDarkness
        );

        for (int j = 0; j < 5; j++) {
            float ox = cw * ((float)j / 5.0f - 0.1f);
            float oy = sinf((float)j * 1.5f) * ch * 0.3f;
            float r = ch * (0.7f + sinf((float)j * 2.0f) * 0.3f);
            DrawCircle((int)(cx + ox), (int)(cy + oy), r, cloudColor);
        }
    }
}

// ─── Breath Guide ───────────────────────────────────────────────
static void DrawBreathGuide(void) {
    // Breathing circle indicator
    float cx = SCREEN_W - 60;
    float cy = SCREEN_H * 0.55f - 40;
    float radius = 15.0f + breathSmooth * 20.0f;

    // Outer ring
    Color ringColor = LerpColor(
        (Color){200, 100, 80, 150},
        (Color){100, 200, 180, 200},
        calmness
    );
    DrawCircleLines((int)cx, (int)cy, radius + 3, ringColor);
    DrawCircle((int)cx, (int)cy, radius, (Color){ringColor.r, ringColor.g, ringColor.b, 60});

    // Label
    const char *label = isInhaling ? "吸う" : "吐く";
    if (fontLoaded) {
        Vector2 size = MeasureTextEx(jpFont, label, 14, 1);
        DrawTextEx(jpFont, label, (Vector2){cx - size.x/2, cy + radius + 8}, 14, 1, (Color){255,255,255,150});
    }
}

// ─── UI ─────────────────────────────────────────────────────────
static void DrawTextJP(const char *text, int x, int y, int size, Color color) {
    if (fontLoaded) {
        DrawTextEx(jpFont, text, (Vector2){(float)x, (float)y}, (float)size, 1, color);
    } else {
        DrawText(text, x, y, size, color);
    }
}

static void DrawHUD(void) {
    // Calmness meter (top center)
    int barW = 200;
    int barH = 6;
    int barX = (SCREEN_W - barW) / 2;
    int barY = 16;

    DrawTextJP("穏やかさ", barX, barY - 14, 12, (Color){255,255,255,120});
    DrawRectangle(barX, barY, barW, barH, (Color){0,0,0,60});
    Color calmColor = LerpColor((Color){200,80,60,255}, (Color){80,200,160,255}, calmness);
    DrawRectangle(barX, barY, (int)(barW * calmness), barH, calmColor);

    // Session info (top-left)
    char timeStr[64];
    int mins = (int)(sessionTime / 60);
    int secs = (int)sessionTime % 60;
    snprintf(timeStr, sizeof(timeStr), "%d:%02d", mins, secs);
    DrawTextJP(timeStr, 20, 14, 20, (Color){255,255,255,100});

    // Calm time (top-right)
    char calmStr[64];
    int calmMins = (int)(calmAccum / 60);
    int calmSecs = (int)calmAccum % 60;
    snprintf(calmStr, sizeof(calmStr), "穏やかな時間 %d:%02d", calmMins, calmSecs);
    DrawTextJP(calmStr, SCREEN_W - 220, 14, 14, (Color){255,255,255,100});

    // Breath cycles
    char cycleStr[32];
    snprintf(cycleStr, sizeof(cycleStr), "呼吸 %d回", breathCycles);
    DrawTextJP(cycleStr, 20, 38, 12, (Color){255,255,255,80});

    // Hint at bottom
    float hintAlpha = sessionTime < 10 ? 1.0f : fmaxf(0, 1.0f - (sessionTime - 10) / 5.0f);
    if (hintAlpha > 0) {
        DrawTextJP("スペースキーを長押しして吸う、離して吐く",
                   SCREEN_W/2 - 180, SCREEN_H - 40, 14,
                   (Color){255,255,255,(unsigned char)(hintAlpha * 180)});
    }
}

static void DrawTitle(void) {
    DrawRectangle(0, 0, SCREEN_W, SCREEN_H, (Color){20, 30, 50, 255});

    // Animated wave preview
    float t = GetTime();
    for (int y = (int)(SCREEN_H * 0.6f); y < SCREEN_H; y++) {
        float f = (float)(y - SCREEN_H * 0.6f) / (SCREEN_H * 0.4f);
        Color c = LerpColor((Color){30, 80, 120, 255}, (Color){10, 30, 60, 255}, f);
        DrawLine(0, y, SCREEN_W, y, c);
    }
    for (int i = 0; i < SCREEN_W; i += 2) {
        float x = (float)i;
        float wave = sinf(x * 0.01f + t) * 15.0f + sinf(x * 0.02f + t * 0.7f) * 8.0f;
        float y = SCREEN_H * 0.6f + wave;
        DrawPixel(i, (int)y, (Color){180, 220, 255, 80});
    }

    // Title
    float bounce = sinf(t * 1.2f) * 4.0f;
    DrawTextJP("波 音", SCREEN_W/2 - 60, (int)(SCREEN_H * 0.25f + bounce), 48, (Color){200, 230, 255, 255});
    DrawTextJP("〜 呼吸で波を操る瞑想 〜", SCREEN_W/2 - 130, (int)(SCREEN_H * 0.25f + 65), 18, (Color){150, 180, 210, 200});

    // Controls
    DrawRectangleRounded((Rectangle){SCREEN_W/2-140, SCREEN_H*0.48f, 280, 80}, 0.15f, 4, (Color){0,0,0,80});
    DrawTextJP("操作方法", SCREEN_W/2 - 30, (int)(SCREEN_H*0.48f + 8), 14, (Color){200,220,240,200});
    DrawTextJP("スペースキー長押し → 吸う", SCREEN_W/2 - 110, (int)(SCREEN_H*0.48f + 30), 13, (Color){180,200,220,180});
    DrawTextJP("スペースキー離す → 吐く", SCREEN_W/2 - 110, (int)(SCREEN_H*0.48f + 50), 13, (Color){180,200,220,180});

    float alpha = (sinf(t * 2.5f) + 1.0f) * 0.5f;
    DrawTextJP("スペースキーでスタート", SCREEN_W/2 - 110, (int)(SCREEN_H * 0.75f), 18,
               (Color){255,255,255,(unsigned char)(alpha * 220)});
}

static void DrawResult(void) {
    DrawRectangle(0, 0, SCREEN_W, SCREEN_H, (Color){0,0,0,150});

    float bounce = sinf(GetTime() * 1.5f) * 5.0f;
    int cy = (int)(SCREEN_H * 0.3f + bounce);

    DrawRectangleRounded((Rectangle){SCREEN_W/2-200, (float)(cy-20), 400, 240}, 0.1f, 4, (Color){20,30,50,230});

    DrawTextJP("おつかれさまでした", SCREEN_W/2 - 90, cy, 22, (Color){200,230,255,255});

    char line1[64], line2[64], line3[64];
    int mins = (int)(sessionTime / 60), secs = (int)sessionTime % 60;
    int cmins = (int)(calmAccum / 60), csecs = (int)calmAccum % 60;
    snprintf(line1, sizeof(line1), "セッション時間: %d:%02d", mins, secs);
    snprintf(line2, sizeof(line2), "穏やかな時間: %d:%02d", cmins, csecs);
    snprintf(line3, sizeof(line3), "呼吸回数: %d回", breathCycles);

    DrawTextJP(line1, SCREEN_W/2 - 100, cy + 50, 16, (Color){180,200,220,220});
    DrawTextJP(line2, SCREEN_W/2 - 100, cy + 76, 16, (Color){100,200,180,255});
    DrawTextJP(line3, SCREEN_W/2 - 100, cy + 102, 16, (Color){180,200,220,220});

    // Rating
    float calmRatio = sessionTime > 0 ? calmAccum / sessionTime : 0;
    const char *rating;
    if (calmRatio > 0.7f) rating = "とても穏やか ✨";
    else if (calmRatio > 0.4f) rating = "まずまず穏やか 🌊";
    else rating = "もう少し練習しよう 💨";
    DrawTextJP(rating, SCREEN_W/2 - 90, cy + 140, 16, (Color){255,240,200,255});

    float alpha = (sinf(GetTime() * 3.0f) + 1.0f) * 0.5f;
    DrawTextJP("Rキーでもう一度 / ESCで終了", SCREEN_W/2 - 130, cy + 185, 14,
               (Color){255,255,255,(unsigned char)(alpha * 180)});
}

// ─── Update ─────────────────────────────────────────────────────
static void UpdateBreathing(float dt) {
    bool spaceHeld = IsKeyDown(KEY_SPACE);
    breathTarget = spaceHeld ? 1.0f : 0.0f;

    // Detect transitions
    if (spaceHeld && !isInhaling) {
        // Started inhaling
        isInhaling = true;
        float elapsed = sessionTime - lastBreathToggle;
        exhaleTime = elapsed;
        lastBreathToggle = sessionTime;
    } else if (!spaceHeld && isInhaling) {
        // Started exhaling
        isInhaling = false;
        float elapsed = sessionTime - lastBreathToggle;
        inhaleTime = elapsed;
        lastBreathToggle = sessionTime;
        breathCycles++;

        // Score the rhythm
        float avgCycle = (inhaleTime + exhaleTime) * 0.5f;
        float deviation = fabsf(avgCycle - BREATH_CYCLE_TARGET) / BREATH_CYCLE_TARGET;
        float balance = fabsf(inhaleTime - exhaleTime) / fmaxf(inhaleTime + exhaleTime, 0.1f);
        rhythmScore = fmaxf(0, 1.0f - deviation - balance * 0.5f);
    }

    // Smooth breath level
    float speed = isInhaling ? 0.3f : 0.4f;
    breathLevel += (breathTarget - breathLevel) * speed;
    breathSmooth += (breathLevel - breathSmooth) * 0.05f;

    // Update calmness based on rhythm
    float targetCalm = rhythmScore;
    calmness += (targetCalm - calmness) * 0.01f;
    calmness = Clamp(calmness, 0, 1);

    // Accumulate calm time
    if (calmness > 0.5f) {
        calmAccum += dt * (calmness - 0.5f) * 2.0f;
    }

    // Update wave amplitude
    waveTargetAmp = 10.0f + (1.0f - calmness) * 40.0f + breathSmooth * 15.0f;
    waveAmplitude += (waveTargetAmp - waveAmplitude) * 0.03f;
    wavePhase += dt * (0.5f + (1.0f - calmness) * 1.5f);

    // Update sky
    skyClarity += (calmness - skyClarity) * 0.005f;
    cloudDarkness = 1.0f - skyClarity;

    sessionTime += dt;
}

// ─── Main ───────────────────────────────────────────────────────
int main(void) {
    SetConfigFlags(FLAG_MSAA_4X_HINT);
    InitWindow(SCREEN_W, SCREEN_H, "波音 - 呼吸で波を操る瞑想");
    SetTargetFPS(60);

    // Load Japanese font
    const char *fontPaths[] = {
        "/System/Library/Fonts/ヒラギノ角ゴシック W4.ttc",
        "/System/Library/Fonts/Hiragino Sans GB.ttc",
        "/Library/Fonts/Arial Unicode.ttf",
        "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
    };

    int codepointCount = 0;
    int ranges[][2] = {
        {0x0020, 0x007E}, {0x3000, 0x303F}, {0x3040, 0x309F},
        {0x30A0, 0x30FF}, {0x4E00, 0x9FFF}, {0xFF00, 0xFFEF},
        {0x2600, 0x26FF}, {0x2700, 0x27BF}, {0x2190, 0x21FF},
    };
    int rangeCount = sizeof(ranges) / sizeof(ranges[0]);
    for (int i = 0; i < rangeCount; i++)
        codepointCount += ranges[i][1] - ranges[i][0] + 1;

    int *codepoints = (int *)malloc(codepointCount * sizeof(int));
    int idx = 0;
    for (int i = 0; i < rangeCount; i++)
        for (int cp = ranges[i][0]; cp <= ranges[i][1]; cp++)
            codepoints[idx++] = cp;

    for (int i = 0; i < 4; i++) {
        if (FileExists(fontPaths[i])) {
            jpFont = LoadFontEx(fontPaths[i], 24, codepoints, codepointCount);
            if (jpFont.glyphCount > 100) {
                fontLoaded = true;
                SetTextureFilter(jpFont.texture, TEXTURE_FILTER_BILINEAR);
                break;
            }
        }
    }
    free(codepoints);

    // Init state
    memset(bubbles, 0, sizeof(bubbles));
    memset(birds, 0, sizeof(birds));

    while (!WindowShouldClose()) {
        float dt = GetFrameTime();

        switch (state) {
        case STATE_TITLE:
            titleAlpha += 0.02f;
            if (IsKeyPressed(KEY_SPACE)) {
                state = STATE_PLAYING;
                sessionTime = 0;
                calmAccum = 0;
                calmness = 0.5f;
                breathCycles = 0;
                rhythmScore = 0;
                skyClarity = 0.3f;
                breathLevel = 0;
                breathSmooth = 0;
                isInhaling = false;
                lastBreathToggle = 0;
                bubbleCount = 0;
                birdCount = 0;
            }
            break;

        case STATE_PLAYING:
            UpdateBreathing(dt);
            UpdateBubbles();
            UpdateBirds();
            // End session with ESC or after 5 minutes
            if (IsKeyPressed(KEY_ESCAPE) || sessionTime > 300) {
                state = STATE_RESULT;
            }
            break;

        case STATE_RESULT:
            if (IsKeyPressed(KEY_R)) {
                state = STATE_TITLE;
            }
            break;
        }

        // Draw
        BeginDrawing();
        ClearBackground((Color){20, 30, 50, 255});

        if (state == STATE_TITLE) {
            DrawTitle();
        } else {
            DrawSky();
            DrawBirds();
            DrawOcean();
            DrawBubbles();
            DrawBreathGuide();
            DrawHUD();
            if (state == STATE_RESULT) DrawResult();
        }

        EndDrawing();
    }

    if (fontLoaded) UnloadFont(jpFont);
    CloseWindow();
    return 0;
}
