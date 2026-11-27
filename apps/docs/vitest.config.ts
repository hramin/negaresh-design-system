import viteReact from '@vitejs/plugin-react';
import { defaultClientConditions, defaultServerConditions } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [viteReact()],
  resolve: { conditions: ['@negaresh/source', ...defaultClientConditions] },
  ssr: {
    resolve: { conditions: ['@negaresh/source', ...defaultServerConditions] },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts'],
    testTimeout: 30_000,
  },
});
