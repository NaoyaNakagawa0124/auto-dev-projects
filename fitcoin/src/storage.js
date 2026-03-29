/**
 * FitCoin — JSON file persistence.
 * Stores data in ~/.fitcoin/data.json (or custom path for testing).
 */

const fs = require('fs');
const path = require('path');
const { createPortfolio } = require('./portfolio');

const DEFAULT_DIR = path.join(process.env.HOME || process.env.USERPROFILE || '.', '.fitcoin');
const DEFAULT_FILE = 'data.json';

function getDataPath(customDir) {
  const dir = customDir || DEFAULT_DIR;
  return path.join(dir, DEFAULT_FILE);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function load(customDir) {
  const filePath = getDataPath(customDir);
  if (!fs.existsSync(filePath)) {
    return createPortfolio();
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return createPortfolio();
  }
}

function save(portfolio, customDir) {
  const dir = customDir || DEFAULT_DIR;
  ensureDir(dir);
  const filePath = getDataPath(customDir);
  fs.writeFileSync(filePath, JSON.stringify(portfolio, null, 2), 'utf-8');
}

module.exports = { load, save, getDataPath, DEFAULT_DIR };
