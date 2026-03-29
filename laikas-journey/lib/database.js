/**
 * SQLite database layer for player and dog data.
 */

const Database = require("better-sqlite3");
const path = require("path");

let db;

function getDb(dbPath) {
  if (!db) {
    db = new Database(dbPath || path.join(__dirname, "..", "laikas-journey.db"));
    db.pragma("journal_mode = WAL");
    initSchema(db);
  }
  return db;
}

function initSchema(database) {
  database.exec(`
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
}

function createPlayer(userId, guildId, dogName) {
  const stmt = getDb().prepare(
    "INSERT OR IGNORE INTO players (user_id, guild_id, dog_name) VALUES (?, ?, ?)"
  );
  return stmt.run(userId, guildId, dogName);
}

function getPlayer(userId) {
  return getDb().prepare("SELECT * FROM players WHERE user_id = ?").get(userId);
}

function updatePlayer(userId, updates) {
  const keys = Object.keys(updates);
  const sets = keys.map((k) => `${k} = ?`).join(", ");
  const values = keys.map((k) => updates[k]);
  return getDb().prepare(`UPDATE players SET ${sets} WHERE user_id = ?`).run(...values, userId);
}

function addDiscovery(userId, planetId, fact) {
  try {
    getDb()
      .prepare("INSERT INTO discoveries (user_id, planet_id, fact) VALUES (?, ?, ?)")
      .run(userId, planetId, fact);
    return true;
  } catch (e) {
    return false; // Already discovered
  }
}

function getDiscoveries(userId) {
  return getDb()
    .prepare("SELECT planet_id, fact, discovered_at FROM discoveries WHERE user_id = ? ORDER BY discovered_at")
    .all(userId);
}

function getLeaderboard(guildId, limit = 10) {
  return getDb()
    .prepare(
      `SELECT user_id, dog_name, xp, planets_explored, challenges_correct
       FROM players WHERE guild_id = ? ORDER BY xp DESC LIMIT ?`
    )
    .all(guildId, limit);
}

function setDb(newDb) {
  db = newDb;
}

function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = {
  getDb,
  setDb,
  createPlayer,
  getPlayer,
  updatePlayer,
  addDiscovery,
  getDiscoveries,
  getLeaderboard,
  closeDb,
};
