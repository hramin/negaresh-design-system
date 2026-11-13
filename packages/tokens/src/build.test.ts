import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { collectTokens, themeCss, tokensModule } from './build.ts';
import { cssName } from './naming.ts';

const ref = (f: string) =>
  readFileSync(new URL(`../../../reference/registry-activation/${f}`, import.meta.url), 'utf8');

/** Parse `--name:value` declarations inside the first block matching `selector`. */
function declarations(css: string, selector: RegExp): Map<string, string> {
  const start = css.search(selector);
  const open = css.indexOf('{', start);
  let depth = 0;
  let end = open;
  for (; end < css.length; end++) {
    if (css[end] === '{') depth++;
    if (css[end] === '}' && --depth === 0) break;
  }
  const body = css.slice(open + 1, end);
  const out = new Map<string, string>();
  for (const m of body.matchAll(/(--nds-[a-z0-9-]+)\s*:\s*([^;]+);/g))
    out.set(m[1] as string, m[2] as string);
  return out;
}

const norm = (v: string) =>
  v
    .toLowerCase()
    .replaceAll(/\s+/g, '')
    .replaceAll(/(^|[^0-9])\.(\d)/g, '$10.$2');

describe('build output', () => {
  it('matches the reference token values (light, dark, prefers-color-scheme)', async () => {
    const css = themeCss(await collectTokens('company'));
    const reference = ref('tokens.css');
    const blocks: [RegExp, RegExp][] = [
      [/:root,\[data-theme=light\]/, /:root,\[data-theme=light\]/],
      [/\[data-theme=dark\]/, /^\[data-theme=dark\]/m],
      [/:root:not\(\[data-theme\]\)/, /:root:not\(\[data-theme\]\)/],
    ];
    for (const [refSel, outSel] of blocks) {
      const expected = declarations(reference, refSel);
      const actual = declarations(css, outSel);
      expect(expected.size).toBeGreaterThan(40);
      for (const [name, value] of expected)
        expect([name, norm(actual.get(name) ?? 'MISSING')]).toEqual([name, norm(value)]);
    }
  });

  it('matches the reference foundation variables', async () => {
    const css = themeCss(await collectTokens('company'));
    const expected = declarations(ref('nds.css'), /:root\{/);
    const actual = declarations(css, /^:root\{/m);
    expect(expected.size).toBeGreaterThan(30);
    for (const [name, value] of expected)
      expect([name, norm(actual.get(name) ?? 'MISSING')]).toEqual([name, norm(value)]);
  });

  it('keeps references for component tokens and exposes var() in the TS module', async () => {
    const entries = await collectTokens('company');
    expect(entries.find((e) => e.path === 'component.button.radius')?.value.light).toBe(
      'var(--nds-radius-pill)',
    );
    const mod = tokensModule(entries);
    expect(mod.js).toContain('"1": "var(--nds-viz-1)"');
    expect(mod.dts).toContain('export type CssVarName = "--nds-bg-canvas"');
    expect(entries.find((e) => e.path === 'color.sand.50')?.cssVar).toBeNull();
  });

  it('writes well-formed comments (no stray */ from globs in the header)', async () => {
    for (const css of [
      themeCss(await collectTokens('company')),
      themeCss(await collectTokens('ravanma'), 'note'),
    ]) {
      expect(css.replaceAll(/\/\*[\s\S]*?\*\//g, '')).not.toMatch(/\*\/|\/\*/);
      expect(css.split('{').length).toBe(css.split('}').length);
    }
  });

  it('adds Ravanma primitives to the placeholder theme only', async () => {
    const ravanma = themeCss(await collectTokens('ravanma'), 'placeholder');
    expect(ravanma).toContain('--nds-ravanma-paper:#D9C4AD;');
    expect(themeCss(await collectTokens('company'))).not.toContain('ravanma');
  });

  it('names tokens', () => {
    expect(cssName(['color', 'bg', 'canvas'])).toBe('nds-bg-canvas');
    expect(cssName(['color'])).toBeNull();
    expect(cssName(['font', 'family', 'sans'])).toBe('nds-font-sans');
    expect(cssName(['font', 'other'])).toBeNull();
    expect(cssName(['easing', 'enter'])).toBe('nds-ease-enter');
    expect(cssName(['unknown'])).toBeNull();
  });
});
