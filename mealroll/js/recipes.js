/**
 * MealRoll — Recipe Database
 * 40+ recipes with dietary tags.
 */
(function (exports) {
  'use strict';

  const TAGS = {
    VEGETARIAN: 'vegetarian',
    VEGAN: 'vegan',
    QUICK: 'quick',
    COMFORT: 'comfort'
  };

  const TAG_LABELS = {
    vegetarian: 'Vegetarian',
    vegan: 'Vegan',
    quick: 'Quick (<30min)',
    comfort: 'Comfort Food'
  };

  const TAG_COLORS = {
    vegetarian: '#4caf50',
    vegan: '#66bb6a',
    quick: '#ffa726',
    comfort: '#ef5350'
  };

  const RECIPES = [
    { id: 1, name: 'Spaghetti Carbonara', emoji: '\uD83C\uDF5D', cookTime: 25, ingredients: ['spaghetti', 'eggs', 'pancetta', 'parmesan', 'black pepper'], tags: ['quick', 'comfort'] },
    { id: 2, name: 'Margherita Pizza', emoji: '\uD83C\uDF55', cookTime: 35, ingredients: ['pizza dough', 'tomato sauce', 'mozzarella', 'fresh basil', 'olive oil'], tags: ['vegetarian', 'comfort'] },
    { id: 3, name: 'Chicken Stir Fry', emoji: '\uD83C\uDF5C', cookTime: 20, ingredients: ['chicken breast', 'bell peppers', 'soy sauce', 'garlic', 'rice'], tags: ['quick'] },
    { id: 4, name: 'Veggie Buddha Bowl', emoji: '\uD83E\uDD57', cookTime: 25, ingredients: ['quinoa', 'avocado', 'chickpeas', 'sweet potato', 'tahini'], tags: ['vegan', 'quick'] },
    { id: 5, name: 'Beef Tacos', emoji: '\uD83C\uDF2E', cookTime: 20, ingredients: ['ground beef', 'taco shells', 'lettuce', 'cheese', 'salsa'], tags: ['quick', 'comfort'] },
    { id: 6, name: 'Mushroom Risotto', emoji: '\uD83C\uDF44', cookTime: 40, ingredients: ['arborio rice', 'mushrooms', 'onion', 'white wine', 'parmesan'], tags: ['vegetarian', 'comfort'] },
    { id: 7, name: 'Thai Green Curry', emoji: '\uD83C\uDF5B', cookTime: 30, ingredients: ['coconut milk', 'green curry paste', 'tofu', 'bamboo shoots', 'basil'], tags: ['vegan'] },
    { id: 8, name: 'Classic BLT Sandwich', emoji: '\uD83E\uDD6A', cookTime: 10, ingredients: ['bacon', 'lettuce', 'tomato', 'bread', 'mayo'], tags: ['quick'] },
    { id: 9, name: 'Lentil Soup', emoji: '\uD83C\uDF72', cookTime: 35, ingredients: ['red lentils', 'onion', 'carrot', 'cumin', 'vegetable broth'], tags: ['vegan', 'comfort'] },
    { id: 10, name: 'Grilled Cheese', emoji: '\uD83E\uDDC0', cookTime: 10, ingredients: ['bread', 'cheddar', 'butter'], tags: ['vegetarian', 'quick', 'comfort'] },
    { id: 11, name: 'Pad Thai', emoji: '\uD83C\uDF5C', cookTime: 25, ingredients: ['rice noodles', 'shrimp', 'bean sprouts', 'peanuts', 'lime'], tags: ['quick'] },
    { id: 12, name: 'Black Bean Burrito', emoji: '\uD83C\uDF2F', cookTime: 15, ingredients: ['black beans', 'rice', 'tortilla', 'avocado', 'salsa'], tags: ['vegan', 'quick', 'comfort'] },
    { id: 13, name: 'Salmon Teriyaki', emoji: '\uD83C\uDF63', cookTime: 20, ingredients: ['salmon fillet', 'soy sauce', 'mirin', 'ginger', 'rice'], tags: ['quick'] },
    { id: 14, name: 'Caprese Salad', emoji: '\uD83E\uDD57', cookTime: 5, ingredients: ['mozzarella', 'tomatoes', 'basil', 'olive oil', 'balsamic'], tags: ['vegetarian', 'quick'] },
    { id: 15, name: 'Mac and Cheese', emoji: '\uD83E\uDDC0', cookTime: 25, ingredients: ['macaroni', 'cheddar', 'milk', 'butter', 'breadcrumbs'], tags: ['vegetarian', 'comfort'] },
    { id: 16, name: 'Chicken Caesar Salad', emoji: '\uD83E\uDD57', cookTime: 15, ingredients: ['chicken breast', 'romaine', 'parmesan', 'croutons', 'caesar dressing'], tags: ['quick'] },
    { id: 17, name: 'Vegetable Fried Rice', emoji: '\uD83C\uDF5A', cookTime: 15, ingredients: ['rice', 'mixed veggies', 'soy sauce', 'sesame oil', 'eggs'], tags: ['vegetarian', 'quick'] },
    { id: 18, name: 'Tomato Basil Pasta', emoji: '\uD83C\uDF45', cookTime: 20, ingredients: ['penne', 'cherry tomatoes', 'garlic', 'basil', 'olive oil'], tags: ['vegan', 'quick'] },
    { id: 19, name: 'Beef Burger', emoji: '\uD83C\uDF54', cookTime: 20, ingredients: ['ground beef', 'bun', 'lettuce', 'tomato', 'cheese'], tags: ['quick', 'comfort'] },
    { id: 20, name: 'Falafel Wrap', emoji: '\uD83E\uDD59', cookTime: 30, ingredients: ['chickpeas', 'pita', 'tahini', 'cucumber', 'tomato'], tags: ['vegan'] },
    { id: 21, name: 'French Onion Soup', emoji: '\uD83C\uDF72', cookTime: 45, ingredients: ['onions', 'beef broth', 'gruyere', 'baguette', 'butter'], tags: ['comfort'] },
    { id: 22, name: 'Shakshuka', emoji: '\uD83C\uDF73', cookTime: 25, ingredients: ['eggs', 'tomato sauce', 'bell pepper', 'cumin', 'feta'], tags: ['vegetarian', 'quick'] },
    { id: 23, name: 'Pesto Gnocchi', emoji: '\uD83C\uDF5D', cookTime: 15, ingredients: ['gnocchi', 'basil pesto', 'cherry tomatoes', 'pine nuts', 'parmesan'], tags: ['vegetarian', 'quick'] },
    { id: 24, name: 'Chicken Tikka Masala', emoji: '\uD83C\uDF5B', cookTime: 40, ingredients: ['chicken', 'yogurt', 'tomato sauce', 'garam masala', 'rice'], tags: ['comfort'] },
    { id: 25, name: 'Avocado Toast', emoji: '\uD83E\uDD51', cookTime: 5, ingredients: ['bread', 'avocado', 'lemon', 'chili flakes', 'salt'], tags: ['vegan', 'quick'] },
    { id: 26, name: 'Ramen', emoji: '\uD83C\uDF5C', cookTime: 45, ingredients: ['ramen noodles', 'pork broth', 'soft egg', 'nori', 'green onion'], tags: ['comfort'] },
    { id: 27, name: 'Greek Salad', emoji: '\uD83E\uDD57', cookTime: 10, ingredients: ['cucumber', 'tomato', 'feta', 'olives', 'red onion'], tags: ['vegetarian', 'quick'] },
    { id: 28, name: 'Banana Pancakes', emoji: '\uD83E\uDD5E', cookTime: 15, ingredients: ['banana', 'eggs', 'flour', 'milk', 'maple syrup'], tags: ['vegetarian', 'quick'] },
    { id: 29, name: 'Minestrone Soup', emoji: '\uD83C\uDF72', cookTime: 35, ingredients: ['beans', 'pasta', 'zucchini', 'tomatoes', 'vegetable broth'], tags: ['vegan', 'comfort'] },
    { id: 30, name: 'Fish and Chips', emoji: '\uD83C\uDF5F', cookTime: 30, ingredients: ['white fish', 'potatoes', 'flour', 'beer', 'tartar sauce'], tags: ['comfort'] },
    { id: 31, name: 'Stuffed Bell Peppers', emoji: '\uD83C\uDF36\uFE0F', cookTime: 40, ingredients: ['bell peppers', 'rice', 'black beans', 'corn', 'cheese'], tags: ['vegetarian'] },
    { id: 32, name: 'Shrimp Scampi', emoji: '\uD83E\uDD90', cookTime: 15, ingredients: ['shrimp', 'linguine', 'garlic', 'white wine', 'butter'], tags: ['quick'] },
    { id: 33, name: 'Sweet Potato Curry', emoji: '\uD83C\uDF60', cookTime: 30, ingredients: ['sweet potato', 'coconut milk', 'curry powder', 'spinach', 'rice'], tags: ['vegan', 'comfort'] },
    { id: 34, name: 'Eggs Benedict', emoji: '\uD83C\uDF73', cookTime: 25, ingredients: ['eggs', 'english muffin', 'ham', 'hollandaise', 'chives'], tags: ['quick'] },
    { id: 35, name: 'Hummus Plate', emoji: '\uD83E\uDED8', cookTime: 10, ingredients: ['chickpeas', 'tahini', 'lemon', 'pita', 'olive oil'], tags: ['vegan', 'quick'] },
    { id: 36, name: 'Chicken Quesadilla', emoji: '\uD83E\uDED4', cookTime: 15, ingredients: ['tortilla', 'chicken', 'cheese', 'peppers', 'sour cream'], tags: ['quick', 'comfort'] },
    { id: 37, name: 'Cauliflower Wings', emoji: '\uD83C\uDF3F', cookTime: 30, ingredients: ['cauliflower', 'hot sauce', 'flour', 'garlic powder', 'butter'], tags: ['vegan'] },
    { id: 38, name: 'Bibimbap', emoji: '\uD83C\uDF5A', cookTime: 30, ingredients: ['rice', 'vegetables', 'egg', 'gochujang', 'sesame oil'], tags: ['vegetarian'] },
    { id: 39, name: 'Pulled Pork Sandwich', emoji: '\uD83C\uDF56', cookTime: 60, ingredients: ['pork shoulder', 'bbq sauce', 'coleslaw', 'buns', 'pickles'], tags: ['comfort'] },
    { id: 40, name: 'Overnight Oats', emoji: '\uD83E\uDD63', cookTime: 5, ingredients: ['oats', 'almond milk', 'chia seeds', 'berries', 'honey'], tags: ['vegetarian', 'vegan', 'quick'] },
    { id: 41, name: 'Poke Bowl', emoji: '\uD83C\uDF63', cookTime: 15, ingredients: ['sushi rice', 'raw tuna', 'avocado', 'edamame', 'soy sauce'], tags: ['quick'] },
    { id: 42, name: 'Eggplant Parmesan', emoji: '\uD83C\uDF46', cookTime: 45, ingredients: ['eggplant', 'marinara', 'mozzarella', 'breadcrumbs', 'basil'], tags: ['vegetarian', 'comfort'] }
  ];

  function getRecipes() {
    return RECIPES;
  }

  function filterRecipes(tags) {
    if (!tags || tags.length === 0) return RECIPES;
    return RECIPES.filter(r => tags.every(t => r.tags.includes(t)));
  }

  function getRandomRecipe(tags) {
    const pool = filterRecipes(tags);
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function getRecipeById(id) {
    return RECIPES.find(r => r.id === id) || null;
  }

  exports.TAGS = TAGS;
  exports.TAG_LABELS = TAG_LABELS;
  exports.TAG_COLORS = TAG_COLORS;
  exports.RECIPES = RECIPES;
  exports.getRecipes = getRecipes;
  exports.filterRecipes = filterRecipes;
  exports.getRandomRecipe = getRandomRecipe;
  exports.getRecipeById = getRecipeById;

})(typeof window !== 'undefined' ? window : module.exports);
