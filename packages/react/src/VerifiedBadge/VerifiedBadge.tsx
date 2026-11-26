import { iconShield } from '@negaresh/icons';
import { toPersianDigits } from '@negaresh/utils';
import type { ReactNode, Ref } from 'react';
import { Badge, type BadgeSize } from '../Badge/Badge.tsx';
import { cx } from '../internal/cx.ts';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './VerifiedBadge.module.css';

export type VerifiedBadgeTone = 'success' | 'accent';

export interface VerifiedBadgeProps {
  /** Override the localized default label (`messages.verifiedExpert` = «پروانهٔ تأییدشده»). */
  label?: ReactNode | undefined;
  /** Optional licence number (e.g. نظام روان‌شناسی code), rendered in Persian digits. */
  licenceNumber?: string | number | undefined;
  /** Badge size. Default `'md'`. */
  size?: BadgeSize | undefined;
  /** Semantic tone: calm `'success'` (default) or brand `'accent'`. */
  tone?: VerifiedBadgeTone | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLSpanElement> | undefined;
}

/**
 * Expert licence verification pill composed over Wave 1 `<Badge>` with `iconShield`,
 * localized Persian label, and optional Persian-digit licence number.
 */
export function VerifiedBadge({
  label,
  licenceNumber,
  size = 'md',
  tone = 'success',
  className,
  ref,
}: VerifiedBadgeProps) {
  const m = useNdsMessages();
  const formattedLicence =
    licenceNumber !== undefined && String(licenceNumber).trim().length > 0
      ? toPersianDigits(String(licenceNumber).trim())
      : undefined;

  return (
    <Badge ref={ref} tone={tone} size={size} icon={iconShield} className={className}>
      <span data-nds="VerifiedBadge" data-tone={tone}>
        {label ?? m.verifiedExpert}
        {formattedLicence !== undefined && (
          <>
            <span className={cx(styles.sep)} aria-hidden="true">
              ·
            </span>
            <span className={cx(styles.licence)}>{formattedLicence}</span>
          </>
        )}
      </span>
    </Badge>
  );
}
