/**
 * SproutMap — Food database with categories, sustainability scores, and plant types.
 */
(function (exports) {
  'use strict';

  const CATEGORIES = {
    VEGETABLE: 'vegetable',
    FRUIT: 'fruit',
    GRAIN: 'grain',
    PROTEIN: 'protein',
    DAIRY: 'dairy',
    SWEET: 'sweet',
    DRINK: 'drink',
  };

  const CATEGORY_PLANTS = {
    vegetable: { type: 'leaf', color: [60, 180, 75], label: 'Leafy Green' },
    fruit:     { type: 'flower', color: [230, 100, 140], label: 'Flower' },
    grain:     { type: 'wheat', color: [210, 180, 60], label: 'Wheat Stalk' },
    protein:   { type: 'mushroom', color: [180, 140, 100], label: 'Mushroom' },
    dairy:     { type: 'daisy', color: [240, 240, 220], label: 'Daisy' },
    sweet:     { type: 'berry', color: [180, 60, 100], label: 'Berry Bush' },
    drink:     { type: 'fern', color: [40, 140, 100], label: 'Fern' },
  };

  // Sustainability: 1 = very sustainable, 5 = high footprint
  const FOODS = [
    { name: 'Salad', category: 'vegetable', sustainability: 1, emoji: '\uD83E\uDD57' },
    { name: 'Broccoli', category: 'vegetable', sustainability: 1, emoji: '\uD83E\uDD66' },
    { name: 'Carrot', category: 'vegetable', sustainability: 1, emoji: '\uD83E\uDD55' },
    { name: 'Spinach', category: 'vegetable', sustainability: 1, emoji: '\uD83E\uDD6C' },
    { name: 'Tomato', category: 'vegetable', sustainability: 1, emoji: '\uD83C\uDF45' },
    { name: 'Corn', category: 'vegetable', sustainability: 2, emoji: '\uD83C\uDF3D' },
    { name: 'Potato', category: 'vegetable', sustainability: 1, emoji: '\uD83E\uDD54' },
    { name: 'Apple', category: 'fruit', sustainability: 1, emoji: '\uD83C\uDF4E' },
    { name: 'Banana', category: 'fruit', sustainability: 2, emoji: '\uD83C\uDF4C' },
    { name: 'Strawberry', category: 'fruit', sustainability: 2, emoji: '\uD83C\uDF53' },
    { name: 'Orange', category: 'fruit', sustainability: 1, emoji: '\uD83C\uDF4A' },
    { name: 'Grapes', category: 'fruit', sustainability: 2, emoji: '\uD83C\uDF47' },
    { name: 'Watermelon', category: 'fruit', sustainability: 2, emoji: '\uD83C\uDF49' },
    { name: 'Rice', category: 'grain', sustainability: 2, emoji: '\uD83C\uDF5A' },
    { name: 'Bread', category: 'grain', sustainability: 2, emoji: '\uD83C\uDF5E' },
    { name: 'Pasta', category: 'grain', sustainability: 2, emoji: '\uD83C\uDF5D' },
    { name: 'Oatmeal', category: 'grain', sustainability: 1, emoji: '\uD83E\uDD63' },
    { name: 'Quinoa', category: 'grain', sustainability: 2, emoji: '\uD83C\uDF3E' },
    { name: 'Chicken', category: 'protein', sustainability: 3, emoji: '\uD83C\uDF57' },
    { name: 'Beef', category: 'protein', sustainability: 5, emoji: '\uD83E\uDD69' },
    { name: 'Fish', category: 'protein', sustainability: 3, emoji: '\uD83C\uDF1F' },
    { name: 'Tofu', category: 'protein', sustainability: 1, emoji: '\uD83E\uDDC8' },
    { name: 'Eggs', category: 'protein', sustainability: 2, emoji: '\uD83E\uDD5A' },
    { name: 'Beans', category: 'protein', sustainability: 1, emoji: '\uD83E\uDED8' },
    { name: 'Shrimp', category: 'protein', sustainability: 4, emoji: '\uD83E\uDD90' },
    { name: 'Cheese', category: 'dairy', sustainability: 3, emoji: '\uD83E\uDDC0' },
    { name: 'Yogurt', category: 'dairy', sustainability: 2, emoji: '\uD83E\uDD5B' },
    { name: 'Milk', category: 'dairy', sustainability: 3, emoji: '\uD83E\uDD5B' },
    { name: 'Ice Cream', category: 'sweet', sustainability: 3, emoji: '\uD83C\uDF68' },
    { name: 'Chocolate', category: 'sweet', sustainability: 3, emoji: '\uD83C\uDF6B' },
    { name: 'Cake', category: 'sweet', sustainability: 3, emoji: '\uD83C\uDF70' },
    { name: 'Cookie', category: 'sweet', sustainability: 2, emoji: '\uD83C\uDF6A' },
    { name: 'Coffee', category: 'drink', sustainability: 2, emoji: '\u2615' },
    { name: 'Tea', category: 'drink', sustainability: 1, emoji: '\uD83C\uDF75' },
    { name: 'Juice', category: 'drink', sustainability: 2, emoji: '\uD83E\uDDC3' },
    { name: 'Smoothie', category: 'drink', sustainability: 2, emoji: '\uD83E\uDD64' },
  ];

  function getFoodByName(name) {
    return FOODS.find(f => f.name.toLowerCase() === name.toLowerCase()) || null;
  }

  function getFoodsByCategory(category) {
    return FOODS.filter(f => f.category === category);
  }

  function getPlantType(category) {
    return CATEGORY_PLANTS[category] || CATEGORY_PLANTS.vegetable;
  }

  function calculateSustainabilityScore(mealLog) {
    if (!mealLog || mealLog.length === 0) return { score: 0, grade: 'N/A', color: '#999' };
    const avg = mealLog.reduce((sum, m) => sum + m.sustainability, 0) / mealLog.length;
    let grade, color;
    if (avg <= 1.5) { grade = 'A'; color = '#27ae60'; }
    else if (avg <= 2.5) { grade = 'B'; color = '#7dcea0'; }
    else if (avg <= 3.5) { grade = 'C'; color = '#f39c12'; }
    else if (avg <= 4.5) { grade = 'D'; color = '#e74c3c'; }
    else { grade = 'F'; color = '#c0392b'; }
    return { score: Math.round(avg * 20), grade, color, avg: Math.round(avg * 10) / 10 };
  }

  function getCategoryDistribution(mealLog) {
    const dist = {};
    Object.values(CATEGORIES).forEach(c => dist[c] = 0);
    mealLog.forEach(m => { if (dist[m.category] !== undefined) dist[m.category]++; });
    return dist;
  }

  function getDiversityScore(mealLog) {
    const cats = new Set(mealLog.map(m => m.category));
    return Math.round((cats.size / Object.keys(CATEGORIES).length) * 100);
  }

  exports.CATEGORIES = CATEGORIES;
  exports.CATEGORY_PLANTS = CATEGORY_PLANTS;
  exports.FOODS = FOODS;
  exports.getFoodByName = getFoodByName;
  exports.getFoodsByCategory = getFoodsByCategory;
  exports.getPlantType = getPlantType;
  exports.calculateSustainabilityScore = calculateSustainabilityScore;
  exports.getCategoryDistribution = getCategoryDistribution;
  exports.getDiversityScore = getDiversityScore;

})(typeof window !== 'undefined' ? window : module.exports);
