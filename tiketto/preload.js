const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('tiketto', {
  getAll: () => ipcRenderer.invoke('tickets:getAll'),
  add: (ticket) => ipcRenderer.invoke('tickets:add', ticket),
  update: (ticket) => ipcRenderer.invoke('tickets:update', ticket),
  delete: (id) => ipcRenderer.invoke('tickets:delete', id),
  exportData: () => ipcRenderer.invoke('tickets:export'),
  importData: (json) => ipcRenderer.invoke('tickets:import', json),
});
