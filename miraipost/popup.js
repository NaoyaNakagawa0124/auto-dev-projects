/**
 * 未来ポスト (Miraipost) - Popup Script
 * Handles letter writing, sealing, delivery, and reading
 */

// ─── State ──────────────────────────────────────────
let letters = [];
let selectedDays = 30;
let selectedWorryDays = 14;
let currentReadingLetter = null;

// ─── Storage helpers ────────────────────────────────
async function loadLetters() {
  const data = await chrome.storage.local.get(['letters']);
  letters = data.letters || [];
}

async function saveLetters() {
  await chrome.storage.local.set({ letters });
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// ─── Date formatting ────────────────────────────────
function formatDate(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

function formatDateShort(ts) {
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function daysUntil(ts) {
  const now = new Date();
  const target = new Date(ts);
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

function daysAgo(ts) {
  const now = new Date();
  const past = new Date(ts);
  return Math.floor((now - past) / (1000 * 60 * 60 * 24));
}

// ─── Tab switching ──────────────────────────────────
function initTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      // Activate clicked
      tab.classList.add('active');
      const tabId = `tab-${tab.dataset.tab}`;
      document.getElementById(tabId).classList.add('active');

      // Refresh lists
      renderMailbox();
      renderPending();
      renderWorryHistory();
    });
  });
}

// ─── Delivery date selection ────────────────────────
function initDeliveryOptions() {
  // Letter delivery buttons
  document.querySelectorAll('.delivery-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.delivery-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDays = parseInt(btn.dataset.days);
      document.getElementById('custom-date').value = '';
      updateDeliveryDisplay();
    });
  });

  // Worry delivery buttons
  document.querySelectorAll('.worry-delivery-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.worry-delivery-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedWorryDays = parseInt(btn.dataset.days);
    });
  });

  // Custom date
  const customInput = document.getElementById('custom-date');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  customInput.min = tomorrow.toISOString().split('T')[0];

  customInput.addEventListener('change', () => {
    if (customInput.value) {
      document.querySelectorAll('.delivery-btn').forEach(b => b.classList.remove('active'));
      const target = new Date(customInput.value);
      const now = new Date();
      selectedDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
      updateDeliveryDisplay();
    }
  });

  updateDeliveryDisplay();
}

function updateDeliveryDisplay() {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + selectedDays);
  document.getElementById('delivery-date-display').textContent = formatDate(deliveryDate.getTime());
}

// ─── Today's date display ───────────────────────────
function initTodayDate() {
  document.getElementById('today-date').textContent = formatDate(Date.now());
}

// ─── Letter writing & sealing ───────────────────────
function initSealButtons() {
  // Regular letter
  document.getElementById('seal-btn').addEventListener('click', async () => {
    const body = document.getElementById('letter-body').value.trim();
    if (!body) return;

    const deliverAt = Date.now() + selectedDays * 24 * 60 * 60 * 1000;
    const letter = {
      id: generateId(),
      type: 'letter',
      body,
      preview: body.substring(0, 60),
      createdAt: Date.now(),
      deliverAt,
      status: 'sealed',
      opened: false,
    };

    letters.push(letter);
    await saveLetters();

    // Show seal animation
    showSealAnimation(
      '手紙を封印しました',
      `${formatDate(deliverAt)} に届きます`
    );

    // Reset form
    document.getElementById('letter-body').value = '';

    // Update stats
    updateStats();
  });

  // Worry letter
  document.getElementById('worry-seal-btn').addEventListener('click', async () => {
    const body = document.getElementById('worry-body').value.trim();
    if (!body) return;

    const deliverAt = Date.now() + selectedWorryDays * 24 * 60 * 60 * 1000;
    const letter = {
      id: generateId(),
      type: 'worry',
      body,
      preview: body.substring(0, 60),
      createdAt: Date.now(),
      deliverAt,
      status: 'sealed',
      opened: false,
      resolved: null,
    };

    letters.push(letter);
    await saveLetters();

    showSealAnimation(
      '不安を封じました',
      `${formatDate(deliverAt)} に振り返ります`
    );

    document.getElementById('worry-body').value = '';
    updateStats();
    renderWorryHistory();
  });
}

function showSealAnimation(text, subtext) {
  const overlay = document.getElementById('seal-overlay');
  document.querySelector('.seal-text').textContent = text;
  document.getElementById('seal-subtext').textContent = subtext;
  overlay.classList.add('show');

  setTimeout(() => {
    overlay.classList.remove('show');
  }, 2000);
}

// ─── Mailbox (delivered letters) ────────────────────
function renderMailbox() {
  const container = document.getElementById('delivered-list');
  const delivered = letters
    .filter(l => l.status === 'delivered')
    .sort((a, b) => b.deliveredAt - a.deliveredAt);

  if (delivered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <p class="empty-text">まだ届いた手紙はありません</p>
        <p class="empty-hint">手紙を書いて、届くのを楽しみに待ちましょう</p>
      </div>`;
    return;
  }

  container.innerHTML = delivered.map(letter => {
    const isUnread = !letter.opened;
    const isWorry = letter.type === 'worry';
    const cardClass = isUnread ? 'unread' : isWorry ? 'worry-card' : '';
    const resolvedClass = letter.resolved === 'yes' ? 'worry-resolved' : '';
    const seal = isUnread ? '🔴' : (isWorry ? '🕊️' : '💌');

    return `
      <div class="letter-card ${cardClass} ${resolvedClass}" data-id="${letter.id}">
        <div class="letter-card-header">
          <span class="letter-card-date">${formatDate(letter.createdAt)}に書いた手紙</span>
          <span class="letter-card-seal">${seal}</span>
        </div>
        <div class="letter-card-preview">${isUnread ? '未開封の手紙です...' : escapeHtml(letter.preview)}</div>
        <div class="letter-card-status">
          ${isUnread ? '🔴 未開封 — タップして開封' : `📅 ${formatDate(letter.deliveredAt)}に届きました`}
          ${letter.resolved === 'yes' ? '<span class="resolved-tag">😊 解決済み</span>' : ''}
          ${letter.resolved === 'partial' ? '<span class="resolved-tag">🤔 まだ少し</span>' : ''}
        </div>
      </div>`;
  }).join('');

  // Click handlers
  container.querySelectorAll('.letter-card').forEach(card => {
    card.addEventListener('click', () => {
      const letter = letters.find(l => l.id === card.dataset.id);
      if (letter) openLetter(letter);
    });
  });

  // Update unread badge
  const unread = delivered.filter(l => !l.opened).length;
  const badge = document.getElementById('unread-badge');
  if (unread > 0) {
    badge.textContent = unread;
    badge.style.display = 'block';
  } else {
    badge.style.display = 'none';
  }
}

// ─── Pending letters ────────────────────────────────
function renderPending() {
  const container = document.getElementById('pending-list');
  const pending = letters
    .filter(l => l.status === 'sealed')
    .sort((a, b) => a.deliverAt - b.deliverAt);

  if (pending.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">✉️</div>
        <p class="empty-text">配達待ちの手紙はありません</p>
        <p class="empty-hint">手紙を書いてみましょう</p>
      </div>`;
    return;
  }

  container.innerHTML = pending.map(letter => {
    const days = daysUntil(letter.deliverAt);
    const isWorry = letter.type === 'worry';
    const icon = isWorry ? '🕊️' : '✉️';

    return `
      <div class="letter-card pending-card">
        <div class="letter-card-header">
          <span class="letter-card-date">${formatDate(letter.createdAt)}に投函</span>
          <span class="letter-card-seal">${icon} 🔒</span>
        </div>
        <div class="letter-card-preview">${isWorry ? '不安の手紙' : '未来への手紙'}（封印中）</div>
        <div class="letter-card-status">
          <span class="pending-countdown">📅 ${formatDate(letter.deliverAt)}に届く予定（あと${days}日）</span>
        </div>
      </div>`;
  }).join('');
}

// ─── Worry history ──────────────────────────────────
function renderWorryHistory() {
  const container = document.getElementById('worry-list');
  const worries = letters
    .filter(l => l.type === 'worry' && l.status === 'delivered')
    .sort((a, b) => b.deliveredAt - a.deliveredAt);

  if (worries.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🕊️</div>
        <p class="empty-text">振り返れる不安はまだありません</p>
        <p class="empty-hint">不安を書いて封じると、ここに届きます</p>
      </div>`;
    return;
  }

  container.innerHTML = worries.map(letter => {
    const isUnread = !letter.opened;
    const resolvedClass = letter.resolved === 'yes' ? 'worry-resolved' : '';
    const seal = isUnread ? '🔴' : '🕊️';

    return `
      <div class="letter-card worry-card ${resolvedClass}" data-id="${letter.id}">
        <div class="letter-card-header">
          <span class="letter-card-date">${daysAgo(letter.createdAt)}日前の不安</span>
          <span class="letter-card-seal">${seal}</span>
        </div>
        <div class="letter-card-preview">${isUnread ? '未開封...' : escapeHtml(letter.preview)}</div>
        <div class="letter-card-status">
          ${letter.resolved === 'yes' ? '<span class="resolved-tag">😊 解決した！</span>' : ''}
          ${letter.resolved === 'partial' ? '<span class="resolved-tag">🤔 まだ少し</span>' : ''}
          ${letter.resolved === 'no' ? '<span class="resolved-tag">😟 まだ不安</span>' : ''}
          ${!letter.resolved && !isUnread ? 'まだ回答していません' : ''}
        </div>
      </div>`;
  }).join('');

  container.querySelectorAll('.letter-card').forEach(card => {
    card.addEventListener('click', () => {
      const letter = letters.find(l => l.id === card.dataset.id);
      if (letter) openLetter(letter);
    });
  });
}

// ─── Open / Read Letter ─────────────────────────────
function openLetter(letter) {
  currentReadingLetter = letter;
  const overlay = document.getElementById('read-overlay');
  const sealSection = document.getElementById('read-seal');
  const contentSection = document.getElementById('read-content');
  const worryCheck = document.getElementById('read-worry-check');

  if (!letter.opened) {
    // Show sealed state with wax seal
    sealSection.style.display = 'block';
    contentSection.style.display = 'none';

    // Click seal to open
    const sealEl = sealSection.querySelector('.wax-seal');
    const newSeal = sealEl.cloneNode(true);
    sealEl.parentNode.replaceChild(newSeal, sealEl);

    newSeal.addEventListener('click', async () => {
      newSeal.classList.add('breaking');
      setTimeout(() => {
        letter.opened = true;
        saveLetters();
        showLetterContent(letter);
        renderMailbox();
        renderWorryHistory();
        updateStats();
      }, 600);
    });
  } else {
    showLetterContent(letter);
  }

  overlay.classList.add('show');
}

function showLetterContent(letter) {
  const sealSection = document.getElementById('read-seal');
  const contentSection = document.getElementById('read-content');
  const worryCheck = document.getElementById('read-worry-check');

  sealSection.style.display = 'none';
  contentSection.style.display = 'block';

  document.getElementById('read-date').textContent =
    `${formatDate(letter.createdAt)} に書いた手紙`;
  document.getElementById('read-body').textContent = letter.body;
  document.getElementById('read-from').textContent =
    `${formatDate(letter.createdAt)}の自分より`;

  // Show worry resolution if applicable
  if (letter.type === 'worry' && !letter.resolved) {
    worryCheck.style.display = 'block';
  } else {
    worryCheck.style.display = 'none';
  }
}

function initReadOverlay() {
  // Close button
  document.getElementById('read-close').addEventListener('click', () => {
    document.getElementById('read-overlay').classList.remove('show');
    currentReadingLetter = null;
    renderMailbox();
    renderWorryHistory();
  });

  // Click outside to close
  document.getElementById('read-overlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('read-overlay')) {
      document.getElementById('read-overlay').classList.remove('show');
      currentReadingLetter = null;
      renderMailbox();
      renderWorryHistory();
    }
  });

  // Worry resolution buttons
  document.querySelectorAll('.worry-resolved-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (currentReadingLetter) {
        currentReadingLetter.resolved = btn.dataset.resolved;
        await saveLetters();
        document.getElementById('read-worry-check').style.display = 'none';
        updateStats();
        renderWorryHistory();
      }
    });
  });
}

// ─── Stats ──────────────────────────────────────────
function updateStats() {
  const sent = letters.length;
  const delivered = letters.filter(l => l.status === 'delivered').length;
  const resolved = letters.filter(l => l.type === 'worry' && l.resolved === 'yes').length;

  document.getElementById('stat-sent').textContent = sent;
  document.getElementById('stat-delivered').textContent = delivered;
  document.getElementById('stat-resolved').textContent = resolved;
}

// ─── Check for newly deliverable letters ────────────
async function checkDeliveries() {
  const now = Date.now();
  let updated = false;
  for (const letter of letters) {
    if (letter.status === 'sealed' && letter.deliverAt <= now) {
      letter.status = 'delivered';
      letter.deliveredAt = now;
      updated = true;
    }
  }
  if (updated) {
    await saveLetters();
    renderMailbox();
    renderPending();
    renderWorryHistory();
    updateStats();
  }
}

// ─── Utility ────────────────────────────────────────
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ─── Initialize ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  await loadLetters();
  await checkDeliveries();

  initTabs();
  initTodayDate();
  initDeliveryOptions();
  initSealButtons();
  initReadOverlay();

  renderMailbox();
  renderPending();
  renderWorryHistory();
  updateStats();
});
