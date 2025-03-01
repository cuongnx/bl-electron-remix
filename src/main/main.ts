import { join } from 'node:path';
import { app } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import createMenus from './helpers/createMenus';

const RENDERER_BUILD_DIR = join(
  app.getAppPath(),
  'build',
  'renderer',
  'client',
);
const PRELOAD_BUILD_DIR = join(app.getAppPath(), 'build', 'preload');

const appServe = serve({ directory: RENDERER_BUILD_DIR });

app.setPath('userData', `${app.getPath('userData')} (development)`);
app.setPath('sessionData', `${app.getPath('userData')} (development)`);

void (async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    icon: '../../resources/icon.png',
    webPreferences: {
      preload: join(PRELOAD_BUILD_DIR, 'preload.mjs'),
    },
  });
  createMenus(app, mainWindow);

  if (app.isPackaged && appServe) {
    await appServe(mainWindow);
  } else {
    const port = process.env.PORT || process.env.DEV_PORT;
    const localUrl =
      process.env.VITE_DEV_SERVER_URL || `http://localhost:${port}`;
    await mainWindow.loadURL(localUrl);
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
