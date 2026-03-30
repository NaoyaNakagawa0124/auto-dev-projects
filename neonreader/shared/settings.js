/**
 * Settings management for Neon Reader.
 * Uses chrome.storage.local for persistence.
 */

const DEFAULT_SETTINGS = {
  fontSize: 24,
  lineHeight: 2.0,
  letterSpacing: 0.05,
  theme: 'green',
  readingGuide: true,
  showHud: true,
  scanlines: true,
  typewriter: true,
};

const THEMES = {
  green: {
    name: 'ネオングリーン',
    text: '#00ff41',
    heading: '#39ff14',
    accent: '#00ff41',
    dim: '#00802080',
    glow: '0 0 10px #00ff4140, 0 0 20px #00ff4120',
  },
  cyan: {
    name: 'サイバーシアン',
    text: '#00f0ff',
    heading: '#00d4ff',
    accent: '#00f0ff',
    dim: '#007a8080',
    glow: '0 0 10px #00f0ff40, 0 0 20px #00f0ff20',
  },
  amber: {
    name: 'アンバー',
    text: '#ffb000',
    heading: '#ffc400',
    accent: '#ffb000',
    dim: '#80580080',
    glow: '0 0 10px #ffb00040, 0 0 20px #ffb00020',
  },
  white: {
    name: 'ホワイト',
    text: '#e0e0e0',
    heading: '#ffffff',
    accent: '#cccccc',
    dim: '#60606080',
    glow: '0 0 10px #ffffff20',
  },
};

async function getSettings() {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get('neonReaderSettings', (result) => {
        const saved = result.neonReaderSettings || {};
        resolve({ ...DEFAULT_SETTINGS, ...saved });
      });
    } else {
      resolve({ ...DEFAULT_SETTINGS });
    }
  });
}

async function saveSettings(settings) {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ neonReaderSettings: settings }, resolve);
    } else {
      resolve();
    }
  });
}

async function resetSettings() {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.remove('neonReaderSettings', () => {
        resolve({ ...DEFAULT_SETTINGS });
      });
    } else {
      resolve({ ...DEFAULT_SETTINGS });
    }
  });
}

function getTheme(themeName) {
  return THEMES[themeName] || THEMES.green;
}

// Export for both module and non-module contexts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DEFAULT_SETTINGS, THEMES, getSettings, saveSettings, resetSettings, getTheme };
}
