import { formatPercent } from '@negaresh/utils';
import type { ReactNode, Ref } from 'react';
import {
  Label as RacLabel,
  Meter as RacMeter,
  ProgressBar as RacProgressBar,
} from 'react-aria-components';
import { cx } from '../internal/cx.ts';
import styles from './Progress.module.css';

export type ProgressTone = 'accent' | 'success' | 'warning' | 'danger';
export type ProgressSize = 'sm' | 'md';

export interface ProgressBarProps {
  /** Visible label shown above the track. */
  label?: ReactNode;
  /** Accessible name when `label` is omitted. */
  'aria-label'?: string | undefined;
  /** Current value within `[minValue, maxValue]`. */
  value?: number | undefined;
  /** Minimum value. Default `0`. */
  minValue?: number | undefined;
  /** Maximum value. Default `100`. */
  maxValue?: number | undefined;
  /** Indeterminate loading state (omits `aria-valuenow`). */
  isIndeterminate?: boolean | undefined;
  /** Custom formatted value text (defaults to Persian percentage via `formatPercent`). */
  valueLabel?: ReactNode;
  /** Show the formatted value beside the label when determinate. Default `true`. */
  showValueLabel?: boolean | undefined;
  /** Visual fill tone. Default `'accent'`. */
  tone?: ProgressTone | undefined;
  /** Track thickness. Default `'md'`. */
  size?: ProgressSize | undefined;
  id?: string | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/**
 * Determinate or indeterminate progress indicator built on React Aria `ProgressBar`.
 * Formats Persian percentages by default and respects RTL fill direction and reduced motion.
 */
export function ProgressBar({
  label,
  'aria-label': ariaLabel,
  value = 0,
  minValue = 0,
  maxValue = 100,
  isIndeterminate = false,
  valueLabel,
  showValueLabel = true,
  tone = 'accent',
  size = 'md',
  id,
  className,
  ref,
}: ProgressBarProps) {
  const safePercent =
    !isIndeterminate && maxValue > minValue
      ? Math.min(100, Math.max(0, ((value - minValue) / (maxValue - minValue)) * 100))
      : undefined;
  const computedValueText =
    typeof valueLabel === 'string'
      ? valueLabel
      : safePercent !== undefined
        ? formatPercent(Math.round(safePercent))
        : undefined;

  return (
    <RacProgressBar
      ref={ref}
      {...(id !== undefined ? { id } : {})}
      {...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {})}
      {...(isIndeterminate ? { isIndeterminate: true } : { value, minValue, maxValue })}
      {...(computedValueText !== undefined ? { valueLabel: computedValueText } : {})}
      data-nds="ProgressBar"
      data-tone={tone}
      data-size={size}
      className={cx(styles.root, className)}
    >
      {({ percentage, valueText, isIndeterminate: indeterminate }) => {
        const displayValue = valueLabel ?? computedValueText ?? valueText;
        return (
          <>
            {(label || (!indeterminate && showValueLabel && displayValue)) && (
              <div className={cx(styles.header)}>
                {label ? <RacLabel className={cx(styles.label)}>{label}</RacLabel> : <span />}
                {!indeterminate && showValueLabel && displayValue && (
                  <span className={cx(styles.value)}>{displayValue}</span>
                )}
              </div>
            )}
            <div className={cx(styles.track)}>
              <span
                className={cx(styles.fill, indeterminate && styles.indeterminate)}
                style={
                  indeterminate
                    ? undefined
                    : { inlineSize: `${Math.min(100, Math.max(0, percentage ?? 0))}%` }
                }
              />
            </div>
          </>
        );
      }}
    </RacProgressBar>
  );
}

export interface MeterProps {
  /** Visible label shown above the meter track. */
  label?: ReactNode;
  /** Accessible name when `label` is omitted. */
  'aria-label'?: string | undefined;
  /** Measured scalar value within `[minValue, maxValue]`. */
  value: number;
  /** Minimum value. Default `0`. */
  minValue?: number | undefined;
  /** Maximum value. Default `100`. */
  maxValue?: number | undefined;
  /** Custom formatted value text (defaults to Persian percentage via `formatPercent`). */
  valueLabel?: ReactNode;
  /** Show the formatted value beside the label. Default `true`. */
  showValueLabel?: boolean | undefined;
  /** Visual fill tone. Default `'accent'`. */
  tone?: ProgressTone | undefined;
  /** Track thickness. Default `'md'`. */
  size?: ProgressSize | undefined;
  id?: string | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/**
 * Scalar measurement within a known range built on React Aria `Meter` (`role="meter"`).
 */
export function Meter({
  label,
  'aria-label': ariaLabel,
  value,
  minValue = 0,
  maxValue = 100,
  valueLabel,
  showValueLabel = true,
  tone = 'accent',
  size = 'md',
  id,
  className,
  ref,
}: MeterProps) {
  const safePercent =
    maxValue > minValue
      ? Math.min(100, Math.max(0, ((value - minValue) / (maxValue - minValue)) * 100))
      : 0;
  const computedValueText =
    typeof valueLabel === 'string' ? valueLabel : formatPercent(Math.round(safePercent));

  return (
    <RacMeter
      ref={ref}
      {...(id !== undefined ? { id } : {})}
      {...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {})}
      value={value}
      minValue={minValue}
      maxValue={maxValue}
      valueLabel={computedValueText}
      data-nds="Meter"
      data-tone={tone}
      data-size={size}
      className={cx(styles.root, className)}
    >
      {({ percentage, valueText }) => {
        const displayValue = valueLabel ?? computedValueText ?? valueText;
        return (
          <>
            {(label || (showValueLabel && displayValue)) && (
              <div className={cx(styles.header)}>
                {label ? <RacLabel className={cx(styles.label)}>{label}</RacLabel> : <span />}
                {showValueLabel && displayValue && (
                  <span className={cx(styles.value)}>{displayValue}</span>
                )}
              </div>
            )}
            <div className={cx(styles.track)}>
              <span
                className={cx(styles.fill)}
                style={{ inlineSize: `${Math.min(100, Math.max(0, percentage))}%` }}
              />
            </div>
          </>
        );
      }}
    </RacMeter>
  );
}
