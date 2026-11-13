# Typography

## Typeface

One family everywhere (D-33): **Vazirmatn** variable now, **Abar Pro** when licensed (D-19). Codes use the system monospace stack. Never mix a second display face.

## Scale

Base 16 px. The scale comes from Ravanma v3 (12 · 13 · 14.5 · 16.5 · 18 · 21 · 25 · 32 · 50), rounded to whole pixels for UI.

| Token | px | Use |
| --- | --- | --- |
| `text-2xs` | 12 | Badges, table meta, chart ticks |
| `text-xs` | 13 | Captions, hints, helper text |
| `text-sm` | 14 | Secondary UI text, table cells, labels |
| `text-md` | 16 | Body, inputs, buttons |
| `text-lg` | 18 | Surface titles, lead paragraph in articles |
| `text-xl` | 21 | Section headings |
| `text-2xl` | 25 | Page title (mobile), large numbers |
| `text-3xl` | 32 | Page title (desktop) |
| `text-4xl` | 40 | Marketing headings, KPI |
| `text-5xl` | 50 | Hero only (main site landing) |

Fluid headings use `clamp()` between the mobile and desktop step; body text is never fluid.

## Weights

400 body · 500 UI labels and nav · 600 buttons and field labels · 700 headings · 800 page titles and prices. No 300 or below (thin Persian strokes break at small sizes).

## Line height

| Token | Value | Use |
| --- | --- | --- |
| `leading-tight` | 1.35 | Headings |
| `leading-ui` | 1.6 | Controls, short UI text |
| `leading-text` | 1.9 | Running Persian text (articles, interpretations, long hints) — Persian needs more room than Latin for dots and descenders |

## Measure

Reading text is capped at **66ch**; forms at 640 px; data views use the full container.

## Persian specifics

- Use proper ZWNJ (نیم‌فاصله) in all copy: «فعال‌سازی»، «می‌شود».
- Do not letter-space Persian text. Letter-spacing is allowed only for Latin codes (`0.06–0.12em`).
- Do not use italic for Persian; emphasise with weight.
- Numbers inside Persian text use Persian digits; tabular figures (`font-variant-numeric: tabular-nums`) in tables and meters.
- Mixed-direction strings (Persian + Latin brand or code) must be isolated with `<Ltr>` (`unicode-bidi: isolate`).
