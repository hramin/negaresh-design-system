# Negaresh Design System (NDS)

**دیزاین سیستم نگرش** — one design system for every Negaresh product:

| Product | Status | Theme |
| --- | --- | --- |
| Registry (`reg.` subdomain) | Rewrite, ships first | Company |
| Negaresh main site (shop, blog, courses, experts, account, admin) | New build | Company |
| Psychology Test Platform | Moves from the HTMX monolith to the new frontend stack, then adopts NDS | Company |
| Ravanma | Later; returns to this system with its own theme and art packages | Ravanma |

NDS is a React component library on React Aria, driven by DTCG design tokens, with a documentation site that is also the test bench. Persian and right-to-left first, light and dark from v1, WCAG 2.2 AA.

## Where to start

| You want to… | Read |
| --- | --- |
| Understand what NDS is and isn't | [docs/00-overview.md](docs/00-overview.md) |
| Know what has been decided and why | [docs/01-decisions.md](docs/01-decisions.md) |
| See which product needs which component | [docs/02-requirements.md](docs/02-requirements.md) |
| Understand packages, theming and the token pipeline | [docs/03-architecture.md](docs/03-architecture.md) |
| Know the stack, its versions, strengths and limits | [docs/04-stack.md](docs/04-stack.md) |
| Design or build with the foundations | [docs/foundations/](docs/foundations/) |
| Find a component and its states | [docs/components.md](docs/components.md) |
| Build a product screen | [docs/patterns.md](docs/patterns.md) |
| Work on the docs site | [docs/docs-site.md](docs/docs-site.md) |
| Know how work is tested and accepted | [docs/quality.md](docs/quality.md) |
| Pick up the next phase | [docs/phases/](docs/phases/) |
| See the approved visual reference | [reference/](reference/) |

## Repository layout

```
tokens/                 DTCG 2025.10 source (primitive → semantic → theme)
packages/
  tokens/               @negaresh/tokens       Style Dictionary build → CSS variables + TS
  icons/                @negaresh/icons        SVG icon set, RTL-aware
  react/                @negaresh/react        Core components (React Aria + CSS Modules)
  charts/               @negaresh/charts       Server-rendered SVG charts (d3-scale/d3-shape)
  assessment/           @negaresh/assessment   Assessment kit: questions, results, reports
  patterns/             @negaresh/patterns     Product patterns (commerce, content, licensing, admin)
  utils/                @negaresh/utils        Jalali dates, Persian digits, Toman, phone and serial normalisation
  theme-company/        @negaresh/theme-company
  theme-ravanma/        @negaresh/theme-ravanma   (placeholder)
  brand-ravanma/        @negaresh/brand-ravanma   (placeholder: art, illumination, painted leaves)
  keycloak-theme/       @negaresh/keycloak-theme  Keycloakify login theme shared by all products
apps/
  docs/                 The NDS site (TanStack Start): docs, playground, visual tests
reference/              Approved reference pages (static) and screenshots
docs/                   Everything written
```

## Working in this repo

The repo is built phase by phase with Claude Code. [CLAUDE.md](CLAUDE.md) holds the rules every session follows; each phase file in [docs/phases/](docs/phases/) has a scope and a "done when" list, and a phase is closed only after the owner approves it.
