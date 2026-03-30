/**
 * Neon Reader — Popup Script
 * Manages settings UI and communicates with background/content scripts.
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Elements
  const btnActivate = document.getElementById('btn-activate');
  const btnReset = document.getElementById('btn-reset');
  const rangeFontsize = document.getElementById('range-fontsize');
  const rangeLineheight = document.getElementById('range-lineheight');
  const rangeLetterspacing = document.getElementById('range-letterspacing');
  const valFontsize = document.getElementById('val-fontsize');
  const valLineheight = document.getElementById('val-lineheight');
  const valLetterspacing = document.getElementById('val-letterspacing');
  const chkReadingguide = document.getElementById('chk-readingguide');
  const chkHud = document.getElementById('chk-hud');
  const chkScanlines = document.getElementById('chk-scanlines');
  const chkTypewriter = document.getElementById('chk-typewriter');
  const themeRadios = document.querySelectorAll('input[name="theme"]');

  // Load current settings
  const settings = await getSettings();
  applySettingsToUI(settings);

  // --- Apply settings to UI controls ---
  function applySettingsToUI(s) {
    rangeFontsize.value = s.fontSize;
    valFontsize.textContent = `${s.fontSize}px`;

    rangeLineheight.value = s.lineHeight;
    valLineheight.textContent = s.lineHeight.toFixed(1);

    rangeLetterspacing.value = s.letterSpacing;
    valLetterspacing.textContent = `${s.letterSpacing}em`;

    chkReadingguide.checked = s.readingGuide;
    chkHud.checked = s.showHud;
    chkScanlines.checked = s.scanlines;
    chkTypewriter.checked = s.typewriter;

    themeRadios.forEach((radio) => {
      radio.checked = radio.value === s.theme;
    });
  }

  // --- Collect current UI values into settings object ---
  function collectSettings() {
    let selectedTheme = 'green';
    themeRadios.forEach((radio) => {
      if (radio.checked) selectedTheme = radio.value;
    });

    return {
      fontSize: parseInt(rangeFontsize.value, 10),
      lineHeight: parseFloat(rangeLineheight.value),
      letterSpacing: parseFloat(rangeLetterspacing.value),
      theme: selectedTheme,
      readingGuide: chkReadingguide.checked,
      showHud: chkHud.checked,
      scanlines: chkScanlines.checked,
      typewriter: chkTypewriter.checked,
    };
  }

  // --- Save and broadcast settings ---
  async function onSettingsChange() {
    const newSettings = collectSettings();
    await saveSettings(newSettings);
    // Broadcast to active tab
    chrome.runtime.sendMessage({
      action: 'updateSettings',
      settings: newSettings,
    });
  }

  // --- Event listeners for sliders ---
  rangeFontsize.addEventListener('input', () => {
    valFontsize.textContent = `${rangeFontsize.value}px`;
    onSettingsChange();
  });

  rangeLineheight.addEventListener('input', () => {
    valLineheight.textContent = parseFloat(rangeLineheight.value).toFixed(1);
    onSettingsChange();
  });

  rangeLetterspacing.addEventListener('input', () => {
    valLetterspacing.textContent = `${rangeLetterspacing.value}em`;
    onSettingsChange();
  });

  // --- Event listeners for theme radios ---
  themeRadios.forEach((radio) => {
    radio.addEventListener('change', onSettingsChange);
  });

  // --- Event listeners for checkboxes ---
  chkReadingguide.addEventListener('change', onSettingsChange);
  chkHud.addEventListener('change', onSettingsChange);
  chkScanlines.addEventListener('change', onSettingsChange);
  chkTypewriter.addEventListener('change', onSettingsChange);

  // --- Activate button ---
  btnActivate.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'activateReader' }, () => {
      window.close();
    });
  });

  // --- Reset button ---
  btnReset.addEventListener('click', async () => {
    const defaults = await resetSettings();
    applySettingsToUI(defaults);
    onSettingsChange();
  });
});
