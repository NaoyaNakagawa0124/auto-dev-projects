/**
 * CivicSky Settings
 * Manages user preferences via Chrome Storage API (or localStorage fallback).
 */

(function (exports) {
  'use strict';

  const DEFAULT_SETTINGS = {
    state: null,
    categories: {
      tax: true,
      labor: true,
      healthcare: true,
      housing: true,
      tech: true,
      transport: true
    },
    onboarded: false
  };

  function getStorage() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      return {
        get: (key) => new Promise(resolve => {
          chrome.storage.local.get(key, result => resolve(result[key]));
        }),
        set: (key, value) => new Promise(resolve => {
          chrome.storage.local.set({ [key]: value }, resolve);
        })
      };
    }
    // Fallback to localStorage
    return {
      get: (key) => Promise.resolve(JSON.parse(localStorage.getItem(key))),
      set: (key, value) => Promise.resolve(localStorage.setItem(key, JSON.stringify(value)))
    };
  }

  async function loadSettings() {
    const storage = getStorage();
    const saved = await storage.get('civicsky_settings');
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...saved, categories: { ...DEFAULT_SETTINGS.categories, ...(saved.categories || {}) } };
    }
    return { ...DEFAULT_SETTINGS };
  }

  async function saveSettings(settings) {
    const storage = getStorage();
    await storage.set('civicsky_settings', settings);
  }

  function populateStateSelect(selectEl, currentState) {
    const stateNames = exports.STATE_NAMES || {};
    const states = exports.US_STATES || [];

    selectEl.innerHTML = '<option value="">All States (Federal)</option>';
    states.forEach(abbr => {
      const opt = document.createElement('option');
      opt.value = abbr;
      opt.textContent = stateNames[abbr] || abbr;
      if (abbr === currentState) opt.selected = true;
      selectEl.appendChild(opt);
    });
  }

  function populateCategoryToggles(container, categories) {
    const labels = exports.CATEGORY_LABELS || {};
    const icons = exports.CATEGORY_ICONS || {};
    container.innerHTML = '';

    Object.keys(categories).forEach(cat => {
      const row = document.createElement('div');
      row.className = 'toggle-row';
      const id = 'toggle-' + cat;
      row.innerHTML = `
        <input type="checkbox" id="${id}" ${categories[cat] ? 'checked' : ''} data-category="${cat}">
        <label for="${id}">${icons[cat] || ''} ${labels[cat] || cat}</label>
      `;
      container.appendChild(row);
    });
  }

  exports.DEFAULT_SETTINGS = DEFAULT_SETTINGS;
  exports.loadSettings = loadSettings;
  exports.saveSettings = saveSettings;
  exports.populateStateSelect = populateStateSelect;
  exports.populateCategoryToggles = populateCategoryToggles;

})(typeof window !== 'undefined' ? window : module.exports);
