import { app } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';

const appServe = app.isPackaged ? serve({ directory: '../../build' }) : null;

app.setPath('userData', `${app.getPath('userData')} (development)`);
app.setPath('sessionData', `${app.getPath('userData')} (development)`);

void (async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    icon: '../resources/icon.png',
  });
  mainWindow.setMenu(null);

  if (app.isPackaged && appServe) {
    await appServe(mainWindow);
    mainWindow.loadURL('app://-');
  } else {
    await mainWindow.loadURL(`http://localhost:8888`);
    mainWindow.webContents.openDevTools();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mainWindow.webContents.on('did-fail-load', (e, code, desc) => {
      mainWindow.webContents.reloadIgnoringCache();
    });
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});
