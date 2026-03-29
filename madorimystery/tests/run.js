// MadoriMystery Test Suite
import { ROOM_TYPES, SUSPECTS, generateMystery, checkAccusation, findClue, getFoundClues, allCluesFound } from '../src/mystery.js';
import { FloorPlan } from '../src/floorplan.js';

let total = 0, passed = 0, failed = 0;
function describe(n, fn) { console.log(`\n  \x1b[1m${n}\x1b[0m`); fn(); }
function it(n, fn) { total++; try { fn(); passed++; console.log(`    \x1b[32m✓\x1b[0m ${n}`); } catch(e) { failed++; console.log(`    \x1b[31m✗\x1b[0m ${n}\n      \x1b[31m${e.message}\x1b[0m`); } }
function assert(c, m) { if (!c) throw new Error(m || 'Failed'); }
function eq(a, b, m) { if (a !== b) throw new Error(m || `Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`); }

console.log('\n\x1b[1m🔍 MadoriMystery Test Suite (App #50!)\x1b[0m');

describe('Room Types', () => {
  it('should have 8 room types', () => eq(ROOM_TYPES.length, 8));
  it('should have unique ids', () => eq(new Set(ROOM_TYPES.map(r => r.id)).size, 8));
  it('should have Japanese names', () => ROOM_TYPES.forEach(r => assert(r.name.length > 0)));
  it('should have emojis', () => ROOM_TYPES.forEach(r => assert(r.emoji)));
  it('should have hex colors', () => ROOM_TYPES.forEach(r => assert(/^#[0-9a-fA-F]{6}$/.test(r.color))));
});

describe('Suspects', () => {
  it('should have 4 suspects', () => eq(SUSPECTS.length, 4));
  it('should have unique ids', () => eq(new Set(SUSPECTS.map(s => s.id)).size, 4));
  it('should have Japanese names', () => SUSPECTS.forEach(s => assert(s.name.length > 0)));
  it('should have roles', () => SUSPECTS.forEach(s => assert(s.role)));
  it('should have alibis', () => SUSPECTS.forEach(s => assert(s.alibi)));
  it('should have emojis', () => SUSPECTS.forEach(s => assert(s.emoji)));
});

describe('FloorPlan', () => {
  it('should start empty', () => {
    const fp = new FloorPlan();
    eq(fp.getRoomCount(), 0);
  });
  it('should add a room', () => {
    const fp = new FloorPlan();
    const r = fp.addRoom(0, 0, 'living', 2, 2);
    assert(r !== null);
    eq(fp.getRoomCount(), 1);
  });
  it('should reject out of bounds', () => {
    const fp = new FloorPlan();
    eq(fp.addRoom(7, 5, 'living', 2, 2), null); // overflows
  });
  it('should reject overlapping rooms', () => {
    const fp = new FloorPlan();
    fp.addRoom(0, 0, 'living', 2, 2);
    eq(fp.addRoom(1, 1, 'kitchen', 2, 2), null); // overlaps
  });
  it('should allow adjacent rooms', () => {
    const fp = new FloorPlan();
    fp.addRoom(0, 0, 'living', 2, 2);
    const r = fp.addRoom(2, 0, 'kitchen', 2, 2);
    assert(r !== null);
    eq(fp.getRoomCount(), 2);
  });
  it('should remove a room', () => {
    const fp = new FloorPlan();
    const r = fp.addRoom(0, 0, 'living');
    fp.removeRoom(r.id);
    eq(fp.getRoomCount(), 0);
  });
  it('should get room at position', () => {
    const fp = new FloorPlan();
    fp.addRoom(2, 2, 'bedroom', 2, 2);
    const r = fp.getRoomAt(3, 3);
    assert(r !== null);
    eq(r.type, 'bedroom');
  });
  it('should return null for empty position', () => {
    const fp = new FloorPlan();
    eq(fp.getRoomAt(0, 0), undefined);
  });
  it('should clear all rooms', () => {
    const fp = new FloorPlan();
    fp.addRoom(0, 0, 'living');
    fp.addRoom(2, 0, 'kitchen');
    fp.clear();
    eq(fp.getRoomCount(), 0);
  });
  it('should serialize to JSON', () => {
    const fp = new FloorPlan();
    fp.addRoom(0, 0, 'study');
    const json = fp.toJSON();
    assert(json.includes('study'));
  });
  it('should deserialize from JSON', () => {
    const fp = new FloorPlan();
    fp.addRoom(0, 0, 'living');
    const json = fp.toJSON();
    const fp2 = new FloorPlan();
    assert(fp2.fromJSON(json));
    eq(fp2.getRoomCount(), 1);
  });
});

describe('Mystery Generation', () => {
  const rooms = [
    { id: 'r1', type: 'living', x: 0, y: 0, w: 2, h: 2 },
    { id: 'r2', type: 'kitchen', x: 2, y: 0, w: 2, h: 2 },
    { id: 'r3', type: 'bedroom', x: 0, y: 2, w: 2, h: 2 },
    { id: 'r4', type: 'study', x: 2, y: 2, w: 2, h: 2 },
  ];

  it('should return null for < 2 rooms', () => {
    eq(generateMystery([{ id: 'r1', type: 'living', x: 0, y: 0, w: 2, h: 2 }]), null);
  });

  it('should generate mystery for 4 rooms', () => {
    const m = generateMystery(rooms);
    assert(m !== null);
  });

  it('should have a title', () => {
    const m = generateMystery(rooms);
    assert(m.title.length > 0);
  });

  it('should have a culprit from suspects', () => {
    const m = generateMystery(rooms);
    assert(SUSPECTS.some(s => s.id === m.culprit));
  });

  it('should have a weapon', () => {
    const m = generateMystery(rooms);
    assert(m.weapon.name);
    assert(m.weapon.emoji);
  });

  it('should have a motive', () => {
    const m = generateMystery(rooms);
    assert(m.motive.length > 0);
  });

  it('should have clues', () => {
    const m = generateMystery(rooms);
    assert(m.clues.length >= 3);
  });

  it('should have a solution', () => {
    const m = generateMystery(rooms);
    assert(m.solution.length > 20);
  });

  it('should have crime scene in room list', () => {
    const m = generateMystery(rooms);
    assert(rooms.some(r => r.id === m.crimeScene));
  });

  it('should include red herring clue', () => {
    const m = generateMystery(rooms);
    assert(m.clues.some(c => c.isRedHerring));
  });

  it('clues should reference existing rooms', () => {
    const m = generateMystery(rooms);
    const roomIds = rooms.map(r => r.id);
    m.clues.forEach(c => assert(roomIds.includes(c.roomId), `Clue references unknown room ${c.roomId}`));
  });

  it('should be deterministic for same rooms', () => {
    const m1 = generateMystery(rooms);
    const m2 = generateMystery(rooms);
    eq(m1.culprit, m2.culprit);
    eq(m1.title, m2.title);
  });
});

describe('Investigation', () => {
  const rooms = [
    { id: 'r1', type: 'living', x: 0, y: 0, w: 2, h: 2 },
    { id: 'r2', type: 'kitchen', x: 2, y: 0, w: 2, h: 2 },
    { id: 'r3', type: 'bathroom', x: 0, y: 2, w: 2, h: 2 },
  ];

  it('findClue should return clue for room with clue', () => {
    const m = generateMystery(rooms);
    const roomWithClue = m.clues[0].roomId;
    const clue = findClue(m, roomWithClue);
    assert(clue !== null);
    assert(clue.found);
  });

  it('findClue should return null for room without clue', () => {
    const m = generateMystery(rooms);
    // Find a room that has no unfound clues
    const allClueRooms = m.clues.map(c => c.roomId);
    // First find all clues
    m.clues.forEach(c => { c.found = true; });
    const clue = findClue(m, rooms[0].id);
    eq(clue, null);
  });

  it('getFoundClues should track found clues', () => {
    const m = generateMystery(rooms);
    eq(getFoundClues(m).length, 0);
    findClue(m, m.clues[0].roomId);
    eq(getFoundClues(m).length, 1);
  });

  it('checkAccusation should accept correct culprit', () => {
    const m = generateMystery(rooms);
    assert(checkAccusation(m, m.culprit));
  });

  it('checkAccusation should reject wrong culprit', () => {
    const m = generateMystery(rooms);
    const wrongSuspect = SUSPECTS.find(s => s.id !== m.culprit);
    assert(!checkAccusation(m, wrongSuspect.id));
  });

  it('allCluesFound should work correctly', () => {
    const m = generateMystery(rooms);
    assert(!allCluesFound(m));
    m.clues.forEach(c => { c.found = true; });
    assert(allCluesFound(m));
  });
});

// Summary
console.log('\n' + '─'.repeat(50));
console.log(`\x1b[1m  Results: ${passed}/${total} passed\x1b[0m`);
if (failed > 0) { console.log(`  \x1b[31m${failed} failed\x1b[0m`); process.exit(1); }
else { console.log('  \x1b[32mAll tests passed! 🔍🎉 App #50 milestone!\x1b[0m'); }
console.log('');
