import { fileURLToPath } from 'node:url';
import viteReact from '@vitejs/plugin-react';
import { defaultClientConditions } from 'vite';
import { defineConfig } from 'vitest/config';

// Library build: tree-shakable ESM with preserved module structure and one stylesheet,
// dist/styles.css. Peer and workspace dependencies stay external.
export default defineConfig({
  plugins: [viteReact()],
  resolve: { conditions: ['@negaresh/source', ...defaultClientConditions] },
  css: { modules: { generateScopedName: 'nds-chart-[local]-[hash:base64:5]' } },
  build: {
    lib: {
      entry: {
        index: fileURLToPath(new URL('src/index.ts', import.meta.url)),
        'messages/fa': fileURLToPath(new URL('src/messages/fa.ts', import.meta.url)),
      },
      formats: ['es'],
      cssFileName: 'styles',
    },
    sourcemap: true,
    rolldownOptions: {
      external: [
        /^react($|\/)/,
        /^react-dom($|\/)/,
        /^d3-scale($|\/)/,
        /^d3-shape($|\/)/,
        /^@negaresh\//,
      ],
      output: { preserveModules: true, preserveModulesRoot: 'src' },
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
  },
});
