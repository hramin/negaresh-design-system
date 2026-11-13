# 04 · Stack — choices, capabilities and limits

Checked on **13 Nov 2026** by web search. Exact versions are pinned in P1 after a Context7 lookup; record them in the table at the end.

## Status of the main tools (Nov 2026)

| Tool | Status | Why it matters |
| --- | --- | --- |
| TanStack Start | 1.0 stable since 13 Oct 2026; `@tanstack/react-start` 1.169 is the first stable release and targets Vite 8. RC-era APIs (e.g. `.inputValidator()`) were removed. A security fix (CVE-2026-102989, server functions) shipped around the 1.0 release | Use only post-1.0 docs; RC tutorials are wrong. Pin Start and Router together |
| React Aria Components | ≥ 1.20 (react-aria 3.51, Aug 2026). Since 1.17, hooks are consolidated into `react-aria` and `react-stately` monopackages | Import from monopackages; the `render` prop allows DOM customisation |
| Style Dictionary | v5, reads DTCG 2025.10 natively | Tokens stay DTCG; no custom parser |
| DTCG format | 2025.10 stable revision | Colour values are objects (`colorSpace`, `components`, `hex`) |
| Paraglide JS | 2.x; TanStack runs it in Router/Start e2e tests | Compile-time messages; tree-shaken; SSR middleware |
| Keycloakify | Vite-based; React login themes | Verify Keycloak server version compatibility in P6 |

## Choices

| Layer | Choice | Strengths | Limits and how we handle them |
| --- | --- | --- | --- |
| Framework (docs site and product apps) | React 19 + TanStack Start, TypeScript strict | Full-document SSR, streaming, server functions, typed routes and search params, Vite plugin ecosystem | Younger than Next.js: fewer ready recipes. React Server Components arrive as a 1.x addition — do not depend on them. Image optimisation is not built in (use sharp/imgproxy). If a blocker appears, product apps can switch to Next.js without touching NDS packages (they are framework-agnostic React) |
| Monorepo | pnpm + Turborepo | Fast installs, task caching, strict deps | Keep `workspace:*` versions; avoid hoisting surprises with `node-linker=isolated` defaults |
| Tokens | DTCG + Style Dictionary v5 | Standard format, multi-output, aliases preserved as `var()` | Custom transforms needed for Persian font stacks and `light-dark` mode blocks — small, keep in `packages/tokens/sd.config.ts` |
| Styling | CSS Modules, cascade layers, logical properties, container queries, `:has()`, `color-mix()` | Zero runtime, SSR-friendly, RTL from one stylesheet | Browser floor: last 2 versions of Chrome, Edge, Firefox, Safari ≥ 16.4 (for `:has`, container queries, `color-mix`). Old Android WebViews in Iran: verify with real devices in P8 |
| Components | React Aria Components | Best-in-class a11y, keyboard, RTL, i18n (incl. Persian calendar via `@internationalized/date`) | Larger JS than headless-light libs: import per component; measure in bundle budget. Toast and some newer components may be marked beta — check status per component |
| Dates | `@internationalized/date` (Persian calendar) + `Intl.DateTimeFormat('fa-IR-u-ca-persian')` | Native Jalali with no extra lib; RAC DatePicker supports custom calendars | Iran dropped daylight saving after 2022 — always format with `timeZone: 'Asia/Tehran'`, never the browser zone |
| Numbers / money | `Intl.NumberFormat('fa-IR')` | Persian digits and separators | Toman is not an ISO currency: format the number and append «تومان» via utils, never `style:'currency'` |
| Charts | SVG + d3-scale/d3-shape | Full visual control, SSR, print | We build interaction ourselves (tooltips with RAC `Tooltip`/`Focusable`) |
| Motion | CSS transitions, View Transitions API, scroll-snap, Web Animations | No library; respects reduced motion | View Transitions cross-document support varies; treat as enhancement |
| Forms (apps) | TanStack Form + Zod | Typed, headless | NDS field components accept `isInvalid`/`errorMessage` props; adapters live in apps or `patterns` |
| Data (apps) | OpenAPI-generated client + TanStack Query | Typed contract (D-28) | Not part of NDS |
| i18n | Paraglide 2 + Intl | Typed messages, tiny bundles | Persian only in v1; Ravanma adds English later |
| Login theme | Keycloakify | Keycloak pages from React components | Separate Vite build output (theme jar); test against the realm's Keycloak version |
| Images | sharp at build, imgproxy at runtime, AVIF/WebP | Small, responsive | Not inside NDS; `Image` component only sets sizes, ratio and lazy loading |
| Quality | Vitest, Testing Library, Playwright (visual + axe), Lighthouse CI budgets | One toolchain | Visual snapshots must run in a fixed Docker image with fonts installed to be stable |
| Deploy | Node container, nginx, on-prem | Matches company infra | No external CDN; self-host fonts |

## Fonts

Vazirmatn variable (OFL), self-hosted woff2, `font-display: swap`, subset to Arabic + Basic Latin + punctuation. Monospace for codes uses the system stack. Abar Pro replaces the `font.family.sans` token after the D-19 checks.

## Browser support

Evergreen browsers, last two versions; Safari 16.4+. Graceful degradation: without `:has()` the choice cards still work (native radio visible state), without container queries components fall back to their narrow layout.

## Pinned versions (fill in P1)

| Package | Version | Checked via | Date | Note |
| --- | --- | --- | --- | --- |
| react / react-dom | | Context7 | | |
| @tanstack/react-start / react-router | | | | pin together |
| react-aria-components / react-aria / react-stately | | | | |
| @internationalized/date | | | | |
| style-dictionary | | | | |
| vite / vitest / @playwright/test / axe-core | | | | |
| d3-scale / d3-shape | | | | |
| @inlang/paraglide-js | | | | |
| keycloakify | | | | |
| turbo / pnpm / @changesets/cli / typescript | | | | |
