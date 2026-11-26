import { iconCheck } from '@negaresh/icons';
import { formatNumber } from '@negaresh/utils';
import { createContext, type ReactNode, type Ref, useContext } from 'react';
import { Button as RacButton, Link as RacLink } from 'react-aria-components';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden.tsx';
import styles from './Stepper.module.css';

export type StepStatus = 'done' | 'current' | 'upcoming';
export type StepperOrientation = 'vertical' | 'horizontal';

export interface StepperStepData {
  id: string;
  /** Primary step heading or lead text. */
  title: ReactNode;
  /** Optional supporting sentence or guidance. */
  description?: ReactNode | undefined;
  /** Explicit status override; otherwise derived from `Stepper.currentStep`. */
  status?: StepStatus | undefined;
  /** Optional link target when a step is navigable. */
  href?: string | undefined;
  /** Optional press handler when a step is interactive. */
  onPress?: (() => void) | undefined;
  /** Inline title + description prose style (matches Registry 3-step guide). */
  inlineDescription?: boolean | undefined;
}

const StepperOrientationContext = createContext<StepperOrientation>('vertical');

export interface StepperStepProps {
  /** 1-based step index rendered in Persian digits when upcoming or current. */
  index: number;
  /** Visual and semantic step state (`done`, `current`, `upcoming`). */
  status: StepStatus;
  /** Primary step heading. */
  title: ReactNode;
  /** Optional supporting details. */
  description?: ReactNode | undefined;
  /** Render title and description inline as one flowing sentence (e.g. Registry guide). */
  inlineDescription?: boolean | undefined;
  /** Optional link URL to navigate back to a completed/accessible step. */
  href?: string | undefined;
  /** Optional click/press handler. */
  onPress?: (() => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLLIElement> | undefined;
}

/** Single numbered step inside `<Stepper>` with `aria-current="step"` and accessible status text. */
export function StepperStep({
  index,
  status,
  title,
  description,
  inlineDescription = false,
  href,
  onPress,
  className,
  ref,
}: StepperStepProps) {
  const m = useNdsMessages();
  const orientation = useContext(StepperOrientationContext);
  const statusWord =
    status === 'done'
      ? m.stepCompleted
      : status === 'current'
        ? m.stepCurrent
        : m.stepUpcoming;

  const indicator = (
    <span className={cx(styles.indicator)} aria-hidden="true">
      {status === 'done' ? (
        <Icon icon={iconCheck} size="sm" />
      ) : (
        formatNumber(index, { maximumFractionDigits: 0 })
      )}
    </span>
  );

  const labelContent = inlineDescription ? (
    <span>
      <strong className={cx(styles.inlineLead)}>{title}</strong>
      {description ? <> {description}</> : null}
    </span>
  ) : (
    <>
      <span className={cx(styles.title)}>{title}</span>
      {description && <div className={cx(styles.description)}>{description}</div>}
    </>
  );

  const interactiveBody =
    href !== undefined ? (
      <RacLink
        href={href}
        {...(onPress !== undefined ? { onPress } : {})}
        className={cx(styles.action)}
      >
        <span>{labelContent}</span>
      </RacLink>
    ) : onPress !== undefined ? (
      <RacButton type="button" onPress={onPress} className={cx(styles.action)}>
        <span>{labelContent}</span>
      </RacButton>
    ) : (
      labelContent
    );

  return (
    <li
      ref={ref}
      data-nds="StepperStep"
      data-status={status}
      {...(status === 'done' ? { 'data-done': 'true' } : {})}
      {...(status === 'current' ? { 'aria-current': 'step' as const } : {})}
      className={cx(styles.step, className)}
    >
      {orientation === 'horizontal' ? (
        <div className={cx(styles.head)}>
          {indicator}
          <span className={cx(styles.connector)} aria-hidden="true" />
        </div>
      ) : (
        indicator
      )}
      <div className={cx(styles.content)}>
        <VisuallyHidden>{`${statusWord}: `}</VisuallyHidden>
        {interactiveBody}
      </div>
    </li>
  );
}

export interface StepperProps {
  /** Declarative list of steps. */
  steps?: readonly StepperStepData[] | undefined;
  /** 1-based index of the current step (derives `done` / `current` / `upcoming` when step `status` is omitted). */
  currentStep?: number | undefined;
  /** `vertical` (default, e.g. Registry guide) or `horizontal` (stacks vertically below 600 px). */
  orientation?: StepperOrientation | undefined;
  /** Wrap `<ol>` inside a `<nav>` landmark (use when steps act as wizard navigation). Default `false`. */
  asNav?: boolean | undefined;
  /** Accessible name (defaults to `messages.stepperLabel` when `asNav` is true). */
  'aria-label'?: string | undefined;
  'aria-labelledby'?: string | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Multi-step progress indicator (`done`, `current` with `aria-current="step"`, and `upcoming`)
 * with Persian step numbers via `formatNumber` and accessible non-colour status labels.
 */
export function Stepper({
  steps,
  currentStep,
  orientation = 'vertical',
  asNav = false,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  children,
  className,
  ref,
}: StepperProps) {
  const m = useNdsMessages();

  const resolveStatus = (step: StepperStepData, oneBasedIndex: number): StepStatus => {
    if (step.status) return step.status;
    if (currentStep === undefined) return 'upcoming';
    if (oneBasedIndex < currentStep) return 'done';
    if (oneBasedIndex === currentStep) return 'current';
    return 'upcoming';
  };

  const list = (
    <ol
      ref={!asNav ? (ref as Ref<HTMLOListElement> | undefined) : undefined}
      {...(!asNav && ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {})}
      {...(!asNav && ariaLabelledby !== undefined ? { 'aria-labelledby': ariaLabelledby } : {})}
      data-nds="Stepper"
      data-orientation={orientation}
      className={cx(styles.list, !asNav ? className : undefined)}
    >
      {steps?.map((step, i) => {
        const stepNumber = i + 1;
        return (
          <StepperStep
            key={step.id}
            index={stepNumber}
            status={resolveStatus(step, stepNumber)}
            title={step.title}
            description={step.description}
            inlineDescription={step.inlineDescription}
            href={step.href}
            onPress={step.onPress}
          />
        );
      })}
      {children}
    </ol>
  );

  return (
    <StepperOrientationContext.Provider value={orientation}>
      {asNav ? (
        <nav
          ref={ref}
          aria-label={ariaLabel ?? m.stepperLabel}
          {...(ariaLabelledby !== undefined ? { 'aria-labelledby': ariaLabelledby } : {})}
          data-nds="StepperNav"
          className={className}
        >
          {list}
        </nav>
      ) : (
        list
      )}
    </StepperOrientationContext.Provider>
  );
}
