// ShopKeeper - Game engine
// A virtual bakery that secretly teaches business skills

const PRODUCTS = [
  { id: "cookie", name: "Cookies", icon: "🍪", baseCost: 1.50, suggestedPrice: 3.00, shelfLife: 3, category: "baked" },
  { id: "cake", name: "Cake Slice", icon: "🍰", baseCost: 3.00, suggestedPrice: 6.50, shelfLife: 2, category: "baked" },
  { id: "bread", name: "Fresh Bread", icon: "🍞", baseCost: 2.00, suggestedPrice: 4.50, shelfLife: 2, category: "baked" },
  { id: "muffin", name: "Muffins", icon: "🧁", baseCost: 1.00, suggestedPrice: 2.50, shelfLife: 3, category: "baked" },
  { id: "pie", name: "Fruit Pie", icon: "🥧", baseCost: 4.00, suggestedPrice: 8.00, shelfLife: 3, category: "baked" },
  { id: "coffee", name: "Coffee", icon: "☕", baseCost: 0.50, suggestedPrice: 2.00, shelfLife: 1, category: "drink" },
  { id: "tea", name: "Tea", icon: "🍵", baseCost: 0.30, suggestedPrice: 1.50, shelfLife: 1, category: "drink" },
  { id: "juice", name: "Fresh Juice", icon: "🧃", baseCost: 1.00, suggestedPrice: 3.00, shelfLife: 1, category: "drink" },
];

const CUSTOMERS = [
  { name: "Mrs. Chen", icon: "👵", patience: 3, favoriteCategory: "baked", tip: "good" },
  { name: "Little Timmy", icon: "👦", patience: 1, favoriteCategory: "drink", tip: "none" },
  { name: "Mr. Garcia", icon: "👨", patience: 2, favoriteCategory: "baked", tip: "fair" },
  { name: "Officer Park", icon: "👮", patience: 2, favoriteCategory: "drink", tip: "good" },
  { name: "Dr. Patel", icon: "👩‍⚕️", patience: 1, favoriteCategory: "baked", tip: "great" },
  { name: "Grandma Rose", icon: "👵", patience: 3, favoriteCategory: "baked", tip: "great" },
  { name: "Coach Williams", icon: "🧑‍🏫", patience: 2, favoriteCategory: "drink", tip: "fair" },
  { name: "The Twins", icon: "👧👧", patience: 2, favoriteCategory: "baked", tip: "none" },
];

const SKILLS_TAUGHT = {
  pricing: { name: "Pricing Strategy", description: "Setting prices that cover costs and make a profit" },
  inventory: { name: "Inventory Management", description: "Keeping the right amount of stock" },
  margins: { name: "Profit Margins", description: "Understanding the difference between cost and selling price" },
  cashflow: { name: "Cash Flow", description: "Tracking money coming in and going out" },
  invoicing: { name: "Invoicing", description: "Creating records of sales for customers" },
  waste: { name: "Waste Reduction", description: "Minimizing expired or unsold products" },
  customerService: { name: "Customer Relations", description: "Keeping customers happy and coming back" },
};

const TIPS = {
  none: 0,
  fair: 0.10,
  good: 0.15,
  great: 0.20,
};

function createDefaultState() {
  return {
    shopName: "Grandma's Bakery",
    day: 1,
    cash: 50.00,
    totalRevenue: 0,
    totalCosts: 0,
    totalTips: 0,
    customersServed: 0,
    customersLost: 0,
    invoicesCreated: 0,
    itemsSold: 0,
    itemsExpired: 0,
    inventory: {},
    prices: {},
    salesHistory: [],
    invoices: [],
    skillsDiscovered: [],
    reputation: 50, // 0-100
  };
}

function initializeShop(state) {
  // Set default prices and inventory
  for (const p of PRODUCTS) {
    if (!state.prices[p.id]) state.prices[p.id] = p.suggestedPrice;
    if (!state.inventory[p.id]) state.inventory[p.id] = { quantity: 0, daysOld: 0 };
  }
  return state;
}

function buyStock(state, productId, quantity) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return { state, success: false, message: "Product not found." };
  if (quantity <= 0) return { state, success: false, message: "Must buy at least 1." };

  const totalCost = product.baseCost * quantity;
  if (totalCost > state.cash) {
    return { state, success: false, message: "Not enough cash! Need $" + totalCost.toFixed(2) + " but have $" + state.cash.toFixed(2) };
  }

  state.cash -= totalCost;
  state.totalCosts += totalCost;
  state.inventory[productId].quantity += quantity;
  state.inventory[productId].daysOld = 0;

  discoverSkill(state, "inventory");
  discoverSkill(state, "cashflow");

  return {
    state, success: true,
    message: `Bought ${quantity}x ${product.icon} ${product.name} for $${totalCost.toFixed(2)}`,
    skill: "inventory",
  };
}

function setPrice(state, productId, price) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return { state, success: false, message: "Product not found." };
  if (price <= 0) return { state, success: false, message: "Price must be positive." };

  state.prices[productId] = price;
  discoverSkill(state, "pricing");

  const margin = ((price - product.baseCost) / price * 100).toFixed(0);
  let hint = "";
  if (price < product.baseCost) hint = " ⚠️ You're selling below cost!";
  else if (price > product.suggestedPrice * 1.5) hint = " ⚠️ Customers might find this expensive.";

  discoverSkill(state, "margins");

  return {
    state, success: true,
    message: `Set ${product.name} price to $${price.toFixed(2)} (margin: ${margin}%)${hint}`,
    skill: "pricing",
  };
}

function generateCustomer(day, seed) {
  const rng = seededRandom(seed + day * 7);
  const customer = CUSTOMERS[Math.floor(rng() * CUSTOMERS.length)];
  const wantCount = 1 + Math.floor(rng() * 3);
  const validProducts = PRODUCTS.filter(p => p.category === customer.favoriteCategory);
  const wants = [];
  for (let i = 0; i < wantCount; i++) {
    wants.push(validProducts[Math.floor(rng() * validProducts.length)].id);
  }
  return { ...customer, wants, arrived: true };
}

function serveCustomer(state, customer) {
  const results = [];
  let orderTotal = 0;
  let fulfilled = 0;

  for (const productId of customer.wants) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) continue;

    if (state.inventory[productId] && state.inventory[productId].quantity > 0) {
      state.inventory[productId].quantity--;
      const price = state.prices[productId] || product.suggestedPrice;
      orderTotal += price;
      fulfilled++;
      results.push({ product: productId, sold: true, price });
      state.itemsSold++;
    } else {
      results.push({ product: productId, sold: false, price: 0 });
    }
  }

  // Calculate tip
  const tipRate = TIPS[customer.tip] || 0;
  const tipAmount = orderTotal * tipRate;

  // Reputation impact
  const fulfillRate = customer.wants.length > 0 ? fulfilled / customer.wants.length : 0;
  if (fulfillRate >= 1.0) state.reputation = Math.min(100, state.reputation + 2);
  else if (fulfillRate >= 0.5) state.reputation = Math.min(100, state.reputation + 1);
  else if (fulfillRate === 0) {
    state.reputation = Math.max(0, state.reputation - 3);
    state.customersLost++;
  }

  state.cash += orderTotal + tipAmount;
  state.totalRevenue += orderTotal;
  state.totalTips += tipAmount;
  state.customersServed++;

  discoverSkill(state, "customerService");

  // Create invoice
  const invoice = {
    id: "INV-" + String(state.invoicesCreated + 1).padStart(4, "0"),
    customer: customer.name,
    day: state.day,
    items: results.filter(r => r.sold).map(r => ({
      product: r.product,
      price: r.price,
      name: PRODUCTS.find(p => p.id === r.product).name,
    })),
    subtotal: orderTotal,
    tip: tipAmount,
    total: orderTotal + tipAmount,
  };

  if (invoice.items.length > 0) {
    state.invoices.push(invoice);
    state.invoicesCreated++;
    discoverSkill(state, "invoicing");
  }

  return {
    state,
    customer: customer.name,
    icon: customer.icon,
    results,
    orderTotal,
    tipAmount,
    fulfilled,
    total: customer.wants.length,
    invoice: invoice.items.length > 0 ? invoice : null,
  };
}

function endDay(state) {
  // Age inventory and expire old items
  let expired = 0;
  for (const product of PRODUCTS) {
    const inv = state.inventory[product.id];
    if (!inv) continue;
    inv.daysOld++;
    if (inv.daysOld >= product.shelfLife && inv.quantity > 0) {
      expired += inv.quantity;
      state.itemsExpired += inv.quantity;
      inv.quantity = 0;
      inv.daysOld = 0;
    }
  }

  if (expired > 0) discoverSkill(state, "waste");

  // Record daily summary
  state.salesHistory.push({
    day: state.day,
    revenue: state.totalRevenue,
    costs: state.totalCosts,
    cash: state.cash,
    customersServed: state.customersServed,
    reputation: state.reputation,
  });

  state.day++;

  return { state, expired };
}

function getProfit(state) {
  return state.totalRevenue + state.totalTips - state.totalCosts;
}

function getProfitMargin(state) {
  if (state.totalRevenue === 0) return 0;
  return ((state.totalRevenue - state.totalCosts) / state.totalRevenue * 100);
}

function getProductMargin(productId, state) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return 0;
  const price = state.prices[productId] || product.suggestedPrice;
  if (price === 0) return 0;
  return ((price - product.baseCost) / price * 100);
}

function getInventoryValue(state) {
  let total = 0;
  for (const product of PRODUCTS) {
    const inv = state.inventory[product.id];
    if (inv) total += inv.quantity * product.baseCost;
  }
  return total;
}

function getReputationLevel(reputation) {
  if (reputation >= 90) return { level: "Beloved", icon: "💖", stars: "⭐⭐⭐⭐⭐" };
  if (reputation >= 70) return { level: "Popular", icon: "😊", stars: "⭐⭐⭐⭐" };
  if (reputation >= 50) return { level: "Known", icon: "🙂", stars: "⭐⭐⭐" };
  if (reputation >= 30) return { level: "Struggling", icon: "😟", stars: "⭐⭐" };
  return { level: "Unknown", icon: "😶", stars: "⭐" };
}

function discoverSkill(state, skillId) {
  if (!state.skillsDiscovered.includes(skillId)) {
    state.skillsDiscovered.push(skillId);
  }
}

function getSkillReport(state) {
  return state.skillsDiscovered.map(id => {
    const skill = SKILLS_TAUGHT[id];
    return skill ? { id, ...skill } : { id, name: id, description: "" };
  });
}

function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return (s >>> 16) / 32767;
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PRODUCTS, CUSTOMERS, SKILLS_TAUGHT, TIPS,
    createDefaultState, initializeShop, buyStock, setPrice,
    generateCustomer, serveCustomer, endDay,
    getProfit, getProfitMargin, getProductMargin, getInventoryValue,
    getReputationLevel, discoverSkill, getSkillReport, seededRandom,
  };
}
