/**
 * Neon Reader — Test Suite
 * Tests WITHOUT Chrome APIs (mocks chrome.storage).
 * At least 40 comprehensive tests.
 */

// --- Simple test runner ---
let passed = 0;
let failed = 0;
let total = 0;
const failures = [];

function test(name, fn) {
  total++;
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    failures.push({ name, error: err.message });
    console.log(`  ✗ ${name}`);
    console.log(`    → ${err.message}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'アサーション失敗');
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `期待値: ${JSON.stringify(expected)}, 実際: ${JSON.stringify(actual)}`);
  }
}

function assertDeepEqual(actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(message || `期待値: ${JSON.stringify(expected)}, 実際: ${JSON.stringify(actual)}`);
  }
}

function assertIncludes(str, substr, message) {
  if (!str.includes(substr)) {
    throw new Error(message || `"${str}" に "${substr}" が含まれていません`);
  }
}

function assertGreaterThan(a, b, message) {
  if (!(a > b)) throw new Error(message || `${a} > ${b} ではありません`);
}

// --- Mock DOM ---
function createMockDocument(html) {
  // Simple mock using regex-based parsing for testing
  // This is a lightweight mock - not a full DOM implementation
  const doc = {
    title: '',
    _html: html,
    _elements: [],
    body: null,
    documentElement: null,
  };

  // Parse basic elements
  doc.querySelector = function (selector) {
    return findElement(this._elements, selector);
  };

  doc.querySelectorAll = function (selector) {
    return findAllElements(this._elements, selector);
  };

  return doc;
}

// Simple element mock
function createElement(tagName, textContent, attrs = {}) {
  const el = {
    tagName: tagName.toUpperCase(),
    textContent: textContent || '',
    children: [],
    style: {},
    attributes: attrs,
    offsetParent: true,
    naturalWidth: 200,
    width: 200,
    src: attrs.src || '',
    alt: attrs.alt || '',
    querySelector(selector) {
      return findElement(this.children, selector);
    },
    querySelectorAll(selector) {
      return findAllElements(this.children, selector);
    },
  };
  return el;
}

function findElement(elements, selector) {
  for (const el of elements) {
    if (matchesSelector(el, selector)) return el;
    const child = findElement(el.children || [], selector);
    if (child) return child;
  }
  return null;
}

function findAllElements(elements, selector) {
  const results = [];
  for (const el of elements) {
    if (matchesSelector(el, selector)) results.push(el);
    results.push(...findAllElements(el.children || [], selector));
  }
  return results;
}

function matchesSelector(el, selector) {
  if (!el || !el.tagName) return false;
  const tag = el.tagName.toLowerCase();

  // Tag name
  if (selector === tag) return true;

  // Multiple selectors (comma-separated)
  if (selector.includes(',')) {
    return selector.split(',').some((s) => matchesSelector(el, s.trim()));
  }

  // Class selector
  if (selector.startsWith('.') && el.attributes && el.attributes.class) {
    return el.attributes.class.includes(selector.slice(1));
  }

  // ID selector
  if (selector.startsWith('#') && el.attributes && el.attributes.id) {
    return el.attributes.id === selector.slice(1);
  }

  // Attribute selector [role="main"]
  if (selector.startsWith('[')) {
    const match = selector.match(/\[(\w+)="?(\w+)"?\]/);
    if (match && el.attributes) {
      return el.attributes[match[1]] === match[2];
    }
  }

  return false;
}

// --- Mock chrome.storage ---
let mockStorage = {};
global.chrome = {
  storage: {
    local: {
      get(key, callback) {
        callback({ [key]: mockStorage[key] });
      },
      set(data, callback) {
        Object.assign(mockStorage, data);
        if (callback) callback();
      },
      remove(key, callback) {
        delete mockStorage[key];
        if (callback) callback();
      },
    },
  },
};

// --- Load modules ---
const {
  DEFAULT_SETTINGS,
  THEMES,
  getSettings,
  saveSettings,
  resetSettings,
  getTheme,
} = require('../shared/settings.js');

const {
  extractArticle,
  extractTitle,
  findContentElement,
  hasSubstantialContent,
  extractContent,
  extractImages,
  calculateReadingTime,
  formatHudData,
} = require('../shared/textExtractor.js');


// ============================================================
// TEST GROUPS
// ============================================================

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  ネオンリーダー テストスイート');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// --- Settings Tests ---
console.log('【設定管理テスト】');

test('DEFAULT_SETTINGS has correct fontSize', () => {
  assertEqual(DEFAULT_SETTINGS.fontSize, 24);
});

test('DEFAULT_SETTINGS has correct lineHeight', () => {
  assertEqual(DEFAULT_SETTINGS.lineHeight, 2.0);
});

test('DEFAULT_SETTINGS has correct letterSpacing', () => {
  assertEqual(DEFAULT_SETTINGS.letterSpacing, 0.05);
});

test('DEFAULT_SETTINGS has green theme by default', () => {
  assertEqual(DEFAULT_SETTINGS.theme, 'green');
});

test('DEFAULT_SETTINGS has readingGuide enabled', () => {
  assertEqual(DEFAULT_SETTINGS.readingGuide, true);
});

test('DEFAULT_SETTINGS has showHud enabled', () => {
  assertEqual(DEFAULT_SETTINGS.showHud, true);
});

test('DEFAULT_SETTINGS has scanlines enabled', () => {
  assertEqual(DEFAULT_SETTINGS.scanlines, true);
});

test('DEFAULT_SETTINGS has typewriter enabled', () => {
  assertEqual(DEFAULT_SETTINGS.typewriter, true);
});

test('DEFAULT_SETTINGS has all 8 properties', () => {
  assertEqual(Object.keys(DEFAULT_SETTINGS).length, 8);
});

test('getSettings returns defaults when storage is empty', async () => {
  mockStorage = {};
  const s = await getSettings();
  assertDeepEqual(s, DEFAULT_SETTINGS);
});

test('saveSettings persists data to storage', async () => {
  mockStorage = {};
  const custom = { ...DEFAULT_SETTINGS, fontSize: 30, theme: 'cyan' };
  await saveSettings(custom);
  assert(mockStorage.neonReaderSettings !== undefined, '設定が保存されていません');
  assertEqual(mockStorage.neonReaderSettings.fontSize, 30);
});

test('getSettings returns merged settings', async () => {
  mockStorage = { neonReaderSettings: { fontSize: 28 } };
  const s = await getSettings();
  assertEqual(s.fontSize, 28);
  assertEqual(s.lineHeight, 2.0); // Default preserved
});

test('resetSettings clears storage and returns defaults', async () => {
  mockStorage = { neonReaderSettings: { fontSize: 40 } };
  const s = await resetSettings();
  assertEqual(s.fontSize, 24);
  assert(mockStorage.neonReaderSettings === undefined, 'ストレージがクリアされていません');
});


// --- Theme Tests ---
console.log('\n【テーマテスト】');

test('THEMES contains green, cyan, amber, white', () => {
  assert(THEMES.green !== undefined, 'greenテーマがありません');
  assert(THEMES.cyan !== undefined, 'cyanテーマがありません');
  assert(THEMES.amber !== undefined, 'amberテーマがありません');
  assert(THEMES.white !== undefined, 'whiteテーマがありません');
});

test('All themes have required properties', () => {
  const required = ['name', 'text', 'heading', 'accent', 'dim', 'glow'];
  for (const [key, theme] of Object.entries(THEMES)) {
    for (const prop of required) {
      assert(theme[prop] !== undefined, `${key}テーマに${prop}がありません`);
    }
  }
});

test('Green theme has correct text color', () => {
  assertEqual(THEMES.green.text, '#00ff41');
});

test('Cyan theme has correct text color', () => {
  assertEqual(THEMES.cyan.text, '#00f0ff');
});

test('Amber theme has correct text color', () => {
  assertEqual(THEMES.amber.text, '#ffb000');
});

test('White theme has correct text color', () => {
  assertEqual(THEMES.white.text, '#e0e0e0');
});

test('getTheme returns correct theme by name', () => {
  const t = getTheme('cyan');
  assertEqual(t.name, 'サイバーシアン');
});

test('getTheme falls back to green for unknown name', () => {
  const t = getTheme('nonexistent');
  assertEqual(t.name, 'ネオングリーン');
});

test('All theme names are in Japanese', () => {
  for (const theme of Object.values(THEMES)) {
    assert(/[\u3000-\u9fff\u30a0-\u30ff]/.test(theme.name), `テーマ名が日本語ではありません: ${theme.name}`);
  }
});

test('All theme text colors are valid hex', () => {
  for (const theme of Object.values(THEMES)) {
    assert(/^#[0-9a-fA-F]{6}$/.test(theme.text), `無効な色: ${theme.text}`);
  }
});

test('All theme glow values are non-empty strings', () => {
  for (const theme of Object.values(THEMES)) {
    assert(typeof theme.glow === 'string' && theme.glow.length > 0, 'グロー値が空です');
  }
});


// --- Text Extraction Tests ---
console.log('\n【テキスト抽出テスト】');

test('extractTitle finds h1 text', () => {
  const doc = {
    title: 'Page Title',
    querySelector: (sel) => {
      if (sel === 'h1') return { textContent: '記事タイトル' };
      return null;
    },
  };
  assertEqual(extractTitle(doc), '記事タイトル');
});

test('extractTitle falls back to document.title', () => {
  const doc = {
    title: 'ページタイトル',
    querySelector: () => null,
  };
  assertEqual(extractTitle(doc), 'ページタイトル');
});

test('extractTitle returns default when no title found', () => {
  const doc = {
    title: '',
    querySelector: () => null,
  };
  assertEqual(extractTitle(doc), 'タイトルなし');
});

test('hasSubstantialContent returns true for long text', () => {
  const el = { textContent: 'あ'.repeat(200) };
  assert(hasSubstantialContent(el), '十分なコンテンツがあると判定されませんでした');
});

test('hasSubstantialContent returns false for short text', () => {
  const el = { textContent: 'Short' };
  assert(!hasSubstantialContent(el), '短いコンテンツが十分と判定されました');
});

test('extractContent handles empty container', () => {
  const container = {
    querySelectorAll: () => [],
    textContent: '',
  };
  const content = extractContent(container);
  assertEqual(content.length, 1);
  assertIncludes(content[0].text, 'コンテンツを取得できませんでした');
});

test('extractContent extracts paragraphs', () => {
  const p1 = createElement('p', 'テスト段落1');
  const p2 = createElement('p', 'テスト段落2');
  const container = {
    querySelectorAll: (sel) => {
      if (sel.includes('p')) return [p1, p2];
      return [];
    },
    textContent: 'テスト段落1 テスト段落2',
  };
  const content = extractContent(container);
  assertEqual(content.length, 2);
  assertEqual(content[0].type, 'p');
  assertEqual(content[0].text, 'テスト段落1');
});

test('extractContent identifies heading types correctly', () => {
  const h2 = createElement('h2', '見出し2');
  const h3 = createElement('h3', '見出し3');
  const container = {
    querySelectorAll: () => [h2, h3],
    textContent: '見出し2 見出し3',
  };
  const content = extractContent(container);
  assertEqual(content[0].type, 'h2');
  assertEqual(content[1].type, 'h3');
});

test('extractContent identifies list items', () => {
  const li = createElement('li', 'リスト項目');
  const container = {
    querySelectorAll: () => [li],
    textContent: 'リスト項目',
  };
  const content = extractContent(container);
  assertEqual(content[0].type, 'li');
});

test('extractContent identifies blockquotes', () => {
  const bq = createElement('blockquote', '引用テキスト');
  const container = {
    querySelectorAll: () => [bq],
    textContent: '引用テキスト',
  };
  const content = extractContent(container);
  assertEqual(content[0].type, 'blockquote');
});

test('extractContent identifies code blocks', () => {
  const pre = createElement('pre', 'コードブロック');
  const container = {
    querySelectorAll: () => [pre],
    textContent: 'コードブロック',
  };
  const content = extractContent(container);
  assertEqual(content[0].type, 'code');
});

test('extractContent skips empty text elements', () => {
  const p1 = createElement('p', '有効なテキスト');
  const p2 = createElement('p', '');
  const p3 = createElement('p', '  ');
  const container = {
    querySelectorAll: () => [p1, p2, p3],
    textContent: '有効なテキスト',
  };
  const content = extractContent(container);
  assertEqual(content.length, 1);
});

test('extractContent handles null container', () => {
  const content = extractContent(null);
  assertEqual(content.length, 1);
  assertIncludes(content[0].text, 'コンテンツを取得できませんでした');
});

test('extractImages filters out small images', () => {
  const img1 = createElement('img', '', { src: 'http://example.com/large.jpg', alt: '大きな画像' });
  img1.naturalWidth = 400;
  img1.width = 400;
  const img2 = createElement('img', '', { src: 'http://example.com/tiny.gif', alt: '' });
  img2.naturalWidth = 20;
  img2.width = 20;

  const container = {
    querySelectorAll: (sel) => {
      if (sel === 'img') return [img1, img2];
      return [];
    },
  };
  const images = extractImages(container);
  assertEqual(images.length, 1);
  assertEqual(images[0].src, 'http://example.com/large.jpg');
});

test('extractImages handles null container', () => {
  const images = extractImages(null);
  assertEqual(images.length, 0);
});

test('findContentElement prefers article tag', () => {
  const article = createElement('article', 'あ'.repeat(200));
  article.children = [];
  const doc = {
    querySelector: (sel) => {
      if (sel === 'article') return article;
      return null;
    },
    querySelectorAll: () => [],
    body: createElement('body', 'body content'),
  };
  const found = findContentElement(doc);
  assertEqual(found, article);
});


// --- Reading Time Tests ---
console.log('\n【読了時間計算テスト】');

test('calculateReadingTime for 400 chars = 1 minute', () => {
  const text = 'あ'.repeat(400);
  const { charCount, minutes } = calculateReadingTime(text);
  assertEqual(charCount, 400);
  assertEqual(minutes, 1);
});

test('calculateReadingTime for 800 chars = 2 minutes', () => {
  const text = 'あ'.repeat(800);
  const { minutes } = calculateReadingTime(text);
  assertEqual(minutes, 2);
});

test('calculateReadingTime for empty text = 1 minute minimum', () => {
  const { minutes } = calculateReadingTime('');
  assertEqual(minutes, 1);
});

test('calculateReadingTime for 1 char = 1 minute minimum', () => {
  const { minutes } = calculateReadingTime('あ');
  assertEqual(minutes, 1);
});

test('calculateReadingTime ignores whitespace in char count', () => {
  const text = 'あ い う え お';
  const { charCount } = calculateReadingTime(text);
  assertEqual(charCount, 5);
});

test('calculateReadingTime for long text', () => {
  const text = 'あ'.repeat(4000);
  const { minutes } = calculateReadingTime(text);
  assertEqual(minutes, 10);
});


// --- HUD Formatting Tests ---
console.log('\n【HUDフォーマットテスト】');

test('formatHudData returns correct character count', () => {
  const data = formatHudData(1500, 4, 50);
  assertEqual(data.charCount, '1,500');
});

test('formatHudData returns correct reading time', () => {
  const data = formatHudData(1000, 3, 50);
  assertEqual(data.readingTime, '~3分');
});

test('formatHudData returns correct progress', () => {
  const data = formatHudData(1000, 3, 75.6);
  assertEqual(data.progress, '76%');
});

test('formatHudData with zero progress', () => {
  const data = formatHudData(500, 2, 0);
  assertEqual(data.progress, '0%');
});

test('formatHudData with 100% progress', () => {
  const data = formatHudData(500, 2, 100);
  assertEqual(data.progress, '100%');
});

test('formatHudData reading time is in Japanese', () => {
  const data = formatHudData(500, 2, 50);
  assertIncludes(data.readingTime, '分');
});


// --- Japanese Text Verification ---
console.log('\n【日本語テキスト検証テスト】');

test('Default fallback title is in Japanese', () => {
  const doc = {
    title: '',
    querySelector: () => null,
  };
  const title = extractTitle(doc);
  assert(/[\u3000-\u9fff]/.test(title), 'フォールバックタイトルが日本語ではありません');
});

test('Error message for empty content is in Japanese', () => {
  const content = extractContent(null);
  assert(/[\u3000-\u9fff]/.test(content[0].text), 'エラーメッセージが日本語ではありません');
});

test('All theme names contain Japanese characters', () => {
  for (const [key, theme] of Object.entries(THEMES)) {
    assert(
      /[\u30a0-\u30ff\u3040-\u309f\u4e00-\u9fff]/.test(theme.name),
      `${key}のテーマ名が日本語ではありません`
    );
  }
});


// --- Edge Cases ---
console.log('\n【エッジケーステスト】');

test('Very long text extraction', () => {
  const longText = 'あ'.repeat(100000);
  const container = {
    querySelectorAll: () => [createElement('p', longText)],
    textContent: longText,
  };
  const content = extractContent(container);
  assertEqual(content[0].text.length, 100000);
});

test('extractArticle with minimal document', () => {
  const body = createElement('body', 'ミニマルページ');
  body.children = [createElement('p', 'ミニマルページ')];
  const doc = {
    title: 'テスト',
    querySelector: (sel) => {
      if (sel === 'h1') return null;
      if (sel === 'article') return null;
      return null;
    },
    querySelectorAll: () => [],
    body: body,
    documentElement: body,
  };
  const article = extractArticle(doc);
  assert(article.title === 'テスト', 'タイトルが取得できませんでした');
  assert(article.content.length >= 1, 'コンテンツが取得できませんでした');
  assertGreaterThan(article.charCount, 0, '文字数が0です');
});

test('Settings round-trip preserves all values', async () => {
  const custom = {
    fontSize: 32,
    lineHeight: 2.5,
    letterSpacing: 0.08,
    theme: 'amber',
    readingGuide: false,
    showHud: false,
    scanlines: false,
    typewriter: false,
  };
  await saveSettings(custom);
  const loaded = await getSettings();
  assertDeepEqual(loaded, custom);
});


// ============================================================
// RESULTS
// ============================================================

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`  結果: ${passed}/${total} テスト成功`);
if (failed > 0) {
  console.log(`  失敗: ${failed} テスト`);
  console.log('');
  for (const f of failures) {
    console.log(`  ✗ ${f.name}: ${f.error}`);
  }
}
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

process.exit(failed > 0 ? 1 : 0);
