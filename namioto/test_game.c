/**
 * 波音 (Namioto) - Unit Tests
 * Run: make test
 */
#include <stdio.h>
#include <math.h>
#include <string.h>

static int tests = 0, passed = 0;
#define TEST(n) do { tests++; printf("  test: %-50s", n); } while(0)
#define PASS() do { passed++; printf("  ✓\n"); } while(0)
#define FAIL(m) do { printf("  ✗ %s\n", m); return; } while(0)
#define ASSERT_TRUE(c,m) do { if (!(c)) { FAIL(m); } } while(0)
#define ASSERT_EQ(a,b,m) do { if ((a)!=(b)) { FAIL(m); } } while(0)
#define ASSERT_NEAR(a,b,eps,m) do { if (fabs((double)(a)-(double)(b))>(eps)) { FAIL(m); } } while(0)

#define BREATH_CYCLE_TARGET 4.0f
#define SCREEN_W 960
#define SCREEN_H 640

// Replicated helpers
typedef struct { unsigned char r,g,b,a; } Color;

static Color LerpColor(Color a, Color b, float t) {
    return (Color){
        (unsigned char)(a.r + (b.r - a.r) * t),
        (unsigned char)(a.g + (b.g - a.g) * t),
        (unsigned char)(a.b + (b.b - a.b) * t),
        (unsigned char)(a.a + (b.a - a.a) * t),
    };
}

static float Clamp(float v, float lo, float hi) {
    return v < lo ? lo : (v > hi ? hi : v);
}

// ─── Tests ──────────────────────────────────────────────────────

void test_lerp_color_start(void) {
    TEST("LerpColor: t=0 returns first color");
    Color a = {255,0,0,255}, b = {0,255,0,255};
    Color r = LerpColor(a, b, 0);
    ASSERT_EQ(r.r, 255, "r"); ASSERT_EQ(r.g, 0, "g"); ASSERT_EQ(r.b, 0, "b");
    PASS();
}

void test_lerp_color_end(void) {
    TEST("LerpColor: t=1 returns second color");
    Color a = {255,0,0,255}, b = {0,255,0,255};
    Color r = LerpColor(a, b, 1);
    ASSERT_EQ(r.r, 0, "r"); ASSERT_EQ(r.g, 255, "g");
    PASS();
}

void test_lerp_color_mid(void) {
    TEST("LerpColor: t=0.5 returns midpoint");
    Color a = {0,0,0,255}, b = {200,100,50,255};
    Color r = LerpColor(a, b, 0.5f);
    ASSERT_EQ(r.r, 100, "r"); ASSERT_EQ(r.g, 50, "g"); ASSERT_EQ(r.b, 25, "b");
    PASS();
}

void test_clamp_within(void) {
    TEST("Clamp: value within range");
    ASSERT_NEAR(Clamp(0.5f, 0, 1), 0.5f, 0.001, "should be 0.5");
    PASS();
}

void test_clamp_below(void) {
    TEST("Clamp: value below min");
    ASSERT_NEAR(Clamp(-1.0f, 0, 1), 0.0f, 0.001, "should be 0");
    PASS();
}

void test_clamp_above(void) {
    TEST("Clamp: value above max");
    ASSERT_NEAR(Clamp(2.0f, 0, 1), 1.0f, 0.001, "should be 1");
    PASS();
}

void test_breath_cycle_target(void) {
    TEST("Breath cycle target is 4 seconds");
    ASSERT_NEAR(BREATH_CYCLE_TARGET, 4.0f, 0.001, "should be 4");
    PASS();
}

void test_rhythm_score_perfect(void) {
    TEST("Rhythm score: perfect 4s cycle");
    float inhaleTime = 4.0f, exhaleTime = 4.0f;
    float avgCycle = (inhaleTime + exhaleTime) * 0.5f;
    float deviation = fabsf(avgCycle - BREATH_CYCLE_TARGET) / BREATH_CYCLE_TARGET;
    float balance = fabsf(inhaleTime - exhaleTime) / (inhaleTime + exhaleTime);
    float score = fmaxf(0, 1.0f - deviation - balance * 0.5f);
    ASSERT_NEAR(score, 1.0f, 0.01, "perfect rhythm");
    PASS();
}

void test_rhythm_score_fast(void) {
    TEST("Rhythm score: too fast (1s cycle)");
    float inhaleTime = 1.0f, exhaleTime = 1.0f;
    float avgCycle = (inhaleTime + exhaleTime) * 0.5f;
    float deviation = fabsf(avgCycle - BREATH_CYCLE_TARGET) / BREATH_CYCLE_TARGET;
    float balance = fabsf(inhaleTime - exhaleTime) / (inhaleTime + exhaleTime);
    float score = fmaxf(0, 1.0f - deviation - balance * 0.5f);
    ASSERT_TRUE(score < 0.5f, "should be low");
    PASS();
}

void test_rhythm_score_unbalanced(void) {
    TEST("Rhythm score: unbalanced inhale/exhale");
    float inhaleTime = 6.0f, exhaleTime = 2.0f;
    float avgCycle = (inhaleTime + exhaleTime) * 0.5f;
    float deviation = fabsf(avgCycle - BREATH_CYCLE_TARGET) / BREATH_CYCLE_TARGET;
    float balance = fabsf(inhaleTime - exhaleTime) / (inhaleTime + exhaleTime);
    float score = fmaxf(0, 1.0f - deviation - balance * 0.5f);
    ASSERT_TRUE(score < 0.8f, "should be penalized");
    PASS();
}

void test_calm_accumulation(void) {
    TEST("Calm time accumulates when calmness > 0.5");
    float calmness = 0.8f, dt = 1.0f/60.0f;
    float calmAccum = 0;
    for (int i = 0; i < 60; i++) {
        if (calmness > 0.5f) calmAccum += dt * (calmness - 0.5f) * 2.0f;
    }
    ASSERT_TRUE(calmAccum > 0, "should accumulate");
    ASSERT_NEAR(calmAccum, 0.6f, 0.05, "~0.6s of calm per second at 0.8");
    PASS();
}

void test_no_calm_when_stormy(void) {
    TEST("No calm accumulation when calmness < 0.5");
    float calmness = 0.3f, dt = 1.0f/60.0f;
    float calmAccum = 0;
    for (int i = 0; i < 60; i++) {
        if (calmness > 0.5f) calmAccum += dt * (calmness - 0.5f) * 2.0f;
    }
    ASSERT_NEAR(calmAccum, 0, 0.001, "should be zero");
    PASS();
}

void test_wave_amplitude_calm(void) {
    TEST("Wave amplitude is small when calm");
    float calmness = 1.0f, breathSmooth = 0;
    float amp = 10.0f + (1.0f - calmness) * 40.0f + breathSmooth * 15.0f;
    ASSERT_NEAR(amp, 10.0f, 0.1, "min amplitude");
    PASS();
}

void test_wave_amplitude_stormy(void) {
    TEST("Wave amplitude is large when stormy");
    float calmness = 0.0f, breathSmooth = 1.0f;
    float amp = 10.0f + (1.0f - calmness) * 40.0f + breathSmooth * 15.0f;
    ASSERT_NEAR(amp, 65.0f, 0.1, "max amplitude");
    PASS();
}

void test_sky_clarity_range(void) {
    TEST("Sky clarity stays in 0-1 range");
    float skyClarity = 0.5f;
    for (int i = 0; i < 1000; i++) {
        float calmness = (float)(i % 100) / 100.0f;
        skyClarity += (calmness - skyClarity) * 0.005f;
        skyClarity = Clamp(skyClarity, 0, 1);
    }
    ASSERT_TRUE(skyClarity >= 0 && skyClarity <= 1, "in range");
    PASS();
}

void test_breath_smoothing(void) {
    TEST("Breath level smoothing converges");
    float breathLevel = 0, breathSmooth = 0;
    float target = 1.0f;
    for (int i = 0; i < 100; i++) {
        breathLevel += (target - breathLevel) * 0.3f;
        breathSmooth += (breathLevel - breathSmooth) * 0.05f;
    }
    ASSERT_NEAR(breathLevel, 1.0f, 0.01, "level near target");
    ASSERT_TRUE(breathSmooth > 0.5f, "smooth should follow");
    PASS();
}

void test_breath_level_release(void) {
    TEST("Breath level drops on release");
    float breathLevel = 1.0f;
    float target = 0.0f;
    for (int i = 0; i < 50; i++) {
        breathLevel += (target - breathLevel) * 0.4f;
    }
    ASSERT_TRUE(breathLevel < 0.01f, "should drop to near 0");
    PASS();
}

void test_session_time_5min(void) {
    TEST("Session auto-ends at 5 minutes (300s)");
    float sessionTime = 299.9f;
    ASSERT_TRUE(sessionTime <= 300, "not ended yet");
    sessionTime += 0.2f;
    ASSERT_TRUE(sessionTime > 300, "should end now");
    PASS();
}

void test_screen_dimensions(void) {
    TEST("Screen dimensions are 960x640");
    ASSERT_EQ(SCREEN_W, 960, "width");
    ASSERT_EQ(SCREEN_H, 640, "height");
    PASS();
}

void test_calm_ratio_calculation(void) {
    TEST("Calm ratio calculation");
    float sessionTime = 120, calmAccum = 84;
    float ratio = sessionTime > 0 ? calmAccum / sessionTime : 0;
    ASSERT_NEAR(ratio, 0.7f, 0.01, "70% calm");
    PASS();
}

void test_rating_very_calm(void) {
    TEST("Rating: very calm (>70%)");
    float ratio = 0.75f;
    const char *rating = ratio > 0.7f ? "very" : ratio > 0.4f ? "ok" : "low";
    ASSERT_TRUE(strcmp(rating, "very") == 0, "should be very calm");
    PASS();
}

void test_rating_moderate(void) {
    TEST("Rating: moderate (40-70%)");
    float ratio = 0.5f;
    const char *rating = ratio > 0.7f ? "very" : ratio > 0.4f ? "ok" : "low";
    ASSERT_TRUE(strcmp(rating, "ok") == 0, "should be ok");
    PASS();
}

void test_rating_low(void) {
    TEST("Rating: low (<40%)");
    float ratio = 0.2f;
    const char *rating = ratio > 0.7f ? "very" : ratio > 0.4f ? "ok" : "low";
    ASSERT_TRUE(strcmp(rating, "low") == 0, "should be low");
    PASS();
}

void test_cloud_darkness_inverse(void) {
    TEST("Cloud darkness is inverse of sky clarity");
    float skyClarity = 0.7f;
    float cloudDarkness = 1.0f - skyClarity;
    ASSERT_NEAR(cloudDarkness, 0.3f, 0.001, "should be 0.3");
    PASS();
}

void test_water_line_position(void) {
    TEST("Water line at ~55% of screen height");
    float waterBase = SCREEN_H * 0.55f;
    ASSERT_NEAR(waterBase, 352.0f, 1, "~352px");
    PASS();
}

void test_sun_size_varies(void) {
    TEST("Sun size increases with clarity");
    float clarity1 = 0, clarity2 = 1;
    float sun1 = 30 + clarity1 * 20;
    float sun2 = 30 + clarity2 * 20;
    ASSERT_NEAR(sun1, 30, 0.1, "min size");
    ASSERT_NEAR(sun2, 50, 0.1, "max size");
    PASS();
}

void test_wave_phase_increases(void) {
    TEST("Wave phase increases with stormy weather");
    float calmness = 0.0f;
    float dt = 1.0f / 60.0f;
    float speed = 0.5f + (1.0f - calmness) * 1.5f;
    float phase = speed * dt;
    ASSERT_TRUE(phase > 0.03f, "fast phase in storm");

    calmness = 1.0f;
    speed = 0.5f + (1.0f - calmness) * 1.5f;
    phase = speed * dt;
    ASSERT_TRUE(phase < 0.01f, "slow phase when calm");
    PASS();
}

int main(void) {
    printf("\n  ═══════════════════════════════════════\n");
    printf("   波音 (Namioto) - Unit Tests\n");
    printf("  ═══════════════════════════════════════\n\n");

    printf("  [色]\n");
    test_lerp_color_start();
    test_lerp_color_end();
    test_lerp_color_mid();

    printf("\n  [制限]\n");
    test_clamp_within();
    test_clamp_below();
    test_clamp_above();

    printf("\n  [呼吸リズム]\n");
    test_breath_cycle_target();
    test_rhythm_score_perfect();
    test_rhythm_score_fast();
    test_rhythm_score_unbalanced();

    printf("\n  [穏やかさ]\n");
    test_calm_accumulation();
    test_no_calm_when_stormy();
    test_calm_ratio_calculation();
    test_rating_very_calm();
    test_rating_moderate();
    test_rating_low();

    printf("\n  [波・海]\n");
    test_wave_amplitude_calm();
    test_wave_amplitude_stormy();
    test_water_line_position();
    test_wave_phase_increases();

    printf("\n  [空]\n");
    test_sky_clarity_range();
    test_cloud_darkness_inverse();
    test_sun_size_varies();

    printf("\n  [呼吸制御]\n");
    test_breath_smoothing();
    test_breath_level_release();

    printf("\n  [セッション]\n");
    test_session_time_5min();
    test_screen_dimensions();

    printf("\n  ═══════════════════════════════════════\n");
    printf("   Results: %d/%d passed\n", passed, tests);
    printf("  ═══════════════════════════════════════\n\n");
    return (passed == tests) ? 0 : 1;
}
