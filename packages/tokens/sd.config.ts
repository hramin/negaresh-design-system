/**
 * Style Dictionary v5 configuration for NDS.
 *
 * Style Dictionary reads the DTCG 2025.10 sources, resolves aliases and applies the
 * NDS value transforms below. src/build.ts then reads the resolved tokens per mode
 * (getPlatformTokens) and writes the per-theme CSS (light, dark, prefers-color-scheme),
 * the typed TS export and the flat JSON list.
 */
import { fileURLToPath } from 'node:url';
import StyleDictionary from 'style-dictionary';
import type { TransformedToken } from 'style-dictionary/types';
import { cssName } from './src/naming.ts';
import {
  colorToCss,
  cubicBezierToCss,
  dimensionToCss,
  durationToCss,
  fontFamilyToCss,
  shadowToCss,
} from './src/values.ts';

export const TOKENS_DIR = fileURLToPath(new URL('../../tokens/', import.meta.url));

export type Mode = 'light' | 'dark';
export type Theme = 'company' | 'ravanma';

const isFontSize = (t: TransformedToken) => t.path[0] === 'font' && t.path[1] === 'size';

StyleDictionary.registerTransform({
  name: 'nds/name',
  type: 'name',
  transform: (token) => cssName(token.path) ?? `nds-primitive-${token.path.join('-')}`,
});

StyleDictionary.registerTransform({
  name: 'nds/value',
  type: 'value',
  transitive: true,
  transform: (token) => {
    const v = token.$value;
    switch (token.$type) {
      case 'color':
        return colorToCss(v);
      case 'dimension':
        return dimensionToCss(v, { rem: isFontSize(token) });
      case 'duration':
        return durationToCss(v);
      case 'cubicBezier':
        return cubicBezierToCss(v);
      case 'fontFamily':
        return fontFamilyToCss(v);
      case 'shadow':
        return shadowToCss(v);
      case 'fontWeight':
      case 'number':
        return String(v);
      default:
        return v;
    }
  },
});

// Each source file carries its own root $schema/$description (file metadata, not tokens).
// Drop them so they don't register as collisions; real token collisions still fail.
StyleDictionary.registerParser({
  name: 'nds/dtcg-file',
  pattern: /\.tokens\.json$/,
  parser: ({ contents }) => {
    const { $schema: _schema, $description: _description, ...rest } = JSON.parse(contents);
    return rest;
  },
});

/** Source files for one theme in one mode. */
export function sourcesFor(theme: Theme, mode: Mode): string[] {
  return [
    `${TOKENS_DIR}primitive/**/*.tokens.json`,
    `${TOKENS_DIR}semantic/color.${mode}.tokens.json`,
    `${TOKENS_DIR}themes/${theme}.tokens.json`,
  ];
}

export function createDictionary(theme: Theme, mode: Mode): StyleDictionary {
  return new StyleDictionary({
    usesDtcg: true,
    parsers: ['nds/dtcg-file'],
    source: sourcesFor(theme, mode),
    log: { verbosity: 'silent', warnings: 'error', errors: { brokenReferences: 'throw' } },
    platforms: {
      css: { transforms: ['nds/name', 'nds/value'] },
    },
  });
}
