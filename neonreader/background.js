/**
 * Background service worker for Neon Reader.
 * Handles extension icon clicks and keyboard shortcuts.
 */

// Track which tabs have the reader mode active
const activeTabs = new Set();

/**
 * Inject content scripts and CSS into the active tab.
 */
async function toggleReaderMode(tab) {
  if (!tab || !tab.id) return;

  const tabId = tab.id;

  if (activeTabs.has(tabId)) {
    // Reader is active — send message to close it
    try {
      await chrome.tabs.sendMessage(tabId, { action: 'toggleReader' });
      activeTabs.delete(tabId);
    } catch {
      // Content script may not be loaded; remove from tracking
      activeTabs.delete(tabId);
    }
    return;
  }

  try {
    // Inject CSS first
    await chrome.scripting.insertCSS({
      target: { tabId },
      files: ['content/reader.css'],
    });

    // Inject shared modules
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['shared/settings.js', 'shared/textExtractor.js'],
    });

    // Inject HUD component
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content/hud.js'],
    });

    // Inject main reader script
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content/reader.js'],
    });

    activeTabs.add(tabId);
  } catch (err) {
    console.error('ネオンリーダー: スクリプト注入エラー', err);
  }
}

// Listen for keyboard shortcut
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-reader') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      await toggleReaderMode(tab);
    }
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'activateReader') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]) {
        await toggleReaderMode(tabs[0]);
        sendResponse({ ok: true });
      }
    });
    return true; // Keep channel open for async response
  }

  if (message.action === 'updateSettings') {
    // Forward settings update to active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && activeTabs.has(tabs[0].id)) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'updateSettings',
          settings: message.settings,
        });
      }
    });
    return false;
  }
});

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  activeTabs.delete(tabId);
});
