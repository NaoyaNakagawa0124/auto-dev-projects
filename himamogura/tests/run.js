// Test runner — no external test framework needed
import {
  initMemoryDatabase,
  getDb,
  getOrCreateUser,
  getUserHobbies,
  getUserHobbyIds,
  addUserHobby,
  rateUserHobby,
  getUserHobby,
  getHobbyById,
  getAllHobbies,
  getHobbiesByCategory,
  getOrCreateDailyChallenge,
  completeChallenge,
  getUserStats,
  getServerRanking,
  getRandomUntriedHobby,
  updateQuizResult,
} from "../src/database.js";
import { hobbies, COLORS, CATEGORY_EMOJI, CATEGORY_NAME_JA, getHobbyId, findHobbyByName } from "../src/data/hobbies.js";
import { quizQuestions, calculateQuizScores, getTopCategory, getSortedCategories } from "../src/data/quizzes.js";
import { moleLines, pickLine, pickStreakLine, moleArt } from "../src/data/mascot.js";
import { getHobbyLevel } from "../src/commands/stats.js";
import { ITEMS_PER_PAGE } from "../src/commands/collection.js";

let passed = 0;
let failed = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passed++;
    console.log(`  ✅ ${message}`);
  } else {
    failed++;
    console.log(`  ❌ ${message}`);
  }
}

function assertEqual(actual, expected, message) {
  totalTests++;
  if (actual === expected) {
    passed++;
    console.log(`  ✅ ${message}`);
  } else {
    failed++;
    console.log(`  ❌ ${message} (expected: ${expected}, got: ${actual})`);
  }
}

function section(name) {
  console.log(`\n🔍 ${name}`);
}

// ========================================
// Initialize in-memory database for tests
// ========================================
initMemoryDatabase();

// ========================================
// Hobby Data Integrity
// ========================================
section("Hobby Data Integrity");

assert(hobbies.length >= 100, `Should have at least 100 hobbies (got ${hobbies.length})`);

const categories = ["creative", "physical", "social", "learning", "relaxation"];
for (const cat of categories) {
  const count = hobbies.filter((h) => h.category === cat).length;
  assert(count >= 15, `Category '${cat}' should have at least 15 hobbies (got ${count})`);
}

for (let i = 0; i < hobbies.length; i++) {
  const h = hobbies[i];
  const hasRequiredFields =
    h.name && h.nameEn && h.description && h.category &&
    h.difficulty !== undefined && h.cost !== undefined &&
    h.indoor !== undefined && Array.isArray(h.tags);
  assert(hasRequiredFields, `Hobby ${i + 1} (${h.name}) has all required fields`);
  assert(categories.includes(h.category), `Hobby '${h.name}' has valid category (${h.category})`);
  assert(h.difficulty >= 1 && h.difficulty <= 5, `Hobby '${h.name}' difficulty in range 1-5`);
  assert(h.cost >= 1 && h.cost <= 5, `Hobby '${h.name}' cost in range 1-5`);
  assert(h.indoor === 0 || h.indoor === 1, `Hobby '${h.name}' indoor is 0 or 1`);
}

// Colors and emojis exist for each category
for (const cat of categories) {
  assert(COLORS[cat] !== undefined, `COLORS has entry for '${cat}'`);
  assert(CATEGORY_EMOJI[cat] !== undefined, `CATEGORY_EMOJI has entry for '${cat}'`);
  assert(CATEGORY_NAME_JA[cat] !== undefined, `CATEGORY_NAME_JA has entry for '${cat}'`);
}

// ========================================
// Database Seeding
// ========================================
section("Database Seeding");

const allDbHobbies = getAllHobbies();
assertEqual(allDbHobbies.length, hobbies.length, "All hobbies seeded to database");

// ========================================
// User Operations
// ========================================
section("User Operations");

const user1 = getOrCreateUser("user1", "TestUser1");
assert(user1 !== undefined, "Create new user");
assertEqual(user1.id, "user1", "User ID matches");
assertEqual(user1.username, "TestUser1", "Username matches");
assertEqual(user1.streak, 0, "Initial streak is 0");

const user1Again = getOrCreateUser("user1", "TestUser1");
assertEqual(user1Again.id, "user1", "Get existing user returns same user");

// ========================================
// Hobby Collection Operations
// ========================================
section("Hobby Collection Operations");

const initialHobbies = getUserHobbies("user1");
assertEqual(initialHobbies.length, 0, "New user has no hobbies");

addUserHobby("user1", 1);
addUserHobby("user1", 2);
addUserHobby("user1", 3);

const userHobbies = getUserHobbies("user1");
assertEqual(userHobbies.length, 3, "User has 3 hobbies after adding");

const hobbyIds = getUserHobbyIds("user1");
assert(hobbyIds.includes(1), "User has hobby ID 1");
assert(hobbyIds.includes(2), "User has hobby ID 2");

// Duplicate add should be ignored
addUserHobby("user1", 1);
const afterDuplicate = getUserHobbies("user1");
assertEqual(afterDuplicate.length, 3, "Duplicate add is ignored");

// ========================================
// Rating Operations
// ========================================
section("Rating Operations");

rateUserHobby("user1", 1, 5);
const ratedHobby = getUserHobby("user1", 1);
assertEqual(ratedHobby.rating, 5, "Hobby rated with 5 stars");

rateUserHobby("user1", 1, 3);
const reRated = getUserHobby("user1", 1);
assertEqual(reRated.rating, 3, "Rating can be updated");

rateUserHobby("user1", 2, 4);
const secondRated = getUserHobby("user1", 2);
assertEqual(secondRated.rating, 4, "Second hobby rated");

// Unrated hobby
const unrated = getUserHobby("user1", 3);
assertEqual(unrated.rating, null, "Unrated hobby has null rating");

// ========================================
// Random Untried Hobby
// ========================================
section("Random Untried Hobby");

const untried = getRandomUntriedHobby("user1");
assert(untried !== null, "Random untried hobby exists");
assert(![1, 2, 3].includes(untried.id), "Random hobby not in tried list");

// With category filter
const untriedCreative = getRandomUntriedHobby("user1", "creative");
if (untriedCreative) {
  assertEqual(untriedCreative.category, "creative", "Filtered by category");
}

// ========================================
// Challenge Operations
// ========================================
section("Challenge Operations");

const challenge1 = getOrCreateDailyChallenge("2025-01-15");
assert(challenge1 !== null, "Challenge created for date");
assert(challenge1.challenge_text.length > 0, "Challenge has text");
assert(challenge1.hobby_id > 0, "Challenge has associated hobby");

// Same date returns same challenge (deterministic)
const challenge1Again = getOrCreateDailyChallenge("2025-01-15");
assertEqual(challenge1Again.id, challenge1.id, "Same date returns same challenge");
assertEqual(challenge1Again.challenge_text, challenge1.challenge_text, "Challenge text is deterministic");

// Different date gives different challenge (or potentially same, but should work)
const challenge2 = getOrCreateDailyChallenge("2025-01-16");
assert(challenge2 !== null, "Challenge for different date exists");

// ========================================
// Streak Tracking
// ========================================
section("Streak Tracking");

getOrCreateUser("streakUser", "StreakTester");

const day1 = completeChallenge("streakUser", "2025-01-15");
assertEqual(day1.streak, 1, "First completion: streak = 1");
assertEqual(day1.alreadyDone, false, "First completion not already done");

// Complete same day again
const day1Again = completeChallenge("streakUser", "2025-01-15");
assertEqual(day1Again.alreadyDone, true, "Second completion same day: already done");

// Next day
const day2 = completeChallenge("streakUser", "2025-01-16");
assertEqual(day2.streak, 2, "Consecutive day: streak = 2");

// Skip a day
const day4 = completeChallenge("streakUser", "2025-01-18");
assertEqual(day4.streak, 1, "After skipping a day: streak resets to 1");

// Best streak should be preserved
const streakStats = getUserStats("streakUser");
assertEqual(streakStats.user.best_streak, 2, "Best streak preserved at 2");

// ========================================
// Stats Operations
// ========================================
section("Stats Operations");

const stats1 = getUserStats("user1");
assert(stats1 !== null, "Stats for user1 exist");
assertEqual(stats1.hobbyCount, 3, "Hobby count is 3");
assert(stats1.avgRating !== null, "Average rating calculated");
assertEqual(stats1.avgRating, 3.5, "Average rating = 3.5 (3+4)/2 rated hobbies");
assert(stats1.categoryBreakdown.length > 0, "Category breakdown exists");
assert(stats1.completionPercent > 0, "Completion percent > 0");

// Empty user stats
getOrCreateUser("emptyUser", "EmptyUser");
const emptyStats = getUserStats("emptyUser");
assertEqual(emptyStats.hobbyCount, 0, "Empty user has 0 hobbies");
assertEqual(emptyStats.avgRating, null, "Empty user has no average rating");

// ========================================
// Ranking Operations
// ========================================
section("Ranking Operations");

const ranking = getServerRanking(["user1", "streakUser", "emptyUser"]);
assert(ranking.byHobbies.length > 0, "Hobby ranking has entries");
assert(ranking.byStreak.length > 0, "Streak ranking has entries");
assertEqual(ranking.byHobbies[0].id, "user1", "User1 is top in hobby ranking");

// Empty ranking
const emptyRanking = getServerRanking([]);
assertEqual(emptyRanking.byHobbies.length, 0, "Empty user list gives empty ranking");

// ========================================
// Quiz Scoring
// ========================================
section("Quiz Scoring");

assert(quizQuestions.length === 5, "5 quiz questions");
for (const q of quizQuestions) {
  assert(q.question.length > 0, `Question ${q.id} has text`);
  assert(q.options.length >= 3, `Question ${q.id} has at least 3 options`);
  for (const opt of q.options) {
    assert(opt.label.length > 0, `Option '${opt.value}' has label`);
    assert(typeof opt.scores === "object", `Option '${opt.value}' has scores`);
  }
}

// Test score calculation
const testAnswers = [
  { questionId: 1, value: "create" },
  { questionId: 2, value: "solo" },
  { questionId: 3, value: "tools" },
  { questionId: 4, value: "indoor" },
  { questionId: 5, value: "hands_on" },
];
const scores = calculateQuizScores(testAnswers);
assert(scores.creative > 0, "Creative score > 0 for creative answers");
const topCat = getTopCategory(scores);
assertEqual(topCat, "creative", "Top category is creative for creative answers");

const sorted = getSortedCategories(scores);
assertEqual(sorted[0].category, "creative", "Sorted categories: first is creative");
assert(sorted[0].score >= sorted[1].score, "Sorted in descending order");

// Test with invalid answers (should not crash)
const emptyScores = calculateQuizScores([]);
assertEqual(emptyScores.creative, 0, "Empty answers give zero scores");

const invalidScores = calculateQuizScores([{ questionId: 999, value: "nope" }]);
assertEqual(invalidScores.creative, 0, "Invalid answers give zero scores");

// Quiz result persistence
updateQuizResult("user1", scores);
const updatedUser = getOrCreateUser("user1", "TestUser1");
assert(updatedUser.quiz_result !== null, "Quiz result saved to user");

// ========================================
// Mascot System
// ========================================
section("Mascot System");

for (const [key, lines] of Object.entries(moleLines)) {
  assert(Array.isArray(lines), `moleLines.${key} is an array`);
  assert(lines.length > 0, `moleLines.${key} has at least one line`);
}

const digLine = pickLine("dig");
assert(typeof digLine === "string" && digLine.length > 0, "pickLine('dig') returns a string");

const streakLine = pickStreakLine(5);
assert(streakLine.includes("5"), "pickStreakLine replaces {n} with number");

// Mole art
assert(typeof moleArt.happy === "function", "moleArt.happy is a function");
assert(typeof moleArt.excited === "function", "moleArt.excited is a function");
assert(typeof moleArt.digging === "string", "moleArt.digging is a string");
assert(typeof moleArt.sleepy === "string", "moleArt.sleepy is a string");
assert(typeof moleArt.thinking === "string", "moleArt.thinking is a string");

const happyArt = moleArt.happy("テスト");
assert(happyArt.includes("テスト"), "happy art includes message");

// Unknown category
const unknownLine = pickLine("nonexistent");
assertEqual(unknownLine, "", "Unknown category returns empty string");

// ========================================
// Hobby Level Titles
// ========================================
section("Hobby Level Titles");

assert(getHobbyLevel(0).includes("まだ"), "Level 0: not started");
assert(getHobbyLevel(1).includes("初心者"), "Level 1: beginner");
assert(getHobbyLevel(5).includes("見習い"), "Level 5: apprentice");
assert(getHobbyLevel(15).includes("探検家"), "Level 15: explorer");
assert(getHobbyLevel(30).includes("マスター"), "Level 30: master");
assert(getHobbyLevel(50).includes("伝説"), "Level 50: legendary");

// ========================================
// Hobby Search Functions
// ========================================
section("Hobby Search Functions");

const origami = findHobbyByName("折り紙");
assert(origami !== undefined, "Find hobby by Japanese name");
assertEqual(origami.nameEn, "Origami", "Found correct hobby");

const byEn = findHobbyByName("Origami");
assert(byEn !== undefined, "Find hobby by English name");

const notFound = findHobbyByName("存在しない趣味");
assertEqual(notFound, undefined, "Non-existent hobby returns undefined");

const origamiId = getHobbyId(origami);
assert(origamiId > 0, "getHobbyId returns positive ID");

// ========================================
// Collection Pagination
// ========================================
section("Collection Pagination");

assertEqual(ITEMS_PER_PAGE, 5, "Items per page is 5");

// Add more hobbies to test pagination
for (let i = 4; i <= 12; i++) {
  addUserHobby("user1", i);
}
const paginatedHobbies = getUserHobbies("user1");
assert(paginatedHobbies.length > ITEMS_PER_PAGE, "More hobbies than one page");
const totalPages = Math.ceil(paginatedHobbies.length / ITEMS_PER_PAGE);
assert(totalPages > 1, "Multiple pages needed");

// ========================================
// Edge Cases
// ========================================
section("Edge Cases");

// Max streak scenario
getOrCreateUser("maxStreakUser", "MaxStreak");
for (let i = 1; i <= 100; i++) {
  const dateStr = `2025-01-${String(i).padStart(2, "0")}`;
  // Only valid dates matter for the logic test
  if (i <= 28) {
    getOrCreateDailyChallenge(dateStr);
    completeChallenge("maxStreakUser", dateStr);
  }
}
const maxStreakStats = getUserStats("maxStreakUser");
assert(maxStreakStats.user.best_streak >= 28, "Long streak tracked correctly");

// User with no username
const noNameUser = getOrCreateUser("noname", null);
assert(noNameUser !== undefined, "User with null username created");

// Get hobby by valid and invalid ID
const validHobby = getHobbyById(1);
assert(validHobby !== null, "Valid hobby ID returns hobby");
const invalidHobby = getHobbyById(99999);
assert(invalidHobby === undefined, "Invalid hobby ID returns undefined");

// Database hobbies by category
const creativeDb = getHobbiesByCategory("creative");
assert(creativeDb.length > 0, "Database category filter works");
const invalidCat = getHobbiesByCategory("nonexistent");
assertEqual(invalidCat.length, 0, "Invalid category returns empty array");

// ========================================
// Summary
// ========================================
console.log("\n" + "=".repeat(50));
console.log(`\n🐹 テスト結果: ${passed} passed / ${failed} failed / ${totalTests} total`);
if (failed > 0) {
  console.log("❌ 一部のテストが失敗しました");
  process.exit(1);
} else {
  console.log("✅ 全テスト合格！モグラも喜んでるよ〜");
  process.exit(0);
}
