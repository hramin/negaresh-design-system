import { ProgressBar, VisuallyHidden } from '@negaresh/react';
import { formatNumber } from '@negaresh/utils';
import type { Ref } from 'react';
import { cx } from '../internal/cx.ts';
import { useAssessmentMessages } from '../messages/context.tsx';
import type { AssessmentMessages } from '../messages/types.ts';
import styles from './AnswerProgress.module.css';

export interface AnswerProgressProps {
  /** 1-based active page number. */
  currentPage: number;
  /** Total number of pages in the assessment. */
  totalPages: number;
  /** Optional count of answered questions across the test. */
  answeredCount?: number | undefined;
  /** Optional total question count across the test. */
  totalQuestions?: number | undefined;
  /** Optional message catalogue overrides. */
  messages?: Partial<AssessmentMessages> | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/**
 * Assessment page progress indicator («صفحهٔ n از N» + determinate `ProgressBar`)
 * with polite live-region announcements on page transitions (docs/foundations/accessibility.md).
 */
export function AnswerProgress({
  currentPage,
  totalPages,
  answeredCount,
  totalQuestions,
  messages,
  className,
  ref,
}: AnswerProgressProps) {
  const m = useAssessmentMessages(messages);
  const safeTotal = Math.max(1, totalPages);
  const safeCurrent = Math.min(safeTotal, Math.max(1, currentPage));
  const currentFa = formatNumber(safeCurrent);
  const totalFa = formatNumber(safeTotal);
  const pageText = m.pageProgress(currentFa, totalFa);

  const hasAnswered = answeredCount !== undefined && totalQuestions !== undefined && totalQuestions > 0;
  const answeredFa = hasAnswered ? formatNumber(Math.max(0, answeredCount)) : undefined;
  const totalQFa = hasAnswered ? formatNumber(totalQuestions) : undefined;

  const progressValue = hasAnswered
    ? Math.min(totalQuestions, Math.max(0, answeredCount))
    : safeCurrent;
  const progressMax = hasAnswered ? totalQuestions : safeTotal;

  return (
    <div ref={ref} data-nds="AnswerProgress" className={cx(styles.root, className)}>
      <div className={styles.meta}>
        <p className={styles.pageLabel}>{pageText}</p>
        {answeredFa !== undefined && totalQFa !== undefined && (
          <p className={styles.answeredLabel}>{m.answeredCount(answeredFa, totalQFa)}</p>
        )}
      </div>

      <ProgressBar
        aria-label={pageText}
        value={progressValue}
        minValue={0}
        maxValue={progressMax}
        showValueLabel={false}
        size="sm"
      />

      <VisuallyHidden>
        <span role="status" aria-live="polite" aria-atomic="true">
          {m.pageProgressAnnouncement(currentFa, totalFa, answeredFa, totalQFa)}
        </span>
      </VisuallyHidden>
    </div>
  );
}
