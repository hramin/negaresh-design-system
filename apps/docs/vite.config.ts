import { execSync } from 'node:child_process';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defaultClientConditions, defaultServerConditions, defineConfig } from 'vite';

/** Build identity for the footer: Docker passes GIT_SHA/GIT_BRANCH; local builds ask git. */
function git(args: string): string | undefined {
  try {
    return (
      execSync(`git ${args}`, { stdio: ['ignore', 'pipe', 'ignore'] })
        .toString()
        .trim() || undefined
    );
  } catch {
    return undefined;
  }
}
const buildSha = (process.env.GIT_SHA || git('rev-parse HEAD') || 'unknown').slice(0, 7);
const buildBranch = process.env.GIT_BRANCH || git('rev-parse --abbrev-ref HEAD') || 'local';

// `@negaresh/source` makes workspace packages resolve to their TypeScript sources,
// so the site shows every change without rebuilding the package (docs/03-architecture.md §8).
export default defineConfig(({ command }) => ({
  server: { port: 3000 },
  define: {
    __NDS_BUILD__: JSON.stringify({ sha: buildSha, branch: buildBranch }),
  },
  resolve: { conditions: ['@negaresh/source', ...defaultClientConditions] },
  ssr: {
    resolve: { conditions: ['@negaresh/source', ...defaultServerConditions] },
    // Production: bundle every dependency into dist/server so the runtime image needs
    // only the build output (Dockerfile). Dev keeps Vite's default externals.
    ...(command === 'build' ? { noExternal: true } : {}),
  },
  plugins: [
    tanstackStart(),
    // React's plugin must come after Start's.
    viteReact(),
  ],
}));
