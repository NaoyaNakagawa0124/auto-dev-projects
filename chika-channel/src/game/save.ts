import type { GameState } from "./game.ts";

const SAVE_KEY = "chika-channel:save:v1";

/** Serialize a GameState to a JSON string. */
export function serialize(state: GameState): string {
  return JSON.stringify(state);
}

/** Deserialize. Returns null if the payload is malformed. */
export function deserialize(raw: string | null | undefined): GameState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    // Basic shape check
    if (!("network" in parsed) || !("day" in parsed) || !("subscribers" in parsed)) {
      return null;
    }
    return parsed as GameState;
  } catch {
    return null;
  }
}

/** Browser-side load. Returns null in non-browser env. */
export function loadFromLocalStorage(): GameState | null {
  if (typeof localStorage === "undefined") return null;
  return deserialize(localStorage.getItem(SAVE_KEY));
}

/** Browser-side save. No-op in non-browser env. */
export function saveToLocalStorage(state: GameState): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(SAVE_KEY, serialize(state));
}

export { SAVE_KEY };
