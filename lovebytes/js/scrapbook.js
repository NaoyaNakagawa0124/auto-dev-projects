/**
 * LoveBytes — Scrapbook (Journal entries with 90s styling).
 */
(function (exports) {
  'use strict';

  const RETRO_BG_COLORS = [
    '#000080', '#800080', '#008080', '#800000',
    '#000000', '#003366', '#330033', '#003300',
  ];

  const RETRO_TEXT_COLORS = [
    '#00ff00', '#ff00ff', '#00ffff', '#ffff00',
    '#ff6600', '#66ff66', '#ff66ff', '#6666ff',
  ];

  const RETRO_FONTS = [
    'Comic Sans MS, cursive',
    'Courier New, monospace',
    'Impact, sans-serif',
    'Times New Roman, serif',
    'Trebuchet MS, sans-serif',
  ];

  const RETRO_DECORATIONS = [
    '~ * ~ * ~ * ~',
    '.:*~*:._.:*~*:.',
    '**********',
    '<<< >>> <<< >>>',
    '-=[ ]=- -=[ ]=-',
    '~*~*~*~*~*~',
    '###########',
    '>>> L O V E <<<',
  ];

  function createEntry(partner1Response, partner2Response, prompt, dateStr) {
    const date = dateStr || new Date().toISOString().split('T')[0];
    const seed = hashCode(date);

    return {
      id: date,
      date: date,
      prompt: prompt,
      responses: {
        partner1: partner1Response,
        partner2: partner2Response,
      },
      style: {
        bgColor: RETRO_BG_COLORS[Math.abs(seed) % RETRO_BG_COLORS.length],
        textColor: RETRO_TEXT_COLORS[Math.abs(seed + 1) % RETRO_TEXT_COLORS.length],
        font: RETRO_FONTS[Math.abs(seed + 2) % RETRO_FONTS.length],
        decoration: RETRO_DECORATIONS[Math.abs(seed + 3) % RETRO_DECORATIONS.length],
      },
      createdAt: new Date().toISOString(),
    };
  }

  function loadEntries() {
    try {
      return JSON.parse(localStorage.getItem('lovebytes_entries') || '[]');
    } catch { return []; }
  }

  function saveEntries(entries) {
    localStorage.setItem('lovebytes_entries', JSON.stringify(entries));
  }

  function addEntry(entry) {
    const entries = loadEntries();
    // Replace if same date exists
    const idx = entries.findIndex(e => e.id === entry.id);
    if (idx >= 0) entries[idx] = entry;
    else entries.push(entry);
    saveEntries(entries);
    return entries;
  }

  function getEntryCount() {
    return loadEntries().length;
  }

  function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }

  exports.RETRO_BG_COLORS = RETRO_BG_COLORS;
  exports.RETRO_TEXT_COLORS = RETRO_TEXT_COLORS;
  exports.RETRO_FONTS = RETRO_FONTS;
  exports.RETRO_DECORATIONS = RETRO_DECORATIONS;
  exports.createEntry = createEntry;
  exports.loadEntries = loadEntries;
  exports.saveEntries = saveEntries;
  exports.addEntry = addEntry;
  exports.getEntryCount = getEntryCount;
  exports.hashCode = hashCode;

})(typeof window !== 'undefined' ? window : module.exports);
