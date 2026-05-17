// Date helpers — work in the host's local timezone.

export function todayIso(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function monthIsoOf(dateIso) {
  // "YYYY-MM-DD" -> "YYYY-MM"
  return dateIso.slice(0, 7);
}

export function groupByDay(entries) {
  const map = new Map();
  for (const e of entries) {
    const day = e.dateIso;
    if (!map.has(day)) map.set(day, []);
    map.get(day).push(e);
  }
  // Within each day, newest first.
  for (const list of map.values()) list.sort((a, b) => b.at.localeCompare(a.at));
  // Days sorted newest first.
  return new Map([...map.entries()].sort((a, b) => b[0].localeCompare(a[0])));
}

export function groupByMonth(entries) {
  const map = new Map();
  for (const e of entries) {
    const month = monthIsoOf(e.dateIso);
    if (!map.has(month)) map.set(month, []);
    map.get(month).push(e);
  }
  for (const list of map.values()) list.sort((a, b) => b.at.localeCompare(a.at));
  return new Map([...map.entries()].sort((a, b) => b[0].localeCompare(a[0])));
}

export function search(entries, query) {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();
  return entries.filter((e) =>
    e.title.toLowerCase().includes(q) ||
    e.url.toLowerCase().includes(q) ||
    e.note.toLowerCase().includes(q)
  );
}
