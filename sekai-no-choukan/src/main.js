// Electron main process. Keep this thin — pure helpers live in src/layout.js
// and src/headlines.js so they can be tested without an Electron runtime.

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");

const {
  HEADLINES, REGION_JP, CATEGORY_JP,
} = require("./headlines.js");
const {
  layoutGrid, formatHeaderDate,
} = require("./layout.js");


function createWindow() {
  const win = new BrowserWindow({
    width: 880,
    height: 720,
    minWidth: 720,
    minHeight: 560,
    title: "世界の朝刊",
    backgroundColor: "#faf6ee",
    vibrancy: "under-window",        // macOS only — fully ignored elsewhere
    visualEffectState: "active",
    titleBarStyle: "hiddenInset",    // macOS — keep traffic-light buttons only
    titleBarOverlay: false,
    frame: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.once("ready-to-show", () => win.show());
  win.loadFile(path.join(__dirname, "..", "renderer", "index.html"));
  return win;
}


function payloadForDate(dateLike) {
  const date = dateLike instanceof Date ? dateLike : new Date(dateLike);
  const { lead, columns } = layoutGrid(date);
  return {
    header: formatHeaderDate(date),
    isoDate: date.toISOString().slice(0, 10),
    lead,
    columns,
    legend: { region: REGION_JP, category: CATEGORY_JP },
  };
}


function registerIpc() {
  ipcMain.handle("paper:today", () => payloadForDate(new Date()));
  ipcMain.handle("paper:forDate", (_evt, iso) => payloadForDate(iso));
}


if (require.main === module) {
  app.whenReady().then(() => {
    registerIpc();
    createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
}


// Exported for tests — these helpers are pure.
module.exports = { payloadForDate };
