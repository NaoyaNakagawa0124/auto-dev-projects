// 文学暦ロジック — Rust 側 src-tauri/src/calendar.rs と同等の動作

export async function loadAuthors() {
  const res = await fetch("./data/authors.json");
  if (!res.ok) throw new Error("authors.json の読み込みに失敗しました");
  const data = await res.json();
  return data.authors;
}

function dateMd(s) {
  if (typeof s !== "string" || s.length !== 10) return null;
  return s.slice(5);
}

function yearOf(s) {
  return s ? parseInt(s.slice(0, 4), 10) : null;
}

export function anniversariesOn(authors, todayYear, mmdd) {
  const out = [];
  for (const a of authors) {
    if (dateMd(a.born) === mmdd) {
      const y = yearOf(a.born);
      if (y != null) out.push({ author: a, kind: "birth", year: y, years_ago: todayYear - y });
    }
    if (a.died && dateMd(a.died) === mmdd) {
      const y = yearOf(a.died);
      if (y != null) out.push({ author: a, kind: "death", year: y, years_ago: todayYear - y });
    }
  }
  // 誕生→命日の順、より古い周年が上
  const order = { birth: 0, death: 1 };
  out.sort((x, y) => order[x.kind] - order[y.kind] || y.years_ago - x.years_ago);
  return out;
}

export function summonsForDate(authors, dateIso) {
  const parts = dateIso.split("-");
  if (parts.length !== 3) return [];
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  for (let delta = 0; delta <= 3; delta++) {
    for (const sign of [0, -1, 1]) {
      if (delta === 0 && sign !== 0) continue;
      const offset = sign * delta;
      const shifted = shiftMd(month, day, offset);
      if (!shifted) continue;
      const mmdd = `${String(shifted.m).padStart(2, "0")}-${String(shifted.d).padStart(2, "0")}`;
      const hits = anniversariesOn(authors, year, mmdd);
      if (hits.length > 0) return hits.slice(0, 5);
    }
  }
  return [];
}

export function daysInMonth(year, month) {
  if ([1, 3, 5, 7, 8, 10, 12].includes(month)) return 31;
  if ([4, 6, 9, 11].includes(month)) return 30;
  if (month === 2) return isLeap(year) ? 29 : 28;
  return 0;
}

function isLeap(y) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

function shiftMd(month, day, offset) {
  if (month < 1 || month > 12) return null;
  let m = month;
  let d = day + offset;
  while (true) {
    if (d < 1) {
      m--;
      if (m < 1) m = 12;
      d += daysInMonth(2024, m); // 閏年基準
      continue;
    }
    const dim = daysInMonth(2024, m);
    if (d > dim) {
      d -= dim;
      m++;
      if (m > 12) m = 1;
      continue;
    }
    break;
  }
  return { m, d };
}

export function anniversariesForMonth(authors, year, month) {
  const days = daysInMonth(year, month);
  const counts = new Array(days).fill(0);
  for (let d = 1; d <= days; d++) {
    const mmdd = `${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    counts[d - 1] = anniversariesOn(authors, year, mmdd).length;
  }
  return counts;
}
