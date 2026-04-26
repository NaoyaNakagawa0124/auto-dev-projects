/**
 * Simple JSON file store for Electron
 */
const fs = require('fs');
const path = require('path');

class Store {
  constructor(name) {
    const userDataPath = process.env.TIKETTO_DATA_PATH ||
      (typeof require !== 'undefined' && require('electron')?.app?.getPath
        ? require('electron').app.getPath('userData')
        : path.join(require('os').homedir(), '.tiketto'));

    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true });
    }

    this.path = path.join(userDataPath, `${name}.json`);
    this.data = {};

    try {
      if (fs.existsSync(this.path)) {
        this.data = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
      }
    } catch {
      this.data = {};
    }
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
    fs.writeFileSync(this.path, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  delete(key) {
    delete this.data[key];
    fs.writeFileSync(this.path, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  getAll() {
    return { ...this.data };
  }
}

module.exports = Store;
