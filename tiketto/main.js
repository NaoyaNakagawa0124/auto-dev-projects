const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('./store');

const store = new Store('tiketto-data');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: '🎫 tiketto — チケットコレクション',
    backgroundColor: '#0d1117',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ===== IPC Handlers =====

ipcMain.handle('tickets:getAll', () => {
  return store.get('tickets') || [];
});

ipcMain.handle('tickets:add', (_, ticket) => {
  const tickets = store.get('tickets') || [];
  ticket.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  ticket.createdAt = new Date().toISOString();
  tickets.push(ticket);
  store.set('tickets', tickets);
  return ticket;
});

ipcMain.handle('tickets:update', (_, updated) => {
  const tickets = store.get('tickets') || [];
  const idx = tickets.findIndex(t => t.id === updated.id);
  if (idx >= 0) {
    tickets[idx] = { ...tickets[idx], ...updated };
    store.set('tickets', tickets);
    return tickets[idx];
  }
  return null;
});

ipcMain.handle('tickets:delete', (_, id) => {
  const tickets = store.get('tickets') || [];
  const filtered = tickets.filter(t => t.id !== id);
  store.set('tickets', filtered);
  return true;
});

ipcMain.handle('tickets:export', () => {
  return JSON.stringify(store.get('tickets') || [], null, 2);
});

ipcMain.handle('tickets:import', (_, json) => {
  try {
    const tickets = JSON.parse(json);
    if (Array.isArray(tickets)) {
      store.set('tickets', tickets);
      return { success: true, count: tickets.length };
    }
    return { success: false, error: 'データ形式が不正です' };
  } catch {
    return { success: false, error: 'JSONの解析に失敗しました' };
  }
});
