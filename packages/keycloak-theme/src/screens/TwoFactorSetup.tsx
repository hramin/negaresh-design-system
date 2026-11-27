import { iconShield } from '@negaresh/icons';
import {
  Button,
  Checkbox,
  Code,
  CopyButton,
  FormErrorSummary,
  Ltr,
  OTPField,
  Stack,
  Text,
  TextField,
} from '@negaresh/react';
import { type FormEvent, useId, useState } from 'react';
import { useAuthMessages } from '../messages/context.tsx';
import { type AuthBannerMessage, AuthShell, type AuthShellProps } from '../shell/AuthShell.tsx';
import styles from './AuthScreens.module.css';

export interface TotpCredentialOption {
  id: string;
  userLabel: string;
}

export interface TwoFactorSetupProps {
  /** `'setup'` for `login-config-totp.ftl` (QR + manual key + verify) or `'challenge'` for `login-otp.ftl`. Default `'setup'`. */
  mode?: 'setup' | 'challenge' | undefined;
  /** Data URI or image source for the authenticator QR code (`data:image/png;base64,...` or SVG). */
  qrImageSrc?: string | undefined;
  /** Formatted base32 manual secret shown inside LTR `Code` (spaces stripped automatically when copied). */
  manualSecret?: string | undefined;
  /** Raw secret value submitted in Keycloak's hidden `totpSecret` field. */
  rawSecret?: string | undefined;
  /** Optional existing OTP credentials for `'challenge'` mode. */
  credentials?: readonly TotpCredentialOption[] | undefined;
  /** Initially selected credential id in `'challenge'` mode. */
  defaultSelectedCredentialId?: string | undefined;
  /** Whether to show the manual secret expanded initially. Default `true`. */
  defaultShowManualKey?: boolean | undefined;
  /** Server-side verification code error. */
  codeError?: string | undefined;
  /** Server-side device label error. */
  deviceLabelError?: string | undefined;
  /** Pending state. */
  isPending?: boolean | undefined;
  /** Keycloak POST action URL (`url.loginAction`). */
  actionUrl?: string | undefined;
  /** Client submit handler (prevents default when provided). */
  onSubmit?: (
    payload: {
      code: string;
      deviceLabel?: string | undefined;
      logoutSessions?: boolean | undefined;
      selectedCredentialId?: string | undefined;
    },
  ) => void;
  /** Optional banner message. */
  banner?: AuthBannerMessage | undefined;
  /** Shell overrides. */
  shellProps?: Partial<Omit<AuthShellProps, 'title' | 'children'>> | undefined;
}

/**
 * Staff two-factor authenticator setup (`login-config-totp.ftl`) and TOTP challenge (`login-otp.ftl`).
 * Displays a scannable QR frame, LTR base32 manual key with `CopyButton`, and 6-digit `OTPField`.
 */
export function TwoFactorSetup({
  mode = 'setup',
  qrImageSrc,
  manualSecret = '',
  rawSecret,
  credentials,
  defaultSelectedCredentialId,
  defaultShowManualKey = true,
  codeError,
  deviceLabelError,
  isPending = false,
  actionUrl,
  onSubmit,
  banner,
  shellProps,
}: TwoFactorSetupProps) {
  const m = useAuthMessages();
  const baseId = useId();
  const codeId = `${baseId}-totp`;
  const labelId = `${baseId}-userLabel`;

  const [code, setCode] = useState('');
  const [deviceLabel, setDeviceLabel] = useState('');
  const [logoutSessions, setLogoutSessions] = useState(false);
  const [showManualKey, setShowManualKey] = useState(defaultShowManualKey);
  const [selectedCredentialId, setSelectedCredentialId] = useState(
    defaultSelectedCredentialId ?? credentials?.[0]?.id ?? '',
  );
  const [localCodeError, setLocalCodeError] = useState<string | undefined>(undefined);

  const effectiveCodeError = localCodeError ?? codeError;
  const copyValue = (rawSecret ?? manualSecret).replace(/\s+/g, '');

  const summaryErrors = [
    ...(effectiveCodeError ? [{ id: codeId, message: effectiveCodeError }] : []),
    ...(deviceLabelError ? [{ id: labelId, message: deviceLabelError }] : []),
  ];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (code.length !== 6) {
      event.preventDefault();
      setLocalCodeError(m.common.invalidOtpError);
      return;
    }
    setLocalCodeError(undefined);
    if (onSubmit || !actionUrl) {
      event.preventDefault();
      onSubmit?.({
        code,
        ...(mode === 'setup'
          ? { deviceLabel: deviceLabel.trim() || undefined, logoutSessions }
          : { selectedCredentialId: selectedCredentialId || undefined }),
      });
    }
  };

  return (
    <AuthShell
      {...shellProps}
      title={mode === 'setup' ? m.twoFactorSetup.title : m.twoFactorSetup.challengeTitle}
      subtitle={mode === 'setup' ? m.twoFactorSetup.subtitle : m.twoFactorSetup.challengeSubtitle}
      banner={banner}
    >
      <div data-nds="TwoFactorSetup" data-mode={mode}>
        <form
          method={actionUrl ? 'post' : undefined}
          action={actionUrl}
          noValidate
          className={styles.form}
          onSubmit={handleSubmit}
        >
          {mode === 'setup' && (
            <>
              <input type="hidden" name="totpSecret" value={copyValue} />
              <input type="hidden" name="mode" value={showManualKey ? 'manual' : 'qr'} />
            </>
          )}

          <FormErrorSummary errors={summaryErrors} title={m.common.errorSummaryTitle} />

          {mode === 'setup' && (
            <>
              <Stack gap="2">
                <Text size="sm" weight="semibold">
                  {m.twoFactorSetup.stepsHeading}
                </Text>
                <ol className={styles.stepsList}>
                  <li>
                    <Text size="sm" tone="muted" leading="text">
                      {m.twoFactorSetup.stepInstallApp}
                    </Text>
                  </li>
                  <li>
                    <Text size="sm" tone="muted" leading="text">
                      {m.twoFactorSetup.stepScanOrEnter}
                    </Text>
                  </li>
                  <li>
                    <Text size="sm" tone="muted" leading="text">
                      {m.twoFactorSetup.stepEnterCode}
                    </Text>
                  </li>
                </ol>
              </Stack>

              {qrImageSrc && (
                <div className={styles.qrSection}>
                  <div className={styles.qrFrame}>
                    <img
                      src={qrImageSrc}
                      alt={m.twoFactorSetup.qrAlt}
                      width={176}
                      height={176}
                      className={styles.qrImage}
                    />
                  </div>
                  <Text size="xs" tone="subtle">
                    {m.twoFactorSetup.qrCaption}
                  </Text>
                </div>
              )}

              {manualSecret && (
                <Stack gap="2">
                  <div className={styles.inlineRow}>
                    <Text size="sm" weight="medium">
                      {m.twoFactorSetup.manualKeyLabel}
                    </Text>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onPress={() => setShowManualKey((prev) => !prev)}
                    >
                      {showManualKey ? m.twoFactorSetup.hideManualKey : m.twoFactorSetup.showManualKey}
                    </Button>
                  </div>

                  {showManualKey && (
                    <div className={styles.manualKeyBox}>
                      <Ltr>
                        <Code>{manualSecret}</Code>
                      </Ltr>
                      <CopyButton
                        value={copyValue}
                        size="sm"
                        aria-label={m.twoFactorSetup.manualKeyCopyLabel}
                      >
                        {m.twoFactorSetup.manualKeyCopyLabel}
                      </CopyButton>
                    </div>
                  )}
                </Stack>
              )}
            </>
          )}

          {mode === 'challenge' && credentials && credentials.length > 1 && (
            <fieldset className={styles.credentialGroup}>
              <legend>
                <Text size="sm" weight="medium">
                  {m.twoFactorSetup.credentialSelectorLabel}
                </Text>
              </legend>
              {credentials.map((cred) => (
                <label key={cred.id} className={styles.credentialOption}>
                  <input
                    type="radio"
                    name="selectedCredentialId"
                    value={cred.id}
                    checked={selectedCredentialId === cred.id}
                    onChange={() => setSelectedCredentialId(cred.id)}
                  />
                  <Text size="sm">{cred.userLabel}</Text>
                </label>
              ))}
            </fieldset>
          )}

          <OTPField
            id={codeId}
            name={mode === 'setup' ? 'totp' : 'otp'}
            label={m.twoFactorSetup.codeLabel}
            description={m.twoFactorSetup.codeDescription}
            value={code}
            onChange={(next) => {
              setCode(next);
              if (localCodeError) setLocalCodeError(undefined);
            }}
            isRequired
            isDisabled={isPending}
            isInvalid={Boolean(effectiveCodeError)}
            errorMessage={effectiveCodeError}
          />

          {mode === 'setup' && (
            <>
              <TextField
                id={labelId}
                name="userLabel"
                label={m.twoFactorSetup.deviceLabel}
                placeholder={m.twoFactorSetup.devicePlaceholder}
                value={deviceLabel}
                onChange={setDeviceLabel}
                isDisabled={isPending}
                isInvalid={Boolean(deviceLabelError)}
                errorMessage={deviceLabelError}
              />

              <Checkbox
                name="logout-sessions"
                value="on"
                isSelected={logoutSessions}
                onChange={setLogoutSessions}
                isDisabled={isPending}
              >
                {m.twoFactorSetup.logoutSessionsLabel}
              </Checkbox>
            </>
          )}

          <Button type="submit" variant="primary" iconStart={iconShield} fullWidth isPending={isPending}>
            {mode === 'setup' ? m.twoFactorSetup.submitAction : m.twoFactorSetup.challengeSubmit}
          </Button>
        </form>
      </div>
    </AuthShell>
  );
}
