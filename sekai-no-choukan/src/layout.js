// Compute a deterministic 3-column layout for the 12 headlines.
// The lead story (priority 1) always takes column 1 (left, full height).
// The remaining 11 stories are placed across columns 2 and 3, deterministically
// ordered by the day's date (so the same date always yields the same paper).

const { HEADLINES, leadStory } = require("./headlines.js");

// xorshift32 with golden-ratio warmup — same algorithm we've been using.
function makeRng(seed) {
  let s = (((seed | 0) ^ 0x9e3779b1) | 0) || 0x9e3779b1;
  for (let i = 0; i < 3; i++) {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
  }
  return function next() {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) / 0x1_0000_0000);
  };
}

function shuffleInPlace(arr, rng) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

function dateSeed(dateLike) {
  const d = dateLike instanceof Date ? dateLike : new Date(dateLike);
  return d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate();
}

// Returns { lead: Story, columns: [[Story, ...], [Story, ...]] }
// columns[0] = middle column, columns[1] = right column.
function layoutGrid(dateLike) {
  const lead = leadStory();
  const rest = HEADLINES.filter((h) => h.priority !== 1).slice();
  const rng = makeRng(dateSeed(dateLike));
  shuffleInPlace(rest, rng);

  // Distribute round-robin so each column has a similar mix.
  const col1 = [];
  const col2 = [];
  for (let i = 0; i < rest.length; i++) {
    (i % 2 === 0 ? col1 : col2).push(rest[i]);
  }
  return { lead, columns: [col1, col2] };
}

// Format a date as Japanese morning-paper header: "2026 年 5 月 17 日 (土)"
function formatHeaderDate(dateLike) {
  const d = dateLike instanceof Date ? dateLike : new Date(dateLike);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  const dow = ["日", "月", "火", "水", "木", "金", "土"][d.getUTCDay()];
  return `${y} 年 ${m} 月 ${day} 日 (${dow})`;
}

function shiftDate(dateLike, days) {
  const d = new Date(dateLike instanceof Date ? dateLike.getTime() : Date.parse(dateLike));
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

module.exports = {
  layoutGrid,
  formatHeaderDate,
  shiftDate,
  dateSeed,
  makeRng,
  shuffleInPlace,
};
