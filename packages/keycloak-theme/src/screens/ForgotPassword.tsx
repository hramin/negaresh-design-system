import { iconArrowStart, iconEdit, iconKey, iconSend } from '@negaresh/icons';
import {
  Button,
  FormErrorSummary,
  InlineAlert,
  Link,
  Ltr,
  OTPField,
  PasswordField,
  PhoneField,
  Text,
  TextField,
} from '@negaresh/react';
import { maskPhone, normalizePhone } from '@negaresh/utils';
import { type FormEvent, useId, useState } from 'react';
import { useAuthMessages } from '../messages/context.tsx';
import { type AuthBannerMessage, AuthShell, type AuthShellProps } from '../shell/AuthShell.tsx';
import styles from './AuthScreens.module.css';

export type ForgotPasswordMode = 'sms' | 'identifier';
export type ForgotPasswordStep = 'identify' | 'otp' | 'reset' | 'sent';

export interface ForgotPasswordProps {
  /** `'sms'` for 3-step phone SMS recovery (patterns.md) or `'identifier'` for standard Keycloak email/username reset. Default `'sms'`. */
  mode?: ForgotPasswordMode | undefined;
  /** Controlled recovery step. */
  step?: ForgotPasswordStep | undefined;
  /** Initial uncontrolled step. Default `'identify'`. */
  defaultStep?: ForgotPasswordStep | undefined;
  /** Initial phone or email/username value. */
  defaultIdentifier?: string | undefined;
  /** Pre-masked phone for the OTP step. */
  maskedPhone?: string | undefined;
  /** Controlled resend countdown seconds. */
  resendSecondsRemaining?: number | undefined;
  /** OTP expiry minutes. Default `2`. */
  codeExpiryMinutes?: number | undefined;
  /** Server-side identifier/phone error. */
  identifierError?: string | undefined;
  /** Server-side OTP error. */
  otpError?: string | undefined;
  /** Server-side new-password error. */
  passwordError?: string | undefined;
  /** Server-side confirm-password error. */
  confirmPasswordError?: string | undefined;
  /** Pending state. */
  isPending?: boolean | undefined;
  /** Keycloak POST action URL (`url.loginAction`). */
  actionUrl?: string | undefined;
  /** Back-to-sign-in URL (`url.loginUrl`). */
  backToSignInHref?: string | undefined;
  /** Optional callback for back-to-sign-in action. */
  onBackToSignIn?: (() => void) | undefined;
  /** Called on identifier/phone step submit. */
  onRequestCode?: ((identifier: string) => void) | undefined;
  /** Called on OTP verification step submit. */
  onVerifyCode?: ((payload: { phone: string; code: string }) => void) | undefined;
  /** Called on new password step submit. */
  onResetPassword?: ((payload: { password: string }) => void) | undefined;
  /** Called when resend button is pressed. */
  onResend?: (() => void) | undefined;
  /** Optional banner message. */
  banner?: AuthBannerMessage | undefined;
  /** Shell overrides. */
  shellProps?: Partial<Omit<AuthShellProps, 'title' | 'children'>> | undefined;
}

/**
 * Password recovery screen supporting both SMS OTP recovery (`patterns.md`) and standard
 * Keycloak `login-reset-password.ftl` / `login-update-password.ftl` flows.
 */
export function ForgotPassword({
  mode = 'sms',
  step: controlledStep,
  defaultStep = 'identify',
  defaultIdentifier = '',
  maskedPhone,
  resendSecondsRemaining,
  codeExpiryMinutes = 2,
  identifierError,
  otpError,
  passwordError,
  confirmPasswordError,
  isPending = false,
  actionUrl,
  backToSignInHref,
  onBackToSignIn,
  onRequestCode,
  onVerifyCode,
  onResetPassword,
  onResend,
  banner,
  shellProps,
}: ForgotPasswordProps) {
  const m = useAuthMessages();
  const baseId = useId();
  const identifierId = `${baseId}-identifier`;
  const otpId = `${baseId}-otp`;
  const newPassId = `${baseId}-new-password`;
  const confirmPassId = `${baseId}-confirm-password`;

  const [internalStep, setInternalStep] = useState<ForgotPasswordStep>(defaultStep);
  const activeStep = controlledStep ?? internalStep;

  const [identifier, setIdentifier] = useState(defaultIdentifier);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localErrors, setLocalErrors] = useState<{
    identifier?: string | undefined;
    otp?: string | undefined;
    password?: string | undefined;
    confirm?: string | undefined;
  }>({});

  const effectiveIdentifierError = localErrors.identifier ?? identifierError;
  const effectiveOtpError = localErrors.otp ?? otpError;
  const effectivePasswordError = localErrors.password ?? passwordError;
  const effectiveConfirmError = localErrors.confirm ?? confirmPasswordError;

  const displayMaskedPhone =
    maskedPhone ??
    (normalizePhone(identifier) ? maskPhone(normalizePhone(identifier)!) : null) ??
    maskPhone('+989123456789') ??
    '+98912***4567';

  const handleIdentifySubmit = (event: FormEvent<HTMLFormElement>) => {
    if (mode === 'sms') {
      const canonical = normalizePhone(identifier);
      if (!canonical) {
        event.preventDefault();
        setLocalErrors({ identifier: m.common.invalidPhoneError });
        return;
      }
      setLocalErrors({});
      if (onRequestCode || !actionUrl) {
        event.preventDefault();
        setIdentifier(canonical);
        onRequestCode?.(canonical);
        if (controlledStep === undefined) setInternalStep('otp');
      }
      return;
    }

    if (!identifier.trim()) {
      event.preventDefault();
      setLocalErrors({ identifier: m.common.requiredFieldError });
      return;
    }
    setLocalErrors({});
    if (onRequestCode || !actionUrl) {
      event.preventDefault();
      onRequestCode?.(identifier.trim());
      if (controlledStep === undefined) setInternalStep('sent');
    }
  };

  const handleOtpSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (otp.length !== 6) {
      event.preventDefault();
      setLocalErrors({ otp: m.common.invalidOtpError });
      return;
    }
    setLocalErrors({});
    if (onVerifyCode || !actionUrl) {
      event.preventDefault();
      onVerifyCode?.({ phone: normalizePhone(identifier) ?? identifier, code: otp });
      if (controlledStep === undefined) setInternalStep('reset');
    }
  };

  const handleResetSubmit = (event: FormEvent<HTMLFormElement>) => {
    const next: { password?: string | undefined; confirm?: string | undefined } = {};
    if (newPassword.length < 8) next.password = m.common.passwordTooShortError;
    if (newPassword !== confirmPassword) next.confirm = m.common.passwordMismatchError;
    if (next.password || next.confirm) {
      event.preventDefault();
      setLocalErrors(next);
      return;
    }
    setLocalErrors({});
    if (onResetPassword || !actionUrl) {
      event.preventDefault();
      onResetPassword?.({ password: newPassword });
      if (controlledStep === undefined) setInternalStep('sent');
    }
  };

  const stepNumber = activeStep === 'identify' ? 1 : activeStep === 'otp' ? 2 : 3;
  const eyebrow =
    mode === 'sms' && activeStep !== 'sent' ? m.forgotPassword.stepLabel(stepNumber, 3) : undefined;

  const title =
    activeStep === 'otp'
      ? m.forgotPassword.otpStepTitle
      : activeStep === 'reset'
        ? m.forgotPassword.resetStepTitle
        : m.forgotPassword.title;

  const subtitle =
    activeStep === 'identify'
      ? mode === 'sms'
        ? m.forgotPassword.smsPhoneSubtitle
        : m.forgotPassword.identifierSubtitle
      : activeStep === 'otp'
        ? m.forgotPassword.otpStepSubtitle(displayMaskedPhone)
        : activeStep === 'reset'
          ? m.forgotPassword.resetStepSubtitle
          : undefined;

  const footer =
    backToSignInHref || onBackToSignIn ? (
      <div className={styles.linkRow}>
        {backToSignInHref && !onBackToSignIn ? (
          <Link href={backToSignInHref} variant="standalone" className={styles.touchLink}>
            {m.common.backToSignIn}
          </Link>
        ) : (
          <Button type="button" variant="ghost" size="sm" onPress={() => onBackToSignIn?.()}>
            {m.common.backToSignIn}
          </Button>
        )}
      </div>
    ) : undefined;

  return (
    <AuthShell
      {...shellProps}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      banner={banner}
      cardFooter={footer}
    >
      <div data-nds="ForgotPassword" data-mode={mode} data-step={activeStep}>
        {activeStep === 'identify' && (
          <form
            method={actionUrl ? 'post' : undefined}
            action={actionUrl}
            noValidate
            className={styles.form}
            onSubmit={handleIdentifySubmit}
          >
            <FormErrorSummary
              errors={
                effectiveIdentifierError
                  ? [{ id: identifierId, message: effectiveIdentifierError }]
                  : []
              }
              title={m.common.errorSummaryTitle}
            />

            {mode === 'sms' ? (
              <PhoneField
                id={identifierId}
                name="username"
                label={m.forgotPassword.phoneLabel}
                value={identifier}
                onChange={(next) => {
                  setIdentifier(next);
                  if (localErrors.identifier) setLocalErrors({});
                }}
                isRequired
                isDisabled={isPending}
                isInvalid={Boolean(effectiveIdentifierError)}
                errorMessage={effectiveIdentifierError}
              />
            ) : (
              <TextField
                id={identifierId}
                name="username"
                label={m.forgotPassword.identifierLabel}
                description={m.forgotPassword.identifierDescription}
                dir="ltr"
                autoComplete="username"
                value={identifier}
                onChange={(next) => {
                  setIdentifier(next);
                  if (localErrors.identifier) setLocalErrors({});
                }}
                isRequired
                isDisabled={isPending}
                isInvalid={Boolean(effectiveIdentifierError)}
                errorMessage={effectiveIdentifierError}
              />
            )}

            <Button type="submit" variant="primary" iconStart={iconSend} fullWidth isPending={isPending}>
              {mode === 'sms' ? m.forgotPassword.sendCodeSubmit : m.forgotPassword.sendLinkSubmit}
            </Button>
          </form>
        )}

        {activeStep === 'otp' && (
          <form
            method={actionUrl ? 'post' : undefined}
            action={actionUrl}
            noValidate
            className={styles.form}
            onSubmit={handleOtpSubmit}
          >
            <FormErrorSummary
              errors={effectiveOtpError ? [{ id: otpId, message: effectiveOtpError }] : []}
              title={m.common.errorSummaryTitle}
            />

            <div className={styles.phoneSummary}>
              <Ltr>
                <Text size="md" weight="medium">
                  {displayMaskedPhone}
                </Text>
              </Ltr>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                iconStart={iconEdit}
                onPress={() => {
                  if (controlledStep === undefined) setInternalStep('identify');
                }}
              >
                {m.forgotPassword.editPhoneAction}
              </Button>
            </div>

            <OTPField
              id={otpId}
              name="code"
              label={m.forgotPassword.otpLabel}
              description={m.forgotPassword.otpExpiryNotice(codeExpiryMinutes)}
              value={otp}
              onChange={(next) => {
                setOtp(next);
                if (localErrors.otp) setLocalErrors({});
              }}
              isRequired
              isDisabled={isPending}
              isInvalid={Boolean(effectiveOtpError)}
              errorMessage={effectiveOtpError}
              resendCooldown={60}
              resendSecondsRemaining={resendSecondsRemaining}
              onResend={onResend ?? (() => {})}
            />

            <Button
              type="submit"
              variant="primary"
              iconStart={iconArrowStart}
              fullWidth
              isPending={isPending}
            >
              {m.forgotPassword.verifyCodeSubmit}
            </Button>
          </form>
        )}

        {activeStep === 'reset' && (
          <form
            method={actionUrl ? 'post' : undefined}
            action={actionUrl}
            noValidate
            className={styles.form}
            onSubmit={handleResetSubmit}
          >
            <FormErrorSummary
              errors={[
                ...(effectivePasswordError ? [{ id: newPassId, message: effectivePasswordError }] : []),
                ...(effectiveConfirmError
                  ? [{ id: confirmPassId, message: effectiveConfirmError }]
                  : []),
              ]}
              title={m.common.errorSummaryTitle}
            />

            <PasswordField
              id={newPassId}
              name="password-new"
              label={m.forgotPassword.newPasswordLabel}
              strengthHint={m.forgotPassword.passwordStrengthHint}
              autoComplete="new-password"
              value={newPassword}
              onChange={(next) => {
                setNewPassword(next);
                if (localErrors.password) setLocalErrors((prev) => ({ ...prev, password: undefined }));
              }}
              isRequired
              isDisabled={isPending}
              isInvalid={Boolean(effectivePasswordError)}
              errorMessage={effectivePasswordError}
            />

            <PasswordField
              id={confirmPassId}
              name="password-confirm"
              label={m.forgotPassword.confirmPasswordLabel}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(next) => {
                setConfirmPassword(next);
                if (localErrors.confirm) setLocalErrors((prev) => ({ ...prev, confirm: undefined }));
              }}
              isRequired
              isDisabled={isPending}
              isInvalid={Boolean(effectiveConfirmError)}
              errorMessage={effectiveConfirmError}
            />

            <Button type="submit" variant="primary" iconStart={iconKey} fullWidth isPending={isPending}>
              {m.forgotPassword.savePasswordSubmit}
            </Button>
          </form>
        )}

        {activeStep === 'sent' && (
          <InlineAlert tone="success" title={m.forgotPassword.sentSuccessTitle}>
            {m.forgotPassword.sentSuccessDescription}
          </InlineAlert>
        )}
      </div>
    </AuthShell>
  );
}
