import { fileURLToPath } from 'node:url';
import viteReact from '@vitejs/plugin-react';
import { defaultClientConditions, defaultServerConditions } from 'vite';
import { defineConfig } from 'vitest/config';

// Library + Vitest configuration: exports SSR-safe auth screens, Persian message bundle,
// realistic fixtures, and one stylesheet (`dist/styles.css`) for `apps/docs` and unit/SSR tests.
export default defineConfig({
  plugins: [viteReact()],
  resolve: { conditions: ['@negaresh/source', ...defaultClientConditions] },
  ssr: { resolve: { conditions: ['@negaresh/source', ...defaultServerConditions] } },
  css: { modules: { generateScopedName: 'nds-kc-[local]-[hash:base64:5]' } },
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
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^@negaresh\//, /^keycloakify($|\/)/],
      output: { preserveModules: true, preserveModulesRoot: 'src' },
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
  },
});
