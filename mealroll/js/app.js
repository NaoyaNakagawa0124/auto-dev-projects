/**
 * MealRoll — Main App
 * Wires spin, recipes, favorites, and filters together.
 */
(function () {
  'use strict';

  let activeTags = [];
  let currentRecipe = null;
  let spinState = createSpinState();

  async function init() {
    setupFilters();
    setupSpin();
    setupFavorites();
  }

  /* ── Filters ───────────────────────────────────────── */

  function setupFilters() {
    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const tag = chip.dataset.tag;
        if (activeTags.includes(tag)) {
          activeTags = activeTags.filter(t => t !== tag);
          chip.classList.remove('active');
        } else {
          activeTags.push(tag);
          chip.classList.add('active');
        }
      });
    });
  }

  /* ── Spin ───────────────────────────────────────────── */

  function setupSpin() {
    const spinBtn = document.getElementById('spin-btn');
    const spinAgain = document.getElementById('spin-again');
    const wheelContainer = document.getElementById('wheel-container');
    const wheel = document.getElementById('wheel');

    function doSpin() {
      if (spinState.spinning) return;

      const recipe = getRandomRecipe(activeTags);
      if (!recipe) {
        alert('No recipes match your filters. Try removing a filter.');
        return;
      }

      document.getElementById('recipe-card').classList.add('hidden');
      wheelContainer.classList.add('spinning');
      spinBtn.disabled = true;

      /* Animate emoji rotation */
      const emojis = RECIPES.map(r => r.emoji);
      let frame = 0;
      const emojiInterval = setInterval(() => {
        wheel.textContent = emojis[frame % emojis.length];
        frame++;
      }, 80);

      startSpin(spinState, recipe, function (result) {
        clearInterval(emojiInterval);
        wheelContainer.classList.remove('spinning');
        spinBtn.disabled = false;
        wheel.textContent = result.emoji;
        showRecipe(result);
      });

      /* Drive the spin animation */
      function tick() {
        updateSpin(spinState);
        if (spinState.spinning) {
          requestAnimationFrame(tick);
        }
      }
      requestAnimationFrame(tick);
    }

    spinBtn.addEventListener('click', doSpin);
    spinAgain.addEventListener('click', doSpin);
  }

  /* ── Recipe Card ────────────────────────────────────── */

  async function showRecipe(recipe) {
    currentRecipe = recipe;
    const card = document.getElementById('recipe-card');

    document.getElementById('card-emoji').textContent = recipe.emoji;
    document.getElementById('card-name').textContent = recipe.name;
    document.getElementById('card-time').textContent = recipe.cookTime + ' min';

    /* Tags */
    const tagsEl = document.getElementById('card-tags');
    tagsEl.innerHTML = '';
    recipe.tags.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = TAG_LABELS[tag] || tag;
      span.style.background = TAG_COLORS[tag] || '#666';
      span.style.color = '#fff';
      tagsEl.appendChild(span);
    });

    /* Ingredients */
    document.getElementById('card-ingredients').textContent =
      recipe.ingredients.join(' \u2022 ');

    /* Favorite button */
    const favBtn = document.getElementById('card-fav');
    const isFav = await isFavorite(recipe.id);
    favBtn.innerHTML = isFav ? '&#9829;' : '&#9825;';
    favBtn.classList.toggle('favorited', isFav);

    card.classList.remove('hidden');
    document.getElementById('spin-area').style.display = 'none';
  }

  /* ── Favorites ──────────────────────────────────────── */

  function setupFavorites() {
    const panel = document.getElementById('favs-panel');
    const openBtn = document.getElementById('favs-btn');
    const closeBtn = document.getElementById('favs-close');
    const favBtn = document.getElementById('card-fav');
    const spinAgain = document.getElementById('spin-again');

    openBtn.addEventListener('click', async () => {
      await renderFavoritesList();
      panel.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', () => {
      panel.classList.add('hidden');
    });

    favBtn.addEventListener('click', async () => {
      if (!currentRecipe) return;
      const result = await toggleFavorite(currentRecipe.id);
      favBtn.innerHTML = result.added ? '&#9829;' : '&#9825;';
      favBtn.classList.toggle('favorited', result.added);
    });

    spinAgain.addEventListener('click', () => {
      document.getElementById('recipe-card').classList.add('hidden');
      document.getElementById('spin-area').style.display = '';
    });
  }

  async function renderFavoritesList() {
    const list = document.getElementById('favs-list');
    const favIds = await getFavorites();

    if (favIds.length === 0) {
      list.innerHTML = '<div class="fav-empty">No favorites yet. Spin and heart a recipe!</div>';
      return;
    }

    list.innerHTML = '';
    favIds.forEach(id => {
      const recipe = getRecipeById(id);
      if (!recipe) return;

      const item = document.createElement('div');
      item.className = 'fav-item';
      item.innerHTML = `
        <span class="fav-emoji">${recipe.emoji}</span>
        <span class="fav-name">${recipe.name}</span>
        <button class="fav-remove" data-id="${recipe.id}">&times;</button>
      `;
      list.appendChild(item);
    });

    list.querySelectorAll('.fav-remove').forEach(btn => {
      btn.addEventListener('click', async () => {
        await removeFavorite(parseInt(btn.dataset.id));
        await renderFavoritesList();
      });
    });
  }

  /* Boot */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
