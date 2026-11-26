import type { Ref } from 'react';
import { cx } from '../internal/cx.ts';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden.tsx';
import styles from './Spinner.module.css';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerTone = 'current' | 'accent' | 'muted' | 'inverse';

export interface SpinnerProps {
  /** Ring diameter: `sm` (16 px), `md` (20 px), `lg` (24 px). Default `'md'`. */
  size?: SpinnerSize | undefined;
  /** Colour tone. Default `'accent'`. Use `'current'` to inherit surrounding text colour. */
  tone?: SpinnerTone | undefined;
  /** Screen-reader status label. Defaults to `messages.loading`. Ignored when `decorative` is `true`. */
  label?: string | undefined;
  /** Hide from assistive technology when paired with visible loading text. Default `false`. */
  decorative?: boolean | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLSpanElement> | undefined;
}

/**
 * Compact circular loading indicator. Announces `role="status"` with a localized Persian
 * label unless marked `decorative`. Slows rotation under `prefers-reduced-motion: reduce`.
 */
export function Spinner({
  size = 'md',
  tone = 'accent',
  label,
  decorative = false,
  className,
  ref,
}: SpinnerProps) {
  const messages = useNdsMessages();
  const statusProps = decorative
    ? { 'aria-hidden': true as const }
    : { role: 'status' as const };

  return (
    <span
      ref={ref}
      {...statusProps}
      data-nds="Spinner"
      data-size={size}
      data-tone={tone}
      className={cx(styles.spinner, className)}
    >
      <span className={cx(styles.ring)} aria-hidden="true" />
      {!decorative && <VisuallyHidden>{label ?? messages.loading}</VisuallyHidden>}
    </span>
  );
}

export interface GlobalLoadingBarProps {
  /** Whether the page-level loading bar is active. Renders `null` when `false`. */
  isLoading: boolean;
  /** Optional determinate percentage (`0`–`100`). Omit for indeterminate navigation progress. */
  value?: number | undefined;
  /** Accessible name for `role="progressbar"`. Defaults to `messages.globalLoadingLabel`. */
  label?: string | undefined;
  /** `'fixed'` pins to the top of the viewport (`--nds-z-toast`); `'static'` embeds in place. Default `'fixed'`. */
  position?: 'fixed' | 'static' | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/**
 * Slim page-level loading bar for route transitions and global refreshes.
 * Respects RTL flow, `prefers-reduced-motion: reduce`, and `forced-colors: active`.
 */
export function GlobalLoadingBar({
  isLoading,
  value,
  label,
  position = 'fixed',
  className,
  ref,
}: GlobalLoadingBarProps) {
  const messages = useNdsMessages();
  if (!isLoading) return null;

  const isDeterminate = value !== undefined && Number.isFinite(value);
  const clamped = isDeterminate ? Math.min(100, Math.max(0, value)) : undefined;

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-label={label ?? messages.globalLoadingLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      {...(clamped !== undefined ? { 'aria-valuenow': Math.round(clamped) } : {})}
      data-nds="GlobalLoadingBar"
      data-position={position}
      className={cx(styles.globalBar, className)}
    >
      <span
        className={cx(styles.globalFill, !isDeterminate && styles.globalIndeterminate)}
        style={clamped !== undefined ? { inlineSize: `${clamped}%` } : undefined}
      />
    </div>
  );
}
