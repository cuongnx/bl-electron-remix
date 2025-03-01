interface Window {
  electron: {
    route: (path: string) => void;
    onRoute: (
      callback: (event: Electron.IpcRendererEvent, path: string) => void,
    ) => void;
  };
}
