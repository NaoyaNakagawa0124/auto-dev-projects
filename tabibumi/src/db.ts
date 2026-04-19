/**
 * Database Layer — SQLite via bun:sqlite
 */
import { Database } from "bun:sqlite";
import { join } from "path";
import { homedir } from "os";
import { mkdirSync, existsSync } from "fs";

export interface Trip {
  id: number;
  destination: string;
  startedAt: string;
  endedAt: string | null;
  isActive: number;
}

export interface Entry {
  id: number;
  tripId: number;
  question: string;
  answer: string;
  mood: string;
  location: string;
  createdAt: string;
}

const DB_DIR = join(homedir(), ".tabibumi");
const DB_PATH = join(DB_DIR, "journal.db");

let _db: Database | null = null;

export function getDbPath(): string {
  return DB_PATH;
}

export function openDb(path?: string): Database {
  if (_db) return _db;

  const dbPath = path || DB_PATH;
  const dir = join(dbPath, "..");
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  _db = new Database(dbPath);
  _db.run("PRAGMA journal_mode=WAL");

  _db.run(`
    CREATE TABLE IF NOT EXISTS trips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      destination TEXT NOT NULL,
      startedAt TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      endedAt TEXT,
      isActive INTEGER NOT NULL DEFAULT 1
    )
  `);

  _db.run(`
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tripId INTEGER NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      mood TEXT NOT NULL DEFAULT '',
      location TEXT NOT NULL DEFAULT '',
      createdAt TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (tripId) REFERENCES trips(id)
    )
  `);

  return _db;
}

export function closeDb(): void {
  if (_db) {
    _db.close();
    _db = null;
  }
}

// ===== Trip Operations =====

export function startTrip(destination: string): Trip {
  const db = openDb();
  // End any active trips first
  db.run("UPDATE trips SET isActive = 0, endedAt = datetime('now', 'localtime') WHERE isActive = 1");

  const stmt = db.prepare("INSERT INTO trips (destination) VALUES (?)");
  stmt.run(destination);

  return db.prepare("SELECT * FROM trips WHERE id = last_insert_rowid()").get() as Trip;
}

export function endTrip(): Trip | null {
  const db = openDb();
  const active = getActiveTrip();
  if (!active) return null;

  db.run("UPDATE trips SET isActive = 0, endedAt = datetime('now', 'localtime') WHERE id = ?", [active.id]);
  return db.prepare("SELECT * FROM trips WHERE id = ?").get(active.id) as Trip;
}

export function getActiveTrip(): Trip | null {
  const db = openDb();
  return (db.prepare("SELECT * FROM trips WHERE isActive = 1 LIMIT 1").get() as Trip) || null;
}

export function getAllTrips(): Trip[] {
  const db = openDb();
  return db.prepare("SELECT * FROM trips ORDER BY startedAt DESC").all() as Trip[];
}

export function getTripById(id: number): Trip | null {
  const db = openDb();
  return (db.prepare("SELECT * FROM trips WHERE id = ?").get(id) as Trip) || null;
}

// ===== Entry Operations =====

export function addEntry(tripId: number, question: string, answer: string, mood: string = "", location: string = ""): Entry {
  const db = openDb();
  const stmt = db.prepare("INSERT INTO entries (tripId, question, answer, mood, location) VALUES (?, ?, ?, ?, ?)");
  stmt.run(tripId, question, answer, mood, location);

  return db.prepare("SELECT * FROM entries WHERE id = last_insert_rowid()").get() as Entry;
}

export function getEntriesByTrip(tripId: number): Entry[] {
  const db = openDb();
  return db.prepare("SELECT * FROM entries WHERE tripId = ? ORDER BY createdAt ASC").all(tripId) as Entry[];
}

export function getEntryCount(tripId: number): number {
  const db = openDb();
  const result = db.prepare("SELECT COUNT(*) as count FROM entries WHERE tripId = ?").get(tripId) as { count: number };
  return result.count;
}

export function getLatestEntry(tripId: number): Entry | null {
  const db = openDb();
  return (db.prepare("SELECT * FROM entries WHERE tripId = ? ORDER BY createdAt DESC LIMIT 1").get(tripId) as Entry) || null;
}

// ===== Stats =====

export function getTripDays(trip: Trip): number {
  const start = new Date(trip.startedAt);
  const end = trip.endedAt ? new Date(trip.endedAt) : new Date();
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getMoodCounts(tripId: number): Record<string, number> {
  const db = openDb();
  const rows = db.prepare(
    "SELECT mood, COUNT(*) as count FROM entries WHERE tripId = ? AND mood != '' GROUP BY mood"
  ).all(tripId) as Array<{ mood: string; count: number }>;

  const counts: Record<string, number> = {};
  for (const row of rows) {
    counts[row.mood] = row.count;
  }
  return counts;
}
