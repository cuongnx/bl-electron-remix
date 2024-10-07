import { join } from 'node:path';

const PACKAGE_ROOT = __dirname;
const PROJECT_ROOT = join(PACKAGE_ROOT, '../..');
const MAIN_BUILD_DIR = join(PROJECT_ROOT, 'build', 'main');

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
    target: 'modules',
    outDir: MAIN_BUILD_DIR,
    assetsDir: '.',
    minify: process.env.NODE_ENV !== 'development',
    lib: {
      entry: 'main.ts',
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
      },
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
};

export default config;
