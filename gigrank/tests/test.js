/**
 * GigRank - Unit & Integration Tests
 */

const Database = require("better-sqlite3");
const db = require("../lib/database");

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

// Setup in-memory database
const testDb = new Database(":memory:");
testDb.pragma("journal_mode = WAL");
db.setDb(testDb);
db.initSchema(testDb);

// ===== Database Tests =====
describe("Group Creation", () => {
  const group = db.createGroup("Summer Crew");
  assert(group.id.length === 16, "group has 16-char hex ID");
  assert(group.joinCode.length === 6, "join code is 6 chars");
  assert(group.name === "Summer Crew", "group name matches");

  const fetched = db.getGroup(group.id);
  assert(fetched !== undefined, "group can be fetched by ID");
  assert(fetched.name === "Summer Crew", "fetched name matches");

  const byCode = db.getGroupByCode(group.joinCode);
  assert(byCode !== undefined, "group found by join code");
  assert(byCode.id === group.id, "found correct group by code");

  const notFound = db.getGroupByCode("XXXXXX");
  assert(notFound === undefined, "unknown code returns undefined");
});

describe("Members", () => {
  const group = db.createGroup("Test Group");
  const added = db.addMember(group.id, "Alice");
  assert(added === true, "first member added");

  const added2 = db.addMember(group.id, "Bob");
  assert(added2 === true, "second member added");

  const duplicate = db.addMember(group.id, "Alice");
  assert(duplicate === false, "duplicate member rejected");

  const members = db.getMembers(group.id);
  assert(members.length === 2, "group has 2 members");
  assert(members[0].username === "Alice", "Alice is first member");
  assert(members[1].username === "Bob", "Bob is second member");
});

describe("Gigs", () => {
  const group = db.createGroup("Gig Group");
  const gig = db.createGig(group.id, "Radiohead", "Madison Square Garden", "2026-04-15", "Alice");
  assert(gig.id.length === 16, "gig has 16-char hex ID");
  assert(gig.artist === "Radiohead", "artist matches");
  assert(gig.venue === "Madison Square Garden", "venue matches");

  const fetched = db.getGig(gig.id);
  assert(fetched !== undefined, "gig can be fetched");
  assert(fetched.artist === "Radiohead", "fetched artist matches");
  assert(fetched.group_id === group.id, "gig linked to group");

  const gig2 = db.createGig(group.id, "Tame Impala", "O2 Arena", "2026-05-20", "Bob");
  const gigs = db.getGigsByGroup(group.id);
  assert(gigs.length === 2, "group has 2 gigs");
  assert(gigs[0].artist === "Tame Impala", "newest gig first (by date)");
});

describe("Ratings", () => {
  const group = db.createGroup("Rating Group");
  const gig = db.createGig(group.id, "Daft Punk", "Bercy", "2026-06-01", "Alice");

  const scores = { energy: 9, sound: 10, setlist: 8, crowd: 7, vibes: 10 };
  db.addRating(gig.id, "Alice", scores, "Best show ever!");

  const ratings = db.getRatingsForGig(gig.id);
  assert(ratings.length === 1, "gig has 1 rating");
  assert(ratings[0].username === "Alice", "rating by Alice");
  assert(ratings[0].energy === 9, "energy score correct");
  assert(ratings[0].sound === 10, "sound score correct");
  assert(ratings[0].comment === "Best show ever!", "comment saved");

  // Second rating
  const scores2 = { energy: 7, sound: 8, setlist: 9, crowd: 6, vibes: 8 };
  db.addRating(gig.id, "Bob", scores2, null);

  const allRatings = db.getRatingsForGig(gig.id);
  assert(allRatings.length === 2, "gig has 2 ratings");

  // Average
  const avg = db.getAverageRatings(gig.id);
  assert(avg.count === 2, "average from 2 ratings");
  assert(avg.energy === 8, "avg energy = (9+7)/2 = 8");
  assert(avg.sound === 9, "avg sound = (10+8)/2 = 9");
  assert(avg.setlist === 8.5, "avg setlist = (8+9)/2 = 8.5");
  assert(avg.crowd === 6.5, "avg crowd = (7+6)/2 = 6.5");
  assert(avg.vibes === 9, "avg vibes = (10+8)/2 = 9");

  // Update rating (upsert)
  const updatedScores = { energy: 10, sound: 10, setlist: 10, crowd: 10, vibes: 10 };
  db.addRating(gig.id, "Alice", updatedScores, "Changed my mind - PERFECT");

  const updated = db.getRatingsForGig(gig.id);
  assert(updated.length === 2, "still 2 ratings after upsert");
  const aliceRating = updated.find((r) => r.username === "Alice");
  assert(aliceRating.energy === 10, "Alice energy updated to 10");
  assert(aliceRating.comment === "Changed my mind - PERFECT", "comment updated");
});

describe("Average with no ratings", () => {
  const group = db.createGroup("Empty Group");
  const gig = db.createGig(group.id, "Nobody", "Nowhere", "2026-01-01", "X");
  const avg = db.getAverageRatings(gig.id);
  assert(avg.count === 0, "count is 0 for no ratings");
  assert(avg.energy === null, "energy is null for no ratings");
});

describe("Rating Constraints", () => {
  const group = db.createGroup("Constraint Group");
  const gig = db.createGig(group.id, "Test", "Test", "2026-01-01", "X");

  let threw = false;
  try {
    db.addRating(gig.id, "X", { energy: 11, sound: 5, setlist: 5, crowd: 5, vibes: 5 });
  } catch {
    threw = true;
  }
  assert(threw, "rejects energy > 10");

  threw = false;
  try {
    db.addRating(gig.id, "X", { energy: 0, sound: 5, setlist: 5, crowd: 5, vibes: 5 });
  } catch {
    threw = true;
  }
  assert(threw, "rejects energy < 1");

  // Valid edge cases
  db.addRating(gig.id, "Y", { energy: 1, sound: 1, setlist: 1, crowd: 1, vibes: 1 });
  db.addRating(gig.id, "Z", { energy: 10, sound: 10, setlist: 10, crowd: 10, vibes: 10 });
  const ratings = db.getRatingsForGig(gig.id);
  assert(ratings.length === 2, "boundary values 1 and 10 accepted");
});

describe("Multiple Groups Isolation", () => {
  const group1 = db.createGroup("Group A");
  const group2 = db.createGroup("Group B");

  db.createGig(group1.id, "Artist A", "Venue A", "2026-01-01", "X");
  db.createGig(group1.id, "Artist B", "Venue B", "2026-01-02", "X");
  db.createGig(group2.id, "Artist C", "Venue C", "2026-01-03", "Y");

  const gigs1 = db.getGigsByGroup(group1.id);
  const gigs2 = db.getGigsByGroup(group2.id);

  assert(gigs1.length === 2, "Group A has 2 gigs");
  assert(gigs2.length === 1, "Group B has 1 gig");
  assert(gigs1.every((g) => g.group_id === group1.id), "Group A gigs belong to A");
  assert(gigs2[0].group_id === group2.id, "Group B gig belongs to B");
});

// ===== Cleanup =====
testDb.close();

// ===== Results =====
console.log(`\n${"=".repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log("=".repeat(40));

process.exit(failed > 0 ? 1 : 0);
