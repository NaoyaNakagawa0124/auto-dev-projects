// ShopKeeper - UI Controller
(function() {
  let state = null;
  let currentCustomer = null;
  let prevSkillCount = 0;

  const storage = {
    get(key, cb) { try { const v = localStorage.getItem(key); cb(v ? JSON.parse(v) : undefined); } catch(e) { cb(undefined); } },
    set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {} }
  };

  function init() {
    storage.get('shopkeeper_state', function(saved) {
      state = saved || createDefaultState();
      state = initializeShop(state);
      prevSkillCount = state.skillsDiscovered.length;
      setupNav();
      setupShop();
      setupStock();
      setupPrices();
      renderAll();
    });
  }

  function save() { storage.set('shopkeeper_state', state); }

  function setupNav() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('view-' + btn.dataset.view).classList.add('active');
        renderAll();
      });
    });
  }

  function setupShop() {
    document.getElementById('btn-next-customer').addEventListener('click', function() {
      currentCustomer = generateCustomer(state.day, state.customersServed + state.day * 13);
      document.getElementById('no-customer').classList.add('hidden');
      document.getElementById('customer-card').classList.remove('hidden');
      document.getElementById('serve-result').classList.add('hidden');
      renderCustomer();
    });

    document.getElementById('btn-serve').addEventListener('click', function() {
      if (!currentCustomer) return;
      const result = serveCustomer(state, currentCustomer);
      save();
      renderServeResult(result);
      checkSkillDiscovery();
      currentCustomer = null;
      renderAll();
    });

    document.getElementById('btn-end-day').addEventListener('click', function() {
      const result = endDay(state);
      save();
      renderDaySummary(result);
      checkSkillDiscovery();
      currentCustomer = null;
      document.getElementById('customer-card').classList.add('hidden');
      document.getElementById('no-customer').classList.remove('hidden');
      renderAll();
    });
  }

  function setupStock() {
    const grid = document.getElementById('stock-grid');
    PRODUCTS.forEach(p => {
      const card = document.createElement('div');
      card.className = 'stock-card';
      card.dataset.id = p.id;
      card.innerHTML = `
        <span class="item-icon">${p.icon}</span>
        <div class="item-info">
          <div class="item-name">${p.name}</div>
          <div class="item-detail">Cost: $${p.baseCost.toFixed(2)} each | Lasts ${p.shelfLife} days</div>
          <div class="item-stock" id="stock-qty-${p.id}">Stock: 0</div>
        </div>
        <div class="stock-actions">
          <button class="qty-btn" data-action="buy1" data-product="${p.id}">+1</button>
          <button class="qty-btn" data-action="buy5" data-product="${p.id}">+5</button>
        </div>`;
      grid.appendChild(card);
    });

    grid.addEventListener('click', function(e) {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const productId = btn.dataset.product;
      const qty = btn.dataset.action === 'buy5' ? 5 : 1;
      const result = buyStock(state, productId, qty);
      save();
      if (!result.success) alert(result.message);
      checkSkillDiscovery();
      renderAll();
    });
  }

  function setupPrices() {
    const grid = document.getElementById('price-grid');
    PRODUCTS.forEach(p => {
      const card = document.createElement('div');
      card.className = 'price-card';
      card.innerHTML = `
        <span class="item-icon">${p.icon}</span>
        <div class="item-info">
          <div class="item-name">${p.name}</div>
          <div class="item-detail">Your cost: $${p.baseCost.toFixed(2)}</div>
          <span class="margin-badge" id="margin-${p.id}"></span>
        </div>
        <div class="price-actions">
          <span>$</span>
          <input type="number" class="price-input" id="price-${p.id}" min="0.01" step="0.50" value="${p.suggestedPrice.toFixed(2)}">
        </div>`;
      grid.appendChild(card);
    });

    grid.addEventListener('change', function(e) {
      if (!e.target.classList.contains('price-input')) return;
      const productId = e.target.id.replace('price-', '');
      const price = parseFloat(e.target.value) || 0;
      setPrice(state, productId, price);
      save();
      checkSkillDiscovery();
      renderAll();
    });
  }

  function renderCustomer() {
    if (!currentCustomer) return;
    document.getElementById('cust-icon').textContent = currentCustomer.icon;
    document.getElementById('cust-name').textContent = currentCustomer.name;
    const wantNames = currentCustomer.wants.map(id => {
      const p = PRODUCTS.find(pr => pr.id === id);
      return p ? p.icon + ' ' + p.name : id;
    });
    document.getElementById('cust-wants').textContent = 'Wants: ' + wantNames.join(', ');
  }

  function renderServeResult(result) {
    const el = document.getElementById('serve-result');
    el.classList.remove('hidden');
    let html = `<strong>${result.icon} ${result.customer}</strong><br>`;
    html += `Served ${result.fulfilled}/${result.total} items<br>`;
    html += `Sale: $${result.orderTotal.toFixed(2)}`;
    if (result.tipAmount > 0) html += ` + $${result.tipAmount.toFixed(2)} tip`;
    html += `<br>`;
    if (result.invoice) html += `<br>Invoice ${result.invoice.id} created! 📋`;
    if (result.fulfilled < result.total) html += `<br><em>Some items were out of stock.</em>`;
    el.innerHTML = html;
  }

  function renderDaySummary(result) {
    const el = document.getElementById('day-summary');
    el.classList.remove('hidden');
    let html = `<strong>🌙 Day ${state.day - 1} Complete!</strong><br>`;
    if (result.expired > 0) html += `⚠️ ${result.expired} items expired!<br>`;
    html += `Cash: $${state.cash.toFixed(2)}<br>`;
    html += `Profit: $${getProfit(state).toFixed(2)}<br>`;
    html += `Ready for Day ${state.day}!`;
    el.innerHTML = html;
  }

  function renderAll() {
    // Header
    document.getElementById('day-display').textContent = 'Day ' + state.day;
    document.getElementById('cash-display').textContent = '💰 $' + state.cash.toFixed(2);
    const rep = getReputationLevel(state.reputation);
    document.getElementById('rep-display').textContent = rep.icon + ' ' + rep.level + ' ' + rep.stars;

    // Stock quantities
    PRODUCTS.forEach(p => {
      const el = document.getElementById('stock-qty-' + p.id);
      if (el) {
        const qty = state.inventory[p.id] ? state.inventory[p.id].quantity : 0;
        el.textContent = 'Stock: ' + qty;
      }
    });

    // Price margins
    PRODUCTS.forEach(p => {
      const el = document.getElementById('margin-' + p.id);
      if (el) {
        const margin = getProductMargin(p.id, state);
        el.textContent = margin.toFixed(0) + '% margin';
        el.className = 'margin-badge ' + (margin > 30 ? 'margin-good' : margin > 0 ? 'margin-low' : 'margin-loss');
      }
      const input = document.getElementById('price-' + p.id);
      if (input && state.prices[p.id]) input.value = state.prices[p.id].toFixed(2);
    });

    // Invoices
    const invoiceList = document.getElementById('invoice-list');
    if (invoiceList) {
      invoiceList.innerHTML = '';
      if (state.invoices.length === 0) {
        invoiceList.innerHTML = '<p class="hint">No invoices yet. Serve customers to create them!</p>';
      } else {
        state.invoices.slice(-10).reverse().forEach(inv => {
          const card = document.createElement('div');
          card.className = 'invoice-card';
          card.innerHTML = `
            <div class="invoice-header">
              <span class="invoice-id">${inv.id}</span>
              <span>Day ${inv.day} — ${inv.customer}</span>
            </div>
            <div class="invoice-items">${inv.items.map(i => i.name + ' $' + i.price.toFixed(2)).join('<br>')}</div>
            <div class="invoice-total">Total: $${inv.total.toFixed(2)}</div>`;
          invoiceList.appendChild(card);
        });
      }
    }

    // Report
    const report = document.getElementById('report-content');
    if (report) {
      const profit = getProfit(state);
      const margin = getProfitMargin(state);
      report.innerHTML = `
        <div class="report-grid">
          <div class="report-card"><div class="report-val">$${state.totalRevenue.toFixed(2)}</div><div class="report-label">Total Revenue</div></div>
          <div class="report-card"><div class="report-val">$${state.totalCosts.toFixed(2)}</div><div class="report-label">Total Costs</div></div>
          <div class="report-card"><div class="report-val" style="color:${profit >= 0 ? '#4CAF50' : '#E74C3C'}">$${profit.toFixed(2)}</div><div class="report-label">Profit</div></div>
          <div class="report-card"><div class="report-val">${margin.toFixed(0)}%</div><div class="report-label">Profit Margin</div></div>
          <div class="report-card"><div class="report-val">${state.customersServed}</div><div class="report-label">Served</div></div>
          <div class="report-card"><div class="report-val">${state.invoicesCreated}</div><div class="report-label">Invoices</div></div>
          <div class="report-card"><div class="report-val">${state.itemsSold}</div><div class="report-label">Items Sold</div></div>
          <div class="report-card"><div class="report-val">${state.itemsExpired}</div><div class="report-label">Expired</div></div>
        </div>`;
    }

    // Skills
    const skillsList = document.getElementById('skills-list');
    if (skillsList) {
      const skills = getSkillReport(state);
      if (skills.length === 0) {
        skillsList.innerHTML = '<p class="hint">Keep playing to discover business skills!</p>';
      } else {
        skillsList.innerHTML = skills.map(s =>
          `<div class="skill-card"><div class="skill-name">🎓 ${s.name}</div><div class="skill-desc">${s.description}</div></div>`
        ).join('');
      }
    }
  }

  function checkSkillDiscovery() {
    if (state.skillsDiscovered.length > prevSkillCount) {
      const newSkill = state.skillsDiscovered[state.skillsDiscovered.length - 1];
      const skill = SKILLS_TAUGHT[newSkill];
      if (skill) showToast(skill.name, skill.description);
      prevSkillCount = state.skillsDiscovered.length;
    }
  }

  function showToast(name, desc) {
    document.getElementById('toast-skill-name').textContent = name;
    document.getElementById('toast-skill-desc').textContent = desc;
    const toast = document.getElementById('skill-toast');
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 4000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
