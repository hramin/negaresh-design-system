import { toLatinDigits } from '@negaresh/utils';
import {
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import {
  FormValidationContext,
  Input as RacInput,
  ProgressBar as RacProgressBar,
} from 'react-aria-components';
import { Button } from '../Button/Button.tsx';
import { cx } from '../internal/cx.ts';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden.tsx';
import styles from './OTPField.module.css';

export interface OTPFieldProps {
  /** Visible group label. */
  label: ReactNode;
  /** Optional help text shown beneath the digit slots. */
  description?: ReactNode;
  /** Validation error displayed when invalid. */
  errorMessage?: ReactNode;
  /** Number of digit slots. Default `6`. */
  length?: number | undefined;
  /** Controlled canonical Latin digit string (e.g. `'123456'`). */
  value?: string | undefined;
  /** Uncontrolled initial code (Persian, Arabic-Indic, or Latin digits accepted). */
  defaultValue?: string | undefined;
  /** Called with the normalized Latin digit string on every change. */
  onChange?: ((value: string) => void) | undefined;
  /** Called once when all `length` digits are filled by typing or pasting. */
  onComplete?: ((code: string) => void) | undefined;
  /** Field name for native form submission and `Form` `validationErrors`. */
  name?: string | undefined;
  /** Optional id applied to the first slot input (for `FormErrorSummary` links). */
  id?: string | undefined;
  /** Marks the field as required. */
  isRequired?: boolean | undefined;
  /** Disables all digit slots and the resend button. */
  isDisabled?: boolean | undefined;
  /** Prevents edits while keeping the code readable and selectable. */
  isReadOnly?: boolean | undefined;
  /** Marks the field invalid and displays `errorMessage`. */
  isInvalid?: boolean | undefined;
  /** Shows a pending indicator and locks edits without removing the submitted value. */
  isPending?: boolean | undefined;
  /** Optional custom validator receiving the normalized Latin digit string. */
  validate?: ((value: string) => string | string[] | true | null | undefined) | undefined;
  /**
   * Optional resend handler. When supplied, renders a resend action below the field
   * and starts a `resendCooldown`-second countdown after each resend press.
   */
  onResend?: (() => void) | undefined;
  /** Cooldown duration in seconds after pressing resend. Default `60`. */
  resendCooldown?: number | undefined;
  /**
   * Controlled remaining seconds for the resend countdown (useful for server-synced
   * timers and deterministic SSR/gallery states).
   */
  resendSecondsRemaining?: number | undefined;
  /** Custom label for the resend action button. Defaults to `messages.otpResend`. */
  resendLabel?: ReactNode;
  /** Class applied only to the component root. */
  className?: string | undefined;
  /** Ref forwarded to the first digit slot input. */
  ref?: Ref<HTMLInputElement> | undefined;
}

function normalizeDigits(raw: string): string {
  return toLatinDigits(raw).replace(/\D/g, '');
}

function toSlots(canonical: string, length: number): string[] {
  const digits = normalizeDigits(canonical).slice(0, length);
  return Array.from({ length }, (_, index) => digits[index] ?? '');
}

function assignRef(ref: Ref<HTMLInputElement> | undefined, element: HTMLInputElement | null) {
  if (typeof ref === 'function') ref(element);
  else if (ref) ref.current = element;
}

function formatValidationError(
  result: string | string[] | true | null | undefined,
): string | undefined {
  if (typeof result === 'string' && result.length > 0) return result;
  if (Array.isArray(result) && result.length > 0) return result.join(' ');
  return undefined;
}

/**
 * Six-digit one-time-code input with LTR Latin digit layout inside RTL pages,
 * Persian/Arabic/Latin digit normalization, clipboard/SMS autofill paste,
 * keyboard navigation, and optional resend countdown.
 */
export function OTPField({
  label,
  description,
  errorMessage,
  length = 6,
  value,
  defaultValue = '',
  onChange,
  onComplete,
  name,
  id,
  isRequired = false,
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
  isPending = false,
  validate,
  onResend,
  resendCooldown = 60,
  resendSecondsRemaining,
  resendLabel,
  className,
  ref,
}: OTPFieldProps) {
  const safeLength = Math.max(1, Math.floor(length));
  const messages = useNdsMessages();
  const formErrors = useContext(FormValidationContext);
  const autoId = useId();
  const labelId = `${autoId}-label`;
  const descriptionId = `${autoId}-desc`;
  const errorId = `${autoId}-error`;
  const firstSlotId = id ?? `${autoId}-slot-0`;

  const [slotArray, setSlotArray] = useState<string[]>(() =>
    toSlots(value ?? defaultValue, safeLength),
  );
  const lastEmittedRef = useRef<string>(normalizeDigits(value ?? defaultValue).slice(0, safeLength));

  const normalizedProp =
    value !== undefined ? normalizeDigits(value).slice(0, safeLength) : undefined;
  const slots =
    normalizedProp !== undefined && normalizedProp !== lastEmittedRef.current
      ? toSlots(normalizedProp, safeLength)
      : slotArray.length === safeLength
        ? slotArray
        : toSlots(slotArray.join(''), safeLength);
  const canonical = slots.join('');

  useEffect(() => {
    if (normalizedProp !== undefined && normalizedProp !== lastEmittedRef.current) {
      lastEmittedRef.current = normalizedProp;
      setSlotArray(toSlots(normalizedProp, safeLength));
    }
  }, [normalizedProp, safeLength]);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const lastCompletedRef = useRef<string | null>(canonical.length === safeLength ? canonical : null);

  // Local resend countdown when uncontrolled via `resendSecondsRemaining`.
  const [localSeconds, setLocalSeconds] = useState(0);
  const [resendAnnouncement, setResendAnnouncement] = useState('');
  const isResendControlled = resendSecondsRemaining !== undefined;
  const activeSeconds = Math.max(
    0,
    Math.ceil(isResendControlled ? resendSecondsRemaining : localSeconds),
  );

  useEffect(() => {
    if (isResendControlled || localSeconds <= 0) return;
    const timer = setInterval(() => {
      setLocalSeconds((prev) => {
        if (prev <= 1) {
          setResendAnnouncement(messages.otpResendReady);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isResendControlled, localSeconds, messages.otpResendReady]);

  const setSlotRef = useCallback(
    (index: number) => (element: HTMLInputElement | null) => {
      inputRefs.current[index] = element;
      if (index === 0) assignRef(ref, element);
    },
    [ref],
  );

  const focusSlot = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(safeLength - 1, index));
      inputRefs.current[clamped]?.focus();
      inputRefs.current[clamped]?.select();
    },
    [safeLength],
  );

  const commitSlots = useCallback(
    (nextSlots: string[], focusIndex?: number) => {
      const sanitized = Array.from({ length: safeLength }, (_, idx) =>
        normalizeDigits(nextSlots[idx] ?? '').slice(0, 1),
      );
      const next = sanitized.join('');
      lastEmittedRef.current = next;
      setSlotArray(sanitized);
      onChange?.(next);
      if (next.length === safeLength) {
        if (lastCompletedRef.current !== next) {
          lastCompletedRef.current = next;
          onComplete?.(next);
        }
      } else {
        lastCompletedRef.current = null;
      }
      if (focusIndex !== undefined) focusSlot(focusIndex);
    },
    [focusSlot, onChange, onComplete, safeLength],
  );

  const applyDistributedDigits = useCallback(
    (startIndex: number, rawText: string) => {
      const digits = normalizeDigits(rawText);
      if (!digits) return;
      const nextSlots = [...slots];
      // Full-code paste or SMS autofill populates from slot 0 even if another slot was focused.
      const origin = digits.length >= safeLength ? 0 : startIndex;
      let cursor = origin;
      for (const ch of digits) {
        if (cursor >= safeLength) break;
        nextSlots[cursor] = ch;
        cursor += 1;
      }
      const targetFocus = Math.min(safeLength - 1, cursor);
      commitSlots(nextSlots, targetFocus);
    },
    [commitSlots, safeLength, slots],
  );

  const handleSlotChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    if (isDisabled || isReadOnly || isPending) return;
    const raw = event.target.value;
    const digits = normalizeDigits(raw);

    if (digits.length === 0) {
      const nextSlots = [...slots];
      nextSlots[index] = '';
      commitSlots(nextSlots);
      return;
    }

    // Multi-character insertion (iOS/Android SMS autofill or clipboard insertion without paste event).
    if (digits.length > 1) {
      applyDistributedDigits(index, digits);
      return;
    }

    const nextSlots = [...slots];
    nextSlots[index] = digits[0] ?? '';
    commitSlots(nextSlots, index < safeLength - 1 ? index + 1 : index);
  };

  const handleSlotPaste = (index: number) => (event: ClipboardEvent<HTMLInputElement>) => {
    if (isDisabled || isReadOnly || isPending) return;
    const pasted = event.clipboardData?.getData('text') ?? '';
    const digits = normalizeDigits(pasted);
    if (!digits) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    applyDistributedDigits(index, digits);
  };

  const handleSlotKeyDown = (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
    if (isDisabled || isPending) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusSlot(index - 1);
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusSlot(index + 1);
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      focusSlot(0);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      focusSlot(safeLength - 1);
      return;
    }

    if (isReadOnly) return;

    if (event.key === 'Backspace') {
      event.preventDefault();
      const nextSlots = [...slots];
      if (nextSlots[index]) {
        nextSlots[index] = '';
        commitSlots(nextSlots, index);
      } else if (index > 0) {
        nextSlots[index - 1] = '';
        commitSlots(nextSlots, index - 1);
      }
      return;
    }

    if (event.key === 'Delete') {
      event.preventDefault();
      const nextSlots = [...slots];
      if (nextSlots[index]) {
        nextSlots[index] = '';
        commitSlots(nextSlots, index);
      }
    }
  };

  const serverError = name ? formatValidationError(formErrors?.[name]) : undefined;
  const customError = validate ? formatValidationError(validate(canonical)) : undefined;
  const resolvedError =
    errorMessage ?? serverError ?? customError ?? (isInvalid ? messages.otpIncomplete(safeLength) : undefined);
  const invalid = Boolean(isInvalid || serverError || customError);

  const describedBy =
    [description != null ? descriptionId : null, invalid && resolvedError ? errorId : null]
      .filter(Boolean)
      .join(' ') || undefined;

  const showResend = onResend !== undefined || resendSecondsRemaining !== undefined;

  const handleResend = () => {
    if (isDisabled || isPending || activeSeconds > 0) return;
    if (!isResendControlled && resendCooldown > 0) {
      setLocalSeconds(resendCooldown);
    }
    setResendAnnouncement(messages.otpResent);
    onResend?.();
  };

  return (
    <div
      data-nds="OTPField"
      data-invalid={invalid || undefined}
      data-disabled={isDisabled || undefined}
      data-readonly={isReadOnly || undefined}
      data-pending={isPending || undefined}
      className={cx(styles.root, className)}
    >
      <label id={labelId} htmlFor={firstSlotId} className={styles.label}>
        {label}
      </label>

      <div className={styles.slotsRow}>
        {/* biome-ignore lint/a11y/useSemanticElements: OTP digit group uses WAI-ARIA group with labelled individual inputs */}
        <div
          role="group"
          aria-labelledby={labelId}
          aria-describedby={describedBy}
          dir="ltr"
          className={styles.slots}
        >
          {slots.map((digit, index) => (
            <RacInput
              // biome-ignore lint/suspicious/noArrayIndexKey: OTP digit slots have fixed positional identity (0..length-1)
              key={`${autoId}-slot-${index}`}
              ref={setSlotRef(index)}
              id={index === 0 ? firstSlotId : `${autoId}-slot-${index}`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              dir="ltr"
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              spellCheck={false}
              aria-label={messages.otpSlotLabel(index + 1, safeLength)}
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
              aria-required={isRequired || undefined}
              data-invalid={invalid || undefined}
              disabled={isDisabled}
              readOnly={isReadOnly || isPending}
              value={digit}
              onChange={handleSlotChange(index)}
              onPaste={handleSlotPaste(index)}
              onKeyDown={handleSlotKeyDown(index)}
              onFocus={(event) => event.currentTarget.select()}
              className={cx(styles.slot)}
            />
          ))}
        </div>

        {isPending && (
          <RacProgressBar
            isIndeterminate
            aria-label={messages.pending}
            className={cx(styles.pending)}
          >
            <span aria-hidden="true" />
          </RacProgressBar>
        )}
      </div>

      {name && <input type="hidden" name={name} value={canonical} disabled={isDisabled} />}

      {description != null && (
        <p id={descriptionId} className={styles.description}>
          {description}
        </p>
      )}

      <div className={styles.errorSlot} data-field-error-slot>
        {invalid && resolvedError != null && (
          <div id={errorId} className={styles.error} role="alert">
            {resolvedError}
          </div>
        )}
      </div>

      {showResend && (
        <div className={styles.resendRow}>
          {activeSeconds > 0 ? (
            <span className={styles.resendCountdown}>{messages.otpResendWait(activeSeconds)}</span>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              isDisabled={isDisabled || isPending}
              onPress={handleResend}
            >
              {resendLabel ?? messages.otpResend}
            </Button>
          )}
          <VisuallyHidden>
            <span role="status" aria-live="polite">
              {resendAnnouncement}
            </span>
          </VisuallyHidden>
        </div>
      )}
    </div>
  );
}
