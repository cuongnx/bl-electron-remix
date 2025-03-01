import { App, BrowserWindow, Menu, MenuItemConstructorOptions } from 'electron';

const createMenus = (app: App, mainWindow: BrowserWindow) => {
  const template: MenuItemConstructorOptions[] = [
    {
      label: 'Application',
      submenu: [
        {
          label: 'Exit',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Utilities',
      submenu: [
        {
          label: 'Test page',
          click: () => {
            mainWindow.webContents.send('route', '/test-page');
          },
        },
        { role: 'toggleDevTools' },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

export default createMenus;
