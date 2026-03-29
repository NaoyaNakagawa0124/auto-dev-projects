const {
  RETRO_BG_COLORS, RETRO_TEXT_COLORS, RETRO_FONTS, RETRO_DECORATIONS,
  createEntry, hashCode
} = require('../js/scrapbook');

let passed = 0, failed = 0;
function assert(c, m) { if (c) passed++; else { failed++; console.error('  FAIL: ' + m); } }

console.log('Scrapbook Tests\n===============');

console.log('\n--- Style Data ---');
assert(RETRO_BG_COLORS.length >= 8, 'at least 8 bg colors');
assert(RETRO_TEXT_COLORS.length >= 8, 'at least 8 text colors');
assert(RETRO_FONTS.length >= 5, 'at least 5 fonts');
assert(RETRO_DECORATIONS.length >= 8, 'at least 8 decorations');

console.log('\n--- createEntry ---');
const e1 = createEntry('I love sunsets', 'Me too!', { headline: 'Test', question: 'Fav thing?' }, '2026-03-29');
assert(e1.id === '2026-03-29', 'id is date');
assert(e1.responses.partner1 === 'I love sunsets', 'partner1 response');
assert(e1.responses.partner2 === 'Me too!', 'partner2 response');
assert(e1.style.bgColor && e1.style.bgColor.startsWith('#'), 'has bg color');
assert(e1.style.textColor && e1.style.textColor.startsWith('#'), 'has text color');
assert(e1.style.font && e1.style.font.length > 0, 'has font');
assert(e1.style.decoration && e1.style.decoration.length > 0, 'has decoration');

// Different dates get different styles
const e2 = createEntry('', '', {}, '2026-06-15');
assert(e1.style.bgColor !== e2.style.bgColor || e1.style.textColor !== e2.style.textColor,
  'different dates get different styles');

// Same date gets same style (deterministic)
const e3 = createEntry('', '', {}, '2026-03-29');
assert(e1.style.bgColor === e3.style.bgColor, 'same date same bg');
assert(e1.style.font === e3.style.font, 'same date same font');

console.log('\n--- hashCode ---');
assert(typeof hashCode('test') === 'number', 'hashCode returns number');
assert(hashCode('a') !== hashCode('b'), 'different strings different hash');
assert(hashCode('test') === hashCode('test'), 'same string same hash');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
