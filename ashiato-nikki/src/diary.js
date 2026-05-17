// High-level diary operations. Talks to a storage adapter.

import { makeEntry, isValidEntry } from "./entry.js";

const KEY_ENTRIES = "ashiato-nikki:entries";

async function readEntries(storage) {
  const raw = await storage.get(KEY_ENTRIES);
  if (!Array.isArray(raw)) return [];
  return raw.filter(isValidEntry);
}

async function writeEntries(storage, entries) {
  await storage.set(KEY_ENTRIES, entries);
}

export async function addEntry(storage, raw) {
  const entry = makeEntry(raw);
  const existing = await readEntries(storage);
  existing.unshift(entry);  // newest first
  await writeEntries(storage, existing);
  return entry;
}

export async function listEntries(storage) {
  const entries = await readEntries(storage);
  // Defensive sort — store is supposed to be newest-first but trust the timestamp.
  return entries.slice().sort((a, b) => b.at.localeCompare(a.at));
}

export async function entriesForDay(storage, dateIso) {
  const all = await listEntries(storage);
  return all.filter((e) => e.dateIso === dateIso);
}

export async function removeEntry(storage, id) {
  const existing = await readEntries(storage);
  const before = existing.length;
  const kept = existing.filter((e) => e.id !== id);
  await writeEntries(storage, kept);
  return kept.length !== before;
}

export async function clearAll(storage) {
  await writeEntries(storage, []);
}

export { KEY_ENTRIES };
