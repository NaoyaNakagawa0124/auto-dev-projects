/**
 * LoveBytes — Main App
 */
(function () {
  'use strict';

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  // Visitor counter
  const visits = parseInt(localStorage.getItem('lovebytes_visits') || '0') + 1;
  localStorage.setItem('lovebytes_visits', String(visits));
  const counterEl = document.getElementById('visitor-count');
  if (counterEl) counterEl.textContent = String(visits + 12847).padStart(6, '0');

  // Navigation
  document.querySelectorAll('.nav button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav button').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      const section = document.getElementById('section-' + btn.dataset.section);
      if (section) section.classList.add('active');
      if (btn.dataset.section === 'scrapbook') renderScrapbook();
      if (btn.dataset.section === 'guestbook') renderGuestbook();
    });
  });

  // Daily Prompt
  const prompt = getTodaysPrompt();
  const headlineEl = document.getElementById('prompt-headline');
  const questionEl = document.getElementById('prompt-question');
  if (headlineEl) headlineEl.textContent = 'NEWS: ' + prompt.headline;
  if (questionEl) questionEl.textContent = prompt.question;

  // Check if already responded today
  const today = new Date().toISOString().split('T')[0];
  const entries = loadEntries();
  const todayEntry = entries.find(e => e.id === today);
  const inputEl = document.getElementById('prompt-input');
  if (todayEntry && inputEl) {
    inputEl.value = todayEntry.responses.partner1 || '';
  }

  // Submit prompt
  const submitBtn = document.getElementById('prompt-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const text = inputEl.value.trim();
      if (!text) return;
      const entry = createEntry(text, '', prompt, today);
      addEntry(entry);
      document.getElementById('prompt-saved').style.display = 'block';
      setTimeout(() => {
        document.getElementById('prompt-saved').style.display = 'none';
      }, 2000);
    });
  }

  // Scrapbook renderer
  function renderScrapbook() {
    const container = document.getElementById('scrapbook-entries');
    const emptyEl = document.getElementById('scrapbook-empty');
    const all = loadEntries();

    if (all.length === 0) {
      if (emptyEl) emptyEl.style.display = 'block';
      return;
    }
    if (emptyEl) emptyEl.style.display = 'none';
    if (!container) return;

    container.innerHTML = '';
    const sorted = all.slice().sort((a, b) => b.date.localeCompare(a.date));

    sorted.forEach(entry => {
      const div = document.createElement('div');
      div.className = 'entry';
      div.style.background = entry.style.bgColor;
      div.style.color = entry.style.textColor;
      div.style.fontFamily = entry.style.font;

      div.innerHTML = `
        <div class="entry-decoration">${entry.style.decoration}</div>
        <div class="entry-date">${entry.date}</div>
        <div class="entry-prompt">"${entry.prompt.question || ''}"</div>
        <div class="entry-label">Partner 1:</div>
        <div class="entry-response">${escapeHtml(entry.responses.partner1 || '(no response)')}</div>
        ${entry.responses.partner2 ? `<div class="entry-label">Partner 2:</div><div class="entry-response">${escapeHtml(entry.responses.partner2)}</div>` : ''}
        <div class="entry-decoration">${entry.style.decoration}</div>
      `;
      container.appendChild(div);
    });
  }

  // Guestbook renderer
  function renderGuestbook() {
    const container = document.getElementById('gb-messages');
    if (!container) return;
    const messages = loadMessages();
    if (messages.length === 0) {
      container.innerHTML = '<div style="color:#666;text-align:center;padding:20px;">Be the first to sign!</div>';
      return;
    }
    container.innerHTML = messages.slice().reverse().map(m =>
      `<div class="gb-msg" style="color:${m.color}">
        <span class="gb-author">${escapeHtml(m.author)}</span>:
        ${escapeHtml(m.text)}
        <span class="gb-time">${m.timestamp.split('T')[0]}</span>
      </div>`
    ).join('');
  }

  // Guestbook submit
  const gbSubmit = document.getElementById('gb-submit');
  if (gbSubmit) {
    gbSubmit.addEventListener('click', () => {
      const name = document.getElementById('gb-name').value.trim();
      const text = document.getElementById('gb-text').value.trim();
      const color = document.getElementById('gb-color').value;
      if (!text) return;
      addMessage(createMessage(name, text, color));
      document.getElementById('gb-name').value = '';
      document.getElementById('gb-text').value = '';
      renderGuestbook();
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
})();
