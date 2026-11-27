import { describe, expect, it } from 'vitest';
import {
  createHorizontalBandScale,
  createHorizontalLinearScale,
  createHorizontalPointScale,
  createVerticalLinearScale,
  formatChartNumber,
  getVizToken,
  normalizeDomain,
  roundCoord,
  severityFillToken,
  severityStrokeToken,
} from './scale.ts';

describe('chart scale & token helpers', () => {
  it('maps horizontal linear scales from start (right) to end (left) in RTL and flips in LTR', () => {
    const rtl = createHorizontalLinearScale([0, 100], 20, 420, 'rtl');
    expect(rtl(0)).toBe(420);
    expect(rtl(50)).toBe(220);
    expect(rtl(100)).toBe(20);

    const ltr = createHorizontalLinearScale([0, 100], 20, 420, 'ltr');
    expect(ltr(0)).toBe(20);
    expect(ltr(100)).toBe(420);
  });

  it('orders categorical point & band scales right-to-left in RTL', () => {
    const pts = createHorizontalPointScale(['الف', 'ب', 'پ'], 40, 360, 'rtl');
    expect(pts('الف')!).toBeGreaterThan(pts('ب')!);
    expect(pts('ب')!).toBeGreaterThan(pts('پ')!);

    const bands = createHorizontalBandScale(['الف', 'ب'], 40, 360, 'rtl');
    expect(bands('الف')!).toBeGreaterThan(bands('ب')!);
  });

  it('normalizes degenerate or reversed domains safely without NaN', () => {
    expect(normalizeDomain([50, 50])).toEqual([49, 51]);
    expect(normalizeDomain([80, 20])).toEqual([20, 80]);
    const y = createVerticalLinearScale([10, 10], 10, 110);
    expect(Number.isFinite(y(10))).toBe(true);
    expect(roundCoord(Number.NaN)).toBe(0);
  });

  it('formats chart numbers in Persian digits via @negaresh/utils', () => {
    expect(formatChartNumber(65)).toBe('۶۵');
    expect(formatChartNumber(1250)).toBe('۱٬۲۵۰');
  });

  it('never returns rose/danger tokens in calm mode (color.md rule 4)', () => {
    expect(severityStrokeToken('severe', 'professional')).toContain('danger');
    expect(severityFillToken('severe', 'professional')).toContain('danger');
    expect(severityStrokeToken('severe', 'calm')).not.toContain('danger');
    expect(severityFillToken('severe', 'calm')).not.toContain('danger');
    expect(getVizToken(0)).toBe('var(--nds-viz-1)');
    expect(getVizToken(5)).toBe('var(--nds-viz-6)');
  });
});
