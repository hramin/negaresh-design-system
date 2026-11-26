import { type KeyboardEvent, type Ref, useId, useRef, useState } from 'react';
import type { ChartLegendItem, ChartTableData } from '../ChartFrame/ChartFrame.tsx';
import { cx } from '../internal/cx.ts';
import { buildSeriesPatterns, SeriesPatternDefs } from '../internal/patterns.tsx';
import {
  type ChartDirection,
  type ChartMode,
  createHorizontalBandScale,
  createHorizontalLinearScale,
  createVerticalBandScale,
  createVerticalLinearScale,
  formatChartNumber,
  getVizToken,
  resolveTicks,
  roundCoord,
  type VizToneIndex,
} from '../internal/scale.ts';
import { useChartMessages } from '../messages/context.tsx';
import type { ChartMessages } from '../messages/types.ts';
import { Band } from '../primitives/Band.tsx';
import { ReferenceLine } from '../primitives/ReferenceLine.tsx';
import type { BandSpec, ReferenceLineSpec } from '../primitives/types.ts';
import styles from './Bar.module.css';

export interface BarCategory {
  id: string;
  label: string;
  shortLabel?: string | undefined;
}

export interface BarSeries {
  id: string;
  label: string;
  values: readonly number[];
  toneIndex?: VizToneIndex | undefined;
}

export type BarOrientation = 'vertical' | 'horizontal';

export interface BarProps {
  /** Categories along the categorical axis. */
  categories: readonly BarCategory[];
  /** One to six comparison series (uses `--nds-viz-1..6` + greyscale SVG patterns for > 1 series). */
  series: readonly BarSeries[];
  /** Chart layout orientation. Default `'vertical'`. */
  orientation?: BarOrientation | undefined;
  /** Optional explicit numeric domain `[min, max]`. Defaults to `[0, niceMax]`. */
  domain?: readonly [number, number] | undefined;
  /** Explicit numeric axis ticks. */
  ticks?: readonly number[] | undefined;
  /** Optional shaded norm/target range bands. */
  bands?: readonly BandSpec[] | undefined;
  /** Optional reference lines (mean, target, cut-off). */
  referenceLines?: readonly ReferenceLineSpec[] | undefined;
  /** Render direct Persian value labels on bars (recommended per data-viz.md). Default `true`. */
  showDirectLabels?: boolean | undefined;
  /** Audience mode; prevents rose styling in `'calm'` mode. Default `'professional'`. */
  mode?: ChartMode | undefined;
  /** Axis reading direction. Default `'rtl'`. */
  dir?: ChartDirection | undefined;
  /** Custom numeric formatter. Defaults to Persian digits via `@negaresh/utils`. */
  formatValue?: ((value: number) => string) | undefined;
  /** Accessible name for the chart. */
  ariaLabel: string;
  /** Show live keyboard/pointer detail readout below the SVG. Default `true`. */
  showReadout?: boolean | undefined;
  /** Optional per-chart message overrides. */
  messages?: Partial<ChartMessages> | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

interface BarDatum {
  key: string;
  categoryLabel: string;
  seriesLabel: string;
  value: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  labelX: number;
  labelY: number;
  labelAnchor: 'start' | 'middle' | 'end';
}

function autoDomain(series: readonly BarSeries[], explicit?: readonly [number, number]): [number, number] {
  if (explicit) return [explicit[0], explicit[1]];
  let maxVal = 0;
  for (const s of series) {
    for (const v of s.values) {
      if (Number.isFinite(v) && v > maxVal) maxVal = v;
    }
  }
  const padded = maxVal <= 0 ? 10 : Math.ceil(maxVal * 1.15);
  return [0, padded];
}

/** Builds legend items matching `Bar` series tokens. */
export function buildBarLegend(series: readonly BarSeries[]): ChartLegendItem[] {
  return series.map((s, idx) => ({
    id: s.id,
    label: s.label,
    color: getVizToken(idx, s.toneIndex),
  }));
}

/** Builds an accessible `ChartTableData` for `<ChartFrame table={...} />`. */
export function buildBarTable(
  categories: readonly BarCategory[],
  series: readonly BarSeries[],
  options: {
    caption?: string | undefined;
    formatValue?: ((value: number) => string) | undefined;
    messages?: ChartMessages | undefined;
  } = {},
): ChartTableData {
  const fmt = options.formatValue ?? formatChartNumber;
  return {
    ...(options.caption !== undefined ? { caption: options.caption } : {}),
    columns: [
      { key: 'category', label: options.messages?.columnCategory ?? 'دسته' },
      ...series.map((s) => ({ key: s.id, label: s.label, align: 'numeric' as const })),
    ],
    rows: categories.map((cat, idx) => ({
      id: cat.id,
      cells: {
        category: cat.label,
        ...Object.fromEntries(series.map((s) => [s.id, fmt(s.values[idx] ?? 0)])),
      },
    })),
  };
}

/**
 * SSR SVG categorical Bar chart (`vertical` and `horizontal`) with direct Persian value labels,
 * greyscale-safe multi-series SVG `<pattern>` fills, reference lines, and keyboard navigation.
 */
export function Bar({
  categories,
  series,
  orientation = 'vertical',
  domain,
  ticks,
  bands,
  referenceLines,
  showDirectLabels = true,
  mode = 'professional',
  dir = 'rtl',
  formatValue = formatChartNumber,
  ariaLabel,
  showReadout = true,
  messages,
  className,
  ref,
}: BarProps) {
  const m = useChartMessages(messages);
  const rawId = useId().replace(/:/g, '');
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const barRefs = useRef<(SVGGElement | null)[]>([]);

  const resolvedDomain = autoDomain(series, domain);
  const patterns = buildSeriesPatterns(`bar-${rawId}`, series);
  const usePatterns = series.length > 1;

  const isHorizontal = orientation === 'horizontal';
  const viewWidth = 560;
  const viewHeight = isHorizontal ? Math.max(180, categories.length * (series.length > 1 ? 52 : 42) + 56) : 264;

  const bars: BarDatum[] = [];
  let gridElements: React.ReactNode = null;
  let axisElements: React.ReactNode = null;
  let bandElements: React.ReactNode = null;
  let refElements: React.ReactNode = null;

  if (!isHorizontal) {
    const topY = 26;
    const bottomY = viewHeight - 40;
    const leftX = dir === 'rtl' ? 20 : 48;
    const rightX = dir === 'rtl' ? viewWidth - 48 : viewWidth - 20;

    const xBand = createHorizontalBandScale(
      categories.map((c) => c.id),
      leftX,
      rightX,
      dir,
      0.26,
      0.14,
    );
    const yScale = createVerticalLinearScale(resolvedDomain, topY, bottomY);
    const resolvedTicks = resolveTicks(yScale, ticks, 5);
    const bandWidth = xBand.bandwidth();
    const gap = series.length > 1 ? 4 : 0;
    const subWidth = Math.max(8, (bandWidth - gap * (series.length - 1)) / Math.max(1, series.length));

    bandElements = bands?.map((b) => (
      <Band
        key={`band-${b.from}-${b.to}-${b.tone ?? 'band'}-${b.label ?? ''}`}
        orientation="horizontal"
        fromCoord={yScale(b.from)}
        toCoord={yScale(b.to)}
        spanStart={leftX}
        spanEnd={rightX}
        label={b.label}
        tone={b.tone}
        mode={mode}
      />
    ));

    const yAxisX = dir === 'rtl' ? rightX : leftX;
    const yLabelX = dir === 'rtl' ? rightX + 10 : leftX - 10;

    gridElements = resolvedTicks.map((tick) => {
      const y = roundCoord(yScale(tick));
      return (
        <g key={`y-${tick}`}>
          <line x1={leftX} y1={y} x2={rightX} y2={y} className={styles.gridLine} />
          <text x={roundCoord(yLabelX)} y={roundCoord(y + 4)} textAnchor="end" className={styles.axisText}>
            {formatValue(tick)}
          </text>
        </g>
      );
    });

    axisElements = (
      <>
        <line x1={leftX} y1={bottomY} x2={rightX} y2={bottomY} className={styles.axisLine} />
        <line x1={yAxisX} y1={topY} x2={yAxisX} y2={bottomY} className={styles.axisLine} />
        {categories.map((cat) => {
          const cx = roundCoord((xBand(cat.id) ?? leftX) + bandWidth / 2);
          return (
            <text key={`cat-${cat.id}`} x={cx} y={bottomY + 22} textAnchor="middle" className={styles.categoryText}>
              {cat.shortLabel ?? cat.label}
            </text>
          );
        })}
      </>
    );

    refElements = referenceLines?.map((r) => (
      <ReferenceLine
        key={`ref-${r.value}-${r.label ?? ''}`}
        orientation="horizontal"
        position={yScale(r.value)}
        start={leftX}
        end={rightX}
        label={r.label}
        labelPosition="end"
        tone={r.tone}
        mode={mode}
        dir={dir}
        lineStyle={r.lineStyle}
      />
    ));

    categories.forEach((cat, cIdx) => {
      const groupX = xBand(cat.id) ?? leftX;
      series.forEach((s, sIdx) => {
        const val = s.values[cIdx] ?? 0;
        const orderIdx = dir === 'rtl' ? series.length - 1 - sIdx : sIdx;
        const bx = roundCoord(groupX + orderIdx * (subWidth + gap));
        const by = roundCoord(yScale(val));
        const bh = roundCoord(Math.max(1, bottomY - by));
        bars.push({
          key: `${s.id}__${cat.id}`,
          categoryLabel: cat.label,
          seriesLabel: s.label,
          value: val,
          x: bx,
          y: by,
          width: roundCoord(subWidth),
          height: bh,
          fill: usePatterns ? `url(#${patterns[sIdx]!.id})` : getVizToken(sIdx, s.toneIndex),
          labelX: roundCoord(bx + subWidth / 2),
          labelY: roundCoord(by - 6),
          labelAnchor: 'middle',
        });
      });
    });
  } else {
    const topY = 18;
    const bottomY = viewHeight - 36;
    const labelCol = 118;
    const endPad = 48;
    const leftX = dir === 'rtl' ? endPad : labelCol;
    const rightX = dir === 'rtl' ? viewWidth - labelCol : viewWidth - endPad;

    const yBand = createVerticalBandScale(
      categories.map((c) => c.id),
      topY,
      bottomY,
      0.24,
      0.12,
    );
    const xScale = createHorizontalLinearScale(resolvedDomain, leftX, rightX, dir);
    const resolvedTicks = resolveTicks(xScale, ticks, 5);
    const bandHeight = yBand.bandwidth();
    const gap = series.length > 1 ? 3 : 0;
    const subHeight = Math.max(8, (bandHeight - gap * (series.length - 1)) / Math.max(1, series.length));
    const zeroX = roundCoord(xScale(resolvedDomain[0]));

    bandElements = bands?.map((b) => (
      <Band
        key={`band-${b.from}-${b.to}-${b.tone ?? 'band'}-${b.label ?? ''}`}
        orientation="vertical"
        fromCoord={xScale(b.from)}
        toCoord={xScale(b.to)}
        spanStart={topY}
        spanEnd={bottomY}
        label={b.label}
        tone={b.tone}
        mode={mode}
      />
    ));

    gridElements = resolvedTicks.map((tick) => {
      const x = roundCoord(xScale(tick));
      return (
        <g key={`x-${tick}`}>
          <line x1={x} y1={topY} x2={x} y2={bottomY} className={styles.gridLine} />
          <text x={x} y={bottomY + 18} textAnchor="middle" className={styles.axisText}>
            {formatValue(tick)}
          </text>
        </g>
      );
    });

    const catLabelX = dir === 'rtl' ? rightX + 10 : leftX - 10;
    axisElements = (
      <>
        <line x1={leftX} y1={bottomY} x2={rightX} y2={bottomY} className={styles.axisLine} />
        <line x1={zeroX} y1={topY} x2={zeroX} y2={bottomY} className={styles.axisLine} />
        {categories.map((cat) => {
          const cy = roundCoord((yBand(cat.id) ?? topY) + bandHeight / 2 + 4);
          return (
            <text key={`cat-${cat.id}`} x={roundCoord(catLabelX)} y={cy} textAnchor="end" className={styles.categoryText}>
              {cat.shortLabel ?? cat.label}
            </text>
          );
        })}
      </>
    );

    refElements = referenceLines?.map((r) => (
      <ReferenceLine
        key={`ref-${r.value}-${r.label ?? ''}`}
        orientation="vertical"
        position={xScale(r.value)}
        start={topY}
        end={bottomY}
        label={r.label}
        tone={r.tone}
        mode={mode}
        dir={dir}
        lineStyle={r.lineStyle}
      />
    ));

    categories.forEach((cat, cIdx) => {
      const groupY = yBand(cat.id) ?? topY;
      series.forEach((s, sIdx) => {
        const val = s.values[cIdx] ?? 0;
        const valX = roundCoord(xScale(val));
        const bx = roundCoord(Math.min(zeroX, valX));
        const bw = roundCoord(Math.max(2, Math.abs(valX - zeroX)));
        const by = roundCoord(groupY + sIdx * (subHeight + gap));
        const labelX = dir === 'rtl' ? roundCoord(bx - 6) : roundCoord(bx + bw + 6);
        bars.push({
          key: `${s.id}__${cat.id}`,
          categoryLabel: cat.label,
          seriesLabel: s.label,
          value: val,
          x: bx,
          y: by,
          width: bw,
          height: roundCoord(subHeight),
          fill: usePatterns ? `url(#${patterns[sIdx]!.id})` : getVizToken(sIdx, s.toneIndex),
          labelX,
          labelY: roundCoord(by + subHeight / 2 + 4),
          labelAnchor: 'start',
        });
      });
    });
  }

  const activeBar = bars.find((b) => b.key === activeKey);
  const readoutText = activeBar
    ? series.length > 1
      ? m.pointReadout(activeBar.seriesLabel, activeBar.categoryLabel, formatValue(activeBar.value))
      : m.singlePointReadout(activeBar.categoryLabel, formatValue(activeBar.value))
    : m.inspectHint;

  const handleKeyDown = (e: KeyboardEvent<SVGGElement>, idx: number) => {
    let step = 0;
    if (isHorizontal) {
      if (e.key === 'ArrowDown') step = 1;
      else if (e.key === 'ArrowUp') step = -1;
    } else {
      if (e.key === 'ArrowLeft') step = dir === 'rtl' ? 1 : -1;
      else if (e.key === 'ArrowRight') step = dir === 'rtl' ? -1 : 1;
    }
    if (step !== 0 && bars.length > 0) {
      e.preventDefault();
      const next = (idx + step + bars.length) % bars.length;
      barRefs.current[next]?.focus();
      setActiveKey(bars[next]?.key ?? null);
    }
  };

  return (
    <div
      ref={ref}
      data-nds="Bar"
      data-orientation={orientation}
      data-dir={dir}
      className={cx(styles.root, className)}
    >
      <div className={styles.svgWrap}>
        {/* biome-ignore lint/a11y/useSemanticElements: SVG chart holds interactive SVG bars and cannot be a fieldset */}
        <svg
          className={styles.svg}
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          role="group"
          aria-label={ariaLabel}
        >
          <title>{ariaLabel}</title>
          {usePatterns && <SeriesPatternDefs patterns={patterns} />}
          {bandElements}
          {gridElements}
          {axisElements}

          {bars.map((bar, idx) => {
            const isActive = activeKey === bar.key;
            const label =
              series.length > 1
                ? m.pointReadout(bar.seriesLabel, bar.categoryLabel, formatValue(bar.value))
                : m.singlePointReadout(bar.categoryLabel, formatValue(bar.value));
            return (
              // biome-ignore lint/a11y/useSemanticElements: SVG bar trigger cannot use HTML <button> inside <svg>
              <g
                key={bar.key}
                ref={(el) => {
                  barRefs.current[idx] = el;
                }}
                role="button"
                tabIndex={0}
                aria-label={label}
                data-active={isActive || undefined}
                className={styles.barGroup}
                onFocus={() => setActiveKey(bar.key)}
                onMouseEnter={() => setActiveKey(bar.key)}
                onClick={() => setActiveKey(bar.key)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
              >
                <rect
                  x={bar.x}
                  y={bar.y}
                  width={bar.width}
                  height={bar.height}
                  rx={3}
                  fill={bar.fill}
                  className={styles.barRect}
                />
                {showDirectLabels && (
                  <text
                    x={bar.labelX}
                    y={bar.labelY}
                    textAnchor={bar.labelAnchor}
                    className={styles.valueLabel}
                  >
                    {formatValue(bar.value)}
                  </text>
                )}
              </g>
            );
          })}

          {refElements}
        </svg>
      </div>

      {showReadout && (
        <div className={styles.readout} role="status" aria-live="polite">
          {readoutText}
        </div>
      )}
    </div>
  );
}
