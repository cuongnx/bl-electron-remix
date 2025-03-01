import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  route: (path: string) => ipcRenderer.send('route', path),
  onRoute: (
    callback: (event: Electron.IpcRendererEvent, path: string) => void,
  ) => {
    ipcRenderer.on('route', callback);
  },
});
