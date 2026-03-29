/**
 * CivicSky App
 * Main entry point — wires together weather engine, policy data, cards, forecast, and settings.
 */

(function () {
  'use strict';

  let engine;
  let settings;
  let filteredPolicies = [];

  async function init() {
    settings = await loadSettings();

    // Show onboarding if first time
    if (!settings.onboarded) {
      showOnboarding();
      return;
    }

    startApp();
  }

  function showOnboarding() {
    const panel = document.getElementById('onboarding');
    const stateSelect = document.getElementById('onboarding-state');
    const startBtn = document.getElementById('onboarding-start');

    panel.classList.remove('hidden');
    populateStateSelect(stateSelect, null);

    startBtn.addEventListener('click', async () => {
      settings.state = stateSelect.value || null;
      settings.onboarded = true;
      await saveSettings(settings);
      panel.classList.add('hidden');
      startApp();
    });
  }

  function startApp() {
    // Initialize weather engine
    const canvas = document.getElementById('weather-canvas');
    engine = new WeatherEngine(canvas);
    engine.start();

    // Set location badge
    updateLocationBadge();

    // Apply filters and render
    applyFilters();

    // Setup settings panel
    setupSettings();

    // Setup category filter chips
    setupCategoryChips();
  }

  function updateLocationBadge() {
    const badge = document.getElementById('location-badge');
    if (settings.state) {
      const name = STATE_NAMES[settings.state] || settings.state;
      badge.textContent = name;
    } else {
      badge.textContent = 'All States';
    }
  }

  function applyFilters() {
    // Get policies for user's state
    let policies = getPoliciesForState(settings.state);

    // Filter by enabled categories
    const enabledCats = Object.keys(settings.categories).filter(c => settings.categories[c]);
    policies = policies.filter(p => enabledCats.includes(p.category));

    filteredPolicies = policies;

    // Calculate intensity
    const intensity = calculateIntensity(policies, new Date().toISOString());
    engine.setIntensity(intensity);

    // Update intensity label
    const label = document.getElementById('intensity-label');
    const emoji = intensityToEmoji(intensity);
    label.textContent = `${emoji} ${intensityToLabel(intensity)} (${intensity}/100)`;

    // Render cards
    const cardsList = document.getElementById('cards-list');
    renderCards(cardsList, policies);

    // Render forecast
    const forecastBar = document.getElementById('forecast-bar');
    const forecast = calculateForecast(policies, new Date().toISOString(), 5);
    renderForecast(forecastBar, forecast);
  }

  function setupSettings() {
    const btn = document.getElementById('settings-btn');
    const panel = document.getElementById('settings-panel');
    const closeBtn = document.getElementById('settings-close');
    const stateSelect = document.getElementById('state-select');
    const togglesContainer = document.getElementById('category-toggles');

    populateStateSelect(stateSelect, settings.state);
    populateCategoryToggles(togglesContainer, settings.categories);

    btn.addEventListener('click', () => {
      panel.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', async () => {
      // Read settings from UI
      settings.state = stateSelect.value || null;

      // Read category toggles
      togglesContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        settings.categories[cb.dataset.category] = cb.checked;
      });

      await saveSettings(settings);
      panel.classList.add('hidden');

      updateLocationBadge();
      applyFilters();
      updateCategoryChips();
    });
  }

  function setupCategoryChips() {
    const container = document.getElementById('category-filters');
    container.innerHTML = '';

    Object.keys(CATEGORIES).forEach(key => {
      const cat = CATEGORIES[key];
      const chip = document.createElement('button');
      chip.className = 'filter-chip' + (settings.categories[cat] ? ' active' : '');
      chip.dataset.category = cat;
      chip.textContent = `${CATEGORY_ICONS[cat] || ''} ${CATEGORY_LABELS[cat] || cat}`;

      chip.addEventListener('click', async () => {
        settings.categories[cat] = !settings.categories[cat];
        chip.classList.toggle('active');
        await saveSettings(settings);
        applyFilters();
      });

      container.appendChild(chip);
    });
  }

  function updateCategoryChips() {
    document.querySelectorAll('.filter-chip').forEach(chip => {
      const cat = chip.dataset.category;
      if (settings.categories[cat]) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
