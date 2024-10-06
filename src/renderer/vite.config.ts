import { join } from 'node:path';
import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import esbuild from 'esbuild';

const PACKAGE_ROOT = __dirname;
const PROJECT_ROOT = join(PACKAGE_ROOT, '../..');
const BUILD_DIR = join(PROJECT_ROOT, 'build', 'renderer');

export default defineConfig({
  mode: process.env.NODE_ENV,
  root: PACKAGE_ROOT,
  envDir: PROJECT_ROOT,
  resolve: {
    alias: {
      '/@/': join(PACKAGE_ROOT, 'src') + '/',
    },
  },
  build: {
    sourcemap: 'inline',
    target: 'modules',
    outDir: BUILD_DIR,
    assetsDir: '.',
    minify: process.env.NODE_ENV !== 'development',
    rollupOptions: {},
    emptyOutDir: true,
    reportCompressedSize: false,
  },
  plugins: [
    remix({
      appDirectory: 'src/renderer',
      serverModuleFormat: 'esm',
      buildDirectory: 'build',
      serverBuildFile: 'remix.js',
      buildEnd: async () => {
        await esbuild
          .build({
            alias: { '~': './src/renderer' },
            outfile: 'build/server/index.js',
            entryPoints: ['server.ts'],
            external: ['./build/server/*'],
            platform: 'node',
            format: 'esm',
            packages: 'external',
            bundle: true,
            logLevel: 'info',
          })
          .catch((error: unknown) => {
            console.error('Error building server:', error);
            process.exit(1);
          });
      },
    }),
  ],
});
