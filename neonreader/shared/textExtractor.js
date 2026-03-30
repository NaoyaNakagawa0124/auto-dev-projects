/**
 * Text extraction logic for Neon Reader.
 * Extracts article content from web pages using multiple strategies.
 */

/**
 * Calculate reading time for Japanese text.
 * Average reading speed: ~400 characters per minute for Japanese.
 */
function calculateReadingTime(text) {
  const charCount = text.replace(/\s/g, '').length;
  const minutes = Math.ceil(charCount / 400);
  return { charCount, minutes: Math.max(1, minutes) };
}

/**
 * Format HUD data for display.
 */
function formatHudData(charCount, minutes, progressPercent) {
  return {
    charCount: `${charCount.toLocaleString()}`,
    readingTime: `~${minutes}分`,
    progress: `${Math.round(progressPercent)}%`,
  };
}

/**
 * Extract article content from the document.
 * Tries multiple strategies in priority order.
 */
function extractArticle(doc) {
  const title = extractTitle(doc);
  const contentElement = findContentElement(doc);
  const content = extractContent(contentElement);
  const images = extractImages(contentElement);
  const fullText = content.map((c) => c.text).join('');
  const { charCount, minutes } = calculateReadingTime(fullText);

  return {
    title,
    content,
    images,
    charCount,
    readingTimeMinutes: minutes,
  };
}

/**
 * Extract the page title.
 */
function extractTitle(doc) {
  // Try h1 first
  const h1 = doc.querySelector('h1');
  if (h1 && h1.textContent.trim().length > 0) {
    return h1.textContent.trim();
  }
  // Fallback to document title
  return doc.title || 'タイトルなし';
}

/**
 * Find the main content element using multiple strategies.
 */
function findContentElement(doc) {
  // Strategy 1: <article> tag
  const article = doc.querySelector('article');
  if (article && hasSubstantialContent(article)) {
    return article;
  }

  // Strategy 2: Common content selectors
  const selectors = [
    '[role="main"]',
    'main',
    '.article-content',
    '.post-content',
    '.entry-content',
    '.article-body',
    '.post-body',
    '#content',
    '#article',
    '.content',
  ];

  for (const selector of selectors) {
    const el = doc.querySelector(selector);
    if (el && hasSubstantialContent(el)) {
      return el;
    }
  }

  // Strategy 3: Find element with most <p> children
  const allElements = doc.querySelectorAll('div, section');
  let bestElement = null;
  let maxParagraphs = 0;

  for (const el of allElements) {
    const pCount = el.querySelectorAll('p').length;
    if (pCount > maxParagraphs) {
      maxParagraphs = pCount;
      bestElement = el;
    }
  }

  if (bestElement && maxParagraphs >= 2) {
    return bestElement;
  }

  // Strategy 4: Fallback to body
  return doc.body || doc.documentElement;
}

/**
 * Check if an element has substantial text content.
 */
function hasSubstantialContent(el) {
  const text = el.textContent || '';
  return text.trim().length > 100;
}

/**
 * Extract structured content elements from a container.
 */
function extractContent(container) {
  if (!container) return [{ type: 'p', text: 'コンテンツを取得できませんでした。' }];

  const elements = container.querySelectorAll('p, h2, h3, h4, h5, h6, li, blockquote, pre, code');
  const content = [];

  for (const el of elements) {
    const text = el.textContent.trim();
    if (text.length === 0) continue;

    // Skip hidden elements
    if (el.offsetParent === null && el.style && el.style.display === 'none') continue;

    const tagName = el.tagName.toLowerCase();
    let type = 'p';

    if (tagName.startsWith('h')) {
      type = tagName; // h2, h3, h4, etc.
    } else if (tagName === 'li') {
      type = 'li';
    } else if (tagName === 'blockquote') {
      type = 'blockquote';
    } else if (tagName === 'pre' || tagName === 'code') {
      type = 'code';
    }

    content.push({ type, text });
  }

  if (content.length === 0) {
    // Fallback: just get all text
    const text = container.textContent.trim();
    if (text.length > 0) {
      content.push({ type: 'p', text });
    } else {
      content.push({ type: 'p', text: 'コンテンツを取得できませんでした。' });
    }
  }

  return content;
}

/**
 * Extract important images from the content.
 */
function extractImages(container) {
  if (!container) return [];

  const imgs = container.querySelectorAll('img');
  const images = [];

  for (const img of imgs) {
    const src = img.src || img.getAttribute('data-src') || '';
    const alt = img.alt || '';
    const width = img.naturalWidth || img.width || 0;

    // Only include reasonably sized images (skip tiny icons/trackers)
    if (src && width >= 100) {
      images.push({ src, alt });
    }
  }

  return images;
}

// Export for both module and non-module contexts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    extractArticle,
    extractTitle,
    findContentElement,
    hasSubstantialContent,
    extractContent,
    extractImages,
    calculateReadingTime,
    formatHudData,
  };
}
