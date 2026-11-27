import { fileURLToPath } from 'node:url';
import viteReact from '@vitejs/plugin-react';
import { defaultClientConditions, defaultServerConditions } from 'vite';
import { defineConfig } from 'vitest/config';

// Library build: tree-shakable ESM with preserved module structure and one stylesheet,
// dist/styles.css. Peer and workspace dependencies stay external.
export default defineConfig({
  plugins: [viteReact()],
  resolve: { conditions: ['@negaresh/source', ...defaultClientConditions] },
  ssr: { resolve: { conditions: ['@negaresh/source', ...defaultServerConditions] } },
  css: { modules: { generateScopedName: 'nds-pat-[local]-[hash:base64:5]' } },
  build: {
    lib: {
      entry: {
        index: fileURLToPath(new URL('src/index.ts', import.meta.url)),
        'messages/fa': fileURLToPath(new URL('src/messages/fa.ts', import.meta.url)),
        'fixtures/index': fileURLToPath(new URL('src/fixtures/index.ts', import.meta.url)),
      },
      formats: ['es'],
      cssFileName: 'styles',
    },
    sourcemap: true,
    rolldownOptions: {
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^@negaresh\//],
      output: { preserveModules: true, preserveModulesRoot: 'src' },
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
  },
});
