// SQLite database setup and queries
import Database from "better-sqlite3";
import { hobbies } from "./data/hobbies.js";

let db;

export function initDatabase(dbPath = "himamogura.db") {
  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT,
      streak INTEGER DEFAULT 0,
      best_streak INTEGER DEFAULT 0,
      last_challenge_date TEXT,
      quiz_result TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS hobbies (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      name_en TEXT,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      difficulty INTEGER DEFAULT 2,
      cost INTEGER DEFAULT 2,
      indoor INTEGER DEFAULT 1,
      tags TEXT
    );

    CREATE TABLE IF NOT EXISTS user_hobbies (
      user_id TEXT,
      hobby_id INTEGER,
      rating INTEGER,
      tried_at TEXT DEFAULT (datetime('now')),
      notes TEXT,
      PRIMARY KEY (user_id, hobby_id),
      FOREIGN KEY (hobby_id) REFERENCES hobbies(id)
    );

    CREATE TABLE IF NOT EXISTS challenges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL UNIQUE,
      hobby_id INTEGER,
      challenge_text TEXT NOT NULL,
      FOREIGN KEY (hobby_id) REFERENCES hobbies(id)
    );
  `);

  seedHobbies();
  return db;
}

// Initialize database with in-memory option (for tests)
export function initMemoryDatabase() {
  db = new Database(":memory:");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT,
      streak INTEGER DEFAULT 0,
      best_streak INTEGER DEFAULT 0,
      last_challenge_date TEXT,
      quiz_result TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS hobbies (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      name_en TEXT,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      difficulty INTEGER DEFAULT 2,
      cost INTEGER DEFAULT 2,
      indoor INTEGER DEFAULT 1,
      tags TEXT
    );

    CREATE TABLE IF NOT EXISTS user_hobbies (
      user_id TEXT,
      hobby_id INTEGER,
      rating INTEGER,
      tried_at TEXT DEFAULT (datetime('now')),
      notes TEXT,
      PRIMARY KEY (user_id, hobby_id),
      FOREIGN KEY (hobby_id) REFERENCES hobbies(id)
    );

    CREATE TABLE IF NOT EXISTS challenges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL UNIQUE,
      hobby_id INTEGER,
      challenge_text TEXT NOT NULL,
      FOREIGN KEY (hobby_id) REFERENCES hobbies(id)
    );
  `);

  seedHobbies();
  return db;
}

export function getDb() {
  return db;
}

// Seed hobbies table from data
function seedHobbies() {
  const count = db.prepare("SELECT COUNT(*) as c FROM hobbies").get().c;
  if (count > 0) return;

  const insert = db.prepare(
    "INSERT INTO hobbies (id, name, name_en, description, category, difficulty, cost, indoor, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );

  const insertMany = db.transaction((items) => {
    for (let i = 0; i < items.length; i++) {
      const h = items[i];
      insert.run(
        i + 1,
        h.name,
        h.nameEn,
        h.description,
        h.category,
        h.difficulty,
        h.cost,
        h.indoor,
        JSON.stringify(h.tags)
      );
    }
  });

  insertMany(hobbies);
}

// ---- User operations ----

export function getOrCreateUser(userId, username) {
  let user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
  if (!user) {
    db.prepare("INSERT INTO users (id, username) VALUES (?, ?)").run(
      userId,
      username
    );
    user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
  }
  return user;
}

export function updateQuizResult(userId, scores) {
  db.prepare("UPDATE users SET quiz_result = ? WHERE id = ?").run(
    JSON.stringify(scores),
    userId
  );
}

// ---- Hobby operations ----

export function getUserHobbies(userId) {
  return db
    .prepare(
      `SELECT uh.*, h.name, h.name_en, h.description, h.category, h.difficulty, h.cost, h.indoor, h.tags
       FROM user_hobbies uh
       JOIN hobbies h ON uh.hobby_id = h.id
       WHERE uh.user_id = ?
       ORDER BY uh.tried_at DESC`
    )
    .all(userId);
}

export function getUserHobbyIds(userId) {
  return db
    .prepare("SELECT hobby_id FROM user_hobbies WHERE user_id = ?")
    .all(userId)
    .map((r) => r.hobby_id);
}

export function addUserHobby(userId, hobbyId) {
  db.prepare(
    "INSERT OR IGNORE INTO user_hobbies (user_id, hobby_id) VALUES (?, ?)"
  ).run(userId, hobbyId);
}

export function rateUserHobby(userId, hobbyId, rating) {
  db.prepare(
    "UPDATE user_hobbies SET rating = ? WHERE user_id = ? AND hobby_id = ?"
  ).run(rating, userId, hobbyId);
}

export function getUserHobby(userId, hobbyId) {
  return db
    .prepare(
      "SELECT * FROM user_hobbies WHERE user_id = ? AND hobby_id = ?"
    )
    .get(userId, hobbyId);
}

export function getHobbyById(hobbyId) {
  return db.prepare("SELECT * FROM hobbies WHERE id = ?").get(hobbyId);
}

export function getAllHobbies() {
  return db.prepare("SELECT * FROM hobbies").all();
}

export function getHobbiesByCategory(category) {
  return db
    .prepare("SELECT * FROM hobbies WHERE category = ?")
    .all(category);
}

// ---- Challenge operations ----

export function getOrCreateDailyChallenge(dateStr) {
  let challenge = db
    .prepare("SELECT * FROM challenges WHERE date = ?")
    .get(dateStr);
  if (challenge) return challenge;

  // Deterministic hobby selection based on date
  const allHobbies = db.prepare("SELECT * FROM hobbies").all();
  const dateHash = dateStr.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const hobbyIndex = dateHash % allHobbies.length;
  const hobby = allHobbies[hobbyIndex];

  const challengeTexts = [
    `「${hobby.name}」について5分間調べてみよう！`,
    `「${hobby.name}」に関するYouTube動画を1本見てみよう！`,
    `「${hobby.name}」を始めるために必要なものリストを作ってみよう！`,
    `「${hobby.name}」をやっている人のブログを読んでみよう！`,
    `「${hobby.name}」の魅力を3つ書き出してみよう！`,
  ];
  const textIndex = dateHash % challengeTexts.length;

  db.prepare(
    "INSERT INTO challenges (date, hobby_id, challenge_text) VALUES (?, ?, ?)"
  ).run(dateStr, hobby.id, challengeTexts[textIndex]);

  return db.prepare("SELECT * FROM challenges WHERE date = ?").get(dateStr);
}

export function completeChallenge(userId, dateStr) {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
  if (!user) return null;

  const today = dateStr;
  const yesterday = getYesterdayStr(dateStr);

  let newStreak;
  if (user.last_challenge_date === yesterday) {
    newStreak = user.streak + 1;
  } else if (user.last_challenge_date === today) {
    // Already completed today
    return { alreadyDone: true, streak: user.streak };
  } else {
    newStreak = 1;
  }

  const bestStreak = Math.max(user.best_streak, newStreak);

  db.prepare(
    "UPDATE users SET streak = ?, best_streak = ?, last_challenge_date = ? WHERE id = ?"
  ).run(newStreak, bestStreak, today, userId);

  return { alreadyDone: false, streak: newStreak, bestStreak };
}

function getYesterdayStr(dateStr) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

// ---- Stats operations ----

export function getUserStats(userId) {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
  if (!user) return null;

  const hobbyCount = db
    .prepare("SELECT COUNT(*) as c FROM user_hobbies WHERE user_id = ?")
    .get(userId).c;

  const avgRating = db
    .prepare(
      "SELECT AVG(rating) as avg FROM user_hobbies WHERE user_id = ? AND rating IS NOT NULL"
    )
    .get(userId).avg;

  const categoryBreakdown = db
    .prepare(
      `SELECT h.category, COUNT(*) as count
       FROM user_hobbies uh
       JOIN hobbies h ON uh.hobby_id = h.id
       WHERE uh.user_id = ?
       GROUP BY h.category
       ORDER BY count DESC`
    )
    .all(userId);

  const totalHobbies = db
    .prepare("SELECT COUNT(*) as c FROM hobbies")
    .get().c;

  return {
    user,
    hobbyCount,
    totalHobbies,
    avgRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
    categoryBreakdown,
    completionPercent: Math.round((hobbyCount / totalHobbies) * 100),
  };
}

export function getServerRanking(userIds) {
  if (!userIds || userIds.length === 0) return { byHobbies: [], byStreak: [] };

  const placeholders = userIds.map(() => "?").join(",");

  const byHobbies = db
    .prepare(
      `SELECT u.id, u.username, COUNT(uh.hobby_id) as hobby_count
       FROM users u
       LEFT JOIN user_hobbies uh ON u.id = uh.user_id
       WHERE u.id IN (${placeholders})
       GROUP BY u.id
       ORDER BY hobby_count DESC
       LIMIT 10`
    )
    .all(...userIds);

  const byStreak = db
    .prepare(
      `SELECT id, username, best_streak
       FROM users
       WHERE id IN (${placeholders})
       ORDER BY best_streak DESC
       LIMIT 10`
    )
    .all(...userIds);

  return { byHobbies, byStreak };
}

// Get a random untried hobby for user
export function getRandomUntriedHobby(userId, category = null) {
  const triedIds = getUserHobbyIds(userId);
  let query = "SELECT * FROM hobbies";
  const params = [];

  const conditions = [];
  if (triedIds.length > 0) {
    conditions.push(
      `id NOT IN (${triedIds.map(() => "?").join(",")})`
    );
    params.push(...triedIds);
  }
  if (category) {
    conditions.push("category = ?");
    params.push(category);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY RANDOM() LIMIT 1";

  return db.prepare(query).get(...params);
}
