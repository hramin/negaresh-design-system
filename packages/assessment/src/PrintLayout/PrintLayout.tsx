import { Badge, Code, LogoSlot } from '@negaresh/react';
import { formatDateTime } from '@negaresh/utils';
import { type ReactNode, type Ref, useEffect, useState } from 'react';
import { cx } from '../internal/cx.ts';
import { useAssessmentMessages } from '../messages/context.tsx';
import type { AssessmentMessages } from '../messages/types.ts';
import type { AssessmentMode } from '../types.ts';
import styles from './PrintLayout.module.css';

export interface PrintLayoutProps {
  /** Report title displayed in the A4 header. */
  title: ReactNode;
  /** Optional organization/brand name rendered in the `LogoSlot`. */
  organizationName?: ReactNode | undefined;
  /** Optional custom logo artwork node passed into `LogoSlot`. */
  logo?: ReactNode | undefined;
  /** Optional product label in `LogoSlot` (e.g. «سامانهٔ آزمون»). */
  productLabel?: ReactNode | undefined;
  /** Audience mode badge (`professional` | `calm`). */
  mode?: AssessmentMode | undefined;
  /** Optional taker display name. */
  takerName?: ReactNode | undefined;
  /** ISO-8601 UTC report issue timestamp (formatted in Jalali, Tehran tz). */
  issuedAt?: string | Date | undefined;
  /** Report / attempt reference code rendered in `<Code>` (LTR Latin). */
  referenceId?: string | undefined;
  /** Optional screen-only header actions (automatically hidden in `@media print`). */
  screenActions?: ReactNode | undefined;
  /** Main report body (charts, `ResultSummary`, `ScoreTable`, `InterpretationBlock`). */
  children: ReactNode;
  /** Footer disclaimer / confidentiality note. Defaults to `messages.printConfidentialNote`. */
  footerNote?: ReactNode | undefined;
  /** Optional norm/psychometric source note rendered in the footer. */
  normNote?: ReactNode | undefined;
  /**
   * Lock the A4 sheet to NDS light-paper tokens on screen as well as in print
   * (recommended for dedicated A4 print-preview / PDF routes). Default `false`
   * (follows screen theme and automatically switches to light paper during `window.print()`).
   */
  forceLightPaper?: boolean | undefined;
  /** Heading level for the report title (`1`–`3`). Default `1`. */
  headingLevel?: 1 | 2 | 3 | undefined;
  /** Optional message catalogue overrides. */
  messages?: Partial<AssessmentMessages> | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * A4 report layout primitive (`@page { size: A4; margin: 14mm 10mm; }`) composing header,
 * report sections (`ResultSummary`, `ResultChart`, `ScoreTable`, `InterpretationBlock`),
 * and confidentiality footer with screen-to-PDF visual parity.
 */
export function PrintLayout({
  title,
  organizationName,
  logo,
  productLabel,
  mode,
  takerName,
  issuedAt,
  referenceId,
  screenActions,
  children,
  footerNote,
  normNote,
  forceLightPaper = false,
  headingLevel = 1,
  messages,
  className,
  ref,
}: PrintLayoutProps) {
  const m = useAssessmentMessages(messages);
  const [isPrinting, setIsPrinting] = useState(false);

  // When a user prints from a dark-themed screen, switch the report sheet to light paper tokens.
  useEffect(() => {
    if (forceLightPaper || typeof window === 'undefined') return;
    const handleBeforePrint = () => setIsPrinting(true);
    const handleAfterPrint = () => setIsPrinting(false);
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    const mql = window.matchMedia?.('print');
    const handleMediaChange = (event: MediaQueryListEvent) => setIsPrinting(event.matches);
    mql?.addEventListener?.('change', handleMediaChange);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
      mql?.removeEventListener?.('change', handleMediaChange);
    };
  }, [forceLightPaper]);

  const HeadingTag = `h${headingLevel}` as const;
  const applyLightTheme = forceLightPaper || isPrinting;

  return (
    <article
      ref={ref}
      data-nds="PrintLayout"
      data-mode={mode}
      data-theme={applyLightTheme ? 'light' : undefined}
      className={cx(styles.sheet, className)}
    >
      <header className={styles.header}>
        <div className={styles.brandRow}>
          <LogoSlot
            logo={logo}
            name={organizationName ?? m.printReportLabel}
            product={productLabel}
            size="sm"
          />

          <div className={styles.brandRow}>
            {mode !== undefined && (
              <Badge tone={mode === 'calm' ? 'accent' : 'info'} size="sm">
                {m.modeBadge[mode]}
              </Badge>
            )}
            {screenActions !== undefined && (
              <div className={styles.actions} data-print-hidden="true">
                {screenActions}
              </div>
            )}
          </div>
        </div>

        <div className={styles.titleBlock}>
          <p className={styles.eyebrow}>{m.printReportLabel}</p>
          <HeadingTag className={styles.title}>{title}</HeadingTag>
        </div>

        {(takerName !== undefined || issuedAt !== undefined || referenceId !== undefined) && (
          <div className={styles.meta}>
            {takerName !== undefined && (
              <span className={styles.metaItem}>
                <span className={styles.metaLabel}>{m.takerLabel}:</span>
                <span className={styles.metaValue}>{takerName}</span>
              </span>
            )}
            {issuedAt !== undefined && (
              <span className={styles.metaItem}>
                <span className={styles.metaLabel}>{m.printIssuedAtLabel}:</span>
                <span className={styles.metaValue}>{formatDateTime(issuedAt)}</span>
              </span>
            )}
            {referenceId !== undefined && (
              <span className={styles.metaItem}>
                <span className={styles.metaLabel}>{m.printReferenceIdLabel}:</span>
                <Code>{referenceId}</Code>
              </span>
            )}
          </div>
        )}
      </header>

      <div className={styles.body}>{children}</div>

      <footer className={styles.footer}>
        {normNote !== undefined && <p className={styles.footerNote}>{normNote}</p>}
        <div className={styles.footerRow}>
          <p className={styles.footerNote}>{footerNote ?? m.printConfidentialNote}</p>
          {referenceId !== undefined && <Code>{referenceId}</Code>}
        </div>
      </footer>
    </article>
  );
}
