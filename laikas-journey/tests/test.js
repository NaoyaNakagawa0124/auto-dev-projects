/**
 * Tests for Laika's Journey game logic.
 * Uses an in-memory SQLite database.
 */

const Database = require("better-sqlite3");

// Override database to use in-memory before requiring game
const dbModule = require("../lib/database");

let testDb;
function setupTestDb() {
  testDb = new Database(":memory:");
  testDb.pragma("journal_mode = WAL");
  testDb.exec(`
    CREATE TABLE IF NOT EXISTS players (
      user_id TEXT PRIMARY KEY,
      guild_id TEXT NOT NULL,
      dog_name TEXT NOT NULL,
      dog_emoji TEXT DEFAULT '🐕',
      happiness INTEGER DEFAULT 80,
      energy INTEGER DEFAULT 100,
      xp INTEGER DEFAULT 0,
      current_planet INTEGER DEFAULT 0,
      planets_explored INTEGER DEFAULT 0,
      challenges_correct INTEGER DEFAULT 0,
      challenges_total INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS discoveries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      planet_id TEXT NOT NULL,
      fact TEXT NOT NULL,
      discovered_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES players(user_id),
      UNIQUE(user_id, fact)
    );
  `);

  // Inject test db using setDb
  dbModule.setDb(testDb);
}

function teardownTestDb() {
  if (testDb) testDb.close();
}

const game = require("../lib/game");
const { PLANETS } = require("../data/planets");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ ${message}`);
  }
}

function describe(name, fn) {
  console.log(`\n${name}`);
  fn();
}

// ===== Setup =====
setupTestDb();

// ===== Planet Data Tests =====
describe("Planet Data", () => {
  assert(PLANETS.length === 8, "should have 8 planets");
  assert(PLANETS[0].id === "mercury", "first planet is Mercury");
  assert(PLANETS[7].id === "neptune", "last planet is Neptune");

  for (const planet of PLANETS) {
    assert(planet.facts.length >= 3, `${planet.name} has at least 3 facts`);
    assert(planet.challenges.length >= 3, `${planet.name} has at least 3 challenges`);

    for (const c of planet.challenges) {
      assert(c.options.length === 3, `${planet.name} challenge has 3 options`);
      assert(c.answer >= 0 && c.answer < 3, `${planet.name} challenge answer is valid index`);
    }
  }
});

describe("Planet Ordering", () => {
  for (let i = 1; i < PLANETS.length; i++) {
    assert(PLANETS[i].distance > PLANETS[i - 1].distance, `${PLANETS[i].name} is farther than ${PLANETS[i - 1].name}`);
  }
});

// ===== Adopt Tests =====
describe("Adopt Dog", () => {
  const result = game.adoptDog("user1", "guild1", "Cosmo");
  assert(result.success === true, "adoption succeeds");
  assert(result.dog.name === "Cosmo", "dog name is Cosmo");

  const duplicate = game.adoptDog("user1", "guild1", "Cosmo2");
  assert(duplicate.success === false, "cannot adopt twice");
});

// ===== Dog Status Tests =====
describe("Dog Status", () => {
  const status = game.getDogStatus("user1");
  assert(status !== null, "status exists for adopted player");
  assert(status.name === "Cosmo", "dog name matches");
  assert(status.happiness === 80, "initial happiness is 80");
  assert(status.energy === 100, "initial energy is 100");
  assert(status.xp === 0, "initial XP is 0");
  assert(status.currentPlanet.id === "mercury", "starts at Mercury");
  assert(status.rank === "🌱 Recruit", "initial rank is Recruit");

  const noPlayer = game.getDogStatus("nonexistent");
  assert(noPlayer === null, "returns null for unknown player");
});

// ===== Rank Tests =====
describe("Rank System", () => {
  assert(game.getRank(0) === "🌱 Recruit", "0 XP = Recruit");
  assert(game.getRank(49) === "🌱 Recruit", "49 XP = Recruit");
  assert(game.getRank(50) === "🐾 Space Pup", "50 XP = Space Pup");
  assert(game.getRank(100) === "🛸 Explorer", "100 XP = Explorer");
  assert(game.getRank(150) === "🚀 Voyager", "150 XP = Voyager");
  assert(game.getRank(200) === "🌟 Star Captain", "200 XP = Star Captain");
});

// ===== Explore Tests =====
describe("Explore", () => {
  const result = game.explore("user1");
  assert(result.success === true, "exploration succeeds");
  assert(result.planet.id === "venus", "moves to Venus");
  assert(result.xpGained === game.XP_PER_EXPLORE, "earns explore XP");

  const status = game.getDogStatus("user1");
  assert(status.planetsExplored === 1, "planets explored incremented");
  assert(status.energy < 100, "energy decreased after exploring");

  const noPlayer = game.explore("nonexistent");
  assert(noPlayer.success === false, "explore fails for unknown player");
});

// ===== Feed Tests =====
describe("Feed Dog", () => {
  const before = game.getDogStatus("user1");
  const result = game.feedDog("user1");
  assert(result.success === true, "feeding succeeds");
  assert(result.name === "Cosmo", "returns dog name");

  const after = game.getDogStatus("user1");
  assert(after.energy >= before.energy, "energy increased after feeding");
  assert(after.xp > before.xp, "XP increased after feeding");
});

// ===== Play Tests =====
describe("Play With Dog", () => {
  const before = game.getDogStatus("user1");
  const result = game.playWithDog("user1");
  assert(result.success === true, "playing succeeds");

  const after = game.getDogStatus("user1");
  assert(after.happiness >= before.happiness, "happiness increased");
  assert(after.xp > before.xp, "XP increased after playing");
});

// ===== Challenge Tests =====
describe("Challenge System", () => {
  const challenge = game.getChallenge("user1");
  assert(challenge.success === true, "getting challenge succeeds");
  assert(challenge.planet !== undefined, "challenge has planet");
  assert(challenge.challenge.q !== undefined, "challenge has question");
  assert(challenge.challenge.options.length === 3, "challenge has 3 options");

  // Answer correctly
  const correctIdx = challenge.challenge.answer;
  const answer = game.answerChallenge("user1", challenge.planet.id, challenge.challenge.q, correctIdx);
  assert(answer.success === true, "answering succeeds");
  assert(answer.correct === true, "correct answer recognized");
  assert(answer.xpGained === game.XP_PER_CHALLENGE, "earns challenge XP for correct");

  // Answer incorrectly
  const challenge2 = game.getChallenge("user1");
  if (challenge2.success) {
    const wrongIdx = (challenge2.challenge.answer + 1) % 3;
    const wrong = game.answerChallenge("user1", challenge2.planet.id, challenge2.challenge.q, wrongIdx);
    assert(wrong.correct === false, "wrong answer recognized");
    assert(wrong.xpGained === 0, "no XP for wrong answer");
  }
});

// ===== Journal Tests =====
describe("Journal", () => {
  const journal = game.getJournal("user1");
  assert(journal !== null, "journal exists");
  assert(journal.dogName === "Cosmo", "journal has dog name");
  assert(journal.totalFacts > 0, "has discovered facts");
  assert(typeof journal.byPlanet === "object", "facts grouped by planet");

  const noJournal = game.getJournal("nonexistent");
  assert(noJournal === null, "no journal for unknown player");
});

// ===== Leaderboard Tests =====
describe("Leaderboard", () => {
  // Add another player
  game.adoptDog("user2", "guild1", "Nova");
  game.explore("user2");

  const leaders = game.getLeaderboard("guild1");
  assert(leaders.length === 2, "leaderboard has 2 players");
  assert(leaders[0].xp >= leaders[1].xp, "sorted by XP descending");
});

// ===== Energy Gating Tests =====
describe("Energy Gating", () => {
  // Create a user and drain their energy via repeated explores
  game.adoptDog("user3", "guild1", "Tired");
  // Set energy to very low directly
  const testDb = dbModule.getDb();
  testDb.prepare("UPDATE players SET energy = 0 WHERE user_id = ?").run("user3");

  const player = testDb.prepare("SELECT energy FROM players WHERE user_id = ?").get("user3");
  assert(player.energy === 0, "energy was set to 0");

  const exploreResult = game.explore("user3");
  assert(exploreResult.success === false, "cannot explore with zero energy");

  const challengeResult = game.getChallenge("user3");
  assert(challengeResult.success === false, "cannot challenge with zero energy");
});

// ===== Cleanup =====
teardownTestDb();

// ===== Results =====
console.log(`\n${"=".repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log("=".repeat(40));

process.exit(failed > 0 ? 1 : 0);
