import { indexAliases } from "./ingredients.js";

const ALIAS_INDEX = indexAliases();

// known recipe sites
export const KNOWN_SITES = {
  "cookpad.com": "cookpad",
  "kurashiru.com": "kurashiru",
  "delishkitchen.tv": "delishkitchen",
  "cooking.nytimes.com": "nyt-cooking",
  "allrecipes.com": "allrecipes",
  "rakuten.co.jp": "rakuten-recipe",
  "orangepage.net": "orangepage",
};

export function detectSite(hostname) {
  for (const [domain, slug] of Object.entries(KNOWN_SITES)) {
    if (hostname === domain || hostname.endsWith("." + domain)) {
      return slug;
    }
  }
  return null;
}

/**
 * Extract matching ingredient entries from a free-form text blob.
 * Returns [{ entry, hits }] with entry === ingredient definition.
 * Each ingredient appears at most once even if mentioned multiple times.
 */
export function detectIngredientsFromText(text) {
  if (!text) return [];
  const lower = text.toLowerCase();
  const found = new Map(); // name -> entry
  for (const { alias, entry } of ALIAS_INDEX) {
    if (!alias) continue;
    const a = alias.toLowerCase();
    if (lower.includes(a)) {
      // Avoid double-counting when the same ingredient was already found via a
      // longer alias (since we sorted longest-first, the first match wins).
      if (!found.has(entry.name)) {
        found.set(entry.name, entry);
      }
    }
  }
  return Array.from(found.values());
}

/**
 * Same as detectIngredientsFromText but returns the entries in a deterministic
 * order (by score descending, then name) for stable display.
 */
export function detectAndSort(text) {
  const list = detectIngredientsFromText(text);
  return list.slice().sort((a, b) => {
    if (a.category !== b.category) {
      const order = { love: 0, danger: 1, meh: 2 };
      return order[a.category] - order[b.category];
    }
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name);
  });
}
