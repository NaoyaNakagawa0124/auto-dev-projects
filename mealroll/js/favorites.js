/**
 * MealRoll — Favorites
 * Save/load favorite recipe IDs via Chrome Storage or localStorage.
 */
(function (exports) {
  'use strict';

  const STORAGE_KEY = 'mealroll_favorites';

  function getStorage() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      return {
        get: () => new Promise(resolve => {
          chrome.storage.local.get(STORAGE_KEY, r => resolve(r[STORAGE_KEY] || []));
        }),
        set: (val) => new Promise(resolve => {
          chrome.storage.local.set({ [STORAGE_KEY]: val }, resolve);
        })
      };
    }
    return {
      get: () => Promise.resolve(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')),
      set: (val) => Promise.resolve(localStorage.setItem(STORAGE_KEY, JSON.stringify(val)))
    };
  }

  async function getFavorites() {
    return await getStorage().get();
  }

  async function addFavorite(recipeId) {
    const favs = await getFavorites();
    if (!favs.includes(recipeId)) {
      favs.push(recipeId);
      await getStorage().set(favs);
    }
    return favs;
  }

  async function removeFavorite(recipeId) {
    let favs = await getFavorites();
    favs = favs.filter(id => id !== recipeId);
    await getStorage().set(favs);
    return favs;
  }

  async function isFavorite(recipeId) {
    const favs = await getFavorites();
    return favs.includes(recipeId);
  }

  async function toggleFavorite(recipeId) {
    if (await isFavorite(recipeId)) {
      return { favs: await removeFavorite(recipeId), added: false };
    } else {
      return { favs: await addFavorite(recipeId), added: true };
    }
  }

  exports.getFavorites = getFavorites;
  exports.addFavorite = addFavorite;
  exports.removeFavorite = removeFavorite;
  exports.isFavorite = isFavorite;
  exports.toggleFavorite = toggleFavorite;

})(typeof window !== 'undefined' ? window : module.exports);
