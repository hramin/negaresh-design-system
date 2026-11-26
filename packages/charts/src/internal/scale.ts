import { tokens } from '@negaresh/tokens';
import { formatNumber } from '@negaresh/utils';
import {
  type ScaleBand,
  type ScaleLinear,
  type ScalePoint,
  scaleBand,
  scaleLinear,
  scalePoint,
} from 'd3-scale';

/** Reading direction for chart axes (`'rtl'` default for Persian; `'ltr'` for Ravanma/English). */
export type ChartDirection = 'rtl' | 'ltr';

/** Audience severity mode: clinical professional vs calm taker/parent view (data-viz.md). */
export type ChartMode = 'professional' | 'calm';

/** Semantic assessment severity level. */
export type ChartSeverity = 'ok' | 'caution' | 'severe';

/** 1-based data-viz palette index matching `--nds-viz-1` through `--nds-viz-6`. */
export type VizToneIndex = 1 | 2 | 3 | 4 | 5 | 6;

/** Ordered semantic visualization tokens (`var(--nds-viz-1..6)`). */
export const VIZ_TOKENS: readonly string[] = [
  tokens.color.viz['1'],
  tokens.color.viz['2'],
  tokens.color.viz['3'],
  tokens.color.viz['4'],
  tokens.color.viz['5'],
  tokens.color.viz['6'],
] as const;

/** Distinct stroke dash arrays for greyscale / monochrome print distinguishability. */
export const SERIES_DASHARRAYS: readonly (string | undefined)[] = [
  undefined,
  '6 3',
  '2 3',
  '8 3 2 3',
  '10 3',
  '4 2 1 2',
] as const;

/** Returns the semantic `--nds-viz-*` CSS variable reference for a 0-based or 1-based index. */
export function getVizToken(index: number, explicitTone?: VizToneIndex): string {
  if (explicitTone !== undefined) {
    return VIZ_TOKENS[(explicitTone - 1) % VIZ_TOKENS.length]!;
  }
  const safe = ((index % VIZ_TOKENS.length) + VIZ_TOKENS.length) % VIZ_TOKENS.length;
  return VIZ_TOKENS[safe]!;
}

/** Returns the stroke-dasharray for series index `i` (0 = solid, 1..5 = distinct dashes). */
export function getSeriesDashArray(index: number): string | undefined {
  const safe = ((index % SERIES_DASHARRAYS.length) + SERIES_DASHARRAYS.length) % SERIES_DASHARRAYS.length;
  return SERIES_DASHARRAYS[safe];
}

/** Resolves a safe non-degenerate numeric domain `[min, max]`. */
export function normalizeDomain(domain: readonly [number, number]): [number, number] {
  const [rawMin, rawMax] = domain;
  const min = Number.isFinite(rawMin) ? rawMin : 0;
  const max = Number.isFinite(rawMax) ? rawMax : 100;
  if (min === max) {
    return [min - 1, max + 1];
  }
  return min < max ? [min, max] : [max, min];
}

/**
 * Creates a horizontal linear scale respecting reading direction:
 * - RTL: `min` at inline-start (`right`), `max` at inline-end (`left`)
 * - LTR: `min` at inline-start (`left`), `max` at inline-end (`right`)
 */
export function createHorizontalLinearScale(
  domain: readonly [number, number],
  startX: number,
  endX: number,
  dir: ChartDirection = 'rtl',
  clamp = true,
): ScaleLinear<number, number> {
  const [min, max] = normalizeDomain(domain);
  const range: [number, number] = dir === 'rtl' ? [endX, startX] : [startX, endX];
  return scaleLinear<number, number>().domain([min, max]).range(range).clamp(clamp);
}

/** Creates a standard vertical linear scale (low at bottom, high at top). */
export function createVerticalLinearScale(
  domain: readonly [number, number],
  topY: number,
  bottomY: number,
  clamp = true,
): ScaleLinear<number, number> {
  const [min, max] = normalizeDomain(domain);
  return scaleLinear<number, number>().domain([min, max]).range([bottomY, topY]).clamp(clamp);
}

/**
 * Creates a horizontal point scale for categorical axes (e.g. `ProfileLine`).
 * In RTL, the first category sits on the right (inline-start) and progresses right-to-left.
 */
export function createHorizontalPointScale(
  categories: readonly string[],
  leftX: number,
  rightX: number,
  dir: ChartDirection = 'rtl',
  padding = 0.2,
): ScalePoint<string> {
  const range: [number, number] = dir === 'rtl' ? [rightX, leftX] : [leftX, rightX];
  return scalePoint<string>().domain([...categories]).range(range).padding(padding);
}

/**
 * Creates a horizontal band scale for vertical bar charts.
 * In RTL, the first category sits on the right (inline-start) and progresses right-to-left.
 */
export function createHorizontalBandScale(
  categories: readonly string[],
  leftX: number,
  rightX: number,
  dir: ChartDirection = 'rtl',
  paddingInner = 0.28,
  paddingOuter = 0.16,
): ScaleBand<string> {
  const range: [number, number] = dir === 'rtl' ? [rightX, leftX] : [leftX, rightX];
  return scaleBand<string>()
    .domain([...categories])
    .range(range)
    .paddingInner(paddingInner)
    .paddingOuter(paddingOuter);
}

/** Creates a vertical band scale for horizontal bar / interval-bar rows (top to bottom). */
export function createVerticalBandScale(
  rows: readonly string[],
  topY: number,
  bottomY: number,
  paddingInner = 0.28,
  paddingOuter = 0.12,
): ScaleBand<string> {
  return scaleBand<string>()
    .domain([...rows])
    .range([topY, bottomY])
    .paddingInner(paddingInner)
    .paddingOuter(paddingOuter);
}

/** Rounds SVG coordinate numbers to 2 decimals for clean deterministic SSR snapshots. */
export function roundCoord(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 100) / 100;
}

/** Default Persian numeric formatter using `@negaresh/utils`. */
export function formatChartNumber(value: number): string {
  return formatNumber(value, { maximumFractionDigits: 1 });
}

/** Computes clean numeric ticks from explicit ticks or `d3-scale` `.ticks()`. */
export function resolveTicks(
  scale: ScaleLinear<number, number>,
  explicitTicks?: readonly number[],
  count = 5,
): number[] {
  if (explicitTicks && explicitTicks.length > 0) {
    return [...explicitTicks];
  }
  return scale.ticks(count);
}

/**
 * Resolves the semantic CSS colour variable for a severity level in `professional` vs `calm` mode.
 * In `calm` mode, rose / `--nds-danger-*` is NEVER returned (color.md rule 4, data-viz.md).
 */
export function severityStrokeToken(
  severity: ChartSeverity | undefined,
  mode: ChartMode,
): string {
  if (mode === 'calm') {
    if (severity === 'severe') return tokens.color.accent.default;
    if (severity === 'caution') return tokens.color.viz['1'];
    return tokens.color.fg.muted;
  }
  switch (severity) {
    case 'ok':
      return tokens.color.success.fg;
    case 'caution':
      return tokens.color.warning.fg;
    case 'severe':
      return tokens.color.danger.fg;
    default:
      return tokens.color.viz['1'];
  }
}

/** Resolves the semantic pill/band background token for a severity level. */
export function severityFillToken(
  severity: ChartSeverity | undefined,
  mode: ChartMode,
): string {
  if (mode === 'calm') {
    if (severity === 'severe') return tokens.color.accent.subtle;
    return tokens.color.bg.sunken;
  }
  switch (severity) {
    case 'ok':
      return tokens.color.success.bg;
    case 'caution':
      return tokens.color.warning.bg;
    case 'severe':
      return tokens.color.danger.bg;
    default:
      return tokens.color.viz.band;
  }
}
