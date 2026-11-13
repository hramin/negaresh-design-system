# 03 · Architecture

## 1. Monorepo

pnpm workspaces + Turborepo. Every package is ESM, TypeScript strict, side-effect-free except CSS imports, and SSR-safe.

```
negaresh-design-system/
├─ tokens/                         DTCG source (*.tokens.json)
│  ├─ primitive/                   color, typography, space, shape, size, motion, z
│  ├─ semantic/                    color.light, color.dark (aliases to primitives)
│  └─ themes/                      company, ravanma (component defaults, overrides)
├─ packages/
│  ├─ tokens/        build: Style Dictionary v5 → dist/{company,ravanma}.css, tokens.ts, tokens.d.ts
│  ├─ utils/         jalali, digits, money, phone, serial, plural, mask — pure TS, no React
│  ├─ icons/         SVG sources → React components; `mirrored` flag for RTL
│  ├─ react/         Core components
│  ├─ charts/        SVG charts
│  ├─ assessment/    Assessment kit
│  ├─ patterns/      Product patterns
│  ├─ theme-company/ re-exports tokens css + font-face + base layer
│  ├─ theme-ravanma/ placeholder
│  ├─ brand-ravanma/ placeholder (art, illumination; only depends on theme-ravanma)
│  └─ keycloak-theme/ Keycloakify login theme using @negaresh/react
├─ apps/docs/        TanStack Start site
└─ reference/        static reference pages + screenshots
```

Dependency direction (no cycles, enforced by lint rule):

```
utils ─┐
tokens ┼─▶ react ─▶ charts ─▶ assessment
icons ─┘        └─▶ patterns
theme-* ─▶ tokens
keycloak-theme ─▶ react, theme-company
apps/docs ─▶ everything
```

## 2. Tokens

**Tiers.** Primitive (raw ramps: `color.sand.50`) → Semantic (role: `color.bg.surface`, per mode) → Component defaults in the theme (`component.button.radius`). Components read semantic and component tokens only.

**Format.** DTCG 2025.10 (`$value`, `$type`, `$description`; colours as `{colorSpace, components, hex}` objects; dimensions as `{value, unit}`). Files end in `.tokens.json`.

**Build.** Style Dictionary v5 reads DTCG directly. Outputs per theme:

| Output | Use |
| --- | --- |
| `dist/<theme>.css` | `:root,[data-theme=light]{…}` and `[data-theme=dark]{…}` plus `@media (prefers-color-scheme: dark) :root:not([data-theme])` |
| `dist/tokens.ts` | Typed values for charts and JS (`tokens.color.viz[1]` → `var(--nds-viz-1)` reference, not hex, so themes still switch) |
| `dist/tokens.json` | Flat list for the docs site token pages |
| `dist/contrast.md` | Contrast report (CI fails on any pair below its minimum) |

**Naming.** `--nds-{group}-{role}[-{state}]`, e.g. `--nds-bg-surface`, `--nds-fg-muted`, `--nds-accent-hover`, `--nds-success-border`, `--nds-viz-3`, `--nds-space-4`, `--nds-radius-md`.

**Modes.** Light and dark are values of the same semantic names. Theme selection is `data-theme` on `<html>`; default follows the OS; the user's choice is stored in a cookie so SSR renders the right mode without a flash.

**Theme swap.** A brand redesign edits `tokens/primitive/color.tokens.json` (accent ramp) and `tokens/themes/company.tokens.json`. Nothing in `packages/react` changes.

## 3. Components

- Built on **React Aria Components** (RAC). RAC supplies behaviour, focus, keyboard, ARIA, RTL-aware collections and i18n; NDS supplies styling and a smaller, opinionated API.
- Styling: **CSS Modules** inside cascade layers `nds.reset, nds.foundation, nds.components, nds.patterns, nds.utilities`. States via RAC data attributes. Container queries for components that live in different widths (cards, tables, result blocks).
- No runtime CSS-in-JS. No Tailwind in packages (apps may use it on top, mapping to `--nds-*`).
- Every component: SSR-safe, `forwardRef`, `className` on root only, `data-nds="Button"` attribute for testing.
- Icons: `@negaresh/icons`, 24-px grid, 1.6 stroke (token), `currentColor`, `aria-hidden` unless labelled; `mirrored` icons flip with `:dir(rtl)`.

## 4. Layout primitives

`Stack`, `Inline`, `Grid`, `Container`, `Surface`, `Section`, `Divider`, `Ltr`, `VisuallyHidden`. Products compose pages from these instead of writing layout CSS.

## 5. Charts

SVG rendered on the server with `d3-scale` and `d3-shape` (math only, no d3 DOM). Colours from `--nds-viz-*`. Each chart ships: an accessible name and description, a data table alternative (visually hidden or toggled), keyboard-focusable points where interactive, print styles. No canvas.

## 6. Assessment kit

Consumes the test platform's generic result shape (profile, type, index or themes; items with value, band, severity; interpretation blocks by section; chart spec). One set of components renders web view, calm view and A4 print.

## 7. Login theme

`@negaresh/keycloak-theme` uses Keycloakify (Vite) to compile React pages into a Keycloak theme jar. Pages: login (phone), OTP, password, forgot password, verify mobile, 2FA setup, error, info. Same tokens and fonts; RTL; Persian messages.

## 8. Docs site

TanStack Start app in `apps/docs`. It imports packages from the workspace (not from npm) so every change is visible immediately. See `docs-site.md`.

## 9. Distribution

Changesets for versions and changelogs. Publishing target: GitHub Packages (private) or a self-hosted registry (Verdaccio) next to the products' on-prem stack — to be chosen in P1. The docs site deploys as a Node container behind nginx (on-prem, no external CDN, per handoff §8).
