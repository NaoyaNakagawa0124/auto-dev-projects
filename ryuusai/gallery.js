/**
 * Gallery Manager — Save, load, and manage artworks in localStorage
 */

class GalleryManager {
  constructor() {
    this.storageKey = 'ryuusai_gallery';
    this.maxItems = 50;
  }

  getAll() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  save(imageDataUrl, metadata = {}) {
    const items = this.getAll();
    const item = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      image: imageDataUrl,
      palette: metadata.palette || 'wabi',
      createdAt: new Date().toISOString(),
    };

    items.unshift(item);

    // Keep only max items
    if (items.length > this.maxItems) {
      items.length = this.maxItems;
    }

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
      return item;
    } catch (e) {
      // Storage full — remove oldest items and retry
      if (items.length > 5) {
        items.length = Math.floor(items.length / 2);
        try {
          localStorage.setItem(this.storageKey, JSON.stringify(items));
          return item;
        } catch {
          return null;
        }
      }
      return null;
    }
  }

  delete(id) {
    const items = this.getAll().filter(item => item.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  getCount() {
    return this.getAll().length;
  }

  formatDate(isoString) {
    const d = new Date(isoString);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
  }
}
