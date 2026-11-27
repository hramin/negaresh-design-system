import { Image, VisuallyHidden } from '@negaresh/react';
import { formatNumber } from '@negaresh/utils';
import { type ReactNode, type Ref, useId, useRef } from 'react';
import {
  RadioButton as RacRadioButton,
  RadioField as RacRadioField,
  RadioGroup as RacRadioGroup,
} from 'react-aria-components';
import { cx } from '../internal/cx.ts';
import { useAssessmentMessages } from '../messages/context.tsx';
import type { AssessmentMessages } from '../messages/types.ts';
import type { QuestionDefinition, QuestionOption, QuestionVariant } from '../types.ts';
import styles from './QuestionItem.module.css';

export interface QuestionItemProps {
  /** Stable question ID (also used as the fieldset ID for jump-to-error links). */
  id?: string | undefined;
  /** 1-based display number formatted in Persian digits via `@negaresh/utils`. */
  number?: number | undefined;
  /** Question stem rendered inside `<legend>` (WCAG 2.2 AA & review finding #1). */
  stem: ReactNode;
  /** Optional clarifying helper text linked to the radio group via `aria-describedby`. */
  description?: ReactNode | undefined;
  /** Selectable options (2/4/6 choices, 5/7 Likert, forced-choice pair, or image options). */
  options: readonly QuestionOption[];
  /** Visual variant. Auto-selects `'image'` when options carry images, otherwise `'standard'`. */
  variant?: QuestionVariant | undefined;
  /** Optional column count for standard layouts on desktop. Default `1`. */
  columns?: 1 | 2 | 3 | undefined;
  /** Start-side Likert anchor text (e.g. «کاملاً مخالفم»). */
  likertStartLabel?: ReactNode | undefined;
  /** End-side Likert anchor text (e.g. «کاملاً موافقم»). */
  likertEndLabel?: ReactNode | undefined;
  /** Form field name submitted when using native HTML form submission. */
  name?: string | undefined;
  /** Controlled selected option value. */
  value?: string | null | undefined;
  /** Uncontrolled initial value. */
  defaultValue?: string | undefined;
  /** Called when the user selects an option. */
  onChange?: ((value: string) => void) | undefined;
  /** Mark question required. Default `true`. */
  isRequired?: boolean | undefined;
  /** Mark question invalid and display `errorMessage` (or default unanswered error). */
  isInvalid?: boolean | undefined;
  /** Specific inline validation error. */
  errorMessage?: ReactNode | undefined;
  /** Disable all options. */
  isDisabled?: boolean | undefined;
  /** Prevent changing the answer while remaining focusable. */
  isReadOnly?: boolean | undefined;
  /** Optional message catalogue overrides. */
  messages?: Partial<AssessmentMessages> | undefined;
  /** Optional callback ref to capture the first radio `<input>` for programmatic error focus. */
  firstInputRef?: Ref<HTMLInputElement> | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLFieldSetElement> | undefined;
}

/** Convenience helper to spread a `QuestionDefinition` onto `<QuestionItem>`. */
export function questionDefinitionToProps(
  question: QuestionDefinition,
): Pick<
  QuestionItemProps,
  | 'id'
  | 'number'
  | 'stem'
  | 'description'
  | 'options'
  | 'variant'
  | 'columns'
  | 'likertStartLabel'
  | 'likertEndLabel'
  | 'isRequired'
> {
  return {
    id: question.id,
    number: question.number,
    stem: question.stem,
    description: question.description,
    options: question.options,
    variant: question.variant,
    columns: question.columns,
    likertStartLabel: question.likertStartLabel,
    likertEndLabel: question.likertEndLabel,
    isRequired: question.isRequired,
  };
}

function assignRef<T>(target: Ref<T> | undefined, value: T | null) {
  if (!target) return;
  if (typeof target === 'function') {
    target(value);
  } else {
    target.current = value;
  }
}

/**
 * Accessible assessment question item rendered as a semantic `<fieldset>` + `<legend>`
 * wrapping a React Aria `RadioGroup` of real `<input type="radio">` option chips.
 * Supports 2/4/6-choice, 5/7-point Likert, forced-choice, and image-option layouts.
 */
export function QuestionItem({
  id,
  number,
  stem,
  description,
  options,
  variant,
  columns = 1,
  likertStartLabel,
  likertEndLabel,
  name,
  value,
  defaultValue,
  onChange,
  isRequired = true,
  isInvalid = false,
  errorMessage,
  isDisabled = false,
  isReadOnly = false,
  messages,
  firstInputRef,
  className,
  ref,
}: QuestionItemProps) {
  const m = useAssessmentMessages(messages);
  const autoId = useId();
  const rootId = id ?? autoId;
  const legendId = `${rootId}-legend`;
  const descId = `${rootId}-desc`;
  const errorId = `${rootId}-err`;
  const localFirstInputRef = useRef<HTMLInputElement | null>(null);

  const hasImages = options.some((opt) => opt.image !== undefined);
  const resolvedVariant: QuestionVariant = variant ?? (hasImages ? 'image' : 'standard');
  const orientation = resolvedVariant === 'likert' ? 'horizontal' : 'vertical';

  const describedByIds = [
    description !== undefined ? descId : undefined,
    isInvalid ? errorId : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  const resolvedError = isInvalid ? (errorMessage ?? m.unansweredError) : undefined;

  return (
    <fieldset
      ref={ref}
      id={rootId}
      tabIndex={-1}
      data-nds="QuestionItem"
      data-variant={resolvedVariant}
      data-invalid={isInvalid ? 'true' : undefined}
      className={cx(styles.fieldset, className)}
      onFocus={(event) => {
        if (event.target === event.currentTarget) {
          localFirstInputRef.current?.focus();
        }
      }}
    >
      <legend id={legendId} className={styles.legend}>
        {number !== undefined && (
          <span className={styles.number}>{m.questionNumber(formatNumber(number))}</span>
        )}
        <span className={styles.stem}>
          {stem}
          {isRequired && (
            <>
              <span className={styles.requiredMark} aria-hidden="true">
                {' '}
                *
              </span>
              <VisuallyHidden>{` (${m.requiredLabel})`}</VisuallyHidden>
            </>
          )}
        </span>
      </legend>

      {description !== undefined && (
        <p id={descId} className={styles.description}>
          {description}
        </p>
      )}

      <RacRadioGroup
        aria-labelledby={legendId}
        {...(describedByIds ? { 'aria-describedby': describedByIds } : {})}
        name={name ?? rootId}
        orientation={orientation}
        {...(value !== undefined ? { value } : {})}
        {...(defaultValue !== undefined ? { defaultValue } : {})}
        {...(onChange !== undefined ? { onChange } : {})}
        isRequired={isRequired}
        isInvalid={isInvalid}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        className={cx(styles.group)}
      >
        {resolvedVariant === 'likert' && (likertStartLabel || likertEndLabel) && (
          <div className={styles.likertAnchors} aria-hidden="true">
            <span>{likertStartLabel}</span>
            <span>{likertEndLabel}</span>
          </div>
        )}

        <div
          className={styles.options}
          data-variant={resolvedVariant}
          data-columns={resolvedVariant === 'standard' ? columns : undefined}
        >
          {options.map((opt, index) => (
            <RacRadioField
              key={opt.value}
              value={opt.value}
              isDisabled={Boolean(isDisabled || opt.isDisabled)}
              inputRef={
                index === 0
                  ? (node) => {
                      localFirstInputRef.current = node;
                      assignRef(firstInputRef, node);
                    }
                  : null
              }
              className={cx(styles.radioField)}
            >
              <RacRadioButton
                className={cx(
                  styles.option,
                  resolvedVariant === 'likert' && styles.optionLikert,
                  resolvedVariant === 'forced-choice' && styles.optionForced,
                  resolvedVariant === 'image' && styles.optionImage,
                )}
              >
                {resolvedVariant === 'image' && opt.image ? (
                  <>
                    <Image src={opt.image.src} alt={opt.image.alt} ratio="3/2" radius="sm" />
                    <span className={styles.imageFooter}>
                      <span className={styles.indicator} aria-hidden="true">
                        <span className={styles.dot} />
                      </span>
                      <span className={styles.optionBody}>
                        <span className={styles.optionLabel}>{opt.label}</span>
                        {opt.description && (
                          <span className={styles.optionDescription}>{opt.description}</span>
                        )}
                      </span>
                    </span>
                  </>
                ) : resolvedVariant === 'likert' ? (
                  <>
                    {opt.stepLabel ? (
                      <span className={styles.stepBadge} aria-hidden="true">
                        {opt.stepLabel}
                      </span>
                    ) : (
                      <span className={styles.indicator} aria-hidden="true">
                        <span className={styles.dot} />
                      </span>
                    )}
                    <span className={styles.optionLabel}>{opt.label}</span>
                  </>
                ) : (
                  <>
                    <span className={styles.indicator} aria-hidden="true">
                      <span className={styles.dot} />
                    </span>
                    <span className={styles.optionBody}>
                      <span className={styles.optionLabel}>{opt.label}</span>
                      {opt.description && (
                        <span className={styles.optionDescription}>{opt.description}</span>
                      )}
                    </span>
                  </>
                )}
              </RacRadioButton>
            </RacRadioField>
          ))}
        </div>
      </RacRadioGroup>

      {resolvedError !== undefined && (
        <p id={errorId} role="alert" className={styles.error}>
          {resolvedError}
        </p>
      )}
    </fieldset>
  );
}
