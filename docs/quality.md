# Quality and acceptance

## Automated (CI on every PR)

| Check | Tool | Gate |
| --- | --- | --- |
| Types | `tsc --noEmit` (strict) | 0 errors |
| Lint | Biome or ESLint + stylelint (no physical properties, no raw colours) | 0 errors |
| Tokens | DTCG validation + contrast report | all pairs pass |
| Unit / component | Vitest + Testing Library | all pass; utils ≥ 95 % coverage (dates, digits, phone, serial, money) |
| Accessibility | Playwright + axe on every docs page, light/dark, 1440 and 390 widths | 0 violations (serious/critical) |
| Visual | Playwright screenshots of each states gallery; fixed Docker image with fonts | diff ≤ 0.1 % or approved update |
| SSR | Render every docs route on the server without errors; no hydration warnings | 0 errors |
| Bundle | size-limit per package entry | budgets below |
| Performance | Lighthouse CI on reference pages (mobile, slow 4G) | LCP < 2.5 s, CLS < 0.1, INP < 200 ms |

## Budgets (initial; revisit after P8 measurements)

| Item | Budget (gzip) |
| --- | --- |
| `@negaresh/tokens` CSS per theme | 8 KB |
| Core CSS (all components) | 40 KB |
| Button + TextField + Dialog JS (typical form page) | 35 KB |
| Font: Vazirmatn subset, regular + bold axis | 90 KB |

## Manual (end of each phase)

Keyboard-only pass; screen readers (NVDA/Firefox, VoiceOver/Safari iOS, TalkBack/Chrome Android); 200 % zoom and 320 px reflow; Windows high-contrast; real low-end Android device on throttled network for the reference pages.

## Definition of done (component)

Implemented on RAC · all states · light and dark · RTL and mobile · docs page with props and a11y notes · unit + axe + visual tests · no raw values · status updated in `components.md`.
