/**
 * Neon Reader — Content Script
 * Creates the reader mode overlay with cyberpunk styling.
 * Depends on: shared/settings.js, shared/textExtractor.js, content/hud.js
 */

(function () {
  'use strict';

  // Avoid double-injection
  if (document.getElementById('neon-reader-overlay')) {
    // If already present, toggle it off
    closeReader();
    return;
  }

  // --- Globals within this IIFE ---
  let currentSettings = null;
  let currentTheme = null;
  let hudElement = null;
  let guideElement = null;
  let overlayElement = null;

  // --- Initialize ---
  async function init() {
    currentSettings = await getSettings();
    currentTheme = getTheme(currentSettings.theme);
    const article = extractArticle(document);
    buildOverlay(article);
  }

  // --- Build the overlay ---
  function buildOverlay(article) {
    overlayElement = document.createElement('div');
    overlayElement.id = 'neon-reader-overlay';
    applyCssVars(overlayElement, currentTheme);

    if (currentSettings.scanlines) {
      overlayElement.classList.add('scanlines');
    }

    // Top bar
    const topbar = document.createElement('div');
    topbar.id = 'neon-reader-topbar';
    topbar.innerHTML = `
      <span id="neon-reader-topbar-title">⚡ ネオンリーダー</span>
      <button id="neon-reader-close" title="閉じる" aria-label="リーダーモードを閉じる">×</button>
    `;
    overlayElement.appendChild(topbar);

    // Content container
    const contentDiv = document.createElement('div');
    contentDiv.id = 'neon-reader-content';
    applyContentStyles(contentDiv);

    // Title with optional typewriter effect
    const titleEl = document.createElement('h1');
    titleEl.id = 'neon-reader-title';
    contentDiv.appendChild(titleEl);

    // Article body
    for (const item of article.content) {
      const el = createContentElement(item);
      contentDiv.appendChild(el);
    }

    // Images
    for (const img of article.images) {
      const imgEl = document.createElement('img');
      imgEl.src = img.src;
      imgEl.alt = img.alt;
      imgEl.loading = 'lazy';
      contentDiv.appendChild(imgEl);
    }

    overlayElement.appendChild(contentDiv);

    // Progress bar
    const progressBar = document.createElement('div');
    progressBar.id = 'neon-reader-progress';
    overlayElement.appendChild(progressBar);

    // Reading guide
    if (currentSettings.readingGuide) {
      guideElement = document.createElement('div');
      guideElement.id = 'neon-reader-guide';
      guideElement.style.top = '50%';
      overlayElement.appendChild(guideElement);
    }

    // Add to page
    document.body.appendChild(overlayElement);
    document.body.style.overflow = 'hidden';

    // HUD
    if (currentSettings.showHud) {
      hudElement = createHud(overlayElement, article.charCount, article.readingTimeMinutes, currentTheme);
    }

    // Event listeners
    document.getElementById('neon-reader-close').addEventListener('click', closeReader);

    overlayElement.addEventListener('scroll', onScroll);

    if (currentSettings.readingGuide) {
      overlayElement.addEventListener('mousemove', onMouseMove);
    }

    // Typewriter effect for title
    if (currentSettings.typewriter) {
      typewriterEffect(titleEl, article.title);
    } else {
      titleEl.textContent = article.title;
    }

    // Listen for toggle/settings messages
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener(onMessage);
    }
  }

  // --- Apply CSS custom properties ---
  function applyCssVars(el, theme) {
    el.style.setProperty('--neon-text', theme.text);
    el.style.setProperty('--neon-heading', theme.heading);
    el.style.setProperty('--neon-accent', theme.accent);
    el.style.setProperty('--neon-dim', theme.dim);
    el.style.setProperty('--neon-glow', theme.glow);
  }

  // --- Apply user-configurable content styles ---
  function applyContentStyles(contentDiv) {
    contentDiv.style.fontSize = `${currentSettings.fontSize}px`;
    contentDiv.style.lineHeight = `${currentSettings.lineHeight}`;
    contentDiv.style.letterSpacing = `${currentSettings.letterSpacing}em`;
  }

  // --- Create a content element from extracted data ---
  function createContentElement(item) {
    let tag = 'p';
    let className = '';

    switch (item.type) {
      case 'h2': tag = 'h2'; break;
      case 'h3': tag = 'h3'; break;
      case 'h4': tag = 'h4'; break;
      case 'h5': tag = 'h5'; break;
      case 'h6': tag = 'h6'; break;
      case 'li': tag = 'li'; break;
      case 'blockquote': tag = 'blockquote'; break;
      case 'code': tag = 'pre'; className = 'neon-code'; break;
      default: tag = 'p';
    }

    const el = document.createElement(tag);
    el.textContent = item.text;
    if (className) el.className = className;
    return el;
  }

  // --- Typewriter effect ---
  function typewriterEffect(element, text) {
    let index = 0;
    element.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'neon-typewriter-cursor';
    element.appendChild(cursor);

    function type() {
      if (index < text.length) {
        element.insertBefore(document.createTextNode(text[index]), cursor);
        index++;
        setTimeout(type, 30);
      } else {
        // Remove cursor after typing completes
        setTimeout(() => {
          if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
        }, 1000);
      }
    }

    type();
  }

  // --- Scroll handler: progress bar + HUD ---
  function onScroll() {
    if (!overlayElement) return;
    const scrollTop = overlayElement.scrollTop;
    const scrollHeight = overlayElement.scrollHeight - overlayElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    const progressBar = document.getElementById('neon-reader-progress');
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (typeof updateHudProgress === 'function') {
      updateHudProgress(progress);
    }
  }

  // --- Mouse move handler: reading guide ---
  function onMouseMove(e) {
    if (guideElement) {
      const y = e.clientY;
      const guideHeight = parseFloat(getComputedStyle(guideElement).height);
      guideElement.style.top = `${y - guideHeight / 2}px`;
    }
  }

  // --- Message handler ---
  function onMessage(message) {
    if (message.action === 'toggleReader') {
      closeReader();
    } else if (message.action === 'updateSettings') {
      applySettingsUpdate(message.settings);
    }
  }

  // --- Apply settings update live ---
  function applySettingsUpdate(newSettings) {
    currentSettings = { ...currentSettings, ...newSettings };
    currentTheme = getTheme(currentSettings.theme);

    if (overlayElement) {
      applyCssVars(overlayElement, currentTheme);

      // Scanlines toggle
      if (currentSettings.scanlines) {
        overlayElement.classList.add('scanlines');
      } else {
        overlayElement.classList.remove('scanlines');
      }
    }

    const contentDiv = document.getElementById('neon-reader-content');
    if (contentDiv) {
      applyContentStyles(contentDiv);
    }

    // Reading guide
    if (currentSettings.readingGuide && !guideElement) {
      guideElement = document.createElement('div');
      guideElement.id = 'neon-reader-guide';
      guideElement.style.top = '50%';
      overlayElement.appendChild(guideElement);
      overlayElement.addEventListener('mousemove', onMouseMove);
    } else if (!currentSettings.readingGuide && guideElement) {
      guideElement.remove();
      guideElement = null;
    }

    // HUD
    if (currentSettings.showHud && !hudElement) {
      // Re-extract for char count
      const article = extractArticle(document);
      hudElement = createHud(overlayElement, article.charCount, article.readingTimeMinutes, currentTheme);
    } else if (!currentSettings.showHud && hudElement) {
      hudElement.remove();
      hudElement = null;
    } else if (hudElement) {
      applyHudTheme(hudElement, currentTheme);
    }
  }

  // --- Close reader mode ---
  function closeReader() {
    const overlay = document.getElementById('neon-reader-overlay');
    if (overlay) {
      overlay.style.animation = 'neon-fade-out 0.3s ease-out';
      setTimeout(() => {
        overlay.remove();
        document.body.style.overflow = '';
      }, 280);
    }
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.removeListener(onMessage);
    }
  }

  // Start
  init();
})();
