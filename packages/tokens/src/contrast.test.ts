import { describe, expect, it } from 'vitest';
import { collectTokens, semanticColors } from './build.ts';
import { checkContrast, contrastMarkdown, contrastRatio, PAIRS } from './contrast.ts';

describe('contrast', () => {
  it('computes WCAG ratios', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBe(1);
    expect(contrastRatio('#1B1714', '#FAF7F2')).toBeCloseTo(16.66, 1);
  });

  it('passes every pair in both modes for the company theme', async () => {
    const results = checkContrast(semanticColors(await collectTokens('company')));
    expect(results).toHaveLength(PAIRS.length * 2);
    expect(results.filter((r) => !r.pass)).toEqual([]);
  });

  it('fails when a pair is broken on purpose', async () => {
    const colors = semanticColors(await collectTokens('company'));
    colors.light['fg.subtle'] = '#A39584'; // sand.400 — too light for text
    colors.dark['accent.on'] = '#5FA59E'; // label equals its button
    const failed = checkContrast(colors).filter((r) => !r.pass);
    expect(failed.map((r) => `${r.mode}:${r.fg}/${r.bg}`)).toEqual([
      'light:fg.subtle/bg.canvas',
      'light:fg.subtle/bg.surface',
      'light:fg.subtle/bg.sunken',
      'dark:accent.on/accent.default',
    ]);
    expect(contrastMarkdown(failed, 'company')).toContain('**FAIL**');
  });

  it('reports a missing token', () => {
    expect(() => checkContrast({ light: {} })).toThrow(/missing in light/);
  });
});
