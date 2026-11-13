import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defaultClientConditions, defaultServerConditions, defineConfig } from 'vite';

// `@negaresh/source` makes workspace packages resolve to their TypeScript sources,
// so the site shows every change without rebuilding the package (docs/03-architecture.md §8).
export default defineConfig({
  server: { port: 3000 },
  resolve: { conditions: ['@negaresh/source', ...defaultClientConditions] },
  ssr: { resolve: { conditions: ['@negaresh/source', ...defaultServerConditions] } },
  plugins: [
    tanstackStart(),
    // React's plugin must come after Start's.
    viteReact(),
  ],
});
