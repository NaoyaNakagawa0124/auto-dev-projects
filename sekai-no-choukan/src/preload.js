// Preload — runs in an isolated world with limited Node access. We expose a
// minimal, typed API to the renderer via contextBridge so the renderer itself
// stays free of Node/Electron globals.

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("choukan", {
  today: () => ipcRenderer.invoke("paper:today"),
  forDate: (iso) => ipcRenderer.invoke("paper:forDate", iso),
});
