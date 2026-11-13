# NDS site

TanStack Start app: documentation, playground and visual-test target. See `docs/docs-site.md`. Built from P1 onward.

## Commands

| Command | |
| --- | --- |
| `pnpm dev` (repo root) | Dev server on http://localhost:3000; workspace packages resolve to their sources (`@negaresh/source` condition) |
| `pnpm build` / `pnpm --filter @negaresh/docs start` | Production build and Node server (srvx) |
| `pnpm test:e2e` | Playwright: SSR + RTL + theme smoke, axe on every route (light/dark, 1440/390), no-JS render, 404 |
| `SCREENSHOTS=1 pnpm test:e2e` | Also writes review screenshots to `apps/docs/screenshots/` |

Every route accepts `?theme=light|dark` (overrides the `nds-theme` cookie) for reproducible tests. Set `PW_CHROMIUM_PATH` to use a preinstalled Chromium instead of `playwright install`.
