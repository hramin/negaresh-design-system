import { iconArrowEnd, iconArrowStart, iconCheck } from '@negaresh/icons';
import { Button, type FormError, FormErrorSummary, Icon } from '@negaresh/react';
import { formatNumber } from '@negaresh/utils';
import { type FormEvent, type ReactNode, type Ref, useId, useRef, useState } from 'react';
import { AnswerProgress } from '../AnswerProgress/AnswerProgress.tsx';
import { cx } from '../internal/cx.ts';
import { useAssessmentMessages } from '../messages/context.tsx';
import type { AssessmentMessages } from '../messages/types.ts';
import { QuestionItem, questionDefinitionToProps } from '../QuestionItem/QuestionItem.tsx';
import type { QuestionDefinition } from '../types.ts';
import styles from './AnswerPage.module.css';

export interface AnswerPageProps {
  /** Optional assessment title displayed above progress. */
  title?: ReactNode | undefined;
  /** Questions rendered on the active page (`n` questions per page). */
  questions: readonly QuestionDefinition[];
  /** 1-based current page number. */
  currentPage: number;
  /** Total pages in the assessment. */
  totalPages: number;
  /** Controlled map of `questionId -> selectedOptionValue`. */
  answers?: Readonly<Record<string, string>> | undefined;
  /** Initial uncontrolled answers map. */
  defaultAnswers?: Readonly<Record<string, string>> | undefined;
  /** Called when any question answer changes. */
  onAnswerChange?: ((questionId: string, value: string) => void) | undefined;
  /** Optional total answered questions across all pages (defaults to answered count on current page). */
  answeredCount?: number | undefined;
  /** Optional total question count across all pages (defaults to `questions.length`). */
  totalQuestions?: number | undefined;
  /** Called when the user presses "previous page". */
  onPreviousPage?: (() => void) | undefined;
  /** Called when the current page passes validation and the user advances. */
  onNextPage?: ((pageAnswers: Record<string, string>) => void) | undefined;
  /** Called on the final page after validation passes. */
  onSubmit?: ((pageAnswers: Record<string, string>) => void) | undefined;
  /** Show pending state on the primary submit/next button. */
  isSubmitting?: boolean | undefined;
  /** Show calm saved-draft indicator in the header. */
  isDraftSaved?: boolean | undefined;
  /** Optional message catalogue overrides. */
  messages?: Partial<AssessmentMessages> | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLFormElement> | undefined;
}

function truncateStem(stem: string, max = 56): string {
  const trimmed = stem.trim();
  return trimmed.length > max ? `${trimmed.slice(0, max)}…` : trimmed;
}

/**
 * Multi-question answering page with `AnswerProgress`, per-page required validation,
 * announced `FormErrorSummary` with direct jump-to-radio focus, and RTL page navigation.
 */
export function AnswerPage({
  title,
  questions,
  currentPage,
  totalPages,
  answers,
  defaultAnswers,
  onAnswerChange,
  answeredCount,
  totalQuestions,
  onPreviousPage,
  onNextPage,
  onSubmit,
  isSubmitting = false,
  isDraftSaved = false,
  messages,
  className,
  ref,
}: AnswerPageProps) {
  const m = useAssessmentMessages(messages);
  const scopeId = useId();
  const [uncontrolledAnswers, setUncontrolledAnswers] = useState<Record<string, string>>(() => ({
    ...(defaultAnswers ?? {}),
  }));
  const [invalidIds, setInvalidIds] = useState<string[]>([]);
  const firstInputRefs = useRef<Map<string, HTMLInputElement | null>>(new Map());

  const resolvedAnswers = answers ?? uncontrolledAnswers;
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  const pageAnsweredCount = questions.reduce(
    (acc, q) => (resolvedAnswers[q.id] ? acc + 1 : acc),
    0,
  );
  const resolvedAnsweredCount = answeredCount ?? pageAnsweredCount;
  const resolvedTotalQuestions = totalQuestions ?? questions.length;

  const domIdFor = (questionId: string) => `${scopeId}-${questionId}`;

  const handleSelect = (questionId: string, value: string) => {
    if (answers === undefined) {
      setUncontrolledAnswers((prev) => ({ ...prev, [questionId]: value }));
    }
    setInvalidIds((prev) => (prev.includes(questionId) ? prev.filter((id) => id !== questionId) : prev));
    onAnswerChange?.(questionId, value);
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const missing = questions.filter((q) => q.isRequired !== false && !resolvedAnswers[q.id]);
    if (missing.length > 0) {
      const missingIds = missing.map((q) => q.id);
      setInvalidIds(missingIds);
      const firstMissing = missing[0];
      if (firstMissing) {
        firstInputRefs.current.get(firstMissing.id)?.focus();
      }
      return;
    }

    setInvalidIds([]);
    const pageAnswers: Record<string, string> = {};
    for (const q of questions) {
      const v = resolvedAnswers[q.id];
      if (v !== undefined) pageAnswers[q.id] = v;
    }

    if (isLastPage) {
      onSubmit?.(pageAnswers);
    } else {
      onNextPage?.(pageAnswers);
    }
  };

  const invalidSet = new Set(invalidIds);
  const summaryErrors: FormError[] = questions
    .filter((q) => invalidSet.has(q.id))
    .map((q) => ({
      id: domIdFor(q.id),
      message: m.unansweredSummaryItem(formatNumber(q.number), truncateStem(q.stem)),
    }));

  return (
    <form
      ref={ref}
      noValidate
      onSubmit={handleFormSubmit}
      data-nds="AnswerPage"
      className={cx(styles.root, className)}
    >
      <div className={styles.header}>
        {(title !== undefined || isDraftSaved) && (
          <div className={styles.headerRow}>
            {title !== undefined && <h2 className={styles.title}>{title}</h2>}
            {isDraftSaved && (
              <span className={styles.draftBadge} role="status">
                <Icon icon={iconCheck} size="sm" />
                <span>{m.draftSaved}</span>
              </span>
            )}
          </div>
        )}
        <AnswerProgress
          currentPage={currentPage}
          totalPages={totalPages}
          answeredCount={resolvedAnsweredCount}
          totalQuestions={resolvedTotalQuestions}
          {...(messages ? { messages } : {})}
        />
      </div>

      {summaryErrors.length > 0 && (
        <FormErrorSummary
          errors={summaryErrors}
          title={m.unansweredSummaryTitle(formatNumber(summaryErrors.length))}
        />
      )}

      <div className={styles.questions}>
        {questions.map((question) => (
          <QuestionItem
            key={question.id}
            {...questionDefinitionToProps(question)}
            id={domIdFor(question.id)}
            name={question.id}
            value={resolvedAnswers[question.id] ?? null}
            onChange={(val) => handleSelect(question.id, val)}
            isInvalid={invalidSet.has(question.id)}
            firstInputRef={(node) => {
              firstInputRefs.current.set(question.id, node);
            }}
            {...(messages ? { messages } : {})}
          />
        ))}
      </div>

      <div className={styles.actions}>
        {!isFirstPage && onPreviousPage ? (
          <Button
            type="button"
            variant="secondary"
            iconStart={iconArrowStart}
            isDisabled={isSubmitting}
            onPress={onPreviousPage}
          >
            {m.previousPage}
          </Button>
        ) : (
          <span aria-hidden="true" />
        )}

        <div className={styles.primaryAction}>
          <Button
            type="submit"
            variant="primary"
            iconEnd={isLastPage ? iconCheck : iconArrowEnd}
            isPending={isSubmitting}
          >
            {isSubmitting ? m.submittingAnswers : isLastPage ? m.submitAnswers : m.nextPage}
          </Button>
        </div>
      </div>
    </form>
  );
}
