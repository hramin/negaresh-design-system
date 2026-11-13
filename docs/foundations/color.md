# Colour

## Intent

Psychology and psychometrics ask for **calm, warmth and credibility**.

- **Sand** — warm paper neutrals for light mode. A quiet, human room rather than a clinic.
- **Teal** — the single accent: the deep teal approved on the first reference page (`#1D6B66`). Green-blue reads as balance, growth and trust, sits well on warm sand, and stays clearly apart from every status colour. It is close to the family of the current Negaresh logo green; when the logo is redrawn (e.g. a watercolour or flatter mark), the accent ramp may be nudged toward it — a token change only (D-78).
- **Ink** — dark mode. A deep, low-chroma blue-green slate rather than black, brown or neutral grey: quiet in the evening, low glare, professional. Text is a soft off-white (never pure white), the accent becomes a light, desaturated teal, and status colours are muted so nothing shouts. This is the "calm night" a psychology product needs: readable for long sessions, never harsh or alarming (D-82).

## Primitive ramps

| Family | Steps |
| --- | --- |
| sand | 0 `#FFFDFA` · 50 `#FAF7F2` · 100 `#F4EFE7` · 150 `#ECE5DA` · 200 `#E2D9CB` · 300 `#CBBFAE` · 400 `#A39584` · 500 `#857669` · 600 `#6A5D52` · 700 `#51473F` · 800 `#3A332D` · 900 `#27221E` · 950 `#1B1714` |
| ink | 1000 `#0E1314` · 950 `#121819` · 900 `#182022` · 850 `#1E2729` · 800 `#253033` · 700 `#33403F` · 600 `#465452` · 500 `#6A7976` · 400 `#8A9895` · 300 `#A9B5B2` · 200 `#C6D0CD` · 100 `#DCE3E0` |
| teal | 50 `#EEF6F5` · 100 `#DCECEA` · 200 `#B7D8D4` · 300 `#8CC0BA` · 400 `#5FA59E` · 500 `#3A8A83` · 600 `#1D6B66` · 700 `#165652` · 800 `#11433F` · 900 `#0C2F2D` · 950 `#0A2422` |
| mauve | 300 `#C7A6BC` · 500 `#8A5A7A` |
| ochre | 100 `#F7EBD3` · 300 `#E3BE79` · 500 `#B07F28` · 700 `#7E5716` |
| sage | 100 `#E7F0E6` · 300 `#A9C7A6` · 500 `#5E8A5B` · 700 `#355C34` |
| clay | 100 `#F7E6DE` · 300 `#E5A88F` · 500 `#B9603F` · 700 `#86391F` |
| slate | 100 `#E6ECF2` · 300 `#A9BBCF` · 500 `#5C7896` · 700 `#34506D` |
| rose | 100 `#F8E5E3` · 300 `#E6A39C` · 500 `#B8473E` · 700 `#8C2A24` |

## Semantic roles

| Role | Light | Dark | Use |
| --- | --- | --- | --- |
| `bg.canvas` | sand.50 | ink.950 | Page background |
| `bg.surface` | sand.0 | ink.900 | Cards, panels, inputs |
| `bg.sunken` | sand.100 | ink.1000 | Read-only fields, surface footers, code areas |
| `bg.hover` | sand.100 | ink.850 | Hover on rows and ghost buttons |
| `bg.selected` | teal.50 | teal.950 | Selected row, checked choice card |
| `bg.inverse` | sand.900 | ink.100 | Toast, tooltip |
| `fg.default` | sand.950 | ink.100 | Body text, headings |
| `fg.muted` | sand.700 | ink.200 | Secondary text |
| `fg.subtle` | sand.600 | ink.300 | Labels, captions, metadata (≥ 4.5:1) |
| `fg.disabled` | sand.400 | ink.500 | Disabled text (never the only carrier of meaning) |
| `fg.inverse` | sand.50 | ink.950 | Text on inverse |
| `border.default` | sand.150 | ink.800 | Hairlines between surfaces |
| `border.strong` | sand.200 | ink.700 | Visible dividers, meter tracks |
| `border.control` | sand.500 | ink.500 | Input, checkbox, radio, secondary-button borders (≥ 3:1) |
| `accent.default` | teal.600 | teal.400 | Primary action, selection, progress |
| `accent.hover` | teal.700 | teal.300 | Hover |
| `accent.pressed` | teal.800 | teal.200 | Pressed |
| `accent.subtle` | teal.50 | teal.950 | Tinted backgrounds |
| `accent.fg` | teal.600 | teal.300 | Links, accent text |
| `accent.on` | sand.0 | ink.1000 | Text on accent |
| `focus.ring` | teal.500 | teal.300 | 2-px focus outline |
| `success`, `warning`, `danger`, `info` `.fg/.bg/.border` | sage, ochre, rose, slate (700/100/300) | 300 on deep tinted backgrounds | Status only |
| `viz.1…6`, `viz.ref`, `viz.band`, `viz.grid` | teal, ochre, slate, clay, mauve, sage | lighter steps of the same | Charts only (`data-viz.md`) |

## Dark mode principles

1. No pure black and no pure white: canvas `ink.950`, text `ink.100`. Peak contrast stays high enough for AA but avoids glare.
2. Elevation by lightness: canvas → surface → hover get slightly lighter; no shadows on resting surfaces.
3. Accent and status colours drop saturation and rise in lightness; tinted backgrounds stay very dark.
4. Same semantic names in both modes; components never branch on mode.
5. Default follows the OS; the user's choice is remembered.

## Rules

1. Colour never carries meaning alone: status has a word and, where space allows, an icon.
2. One accent per region; at most one primary button per surface.
3. Status colours are for status only. Rose never decorates; teal never signals success (sage does).
4. Assessment severity uses its own calm scale (`data-viz.md`): the taker view never shows rose "severe" blocks.
5. Text on tinted backgrounds uses the matching `.fg` token.
6. Every new pair goes through `pnpm tokens:check`; current values in [contrast-report.md](contrast-report.md).
