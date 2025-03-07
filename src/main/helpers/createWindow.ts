import {
  screen,
  BrowserWindow,
  BrowserWindowConstructorOptions,
} from 'electron';
import Store from 'electron-store';
import { Rectangle } from 'electron/renderer';

interface WindowState {
  x: number;
  y: number;
  width: number;
  height: number;
}

const createWindow = (
  windowName: string,
  options: BrowserWindowConstructorOptions,
): BrowserWindow => {
  const key = 'window-state';
  const name = `window-state-${windowName}`;
  const store = new Store({ name });
  const defaultSize = {
    width: options.width || 1000,
    height: options.height || 600,
  };
  let state = {};
  let win: BrowserWindow | null = null;

  const restore: () => WindowState = () =>
    store.get(key, defaultSize) as WindowState;

  const getCurrentPosition = () => {
    if (win) {
      const position = win.getPosition();
      const size = win.getSize();
      return {
        x: position[0],
        y: position[1],
        width: size[0],
        height: size[1],
      };
    }
  };

  const windowWithinBounds = (windowState: WindowState, bounds: Rectangle) => {
    return (
      windowState.x >= bounds.x &&
      windowState.y >= bounds.y &&
      windowState.x + windowState.width <= bounds.x + bounds.width &&
      windowState.y + windowState.height <= bounds.y + bounds.height
    );
  };

  const resetToDefaults = () => {
    const bounds = screen.getPrimaryDisplay().bounds;
    return Object.assign({}, defaultSize, {
      x: (bounds.width - defaultSize.width) / 2,
      y: (bounds.height - defaultSize.height) / 2,
    });
  };

  const ensureVisibleOnSomeDisplay = (windowState: WindowState) => {
    const visible = screen.getAllDisplays().some((display) => {
      return windowWithinBounds(windowState, display.bounds);
    });
    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetToDefaults();
    }
    return windowState;
  };

  const saveState = () => {
    if (win && !win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition());
    }
    store.set(key, state);
  };

  state = ensureVisibleOnSomeDisplay(restore());

  const browserOptions: BrowserWindowConstructorOptions = {
    ...options,
    ...state,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      ...options.webPreferences,
    },
  };
  win = new BrowserWindow(browserOptions);

  win.on('close', saveState);

  return win;
};

export default createWindow;
