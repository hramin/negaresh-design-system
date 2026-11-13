#!/usr/bin/env bash
# Rebuilds fonts/vazirmatn-subset.woff2 from the Vazirmatn variable TTF (OFL).
# Run when the source font or the subset ranges change; the output is committed.
# Needs: fonttools + brotli (pip install fonttools==4.60.1 brotli).
# Usage: scripts/subset-font.sh path/to/Vazirmatn[wght].ttf   (npm: vazirmatn@33.0.3, fonts/variable/)
set -euo pipefail
src="${1:?path to Vazirmatn[wght].ttf}"
here="$(cd "$(dirname "$0")/.." && pwd)"
# Basic Latin, Arabic block (Persian letters, digits, ٫ ٬ ،), NBSP, « », × ÷, ZWNJ/ZWJ/LRM/RLM,
# dashes, quotes, bullet, ellipsis, ‰, bidi isolates, minus, dotted circle, ornate parentheses.
pyftsubset "$src" \
  --unicodes="U+0020-007E,U+00A0,U+00AB,U+00B7,U+00BB,U+00D7,U+00F7,U+0600-06FF,U+200C-200F,U+2010-2027,U+2030,U+2039-203A,U+2066-2069,U+2212,U+25CC,U+FD3E-FD3F" \
  --layout-features='*' \
  --flavor=woff2 \
  --output-file="$here/fonts/vazirmatn-subset.woff2"
ls -l "$here/fonts/vazirmatn-subset.woff2"
