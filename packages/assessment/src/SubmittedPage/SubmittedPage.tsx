import { iconSuccess } from '@negaresh/icons';
import { Code, Icon } from '@negaresh/react';
import { formatDateTime } from '@negaresh/utils';
import type { ReactNode, Ref } from 'react';
import { cx } from '../internal/cx.ts';
import { useAssessmentMessages } from '../messages/context.tsx';
import type { AssessmentMessages } from '../messages/types.ts';
import styles from './SubmittedPage.module.css';

export interface SubmittedPageProps {
  /** Optional campaign/organization label (stripped shell — no user menu or login prompt). */
  organizationName?: ReactNode | undefined;
  /** Test title displayed beneath the confirmation heading. */
  testTitle?: ReactNode | undefined;
  /** Confirmation heading override. Defaults to `messages.submittedDefaultTitle`. */
  title?: ReactNode | undefined;
  /** Supporting message override. Defaults to `messages.submittedDefaultBody`. */
  description?: ReactNode | undefined;
  /** Reassurance message override («می‌توانید این صفحه را ببندید»). */
  canCloseNote?: ReactNode | undefined;
  /** ISO-8601 UTC submission timestamp (formatted in Jalali, Tehran tz). */
  submittedAt?: string | Date | undefined;
  /** Optional campaign tracking code rendered in `<Code>` (LTR Latin). */
  trackingCode?: string | undefined;
  /** Optional action buttons for non-campaign flows (omitted for stripped campaign views). */
  actions?: ReactNode | undefined;
  /** Heading level (`1`–`3`). Default `2` (use `1` on standalone pages). */
  headingLevel?: 1 | 2 | 3 | undefined;
  /** Optional message catalogue overrides. */
  messages?: Partial<AssessmentMessages> | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Campaign submission confirmation surface («پاسخ‌های شما ثبت شد — می‌توانید این صفحه را ببندید»)
 * designed for stripped campaign shells with no login prompt or alarming visual noise.
 */
export function SubmittedPage({
  organizationName,
  testTitle,
  title,
  description,
  canCloseNote,
  submittedAt,
  trackingCode,
  actions,
  headingLevel = 2,
  messages,
  className,
  ref,
}: SubmittedPageProps) {
  const m = useAssessmentMessages(messages);
  const HeadingTag = `h${headingLevel}` as const;

  return (
    <section
      ref={ref}
      role="status"
      aria-live="polite"
      data-nds="SubmittedPage"
      className={cx(styles.card, className)}
    >
      {organizationName !== undefined && <p className={styles.orgLabel}>{organizationName}</p>}

      <span className={styles.iconWrap} aria-hidden="true">
        <Icon icon={iconSuccess} size="lg" />
      </span>

      <HeadingTag className={styles.title}>{title ?? m.submittedDefaultTitle}</HeadingTag>
      {testTitle !== undefined && <p className={styles.testTitle}>{testTitle}</p>}
      <p className={styles.body}>{description ?? m.submittedDefaultBody}</p>

      <div className={styles.closeBanner}>{canCloseNote ?? m.submittedCanCloseNote}</div>

      {(submittedAt !== undefined || trackingCode !== undefined) && (
        <div className={styles.meta}>
          {submittedAt !== undefined && (
            <span className={styles.metaItem}>
              <span>{m.submittedAtLabel}:</span>
              <span>{formatDateTime(submittedAt)}</span>
            </span>
          )}
          {trackingCode !== undefined && (
            <span className={styles.metaItem}>
              <span>{m.submittedTrackingCodeLabel}:</span>
              <Code>{trackingCode}</Code>
            </span>
          )}
        </div>
      )}

      {actions !== undefined && <div className={styles.actions}>{actions}</div>}
    </section>
  );
}
