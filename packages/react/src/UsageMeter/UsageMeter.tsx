import { iconWarning } from '@negaresh/icons';
import type { ReactNode, Ref } from 'react';
import { Label as RacLabel, Meter as RacMeter } from 'react-aria-components';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './UsageMeter.module.css';

export interface UsageMeterProps {
  /** Visible label (e.g. «رایانه‌های فعال‌شده» or «صندلی‌های کارزار»). */
  label: ReactNode;
  /** Number of slots currently used. */
  used: number;
  /** Effective maximum quota/limit. */
  limit: number;
  /** Effective limit source note (Registry FR-23, e.g. «سقف پیش‌فرض محصول»). */
  sourceNote?: ReactNode;
  /** Optional custom summary label. Defaults to `messages.usageOf(used, limit)` («۱ از ۱»). */
  valueLabel?: ReactNode;
  /** Maximum number of discrete segments before switching to a continuous bar. Default `10`. */
  maxSegments?: number | undefined;
  /** Override full-capacity state (defaults to `limit > 0 && used >= limit`). */
  isFull?: boolean | undefined;
  /** Show an explicit warning icon/word badge when full (useful outside an accompanying warning alert). Default `false`. */
  showFullIndicator?: boolean | undefined;
  id?: string | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/**
 * Quota and activation-slot meter built on React Aria `Meter`.
 * Renders discrete pill segments for small quotas (`limit <= maxSegments`), switches to a
 * continuous track for larger limits, displays effective limit source notes (FR-23), and
 * highlights full capacity in warning tone with accessible status text.
 */
export function UsageMeter({
  label,
  used,
  limit,
  sourceNote,
  valueLabel,
  maxSegments = 10,
  isFull,
  showFullIndicator = false,
  id,
  className,
  ref,
}: UsageMeterProps) {
  const messages = useNdsMessages();
  const safeLimit = Math.max(0, Math.floor(limit));
  const safeUsed = Math.max(0, Math.min(safeLimit > 0 ? safeLimit : used, Math.floor(used)));
  const full = isFull ?? (safeLimit > 0 && used >= safeLimit);
  const defaultSummary = messages.usageOf(Math.max(0, Math.floor(used)), safeLimit);
  const ariaValueText = full ? `${defaultSummary} — ${messages.usageFull}` : defaultSummary;
  const useSegments = safeLimit > 0 && safeLimit <= maxSegments;
  const percentage = safeLimit > 0 ? Math.min(100, Math.max(0, (safeUsed / safeLimit) * 100)) : 0;

  return (
    <RacMeter
      ref={ref}
      {...(id !== undefined ? { id } : {})}
      value={safeUsed}
      minValue={0}
      maxValue={Math.max(1, safeLimit)}
      valueLabel={ariaValueText}
      data-nds="UsageMeter"
      data-full={full ? 'true' : undefined}
      className={cx(styles.meter, className)}
    >
      <div className={cx(styles.row)}>
        <RacLabel className={cx(styles.label)}>{label}</RacLabel>
        <strong className={cx(styles.summary)}>
          {full && showFullIndicator && (
            <span className={cx(styles.fullIcon)} aria-hidden="true">
              <Icon icon={iconWarning} size="sm" />
            </span>
          )}
          <span>{valueLabel ?? defaultSummary}</span>
        </strong>
      </div>
      {useSegments ? (
        <div className={cx(styles.track)} aria-hidden="true">
          {Array.from({ length: safeLimit }, (_, i) => i + 1).map((slotNumber) => (
            <span
              key={`slot-${slotNumber}`}
              className={cx(styles.segment)}
              data-on={slotNumber <= safeUsed ? 'true' : undefined}
            />
          ))}
        </div>
      ) : (
        <div className={cx(styles.continuousTrack)} aria-hidden="true">
          <span className={cx(styles.continuousFill)} style={{ inlineSize: `${percentage}%` }} />
        </div>
      )}
      {(sourceNote || (full && showFullIndicator)) && (
        <p className={cx(styles.note)}>
          {full && showFullIndicator && (
            <span className={cx(styles.fullNote)}>
              {messages.usageFull}
              {sourceNote ? ' · ' : ''}
            </span>
          )}
          {sourceNote}
        </p>
      )}
    </RacMeter>
  );
}
