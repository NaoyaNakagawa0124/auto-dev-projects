/**
 * AniVote — Main App
 */
(function () {
  'use strict';

  let party = null;
  let currentMember = '';

  function init() {
    // Check URL for shared party
    const hash = window.location.hash.slice(1);
    if (hash) {
      party = importParty(hash);
      if (party) {
        currentMember = prompt('Enter your name to join:') || 'Guest';
        addMember(party, currentMember);
        saveParty(party);
        window.location.hash = '';
        showMain();
        return;
      }
    }

    // Check localStorage
    party = loadParty();
    if (party) {
      currentMember = party.members[0]?.name || 'Host';
      showMain();
    }

    // Setup handlers
    document.getElementById('setup-create').addEventListener('click', () => {
      const pName = document.getElementById('setup-party-name').value.trim() || 'Anime Night';
      const mName = document.getElementById('setup-your-name').value.trim() || 'Host';
      party = createParty(pName, mName);
      currentMember = mName;
      saveParty(party);
      showMain();
    });

    document.getElementById('setup-import').addEventListener('click', () => {
      const code = prompt('Paste the share link or code:');
      if (code) {
        const hash = code.includes('#') ? code.split('#')[1] : code;
        const imported = importParty(hash);
        if (imported) {
          party = imported;
          currentMember = prompt('Your name:') || 'Guest';
          addMember(party, currentMember);
          saveParty(party);
          showMain();
        } else {
          alert('Invalid share code.');
        }
      }
    });

    // Tabs
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
        render();
      });
    });

    // Add anime
    const addInput = document.getElementById('add-title');
    const sugBox = document.getElementById('suggestions');
    addInput.addEventListener('input', () => {
      const q = addInput.value.trim();
      const results = getSuggestions(q);
      if (results.length === 0) { sugBox.classList.add('hidden'); return; }
      sugBox.classList.remove('hidden');
      sugBox.innerHTML = results.map(a =>
        `<div class="suggestion" data-title="${a.title}"><span class="sg-emoji">${a.emoji}</span>${a.title}<span class="sg-meta">${a.episodes} ep · ${a.genre}</span></div>`
      ).join('');
      sugBox.querySelectorAll('.suggestion').forEach(s => {
        s.addEventListener('click', () => {
          const info = getByTitle(s.dataset.title);
          if (info) { addAnime(party, info.title, info.episodes, info.genre, info.emoji); }
          addInput.value = '';
          sugBox.classList.add('hidden');
          saveParty(party);
          render();
        });
      });
    });

    document.getElementById('add-btn').addEventListener('click', () => {
      const title = addInput.value.trim();
      if (!title) return;
      const info = getByTitle(title);
      if (info) addAnime(party, info.title, info.episodes, info.genre, info.emoji);
      else addAnime(party, title, 12, 'Unknown', '\uD83C\uDFAC');
      addInput.value = '';
      sugBox.classList.add('hidden');
      saveParty(party);
      render();
    });

    // Add member
    document.getElementById('add-member-btn').addEventListener('click', () => {
      const name = document.getElementById('add-member').value.trim();
      if (name) { addMember(party, name); document.getElementById('add-member').value = ''; saveParty(party); render(); }
    });

    // Share
    document.getElementById('share-btn').addEventListener('click', () => {
      const code = exportParty(party);
      const url = window.location.origin + window.location.pathname + '#' + code;
      navigator.clipboard.writeText(url).then(() => alert('Share link copied!')).catch(() => {
        prompt('Copy this link:', url);
      });
    });

    // Stats
    document.getElementById('stats-btn').addEventListener('click', () => {
      const s = getStats(party);
      document.getElementById('stats-body').innerHTML = [
        ['Members', s.members], ['Total Anime', s.total], ['Candidates', s.candidates],
        ['Watching', s.watching], ['Completed', s.completed],
        ['Total Votes', s.totalVotes], ['Episodes Watched', s.totalEpisodes],
      ].map(([k, v]) => `<div class="stat-row"><span>${k}</span><span class="stat-value">${v}</span></div>`).join('');
      document.getElementById('stats-modal').classList.remove('hidden');
    });
    document.getElementById('close-stats').addEventListener('click', () => {
      document.getElementById('stats-modal').classList.add('hidden');
    });
  }

  function showMain() {
    document.getElementById('setup').classList.add('hidden');
    document.getElementById('main').classList.remove('hidden');
    document.getElementById('party-name').textContent = party.name;
    render();
  }

  function render() {
    renderCandidates();
    renderWatching();
    renderCompleted();
    renderMembers();
  }

  function renderCandidates() {
    const list = document.getElementById('candidate-list');
    const candidates = getCandidates(party);
    if (candidates.length === 0) { list.innerHTML = '<div class="empty-state">No candidates yet. Add anime above!</div>'; return; }
    list.innerHTML = candidates.map(a => animeCard(a, 'candidate')).join('');
    bindCardEvents(list);
  }

  function renderWatching() {
    const list = document.getElementById('watching-list');
    const watching = getWatching(party);
    if (watching.length === 0) { list.innerHTML = '<div class="empty-state">Nothing being watched. Vote and start one!</div>'; return; }
    list.innerHTML = watching.map(a => animeCard(a, 'watching')).join('');
    bindCardEvents(list);
  }

  function renderCompleted() {
    const list = document.getElementById('completed-list');
    const completed = getCompleted(party);
    if (completed.length === 0) { list.innerHTML = '<div class="empty-state">No completed shows yet.</div>'; return; }
    list.innerHTML = completed.map(a => animeCard(a, 'completed')).join('');
  }

  function renderMembers() {
    const list = document.getElementById('member-list');
    list.innerHTML = party.members.map(m =>
      `<div class="member-card"><div class="member-avatar">${m.name.charAt(0).toUpperCase()}</div><div class="member-name">${esc(m.name)}${m.name === currentMember ? ' (you)' : ''}</div><div class="member-since">joined ${m.joinedAt.split('T')[0]}</div></div>`
    ).join('');
  }

  function animeCard(a, context) {
    const avg = getVoteScore(a).toFixed(1);
    const myVote = getMemberVote(a, currentMember);
    const stars = [1,2,3,4,5].map(s =>
      `<span class="star ${s <= myVote ? 'filled' : ''}" data-anime="${a.id}" data-score="${s}">${s <= myVote ? '\u2605' : '\u2606'}</span>`
    ).join('');
    const pct = a.episodes > 0 ? Math.round((a.watchedEpisodes / a.episodes) * 100) : 0;

    let actions = '';
    if (context === 'candidate') {
      actions = `<div class="anime-actions"><button class="btn-watch" data-anime="${a.id}" data-action="watch">Start Watching</button><button class="btn-drop" data-anime="${a.id}" data-action="remove">Remove</button></div>`;
    } else if (context === 'watching') {
      actions = `<div class="progress"><div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div><span class="progress-text">${a.watchedEpisodes}/${a.episodes}</span><button class="btn-ep" data-anime="${a.id}" data-action="episode">+1 ep</button></div>`;
    }

    return `<div class="anime-card"><div class="anime-header"><span class="anime-emoji">${a.emoji}</span><span class="anime-title">${esc(a.title)}</span><span class="anime-genre">${a.genre}</span></div><div class="anime-meta">${a.episodes} episodes · added by ${esc(a.addedBy)}</div><div class="vote-row"><span class="vote-label">Your vote:</span><div class="vote-stars">${stars}</div><span class="vote-avg">${avg}/5 (${a.votes.length})</span></div>${actions}</div>`;
  }

  function bindCardEvents(container) {
    container.querySelectorAll('.star').forEach(s => {
      s.addEventListener('click', () => {
        vote(party, s.dataset.anime, currentMember, parseInt(s.dataset.score));
        saveParty(party); render();
      });
    });
    container.querySelectorAll('[data-action="watch"]').forEach(b => {
      b.addEventListener('click', () => { setStatus(party, b.dataset.anime, STATUS.WATCHING); saveParty(party); render(); });
    });
    container.querySelectorAll('[data-action="remove"]').forEach(b => {
      b.addEventListener('click', () => { removeAnime(party, b.dataset.anime); saveParty(party); render(); });
    });
    container.querySelectorAll('[data-action="episode"]').forEach(b => {
      b.addEventListener('click', () => { incrementEpisode(party, b.dataset.anime); saveParty(party); render(); });
    });
  }

  function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
