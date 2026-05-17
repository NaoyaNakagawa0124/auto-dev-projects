// Entry shape + validation. The whole app revolves around this.

import { todayIso } from "./dates.js";

function shortId() {
  // Crypto-grade IDs aren't necessary; we just need uniqueness inside a single
  // user's local storage. A timestamp + 6 random base36 chars is plenty.
  const t = Date.now().toString(36);
  const r = Math.floor(Math.random() * 36 ** 6).toString(36).padStart(6, "0");
  return `${t}-${r}`;
}

export const MAX_NOTE_LEN = 200;
export const MAX_TITLE_LEN = 300;
export const MAX_URL_LEN = 2048;

export function makeEntry({ url, title = "", note = "", at, id } = {}) {
  if (typeof url !== "string" || url.length === 0) {
    throw new Error("url is required");
  }
  if (url.length > MAX_URL_LEN) throw new Error("url too long");
  if (typeof title !== "string") throw new Error("title must be a string");
  if (title.length > MAX_TITLE_LEN) title = title.slice(0, MAX_TITLE_LEN);
  if (typeof note !== "string") throw new Error("note must be a string");
  if (note.length > MAX_NOTE_LEN) note = note.slice(0, MAX_NOTE_LEN);

  const atTime = at instanceof Date ? at : new Date(at || Date.now());
  return {
    id: id || shortId(),
    url,
    title,
    note,
    dateIso: todayIso(atTime),
    at: atTime.toISOString(),
  };
}

export function isValidEntry(e) {
  return !!(
    e && typeof e === "object" &&
    typeof e.id === "string" && e.id.length > 0 &&
    typeof e.url === "string" && e.url.length > 0 &&
    typeof e.title === "string" &&
    typeof e.note === "string" &&
    typeof e.dateIso === "string" && /^\d{4}-\d{2}-\d{2}$/.test(e.dateIso) &&
    typeof e.at === "string" && !Number.isNaN(Date.parse(e.at))
  );
}
