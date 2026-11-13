# The NDS site (`apps/docs`)

One TanStack Start app is the documentation, the playground and the visual-test target (D-87). It renders packages straight from the workspace.

## Information architecture

```
/                         Overview: what NDS is, products, principles, latest changes
/start                    Using NDS in a product app (install, ThemeProvider, fonts, SSR theme cookie)
/foundations/color        Ramps, semantic roles, live light/dark swatches, contrast table
/foundations/typography   Scale specimen in Persian, line heights, Persian rules
/foundations/layout       Space, breakpoints, containers, templates, surfaces
/foundations/motion       Tokens with live demos (respect reduced motion)
/foundations/icons        Searchable icon grid, mirrored flag
/foundations/localization Digits, dates, money, phones, codes — with live formatters
/foundations/accessibility Checklist, testing guide
/foundations/content      Voice, examples
/foundations/data-viz     Palette, chart rules, severity scales
/tokens                   Full token table (from dist/tokens.json), copy CSS var / TS name
/components               Index with status and product chips
/components/<name>        Overview, live examples, every state, props table (from TS), a11y, RTL, do/don't, mobile
/charts/<name>
/assessment/<name>
/patterns/<name>          Composed, interactive examples with realistic Persian data
/products/registry        Screens per product, linking the patterns used
/products/negaresh
/products/test-platform
/products/ravanma         Placeholder until @negaresh/brand-ravanma exists
/playground               Theme (light/dark), density, viewport presets
/changelog                From Changesets
/decisions                Rendered docs/01-decisions.md
```

## Page anatomy (component page)

1. Title, one-line purpose, status, products using it.
2. Live example (desktop width) with a "mobile" frame toggle.
3. States gallery: every state rendered statically — this gallery is what Playwright snapshots.
4. Usage: when to use, when not; content guidance.
5. Props table generated from TypeScript.
6. Accessibility: keyboard map, roles, announcements.
7. RTL and localisation notes.

## Requirements

- Itself built with NDS components only (dogfooding); same tokens; light and dark; RTL.
- Every route has a stable `?state=` / `?theme=` query so tests and screenshots are reproducible.
- Search (local index, Persian-aware normalisation of ی/ي and ک/ك).
- Code samples copyable; examples are real components, not images.
- Extension point for brand packages: a package can register a docs section via `docs.manifest.ts` (title, routes, nav group). Ravanma's art kit uses this later.

## Deploy

Node container behind nginx, on-prem. Preview builds per PR (internal URL) for owner review.
