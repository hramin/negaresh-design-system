import { Badge, Code, InlineAlert } from '@negaresh/react';
import { formatDateTime, formatNumber } from '@negaresh/utils';
import type { ReactNode, Ref } from 'react';
import { cx } from '../internal/cx.ts';
import { resolveSeverityMeta } from '../internal/severity.ts';
import { useAssessmentMessages } from '../messages/context.tsx';
import type { AssessmentMessages } from '../messages/types.ts';
import type {
  AssessmentMode,
  AssessmentResultKind,
  AssessmentSeverity,
  AssessmentValidityNotice,
} from '../types.ts';
import styles from './ResultSummary.module.css';

export interface ResultSummaryProps {
  /** Test title displayed above the headline. */
  testTitle: ReactNode;
  /** Result shape kind (`profile` | `type` | `index` | `themes`). */
  kind: AssessmentResultKind;
  /** Audience mode: `'professional'` (clinical) or `'calm'` (user/parent, zero rose). Default `'professional'`. */
  mode?: AssessmentMode | undefined;
  /** Summary headline in `professional` mode. */
  headline: ReactNode;
  /** Optional calm-mode headline override. */
  calmHeadline?: ReactNode | undefined;
  /** Primary profile code, type label, or index badge in `professional` mode. */
  primaryBadge?: ReactNode | undefined;
  /** Optional calm-mode primary badge override. */
  calmPrimaryBadge?: ReactNode | undefined;
  /** Overall numeric index value when `kind === 'index'`. */
  indexScore?: number | undefined;
  /** Bounded index scale `[min, max]`, e.g. `[0, 100]`. */
  indexDomain?: readonly [number, number] | undefined;
  /** Optional summary theme chips. */
  themes?: readonly string[] | undefined;
  /** Optional overall severity controlling the primary badge tone/icon. */
  overallSeverity?: AssessmentSeverity | undefined;
  /** Optional validity or framing callout. */
  validity?: AssessmentValidityNotice | undefined;
  /** ISO-8601 UTC completion timestamp (formatted in Jalali, Tehran tz). */
  completedAt?: string | Date | undefined;
  /** Attempt/report identifier rendered in `<Code>` (LTR Latin). */
  attemptCode?: string | undefined;
  /** Optional taker display name. */
  takerName?: ReactNode | undefined;
  /** Heading level for the summary headline (`1`–`4`). Default `2`. */
  headingLevel?: 1 | 2 | 3 | 4 | undefined;
  /** Optional message catalogue overrides. */
  messages?: Partial<AssessmentMessages> | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Assessment result headline card supporting `profile`, `type`, `index`, and `themes` shapes
 * across `professional` and `calm` audience modes, with Jalali metadata and validity framing.
 */
export function ResultSummary({
  testTitle,
  kind,
  mode = 'professional',
  headline,
  calmHeadline,
  primaryBadge,
  calmPrimaryBadge,
  indexScore,
  indexDomain,
  themes,
  overallSeverity,
  validity,
  completedAt,
  attemptCode,
  takerName,
  headingLevel = 2,
  messages,
  className,
  ref,
}: ResultSummaryProps) {
  const m = useAssessmentMessages(messages);
  const HeadingTag = `h${headingLevel}` as const;

  const displayHeadline = mode === 'calm' && calmHeadline !== undefined ? calmHeadline : headline;
  const displayPrimaryBadge =
    mode === 'calm' && calmPrimaryBadge !== undefined ? calmPrimaryBadge : primaryBadge;

  const severityMeta = overallSeverity ? resolveSeverityMeta(overallSeverity, mode, m) : undefined;

  const hasMeta = completedAt !== undefined || attemptCode !== undefined || takerName !== undefined;

  return (
    <section
      ref={ref}
      data-nds="ResultSummary"
      data-mode={mode}
      data-kind={kind}
      className={cx(styles.card, className)}
    >
      <div className={styles.topRow}>
        <div className={styles.eyebrowGroup}>
          <Badge tone="neutral" size="sm">
            {m.resultKindLabel[kind]}
          </Badge>
          <Badge tone={mode === 'calm' ? 'accent' : 'info'} size="sm">
            {m.modeBadge[mode]}
          </Badge>
        </div>

        {displayPrimaryBadge !== undefined && (
          <Badge
            tone={severityMeta ? severityMeta.tone : 'accent'}
            {...(severityMeta ? { icon: severityMeta.icon } : {})}
          >
            {displayPrimaryBadge}
          </Badge>
        )}
      </div>

      <div className={styles.titleBlock}>
        <p className={styles.testTitle}>{testTitle}</p>
        <div className={styles.headlineRow}>
          <HeadingTag className={styles.headline}>{displayHeadline}</HeadingTag>
          {kind === 'index' && indexScore !== undefined && (
            <div className={styles.indexBox}>
              <span className={styles.indexValue}>{formatNumber(indexScore)}</span>
              {indexDomain !== undefined && (
                <span className={styles.indexMax}>/ {formatNumber(indexDomain[1])}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {themes && themes.length > 0 && (
        <ul className={styles.themes}>
          {themes.map((theme) => (
            <li key={theme}>
              <Badge tone="neutral" size="sm">
                {theme}
              </Badge>
            </li>
          ))}
        </ul>
      )}

      {validity &&
        (mode === 'calm' ? (
          <div className={styles.calmNotice} role="note">
            <p className={styles.calmNoticeTitle}>
              {validity.calmTitle ?? m.calmValidityLabel}
            </p>
            <p className={styles.calmNoticeBody}>{validity.calmBody ?? validity.body}</p>
          </div>
        ) : (
          <InlineAlert
            tone={
              validity.status === 'invalid'
                ? 'danger'
                : validity.status === 'caution'
                  ? 'warning'
                  : 'success'
            }
            title={validity.title}
          >
            <p>{validity.body}</p>
            {validity.scaleCodes && validity.scaleCodes.length > 0 && (
              <div className={styles.scaleCodes}>
                {validity.scaleCodes.map((code) => (
                  <Code key={code}>{code}</Code>
                ))}
              </div>
            )}
          </InlineAlert>
        ))}

      {mode === 'calm' && <p className={styles.calmSupport}>{m.calmSupportNote}</p>}

      {hasMeta && (
        <div className={styles.meta}>
          {takerName !== undefined && (
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>{m.takerLabel}:</span>
              <span className={styles.metaValue}>{takerName}</span>
            </span>
          )}
          {completedAt !== undefined && (
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>{m.completedAtLabel}:</span>
              <span className={styles.metaValue}>{formatDateTime(completedAt)}</span>
            </span>
          )}
          {attemptCode !== undefined && (
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>{m.attemptCodeLabel}:</span>
              <Code>{attemptCode}</Code>
            </span>
          )}
        </div>
      )}
    </section>
  );
}
