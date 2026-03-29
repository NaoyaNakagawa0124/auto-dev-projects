// UI rendering for panels and views
import { countries, genres, getCountryByCode, getGenreById, continentNames } from './data/countries.js';
import { getStats, addMovie, deleteMovie, getState } from './store.js';
import { getRankings } from './leaderboard.js';
import { getActiveChallenges } from './challenges.js';
import { checkAchievements, getAllAchievements } from './achievements.js';

let onMovieAdded = null;

export function setOnMovieAdded(callback) {
  onMovieAdded = callback;
}

export function renderMovieForm(container, preselectedCountry) {
  const sortedCountries = [...countries].sort((a, b) => a.name.localeCompare(b.name, 'ja'));
  const defaultCountry = preselectedCountry || 'JP';

  container.innerHTML = `
    <form id="movie-form" class="fade-in">
      <div class="form-group">
        <label for="movie-title">タイトル</label>
        <input type="text" id="movie-title" placeholder="映画のタイトルを入力" required autocomplete="off" />
      </div>
      <div class="form-group">
        <label for="movie-country">製作国</label>
        <select id="movie-country">
          ${sortedCountries.map(c =>
            `<option value="${c.code}" ${c.code === defaultCountry ? 'selected' : ''}>${c.name}</option>`
          ).join('')}
        </select>
      </div>
      <div class="form-group">
        <label for="movie-genre">ジャンル</label>
        <select id="movie-genre">
          ${genres.map(g =>
            `<option value="${g.id}">${g.name}</option>`
          ).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>評価</label>
        <div class="rating-stars" id="rating-stars">
          ${[1,2,3,4,5].map(i => `<span class="star" data-value="${i}">★</span>`).join('')}
        </div>
      </div>
      <div class="form-group">
        <label for="movie-date">視聴日</label>
        <input type="date" id="movie-date" value="${new Date().toISOString().slice(0, 10)}" />
      </div>
      <button type="submit" class="btn btn-primary">🎬 記録する</button>
    </form>
  `;

  // Rating stars interaction
  let selectedRating = 0;
  const stars = container.querySelectorAll('.star');
  stars.forEach(star => {
    star.addEventListener('mouseenter', () => {
      const val = parseInt(star.dataset.value);
      stars.forEach(s => {
        s.classList.toggle('active', parseInt(s.dataset.value) <= val);
      });
    });
    star.addEventListener('click', () => {
      selectedRating = parseInt(star.dataset.value);
      stars.forEach(s => {
        s.classList.toggle('active', parseInt(s.dataset.value) <= selectedRating);
      });
    });
  });

  const starsContainer = container.querySelector('#rating-stars');
  starsContainer.addEventListener('mouseleave', () => {
    stars.forEach(s => {
      s.classList.toggle('active', parseInt(s.dataset.value) <= selectedRating);
    });
  });

  // Form submission
  const form = container.querySelector('#movie-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const movie = {
      title: container.querySelector('#movie-title').value.trim(),
      country: container.querySelector('#movie-country').value,
      genre: container.querySelector('#movie-genre').value,
      rating: selectedRating,
      date: container.querySelector('#movie-date').value,
    };

    if (!movie.title) return;

    addMovie(movie);

    // Check achievements
    const newAchievements = checkAchievements();

    if (onMovieAdded) {
      onMovieAdded(movie, newAchievements);
    }

    // Reset form
    form.reset();
    selectedRating = 0;
    stars.forEach(s => s.classList.remove('active'));
    container.querySelector('#movie-date').value = new Date().toISOString().slice(0, 10);
    container.querySelector('#movie-country').value = defaultCountry;
  });
}

export function renderMovieLog(container) {
  const stats = getStats();
  const movies = stats.movies;

  if (movies.length === 0) {
    container.innerHTML = `
      <div class="fade-in" style="text-align: center; padding: 40px 0; color: var(--text-secondary);">
        <p style="font-size: 2rem; margin-bottom: 12px;">🎬</p>
        <p>まだ映画が記録されていません</p>
        <p style="font-size: 0.8rem; margin-top: 8px;">＋ボタンから最初の映画を記録しよう！</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="fade-in">
      <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 16px;">
        全${movies.length}作品
      </p>
      <ul class="movie-list">
        ${movies.map(m => {
          const country = getCountryByCode(m.country);
          const genre = getGenreById(m.genre);
          const stars = '★'.repeat(m.rating) + '☆'.repeat(5 - m.rating);
          return `
            <li class="movie-item">
              <div class="movie-item-info">
                <h3>${escapeHtml(m.title)}</h3>
                <p>${country ? country.name : m.country} · ${genre ? genre.name : m.genre} · ${m.date}</p>
              </div>
              <div class="movie-item-rating">${stars}</div>
            </li>
          `;
        }).join('')}
      </ul>
    </div>
  `;
}

export function renderRankings(container) {
  const rankings = getRankings();

  container.innerHTML = `
    <div class="fade-in">
      <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 16px;">
        グローバルランキング
      </p>
      ${rankings.map(r => {
        const rankClass = r.rank === 1 ? 'gold' : r.rank === 2 ? 'silver' : r.rank === 3 ? 'bronze' : '';
        const youClass = r.isPlayer ? 'you' : '';
        return `
          <div class="rank-item ${youClass}">
            <span class="rank-number ${rankClass}">${r.rank}</span>
            <div class="rank-info">
              <div class="rank-name">${escapeHtml(r.name)}${r.isPlayer ? ' 👤' : ''}</div>
              <div class="rank-stats">${r.countries}か国 · ${r.films}本</div>
            </div>
            <div class="rank-score">${r.score}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

export function renderChallenges(container) {
  const challenges = getActiveChallenges();

  container.innerHTML = `
    <div class="fade-in">
      <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 16px;">
        今週のチャレンジ
      </p>
      ${challenges.map(c => `
        <div class="challenge-card ${c.completed ? '' : 'active'}">
          <div class="challenge-title">${c.icon} ${c.title}</div>
          <div class="challenge-desc">${c.desc}</div>
          <div class="challenge-reward">報酬: +${c.reward}ポイント ${c.completed ? '✅ 達成！' : ''}</div>
          <div class="challenge-progress">
            <div class="challenge-progress-bar" style="width: ${(c.progress / c.target) * 100}%"></div>
          </div>
          <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 4px; text-align: right;">
            ${c.progress} / ${c.target}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

export function renderStats(container) {
  const stats = getStats();
  const achievements = getAllAchievements();

  // Genre distribution
  const genreEntries = Object.entries(stats.genreFilmCounts)
    .sort((a, b) => b[1] - a[1]);
  const maxGenreCount = genreEntries.length > 0 ? genreEntries[0][1] : 1;

  // Country distribution
  const countryEntries = Object.entries(stats.countryFilmCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  const maxCountryCount = countryEntries.length > 0 ? countryEntries[0][1] : 1;

  // Continent distribution
  const continentCounts = {};
  stats.movies.forEach(m => {
    const country = getCountryByCode(m.country);
    if (country) {
      continentCounts[country.continent] = (continentCounts[country.continent] || 0) + 1;
    }
  });

  container.innerHTML = `
    <div class="fade-in">
      <!-- Genre Distribution -->
      <div class="stats-section">
        <h3>🎭 ジャンル分布</h3>
        ${genreEntries.length === 0 ? '<p style="color: var(--text-muted); font-size: 0.8rem;">データなし</p>' :
          genreEntries.map(([id, count]) => {
            const genre = getGenreById(id);
            return `
              <div class="genre-bar">
                <span class="genre-bar-label">${genre ? genre.name : id}</span>
                <div class="genre-bar-track">
                  <div class="genre-bar-fill" style="width: ${(count / maxGenreCount) * 100}%; background: ${genre ? genre.color : 'var(--accent)'}"></div>
                </div>
                <span class="genre-bar-count">${count}</span>
              </div>
            `;
          }).join('')
        }
      </div>

      <!-- Top Countries -->
      <div class="stats-section">
        <h3>🌍 国別トップ10</h3>
        ${countryEntries.length === 0 ? '<p style="color: var(--text-muted); font-size: 0.8rem;">データなし</p>' :
          countryEntries.map(([code, count]) => {
            const country = getCountryByCode(code);
            return `
              <div class="genre-bar">
                <span class="genre-bar-label">${country ? country.name : code}</span>
                <div class="genre-bar-track">
                  <div class="genre-bar-fill" style="width: ${(count / maxCountryCount) * 100}%; background: var(--accent)"></div>
                </div>
                <span class="genre-bar-count">${count}</span>
              </div>
            `;
          }).join('')
        }
      </div>

      <!-- Continent Map -->
      <div class="stats-section">
        <h3>🗺️ 大陸別</h3>
        ${Object.keys(continentCounts).length === 0 ? '<p style="color: var(--text-muted); font-size: 0.8rem;">データなし</p>' :
          Object.entries(continentCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([continent, count]) => `
              <div class="genre-bar">
                <span class="genre-bar-label">${continentNames[continent] || continent}</span>
                <div class="genre-bar-track">
                  <div class="genre-bar-fill" style="width: ${(count / stats.totalFilms) * 100}%; background: var(--success)"></div>
                </div>
                <span class="genre-bar-count">${count}</span>
              </div>
            `).join('')
        }
      </div>

      <!-- Achievements -->
      <div class="stats-section">
        <h3>🏅 実績 (${achievements.filter(a => a.unlocked).length}/${achievements.length})</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px;">
          ${achievements.map(a => `
            <div style="
              padding: 10px;
              border-radius: var(--radius-sm);
              background: ${a.unlocked ? 'var(--bg-glass-light)' : 'rgba(20,20,40,0.4)'};
              border: 1px solid ${a.unlocked ? 'var(--border-glass-hover)' : 'var(--border-glass)'};
              opacity: ${a.unlocked ? '1' : '0.5'};
              text-align: center;
            ">
              <div style="font-size: 1.5rem;">${a.icon}</div>
              <div style="font-size: 0.75rem; font-weight: 600; margin-top: 4px;">${a.name}</div>
              <div style="font-size: 0.65rem; color: var(--text-muted); margin-top: 2px;">${a.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
