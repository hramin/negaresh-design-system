import { Badge, Code } from '@negaresh/react';
import type { ReactNode, Ref } from 'react';
import { cx } from '../internal/cx.ts';
import { resolveSeverityMeta } from '../internal/severity.ts';
import { useAssessmentMessages } from '../messages/context.tsx';
import type { AssessmentMessages } from '../messages/types.ts';
import type { AssessmentInterpretationSection, AssessmentMode } from '../types.ts';
import styles from './InterpretationBlock.module.css';

export interface InterpretationBlockProps {
  /** Structured interpretation sections grouped by section and severity. */
  sections: readonly AssessmentInterpretationSection[];
  /** Optional block heading. Defaults to `messages.interpretationHeading`. */
  title?: ReactNode | undefined;
  /** Audience mode: `'professional'` (clinical tones + scale codes) or `'calm'` (neutral/teal, zero rose). Default `'professional'`. */
  mode?: AssessmentMode | undefined;
  /** Optional message catalogue overrides. */
  messages?: Partial<AssessmentMessages> | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Assessment interpretation sections supporting both `professional` (clinical, severity tokens)
 * and `calm` (user/adolescent/parent-friendly, neutral/teal, zero rose/danger) variants.
 */
export function InterpretationBlock({
  sections,
  title,
  mode = 'professional',
  messages,
  className,
  ref,
}: InterpretationBlockProps) {
  const m = useAssessmentMessages(messages);

  return (
    <section
      ref={ref}
      data-nds="InterpretationBlock"
      data-mode={mode}
      className={cx(styles.root, className)}
    >
      <h3 className={styles.heading}>{title ?? m.interpretationHeading}</h3>

      {sections.length === 0 ? (
        <p className={styles.empty}>{m.interpretationEmpty}</p>
      ) : (
        <div className={styles.list}>
          {sections.map((sec) => {
            const meta = sec.severity ? resolveSeverityMeta(sec.severity, mode, m) : undefined;
            const accentTone = meta
              ? meta.tone === 'neutral'
                ? 'neutral'
                : meta.tone
              : sec.isValidity
                ? 'accent'
                : 'neutral';

            const headingText = mode === 'calm' ? (sec.calmTitle ?? sec.title) : sec.title;
            const bodyText = mode === 'calm' ? (sec.calmBody ?? sec.body) : sec.body;
            const recs =
              mode === 'calm'
                ? (sec.calmRecommendations ?? sec.recommendations)
                : sec.recommendations;

            return (
              <article
                key={sec.id}
                data-nds="InterpretationSection"
                data-accent={accentTone}
                data-validity={sec.isValidity ? 'true' : undefined}
                className={styles.card}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.meta}>
                    <span className={styles.sectionLabel}>{sec.section}</span>
                    {mode === 'professional' && sec.scaleCode && <Code>{sec.scaleCode}</Code>}
                    {sec.isValidity && (
                      <Badge tone={mode === 'calm' ? 'accent' : 'info'} size="sm">
                        {mode === 'calm' ? m.calmValidityLabel : m.validityLabel}
                      </Badge>
                    )}
                  </div>

                  {meta && (
                    <Badge tone={meta.tone} icon={meta.icon} size="sm">
                      {meta.label}
                    </Badge>
                  )}
                </div>

                <h4 className={styles.title}>{headingText}</h4>
                <p className={styles.body}>{bodyText}</p>

                {recs && recs.length > 0 && (
                  <div className={styles.recommendations}>
                    <p className={styles.recHeading}>
                      {mode === 'calm'
                        ? m.interpretationCalmRecommendations
                        : m.interpretationRecommendations}
                    </p>
                    <ul className={styles.recList}>
                      {recs.map((rec) => (
                        <li key={rec}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
