import { Badge, Code } from '@negaresh/react';
import { formatNumber } from '@negaresh/utils';
import { Fragment, type ReactNode, type Ref } from 'react';
import { cx } from '../internal/cx.ts';
import { resolveSeverityMeta } from '../internal/severity.ts';
import { useAssessmentMessages } from '../messages/context.tsx';
import type { AssessmentMessages } from '../messages/types.ts';
import type { AssessmentMode, AssessmentScoreItem } from '../types.ts';
import styles from './ScoreTable.module.css';

export interface ScoreTableProps {
  /** Scale/dimension score items to display. */
  items: readonly AssessmentScoreItem[];
  /** Optional visible heading rendered above the table. */
  title?: ReactNode | undefined;
  /** Accessible table caption. Defaults to `messages.scoreTableCaption`. */
  caption?: string | undefined;
  /** Audience mode: `'professional'` (status tokens) or `'calm'` (neutral/teal, zero rose). Default `'professional'`. */
  mode?: AssessmentMode | undefined;
  /** Show raw-score column when items provide `rawScore`. Auto-detected by default. */
  showRawScore?: boolean | undefined;
  /** Show confidence interval column when items provide `low`/`high`. Auto-detected by default. */
  showInterval?: boolean | undefined;
  /** Show scale code badge in `<Code>` when items provide `code`. Auto-detected in professional mode. */
  showCode?: boolean | undefined;
  /** Custom numeric formatter. Defaults to Persian digits via `@negaresh/utils`. */
  formatValue?: ((value: number) => string) | undefined;
  /** Optional message catalogue overrides. */
  messages?: Partial<AssessmentMessages> | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

interface ScoreGroup {
  section: string | undefined;
  items: AssessmentScoreItem[];
}

function groupBySection(items: readonly AssessmentScoreItem[]): ScoreGroup[] {
  const groups: ScoreGroup[] = [];
  for (const item of items) {
    const last = groups[groups.length - 1];
    if (last && last.section === item.section) {
      last.items.push(item);
    } else {
      groups.push({ section: item.section, items: [item] });
    }
  }
  return groups;
}

/**
 * Assessment scores table displaying scale labels, optional `<Code>` scale codes,
 * numeric scores in Persian digits, optional confidence intervals, and severity/band
 * badges (never colour alone; zero rose/danger in `calm` mode).
 */
export function ScoreTable({
  items,
  title,
  caption,
  mode = 'professional',
  showRawScore,
  showInterval,
  showCode,
  formatValue = formatNumber,
  messages,
  className,
  ref,
}: ScoreTableProps) {
  const m = useAssessmentMessages(messages);
  const resolvedShowRaw =
    showRawScore ?? (mode === 'professional' && items.some((i) => i.rawScore !== undefined));
  const resolvedShowInterval =
    showInterval ?? items.some((i) => i.low !== undefined && i.high !== undefined);
  const resolvedShowCode =
    showCode ?? (mode === 'professional' && items.some((i) => i.code !== undefined));

  const columnCount =
    3 + (resolvedShowCode ? 1 : 0) + (resolvedShowRaw ? 1 : 0) + (resolvedShowInterval ? 1 : 0);

  const groups = groupBySection(items);
  const resolvedCaption =
    caption ?? (typeof title === 'string' && title.length > 0 ? title : m.scoreTableCaption);

  return (
    <section
      ref={ref}
      data-nds="ScoreTable"
      data-mode={mode}
      className={cx(styles.root, className)}
    >
      {title !== undefined && (
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
        </div>
      )}

      {/* biome-ignore lint/a11y/noNoninteractiveTabindex: Scrollable table container must be keyboard-focusable (WCAG 2.1.1). */}
      <section className={styles.tableWrap} tabIndex={0} aria-label={resolvedCaption}>
        <table className={styles.table}>
          <caption>{resolvedCaption}</caption>
          <thead>
            <tr>
              <th scope="col">{m.scoreColumnScale}</th>
              {resolvedShowCode && <th scope="col">{m.scoreColumnCode}</th>}
              {resolvedShowRaw && <th scope="col">{m.scoreColumnRaw}</th>}
              <th scope="col">{m.scoreColumnValue}</th>
              {resolvedShowInterval && <th scope="col">{m.scoreColumnInterval}</th>}
              <th scope="col">{m.scoreColumnBand}</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group, gIdx) => (
              <Fragment key={group.section ?? `group-${gIdx}`}>
                {group.section && (
                  <tr className={styles.sectionRow}>
                    <th colSpan={columnCount} scope="colgroup">
                      {group.section}
                    </th>
                  </tr>
                )}
                {group.items.map((item) => {
                  const customBand =
                    mode === 'calm'
                      ? (item.calmBandLabel ?? item.bandLabel)
                      : item.bandLabel;
                  const meta = item.severity
                    ? resolveSeverityMeta(item.severity, mode, m, customBand)
                    : undefined;

                  return (
                    <tr key={item.id}>
                      <th scope="row">
                        <span className={styles.scaleCell}>
                          <span className={styles.scaleName}>{item.label}</span>
                        </span>
                      </th>
                      {resolvedShowCode && (
                        <td>{item.code ? <Code>{item.code}</Code> : m.scoreMissing}</td>
                      )}
                      {resolvedShowRaw && (
                        <td className={styles.numeric}>
                          {item.rawScore !== undefined ? formatValue(item.rawScore) : m.scoreMissing}
                        </td>
                      )}
                      <td className={styles.valueStrong}>{formatValue(item.value)}</td>
                      {resolvedShowInterval && (
                        <td className={styles.numeric}>
                          {item.low !== undefined && item.high !== undefined
                            ? m.scoreRangeBetween(formatValue(item.low), formatValue(item.high))
                            : m.scoreMissing}
                        </td>
                      )}
                      <td>
                        {meta ? (
                          <Badge tone={meta.tone} icon={meta.icon} size="sm">
                            {meta.label}
                          </Badge>
                        ) : customBand ? (
                          <Badge tone="neutral" size="sm">
                            {customBand}
                          </Badge>
                        ) : (
                          m.scoreMissing
                        )}
                      </td>
                    </tr>
                  );
                })}
              </Fragment>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  );
}
