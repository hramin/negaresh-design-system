# 01 · Decisions

Numbering continues the Ravanma decision log. D-01 … D-76 come from `RAVANMA_ACTIVE_DECISIONS.md` and `RAVANMA_HANDOFF_2.md`; only those still binding for NDS are listed. New decisions start at D-77. Format: decision → consequence.

## Inherited and still binding

| # | Decision | Consequence for NDS |
| --- | --- | --- |
| D-19, D-33, D-61 | One typeface across products; target Abar Pro; Vazirmatn (OFL) until it is licensed | Typeface is one token (`font.family.sans`). Abar Pro must pass: tabular figures for Persian and Latin digits, legibility at 12–14 px, Enterprise licence covering SSR, PDF and desktop |
| D-24 | Painted art is separate from measurable UI; icons are SVG on a fixed grid with tokenised stroke | `@negaresh/icons`; no icon or text cut from paintings |
| D-26 | Prices in Toman only; backend converts for gateways | Components never convert units. Registry PRD's "rials" is display-overridden to Toman |
| D-28 | Backend is FastAPI + PostgreSQL; the only frontend/backend boundary is OpenAPI | NDS has no backend dependency |
| D-29 | One fast, modern frontend stack for all products | See `04-stack.md` |
| D-30 | Only Ravanma is bilingual (fa/en); the three company products are Persian RTL only | NDS supports LTR, tested on Ravanma later |
| D-31, D-32 | One shared theme for the three company products; previous colours, fonts and stacks (green #00a379, IRANSansX, HTMX, Next.js) are not a reference | Company theme defined here |
| D-37, D-14 | Brand identity is a separate stage; Core only defines the logo slot | `LogoSlot` component with sizes and clear space |
| D-41 | WCAG 2.2 AA for all products | See `foundations/accessibility.md` |
| D-51, D-62 | Current product documents win over older design artefacts | PRDs are the requirement source |
| D-74, D-76 | UI is built in code; image models make art only. NDS is extracted from a real page | Reference-page-first workflow |

## Superseded by NDS decisions

D-05 (light only) → D-82. Phase-1 cold theme (D-07, D-08, D-42–D-49) → not used; phase-1 behaviour and accessibility rules are kept.

## NDS decisions

| # | Decision | Consequence |
| --- | --- | --- |
| D-77 | No illumination, frames, corner pieces, cartouches, shamseh or diamond markers in Core or the company theme. Surfaces separate by tone, spacing and one hairline | Ornament can only live in `@negaresh/brand-ravanma` |
| D-78 | Accent is the deep teal; it may later move toward the current logo green when the logo is redrawn, but is never replaced by an unrelated hue | Accent is one ramp; adjusting it is a token change |
| D-79 | First reference page: Registry activation | `reference/registry-activation` |
| D-80, D-84 | Core is React only, on React Aria Components. All four products are (re)built on the new stack | No CSS-only/HTMX layer. Keycloak login via Keycloakify |
| D-81 | Interim typeface Vazirmatn | See D-19 |
| D-82 | Company theme ships light **and** dark in v1; dark is a calm, low-glare blue-green slate ("ink") suited to psychology and business use — no black, no brown | Every semantic token has two values; every snapshot runs in both |
| D-83 | The test platform first moves from the monolith to the new frontend stack, then adopts NDS. No work on the current Jinja templates for NDS | Assessment kit targets the React client against the existing `/api/v1` JSON twins |
| D-85 | Company palette: warm "sand" neutrals for light, calm "ink" blue-green slate for dark, deep teal accent (#1D6B66, approved on the first reference; plum was tried and rejected); status colours sage/ochre/rose/slate, kept clearly apart from the accent | `foundations/color.md` |
| D-86 | Display digits Persian; codes (serial, system code, activation code, order number, phone input) in Latin digits, LTR | `<Ltr>`, `<Code>` primitives; `@negaresh/utils` |
| D-87 | The NDS site replaces Storybook: one TanStack Start app is documentation, playground and visual-test target | `docs-site.md` |
| D-88 | Name: **Negaresh Design System (NDS)**, Persian «دیزاین سیستم نگرش». Package scope `@negaresh/*`, CSS prefix `--nds-` | — |
| D-89 | Repository on GitHub; work happens in Claude Code (web) phase by phase, using Context7 for library docs | `CLAUDE.md` |
| D-90 | Breakpoint for mobile composition: below 900 px (inherits v3's 899 px) | `foundations/layout.md` |
| D-91 | CSS variable names follow the approved reference page: `--nds-text-*` (font sizes, in rem), `--nds-leading-*`, `--nds-weight-*`, `--nds-font-*`, `--nds-dur-*`, `--nds-ease[-enter\|-exit]`, `--nds-control-*`, `--nds-touch`, `--nds-topbar`, `--nds-border-width-*` (widths; `--nds-border-*` stays colour), component defaults `--nds-{component}-{property}` written as `var()` of the primitive (P1) | The mapping lives in `packages/tokens/src/naming.ts`; a test keeps the output equal to `reference/registry-activation` |
| D-92 | Primitive colour ramps are not emitted as CSS variables; only semantic roles are (P1) | Components cannot reach a primitive by accident. The docs site reads ramp values from `tokens.json` |
| D-93 | TypeScript 6.0 for now, not 7.0 (P1) | TS 7 (native) is stable but tooling that needs the compiler API (props tables from TS, P7) has to be checked first. Revisit before P7 |
| D-94 | Components render no literal strings: the few they need («پرش به محتوا»، «کپی شد»، «(در زبانهٔ تازه باز می‌شود)»…) come from a typed catalogue (`NdsMessages`) passed to `ThemeProvider`; `faMessages` ships in `@negaresh/react/messages/fa` (P2) | Apps pass `faMessages` or build the catalogue from Paraglide. Adding a string means adding it to `NdsMessages` |
| D-95 | Icon set: the 12 glyphs drawn for the reference page plus a Lucide subset (ISC, `lucide-static` 1.72.0) as plain data (`IconDefinition`), rendered by `Icon` in `@negaresh/react`; directional icons get logical names (`chevronEnd`, `arrowStart`) and flip in RTL (P2) | No React in `@negaresh/icons`, so charts and the login theme can reuse it; `scripts/import-lucide.ts` regenerates it; licence in `packages/icons/LICENSE` |
| D-96 | Visual-snapshot baselines are produced in, and CI's e2e job runs in, `mcr.microsoft.com/playwright:v1.65.0-noble` (P2) | Same fonts and rasterisation everywhere; update baselines with `pnpm --filter @negaresh/docs test:visual --update-snapshots` inside that image |
| D-97 | React Aria internal screen-reader strings are localised to Persian (`fa-IR`) via a complete 23-package dictionary (`faReactAriaStrings`) installed by `ThemeProvider` on Persian client sessions and injectable before hydration via `<ReactAriaLocalizationScript />` (P2 follow-up) | Zero new dependencies; covers every package key in `react-aria-components@1.22.1` so `LocalizedStringDictionary.getGlobalDictionaryForPackage` never throws for later P3–P4 components; non-Persian locales (e.g. Ravanma `en-US`) are left untouched |

## Open

| # | Question | Default until answered |
| --- | --- | --- |
| Q-01 | Abar Pro licence and files | Vazirmatn |
| Q-02 | New logos for Negaresh, Registry, Test platform | `LogoSlot` placeholder |
| Q-03 | Who sees an adolescent's result (teen, parent, clinician)? (Test platform brief) | Ship both views: professional and calm |
| Q-04 | Block editor (Tiptap, Editor.js, Lexical) — Negaresh PRD phase 1 | NDS renders blocks; the editor UI is a later pattern. Proposal: Tiptap (headless, React, structured JSON) |
| Q-05 | Product reviews and ratings on the shop | Rating component specified but not built |
| Q-06 | Comments on blog items | Not built |
| Q-07 | Package registry for `@negaresh/*`: GitHub Packages or self-hosted Verdaccio (P1 scope) | Nothing is published yet (all packages `private`). GitHub Packages if product builds run on GitHub Actions; Verdaccio if they run on-prem without reliable access to GitHub |
