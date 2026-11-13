# @negaresh/tokens

Builds `tokens/**/*.tokens.json` (DTCG 2025.10) with Style Dictionary v5 into per-theme CSS variables, a typed TS export and a flat JSON list. Also hosts `tokens:check` (schema + contrast).

Status: built in P1. `pnpm tokens` builds `dist/{company,ravanma}.css`, `tokens.js`/`.d.ts`, `tokens.json`, `contrast.{md,json}`; `pnpm tokens:check` validates the DTCG sources and the contrast pairs.

```ts
import '@negaresh/tokens/company.css';
import { tokens } from '@negaresh/tokens'; // tokens.color.viz[1] === 'var(--nds-viz-1)'
```
