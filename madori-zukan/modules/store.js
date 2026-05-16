// 物件アーカイブの永続化
const KEY = "madori-zukan/state/v1";

export class Archive {
  constructor() {
    this.watched = new Set();
    this.favorites = new Set();
    this.visited_count = {};
  }

  load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      this.watched = new Set(Array.isArray(d.watched) ? d.watched : []);
      this.favorites = new Set(Array.isArray(d.favorites) ? d.favorites : []);
      this.visited_count = (d.visited_count && typeof d.visited_count === "object") ? d.visited_count : {};
    } catch (e) {
      console.warn("ロード失敗:", e);
    }
  }

  save() {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        watched: [...this.watched],
        favorites: [...this.favorites],
        visited_count: this.visited_count,
      }));
    } catch (e) {
      console.warn("保存失敗:", e);
    }
  }

  toggleWatched(id) {
    if (this.watched.has(id)) {
      this.watched.delete(id);
      return false;
    }
    this.watched.add(id);
    this.visited_count[id] = (this.visited_count[id] ?? 0) + 1;
    return true;
  }

  toggleFavorite(id) {
    if (this.favorites.has(id)) {
      this.favorites.delete(id);
      return false;
    }
    this.favorites.add(id);
    return true;
  }

  isWatched(id) { return this.watched.has(id); }
  isFavorite(id) { return this.favorites.has(id); }

  stats(homes) {
    const watched = homes.filter(h => this.isWatched(h.id));
    const fav = homes.filter(h => this.isFavorite(h.id));
    const totalSqm = watched.reduce((s, h) => s + (h.total_sqm ?? 0), 0);
    const eras = new Map();
    for (const h of watched) {
      const era = (h.tags ?? []).find(t => ["昭和", "平成", "大正", "令和"].includes(t)) ?? "その他";
      eras.set(era, (eras.get(era) ?? 0) + 1);
    }
    return {
      watched_count: watched.length,
      favorite_count: fav.length,
      total_sqm: totalSqm,
      eras: Object.fromEntries(eras),
      total_homes: homes.length,
    };
  }
}
