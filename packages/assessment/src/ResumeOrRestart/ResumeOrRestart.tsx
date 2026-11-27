import { iconClock, iconPlay, iconRefresh } from '@negaresh/icons';
import {
  AlertDialog,
  Button,
  DialogTrigger,
  Icon,
  KeyValueList,
  ProgressBar,
  Text,
} from '@negaresh/react';
import { formatDateTime, formatNumber } from '@negaresh/utils';
import type { ReactNode, Ref } from 'react';
import { cx } from '../internal/cx.ts';
import { useAssessmentMessages } from '../messages/context.tsx';
import type { AssessmentMessages } from '../messages/types.ts';
import styles from './ResumeOrRestart.module.css';

export interface ResumeOrRestartProps {
  /** Assessment display title. */
  testTitle: ReactNode;
  /** ISO-8601 UTC timestamp of the last saved response (formatted in Jalali, Tehran tz). */
  lastSavedAt: string | Date;
  /** Optional ISO-8601 UTC expiry timestamp for the unfinished attempt. */
  expiresAt?: string | Date | undefined;
  /** Number of answered questions so far. */
  answeredCount: number;
  /** Total questions in the assessment. */
  totalQuestions: number;
  /** Optional current page index for display. */
  currentPage?: number | undefined;
  /** Optional total pages for display. */
  totalPages?: number | undefined;
  /** Called when the taker chooses to continue the unfinished attempt. */
  onResume: () => void;
  /** Called when the taker confirms discarding progress and starting fresh. */
  onRestart: () => void | Promise<void>;
  /** Guard the destructive restart action with an `AlertDialog`. Default `true`. */
  confirmRestart?: boolean | undefined;
  /** Show pending state on the resume button. */
  isResuming?: boolean | undefined;
  /** Show pending state on the restart confirmation button. */
  isRestarting?: boolean | undefined;
  /** Optional message catalogue overrides. */
  messages?: Partial<AssessmentMessages> | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Unfinished-attempt decision surface («یک آزمون ناتمام دارید») enforcing the
 * one-unfinished-attempt-per-test rule with an optional `AlertDialog` guard before restart.
 */
export function ResumeOrRestart({
  testTitle,
  lastSavedAt,
  expiresAt,
  answeredCount,
  totalQuestions,
  currentPage,
  totalPages,
  onResume,
  onRestart,
  confirmRestart = true,
  isResuming = false,
  isRestarting = false,
  messages,
  className,
  ref,
}: ResumeOrRestartProps) {
  const m = useAssessmentMessages(messages);
  const safeTotal = Math.max(1, totalQuestions);
  const safeAnswered = Math.min(safeTotal, Math.max(0, answeredCount));

  const progressText =
    currentPage !== undefined && totalPages !== undefined
      ? `${m.answeredCount(formatNumber(safeAnswered), formatNumber(safeTotal))} (${m.pageProgress(formatNumber(currentPage), formatNumber(totalPages))})`
      : m.answeredCount(formatNumber(safeAnswered), formatNumber(safeTotal));

  const metaItems = [
    { id: 'lastSaved', label: m.resumeLastSavedLabel, value: formatDateTime(lastSavedAt) },
    { id: 'progress', label: m.resumeProgressLabel, value: progressText },
    ...(expiresAt !== undefined
      ? [{ id: 'expires', label: m.resumeExpiresLabel, value: formatDateTime(expiresAt) }]
      : []),
  ];

  return (
    <section ref={ref} data-nds="ResumeOrRestart" className={cx(styles.card, className)}>
      <div className={styles.header}>
        <span className={styles.iconWrap} aria-hidden="true">
          <Icon icon={iconClock} size="md" />
        </span>
        <div className={styles.headingGroup}>
          <h2 className={styles.title}>{m.resumeTitle}</h2>
          <p className={styles.testTitle}>{testTitle}</p>
          <p className={styles.description}>{m.resumeDescription}</p>
        </div>
      </div>

      <ProgressBar
        label={m.resumeProgressLabel}
        value={safeAnswered}
        minValue={0}
        maxValue={safeTotal}
        size="sm"
      />

      <KeyValueList items={metaItems} density="compact" />

      <div className={styles.actions}>
        <Button
          type="button"
          variant="primary"
          iconStart={iconPlay}
          isPending={isResuming}
          isDisabled={isRestarting}
          onPress={onResume}
        >
          {m.resumeAction}
        </Button>

        {confirmRestart ? (
          <DialogTrigger>
            <Button
              type="button"
              variant="secondary"
              iconStart={iconRefresh}
              isDisabled={isResuming || isRestarting}
            >
              {m.restartAction}
            </Button>
            <AlertDialog
              tone="danger"
              title={m.restartConfirmTitle}
              confirmLabel={m.restartConfirmAction}
              cancelLabel={m.restartCancelAction}
              isConfirmPending={isRestarting}
              onConfirm={onRestart}
            >
              <Text as="p" size="sm" tone="muted" leading="text">
                {m.restartConfirmBody}
              </Text>
            </AlertDialog>
          </DialogTrigger>
        ) : (
          <Button
            type="button"
            variant="secondary"
            iconStart={iconRefresh}
            isPending={isRestarting}
            isDisabled={isResuming}
            onPress={() => void onRestart()}
          >
            {m.restartAction}
          </Button>
        )}
      </div>
    </section>
  );
}
