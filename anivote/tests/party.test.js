const {
  STATUS, createParty, addMember, removeMember, addAnime, removeAnime,
  vote, getVoteScore, getMemberVote, setStatus, incrementEpisode,
  getCandidates, getWatching, getCompleted, getStats, exportParty, importParty
} = require('../js/party');

let passed = 0, failed = 0;
function assert(c, m) { if (c) passed++; else { failed++; console.error('  FAIL: ' + m); } }
function eq(a, b, m) { assert(a === b, `${m} (got ${a}, exp ${b})`); }

console.log('Party Tests\n===========');

// Create
console.log('\n--- Create ---');
const p = createParty('Anime Night', 'Alice');
assert(p.id.length > 0, 'has id');
eq(p.name, 'Anime Night', 'party name');
eq(p.members.length, 1, '1 member');
eq(p.members[0].name, 'Alice', 'creator name');
eq(p.anime.length, 0, 'no anime');

// Members
console.log('\n--- Members ---');
addMember(p, 'Bob');
addMember(p, 'Charlie');
eq(p.members.length, 3, '3 members');
addMember(p, 'Bob'); // duplicate
eq(p.members.length, 3, 'no duplicate');
addMember(p, ''); // empty
eq(p.members.length, 3, 'no empty name');

removeMember(p, 'Charlie');
eq(p.members.length, 2, '2 after remove');

// Anime
console.log('\n--- Anime ---');
addAnime(p, 'Attack on Titan', 87, 'Action', '\u2694\uFE0F');
addAnime(p, 'Spy x Family', 37, 'Comedy', '\uD83D\uDD75\uFE0F');
addAnime(p, 'Frieren', 28, 'Fantasy', '\uD83E\uDDD9');
eq(p.anime.length, 3, '3 anime');
eq(p.anime[0].title, 'Attack on Titan', 'first title');
eq(p.anime[0].status, STATUS.CANDIDATE, 'default candidate');
eq(p.anime[0].watchedEpisodes, 0, '0 watched');

removeAnime(p, p.anime[2].id);
eq(p.anime.length, 2, '2 after remove');

// Voting
console.log('\n--- Voting ---');
const aot = p.anime[0];
vote(p, aot.id, 'Alice', 5);
vote(p, aot.id, 'Bob', 3);
eq(aot.votes.length, 2, '2 votes');
eq(getVoteScore(aot), 4, 'avg score 4');
eq(getMemberVote(aot, 'Alice'), 5, 'Alice vote 5');
eq(getMemberVote(aot, 'Bob'), 3, 'Bob vote 3');
eq(getMemberVote(aot, 'Charlie'), 0, 'Charlie no vote');

// Update vote
vote(p, aot.id, 'Alice', 4);
eq(aot.votes.length, 2, 'still 2 votes');
eq(getMemberVote(aot, 'Alice'), 4, 'updated to 4');

// Vote clamping
vote(p, aot.id, 'Alice', 10);
eq(getMemberVote(aot, 'Alice'), 5, 'clamped to 5');
vote(p, aot.id, 'Alice', 0);
eq(getMemberVote(aot, 'Alice'), 1, 'clamped to 1');

// No-vote score
const spy = p.anime[1];
eq(getVoteScore(spy), 0, 'no votes = 0');

// Status
console.log('\n--- Status ---');
setStatus(p, aot.id, STATUS.WATCHING);
eq(aot.status, STATUS.WATCHING, 'set to watching');
eq(getWatching(p).length, 1, '1 watching');
eq(getCandidates(p).length, 1, '1 candidate left');

// Episodes
console.log('\n--- Episodes ---');
incrementEpisode(p, aot.id);
incrementEpisode(p, aot.id);
eq(aot.watchedEpisodes, 2, '2 episodes watched');

// Watch all episodes
for (let i = 0; i < 100; i++) incrementEpisode(p, aot.id);
eq(aot.watchedEpisodes, 87, 'capped at total');
eq(aot.status, STATUS.COMPLETED, 'auto-completed');
eq(getCompleted(p).length, 1, '1 completed');

// Candidates sorted by score
console.log('\n--- Sorting ---');
const p2 = createParty('Test', 'A');
addAnime(p2, 'Low', 12, 'G');
addAnime(p2, 'High', 12, 'G');
addAnime(p2, 'Mid', 12, 'G');
vote(p2, p2.anime[0].id, 'A', 1);
vote(p2, p2.anime[1].id, 'A', 5);
vote(p2, p2.anime[2].id, 'A', 3);
const sorted = getCandidates(p2);
eq(sorted[0].title, 'High', 'highest first');
eq(sorted[2].title, 'Low', 'lowest last');

// Stats
console.log('\n--- Stats ---');
const stats = getStats(p);
assert(stats.total >= 2, 'stats total');
assert(stats.members >= 2, 'stats members');
assert(stats.totalVotes > 0, 'stats votes');
assert(stats.totalEpisodes > 0, 'stats episodes');

// Export/Import
console.log('\n--- Export/Import ---');
const exported = exportParty(p);
assert(typeof exported === 'string', 'export is string');
assert(exported.length > 0, 'export not empty');

const imported = importParty(exported);
assert(imported !== null, 'import succeeds');
eq(imported.name, p.name, 'imported name matches');
eq(imported.members.length, p.members.length, 'imported members match');
eq(imported.anime.length, p.anime.length, 'imported anime match');

assert(importParty('invalid!!!') === null, 'invalid import returns null');

// Remove member removes votes
console.log('\n--- Remove Cascades ---');
const p3 = createParty('T', 'X');
addMember(p3, 'Y');
addAnime(p3, 'Show', 12, 'G');
vote(p3, p3.anime[0].id, 'X', 5);
vote(p3, p3.anime[0].id, 'Y', 3);
eq(p3.anime[0].votes.length, 2, '2 votes before remove');
removeMember(p3, 'Y');
eq(p3.anime[0].votes.length, 1, '1 vote after member remove');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
