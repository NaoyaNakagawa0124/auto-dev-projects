// shared/storage.js — Chrome storage abstraction with Promises

const STORAGE_KEYS = {
  IDEAS: "netamemo_ideas",
  SETTINGS: "netamemo_settings",
};

function getStorage() {
  return chrome.storage.local;
}

function storageGet(key) {
  return new Promise((resolve, reject) => {
    getStorage().get([key], (result) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(result[key]);
      }
    });
  });
}

function storageSet(data) {
  return new Promise((resolve, reject) => {
    getStorage().set(data, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve();
      }
    });
  });
}

// --- Ideas CRUD ---

export async function getIdeas() {
  const ideas = await storageGet(STORAGE_KEYS.IDEAS);
  return ideas || [];
}

export async function saveIdea(idea) {
  const ideas = await getIdeas();
  ideas.push(idea);
  await storageSet({ [STORAGE_KEYS.IDEAS]: ideas });
  return idea;
}

export async function updateIdea(id, updates) {
  const ideas = await getIdeas();
  const index = ideas.findIndex((i) => i.id === id);
  if (index === -1) throw new Error("アイデアが見つかりません");
  ideas[index] = { ...ideas[index], ...updates };
  await storageSet({ [STORAGE_KEYS.IDEAS]: ideas });
  return ideas[index];
}

export async function deleteIdea(id) {
  const ideas = await getIdeas();
  const filtered = ideas.filter((i) => i.id !== id);
  if (filtered.length === ideas.length) throw new Error("アイデアが見つかりません");
  await storageSet({ [STORAGE_KEYS.IDEAS]: filtered });
  return true;
}

export async function setIdeas(ideas) {
  await storageSet({ [STORAGE_KEYS.IDEAS]: ideas });
}

// --- Settings ---

export async function getSettings() {
  const settings = await storageGet(STORAGE_KEYS.SETTINGS);
  return settings || { username: "" };
}

export async function saveSettings(settings) {
  const current = await getSettings();
  const merged = { ...current, ...settings };
  await storageSet({ [STORAGE_KEYS.SETTINGS]: merged });
  return merged;
}

// --- Export for testing ---
export { STORAGE_KEYS };
