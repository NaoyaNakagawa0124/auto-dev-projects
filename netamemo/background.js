// background.js — Service worker for context menu and storage coordination

import { CATEGORIES, createIdea } from "./shared/data.js";

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save-to-netamemo",
    title: "ネタメモに保存",
    contexts: ["page", "selection", "link"],
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "save-to-netamemo") return;

  let pageInfo = {
    title: tab.title || "",
    url: info.pageUrl || tab.url || "",
    description: "",
    thumbnail: null,
    selectedText: info.selectionText || "",
  };

  // Try to extract more info from the content script
  try {
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: "EXTRACT_PAGE_INFO",
    });
    if (response) {
      pageInfo = { ...pageInfo, ...response };
    }
  } catch {
    // Content script may not be loaded; use what we have
  }

  // Build the idea
  const settings = await getSettings();
  const idea = createIdea({
    title: pageInfo.title,
    url: pageInfo.url,
    description: pageInfo.selectedText || pageInfo.description || "",
    thumbnail: pageInfo.thumbnail || null,
    category: "other",
    source: "clip",
    createdBy: settings.username || "",
  });

  // Save to storage
  const ideas = await getIdeasFromStorage();
  ideas.push(idea);
  await chrome.storage.local.set({ netamemo_ideas: ideas });

  // Notify popup if open, or show a badge
  try {
    chrome.action.setBadgeText({ text: "✓", tabId: tab.id });
    chrome.action.setBadgeBackgroundColor({ color: "#4ECDC4", tabId: tab.id });
    setTimeout(() => {
      chrome.action.setBadgeText({ text: "", tabId: tab.id });
    }, 2000);
  } catch {
    // Badge API may fail silently
  }
});

// Handle messages from popup/sidepanel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "OPEN_SIDE_PANEL") {
    chrome.sidePanel.open({ windowId: sender.tab?.windowId }).catch(() => {});
    sendResponse({ ok: true });
  }
  return false;
});

// Helper: get ideas from storage
async function getIdeasFromStorage() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["netamemo_ideas"], (result) => {
      resolve(result.netamemo_ideas || []);
    });
  });
}

// Helper: get settings from storage
async function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["netamemo_settings"], (result) => {
      resolve(result.netamemo_settings || { username: "" });
    });
  });
}
