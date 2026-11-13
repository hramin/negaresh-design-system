# CLAUDE.md — Negaresh Design System

Read this file fully at the start of every session. Then read the phase file you are working on in `docs/phases/`, and the docs it links to. Do not start a phase whose predecessor is not marked **Approved**.

## 1. What this repo is

A React design system (Core + company theme + Ravanma theme placeholder) and its documentation site, for four Persian products: Registry, Negaresh main site, Psychology Test Platform, Ravanma. Product apps live in their own repos and consume the published packages. See `docs/00-overview.md`.

## 2. Always look up library docs first (Context7)

Setup: the repo ships `.mcp.json` with the Context7 MCP server, so Claude Code loads it when the project opens (approve it once). If the owner's machine or session also allows npm, run `npx ctx7 setup --claude` once to install the Context7 CLI/skill as well. If Context7 tools are missing at session start, say so before writing any library code.

Before writing code against any third-party API — TanStack Start/Router/Query/Form, React Aria Components, Style Dictionary, Keycloakify, Paraglide, Vite, Vitest, Playwright, axe-core, d3, Zod, sharp — query **Context7** for the current docs of the exact version in `package.json`. Do not rely on memory: several of these changed in 2025–2026 (TanStack Start 1.0 removed RC APIs; React Aria consolidated into monopackages; Style Dictionary v5 uses DTCG 2025.10). If Context7 is unavailable, read the package's own docs/types in `node_modules` and say so in the PR.

When you add a dependency: pin an exact version, record it in `docs/04-stack.md` (table "Pinned versions"), and note anything surprising.

## 3. Non-negotiable rules

**Tokens**
- No raw colour, font, size, spacing, radius, shadow, duration or z-index values in components, charts, docs pages or app code. Use `var(--nds-*)` or the TS token export. The only exception is `tokens/` itself.
- Components consume **semantic** tokens (`--nds-bg-surface`, `--nds-fg-muted`, `--nds-accent-default` …), never primitives (`teal.600`).
- Every new semantic colour pair needs a contrast entry; `pnpm tokens:check` must pass (text 4.5:1, UI and graphics 3:1, both modes).

**Direction and locale**
- CSS logical properties only (`margin-inline-start`, `inset-inline-end`, `padding-block` …). Never `left`/`right` in CSS or inline styles. Directional icons mirror in RTL via the `mirrored` icon flag.
- Display digits in Persian; display dates in Jalali, Tehran time; money in Toman (D-26). Use `@negaresh/utils` — never format by hand.
- Codes are LTR islands in Latin digits: serials, system codes, activation codes, order numbers, phone input, URLs, emails. Wrap with the `<Ltr>` primitive.
- No hard-coded strings in components: every visible string comes from props or the Paraglide message catalogue.

**Accessibility (WCAG 2.2 AA, D-41)**
- Build interactive components on React Aria Components (or React Aria hooks). Do not hand-roll focus management, keyboard handling, or ARIA for anything RAC covers.
- Every component documents and implements: default, hover, focus-visible, active/pressed, disabled, loading, invalid, empty — where applicable.
- Minimum target 44×44 px. Visible focus ring on the element itself (`--nds-focus-ring`, 2px, offset 2px).
- Status and severity are never colour alone: always a word, plus an icon where space allows.
- Respect `prefers-reduced-motion` and `prefers-contrast`.

**Visual language (D-77, D-85)**
- Minimal and modern: surfaces are separated by tone, spacing and at most one hairline. No resting shadows, no decorative frames, no illumination, no ornament, no diamond markers. Shadows only on floating layers.
- Nothing from Ravanma's art language enters Core or the company theme; it lives in `@negaresh/brand-ravanma`.
- Mobile is its own composition (below 900px), not a squeezed desktop.

**Rendering**
- Every component must render on the server (SSR) without `window`/`document` access at import or render time.
- Charts render as SVG on the server and are readable with JavaScript disabled; interaction is progressive enhancement.
- Result and report components must render identically on screen and in the A4 PDF (print parity).

## 4. How to work a phase

1. Read the phase file; list open questions at the top of your first reply.
2. Work in small PRs (one component family or one page at a time).
3. For each component: tokens → CSS Module → React component → docs page with all states → unit tests → axe test → visual snapshot (light, dark, RTL desktop, mobile).
4. Update `docs/components.md` status column and the phase checklist.
5. At the end, produce screenshots of every new docs page (desktop 1440×900 and mobile 390×844, light and dark) and a short summary for the owner. Stop and wait for approval.

## 5. Commands (defined in P1)

```
pnpm i                      install
pnpm dev                    docs site at http://localhost:3000
pnpm build                  build all packages and the docs site
pnpm tokens                 build tokens (Style Dictionary)
pnpm tokens:check           validate DTCG + contrast report
pnpm test                   Vitest (unit + component)
pnpm test:e2e               Playwright: axe + visual snapshots on docs pages
pnpm lint / pnpm typecheck
```

## 6. Conventions

- TypeScript strict; no `any` in public APIs. Components are named exports; props documented with TSDoc.
- Public component API is ours, not React Aria's: wrap RAC, expose a small, stable prop set, forward `ref`, accept `className` only on the root.
- CSS Modules in cascade layers: `@layer nds.reset, nds.foundation, nds.components, nds.patterns, nds.utilities;` Apps put their own CSS after these layers.
- State styling uses RAC data attributes (`[data-hovered]`, `[data-focus-visible]`, `[data-pressed]`, `[data-invalid]`, `[data-disabled]`).
- File layout per component: `Button/Button.tsx`, `Button.module.css`, `Button.test.tsx`, `Button.docs.mdx` (or the docs-site route), `index.ts`.
- Commits: Conventional Commits. Versioning: Changesets.

## 7. Decisions and documents are the source of truth

Product PRDs win over older design artefacts (D-51, D-62). Decisions are in `docs/01-decisions.md`; if code and a decision disagree, stop and ask — do not silently change either. Record every new decision with the next free number.

## 8. Out of scope here

Product business logic, API clients, Keycloak realm config, backend. NDS ships UI, tokens, utilities for display and input formatting, and the shared login theme.
