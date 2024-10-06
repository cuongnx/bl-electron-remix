#!/usr/bin/env node
/**
 * Reference:
 * https://github.com/cawa-93/vite-electron-builder/blob/main/scripts/watch.js
 */
import 'dotenv/config';
import { build, createServer, ViteDevServer, LogLevel } from 'vite';
import electronPath from 'electron';
import { ChildProcess, spawn } from 'child_process';
import express from 'express';
import { createRequestHandler } from '@remix-run/express';
import { ServerBuild } from '@remix-run/node';

type EnvType = 'production' | 'development' | 'test';
const mode: EnvType = process.env.NODE_ENV || 'development';

const logLevel: LogLevel = 'warn';

/**
 * Setup watcher for `main` package
 * On file changed it totally re-launch electron app.
 * @param {import('vite').ViteDevServer} watchServer Renderer watch server instance.
 * Needs to set up `VITE_DEV_SERVER_URL` environment variable from {@link import('vite').ViteDevServer.resolvedUrls}
 */
function setupMainWatcher({ resolvedUrls }: ViteDevServer) {
  let electronApp: ChildProcess | null = null;
  process.env.VITE_DEV_SERVER_URL = resolvedUrls ? resolvedUrls.local[0] : '';

  return build({
    mode,
    logLevel,
    configFile: 'src/main/vite.config.js',
    build: {
      /**
       * Set to {} to enable rollup watcher
       * @see https://vitejs.dev/config/build-options.html#build-watch
       */
      watch: {},
    },
    plugins: [
      {
        name: 'reload-app-on-main-package-change',
        writeBundle() {
          /** Kill electron if process already exist */
          if (electronApp !== null) {
            electronApp.removeListener('exit', process.exit);
            electronApp.kill('SIGINT');
            electronApp = null;
          }

          /** Spawn new electron process */
          electronApp = spawn(String(electronPath), ['--inspect', '.'], {
            stdio: 'inherit',
          });

          /** Stops the watch script when the application has been quit */
          electronApp.addListener('exit', process.exit);
        },
      },
    ],
  });
}

/**
 * Dev server for Renderer package
 * This must be the first,
 * because the {@link setupMainPackageWatcher} and {@link setupPreloadPackageWatcher}
 * depend on the dev server properties
 */
async function setupRendererWatcher(): Promise<ViteDevServer> {
  const app = express();
  const viteDevServer = await createServer({
    root: '.',
    configFile: 'src/renderer/vite.config.ts',
    server: { middlewareMode: true },
  });
  app.use(viteDevServer.middlewares);

  const ssrModule = await viteDevServer.ssrLoadModule(
    'virtual:remix/server-build',
  );
  const serverBuild = ssrModule as unknown as ServerBuild;

  app.all('*', createRequestHandler({ build: serverBuild }));

  const port = process.env.PORT || process.env.DEV_PORT;
  app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
  });

  return viteDevServer;
}

/**
 * And now let's start the dev server
 */
const rendererWatcher = await setupRendererWatcher();
await setupMainWatcher(rendererWatcher);
