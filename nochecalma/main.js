// Electron main process for NocheCalma
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 480,
    height: 720,
    resizable: false,
    frame: false,
    transparent: false,
    backgroundColor: '#0a0a1a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadFile('src/index.html');
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
