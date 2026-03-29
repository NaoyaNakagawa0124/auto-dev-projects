const { app, BrowserWindow } = require('electron');
function createWindow() {
  const win = new BrowserWindow({ width: 700, height: 900, backgroundColor: '#0a0a14' });
  win.loadFile('src/index.html');
}
app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
