# @negaresh/theme-company

Company theme for Negaresh main site, Registry and Test platform: imports token CSS, self-hosted Vazirmatn, base layer. Light and dark.

Status: planned. Built in the phase listed in `docs/phases/`.

## Use

```ts
import '@negaresh/theme-company'; // tokens + Vazirmatn + base layers
```

Set `data-theme="light|dark"` on `<html>` to override the OS preference.

## Font

`fonts/vazirmatn-subset.woff2`: Vazirmatn 33.0.3 variable (wght 100–900, OFL), subset to Persian + Basic Latin + punctuation with `scripts/subset-font.sh` (≈ 72 KB, budget 90 KB).
