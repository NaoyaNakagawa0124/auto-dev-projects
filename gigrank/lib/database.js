/**
 * Database layer for GigRank.
 */

const Database = require("better-sqlite3");
const path = require("path");
const crypto = require("crypto");

let db;

function getDb(dbPath) {
  if (!db) {
    db = new Database(dbPath || path.join(__dirname, "..", "gigrank.db"));
    db.pragma("journal_mode = WAL");
    initSchema(db);
  }
  return db;
}

function setDb(newDb) {
  db = newDb;
}

function initSchema(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS groups (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      join_code TEXT UNIQUE NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id TEXT NOT NULL,
      username TEXT NOT NULL,
      joined_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (group_id) REFERENCES groups(id),
      UNIQUE(group_id, username)
    );

    CREATE TABLE IF NOT EXISTS gigs (
      id TEXT PRIMARY KEY,
      group_id TEXT NOT NULL,
      artist TEXT NOT NULL,
      venue TEXT NOT NULL,
      gig_date TEXT NOT NULL,
      added_by TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (group_id) REFERENCES groups(id)
    );

    CREATE TABLE IF NOT EXISTS ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gig_id TEXT NOT NULL,
      username TEXT NOT NULL,
      energy INTEGER NOT NULL CHECK(energy BETWEEN 1 AND 10),
      sound INTEGER NOT NULL CHECK(sound BETWEEN 1 AND 10),
      setlist INTEGER NOT NULL CHECK(setlist BETWEEN 1 AND 10),
      crowd INTEGER NOT NULL CHECK(crowd BETWEEN 1 AND 10),
      vibes INTEGER NOT NULL CHECK(vibes BETWEEN 1 AND 10),
      comment TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (gig_id) REFERENCES gigs(id),
      UNIQUE(gig_id, username)
    );
  `);
}

function generateId() {
  return crypto.randomBytes(8).toString("hex");
}

function generateJoinCode() {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
}

// Groups
function createGroup(name) {
  const id = generateId();
  const joinCode = generateJoinCode();
  getDb().prepare("INSERT INTO groups (id, name, join_code) VALUES (?, ?, ?)").run(id, name, joinCode);
  return { id, name, joinCode };
}

function getGroup(groupId) {
  return getDb().prepare("SELECT * FROM groups WHERE id = ?").get(groupId);
}

function getGroupByCode(joinCode) {
  return getDb().prepare("SELECT * FROM groups WHERE join_code = ?").get(joinCode);
}

// Members
function addMember(groupId, username) {
  try {
    getDb().prepare("INSERT INTO members (group_id, username) VALUES (?, ?)").run(groupId, username);
    return true;
  } catch {
    return false; // Already a member
  }
}

function getMembers(groupId) {
  return getDb().prepare("SELECT username, joined_at FROM members WHERE group_id = ? ORDER BY joined_at").all(groupId);
}

// Gigs
function createGig(groupId, artist, venue, gigDate, addedBy) {
  const id = generateId();
  getDb()
    .prepare("INSERT INTO gigs (id, group_id, artist, venue, gig_date, added_by) VALUES (?, ?, ?, ?, ?, ?)")
    .run(id, groupId, artist, venue, gigDate, addedBy);
  return { id, artist, venue, gigDate };
}

function getGig(gigId) {
  return getDb().prepare("SELECT * FROM gigs WHERE id = ?").get(gigId);
}

function getGigsByGroup(groupId) {
  return getDb().prepare("SELECT * FROM gigs WHERE group_id = ? ORDER BY gig_date DESC").all(groupId);
}

// Ratings
function addRating(gigId, username, scores, comment) {
  const stmt = getDb().prepare(
    `INSERT OR REPLACE INTO ratings (gig_id, username, energy, sound, setlist, crowd, vibes, comment)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );
  stmt.run(gigId, username, scores.energy, scores.sound, scores.setlist, scores.crowd, scores.vibes, comment || null);
  return true;
}

function getRatingsForGig(gigId) {
  return getDb().prepare("SELECT * FROM ratings WHERE gig_id = ? ORDER BY username").all(gigId);
}

function getAverageRatings(gigId) {
  return getDb()
    .prepare(
      `SELECT
        ROUND(AVG(energy), 1) as energy,
        ROUND(AVG(sound), 1) as sound,
        ROUND(AVG(setlist), 1) as setlist,
        ROUND(AVG(crowd), 1) as crowd,
        ROUND(AVG(vibes), 1) as vibes,
        COUNT(*) as count
      FROM ratings WHERE gig_id = ?`
    )
    .get(gigId);
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
  initSchema,
  createGroup,
  getGroup,
  getGroupByCode,
  addMember,
  getMembers,
  createGig,
  getGig,
  getGigsByGroup,
  addRating,
  getRatingsForGig,
  getAverageRatings,
  closeDb,
};
