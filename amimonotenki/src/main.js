// AmimonoTenki - Main entry point
import { searchCity, fetchTemperatureData, getDateRange, computeStats } from './weather.js';
import { initScarf, setScarfData } from './scarf.js';

const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const cityResults = document.getElementById('city-results');
const loading = document.getElementById('loading');
const statsBar = document.getElementById('stats-bar');
const scarfContainer = document.getElementById('scarf-container');
const status = document.getElementById('status');

// Init scarf renderer
initScarf('scarf-container');

// Search
searchBtn.addEventListener('click', doSearch);
cityInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });

async function doSearch() {
  const query = cityInput.value.trim();
  if (!query) return;

  searchBtn.disabled = true;
  cityResults.innerHTML = '';
  setStatus('検索中...', 'info');

  try {
    const cities = await searchCity(query);
    if (cities.length === 0) {
      setStatus('都市が見つかりませんでした。別の名前で試してください。', 'error');
      return;
    }

    cityResults.innerHTML = '';
    cities.forEach(city => {
      const btn = document.createElement('button');
      btn.className = 'city-option';
      btn.textContent = `${city.name}${city.admin ? ', ' + city.admin : ''}, ${city.country}`;
      btn.addEventListener('click', () => selectCity(city));
      cityResults.appendChild(btn);
    });

    setStatus(`${cities.length}件の都市が見つかりました。選択してください。`, 'info');
  } catch (err) {
    setStatus(err.message, 'error');
  } finally {
    searchBtn.disabled = false;
  }
}

async function selectCity(city) {
  cityResults.innerHTML = '';
  loading.classList.add('show');
  setStatus('', 'info');

  try {
    const { start, end } = getDateRange();
    const temps = await fetchTemperatureData(city.lat, city.lng, start, end);

    if (!temps || temps.length === 0) {
      throw new Error('この都市のデータが見つかりませんでした');
    }

    // Update stats
    const stats = computeStats(temps);
    if (stats) {
      statsBar.innerHTML = `
        <div class="stat-card"><div class="stat-value">${stats.days}</div><div class="stat-label">日数（段数）</div></div>
        <div class="stat-card"><div class="stat-value">${stats.min}°</div><div class="stat-label">最低気温</div></div>
        <div class="stat-card"><div class="stat-value">${stats.max}°</div><div class="stat-label">最高気温</div></div>
        <div class="stat-card"><div class="stat-value">${stats.avg}°</div><div class="stat-label">平均気温</div></div>
        <div class="stat-card"><div class="stat-value">${stats.range}°</div><div class="stat-label">気温差</div></div>
      `;
    }

    // Update scarf
    const displayName = `${city.name}, ${city.country}`;
    setScarfData(temps, displayName);
    setStatus(`${displayName} の過去${temps.length}日間のマフラーパターン`, 'info');
  } catch (err) {
    setStatus(err.message, 'error');
  } finally {
    loading.classList.remove('show');
  }
}

function setStatus(msg, type) {
  status.textContent = msg;
  status.className = type;
}

console.log('🧶 あみもの天気 initialized');
