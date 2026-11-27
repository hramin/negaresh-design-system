import { tokens } from '@negaresh/tokens';
import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import type { Ref } from 'react';
import { cx } from '../internal/cx.ts';
import {
  type ChartDirection,
  getVizToken,
  normalizeDomain,
  roundCoord,
  type VizToneIndex,
} from '../internal/scale.ts';
import styles from './Sparkline.module.css';

export type SparklineTone = 'accent' | 'positive' | 'negative' | 'neutral' | VizToneIndex;
export type SparklineSize = 'sm' | 'md' | 'lg';

export interface SparklineProps {
  /** Ordered trend values (oldest → newest). */
  values: readonly number[];
  /** Required accessible text summary (e.g. «روند صعودی ۷ روز اخیر: از ۴۲ به ۶۸»). */
  summary: string;
  /** Semantic tone or 1–6 `--nds-viz-*` index. Default `'accent'`. */
  tone?: SparklineTone | undefined;
  /** Compact inline size preset (designed for `StatTile`'s `sparkline` slot). Default `'md'`. */
  size?: SparklineSize | undefined;
  /** Optional horizontal baseline reference value. */
  baseline?: number | undefined;
  /** Highlight the final data point with a crisp dot. Default `true`. */
  highlightLast?: boolean | undefined;
  /** Reading direction (`'rtl'` starts oldest point on the right and progresses leftward). Default `'rtl'`. */
  dir?: ChartDirection | undefined;
  className?: string | undefined;
  ref?: Ref<SVGSVGElement> | undefined;
}

const VIEW_W = 108;
const VIEW_H = 32;
const PAD_X = 5;
const PAD_Y = 5;

function resolveSparklineColor(tone: SparklineTone): string {
  if (typeof tone === 'number') return getVizToken(0, tone);
  switch (tone) {
    case 'positive':
      return tokens.color.success.fg;
    case 'negative':
      return tokens.color.danger.fg;
    case 'neutral':
      return tokens.color.fg.muted;
    case 'accent':
      return tokens.color.viz['1'];
  }
}

/**
 * Compact axis-free SSR SVG trend sparkline built on `d3-scale` + `d3-shape`.
 * Slots directly into `@negaresh/react`'s `<StatTile sparkline={<Sparkline ... />} />`.
 */
export function Sparkline({
  values,
  summary,
  tone = 'accent',
  size = 'md',
  baseline,
  highlightLast = true,
  dir = 'rtl',
  className,
  ref,
}: SparklineProps) {
  const color = resolveSparklineColor(tone);
  const valid = values.filter((v) => Number.isFinite(v));

  let minVal = valid.length > 0 ? Math.min(...valid) : 0;
  let maxVal = valid.length > 0 ? Math.max(...valid) : 1;
  if (baseline !== undefined && Number.isFinite(baseline)) {
    minVal = Math.min(minVal, baseline);
    maxVal = Math.max(maxVal, baseline);
  }
  const domain = normalizeDomain([minVal, maxVal]);

  const xScale = scaleLinear<number, number>()
    .domain([0, Math.max(1, valid.length - 1)])
    .range(dir === 'rtl' ? [VIEW_W - PAD_X, PAD_X] : [PAD_X, VIEW_W - PAD_X]);
  const yScale = scaleLinear<number, number>().domain(domain).range([VIEW_H - PAD_Y, PAD_Y]);

  const pathGenerator = line<number>()
    .x((_, i) => roundCoord(xScale(i)))
    .y((v) => roundCoord(yScale(v)));

  const d = valid.length >= 2 ? (pathGenerator(valid) ?? '') : '';
  const lastIndex = valid.length - 1;
  const lastX = lastIndex >= 0 ? roundCoord(xScale(lastIndex)) : undefined;
  const lastY = lastIndex >= 0 ? roundCoord(yScale(valid[lastIndex]!)) : undefined;
  const baselineY = baseline !== undefined ? roundCoord(yScale(baseline)) : undefined;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-label={summary}
      data-nds="Sparkline"
      data-size={size}
      data-dir={dir}
      className={cx(styles.svg, className)}
    >
      <title>{summary}</title>
      {baselineY !== undefined && (
        <line x1={PAD_X} y1={baselineY} x2={VIEW_W - PAD_X} y2={baselineY} className={styles.baseline} />
      )}
      {d.length > 0 && <path d={d} stroke={color} className={styles.line} />}
      {highlightLast && lastX !== undefined && lastY !== undefined && (
        <circle cx={lastX} cy={lastY} r={2.8} fill={color} stroke="var(--nds-bg-surface)" strokeWidth={1.2} />
      )}
    </svg>
  );
}
