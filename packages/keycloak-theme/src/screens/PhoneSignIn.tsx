import { iconArrowStart, iconEdit, iconLock, iconPhone } from '@negaresh/icons';
import {
  Button,
  Divider,
  FormErrorSummary,
  InlineAlert,
  Link,
  Ltr,
  OTPField,
  PhoneField,
  Stack,
  Text,
} from '@negaresh/react';
import { maskPhone, normalizePhone } from '@negaresh/utils';
import { type FormEvent, type ReactNode, useId, useState } from 'react';
import { useAuthMessages } from '../messages/context.tsx';
import { type AuthBannerMessage, AuthShell, type AuthShellProps } from '../shell/AuthShell.tsx';
import styles from './AuthScreens.module.css';

export type PhoneSignInStep = 'phone' | 'otp';

export interface PhoneSignInProps {
  /** Active step (`'phone'` or `'otp'`). Omit for uncontrolled interactive transitions. */
  step?: PhoneSignInStep | undefined;
  /** Initial step when uncontrolled. Default `'phone'`. */
  defaultStep?: PhoneSignInStep | undefined;
  /** Controlled or initial Iranian mobile number. */
  defaultPhone?: string | undefined;
  /** Pre-masked phone display (auto-computed via `maskPhone` when omitted). */
  maskedPhone?: string | undefined;
  /** Controlled or initial 6-digit OTP code. */
  defaultOtp?: string | undefined;
  /** Remaining resend countdown seconds (default `60` on OTP step). */
  resendSecondsRemaining?: number | undefined;
  /** Code expiry in minutes displayed in Persian digits. Default `2`. */
  codeExpiryMinutes?: number | undefined;
  /** Rate-limit cooldown in seconds; shows a warning/danger banner and disables submit. */
  rateLimitedSeconds?: number | undefined;
  /** Server-side phone validation error. */
  phoneError?: string | undefined;
  /** Server-side OTP error (wrong code or expired code). */
  otpError?: string | undefined;
  /** Marks the OTP code as expired (uses `expiredCodeError` fallback if `otpError` is omitted). */
  isCodeExpired?: boolean | undefined;
  /** Pending submission indicator. */
  isPending?: boolean | undefined;
  /** Optional CAPTCHA widget slot (rendered on phone step). */
  captchaSlot?: ReactNode;
  /** Keycloak POST action URL for native form submission. */
  actionUrl?: string | undefined;
  /** POST field name for canonical phone. Default `'phone'`. */
  phoneFieldName?: string | undefined;
  /** POST field name for OTP code. Default `'code'`. */
  otpFieldName?: string | undefined;
  /** Optional URL for switching to password sign-in. */
  passwordSignInHref?: string | undefined;
  /** Optional callback for switching to password sign-in. */
  onSwitchToPassword?: (() => void) | undefined;
  /** Optional registration URL. */
  registerHref?: string | undefined;
  /** Optional callback for navigating to registration. */
  onNavigateRegister?: (() => void) | undefined;
  /** Optional URL for editing the phone number on the OTP step. */
  editPhoneHref?: string | undefined;
  /** Callback when the user requests to edit the phone number. */
  onEditPhone?: (() => void) | undefined;
  /** Called on valid phone submission (prevents default when provided). */
  onSubmitPhone?: ((canonicalPhone: string) => void) | undefined;
  /** Called on valid 6-digit OTP submission (prevents default when provided). */
  onSubmitOtp?: ((payload: { phone: string; code: string }) => void) | undefined;
  /** Called when resend button is pressed. */
  onResend?: (() => void) | undefined;
  /** Optional banner message (e.g. Keycloak `kcContext.message`). */
  banner?: AuthBannerMessage | undefined;
  /** Shell presentation overrides (productName, embedded, headingLevel, etc.). */
  shellProps?: Partial<Omit<AuthShellProps, 'title' | 'children'>> | undefined;
}

/**
 * Two-step Persian phone + SMS OTP sign-in screen (`login-phone.ftl` & `login-sms-otp.ftl`).
 * Normalises `09…`/`+98…`/Persian-Arabic digits into `+989xxxxxxxxx` and isolates LTR inputs (D-86).
 */
export function PhoneSignIn({
  step: controlledStep,
  defaultStep = 'phone',
  defaultPhone = '',
  maskedPhone,
  defaultOtp = '',
  resendSecondsRemaining,
  codeExpiryMinutes = 2,
  rateLimitedSeconds,
  phoneError,
  otpError,
  isCodeExpired = false,
  isPending = false,
  captchaSlot,
  actionUrl,
  phoneFieldName = 'phone',
  otpFieldName = 'code',
  passwordSignInHref,
  onSwitchToPassword,
  registerHref,
  onNavigateRegister,
  editPhoneHref,
  onEditPhone,
  onSubmitPhone,
  onSubmitOtp,
  onResend,
  banner,
  shellProps,
}: PhoneSignInProps) {
  const m = useAuthMessages();
  const baseId = useId();
  const phoneInputId = `${baseId}-phone`;
  const otpInputId = `${baseId}-otp`;

  const [internalStep, setInternalStep] = useState<PhoneSignInStep>(defaultStep);
  const activeStep = controlledStep ?? internalStep;

  const [phone, setPhone] = useState(defaultPhone);
  const [otp, setOtp] = useState(defaultOtp);
  const [localPhoneError, setLocalPhoneError] = useState<string | undefined>(undefined);
  const [localOtpError, setLocalOtpError] = useState<string | undefined>(undefined);

  const effectivePhoneError = localPhoneError ?? phoneError;
  const effectiveOtpError =
    localOtpError ?? otpError ?? (isCodeExpired ? m.phoneSignIn.expiredCodeError : undefined);
  const isRateLimited = typeof rateLimitedSeconds === 'number' && rateLimitedSeconds > 0;

  const displayMaskedPhone =
    maskedPhone ??
    (normalizePhone(phone) ? maskPhone(normalizePhone(phone)!) : null) ??
    maskPhone('+989123456789') ??
    '+98912***4567';

  const handlePhoneSubmit = (event: FormEvent<HTMLFormElement>) => {
    const canonical = normalizePhone(phone);
    if (!canonical) {
      event.preventDefault();
      setLocalPhoneError(m.common.invalidPhoneError);
      return;
    }
    setLocalPhoneError(undefined);
    if (onSubmitPhone || !actionUrl) {
      event.preventDefault();
      setPhone(canonical);
      onSubmitPhone?.(canonical);
      if (controlledStep === undefined) {
        setInternalStep('otp');
      }
    }
  };

  const handleOtpSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (otp.length !== 6) {
      event.preventDefault();
      setLocalOtpError(m.common.invalidOtpError);
      return;
    }
    setLocalOtpError(undefined);
    if (onSubmitOtp || !actionUrl) {
      event.preventDefault();
      onSubmitOtp?.({ phone: normalizePhone(phone) ?? phone, code: otp });
    }
  };

  const handleEditPhone = () => {
    setLocalOtpError(undefined);
    setOtp('');
    onEditPhone?.();
    if (controlledStep === undefined) {
      setInternalStep('phone');
    }
  };

  const summaryErrors =
    activeStep === 'phone'
      ? effectivePhoneError
        ? [{ id: phoneInputId, message: effectivePhoneError }]
        : []
      : effectiveOtpError
        ? [{ id: otpInputId, message: effectiveOtpError }]
        : [];

  const resolvedBanner: AuthBannerMessage | undefined = isRateLimited
    ? {
        tone: 'warning',
        title: m.phoneSignIn.rateLimitTitle,
        body: m.phoneSignIn.rateLimitDescription(rateLimitedSeconds),
      }
    : banner;

  const footer = (
    <Stack gap="3">
      {(passwordSignInHref || onSwitchToPassword) && (
        <div className={styles.actionsStack}>
          <div className={styles.dividerRow} aria-hidden="true">
            <Divider />
            <Text size="sm" tone="subtle">
              {m.common.orDivider}
            </Text>
            <Divider />
          </div>
          {passwordSignInHref && !onSwitchToPassword ? (
            <Link href={passwordSignInHref} variant="standalone" className={styles.touchLink}>
              {m.phoneSignIn.switchToPassword}
            </Link>
          ) : (
            <Button
              type="button"
              variant="secondary"
              iconStart={iconLock}
              fullWidth
              onPress={() => onSwitchToPassword?.()}
            >
              {m.phoneSignIn.switchToPassword}
            </Button>
          )}
        </div>
      )}

      {(registerHref || onNavigateRegister) && (
        <div className={styles.linkRow}>
          <Text size="sm" tone="muted">
            {m.phoneSignIn.createAccountPrompt}
          </Text>
          {registerHref && !onNavigateRegister ? (
            <Link href={registerHref} variant="standalone" className={styles.touchLink}>
              {m.phoneSignIn.createAccountAction}
            </Link>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onPress={() => onNavigateRegister?.()}
            >
              {m.phoneSignIn.createAccountAction}
            </Button>
          )}
        </div>
      )}
    </Stack>
  );

  return (
    <AuthShell
      {...shellProps}
      title={activeStep === 'phone' ? m.phoneSignIn.phoneTitle : m.phoneSignIn.otpTitle}
      subtitle={
        activeStep === 'phone'
          ? m.phoneSignIn.phoneSubtitle
          : m.phoneSignIn.otpSubtitle(displayMaskedPhone)
      }
      banner={resolvedBanner}
      cardFooter={footer}
    >
      <div data-nds="PhoneSignIn" data-step={activeStep}>
        {activeStep === 'phone' ? (
          <form
            method={actionUrl ? 'post' : undefined}
            action={actionUrl}
            noValidate
            className={styles.form}
            onSubmit={handlePhoneSubmit}
          >
            <FormErrorSummary errors={summaryErrors} title={m.common.errorSummaryTitle} />

            <PhoneField
              id={phoneInputId}
              name={phoneFieldName}
              label={m.phoneSignIn.phoneLabel}
              description={m.phoneSignIn.phoneDescription}
              value={phone}
              onChange={(next) => {
                setPhone(next);
                if (localPhoneError) setLocalPhoneError(undefined);
              }}
              isRequired
              isDisabled={isRateLimited || isPending}
              isInvalid={Boolean(effectivePhoneError)}
              errorMessage={effectivePhoneError}
            />

            {captchaSlot && (
              <fieldset className={styles.captchaSlot}>
                <legend className={styles.captchaLegend}>{m.common.captchaLabel}</legend>
                {captchaSlot}
              </fieldset>
            )}

            <Button
              type="submit"
              variant="primary"
              iconStart={iconPhone}
              fullWidth
              isPending={isPending}
              isDisabled={isRateLimited}
            >
              {m.phoneSignIn.phoneSubmit}
            </Button>
          </form>
        ) : (
          <form
            method={actionUrl ? 'post' : undefined}
            action={actionUrl}
            noValidate
            className={styles.form}
            onSubmit={handleOtpSubmit}
          >
            <input type="hidden" name={phoneFieldName} value={normalizePhone(phone) ?? phone} />

            <FormErrorSummary errors={summaryErrors} title={m.common.errorSummaryTitle} />

            <div className={styles.phoneSummary}>
              <Ltr>
                <Text size="md" weight="medium">
                  {displayMaskedPhone}
                </Text>
              </Ltr>
              {editPhoneHref && !onEditPhone ? (
                <Link href={editPhoneHref} variant="standalone" className={styles.touchLink}>
                  {m.phoneSignIn.editPhoneAction}
                </Link>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  iconStart={iconEdit}
                  onPress={handleEditPhone}
                >
                  {m.phoneSignIn.editPhoneAction}
                </Button>
              )}
            </div>

            <OTPField
              id={otpInputId}
              name={otpFieldName}
              label={m.phoneSignIn.otpLabel}
              description={m.phoneSignIn.otpExpiryNotice(codeExpiryMinutes)}
              value={otp}
              onChange={(next) => {
                setOtp(next);
                if (localOtpError) setLocalOtpError(undefined);
              }}
              isRequired
              isDisabled={isRateLimited || isPending}
              isInvalid={Boolean(effectiveOtpError)}
              errorMessage={effectiveOtpError}
              resendCooldown={60}
              resendSecondsRemaining={resendSecondsRemaining}
              onResend={onResend ?? (() => {})}
            />

            {isCodeExpired && !otpError && (
              <InlineAlert tone="warning" title={m.common.statusWarningLabel}>
                {m.phoneSignIn.expiredCodeError}
              </InlineAlert>
            )}

            <Button
              type="submit"
              variant="primary"
              iconStart={iconArrowStart}
              fullWidth
              isPending={isPending}
              isDisabled={isRateLimited}
            >
              {m.phoneSignIn.otpSubmit}
            </Button>
          </form>
        )}
      </div>
    </AuthShell>
  );
}
