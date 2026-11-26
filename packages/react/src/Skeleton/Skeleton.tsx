import type { Ref } from 'react';
import { cx } from '../internal/cx.ts';
import styles from './Skeleton.module.css';

export type SkeletonVariant = 'text' | 'block' | 'circle' | 'table';
export type SkeletonSize = 'sm' | 'md' | 'lg';

export interface SkeletonProps {
  /** Placeholder shape: `text` lines, rectangular `block`, `circle`, or `table` rows. Default `'text'`. */
  variant?: SkeletonVariant | undefined;
  /** Number of lines when `variant="text"`. Default `3`. */
  lines?: number | undefined;
  /** Number of rows when `variant="table"`. Default `4`. */
  rows?: number | undefined;
  /** Number of columns when `variant="table"`. Default `4`. */
  columns?: number | undefined;
  /** Token-based size preset for `block` and `circle` variants. Default `'md'`. */
  size?: SkeletonSize | undefined;
  /** Enable gentle opacity pulse (automatically disabled under `prefers-reduced-motion: reduce`). Default `true`. */
  isAnimated?: boolean | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/**
 * Decorative loading placeholder (`aria-hidden="true"`) in `text`, `block`, `circle`,
 * and `table` variants. Pair with `aria-busy="true"` or a live status region on the parent.
 */
export function Skeleton({
  variant = 'text',
  lines = 3,
  rows = 4,
  columns = 4,
  size = 'md',
  isAnimated = true,
  className,
  ref,
}: SkeletonProps) {
  const safeLines = Math.max(1, Math.floor(lines));
  const safeRows = Math.max(1, Math.floor(rows));
  const safeColumns = Math.max(1, Math.floor(columns));

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-nds="Skeleton"
      data-variant={variant}
      data-animated={isAnimated ? 'true' : 'false'}
      className={cx(styles.root, className)}
    >
      {variant === 'text' &&
        Array.from({ length: safeLines }, (_, i) => i + 1).map((lineNumber) => (
          <span
            key={`line-${lineNumber}`}
            className={cx(styles.bar, safeLines > 1 && lineNumber === safeLines && styles.lineShort)}
          />
        ))}
      {variant === 'block' && <span className={cx(styles.block)} data-size={size} />}
      {variant === 'circle' && <span className={cx(styles.circle)} data-size={size} />}
      {variant === 'table' && (
        <div className={cx(styles.table)}>
          {Array.from({ length: safeRows }, (_, r) => r + 1).map((rowNumber) => (
            <div key={`row-${rowNumber}`} className={cx(styles.tableRow)}>
              {Array.from({ length: safeColumns }, (_, c) => c + 1).map((colNumber) => (
                <span key={`cell-${rowNumber}-${colNumber}`} className={cx(styles.bar)} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
