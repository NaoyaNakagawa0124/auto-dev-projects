// shared/sharing.js — Export/import sharing code logic

/**
 * Export ideas as a shareable Base64 code.
 * Strips votes so the recipient starts fresh.
 */
export function exportBoard(ideas, username) {
  const payload = {
    version: 1,
    exportedBy: username || "anonymous",
    exportedAt: new Date().toISOString(),
    ideas: ideas.map((i) => ({
      ...i,
      votes: { up: [], down: [] },
    })),
  };
  const json = JSON.stringify(payload);
  return btoa(encodeURIComponent(json));
}

/**
 * Import ideas from a shareable Base64 code.
 * Returns { success, ideas, exportedBy, count } or { success: false, error }.
 */
export function importBoard(code) {
  try {
    if (!code || typeof code !== "string" || code.trim() === "") {
      return { success: false, error: "共有コードが空です" };
    }
    const json = decodeURIComponent(atob(code.trim()));
    const payload = JSON.parse(json);
    if (payload.version !== 1) {
      return { success: false, error: "サポートされていないバージョンです" };
    }
    if (!Array.isArray(payload.ideas)) {
      return { success: false, error: "無効な共有コードです" };
    }
    return {
      success: true,
      ideas: payload.ideas,
      exportedBy: payload.exportedBy || "anonymous",
      count: payload.ideas.length,
    };
  } catch {
    return { success: false, error: "無効な共有コードです" };
  }
}

/**
 * Merge imported ideas into existing ideas.
 * Detects duplicates by URL (if non-empty).
 * Marks imported ideas with source: "import".
 */
export function mergeBoards(existing, imported, skipDuplicates = true) {
  const existingUrls = new Set(
    existing.filter((i) => i.url).map((i) => i.url)
  );
  let added = 0;
  let skipped = 0;
  const result = [...existing];

  for (const idea of imported) {
    const isDuplicate = idea.url && existingUrls.has(idea.url);
    if (isDuplicate && skipDuplicates) {
      skipped++;
      continue;
    }
    result.push({
      ...idea,
      source: "import",
      votes: { up: [], down: [] },
    });
    if (idea.url) existingUrls.add(idea.url);
    added++;
  }

  return { ideas: result, added, skipped };
}
