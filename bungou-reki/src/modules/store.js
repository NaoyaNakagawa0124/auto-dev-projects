// 永続化 — ブラウザでは localStorage、Tauri では Rust 側を将来呼ぶ
// （現状はどちらも localStorage を採用し、Rust 側は同形のJSONを扱える）

const SAVE_KEY = "bungou-reki/state/v1";

export class Store {
  constructor() {
    this.collection = [];
    this.xp = {};
    this.reading = [];
    this.battles = [];
    this.recruited_dates = [];
  }

  async load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      this.collection = Array.isArray(parsed.collection) ? parsed.collection : [];
      this.xp = (parsed.xp && typeof parsed.xp === "object") ? parsed.xp : {};
      this.reading = Array.isArray(parsed.reading) ? parsed.reading : [];
      this.battles = Array.isArray(parsed.battles) ? parsed.battles : [];
      this.recruited_dates = Array.isArray(parsed.recruited_dates) ? parsed.recruited_dates : [];
    } catch (e) {
      console.warn("ロードに失敗:", e);
    }
  }

  save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        collection: this.collection,
        xp: this.xp,
        reading: this.reading,
        battles: this.battles,
        recruited_dates: this.recruited_dates,
      }));
    } catch (e) {
      console.warn("保存に失敗:", e);
    }
  }

  hasRecruitedOn(date) {
    return this.recruited_dates.includes(date);
  }

  recruit(authorId, date) {
    if (this.hasRecruitedOn(date)) return false;
    if (!this.collection.includes(authorId)) this.collection.push(authorId);
    this.recruited_dates.push(date);
    return true;
  }

  addXp(authorId, amount) {
    this.xp[authorId] = (this.xp[authorId] ?? 0) + amount;
  }

  levelFor(authorId) {
    return 1 + Math.floor((this.xp[authorId] ?? 0) / 100);
  }

  logReading(authorId, title, pages, date) {
    const xp = Math.max(5, Math.floor(pages / 4));
    this.reading.push({ author_id: authorId, title, pages, date });
    this.addXp(authorId, xp);
    return xp;
  }

  logBattle(record) {
    this.battles.push(record);
  }
}
