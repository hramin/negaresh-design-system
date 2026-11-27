import { iconCheck, iconEdit, iconPhone, iconSignOut } from '@negaresh/icons';
import {
  Button,
  FormErrorSummary,
  InlineAlert,
  Link,
  Ltr,
  OTPField,
  PhoneField,
  Text,
} from '@negaresh/react';
import { maskPhone, normalizePhone } from '@negaresh/utils';
import { type FormEvent, useId, useState } from 'react';
import { useAuthMessages } from '../messages/context.tsx';
import { type AuthBannerMessage, AuthShell, type AuthShellProps } from '../shell/AuthShell.tsx';
import styles from './AuthScreens.module.css';

export type VerifyMobileStep = 'phone' | 'otp';

export interface VerifyMobileProps {
  /** Controlled step (`'phone'` or `'otp'`). */
  step?: VerifyMobileStep | undefined;
  /** Initial step when uncontrolled. Default `'phone'`. */
  defaultStep?: VerifyMobileStep | undefined;
  /** Initial phone number. */
  defaultPhone?: string | undefined;
  /** Pre-masked phone number for the OTP step. */
  maskedPhone?: string | undefined;
  /** Shows the migrated-user explanation notice (`patterns.md`). Default `true`. */
  showMigrationNotice?: boolean | undefined;
  /** Controlled resend countdown seconds. */
  resendSecondsRemaining?: number | undefined;
  /** Code expiry minutes. Default `2`. */
  codeExpiryMinutes?: number | undefined;
  /** Server-side phone error (e.g. duplicate mobile). */
  phoneError?: string | undefined;
  /** Server-side OTP error. */
  otpError?: string | undefined;
  /** Pending state. */
  isPending?: boolean | undefined;
  /** Keycloak POST action URL (`url.loginAction`). */
  actionUrl?: string | undefined;
  /** POST field name for phone. Default `'phone'`. */
  phoneFieldName?: string | undefined;
  /** POST field name for OTP code. Default `'code'`. */
  otpFieldName?: string | undefined;
  /** Optional URL to edit phone number on OTP step. */
  editPhoneHref?: string | undefined;
  /** Optional sign-out / cancel URL. */
  signOutHref?: string | undefined;
  /** Optional callback for sign-out. */
  onSignOut?: (() => void) | undefined;
  /** Called on valid phone submission. */
  onSubmitPhone?: ((canonicalPhone: string) => void) | undefined;
  /** Called on valid OTP submission. */
  onSubmitOtp?: ((payload: { phone: string; code: string }) => void) | undefined;
  /** Called on resend press. */
  onResend?: (() => void) | undefined;
  /** Optional banner message. */
  banner?: AuthBannerMessage | undefined;
  /** Shell overrides. */
  shellProps?: Partial<Omit<AuthShellProps, 'title' | 'children'>> | undefined;
}

/**
 * Mobile verification Required Action screen (`verify-mobile.ftl`) for migrated users
 * without a verified Iranian mobile number (`docs/patterns.md`).
 */
export function VerifyMobile({
  step: controlledStep,
  defaultStep = 'phone',
  defaultPhone = '',
  maskedPhone,
  showMigrationNotice = true,
  resendSecondsRemaining,
  codeExpiryMinutes = 2,
  phoneError,
  otpError,
  isPending = false,
  actionUrl,
  phoneFieldName = 'phone',
  otpFieldName = 'code',
  editPhoneHref,
  signOutHref,
  onSignOut,
  onSubmitPhone,
  onSubmitOtp,
  onResend,
  banner,
  shellProps,
}: VerifyMobileProps) {
  const m = useAuthMessages();
  const baseId = useId();
  const phoneId = `${baseId}-phone`;
  const otpId = `${baseId}-otp`;

  const [internalStep, setInternalStep] = useState<VerifyMobileStep>(defaultStep);
  const activeStep = controlledStep ?? internalStep;

  const [phone, setPhone] = useState(defaultPhone);
  const [otp, setOtp] = useState('');
  const [localPhoneError, setLocalPhoneError] = useState<string | undefined>(undefined);
  const [localOtpError, setLocalOtpError] = useState<string | undefined>(undefined);

  const effectivePhoneError = localPhoneError ?? phoneError;
  const effectiveOtpError = localOtpError ?? otpError;

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
      if (controlledStep === undefined) setInternalStep('otp');
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

  const footer =
    signOutHref || onSignOut ? (
      <div className={styles.linkRow}>
        {signOutHref && !onSignOut ? (
          <Link href={signOutHref} variant="standalone" className={styles.touchLink}>
            {m.verifyMobile.signOutAction}
          </Link>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            iconStart={iconSignOut}
            onPress={() => onSignOut?.()}
          >
            {m.verifyMobile.signOutAction}
          </Button>
        )}
      </div>
    ) : undefined;

  return (
    <AuthShell
      {...shellProps}
      title={m.verifyMobile.title}
      subtitle={
        activeStep === 'phone'
          ? m.verifyMobile.phoneSubtitle
          : m.verifyMobile.otpSubtitle(displayMaskedPhone)
      }
      banner={banner}
      cardFooter={footer}
    >
      <div data-nds="VerifyMobile" data-step={activeStep}>
        {showMigrationNotice && activeStep === 'phone' && (
          <InlineAlert tone="info" title={m.verifyMobile.migrationNoticeTitle}>
            {m.verifyMobile.migrationNoticeDescription}
          </InlineAlert>
        )}

        {activeStep === 'phone' ? (
          <form
            method={actionUrl ? 'post' : undefined}
            action={actionUrl}
            noValidate
            className={styles.form}
            onSubmit={handlePhoneSubmit}
          >
            <FormErrorSummary
              errors={effectivePhoneError ? [{ id: phoneId, message: effectivePhoneError }] : []}
              title={m.common.errorSummaryTitle}
            />

            <PhoneField
              id={phoneId}
              name={phoneFieldName}
              label={m.verifyMobile.phoneLabel}
              value={phone}
              onChange={(next) => {
                setPhone(next);
                if (localPhoneError) setLocalPhoneError(undefined);
              }}
              isRequired
              isDisabled={isPending}
              isInvalid={Boolean(effectivePhoneError)}
              errorMessage={effectivePhoneError}
            />

            <Button type="submit" variant="primary" iconStart={iconPhone} fullWidth isPending={isPending}>
              {m.verifyMobile.sendCodeSubmit}
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
              {editPhoneHref ? (
                <Link href={editPhoneHref} variant="standalone" className={styles.touchLink}>
                  {m.verifyMobile.editPhoneAction}
                </Link>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  iconStart={iconEdit}
                  onPress={() => {
                    if (controlledStep === undefined) setInternalStep('phone');
                  }}
                >
                  {m.verifyMobile.editPhoneAction}
                </Button>
              )}
            </div>

            <OTPField
              id={otpId}
              name={otpFieldName}
              label={m.verifyMobile.otpLabel}
              description={m.verifyMobile.otpExpiryNotice(codeExpiryMinutes)}
              value={otp}
              onChange={(next) => {
                setOtp(next);
                if (localOtpError) setLocalOtpError(undefined);
              }}
              isRequired
              isDisabled={isPending}
              isInvalid={Boolean(effectiveOtpError)}
              errorMessage={effectiveOtpError}
              resendCooldown={60}
              resendSecondsRemaining={resendSecondsRemaining}
              onResend={onResend ?? (() => {})}
            />

            <Button type="submit" variant="primary" iconStart={iconCheck} fullWidth isPending={isPending}>
              {m.verifyMobile.confirmSubmit}
            </Button>
          </form>
        )}
      </div>
    </AuthShell>
  );
}
