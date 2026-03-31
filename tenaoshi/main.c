/***********************************************************************
 * 手直し (Tenaoshi) - ご近所リフォームゲーム
 * A cozy top-down neighborhood renovation game
 * Built with Raylib 5.5
 ***********************************************************************/

#include "raylib.h"
#include "raymath.h"
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <math.h>

// ─── Constants ──────────────────────────────────────────────────────
#define SCREEN_W 960
#define SCREEN_H 720
#define TILE_SIZE 48
#define MAP_W 24
#define MAP_H 20
#define PLAYER_SPEED 3.0f
#define MAX_REPAIR_SITES 16
#define MAX_PARTICLES 200
#define REPAIR_TIME 120  // frames to complete repair (~2 seconds)

// ─── Tile Types ─────────────────────────────────────────────────────
typedef enum {
    TILE_GRASS = 0,
    TILE_ROAD,
    TILE_SIDEWALK,
    TILE_WATER,
    TILE_TREE,
    TILE_FLOWER_RED,
    TILE_FLOWER_YELLOW,
    TILE_BENCH,
    TILE_LAMPPOST,
    TILE_FENCE_OK,
    TILE_FENCE_BROKEN,
    TILE_HOUSE_WALL,
    TILE_HOUSE_ROOF,
    TILE_HOUSE_DOOR,
    TILE_GARDEN_OK,
    TILE_GARDEN_OVERGROWN,
    TILE_WALL_PAINTED,
    TILE_WALL_PEELING,
    TILE_ROOF_OK,
    TILE_ROOF_LEAKY,
    TILE_BRIDGE,
    TILE_STONE_PATH,
} TileType;

// ─── Tool Types ─────────────────────────────────────────────────────
typedef enum {
    TOOL_HAMMER = 0,   // For fences, roofs
    TOOL_BRUSH,        // For walls (painting)
    TOOL_SHEARS,       // For gardens
    TOOL_WRENCH,       // For general repairs
    TOOL_COUNT
} ToolType;

// ─── Repair Site ────────────────────────────────────────────────────
typedef enum {
    REPAIR_FENCE,
    REPAIR_GARDEN,
    REPAIR_WALL,
    REPAIR_ROOF,
} RepairType;

typedef struct {
    int tileX, tileY;
    RepairType type;
    ToolType requiredTool;
    bool fixed;
    int progress;      // 0..REPAIR_TIME
    const char *descBefore;
    const char *descAfter;
    TileType tileWhenBroken;
    TileType tileWhenFixed;
} RepairSite;

// ─── Particle ───────────────────────────────────────────────────────
typedef struct {
    Vector2 pos;
    Vector2 vel;
    Color color;
    float life;
    float maxLife;
    bool active;
} Particle;

// ─── Game State ─────────────────────────────────────────────────────
typedef enum {
    STATE_TITLE,
    STATE_PLAYING,
    STATE_REPAIRING,
    STATE_VICTORY,
} GameState;

// ─── Globals ────────────────────────────────────────────────────────
static int tileMap[MAP_H][MAP_W];
static RepairSite repairs[MAX_REPAIR_SITES];
static int repairCount = 0;
static Particle particles[MAX_PARTICLES];

static Vector2 playerPos;
static int playerDir = 0;  // 0=down,1=up,2=left,3=right
static int playerFrame = 0;
static int frameCounter = 0;

static ToolType currentTool = TOOL_HAMMER;
static GameState gameState = STATE_TITLE;
static int activeRepair = -1;
static int totalFixed = 0;
static float happiness = 0.0f;
static float titleAlpha = 0.0f;
static int victoryTimer = 0;

static Camera2D camera = {0};
static Font jpFont;
static bool fontLoaded = false;

// ─── Color Palette (warm, cozy) ────────────────────────────────────
#define COL_GRASS      (Color){124, 172, 88, 255}
#define COL_GRASS_DARK (Color){108, 156, 72, 255}
#define COL_ROAD       (Color){168, 160, 148, 255}
#define COL_SIDEWALK   (Color){200, 192, 180, 255}
#define COL_WATER      (Color){100, 160, 210, 255}
#define COL_WATER_DEEP (Color){80, 140, 190, 255}
#define COL_TREE_TRUNK (Color){120, 80, 50, 255}
#define COL_TREE_TOP   (Color){60, 130, 60, 255}
#define COL_HOUSE_WALL (Color){230, 215, 190, 255}
#define COL_HOUSE_ROOF_COL (Color){180, 80, 60, 255}
#define COL_HOUSE_DOOR_COL (Color){140, 90, 50, 255}
#define COL_FENCE_COL  (Color){190, 170, 140, 255}
#define COL_FENCE_BROKEN_COL (Color){140, 120, 100, 255}
#define COL_WALL_PEEL  (Color){200, 185, 160, 255}
#define COL_ROOF_LEAK  (Color){160, 70, 55, 255}
#define COL_GARDEN_OK  (Color){80, 160, 80, 255}
#define COL_GARDEN_BAD (Color){140, 150, 80, 255}
#define COL_FLOWER_R   (Color){220, 60, 80, 255}
#define COL_FLOWER_Y   (Color){240, 200, 60, 255}
#define COL_BENCH_COL  (Color){160, 120, 80, 255}
#define COL_LAMP_COL   (Color){100, 100, 110, 255}
#define COL_BRIDGE_COL (Color){170, 140, 100, 255}
#define COL_STONE_COL  (Color){180, 175, 165, 255}
#define COL_UI_BG      (Color){40, 35, 30, 200}
#define COL_UI_TEXT    (Color){250, 245, 235, 255}
#define COL_HAPPY      (Color){255, 200, 80, 255}
#define COL_PROGRESS   (Color){100, 200, 120, 255}
#define COL_HIGHLIGHT  (Color){255, 255, 100, 80}

// ─── Tool info ──────────────────────────────────────────────────────
static const char *toolNamesJP[TOOL_COUNT] = {
    "ハンマー",
    "ペイント",
    "はさみ",
    "レンチ",
};
static const Color toolColors[TOOL_COUNT] = {
    {180, 140, 100, 255},
    {100, 160, 220, 255},
    {120, 180, 80, 255},
    {160, 160, 170, 255},
};

// ─── Forward Declarations ───────────────────────────────────────────
static void InitMap(void);
static void AddRepairSite(int x, int y, RepairType type, const char *before, const char *after);
static void DrawTile(int x, int y, int type);
static void DrawPlayer(void);
static void DrawUI(void);
static void DrawTitle(void);
static void DrawVictory(void);
static void UpdateParticles(void);
static void DrawParticles(void);
static void SpawnParticles(float x, float y, Color color, int count);
static int FindNearbyRepair(void);
static bool IsTileSolid(int tx, int ty);

// ═══════════════════════════════════════════════════════════════════
//  Map Initialization
// ═══════════════════════════════════════════════════════════════════

static void InitMap(void) {
    // Fill with grass
    for (int y = 0; y < MAP_H; y++)
        for (int x = 0; x < MAP_W; x++)
            tileMap[y][x] = TILE_GRASS;

    // Main horizontal road (y=9,10)
    for (int x = 0; x < MAP_W; x++) {
        tileMap[9][x] = TILE_ROAD;
        tileMap[10][x] = TILE_ROAD;
        if (x > 0 && x < MAP_W-1) {
            tileMap[8][x] = TILE_SIDEWALK;
            tileMap[11][x] = TILE_SIDEWALK;
        }
    }

    // Vertical road (x=11,12)
    for (int y = 0; y < MAP_H; y++) {
        tileMap[y][11] = TILE_ROAD;
        tileMap[y][12] = TILE_ROAD;
        if (y != 9 && y != 10) {
            if (tileMap[y][10] == TILE_GRASS) tileMap[y][10] = TILE_SIDEWALK;
            if (tileMap[y][13] == TILE_GRASS) tileMap[y][13] = TILE_SIDEWALK;
        }
    }

    // Small pond (bottom-right)
    tileMap[15][18] = TILE_WATER; tileMap[15][19] = TILE_WATER; tileMap[15][20] = TILE_WATER;
    tileMap[16][17] = TILE_WATER; tileMap[16][18] = TILE_WATER; tileMap[16][19] = TILE_WATER;
    tileMap[16][20] = TILE_WATER; tileMap[16][21] = TILE_WATER;
    tileMap[17][18] = TILE_WATER; tileMap[17][19] = TILE_WATER; tileMap[17][20] = TILE_WATER;

    // Bridge over pond
    tileMap[16][19] = TILE_BRIDGE;

    // Stone path to pond
    tileMap[12][18] = TILE_STONE_PATH; tileMap[13][18] = TILE_STONE_PATH;
    tileMap[14][18] = TILE_STONE_PATH; tileMap[14][19] = TILE_STONE_PATH;

    // ─── House 1 (top-left) ───
    for (int x = 2; x <= 5; x++) {
        tileMap[2][x] = TILE_HOUSE_ROOF;
        tileMap[3][x] = TILE_HOUSE_WALL;
    }
    tileMap[3][3] = TILE_HOUSE_DOOR;
    tileMap[4][2] = TILE_FENCE_BROKEN;  // Repair site!
    tileMap[4][3] = TILE_GARDEN_OVERGROWN;  // Repair site!
    tileMap[4][4] = TILE_FENCE_OK;
    tileMap[4][5] = TILE_FENCE_OK;

    // ─── House 2 (top-right) ───
    for (int x = 15; x <= 18; x++) {
        tileMap[2][x] = TILE_HOUSE_ROOF;
        tileMap[3][x] = TILE_WALL_PEELING;  // Repair site!
    }
    tileMap[3][16] = TILE_HOUSE_DOOR;
    tileMap[2][15] = TILE_ROOF_LEAKY;  // Repair site!
    tileMap[4][15] = TILE_GARDEN_OK;
    tileMap[4][16] = TILE_FLOWER_RED;
    tileMap[4][17] = TILE_FLOWER_YELLOW;

    // ─── House 3 (bottom-left) ───
    for (int x = 2; x <= 5; x++) {
        tileMap[13][x] = TILE_HOUSE_ROOF;
        tileMap[14][x] = TILE_HOUSE_WALL;
    }
    tileMap[14][4] = TILE_HOUSE_DOOR;
    tileMap[12][2] = TILE_FENCE_OK;
    tileMap[12][3] = TILE_FENCE_BROKEN;  // Repair site!
    tileMap[12][4] = TILE_FENCE_OK;
    tileMap[12][5] = TILE_FENCE_OK;
    tileMap[15][3] = TILE_GARDEN_OVERGROWN;  // Repair site!
    tileMap[15][4] = TILE_GARDEN_OVERGROWN;  // Repair site!

    // ─── House 4 (bottom-right area) ───
    for (int x = 15; x <= 18; x++) {
        tileMap[12][x] = TILE_ROOF_LEAKY;  // Repair site!
        tileMap[13][x] = TILE_WALL_PEELING;  // Repair site!
    }
    tileMap[13][17] = TILE_HOUSE_DOOR;
    tileMap[14][15] = TILE_FENCE_BROKEN;  // Repair site!
    tileMap[14][16] = TILE_FLOWER_RED;

    // ─── House 5 (far left, mid) ───
    for (int x = 1; x <= 3; x++) {
        tileMap[6][x] = TILE_HOUSE_ROOF;
        tileMap[7][x] = TILE_HOUSE_WALL;
    }
    tileMap[7][2] = TILE_HOUSE_DOOR;

    // ─── House 6 (far right, mid) ───
    for (int x = 20; x <= 22; x++) {
        tileMap[6][x] = TILE_HOUSE_ROOF;
        tileMap[7][x] = TILE_WALL_PEELING;  // Repair site!
    }
    tileMap[7][21] = TILE_HOUSE_DOOR;
    tileMap[5][20] = TILE_GARDEN_OVERGROWN;  // Repair site!

    // Trees scattered
    int treePositions[][2] = {
        {0,0},{0,4},{0,14},{0,19},{1,19},{7,0},{7,8},
        {19,0},{19,7},{19,14},{19,22},{8,22},{5,8},
        {1,8},{18,8},{18,22},{3,9},{15,1},{9,22},
    };
    for (int i = 0; i < 19; i++) {
        int ty = treePositions[i][0], tx = treePositions[i][1];
        if (ty >= 0 && ty < MAP_H && tx >= 0 && tx < MAP_W && tileMap[ty][tx] == TILE_GRASS)
            tileMap[ty][tx] = TILE_TREE;
    }

    // Benches and lampposts along roads
    tileMap[8][5] = TILE_BENCH;
    tileMap[8][16] = TILE_BENCH;
    tileMap[11][3] = TILE_LAMPPOST;
    tileMap[11][8] = TILE_LAMPPOST;
    tileMap[11][16] = TILE_LAMPPOST;
    tileMap[11][21] = TILE_LAMPPOST;

    // Flowers in park area
    tileMap[17][15] = TILE_FLOWER_RED;
    tileMap[17][16] = TILE_FLOWER_YELLOW;
    tileMap[18][17] = TILE_FLOWER_RED;
    tileMap[18][15] = TILE_FLOWER_YELLOW;
    tileMap[18][16] = TILE_FLOWER_RED;

    // ─── Register Repair Sites ───
    repairCount = 0;
    AddRepairSite(2, 4, REPAIR_FENCE, "壊れたフェンス", "修理済みフェンス");
    AddRepairSite(3, 4, REPAIR_GARDEN, "荒れた庭", "きれいな庭");
    AddRepairSite(15, 2, REPAIR_ROOF, "雨漏りする屋根", "修理済みの屋根");
    AddRepairSite(15, 3, REPAIR_WALL, "剥がれた壁", "塗り直した壁");
    AddRepairSite(16, 3, REPAIR_WALL, "剥がれた壁", "塗り直した壁");
    AddRepairSite(17, 3, REPAIR_WALL, "剥がれた壁", "塗り直した壁");
    AddRepairSite(18, 3, REPAIR_WALL, "剥がれた壁", "塗り直した壁");
    AddRepairSite(3, 12, REPAIR_FENCE, "壊れたフェンス", "修理済みフェンス");
    AddRepairSite(3, 15, REPAIR_GARDEN, "荒れた庭", "きれいな庭");
    AddRepairSite(4, 15, REPAIR_GARDEN, "荒れた庭", "きれいな庭");
    AddRepairSite(15, 12, REPAIR_ROOF, "雨漏りする屋根", "修理済みの屋根");
    AddRepairSite(16, 12, REPAIR_ROOF, "雨漏りする屋根", "修理済みの屋根");
    AddRepairSite(17, 12, REPAIR_ROOF, "雨漏りする屋根", "修理済みの屋根");
    AddRepairSite(18, 12, REPAIR_ROOF, "雨漏りする屋根", "修理済みの屋根");
    AddRepairSite(15, 14, REPAIR_FENCE, "壊れたフェンス", "修理済みフェンス");
    AddRepairSite(20, 5, REPAIR_GARDEN, "荒れた庭", "きれいな庭");

    // Player start position (center of crossroads)
    playerPos = (Vector2){11 * TILE_SIZE + TILE_SIZE/2, 10 * TILE_SIZE + TILE_SIZE/2};
}

static void AddRepairSite(int x, int y, RepairType type, const char *before, const char *after) {
    if (repairCount >= MAX_REPAIR_SITES) return;
    RepairSite *r = &repairs[repairCount];
    r->tileX = x;
    r->tileY = y;
    r->type = type;
    r->fixed = false;
    r->progress = 0;
    r->descBefore = before;
    r->descAfter = after;

    switch (type) {
        case REPAIR_FENCE:
            r->requiredTool = TOOL_HAMMER;
            r->tileWhenBroken = TILE_FENCE_BROKEN;
            r->tileWhenFixed = TILE_FENCE_OK;
            break;
        case REPAIR_GARDEN:
            r->requiredTool = TOOL_SHEARS;
            r->tileWhenBroken = TILE_GARDEN_OVERGROWN;
            r->tileWhenFixed = TILE_GARDEN_OK;
            break;
        case REPAIR_WALL:
            r->requiredTool = TOOL_BRUSH;
            r->tileWhenBroken = TILE_WALL_PEELING;
            r->tileWhenFixed = TILE_HOUSE_WALL;
            break;
        case REPAIR_ROOF:
            r->requiredTool = TOOL_WRENCH;
            r->tileWhenBroken = TILE_ROOF_LEAKY;
            r->tileWhenFixed = TILE_HOUSE_ROOF;
            break;
    }
    repairCount++;
}

// ═══════════════════════════════════════════════════════════════════
//  Collision
// ═══════════════════════════════════════════════════════════════════

static bool IsTileSolid(int tx, int ty) {
    if (tx < 0 || tx >= MAP_W || ty < 0 || ty >= MAP_H) return true;
    int t = tileMap[ty][tx];
    return (t == TILE_TREE || t == TILE_HOUSE_WALL || t == TILE_HOUSE_ROOF ||
            t == TILE_HOUSE_DOOR || t == TILE_WATER || t == TILE_BENCH ||
            t == TILE_LAMPPOST || t == TILE_WALL_PAINTED ||
            t == TILE_WALL_PEELING || t == TILE_ROOF_OK || t == TILE_ROOF_LEAKY);
}

// ═══════════════════════════════════════════════════════════════════
//  Tile Drawing
// ═══════════════════════════════════════════════════════════════════

static void DrawTile(int x, int y, int type) {
    float px = (float)(x * TILE_SIZE);
    float py = (float)(y * TILE_SIZE);
    Rectangle rect = {px, py, TILE_SIZE, TILE_SIZE};

    switch (type) {
    case TILE_GRASS: {
        DrawRectangleRec(rect, COL_GRASS);
        // Subtle grass texture
        if ((x + y) % 3 == 0) {
            DrawRectangle((int)px+12, (int)py+8, 2, 6, COL_GRASS_DARK);
            DrawRectangle((int)px+30, (int)py+28, 2, 6, COL_GRASS_DARK);
        }
        break;
    }
    case TILE_ROAD:
        DrawRectangleRec(rect, COL_ROAD);
        // Road markings
        if (y == 9 && x % 3 == 0) DrawRectangle((int)px+16, (int)py+TILE_SIZE-2, 16, 2, (Color){200,195,185,255});
        if (x == 11 && y % 3 == 0) DrawRectangle((int)px+TILE_SIZE-2, (int)py+16, 2, 16, (Color){200,195,185,255});
        break;
    case TILE_SIDEWALK:
        DrawRectangleRec(rect, COL_SIDEWALK);
        // Paving lines
        DrawLine((int)px, (int)py, (int)px+TILE_SIZE, (int)py, (Color){190,182,170,255});
        DrawLine((int)px+TILE_SIZE/2, (int)py, (int)px+TILE_SIZE/2, (int)py+TILE_SIZE, (Color){190,182,170,255});
        break;
    case TILE_WATER: {
        DrawRectangleRec(rect, COL_WATER);
        // Animated ripples
        float wave = sinf(GetTime() * 2.0f + (float)(x*3 + y*7)) * 3.0f;
        DrawCircle((int)(px+24+wave), (int)(py+24), 6, COL_WATER_DEEP);
        break;
    }
    case TILE_BRIDGE:
        DrawRectangleRec(rect, COL_BRIDGE_COL);
        DrawRectangle((int)px, (int)py, TILE_SIZE, 4, (Color){140,110,70,255});
        DrawRectangle((int)px, (int)py+TILE_SIZE-4, TILE_SIZE, 4, (Color){140,110,70,255});
        // Planks
        for (int i = 0; i < 4; i++)
            DrawLine((int)px+4+i*12, (int)py+4, (int)px+4+i*12, (int)py+TILE_SIZE-4, (Color){150,120,80,255});
        break;
    case TILE_STONE_PATH:
        DrawRectangleRec(rect, COL_GRASS);
        DrawCircle((int)px+12, (int)py+12, 8, COL_STONE_COL);
        DrawCircle((int)px+32, (int)py+16, 7, (Color){170,165,155,255});
        DrawCircle((int)px+20, (int)py+34, 9, COL_STONE_COL);
        break;
    case TILE_TREE:
        DrawRectangleRec(rect, COL_GRASS);
        // Trunk
        DrawRectangle((int)px+20, (int)py+28, 8, 20, COL_TREE_TRUNK);
        // Canopy (layered circles for depth)
        DrawCircle((int)px+24, (int)py+18, 16, (Color){50,120,50,255});
        DrawCircle((int)px+20, (int)py+14, 12, COL_TREE_TOP);
        DrawCircle((int)px+28, (int)py+16, 10, (Color){70,140,70,255});
        break;
    case TILE_FLOWER_RED:
        DrawRectangleRec(rect, COL_GRASS);
        DrawRectangle((int)px+22, (int)py+24, 2, 16, (Color){60,120,40,255});
        DrawCircle((int)px+23, (int)py+20, 6, COL_FLOWER_R);
        DrawCircle((int)px+23, (int)py+20, 3, (Color){255,200,200,255});
        break;
    case TILE_FLOWER_YELLOW:
        DrawRectangleRec(rect, COL_GRASS);
        DrawRectangle((int)px+22, (int)py+24, 2, 16, (Color){60,120,40,255});
        DrawCircle((int)px+23, (int)py+20, 6, COL_FLOWER_Y);
        DrawCircle((int)px+23, (int)py+20, 3, (Color){255,240,200,255});
        break;
    case TILE_BENCH:
        DrawRectangleRec(rect, COL_SIDEWALK);
        DrawRectangle((int)px+6, (int)py+20, 36, 6, COL_BENCH_COL);
        DrawRectangle((int)px+8, (int)py+26, 4, 12, COL_BENCH_COL);
        DrawRectangle((int)px+36, (int)py+26, 4, 12, COL_BENCH_COL);
        DrawRectangle((int)px+6, (int)py+16, 36, 4, (Color){140,100,60,255});
        break;
    case TILE_LAMPPOST:
        DrawRectangleRec(rect, COL_SIDEWALK);
        DrawRectangle((int)px+22, (int)py+10, 4, 30, COL_LAMP_COL);
        DrawCircle((int)px+24, (int)py+8, 8, (Color){255,240,180,100});
        DrawCircle((int)px+24, (int)py+8, 4, (Color){255,230,150,200});
        break;
    case TILE_FENCE_OK:
        DrawRectangleRec(rect, COL_GRASS);
        // Neat fence
        DrawRectangle((int)px+2, (int)py+20, TILE_SIZE-4, 4, COL_FENCE_COL);
        DrawRectangle((int)px+6, (int)py+12, 4, 20, COL_FENCE_COL);
        DrawRectangle((int)px+20, (int)py+12, 4, 20, COL_FENCE_COL);
        DrawRectangle((int)px+36, (int)py+12, 4, 20, COL_FENCE_COL);
        break;
    case TILE_FENCE_BROKEN:
        DrawRectangleRec(rect, COL_GRASS);
        // Broken fence - tilted posts, missing planks
        DrawRectangle((int)px+2, (int)py+22, 20, 3, COL_FENCE_BROKEN_COL);
        DrawRectangle((int)px+6, (int)py+14, 4, 20, COL_FENCE_BROKEN_COL);
        // Tilted post
        DrawRectanglePro((Rectangle){px+22, py+12, 4, 18}, (Vector2){2,0}, 15.0f, COL_FENCE_BROKEN_COL);
        // Missing post indicated by gap
        DrawRectangle((int)px+38, (int)py+28, 4, 6, (Color){120,100,80,255});
        break;
    case TILE_HOUSE_WALL:
    case TILE_WALL_PAINTED:
        DrawRectangleRec(rect, COL_HOUSE_WALL);
        // Window
        DrawRectangle((int)px+14, (int)py+10, 20, 20, (Color){180,210,230,255});
        DrawRectangle((int)px+23, (int)py+10, 2, 20, COL_HOUSE_WALL);
        DrawRectangle((int)px+14, (int)py+19, 20, 2, COL_HOUSE_WALL);
        break;
    case TILE_WALL_PEELING:
        DrawRectangleRec(rect, COL_WALL_PEEL);
        // Peeling paint patches
        DrawRectangle((int)px+5, (int)py+8, 12, 8, (Color){180,165,140,255});
        DrawRectangle((int)px+28, (int)py+20, 10, 14, (Color){170,155,130,255});
        DrawRectangle((int)px+10, (int)py+30, 8, 6, (Color){175,160,135,255});
        // Cracked window
        DrawRectangle((int)px+14, (int)py+10, 20, 20, (Color){160,190,210,255});
        DrawLine((int)px+16, (int)py+12, (int)px+30, (int)py+26, (Color){140,170,190,255});
        break;
    case TILE_HOUSE_ROOF:
    case TILE_ROOF_OK:
        DrawRectangleRec(rect, COL_HOUSE_ROOF_COL);
        // Roof tiles pattern
        for (int i = 0; i < 3; i++) {
            int ry = (int)py + 4 + i*14;
            for (int j = 0; j < 4; j++) {
                DrawRectangle((int)px + 2 + j*12 + (i%2)*6, ry, 10, 12, (Color){170,70,50,255});
            }
        }
        break;
    case TILE_ROOF_LEAKY:
        DrawRectangleRec(rect, COL_ROOF_LEAK);
        // Damaged roof with holes
        for (int i = 0; i < 2; i++) {
            int ry = (int)py + 4 + i*16;
            for (int j = 0; j < 3; j++) {
                DrawRectangle((int)px + 4 + j*14, ry, 10, 12, (Color){140,55,40,255});
            }
        }
        // Water drip animation
        float drip = fmodf(GetTime() * 2.0f, 1.0f);
        DrawCircle((int)px+20, (int)(py+36+drip*10), 3, (Color){100,160,220,180});
        break;
    case TILE_HOUSE_DOOR:
        DrawRectangleRec(rect, COL_HOUSE_WALL);
        DrawRectangle((int)px+14, (int)py+6, 20, 36, COL_HOUSE_DOOR_COL);
        DrawCircle((int)px+30, (int)py+26, 3, (Color){200,180,100,255});
        break;
    case TILE_GARDEN_OK:
        DrawRectangleRec(rect, COL_GARDEN_OK);
        // Nice garden rows
        for (int i = 0; i < 3; i++) {
            DrawRectangle((int)px+4, (int)py+6+i*14, TILE_SIZE-8, 8, (Color){60,140,60,255});
            // Small plants
            DrawCircle((int)px+12+i*10, (int)py+8+i*14, 4, (Color){80,170,80,255});
        }
        break;
    case TILE_GARDEN_OVERGROWN:
        DrawRectangleRec(rect, COL_GARDEN_BAD);
        // Messy overgrown weeds
        for (int i = 0; i < 6; i++) {
            int wx = (int)px + 4 + (i*7) % 40;
            int wy = (int)py + 6 + (i*11) % 36;
            DrawRectangle(wx, wy, 2, 10+i%4*2, (Color){100,130,50,255});
            DrawRectangle(wx-2, wy, 6, 2, (Color){110,140,60,255});
        }
        break;
    default:
        DrawRectangleRec(rect, MAGENTA);
        break;
    }
}

// ═══════════════════════════════════════════════════════════════════
//  Player
// ═══════════════════════════════════════════════════════════════════

static void DrawPlayer(void) {
    float px = playerPos.x;
    float py = playerPos.y;

    // Shadow
    DrawEllipse((int)px, (int)py+16, 12, 5, (Color){0,0,0,40});

    // Body (overalls)
    DrawRectangle((int)px-8, (int)py-4, 16, 20, (Color){80,120,170,255});

    // Head
    DrawCircle((int)px, (int)py-10, 10, (Color){240,210,180,255});

    // Hat (craftsperson's cap)
    DrawRectangle((int)px-12, (int)py-20, 24, 8, (Color){160,120,80,255});
    DrawRectangle((int)px-8, (int)py-24, 16, 6, (Color){160,120,80,255});

    // Eyes (direction-aware)
    switch (playerDir) {
    case 0: // down
        DrawCircle((int)px-4, (int)py-10, 2, (Color){40,40,40,255});
        DrawCircle((int)px+4, (int)py-10, 2, (Color){40,40,40,255});
        break;
    case 1: // up
        break; // back of head
    case 2: // left
        DrawCircle((int)px-5, (int)py-10, 2, (Color){40,40,40,255});
        break;
    case 3: // right
        DrawCircle((int)px+5, (int)py-10, 2, (Color){40,40,40,255});
        break;
    }

    // Walking animation - bobbing feet
    if (frameCounter % 20 < 10 && (IsKeyDown(KEY_W) || IsKeyDown(KEY_A) || IsKeyDown(KEY_S) || IsKeyDown(KEY_D) ||
        IsKeyDown(KEY_UP) || IsKeyDown(KEY_DOWN) || IsKeyDown(KEY_LEFT) || IsKeyDown(KEY_RIGHT))) {
        DrawRectangle((int)px-6, (int)py+14, 5, 6, (Color){100,80,60,255});
        DrawRectangle((int)px+1, (int)py+16, 5, 4, (Color){100,80,60,255});
    } else {
        DrawRectangle((int)px-6, (int)py+16, 5, 4, (Color){100,80,60,255});
        DrawRectangle((int)px+1, (int)py+14, 5, 6, (Color){100,80,60,255});
    }

    // Tool in hand
    Color tc = toolColors[currentTool];
    switch (currentTool) {
    case TOOL_HAMMER:
        DrawRectangle((int)px+10, (int)py-2, 4, 14, (Color){140,100,60,255});
        DrawRectangle((int)px+8, (int)py-4, 10, 6, tc);
        break;
    case TOOL_BRUSH:
        DrawRectangle((int)px+10, (int)py-2, 3, 14, (Color){200,200,200,255});
        DrawRectangle((int)px+8, (int)py+10, 7, 6, tc);
        break;
    case TOOL_SHEARS:
        DrawRectangle((int)px+10, (int)py, 3, 12, tc);
        DrawRectangle((int)px+8, (int)py-4, 7, 6, tc);
        break;
    case TOOL_WRENCH:
        DrawRectangle((int)px+10, (int)py, 4, 14, tc);
        DrawCircle((int)px+12, (int)py-2, 4, tc);
        DrawCircle((int)px+12, (int)py-2, 2, (Color){80,120,170,255});
        break;
    default: break;
    }
}

// ═══════════════════════════════════════════════════════════════════
//  Particles
// ═══════════════════════════════════════════════════════════════════

static void SpawnParticles(float x, float y, Color color, int count) {
    for (int i = 0; i < count; i++) {
        for (int j = 0; j < MAX_PARTICLES; j++) {
            if (!particles[j].active) {
                particles[j].active = true;
                particles[j].pos = (Vector2){x, y};
                float angle = (float)(GetRandomValue(0, 360)) * DEG2RAD;
                float speed = (float)GetRandomValue(20, 80) / 20.0f;
                particles[j].vel = (Vector2){cosf(angle)*speed, sinf(angle)*speed - 2.0f};
                particles[j].color = color;
                particles[j].maxLife = (float)GetRandomValue(30, 60);
                particles[j].life = particles[j].maxLife;
                break;
            }
        }
    }
}

static void UpdateParticles(void) {
    for (int i = 0; i < MAX_PARTICLES; i++) {
        if (!particles[i].active) continue;
        particles[i].pos.x += particles[i].vel.x;
        particles[i].pos.y += particles[i].vel.y;
        particles[i].vel.y += 0.05f; // gravity
        particles[i].life -= 1.0f;
        if (particles[i].life <= 0) particles[i].active = false;
    }
}

static void DrawParticles(void) {
    for (int i = 0; i < MAX_PARTICLES; i++) {
        if (!particles[i].active) continue;
        float alpha = particles[i].life / particles[i].maxLife;
        Color c = particles[i].color;
        c.a = (unsigned char)(alpha * 255);
        float size = 3.0f + alpha * 3.0f;
        DrawCircleV(particles[i].pos, size, c);
    }
}

// ═══════════════════════════════════════════════════════════════════
//  Repair Interaction
// ═══════════════════════════════════════════════════════════════════

static int FindNearbyRepair(void) {
    int ptx = (int)(playerPos.x / TILE_SIZE);
    int pty = (int)(playerPos.y / TILE_SIZE);
    for (int i = 0; i < repairCount; i++) {
        if (repairs[i].fixed) continue;
        int dx = abs(repairs[i].tileX - ptx);
        int dy = abs(repairs[i].tileY - pty);
        if (dx <= 1 && dy <= 1) return i;
    }
    return -1;
}

// ═══════════════════════════════════════════════════════════════════
//  UI Drawing
// ═══════════════════════════════════════════════════════════════════

static void DrawTextJP(const char *text, int x, int y, int size, Color color) {
    if (fontLoaded) {
        DrawTextEx(jpFont, text, (Vector2){(float)x, (float)y}, (float)size, 1, color);
    } else {
        DrawText(text, x, y, size, color);
    }
}

static void DrawUI(void) {
    // Tool bar (bottom)
    int barY = SCREEN_H - 70;
    DrawRectangle(0, barY, SCREEN_W, 70, COL_UI_BG);
    DrawRectangle(0, barY, SCREEN_W, 2, (Color){80,75,65,255});

    int toolW = 100;
    int startX = (SCREEN_W - toolW * TOOL_COUNT - 20*(TOOL_COUNT-1)) / 2;
    for (int i = 0; i < TOOL_COUNT; i++) {
        int tx = startX + i * (toolW + 20);
        bool selected = (i == (int)currentTool);
        Color bg = selected ? (Color){70,65,55,240} : (Color){50,45,38,180};
        Color border = selected ? COL_HAPPY : (Color){80,75,65,255};

        DrawRectangleRounded((Rectangle){(float)tx, (float)(barY+8), (float)toolW, 54}, 0.2f, 4, bg);
        DrawRectangleRoundedLinesEx((Rectangle){(float)tx, (float)(barY+8), (float)toolW, 54}, 0.2f, 4, 2.0f, border);

        // Tool icon (colored square)
        DrawRectangle(tx+10, barY+16, 20, 20, toolColors[i]);

        // Tool name
        DrawTextJP(toolNamesJP[i], tx+36, barY+18, 16, COL_UI_TEXT);

        // Key hint
        char keyHint[4];
        snprintf(keyHint, sizeof(keyHint), "%d", i+1);
        DrawText(keyHint, tx+toolW-20, barY+40, 14, (Color){180,175,165,255});
    }

    // Happiness meter (top-right)
    int meterX = SCREEN_W - 240;
    int meterY = 12;
    DrawRectangleRounded((Rectangle){(float)meterX, (float)meterY, 228, 44}, 0.3f, 4, COL_UI_BG);

    DrawTextJP("まちの幸せ度", meterX+10, meterY+4, 16, COL_UI_TEXT);

    // Progress bar
    DrawRectangle(meterX+10, meterY+24, 208, 14, (Color){60,55,45,255});
    float ratio = (repairCount > 0) ? (float)totalFixed / (float)repairCount : 0;
    DrawRectangle(meterX+10, meterY+24, (int)(208 * ratio), 14, COL_HAPPY);
    // Percentage text
    char pctText[16];
    snprintf(pctText, sizeof(pctText), "%d/%d", totalFixed, repairCount);
    DrawText(pctText, meterX+170, meterY+25, 12, COL_UI_TEXT);

    // Repair count (top-left)
    DrawRectangleRounded((Rectangle){12, 12, 180, 36}, 0.3f, 4, COL_UI_BG);
    char repairText[64];
    snprintf(repairText, sizeof(repairText), "修理完了: %d / %d", totalFixed, repairCount);
    DrawTextJP(repairText, 22, 20, 16, COL_UI_TEXT);

    // Nearby repair hint
    int nearby = FindNearbyRepair();
    if (nearby >= 0 && gameState == STATE_PLAYING) {
        RepairSite *r = &repairs[nearby];
        const char *desc = r->fixed ? r->descAfter : r->descBefore;

        int hintW = 320;
        int hintX = (SCREEN_W - hintW) / 2;
        int hintY = barY - 70;
        DrawRectangleRounded((Rectangle){(float)hintX, (float)hintY, (float)hintW, 58}, 0.2f, 4, COL_UI_BG);

        DrawTextJP(desc, hintX+14, hintY+6, 18, COL_UI_TEXT);

        if (currentTool == r->requiredTool) {
            DrawTextJP("スペースキーで修理開始！", hintX+14, hintY+30, 16, COL_PROGRESS);
        } else {
            char toolHint[128];
            snprintf(toolHint, sizeof(toolHint), "%s が必要です (キー %d)",
                     toolNamesJP[r->requiredTool], r->requiredTool + 1);
            DrawTextJP(toolHint, hintX+14, hintY+30, 16, (Color){255,160,100,255});
        }
    }

    // Repair progress overlay
    if (gameState == STATE_REPAIRING && activeRepair >= 0) {
        RepairSite *r = &repairs[activeRepair];
        float progress = (float)r->progress / (float)REPAIR_TIME;

        int progW = 300;
        int progX = (SCREEN_W - progW) / 2;
        int progY = SCREEN_H / 2 - 40;

        DrawRectangleRounded((Rectangle){(float)(progX-10), (float)(progY-10), (float)(progW+20), 80}, 0.2f, 4, COL_UI_BG);
        DrawTextJP("修理中...", progX, progY, 20, COL_UI_TEXT);
        DrawRectangle(progX, progY+30, progW, 20, (Color){60,55,45,255});
        DrawRectangle(progX, progY+30, (int)(progW * progress), 20, COL_PROGRESS);

        // Animated dots
        int dots = ((int)(GetTime() * 4)) % 4;
        char dotStr[8] = "";
        for (int i = 0; i < dots; i++) strcat(dotStr, ".");
        DrawText(dotStr, progX + progW + 4, progY+30, 20, COL_UI_TEXT);
    }
}

static void DrawTitle(void) {
    DrawRectangle(0, 0, SCREEN_W, SCREEN_H, (Color){40,60,40,255});

    // Animated background tiles
    for (int y = 0; y < SCREEN_H/TILE_SIZE + 1; y++) {
        for (int x = 0; x < SCREEN_W/TILE_SIZE + 1; x++) {
            float brightness = 0.3f + 0.1f * sinf(GetTime() + (float)(x+y)*0.5f);
            Color c = {(unsigned char)(124*brightness), (unsigned char)(172*brightness), (unsigned char)(88*brightness), 255};
            DrawRectangle(x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE, c);
        }
    }

    // Title card
    float bounce = sinf(GetTime() * 1.5f) * 5.0f;
    int titleY = (int)(SCREEN_H/2 - 100 + bounce);

    DrawRectangleRounded((Rectangle){SCREEN_W/2-220, (float)(titleY-20), 440, 200}, 0.15f, 4, (Color){40,35,30,220});
    DrawRectangleRoundedLinesEx((Rectangle){SCREEN_W/2-220, (float)(titleY-20), 440, 200}, 0.15f, 4, 3.0f, COL_HAPPY);

    DrawTextJP("手 直 し", SCREEN_W/2 - 90, titleY, 48, COL_HAPPY);
    DrawTextJP("〜 ご近所リフォームゲーム 〜", SCREEN_W/2 - 160, titleY + 60, 20, COL_UI_TEXT);

    float alpha = (sinf(GetTime() * 3.0f) + 1.0f) * 0.5f;
    Color startColor = {250, 245, 235, (unsigned char)(alpha * 255)};
    DrawTextJP("スペースキーでスタート", SCREEN_W/2 - 120, titleY + 110, 20, startColor);

    // Controls hint
    DrawRectangleRounded((Rectangle){SCREEN_W/2-180, (float)(SCREEN_H - 120), 360, 90}, 0.15f, 4, (Color){40,35,30,180});
    DrawTextJP("操作方法:", SCREEN_W/2 - 160, SCREEN_H - 110, 16, COL_HAPPY);
    DrawTextJP("WASD/矢印 : 移動    1-4 : 道具選択", SCREEN_W/2 - 160, SCREEN_H - 85, 14, COL_UI_TEXT);
    DrawTextJP("スペース : 調べる/修理", SCREEN_W/2 - 160, SCREEN_H - 65, 14, COL_UI_TEXT);
}

static void DrawVictory(void) {
    // Dim overlay
    DrawRectangle(0, 0, SCREEN_W, SCREEN_H, (Color){0,0,0,120});

    float bounce = sinf(GetTime() * 2.0f) * 8.0f;
    int cy = (int)(SCREEN_H/2 - 60 + bounce);

    DrawRectangleRounded((Rectangle){SCREEN_W/2 - 250, (float)(cy - 30), 500, 180}, 0.15f, 4, (Color){40,35,30,230});
    DrawRectangleRoundedLinesEx((Rectangle){SCREEN_W/2 - 250, (float)(cy - 30), 500, 180}, 0.15f, 4, 3.0f, COL_HAPPY);

    DrawTextJP("おめでとうございます！", SCREEN_W/2 - 130, cy, 28, COL_HAPPY);
    DrawTextJP("すべての修理が完了しました！", SCREEN_W/2 - 150, cy + 45, 20, COL_UI_TEXT);
    DrawTextJP("ご近所が美しく生まれ変わりました", SCREEN_W/2 - 160, cy + 75, 18, COL_PROGRESS);

    float alpha = (sinf(GetTime() * 3.0f) + 1.0f) * 0.5f;
    DrawTextJP("Rキーでもう一度", SCREEN_W/2 - 80, cy + 115, 18, (Color){250,245,235,(unsigned char)(alpha*255)});
}

// ═══════════════════════════════════════════════════════════════════
//  Main
// ═══════════════════════════════════════════════════════════════════

int main(void) {
    SetConfigFlags(FLAG_MSAA_4X_HINT);
    InitWindow(SCREEN_W, SCREEN_H, "手直し - ご近所リフォームゲーム");
    SetTargetFPS(60);

    // Try to load Japanese font
    // Use system font that supports Japanese
    const char *fontPaths[] = {
        "/System/Library/Fonts/ヒラギノ角ゴシック W4.ttc",
        "/System/Library/Fonts/Hiragino Sans GB.ttc",
        "/System/Library/Fonts/ヒラギノ丸ゴ ProN W4.ttc",
        "/Library/Fonts/Arial Unicode.ttf",
        "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
    };

    // Define codepoint ranges for Japanese
    int codepointCount = 0;
    int *codepoints = NULL;

    // Build codepoint list: ASCII + Hiragana + Katakana + common Kanji + symbols
    int ranges[][2] = {
        {0x0020, 0x007E},  // ASCII
        {0x3000, 0x303F},  // Japanese punctuation
        {0x3040, 0x309F},  // Hiragana
        {0x30A0, 0x30FF},  // Katakana
        {0x4E00, 0x9FFF},  // CJK Unified (common kanji)
        {0xFF00, 0xFFEF},  // Fullwidth forms
    };
    int rangeCount = sizeof(ranges) / sizeof(ranges[0]);

    // Count total codepoints
    for (int i = 0; i < rangeCount; i++)
        codepointCount += ranges[i][1] - ranges[i][0] + 1;

    codepoints = (int *)malloc(codepointCount * sizeof(int));
    int idx = 0;
    for (int i = 0; i < rangeCount; i++)
        for (int cp = ranges[i][0]; cp <= ranges[i][1]; cp++)
            codepoints[idx++] = cp;

    for (int i = 0; i < 5; i++) {
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

    InitMap();

    camera.target = playerPos;
    camera.offset = (Vector2){SCREEN_W/2.0f, SCREEN_H/2.0f};
    camera.rotation = 0.0f;
    camera.zoom = 1.0f;

    memset(particles, 0, sizeof(particles));

    // ─── Main Loop ──────────────────────────────────────────────
    while (!WindowShouldClose()) {
        frameCounter++;

        // ─── Update ─────────────────────────────────────────────
        switch (gameState) {
        case STATE_TITLE:
            titleAlpha += 0.02f;
            if (titleAlpha > 1.0f) titleAlpha = 1.0f;
            if (IsKeyPressed(KEY_SPACE) || IsKeyPressed(KEY_ENTER)) {
                gameState = STATE_PLAYING;
            }
            break;

        case STATE_PLAYING: {
            // Tool selection
            if (IsKeyPressed(KEY_ONE))   currentTool = TOOL_HAMMER;
            if (IsKeyPressed(KEY_TWO))   currentTool = TOOL_BRUSH;
            if (IsKeyPressed(KEY_THREE)) currentTool = TOOL_SHEARS;
            if (IsKeyPressed(KEY_FOUR))  currentTool = TOOL_WRENCH;

            // Scroll through tools with Q/E
            if (IsKeyPressed(KEY_Q)) currentTool = (currentTool + TOOL_COUNT - 1) % TOOL_COUNT;
            if (IsKeyPressed(KEY_E)) currentTool = (currentTool + 1) % TOOL_COUNT;

            // Movement
            Vector2 newPos = playerPos;
            bool moving = false;

            if (IsKeyDown(KEY_W) || IsKeyDown(KEY_UP))    { newPos.y -= PLAYER_SPEED; playerDir = 1; moving = true; }
            if (IsKeyDown(KEY_S) || IsKeyDown(KEY_DOWN))   { newPos.y += PLAYER_SPEED; playerDir = 0; moving = true; }
            if (IsKeyDown(KEY_A) || IsKeyDown(KEY_LEFT))   { newPos.x -= PLAYER_SPEED; playerDir = 2; moving = true; }
            if (IsKeyDown(KEY_D) || IsKeyDown(KEY_RIGHT))  { newPos.x += PLAYER_SPEED; playerDir = 3; moving = true; }

            if (moving) playerFrame = (playerFrame + 1) % 40;

            // Collision check (check corners of player bounding box)
            float pw = 10, ph = 12;
            // Check horizontal
            int tx1 = (int)((newPos.x - pw) / TILE_SIZE);
            int tx2 = (int)((newPos.x + pw) / TILE_SIZE);
            int ty1 = (int)((playerPos.y - ph) / TILE_SIZE);
            int ty2 = (int)((playerPos.y + ph) / TILE_SIZE);

            bool hBlocked = false;
            for (int cy = ty1; cy <= ty2; cy++)
                for (int cx = tx1; cx <= tx2; cx++)
                    if (IsTileSolid(cx, cy)) hBlocked = true;

            if (!hBlocked) playerPos.x = newPos.x;

            // Check vertical
            tx1 = (int)((playerPos.x - pw) / TILE_SIZE);
            tx2 = (int)((playerPos.x + pw) / TILE_SIZE);
            ty1 = (int)((newPos.y - ph) / TILE_SIZE);
            ty2 = (int)((newPos.y + ph) / TILE_SIZE);

            bool vBlocked = false;
            for (int cy = ty1; cy <= ty2; cy++)
                for (int cx = tx1; cx <= tx2; cx++)
                    if (IsTileSolid(cx, cy)) vBlocked = true;

            if (!vBlocked) playerPos.y = newPos.y;

            // Clamp to map
            playerPos.x = Clamp(playerPos.x, 16, MAP_W * TILE_SIZE - 16);
            playerPos.y = Clamp(playerPos.y, 16, MAP_H * TILE_SIZE - 16);

            // Start repair
            if (IsKeyPressed(KEY_SPACE)) {
                int nearby = FindNearbyRepair();
                if (nearby >= 0 && currentTool == repairs[nearby].requiredTool) {
                    activeRepair = nearby;
                    gameState = STATE_REPAIRING;
                    repairs[nearby].progress = 0;
                }
            }
            break;
        }

        case STATE_REPAIRING: {
            if (activeRepair >= 0) {
                RepairSite *r = &repairs[activeRepair];
                r->progress++;

                // Spawn small particles during repair
                if (frameCounter % 8 == 0) {
                    float rx = (float)(r->tileX * TILE_SIZE + TILE_SIZE/2);
                    float ry = (float)(r->tileY * TILE_SIZE + TILE_SIZE/2);
                    SpawnParticles(rx, ry, toolColors[currentTool], 2);
                }

                if (r->progress >= REPAIR_TIME) {
                    // Complete!
                    r->fixed = true;
                    tileMap[r->tileY][r->tileX] = r->tileWhenFixed;
                    totalFixed++;
                    happiness = (float)totalFixed / (float)repairCount;

                    // Celebration particles
                    float rx = (float)(r->tileX * TILE_SIZE + TILE_SIZE/2);
                    float ry = (float)(r->tileY * TILE_SIZE + TILE_SIZE/2);
                    SpawnParticles(rx, ry, COL_HAPPY, 30);
                    SpawnParticles(rx, ry, COL_PROGRESS, 20);

                    activeRepair = -1;
                    gameState = STATE_PLAYING;

                    // Check victory
                    if (totalFixed >= repairCount) {
                        gameState = STATE_VICTORY;
                        victoryTimer = 0;
                    }
                }

                // Cancel with ESC
                if (IsKeyPressed(KEY_ESCAPE)) {
                    repairs[activeRepair].progress = 0;
                    activeRepair = -1;
                    gameState = STATE_PLAYING;
                }
            }
            break;
        }

        case STATE_VICTORY:
            victoryTimer++;
            // Periodic celebration particles
            if (victoryTimer % 30 == 0) {
                float rx = (float)GetRandomValue(100, SCREEN_W-100);
                float ry = (float)GetRandomValue(100, SCREEN_H-100);
                // Convert screen to world coords
                rx = camera.target.x + (rx - camera.offset.x) / camera.zoom;
                ry = camera.target.y + (ry - camera.offset.y) / camera.zoom;
                SpawnParticles(rx, ry, COL_HAPPY, 10);
            }
            if (IsKeyPressed(KEY_R)) {
                // Reset
                totalFixed = 0;
                happiness = 0;
                InitMap();
                gameState = STATE_PLAYING;
            }
            break;
        }

        // Update camera (smooth follow)
        camera.target.x += (playerPos.x - camera.target.x) * 0.08f;
        camera.target.y += (playerPos.y - camera.target.y) * 0.08f;

        // Clamp camera
        float halfW = SCREEN_W / (2.0f * camera.zoom);
        float halfH = (SCREEN_H - 70) / (2.0f * camera.zoom);  // account for UI bar
        camera.target.x = Clamp(camera.target.x, halfW, MAP_W*TILE_SIZE - halfW);
        camera.target.y = Clamp(camera.target.y, halfH, MAP_H*TILE_SIZE - halfH);

        UpdateParticles();

        // ─── Draw ───────────────────────────────────────────────
        BeginDrawing();
        ClearBackground((Color){30,40,30,255});

        if (gameState == STATE_TITLE) {
            DrawTitle();
        } else {
            BeginMode2D(camera);

            // Draw tiles
            for (int y = 0; y < MAP_H; y++) {
                for (int x = 0; x < MAP_W; x++) {
                    DrawTile(x, y, tileMap[y][x]);
                }
            }

            // Highlight nearby repair sites
            int nearby = FindNearbyRepair();
            if (nearby >= 0 && gameState == STATE_PLAYING) {
                RepairSite *r = &repairs[nearby];
                float pulse = (sinf(GetTime() * 4.0f) + 1.0f) * 0.5f;
                Color hl = COL_HIGHLIGHT;
                hl.a = (unsigned char)(40 + pulse * 80);
                DrawRectangle(r->tileX * TILE_SIZE - 2, r->tileY * TILE_SIZE - 2,
                              TILE_SIZE + 4, TILE_SIZE + 4, hl);
                DrawRectangleLinesEx((Rectangle){(float)(r->tileX*TILE_SIZE-2), (float)(r->tileY*TILE_SIZE-2),
                    TILE_SIZE+4, TILE_SIZE+4}, 2.0f, (Color){255,255,100,(unsigned char)(100+pulse*155)});
            }

            DrawPlayer();
            DrawParticles();

            EndMode2D();

            DrawUI();

            if (gameState == STATE_VICTORY) {
                DrawVictory();
            }
        }

        // FPS (debug, small)
        DrawText(TextFormat("%d fps", GetFPS()), SCREEN_W - 60, SCREEN_H - 20, 10, (Color){100,100,100,100});

        EndDrawing();
    }

    if (fontLoaded) UnloadFont(jpFont);
    CloseWindow();
    return 0;
}
