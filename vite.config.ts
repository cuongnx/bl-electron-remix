import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import esbuild from 'esbuild';

export default defineConfig({
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
