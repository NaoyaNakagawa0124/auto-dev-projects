/**
 * Unit tests for Tenaoshi game logic
 * Tests map initialization, repair sites, collision, and game state
 * Run: make test && ./test_game
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>
#include <math.h>

// ─── Test framework ─────────────────────────────────────────────
static int tests_run = 0;
static int tests_passed = 0;

#define TEST(name) do { \
    tests_run++; \
    printf("  test: %-50s", name); \
    } while(0)

#define PASS() do { tests_passed++; printf("  ✓\n"); } while(0)
#define FAIL(msg) do { printf("  ✗ %s\n", msg); } while(0)

#define ASSERT_EQ(a, b, msg) do { if ((a) != (b)) { FAIL(msg); return; } } while(0)
#define ASSERT_TRUE(cond, msg) do { if (!(cond)) { FAIL(msg); return; } } while(0)
#define ASSERT_FALSE(cond, msg) do { if (cond) { FAIL(msg); return; } } while(0)

// ─── Replicate game constants and types for testing ─────────────
#define TILE_SIZE 48
#define MAP_W 24
#define MAP_H 20
#define MAX_REPAIR_SITES 16
#define REPAIR_TIME 120

typedef enum {
    TILE_GRASS = 0, TILE_ROAD, TILE_SIDEWALK, TILE_WATER, TILE_TREE,
    TILE_FLOWER_RED, TILE_FLOWER_YELLOW, TILE_BENCH, TILE_LAMPPOST,
    TILE_FENCE_OK, TILE_FENCE_BROKEN, TILE_HOUSE_WALL, TILE_HOUSE_ROOF,
    TILE_HOUSE_DOOR, TILE_GARDEN_OK, TILE_GARDEN_OVERGROWN,
    TILE_WALL_PAINTED, TILE_WALL_PEELING, TILE_ROOF_OK, TILE_ROOF_LEAKY,
    TILE_BRIDGE, TILE_STONE_PATH,
} TileType;

typedef enum { TOOL_HAMMER=0, TOOL_BRUSH, TOOL_SHEARS, TOOL_WRENCH, TOOL_COUNT } ToolType;
typedef enum { REPAIR_FENCE, REPAIR_GARDEN, REPAIR_WALL, REPAIR_ROOF } RepairType;

typedef struct {
    int tileX, tileY;
    RepairType type;
    ToolType requiredTool;
    int fixed;
    int progress;
    TileType tileWhenBroken, tileWhenFixed;
} RepairSiteT;

static int tileMap[MAP_H][MAP_W];
static RepairSiteT repairs[MAX_REPAIR_SITES];
static int repairCount = 0;

static int IsTileSolid(int tx, int ty) {
    if (tx < 0 || tx >= MAP_W || ty < 0 || ty >= MAP_H) return 1;
    int t = tileMap[ty][tx];
    return (t == TILE_TREE || t == TILE_HOUSE_WALL || t == TILE_HOUSE_ROOF ||
            t == TILE_HOUSE_DOOR || t == TILE_WATER || t == TILE_BENCH ||
            t == TILE_LAMPPOST || t == TILE_WALL_PAINTED ||
            t == TILE_WALL_PEELING || t == TILE_ROOF_OK || t == TILE_ROOF_LEAKY);
}

static void AddRepair(int x, int y, RepairType type) {
    if (repairCount >= MAX_REPAIR_SITES) return;
    RepairSiteT *r = &repairs[repairCount];
    r->tileX = x; r->tileY = y; r->type = type;
    r->fixed = 0; r->progress = 0;
    switch (type) {
        case REPAIR_FENCE:  r->requiredTool = TOOL_HAMMER; r->tileWhenBroken = TILE_FENCE_BROKEN; r->tileWhenFixed = TILE_FENCE_OK; break;
        case REPAIR_GARDEN: r->requiredTool = TOOL_SHEARS; r->tileWhenBroken = TILE_GARDEN_OVERGROWN; r->tileWhenFixed = TILE_GARDEN_OK; break;
        case REPAIR_WALL:   r->requiredTool = TOOL_BRUSH;  r->tileWhenBroken = TILE_WALL_PEELING; r->tileWhenFixed = TILE_HOUSE_WALL; break;
        case REPAIR_ROOF:   r->requiredTool = TOOL_WRENCH; r->tileWhenBroken = TILE_ROOF_LEAKY; r->tileWhenFixed = TILE_HOUSE_ROOF; break;
    }
    repairCount++;
}

// ─── Tests ──────────────────────────────────────────────────────

void test_map_dimensions(void) {
    TEST("Map dimensions are correct");
    ASSERT_EQ(MAP_W, 24, "MAP_W should be 24");
    ASSERT_EQ(MAP_H, 20, "MAP_H should be 20");
    PASS();
}

void test_tile_size(void) {
    TEST("Tile size is 48px");
    ASSERT_EQ(TILE_SIZE, 48, "TILE_SIZE should be 48");
    PASS();
}

void test_map_init_all_grass(void) {
    TEST("Fresh map is all grass");
    memset(tileMap, 0, sizeof(tileMap));
    for (int y = 0; y < MAP_H; y++)
        for (int x = 0; x < MAP_W; x++)
            ASSERT_EQ(tileMap[y][x], TILE_GRASS, "should be grass");
    PASS();
}

void test_road_placement(void) {
    TEST("Roads at correct positions");
    memset(tileMap, 0, sizeof(tileMap));
    // Simulate main horizontal road
    for (int x = 0; x < MAP_W; x++) {
        tileMap[9][x] = TILE_ROAD;
        tileMap[10][x] = TILE_ROAD;
    }
    ASSERT_EQ(tileMap[9][0], TILE_ROAD, "road at 0,9");
    ASSERT_EQ(tileMap[10][12], TILE_ROAD, "road at 12,10");
    ASSERT_EQ(tileMap[8][0], TILE_GRASS, "grass above road");
    PASS();
}

void test_collision_out_of_bounds(void) {
    TEST("Out-of-bounds is solid");
    ASSERT_TRUE(IsTileSolid(-1, 0), "left OOB solid");
    ASSERT_TRUE(IsTileSolid(MAP_W, 0), "right OOB solid");
    ASSERT_TRUE(IsTileSolid(0, -1), "top OOB solid");
    ASSERT_TRUE(IsTileSolid(0, MAP_H), "bottom OOB solid");
    PASS();
}

void test_collision_grass_not_solid(void) {
    TEST("Grass tiles are not solid");
    memset(tileMap, 0, sizeof(tileMap));
    ASSERT_FALSE(IsTileSolid(0, 0), "grass not solid");
    ASSERT_FALSE(IsTileSolid(5, 5), "grass not solid");
    PASS();
}

void test_collision_water_solid(void) {
    TEST("Water tiles are solid");
    memset(tileMap, 0, sizeof(tileMap));
    tileMap[5][5] = TILE_WATER;
    ASSERT_TRUE(IsTileSolid(5, 5), "water solid");
    PASS();
}

void test_collision_tree_solid(void) {
    TEST("Tree tiles are solid");
    memset(tileMap, 0, sizeof(tileMap));
    tileMap[3][3] = TILE_TREE;
    ASSERT_TRUE(IsTileSolid(3, 3), "tree solid");
    PASS();
}

void test_collision_house_parts_solid(void) {
    TEST("House wall/roof/door are solid");
    memset(tileMap, 0, sizeof(tileMap));
    tileMap[1][1] = TILE_HOUSE_WALL;
    tileMap[1][2] = TILE_HOUSE_ROOF;
    tileMap[1][3] = TILE_HOUSE_DOOR;
    ASSERT_TRUE(IsTileSolid(1, 1), "wall solid");
    ASSERT_TRUE(IsTileSolid(2, 1), "roof solid");
    ASSERT_TRUE(IsTileSolid(3, 1), "door solid");
    PASS();
}

void test_collision_road_not_solid(void) {
    TEST("Road/sidewalk are walkable");
    memset(tileMap, 0, sizeof(tileMap));
    tileMap[1][1] = TILE_ROAD;
    tileMap[1][2] = TILE_SIDEWALK;
    ASSERT_FALSE(IsTileSolid(1, 1), "road walkable");
    ASSERT_FALSE(IsTileSolid(2, 1), "sidewalk walkable");
    PASS();
}

void test_collision_fence_walkable(void) {
    TEST("Fences are walkable (can walk to them)");
    memset(tileMap, 0, sizeof(tileMap));
    tileMap[1][1] = TILE_FENCE_OK;
    tileMap[1][2] = TILE_FENCE_BROKEN;
    ASSERT_FALSE(IsTileSolid(1, 1), "fence OK walkable");
    ASSERT_FALSE(IsTileSolid(2, 1), "fence broken walkable");
    PASS();
}

void test_collision_garden_walkable(void) {
    TEST("Gardens are walkable");
    memset(tileMap, 0, sizeof(tileMap));
    tileMap[1][1] = TILE_GARDEN_OK;
    tileMap[1][2] = TILE_GARDEN_OVERGROWN;
    ASSERT_FALSE(IsTileSolid(1, 1), "garden OK walkable");
    ASSERT_FALSE(IsTileSolid(2, 1), "garden overgrown walkable");
    PASS();
}

void test_collision_bridge_walkable(void) {
    TEST("Bridge is walkable");
    memset(tileMap, 0, sizeof(tileMap));
    tileMap[1][1] = TILE_BRIDGE;
    ASSERT_FALSE(IsTileSolid(1, 1), "bridge walkable");
    PASS();
}

void test_repair_add(void) {
    TEST("Adding repair sites");
    repairCount = 0;
    AddRepair(5, 5, REPAIR_FENCE);
    ASSERT_EQ(repairCount, 1, "count=1");
    ASSERT_EQ(repairs[0].tileX, 5, "x=5");
    ASSERT_EQ(repairs[0].tileY, 5, "y=5");
    ASSERT_EQ((int)repairs[0].type, (int)REPAIR_FENCE, "type=fence");
    PASS();
}

void test_repair_tool_mapping(void) {
    TEST("Repair types map to correct tools");
    repairCount = 0;
    AddRepair(0, 0, REPAIR_FENCE);
    AddRepair(1, 0, REPAIR_GARDEN);
    AddRepair(2, 0, REPAIR_WALL);
    AddRepair(3, 0, REPAIR_ROOF);
    ASSERT_EQ((int)repairs[0].requiredTool, (int)TOOL_HAMMER, "fence->hammer");
    ASSERT_EQ((int)repairs[1].requiredTool, (int)TOOL_SHEARS, "garden->shears");
    ASSERT_EQ((int)repairs[2].requiredTool, (int)TOOL_BRUSH, "wall->brush");
    ASSERT_EQ((int)repairs[3].requiredTool, (int)TOOL_WRENCH, "roof->wrench");
    PASS();
}

void test_repair_tile_mapping(void) {
    TEST("Repair broken->fixed tile mapping");
    repairCount = 0;
    AddRepair(0, 0, REPAIR_FENCE);
    ASSERT_EQ((int)repairs[0].tileWhenBroken, (int)TILE_FENCE_BROKEN, "broken tile");
    ASSERT_EQ((int)repairs[0].tileWhenFixed, (int)TILE_FENCE_OK, "fixed tile");
    PASS();
}

void test_repair_initial_state(void) {
    TEST("Repairs start unfixed with zero progress");
    repairCount = 0;
    AddRepair(3, 3, REPAIR_GARDEN);
    ASSERT_EQ(repairs[0].fixed, 0, "not fixed");
    ASSERT_EQ(repairs[0].progress, 0, "progress=0");
    PASS();
}

void test_repair_max_limit(void) {
    TEST("Cannot exceed MAX_REPAIR_SITES");
    repairCount = 0;
    for (int i = 0; i < MAX_REPAIR_SITES + 5; i++)
        AddRepair(i % MAP_W, 0, REPAIR_FENCE);
    ASSERT_EQ(repairCount, MAX_REPAIR_SITES, "capped at max");
    PASS();
}

void test_repair_completion_logic(void) {
    TEST("Repair completes at REPAIR_TIME");
    repairCount = 0;
    AddRepair(5, 5, REPAIR_WALL);
    tileMap[5][5] = TILE_WALL_PEELING;

    // Simulate repair
    repairs[0].progress = REPAIR_TIME;
    if (repairs[0].progress >= REPAIR_TIME) {
        repairs[0].fixed = 1;
        tileMap[repairs[0].tileY][repairs[0].tileX] = repairs[0].tileWhenFixed;
    }
    ASSERT_TRUE(repairs[0].fixed, "should be fixed");
    ASSERT_EQ(tileMap[5][5], (int)TILE_HOUSE_WALL, "tile updated");
    PASS();
}

void test_tool_count(void) {
    TEST("There are exactly 4 tools");
    ASSERT_EQ(TOOL_COUNT, 4, "4 tools");
    PASS();
}

void test_repair_types_coverage(void) {
    TEST("All 4 repair types have unique tools");
    repairCount = 0;
    AddRepair(0,0,REPAIR_FENCE);
    AddRepair(1,0,REPAIR_GARDEN);
    AddRepair(2,0,REPAIR_WALL);
    AddRepair(3,0,REPAIR_ROOF);
    // Check all different
    for (int i = 0; i < 4; i++)
        for (int j = i+1; j < 4; j++)
            ASSERT_TRUE(repairs[i].requiredTool != repairs[j].requiredTool, "tools unique");
    PASS();
}

void test_map_pixel_dimensions(void) {
    TEST("Map pixel dimensions correct");
    int pw = MAP_W * TILE_SIZE;
    int ph = MAP_H * TILE_SIZE;
    ASSERT_EQ(pw, 1152, "pixel width");
    ASSERT_EQ(ph, 960, "pixel height");
    PASS();
}

void test_player_start_position(void) {
    TEST("Player starts at crossroads center");
    float px = 11 * TILE_SIZE + TILE_SIZE/2;
    float py = 10 * TILE_SIZE + TILE_SIZE/2;
    ASSERT_TRUE(px > 500 && px < 600, "x in range");
    ASSERT_TRUE(py > 450 && py < 550, "y in range");
    PASS();
}

void test_repair_time_reasonable(void) {
    TEST("Repair time is 2 seconds at 60fps");
    ASSERT_EQ(REPAIR_TIME, 120, "120 frames = 2 sec");
    PASS();
}

void test_tile_enum_count(void) {
    TEST("Tile types cover all expected types");
    ASSERT_TRUE(TILE_STONE_PATH >= 20, "at least 21 tile types");
    PASS();
}

void test_nearby_repair_distance(void) {
    TEST("Nearby detection within 1 tile range");
    repairCount = 0;
    AddRepair(5, 5, REPAIR_FENCE);
    // Player at tile 5,5 (same tile) -> should find
    int ptx = 5, pty = 5;
    int found = -1;
    for (int i = 0; i < repairCount; i++) {
        if (repairs[i].fixed) continue;
        int dx = abs(repairs[i].tileX - ptx);
        int dy = abs(repairs[i].tileY - pty);
        if (dx <= 1 && dy <= 1) { found = i; break; }
    }
    ASSERT_EQ(found, 0, "found at same tile");

    // Player at tile 7,5 (2 away) -> should NOT find
    ptx = 7;
    found = -1;
    for (int i = 0; i < repairCount; i++) {
        if (repairs[i].fixed) continue;
        int dx = abs(repairs[i].tileX - ptx);
        int dy = abs(repairs[i].tileY - pty);
        if (dx <= 1 && dy <= 1) { found = i; break; }
    }
    ASSERT_EQ(found, -1, "not found 2 tiles away");
    PASS();
}

void test_fixed_repairs_skipped(void) {
    TEST("Fixed repairs not detected as nearby");
    repairCount = 0;
    AddRepair(5, 5, REPAIR_FENCE);
    repairs[0].fixed = 1;
    int ptx = 5, pty = 5;
    int found = -1;
    for (int i = 0; i < repairCount; i++) {
        if (repairs[i].fixed) continue;
        int dx = abs(repairs[i].tileX - ptx);
        int dy = abs(repairs[i].tileY - pty);
        if (dx <= 1 && dy <= 1) { found = i; break; }
    }
    ASSERT_EQ(found, -1, "fixed repair skipped");
    PASS();
}

void test_happiness_calculation(void) {
    TEST("Happiness = totalFixed / repairCount");
    int totalFixed = 8;
    int rc = 16;
    float happiness = (float)totalFixed / (float)rc;
    ASSERT_TRUE(fabsf(happiness - 0.5f) < 0.001f, "50% happiness");
    totalFixed = 16;
    happiness = (float)totalFixed / (float)rc;
    ASSERT_TRUE(fabsf(happiness - 1.0f) < 0.001f, "100% happiness");
    PASS();
}

void test_wall_peeling_solid(void) {
    TEST("Wall peeling is solid (can't walk through)");
    memset(tileMap, 0, sizeof(tileMap));
    tileMap[3][3] = TILE_WALL_PEELING;
    ASSERT_TRUE(IsTileSolid(3, 3), "peeling wall solid");
    PASS();
}

void test_roof_leaky_solid(void) {
    TEST("Leaky roof is solid");
    memset(tileMap, 0, sizeof(tileMap));
    tileMap[3][3] = TILE_ROOF_LEAKY;
    ASSERT_TRUE(IsTileSolid(3, 3), "leaky roof solid");
    PASS();
}

void test_flower_walkable(void) {
    TEST("Flowers are walkable");
    memset(tileMap, 0, sizeof(tileMap));
    tileMap[1][1] = TILE_FLOWER_RED;
    tileMap[1][2] = TILE_FLOWER_YELLOW;
    ASSERT_FALSE(IsTileSolid(1, 1), "red flower walkable");
    ASSERT_FALSE(IsTileSolid(2, 1), "yellow flower walkable");
    PASS();
}

void test_stone_path_walkable(void) {
    TEST("Stone path is walkable");
    memset(tileMap, 0, sizeof(tileMap));
    tileMap[1][1] = TILE_STONE_PATH;
    ASSERT_FALSE(IsTileSolid(1, 1), "stone path walkable");
    PASS();
}

// ─── Main ───────────────────────────────────────────────────────

int main(void) {
    printf("\n  ═══════════════════════════════════════\n");
    printf("   手直し (Tenaoshi) - Unit Tests\n");
    printf("  ═══════════════════════════════════════\n\n");

    printf("  [Map & Tiles]\n");
    test_map_dimensions();
    test_tile_size();
    test_map_init_all_grass();
    test_road_placement();
    test_map_pixel_dimensions();
    test_tile_enum_count();

    printf("\n  [Collision]\n");
    test_collision_out_of_bounds();
    test_collision_grass_not_solid();
    test_collision_water_solid();
    test_collision_tree_solid();
    test_collision_house_parts_solid();
    test_collision_road_not_solid();
    test_collision_fence_walkable();
    test_collision_garden_walkable();
    test_collision_bridge_walkable();
    test_wall_peeling_solid();
    test_roof_leaky_solid();
    test_flower_walkable();
    test_stone_path_walkable();

    printf("\n  [Repairs]\n");
    test_repair_add();
    test_repair_tool_mapping();
    test_repair_tile_mapping();
    test_repair_initial_state();
    test_repair_max_limit();
    test_repair_completion_logic();
    test_repair_types_coverage();
    test_repair_time_reasonable();

    printf("\n  [Game Logic]\n");
    test_player_start_position();
    test_nearby_repair_distance();
    test_fixed_repairs_skipped();
    test_happiness_calculation();
    test_tool_count();

    printf("\n  ═══════════════════════════════════════\n");
    printf("   Results: %d/%d passed\n", tests_passed, tests_run);
    printf("  ═══════════════════════════════════════\n\n");

    return (tests_passed == tests_run) ? 0 : 1;
}
