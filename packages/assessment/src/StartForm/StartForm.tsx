import { iconPlay } from '@negaresh/icons';
import {
  Button,
  DatePicker,
  type FormError,
  FormErrorSummary,
  InlineAlert,
  NumberField,
  Radio,
  RadioGroup,
  SegmentedControl,
  SegmentedControlItem,
  Select,
  SelectItem,
  TextField,
} from '@negaresh/react';
import { formatNumber } from '@negaresh/utils';
import { type FormEvent, type ReactNode, type Ref, useId, useState } from 'react';
import { cx } from '../internal/cx.ts';
import { useAssessmentMessages } from '../messages/context.tsx';
import type { AssessmentMessages } from '../messages/types.ts';
import type {
  CampaignBlockerKind,
  DemographicField,
  StartFormValues,
} from '../types.ts';
import styles from './StartForm.module.css';

export interface StartFormProps {
  /** Form title (e.g. assessment name or demographics heading). */
  title: ReactNode;
  /** Optional introductory instructions. */
  description?: ReactNode | undefined;
  /** Schema-driven fields (`choice`, `number`, `text`, `jalali-date`). */
  fields: readonly DemographicField[];
  /** Controlled field values map. */
  values?: Readonly<StartFormValues> | undefined;
  /** Initial uncontrolled field values. */
  defaultValues?: Readonly<StartFormValues> | undefined;
  /** Called whenever a field value changes. */
  onValuesChange?: ((values: StartFormValues) => void) | undefined;
  /** Called when validation succeeds and the taker starts the assessment. */
  onSubmit?: ((values: StartFormValues) => void) | undefined;
  /** Optional campaign blocker state (`docs/02-requirements.md` §4). */
  blocker?: CampaignBlockerKind | undefined;
  /** Optional override text for the blocker alert. */
  blockerMessage?: ReactNode | undefined;
  /** Optional external server error map (`fieldName -> message`). */
  serverErrors?: Readonly<Record<string, string>> | undefined;
  /** Pending state on the submit button. */
  isPending?: boolean | undefined;
  /** Submit button label override. */
  submitLabel?: ReactNode | undefined;
  /** Optional message catalogue overrides. */
  messages?: Partial<AssessmentMessages> | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLFormElement> | undefined;
}

function isEmptyValue(value: string | number | null | undefined): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  return Number.isNaN(value);
}

/**
 * Schema-driven assessment demographics & campaign entry form composing
 * `@negaresh/react` `TextField`, `NumberField`, `Select`/`RadioGroup`/`SegmentedControl`,
 * Jalali `DatePicker`, `FormErrorSummary`, and campaign blocker alerts.
 */
export function StartForm({
  title,
  description,
  fields,
  values,
  defaultValues,
  onValuesChange,
  onSubmit,
  blocker,
  blockerMessage,
  serverErrors,
  isPending = false,
  submitLabel,
  messages,
  className,
  ref,
}: StartFormProps) {
  const m = useAssessmentMessages(messages);
  const scopeId = useId();
  const [uncontrolledValues, setUncontrolledValues] = useState<StartFormValues>(() => ({
    ...(defaultValues ?? {}),
  }));
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  const resolvedValues = values ?? uncontrolledValues;
  const fieldIdFor = (name: string) => `${scopeId}-${name}`;

  const mergedErrors: Record<string, string> = {
    ...(serverErrors ?? {}),
    ...clientErrors,
  };

  const updateField = (name: string, nextValue: string | number | null) => {
    const next: StartFormValues = { ...resolvedValues, [name]: nextValue };
    if (values === undefined) {
      setUncontrolledValues(next);
    }
    if (clientErrors[name]) {
      setClientErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
    onValuesChange?.(next);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (blocker) return;

    const nextErrors: Record<string, string> = {};
    for (const field of fields) {
      const val = resolvedValues[field.name];
      if (field.isRequired && isEmptyValue(val)) {
        nextErrors[field.name] = m.fieldRequiredError(field.label);
        continue;
      }
      if (field.type === 'number' && typeof val === 'number' && !Number.isNaN(val)) {
        const belowMin = field.minValue !== undefined && val < field.minValue;
        const aboveMax = field.maxValue !== undefined && val > field.maxValue;
        if (belowMin || aboveMax) {
          nextErrors[field.name] = m.fieldRangeError(
            field.label,
            field.minValue !== undefined ? formatNumber(field.minValue) : undefined,
            field.maxValue !== undefined ? formatNumber(field.maxValue) : undefined,
          );
        }
      }
    }

    setClientErrors(nextErrors);
    const firstInvalid = fields.find((f) => nextErrors[f.name]);
    if (firstInvalid) {
      const anchor = event.currentTarget.ownerDocument.getElementById(
        fieldIdFor(firstInvalid.name),
      );
      const focusable =
        anchor?.querySelector<HTMLElement>(
          'input:not([type="hidden"]), button, select, textarea, [tabindex="0"]',
        ) ?? anchor;
      focusable?.focus();
      return;
    }

    onSubmit?.({ ...resolvedValues });
  };

  const summaryErrors: FormError[] = fields
    .filter((f) => mergedErrors[f.name])
    .map((f) => ({
      id: fieldIdFor(f.name),
      message: mergedErrors[f.name] ?? '',
    }));

  const blockerCopy = blocker ? m.campaignBlockers[blocker] : undefined;
  const blockerTone =
    blocker === 'not_on_roster' || blocker === 'expired'
      ? 'danger'
      : blocker === 'seats_full' || blocker === 'closed'
        ? 'warning'
        : 'info';

  return (
    <form
      ref={ref}
      noValidate
      onSubmit={handleSubmit}
      data-nds="StartForm"
      className={cx(styles.card, className)}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {description !== undefined && <p className={styles.description}>{description}</p>}
      </div>

      {blockerCopy && (
        <InlineAlert tone={blockerTone} title={blockerCopy.title}>
          {blockerMessage ?? blockerCopy.body}
        </InlineAlert>
      )}

      {summaryErrors.length > 0 && (
        <FormErrorSummary errors={summaryErrors} title={m.startFormErrorSummaryTitle} />
      )}

      <div className={styles.fields}>
        {fields.map((field) => {
          const id = fieldIdFor(field.name);
          const error = mergedErrors[field.name];
          const isInvalid = Boolean(error);
          const isDisabled = Boolean(field.isDisabled || blocker);
          const rawValue = resolvedValues[field.name];

          return (
            <div key={field.name} className={styles.fieldAnchor}>
              {field.type === 'text' && (
                <TextField
                  id={id}
                  name={field.name}
                  label={field.label}
                  description={field.description}
                  placeholder={field.placeholder}
                  dir={field.ltr ? 'ltr' : 'rtl'}
                  {...(field.maxLength !== undefined ? { maxLength: field.maxLength } : {})}
                  {...(field.autoComplete !== undefined ? { autoComplete: field.autoComplete } : {})}
                  isRequired={Boolean(field.isRequired)}
                  isDisabled={isDisabled}
                  isInvalid={isInvalid}
                  errorMessage={error}
                  value={typeof rawValue === 'string' ? rawValue : ''}
                  onChange={(v) => updateField(field.name, v)}
                />
              )}

              {field.type === 'number' && (
                <NumberField
                  id={id}
                  name={field.name}
                  label={field.label}
                  description={field.description}
                  placeholder={field.placeholder}
                  {...(field.minValue !== undefined ? { minValue: field.minValue } : {})}
                  {...(field.maxValue !== undefined ? { maxValue: field.maxValue } : {})}
                  {...(field.step !== undefined ? { step: field.step } : {})}
                  isRequired={Boolean(field.isRequired)}
                  isDisabled={isDisabled}
                  isInvalid={isInvalid}
                  errorMessage={error}
                  value={typeof rawValue === 'number' ? rawValue : Number.NaN}
                  onChange={(v) => updateField(field.name, Number.isNaN(v) ? null : v)}
                />
              )}

              {field.type === 'jalali-date' && (
                <DatePicker
                  id={id}
                  name={field.name}
                  label={field.label}
                  description={field.description}
                  minValue={field.minValue}
                  maxValue={field.maxValue}
                  isRequired={Boolean(field.isRequired)}
                  isDisabled={isDisabled}
                  isInvalid={isInvalid}
                  errorMessage={error}
                  value={typeof rawValue === 'string' && rawValue.length > 0 ? rawValue : null}
                  onChange={(iso) => updateField(field.name, iso)}
                />
              )}

              {field.type === 'choice' &&
                (field.presentation === 'radio' ? (
                  <RadioGroup
                    id={id}
                    name={field.name}
                    label={field.label}
                    description={field.description}
                    isRequired={Boolean(field.isRequired)}
                    isDisabled={isDisabled}
                    isInvalid={isInvalid}
                    errorMessage={error}
                    value={typeof rawValue === 'string' ? rawValue : null}
                    onChange={(v) => updateField(field.name, v)}
                  >
                    {field.options.map((opt) => (
                      <Radio key={opt.value} value={opt.value} description={opt.description}>
                        {opt.label}
                      </Radio>
                    ))}
                  </RadioGroup>
                ) : field.presentation === 'segmented' ? (
                  <SegmentedControl
                    id={id}
                    label={field.label}
                    description={field.description}
                    isDisabled={isDisabled}
                    value={typeof rawValue === 'string' ? rawValue : undefined}
                    onChange={(k) => updateField(field.name, k)}
                  >
                    {field.options.map((opt) => (
                      <SegmentedControlItem key={opt.value} id={opt.value}>
                        {opt.label}
                      </SegmentedControlItem>
                    ))}
                  </SegmentedControl>
                ) : (
                  <Select
                    id={id}
                    name={field.name}
                    label={field.label}
                    description={field.description}
                    placeholder={field.placeholder}
                    isRequired={Boolean(field.isRequired)}
                    isDisabled={isDisabled}
                    isInvalid={isInvalid}
                    errorMessage={error}
                    value={typeof rawValue === 'string' && rawValue.length > 0 ? rawValue : null}
                    onChange={(key) => updateField(field.name, key ? String(key) : null)}
                  >
                    {field.options.map((opt) => (
                      <SelectItem key={opt.value} id={opt.value} description={opt.description}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </Select>
                ))}
            </div>
          );
        })}
      </div>

      <div className={styles.actions}>
        <Button
          type="submit"
          variant="primary"
          iconStart={iconPlay}
          isPending={isPending}
          isDisabled={Boolean(blocker)}
        >
          {submitLabel ?? m.startFormSubmit}
        </Button>
      </div>
    </form>
  );
}
