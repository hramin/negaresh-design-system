import contrast from '@negaresh/tokens/contrast.json';
import data from '@negaresh/tokens/tokens.json';

export type Mode = 'light' | 'dark';

export interface TokenEntry {
  path: string;
  cssVar: string | null;
  type: string;
  tier: 'primitive' | 'semantic' | 'component' | 'theme';
  description?: string;
  value: Record<Mode, string>;
  alias?: Partial<Record<Mode, string>>;
  modal: boolean;
}

export interface ContrastResult {
  fg: string;
  bg: string;
  use: string;
  mode: Mode;
  fgHex: string;
  bgHex: string;
  ratio: number;
  min: number;
  pass: boolean;
}

export const tokens = data.tokens as TokenEntry[];
export const contrastResults = contrast as ContrastResult[];

/** Emitted tokens (with a CSS variable), in source order. */
export const cssTokens = tokens.filter((t) => t.cssVar !== null);

/** Primitive colour ramps, grouped by family, in source order. */
export function colorRamps(): { family: string; steps: { step: string; hex: string }[] }[] {
  const out = new Map<string, { step: string; hex: string }[]>();
  for (const t of tokens) {
    const [head, family, step] = t.path.split('.');
    if (head !== 'color' || t.tier !== 'primitive' || !family || !step) continue;
    out.set(family, [...(out.get(family) ?? []), { step, hex: t.value.light }]);
  }
  return [...out].map(([family, steps]) => ({ family, steps }));
}

/** TS access path for a token, e.g. `tokens.color.viz[1]`. */
export function tsPath(path: string): string {
  return `tokens${path
    .split('.')
    .map((p) =>
      /^[A-Za-z_$][\w$]*$/.test(p) ? `.${p}` : `[${/^\d+$/.test(p) ? p : JSON.stringify(p)}]`,
    )
    .join('')}`;
}
