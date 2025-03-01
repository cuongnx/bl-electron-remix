import { join } from 'node:path';

const PACKAGE_ROOT = __dirname;
const PROJECT_ROOT = join(PACKAGE_ROOT, '../..');
const PRELOAD_BUILD_DIR = join(PROJECT_ROOT, 'build', 'preload');

const config: import('vite').UserConfig = {
  mode: process.env.NODE_ENV,
  root: PACKAGE_ROOT,
  envDir: PROJECT_ROOT,
  resolve: {
    alias: {
      '@/': join(PROJECT_ROOT, 'src') + '/',
    },
  },
  build: {
    ssr: true,
    sourcemap: 'inline',
    outDir: PRELOAD_BUILD_DIR,
    assetsDir: '.',
    minify: process.env.NODE_ENV !== 'development',
    lib: {
      entry: 'preload.ts',
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].mjs',
      },
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
};

export default config;
