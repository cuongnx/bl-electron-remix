import { join } from 'node:path';
import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import esbuild from 'esbuild';

const PACKAGE_ROOT = __dirname;
const PROJECT_ROOT = join(PACKAGE_ROOT, '../..');
const RENDERER_BUILD_DIR = join(PROJECT_ROOT, 'build', 'renderer');

export default defineConfig({
  mode: process.env.NODE_ENV,
  root: PACKAGE_ROOT,
  envDir: PROJECT_ROOT,
  resolve: {
    alias: {
      '@/': join(PROJECT_ROOT, 'src') + '/',
    },
  },
  build: {
    sourcemap: process.env.NODE_ENV === 'production' ? false : 'inline',
    target: 'modules',
    outDir: RENDERER_BUILD_DIR,
    assetsDir: '.',
    minify: process.env.NODE_ENV !== 'development',
    rollupOptions: {},
    emptyOutDir: true,
    reportCompressedSize: false,
  },
  plugins: [
    remix({
      ssr: false,
      appDirectory: 'src/renderer',
      serverModuleFormat: 'esm',
      buildDirectory: RENDERER_BUILD_DIR,
      serverBuildFile: 'remix.js',
      buildEnd: async () => {
        await esbuild
          .build({
            alias: { '~': './src/renderer' },
            outfile: `${RENDERER_BUILD_DIR}/server/index.js`,
            entryPoints: ['server.prod.ts'],
            external: [`${RENDERER_BUILD_DIR}/server/*`],
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
