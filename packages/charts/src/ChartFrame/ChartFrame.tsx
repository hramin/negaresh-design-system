import { iconChevronDown } from '@negaresh/icons';
import {
  Button,
  EmptyState,
  Heading,
  Icon,
  InlineAlert,
  Skeleton,
  VisuallyHidden,
} from '@negaresh/react';
import type { ReactNode, Ref } from 'react';
import { cx } from '../internal/cx.ts';
import { type MarkerShape, PointMarker } from '../internal/markers.tsx';
import { getVizToken, type VizToneIndex } from '../internal/scale.ts';
import { useChartMessages } from '../messages/context.tsx';
import type { ChartMessages } from '../messages/types.ts';
import styles from './ChartFrame.module.css';

export interface ChartLegendItem {
  id: string;
  label: ReactNode;
  /** 1-based semantic `--nds-viz-*` palette index. */
  toneIndex?: VizToneIndex | undefined;
  /** Optional semantic CSS variable override (e.g. `var(--nds-accent-default)`). */
  color?: string | undefined;
  /** Optional stroke-dasharray matching the series line. */
  dashArray?: string | undefined;
  /** Optional non-diamond vertex shape matching the series markers. */
  shape?: MarkerShape | undefined;
}

export interface ChartTableColumn {
  key: string;
  label: ReactNode;
  align?: 'start' | 'end' | 'numeric' | undefined;
}

export interface ChartTableRow {
  id: string;
  cells: Record<string, ReactNode>;
}

export interface ChartTableData {
  caption?: string | undefined;
  columns: readonly ChartTableColumn[];
  rows: readonly ChartTableRow[];
}

export type ChartFrameState = 'ready' | 'loading' | 'empty' | 'error';
export type ChartTableMode = 'toggle' | 'visible' | 'sr-only';

export interface ChartFrameProps {
  /** Concise chart title (required per docs/foundations/data-viz.md). */
  title: ReactNode;
  /** Heading level for the title (`2`–`6`). Default `3`. */
  headingLevel?: 2 | 3 | 4 | 5 | 6 | undefined;
  /** One-sentence key takeaway explaining what the reader should notice. */
  takeaway?: ReactNode | undefined;
  /** Optional legend entries showing both colour and dash/shape cues. */
  legend?: readonly ChartLegendItem[] | undefined;
  /** Norm or data source note shown in the footer. */
  sourceNote?: ReactNode | undefined;
  /** Optional header action controls (e.g. audience mode switch). */
  actions?: ReactNode | undefined;
  /** Async / data availability state. Default `'ready'`. */
  state?: ChartFrameState | undefined;
  /** Accessible data table alternative. */
  table?: ChartTableData | undefined;
  /**
   * How the data table alternative is presented:
   * - `'toggle'`: native `<details>` disclosure (works without JS, 44 px target)
   * - `'visible'`: always rendered visibly (recommended for `Radar`)
   * - `'sr-only'`: rendered inside `<VisuallyHidden>` for screen readers
   * Default `'toggle'`.
   */
  tableMode?: ChartTableMode | undefined;
  /** Initial expanded state when `tableMode="toggle"`. Default `false`. */
  tableDefaultOpen?: boolean | undefined;
  /** Custom empty-state copy overrides. */
  emptyTitle?: string | undefined;
  emptyDescription?: string | undefined;
  /** Custom error-state copy overrides. */
  errorTitle?: string | undefined;
  errorDescription?: string | undefined;
  /** Optional retry action rendered in `state="error"`. */
  onRetry?: (() => void) | undefined;
  /** Optional per-chart message overrides. */
  messages?: Partial<ChartMessages> | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

function DataTable({
  table,
  fallbackCaption,
}: {
  table: ChartTableData;
  fallbackCaption: string;
}) {
  return (
    <table className={styles.table}>
      <caption>{table.caption ?? fallbackCaption}</caption>
      <thead>
        <tr>
          {table.columns.map((col) => (
            <th
              key={col.key}
              scope="col"
              className={cx(
                col.align === 'numeric' && styles.cellNumeric,
                col.align === 'end' && styles.cellEnd,
              )}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.rows.map((row) => (
          <tr key={row.id}>
            {table.columns.map((col, colIndex) => {
              const cell = row.cells[col.key];
              const cls = cx(
                col.align === 'numeric' && styles.cellNumeric,
                col.align === 'end' && styles.cellEnd,
              );
              if (colIndex === 0) {
                return (
                  <th key={col.key} scope="row" className={cls}>
                    {cell}
                  </th>
                );
              }
              return (
                <td key={col.key} className={cls}>
                  {cell}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * Accessible figure frame for every NDS chart: title, one-sentence takeaway, optional legend,
 * source/norm note, loading/empty/error states, and a JS-free accessible data table alternative.
 */
export function ChartFrame({
  title,
  headingLevel = 3,
  takeaway,
  legend,
  sourceNote,
  actions,
  state = 'ready',
  table,
  tableMode = 'toggle',
  tableDefaultOpen = false,
  emptyTitle,
  emptyDescription,
  errorTitle,
  errorDescription,
  onRetry,
  messages,
  children,
  className,
  ref,
}: ChartFrameProps) {
  const m = useChartMessages(messages);
  const hasTable = table !== undefined && table.rows.length > 0 && state === 'ready';
  const showFooter = sourceNote !== undefined || (hasTable && tableMode !== 'sr-only');

  return (
    <figure
      ref={ref}
      data-nds="ChartFrame"
      data-state={state}
      className={cx(styles.frame, className)}
    >
      <figcaption className={styles.header}>
        <div className={styles.headingGroup}>
          <Heading level={headingLevel} className={styles.title}>
            {title}
          </Heading>
          {takeaway !== undefined && <p className={styles.takeaway}>{takeaway}</p>}
        </div>
        {actions !== undefined && <div className={styles.actions}>{actions}</div>}
      </figcaption>

      {legend && legend.length > 0 && state === 'ready' && (
        <ul className={styles.legend} aria-label={m.legendLabel}>
          {legend.map((item, idx) => {
            const color = item.color ?? getVizToken(idx, item.toneIndex);
            return (
              <li key={item.id} className={styles.legendItem}>
                <svg
                  className={styles.legendSwatch}
                  viewBox="0 0 24 12"
                  width="24"
                  height="12"
                  aria-hidden="true"
                >
                  {item.dashArray !== undefined || item.shape !== undefined ? (
                    <>
                      <line
                        x1="1"
                        y1="6"
                        x2="23"
                        y2="6"
                        stroke={color}
                        strokeWidth="2.2"
                        strokeDasharray={item.dashArray}
                      />
                      {item.shape && (
                        <PointMarker shape={item.shape} cx={12} cy={6} radius={3.4} color={color} />
                      )}
                    </>
                  ) : (
                    <rect x="3" y="2" width="18" height="8" rx="2" fill={color} />
                  )}
                </svg>
                <span>{item.label}</span>
              </li>
            );
          })}
        </ul>
      )}

      <div className={styles.body} aria-busy={state === 'loading' || undefined}>
        {state === 'loading' && (
          <div className={styles.loading} role="status">
            <VisuallyHidden>{m.loadingChart}</VisuallyHidden>
            <Skeleton variant="block" size="lg" />
            <Skeleton variant="text" lines={2} />
          </div>
        )}

        {state === 'empty' && (
          <EmptyState
            title={emptyTitle ?? m.emptyTitle}
            description={emptyDescription ?? m.emptyDescription}
          />
        )}

        {state === 'error' && (
          <InlineAlert
            tone="danger"
            title={errorTitle ?? m.errorTitle}
            actions={
              onRetry ? (
                <Button variant="secondary" size="sm" onPress={onRetry}>
                  {m.retry}
                </Button>
              ) : undefined
            }
          >
            {errorDescription ?? m.errorDescription}
          </InlineAlert>
        )}

        {state === 'ready' && children}
      </div>

      {hasTable && tableMode === 'sr-only' && (
        <VisuallyHidden>
          <DataTable table={table} fallbackCaption={m.dataTableCaption} />
        </VisuallyHidden>
      )}

      {showFooter && (
        <div className={styles.footer}>
          {hasTable && tableMode === 'visible' && (
            <section
              className={styles.tableWrapVisible}
              aria-label={
                typeof title === 'string'
                  ? `${title} — ${table.caption ?? m.dataTableCaption}`
                  : (table.caption ?? m.dataTableCaption)
              }
              // biome-ignore lint/a11y/noNoninteractiveTabindex: scrollable table container requires keyboard access on mobile (WCAG 2.1.1)
              tabIndex={0}
            >
              <DataTable table={table} fallbackCaption={m.dataTableCaption} />
            </section>
          )}

          {hasTable && tableMode === 'toggle' && (
            <details className={styles.disclosure} open={tableDefaultOpen || undefined}>
              <summary className={styles.summary}>
                <span>{m.dataTableToggle}</span>
                <span className={styles.chevron} aria-hidden="true">
                  <Icon icon={iconChevronDown} size="sm" />
                </span>
              </summary>
              <section
                className={styles.tableWrap}
                aria-label={
                  typeof title === 'string'
                    ? `${title} — ${table.caption ?? m.dataTableCaption}`
                    : (table.caption ?? m.dataTableCaption)
                }
                // biome-ignore lint/a11y/noNoninteractiveTabindex: scrollable table container requires keyboard access on mobile (WCAG 2.1.1)
                tabIndex={0}
              >
                <DataTable table={table} fallbackCaption={m.dataTableCaption} />
              </section>
            </details>
          )}

          {sourceNote !== undefined && <p className={styles.sourceNote}>{sourceNote}</p>}
        </div>
      )}
    </figure>
  );
}
