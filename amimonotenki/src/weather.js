// Weather data fetching from OpenMeteo API (free, no key required)

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://archive-api.open-meteo.com/v1/archive';

export async function searchCity(query) {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=5&language=ja`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('都市検索に失敗しました');
  const data = await res.json();
  return (data.results || []).map(r => ({
    name: r.name,
    country: r.country || '',
    lat: r.latitude,
    lng: r.longitude,
    admin: r.admin1 || '',
  }));
}

export async function fetchTemperatureData(lat, lng, startDate, endDate) {
  const url = `${WEATHER_URL}?latitude=${lat}&longitude=${lng}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_mean,temperature_2m_max,temperature_2m_min&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('天気データの取得に失敗しました');
  const data = await res.json();

  if (!data.daily || !data.daily.time) {
    throw new Error('データが見つかりませんでした');
  }

  return data.daily.time.map((date, i) => ({
    date,
    mean: data.daily.temperature_2m_mean[i],
    max: data.daily.temperature_2m_max[i],
    min: data.daily.temperature_2m_min[i],
  }));
}

export function getDateRange() {
  const end = new Date();
  end.setDate(end.getDate() - 1); // Yesterday
  const start = new Date(end);
  start.setFullYear(start.getFullYear() - 1);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

// Compute stats from temperature data
export function computeStats(temps) {
  if (!temps || temps.length === 0) return null;
  const means = temps.map(t => t.mean).filter(t => t != null);
  const min = Math.min(...means);
  const max = Math.max(...means);
  const avg = means.reduce((a, b) => a + b, 0) / means.length;
  return {
    days: temps.length,
    min: Math.round(min * 10) / 10,
    max: Math.round(max * 10) / 10,
    avg: Math.round(avg * 10) / 10,
    range: Math.round((max - min) * 10) / 10,
  };
}
