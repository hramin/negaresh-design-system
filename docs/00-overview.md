# 00 · Overview

## Purpose

Negaresh publishes Persian psychology and psychometrics software, courses and content. Four web products share one sign-in (Keycloak) and must look and behave as one trustworthy brand. NDS gives them one set of tokens, components, patterns and rules, so that:

- a product team builds screens from approved parts instead of redesigning them;
- a yearly redesign changes tokens and themes, not components (Negaresh PRD, Design NFR);
- accessibility, RTL, Persian digits, Jalali dates and Toman prices are correct by default;
- the test platform, the shop and the registry feel like one company, and Ravanma can carry its own art on the same skeleton.

## Character

| Quality | Means in practice |
| --- | --- |
| Calm | Warm neutral canvas, one restrained accent (deep teal), generous spacing, no visual noise. A psychology product must never feel alarming — especially where a teenager reads a result. |
| Trustworthy | Clear hierarchy, plain Persian, honest states (what happened, what to do next). Clinical data looks precise, not decorative. |
| Modern and minimal | Tone, spacing and a single hairline separate surfaces. No frames, illumination, ornament or resting shadows (D-77). |
| Efficient with space | Dense where people work (admin, tables), airy where people read (articles, results). Layout uses the full width on desktop and a separate composition on mobile. |
| Flexible | Themeable by tokens; accent, typeface and radius are one-file changes. Dark mode from v1. |

## Layers

| Layer | Package | Contains | Changes when… |
| --- | --- | --- | --- |
| Tokens | `@negaresh/tokens` | Primitive ramps, semantic roles, light/dark | Brand or theme changes |
| Core | `@negaresh/react`, `@negaresh/icons`, `@negaresh/utils` | All generic components, layout primitives, formatting utilities | A component is added or fixed |
| Charts | `@negaresh/charts` | Line, bar, interval bar, radar, gauge, sparkline | A chart type is added |
| Assessment kit | `@negaresh/assessment` | Question items, answering flow, results, interpretation, report/print | The scoring result shape changes |
| Patterns | `@negaresh/patterns` | Commerce, licensing, content, account, admin compositions | A product needs a reusable composition |
| Themes | `@negaresh/theme-company`, `@negaresh/theme-ravanma` | Semantic token values + component defaults | Brand redesign |
| Brand kits | `@negaresh/brand-ravanma` (later: one per product logo) | Logos, art, illumination, painted assets | Brand work (separate stage, D-37) |
| Login theme | `@negaresh/keycloak-theme` | Keycloakify theme built from Core | Login flows change |

## Not in NDS

Business logic, API clients, routing of product apps, backend contracts, product copy beyond examples. Product apps live in their own repositories and depend on published NDS packages.

## Products at a glance

| Product | First screens to build on NDS | Peculiarities |
| --- | --- | --- |
| Registry | Activation (reference page), my activations, buy +1 activation, admin (serials, limits, alerts, audit) | Mobile-first; codes are LTR Latin; opened from Windows apps via `/?s=&code=` |
| Main site | Product page, cart/checkout, blog feed and item, expert profile and directory, course player, customer account, admin panel | SEO, LCP < 2.5 s on mobile, structured content blocks, multi-role admin |
| Test platform | Catalog, start form, answering page, result (pro and calm views), PDF report, campaigns, org wallet, admin | Minors may answer; severity needs care; print parity |
| Ravanma | Returns later | Painted art, own theme; English as second language |
