import { type KeyboardEvent, type Ref, useRef, useState } from 'react';
import type { ChartTableData } from '../ChartFrame/ChartFrame.tsx';
import { cx } from '../internal/cx.ts';
import {
  type ChartDirection,
  type ChartMode,
  type ChartSeverity,
  createHorizontalLinearScale,
  formatChartNumber,
  resolveTicks,
  roundCoord,
  severityStrokeToken,
} from '../internal/scale.ts';
import { useChartMessages } from '../messages/context.tsx';
import type { ChartMessages } from '../messages/types.ts';
import { Band } from '../primitives/Band.tsx';
import { ReferenceLine } from '../primitives/ReferenceLine.tsx';
import type { BandSpec, ReferenceLineSpec } from '../primitives/types.ts';
import styles from './IntervalBar.module.css';

export interface IntervalBarItem {
  id: string;
  /** Scale or dimension name displayed at inline-start. */
  label: string;
  /** Optional subtitle (e.g. clinical scale code or brief descriptor). */
  description?: string | undefined;
  /** Point estimate on the numeric scale. */
  value: number;
  /** Optional lower confidence interval bound. */
  low?: number | undefined;
  /** Optional upper confidence interval bound. */
  high?: number | undefined;
  /** Optional explicit band/status word (overrides default severity word). */
  bandLabel?: string | undefined;
  /** Semantic severity level. Rendered without rose in `calm` mode. */
  severity?: ChartSeverity | undefined;
}

export interface IntervalBarProps {
  /** One or more score items to display as horizontal interval bars. */
  items: readonly IntervalBarItem[];
  /** Numeric axis bounds `[min, max]`, e.g. `[20, 90]` for T-scores. */
  domain: readonly [number, number];
  /** Explicit axis tick values. Defaults to `d3-scale` ticks. */
  ticks?: readonly number[] | undefined;
  /** Shaded norm/reference bands along the numeric axis. */
  bands?: readonly BandSpec[] | undefined;
  /** Vertical reference lines (norm mean, clinical cut-offs). */
  referenceLines?: readonly ReferenceLineSpec[] | undefined;
  /** Audience mode: `'professional'` (status tokens) or `'calm'` (neutral/teal, no rose). Default `'professional'`. */
  mode?: ChartMode | undefined;
  /** Axis reading direction (`'rtl'` puts low at right / inline-start). Default `'rtl'`. */
  dir?: ChartDirection | undefined;
  /** Custom numeric formatter. Defaults to Persian digits via `@negaresh/utils`. */
  formatValue?: ((value: number) => string) | undefined;
  /** Accessible name for the chart region. */
  ariaLabel: string;
  /** Show live detail readout bar below the chart. Default `true`. */
  showReadout?: boolean | undefined;
  /** Called when a user activates a row marker with pointer or Enter/Space. */
  onSelectItem?: ((item: IntervalBarItem) => void) | undefined;
  /** Optional per-chart message overrides. */
  messages?: Partial<ChartMessages> | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

const TRACK_WIDTH = 360;
const TRACK_PAD_X = 12;
const TRACK_HEIGHT = 34;
const TRACK_BAR_TOP = 6;
const TRACK_BAR_HEIGHT = 22;
const AXIS_HEIGHT = 36;

function badgeToneFor(severity: ChartSeverity | undefined, mode: ChartMode): string {
  if (!severity) return 'neutral';
  if (mode === 'calm') {
    return severity === 'severe' ? 'calm-highlight' : 'neutral';
  }
  return severity;
}

function resolveBandWord(
  item: IntervalBarItem,
  mode: ChartMode,
  m: ChartMessages,
): string | undefined {
  if (item.bandLabel !== undefined) return item.bandLabel;
  if (!item.severity) return undefined;
  return mode === 'calm' ? m.severityCalm[item.severity] : m.severityProfessional[item.severity];
}

/** Builds a ready-to-render `ChartTableData` alternative for `<ChartFrame table={...} />`. */
export function buildIntervalBarTable(
  items: readonly IntervalBarItem[],
  options: {
    mode?: ChartMode | undefined;
    caption?: string | undefined;
    formatValue?: ((value: number) => string) | undefined;
    messages?: ChartMessages | undefined;
  } = {},
): ChartTableData {
  const mode = options.mode ?? 'professional';
  const fmt = options.formatValue ?? formatChartNumber;
  const hasIntervals = items.some((i) => i.low !== undefined && i.high !== undefined);
  const columns = [
    { key: 'scale', label: options.messages?.columnScale ?? 'مقیاس' },
    { key: 'value', label: options.messages?.columnValue ?? 'مقدار', align: 'numeric' as const },
    ...(hasIntervals
      ? [
          {
            key: 'interval',
            label: options.messages?.columnInterval ?? 'بازهٔ اطمینان',
            align: 'numeric' as const,
          },
        ]
      : []),
    { key: 'band', label: options.messages?.columnBand ?? 'بازه / وضعیت' },
  ];

  const rows = items.map((item) => {
    const bandWord =
      item.bandLabel ??
      (item.severity && options.messages
        ? mode === 'calm'
          ? options.messages.severityCalm[item.severity]
          : options.messages.severityProfessional[item.severity]
        : (options.messages?.missingValue ?? '—'));
    const intervalText =
      item.low !== undefined && item.high !== undefined
        ? options.messages
          ? options.messages.rangeBetween(fmt(item.low), fmt(item.high))
          : `${fmt(item.low)} تا ${fmt(item.high)}`
        : (options.messages?.missingValue ?? '—');

    return {
      id: item.id,
      cells: {
        scale: item.label,
        value: fmt(item.value),
        ...(hasIntervals ? { interval: intervalText } : {}),
        band: bandWord,
      },
    };
  });

  return {
    ...(options.caption !== undefined ? { caption: options.caption } : {}),
    columns,
    rows,
  };
}

/**
 * NDS signature horizontal psychometric chart: displays one or more scores with optional
 * confidence intervals, norm bands, reference lines, and calm/professional severity scales.
 */
export function IntervalBar({
  items,
  domain,
  ticks,
  bands,
  referenceLines,
  mode = 'professional',
  dir = 'rtl',
  formatValue = formatChartNumber,
  ariaLabel,
  showReadout = true,
  onSelectItem,
  messages,
  className,
  ref,
}: IntervalBarProps) {
  const m = useChartMessages(messages);
  const [activeId, setActiveId] = useState<string | null>(null);
  const triggerRefs = useRef<(SVGGElement | null)[]>([]);

  const scale = createHorizontalLinearScale(domain, TRACK_PAD_X, TRACK_WIDTH - TRACK_PAD_X, dir);
  const resolvedTicks = resolveTicks(scale, ticks, 5);
  const activeItem = items.find((i) => i.id === activeId);

  const handleKeyDown = (e: KeyboardEvent<SVGGElement>, index: number, item: IntervalBarItem) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const delta = e.key === 'ArrowDown' ? 1 : -1;
      const next = (index + delta + items.length) % items.length;
      triggerRefs.current[next]?.focus();
      setActiveId(items[next]?.id ?? null);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveId(item.id);
      onSelectItem?.(item);
    }
  };

  const activeReadout = activeItem
    ? m.intervalReadout(
        activeItem.label,
        formatValue(activeItem.value),
        activeItem.low !== undefined ? formatValue(activeItem.low) : undefined,
        activeItem.high !== undefined ? formatValue(activeItem.high) : undefined,
        resolveBandWord(activeItem, mode, m),
      )
    : m.inspectHint;

  return (
    // biome-ignore lint/a11y/useSemanticElements: chart container is a non-form graphic group, not a form fieldset
    <div
      ref={ref}
      role="group"
      aria-label={ariaLabel}
      data-nds="IntervalBar"
      data-mode={mode}
      data-dir={dir}
      className={cx(styles.root, className)}
    >
      <div className={styles.rows}>
        {items.map((item, idx) => {
          const pointX = roundCoord(scale(item.value));
          const hasInterval = item.low !== undefined && item.high !== undefined;
          const lowX = hasInterval ? roundCoord(scale(item.low!)) : pointX;
          const highX = hasInterval ? roundCoord(scale(item.high!)) : pointX;
          const midY = roundCoord(TRACK_HEIGHT / 2);
          const stroke = severityStrokeToken(item.severity, mode);
          const bandWord = resolveBandWord(item, mode, m);
          const isActive = activeId === item.id;
          const readoutLabel = m.intervalReadout(
            item.label,
            formatValue(item.value),
            item.low !== undefined ? formatValue(item.low) : undefined,
            item.high !== undefined ? formatValue(item.high) : undefined,
            bandWord,
          );

          return (
            <div key={item.id} className={styles.row} data-active={isActive || undefined}>
              <div className={styles.labelCell}>
                <span className={styles.labelText}>{item.label}</span>
                {item.description !== undefined && (
                  <span className={styles.subLabel}>{item.description}</span>
                )}
              </div>

              <div className={styles.trackCell}>
                {/* biome-ignore lint/a11y/useSemanticElements: SVG plot area holds interactive SVG markers and cannot be a fieldset */}
                <svg
                  className={styles.trackSvg}
                  viewBox={`0 0 ${TRACK_WIDTH} ${TRACK_HEIGHT}`}
                  role="group"
                  aria-label={readoutLabel}
                >
                  <title>{readoutLabel}</title>
                  <rect
                    x={TRACK_PAD_X}
                    y={TRACK_BAR_TOP}
                    width={TRACK_WIDTH - TRACK_PAD_X * 2}
                    height={TRACK_BAR_HEIGHT}
                    rx={4}
                    className={styles.trackBg}
                  />

                  {bands?.map((band) => (
                    <Band
                      key={`band-${band.from}-${band.to}-${band.tone ?? 'band'}-${band.label ?? ''}`}
                      orientation="vertical"
                      fromCoord={scale(band.from)}
                      toCoord={scale(band.to)}
                      spanStart={TRACK_BAR_TOP + 1}
                      spanEnd={TRACK_BAR_TOP + TRACK_BAR_HEIGHT - 1}
                      tone={band.tone}
                      mode={mode}
                    />
                  ))}

                  {resolvedTicks.map((tick) => {
                    const tx = roundCoord(scale(tick));
                    return (
                      <line
                        key={`grid-${tick}`}
                        x1={tx}
                        y1={TRACK_BAR_TOP}
                        x2={tx}
                        y2={TRACK_BAR_TOP + TRACK_BAR_HEIGHT}
                        className={styles.gridLine}
                      />
                    );
                  })}

                  {referenceLines?.map((refLine) => (
                    <ReferenceLine
                      key={`ref-${refLine.value}-${refLine.label ?? ''}`}
                      orientation="vertical"
                      position={scale(refLine.value)}
                      start={TRACK_BAR_TOP - 2}
                      end={TRACK_BAR_TOP + TRACK_BAR_HEIGHT + 2}
                      tone={refLine.tone}
                      mode={mode}
                      lineStyle={refLine.lineStyle}
                    />
                  ))}

                  {/* biome-ignore lint/a11y/useSemanticElements: SVG point marker cannot use HTML <button> inside <svg> */}
                  <g
                    ref={(el) => {
                      triggerRefs.current[idx] = el;
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={readoutLabel}
                    data-active={isActive || undefined}
                    className={styles.pointTrigger}
                    onFocus={() => setActiveId(item.id)}
                    onMouseEnter={() => setActiveId(item.id)}
                    onClick={() => {
                      setActiveId(item.id);
                      onSelectItem?.(item);
                    }}
                    onKeyDown={(e) => handleKeyDown(e, idx, item)}
                  >
                    <rect
                      x={roundCoord(Math.min(lowX, highX, pointX) - 10)}
                      y={2}
                      width={roundCoord(Math.abs(highX - lowX) + 20)}
                      height={TRACK_HEIGHT - 4}
                      fill="transparent"
                    />
                    {hasInterval && (
                      <>
                        <line
                          x1={lowX}
                          y1={midY}
                          x2={highX}
                          y2={midY}
                          stroke={stroke}
                          className={styles.whiskerLine}
                        />
                        <line
                          x1={lowX}
                          y1={midY - 5}
                          x2={lowX}
                          y2={midY + 5}
                          stroke={stroke}
                          className={styles.whiskerCap}
                        />
                        <line
                          x1={highX}
                          y1={midY - 5}
                          x2={highX}
                          y2={midY + 5}
                          stroke={stroke}
                          className={styles.whiskerCap}
                        />
                      </>
                    )}
                    <circle cx={pointX} cy={midY} r={9} className={styles.focusHalo} />
                    <circle
                      cx={pointX}
                      cy={midY}
                      r={5.5}
                      fill={stroke}
                      stroke="var(--nds-bg-surface)"
                      strokeWidth={2}
                    />
                  </g>
                </svg>
              </div>

              <div className={styles.valueCell}>
                <span className={styles.scoreNum}>{formatValue(item.value)}</span>
                {bandWord !== undefined && (
                  <span
                    className={styles.bandBadge}
                    data-tone={badgeToneFor(item.severity, mode)}
                  >
                    {bandWord}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.axisRow} aria-hidden="true">
        <span className={styles.axisSpacer} />
        <div className={styles.trackCell}>
          <svg
            className={styles.axisSvg}
            viewBox={`0 0 ${TRACK_WIDTH} ${AXIS_HEIGHT}`}
            aria-hidden="true"
          >
            <line
              x1={TRACK_PAD_X}
              y1={4}
              x2={TRACK_WIDTH - TRACK_PAD_X}
              y2={4}
              className={styles.gridLine}
            />
            {resolvedTicks.map((tick) => {
              const tx = roundCoord(scale(tick));
              return (
                <g key={`tick-${tick}`}>
                  <line x1={tx} y1={4} x2={tx} y2={9} className={styles.gridLine} />
                  <text x={tx} y={22} textAnchor="middle" className={styles.tickText}>
                    {formatValue(tick)}
                  </text>
                </g>
              );
            })}
            {referenceLines?.map((refLine) => {
              if (!refLine.label) return null;
              const rx = roundCoord(scale(refLine.value));
              return (
                <text
                  key={`ref-lbl-${refLine.value}-${refLine.label}`}
                  x={rx}
                  y={34}
                  textAnchor="middle"
                  className={styles.tickText}
                >
                  {refLine.label}
                </text>
              );
            })}
          </svg>
        </div>
        <span className={styles.axisSpacer} />
      </div>

      {showReadout && (
        <div className={styles.readout} role="status" aria-live="polite">
          {activeReadout}
        </div>
      )}
    </div>
  );
}
