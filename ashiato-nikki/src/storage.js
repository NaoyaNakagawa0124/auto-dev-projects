// Storage adapter — same surface for chrome.storage.local and a memory
// implementation used by tests.

export function memoryStorage(initial = {}) {
  const store = new Map(Object.entries(initial));
  return {
    async get(key) {
      return store.has(key) ? structuredClone(store.get(key)) : undefined;
    },
    async set(key, value) {
      store.set(key, structuredClone(value));
    },
    async remove(key) {
      store.delete(key);
    },
    async getAll() {
      return Object.fromEntries(Array.from(store.entries(), ([k, v]) => [k, structuredClone(v)]));
    },
  };
}

export function chromeStorage() {
  // Runtime adapter — referenced from popup/options but never imported by tests.
  if (typeof chrome === "undefined" || !chrome.storage || !chrome.storage.local) {
    throw new Error("chrome.storage.local is not available");
  }
  const local = chrome.storage.local;
  return {
    get(key)        { return new Promise((res) => local.get(key, (items) => res(items[key]))); },
    set(key, value) { return new Promise((res) => local.set({ [key]: value }, () => res())); },
    remove(key)     { return new Promise((res) => local.remove(key, () => res())); },
    getAll()        { return new Promise((res) => local.get(null, (items) => res(items || {}))); },
  };
}
