import {
  iconArrowDown,
  iconArrowUp,
  iconMinus,
  type IconDefinition,
} from '@negaresh/icons';
import { formatNumber, formatPercent, formatToman } from '@negaresh/utils';
import type { ReactNode, Ref } from 'react';
import { Button as RacButton, Link as RacLink } from 'react-aria-components';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { Skeleton } from '../Skeleton/Skeleton.tsx';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden.tsx';
import styles from './StatTile.module.css';

export type StatDeltaDirection = 'up' | 'down' | 'neutral';
export type StatDeltaSentiment = 'positive' | 'negative' | 'neutral';
export type StatValueFormat = 'number' | 'toman' | 'percent';
export type StatDensity = 'comfortable' | 'compact';

export interface StatDelta {
  /** Change figure (numbers are formatted to Persian digits via `@negaresh/utils`). */
  value: number | string;
  /** Direction arrow icon shown alongside the value (never colour alone). */
  direction: StatDeltaDirection;
  /** Semantic tone; defaults to `positive` for `up`, `negative` for `down`, `neutral` for `neutral`. */
  sentiment?: StatDeltaSentiment | undefined;
  /** Optional short comparison label, e.g. «نسبت به ماه قبل». */
  label?: ReactNode | undefined;
  /** Optional accessible direction prefix override for screen readers. */
  srLabel?: string | undefined;
}

export interface StatTileProps {
  /** Metric label shown at the top of the tile. */
  label: ReactNode;
  /** Primary metric value; numeric values format automatically in Persian digits with `tabular-nums`. */
  value: number | ReactNode;
  /** Formatting mode when `value` is a number. Default `'number'`. */
  format?: StatValueFormat | undefined;
  /** Optional unit shown beside the value (e.g. «سریال» or «نفر»). */
  unit?: ReactNode | undefined;
  /** Optional supporting caption beneath the metric. */
  helperText?: ReactNode | undefined;
  /** Trend delta with direction icon, text, and accessible direction word (never colour alone). */
  delta?: StatDelta | undefined;
  /** Optional calm icon shown at the inline end of the header. */
  icon?: IconDefinition | undefined;
  /**
   * Optional sparkline slot for P5 `@negaresh/charts` `<Sparkline />`, keeping `@negaresh/react`
   * free of chart dependencies (docs/03-architecture.md).
   */
  sparkline?: ReactNode | undefined;
  /** Renders skeleton placeholders with `aria-busy="true"`. */
  isLoading?: boolean | undefined;
  /** Spacing density. Default `'comfortable'`. */
  density?: StatDensity | undefined;
  /** Makes the tile a navigable link when provided. */
  href?: string | undefined;
  /** Makes the tile an interactive button when provided (and `href` is omitted). */
  onPress?: (() => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

function formatStatValue(value: number | ReactNode, format: StatValueFormat): ReactNode {
  if (typeof value !== 'number') return value;
  switch (format) {
    case 'toman':
      return formatToman(value);
    case 'percent':
      return formatPercent(value);
    case 'number':
      return formatNumber(value, { maximumFractionDigits: 2 });
  }
}

function resolveDeltaIcon(direction: StatDeltaDirection): IconDefinition {
  if (direction === 'up') return iconArrowUp;
  if (direction === 'down') return iconArrowDown;
  return iconMinus;
}

function resolveDefaultSentiment(direction: StatDeltaDirection): StatDeltaSentiment {
  if (direction === 'up') return 'positive';
  if (direction === 'down') return 'negative';
  return 'neutral';
}

/**
 * KPI / metric tile displaying a Persian-formatted `tabular-nums` figure, an icon+text delta
 * indicator (never colour alone), and a `sparkline?: ReactNode` slot for P5 `@negaresh/charts`.
 */
export function StatTile({
  label,
  value,
  format = 'number',
  unit,
  helperText,
  delta,
  icon,
  sparkline,
  isLoading = false,
  density = 'comfortable',
  href,
  onPress,
  className,
  ref,
}: StatTileProps) {
  const m = useNdsMessages();
  const formattedValue = formatStatValue(value, format);

  const deltaSentiment = delta ? (delta.sentiment ?? resolveDefaultSentiment(delta.direction)) : undefined;
  const deltaSrPrefix = delta
    ? (delta.srLabel ??
      (delta.direction === 'up'
        ? m.statDeltaUp
        : delta.direction === 'down'
          ? m.statDeltaDown
          : m.statDeltaNeutral))
    : undefined;
  const formattedDeltaValue =
    delta && typeof delta.value === 'number'
      ? formatNumber(delta.value, { maximumFractionDigits: 1 })
      : delta?.value;

  const content = (
    <>
      <div className={cx(styles.header)}>
        <span className={cx(styles.label)}>{label}</span>
        {icon && (
          <span className={cx(styles.iconWrap)} aria-hidden="true">
            <Icon icon={icon} size="sm" />
          </span>
        )}
      </div>

      {isLoading ? (
        <Skeleton variant="text" lines={2} />
      ) : (
        <>
          <div className={cx(styles.body)}>
            <div className={cx(styles.valueWrap)}>
              <span className={cx(styles.value)}>{formattedValue}</span>
              {unit !== undefined && unit !== null && (
                <span className={cx(styles.unit)}>{unit}</span>
              )}
            </div>
            {sparkline !== undefined && sparkline !== null && (
              <div className={cx(styles.sparkline)} data-nds-slot="sparkline">
                {sparkline}
              </div>
            )}
          </div>

          {(delta || helperText !== undefined) && (
            <div className={cx(styles.footer)}>
              {delta && (
                <span
                  className={cx(styles.delta)}
                  data-direction={delta.direction}
                  data-sentiment={deltaSentiment}
                >
                  <Icon icon={resolveDeltaIcon(delta.direction)} size="sm" />
                  <VisuallyHidden>{`${deltaSrPrefix}: `}</VisuallyHidden>
                  <span>{formattedDeltaValue}</span>
                </span>
              )}
              {(delta?.label !== undefined || helperText !== undefined) && (
                <p className={cx(styles.helper)}>{delta?.label ?? helperText}</p>
              )}
            </div>
          )}
        </>
      )}
    </>
  );

  if (href !== undefined) {
    return (
      <RacLink
        ref={ref as Ref<HTMLAnchorElement> | undefined}
        href={href}
        data-nds="StatTile"
        data-density={density}
        aria-busy={isLoading || undefined}
        className={cx(styles.tile, styles.interactive, className)}
      >
        {content}
      </RacLink>
    );
  }

  if (onPress !== undefined) {
    return (
      <RacButton
        ref={ref as Ref<HTMLButtonElement> | undefined}
        onPress={onPress}
        data-nds="StatTile"
        data-density={density}
        aria-busy={isLoading || undefined}
        className={cx(styles.tile, styles.interactive, className)}
      >
        {content}
      </RacButton>
    );
  }

  return (
    <div
      ref={ref as Ref<HTMLDivElement> | undefined}
      data-nds="StatTile"
      data-density={density}
      aria-busy={isLoading || undefined}
      className={cx(styles.tile, className)}
    >
      {content}
    </div>
  );
}

export interface StatGroupProps {
  /** Responsive desktop column count (`2`, `3`, `4`, or `'auto'`). Collapses gracefully below 900 px. Default `'auto'`. */
  columns?: 2 | 3 | 4 | 'auto' | undefined;
  /** Accessible group label (sets `role="group"` when provided). */
  'aria-label'?: string | undefined;
  'aria-labelledby'?: string | undefined;
  children: ReactNode;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/** Responsive grid container for `<StatTile>` metrics. */
export function StatGroup({
  columns = 'auto',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  className,
  ref,
}: StatGroupProps) {
  const hasLabel = ariaLabel !== undefined || ariaLabelledBy !== undefined;
  return (
    <div
      ref={ref}
      {...(hasLabel ? { role: 'group' as const } : {})}
      {...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {})}
      {...(ariaLabelledBy !== undefined ? { 'aria-labelledby': ariaLabelledBy } : {})}
      data-nds="StatGroup"
      data-columns={String(columns)}
      className={cx(styles.group, className)}
    >
      {children}
    </div>
  );
}
