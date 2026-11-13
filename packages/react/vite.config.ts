import { fileURLToPath } from 'node:url';
import viteReact from '@vitejs/plugin-react';
import { defaultClientConditions } from 'vite';
import { defineConfig } from 'vitest/config';

// Library build: ES modules with preserved module structure (tree-shakable) and one
// stylesheet, dist/styles.css. Dependencies stay external.
export default defineConfig({
  plugins: [viteReact()],
  resolve: { conditions: ['@negaresh/source', ...defaultClientConditions] },
  css: { modules: { generateScopedName: 'nds-[local]-[hash:base64:5]' } },
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
        /^react-aria-components($|\/)/,
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
