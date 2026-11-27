import { iconDownload, iconFile, iconPrint, iconRefresh } from '@negaresh/icons';
import { Button, InlineAlert, LinkButton, Spinner, StatusBadge } from '@negaresh/react';
import { formatDateTime } from '@negaresh/utils';
import type { ReactNode, Ref } from 'react';
import { cx } from '../internal/cx.ts';
import { useAssessmentMessages } from '../messages/context.tsx';
import type { AssessmentMessages } from '../messages/types.ts';
import type { AssessmentReportState } from '../types.ts';
import styles from './ReportStatus.module.css';

export interface ReportStatusProps {
  /** Lifecycle status of the PDF report (`none`, `pending`, `ready`, `failed`, `purged`). */
  status: AssessmentReportState;
  /** Optional card title override. Defaults to `messages.reportStatusTitle`. */
  title?: ReactNode | undefined;
  /** Optional custom status description override. */
  description?: ReactNode | undefined;
  /** Specific failure reason shown in `failed` state. */
  errorMessage?: ReactNode | undefined;
  /** ISO-8601 UTC timestamp of PDF generation (formatted in Jalali, Tehran tz). */
  generatedAt?: string | Date | undefined;
  /** ISO-8601 UTC retention expiry timestamp (180-day policy). */
  expiresAt?: string | Date | undefined;
  /** Direct download URL when `status === 'ready'`. */
  downloadHref?: string | undefined;
  /** Click handler for download when using programmatic download. */
  onDownload?: (() => void) | undefined;
  /** Optional browser/A4 print trigger when `status === 'ready'`. */
  onPrint?: (() => void) | undefined;
  /** Handler to request generating a report in `none` or `purged` states. */
  onGenerate?: (() => void) | undefined;
  /** Handler to retry a failed report generation. */
  onRetry?: (() => void) | undefined;
  /** Pending state on the generate/retry button. */
  isActionPending?: boolean | undefined;
  /** Optional message catalogue overrides. */
  messages?: Partial<AssessmentMessages> | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Assessment PDF report lifecycle card (`none`, `pending`, `ready`, `failed`, `purged`)
 * composing `@negaresh/react` `StatusBadge` (`domain="report"`), `Spinner`, and retry/download actions.
 */
export function ReportStatus({
  status,
  title,
  description,
  errorMessage,
  generatedAt,
  expiresAt,
  downloadHref,
  onDownload,
  onPrint,
  onGenerate,
  onRetry,
  isActionPending = false,
  messages,
  className,
  ref,
}: ReportStatusProps) {
  const m = useAssessmentMessages(messages);
  const resolvedDescription = description ?? m.reportDescriptions[status];

  const hasActions =
    (status === 'none' && Boolean(onGenerate)) ||
    (status === 'purged' && Boolean(onGenerate)) ||
    (status === 'failed' && Boolean(onRetry)) ||
    (status === 'ready' && Boolean(downloadHref || onDownload || onPrint));

  return (
    <section
      ref={ref}
      data-nds="ReportStatus"
      data-status={status}
      data-print-hidden="true"
      className={cx(styles.card, className)}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{title ?? m.reportStatusTitle}</h3>
        <StatusBadge domain="report" status={status} />
      </div>

      {status === 'failed' ? (
        <InlineAlert tone="danger">
          {errorMessage ?? resolvedDescription}
        </InlineAlert>
      ) : status === 'pending' ? (
        <div className={styles.bodyRow} role="status" aria-live="polite">
          <Spinner size="sm" label={resolvedDescription as string} />
          <p className={styles.description}>{resolvedDescription}</p>
        </div>
      ) : (
        <p className={styles.description}>{resolvedDescription}</p>
      )}

      {(generatedAt !== undefined || expiresAt !== undefined) && (
        <div className={styles.meta}>
          {generatedAt !== undefined && (
            <span>
              {m.reportGeneratedAtLabel}: {formatDateTime(generatedAt)}
            </span>
          )}
          {expiresAt !== undefined && (
            <span>
              {m.reportRetentionLabel}: {formatDateTime(expiresAt)}
            </span>
          )}
        </div>
      )}

      {hasActions && (
        <div className={styles.actions}>
          {status === 'ready' && downloadHref && (
            <LinkButton href={downloadHref} variant="primary" iconStart={iconDownload}>
              {m.reportDownloadAction}
            </LinkButton>
          )}
          {status === 'ready' && !downloadHref && onDownload && (
            <Button type="button" variant="primary" iconStart={iconDownload} onPress={onDownload}>
              {m.reportDownloadAction}
            </Button>
          )}
          {status === 'ready' && onPrint && (
            <Button type="button" variant="secondary" iconStart={iconPrint} onPress={onPrint}>
              {m.reportPrintAction}
            </Button>
          )}
          {(status === 'none' || status === 'purged') && onGenerate && (
            <Button
              type="button"
              variant="primary"
              iconStart={iconFile}
              isPending={isActionPending}
              onPress={onGenerate}
            >
              {m.reportGenerateAction}
            </Button>
          )}
          {status === 'failed' && onRetry && (
            <Button
              type="button"
              variant="primary"
              iconStart={iconRefresh}
              isPending={isActionPending}
              onPress={onRetry}
            >
              {m.reportRetryAction}
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
