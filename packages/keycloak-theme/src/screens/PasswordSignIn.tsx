import { iconPhone, iconSignIn } from '@negaresh/icons';
import {
  Button,
  Checkbox,
  Divider,
  FormErrorSummary,
  Link,
  LinkButton,
  PasswordField,
  Stack,
  Text,
  TextField,
} from '@negaresh/react';
import { type FormEvent, useId, useState } from 'react';
import { useAuthMessages } from '../messages/context.tsx';
import { type AuthBannerMessage, AuthShell, type AuthShellProps } from '../shell/AuthShell.tsx';
import styles from './AuthScreens.module.css';

export interface SocialProviderItem {
  alias: string;
  displayName: string;
  loginUrl: string;
}

export interface PasswordSignInProps {
  /** Initial email or username. */
  defaultUsername?: string | undefined;
  /** Initial remember-me checkbox state. */
  defaultRememberMe?: boolean | undefined;
  /** Shows the remember-me checkbox (mirrors `realm.rememberMe`). Default `true`. */
  allowRememberMe?: boolean | undefined;
  /** Shows the forgot-password link (mirrors `realm.resetPasswordAllowed`). Default `true`. */
  allowForgotPassword?: boolean | undefined;
  /** Forgot-password URL (`url.loginResetCredentialsUrl`). */
  forgotPasswordHref?: string | undefined;
  /** Optional callback for forgot-password navigation. */
  onForgotPassword?: (() => void) | undefined;
  /** Optional URL to switch back to phone+OTP sign-in. */
  phoneSignInHref?: string | undefined;
  /** Optional callback to switch to phone+OTP sign-in. */
  onSwitchToPhone?: (() => void) | undefined;
  /** Optional registration URL (`url.registrationUrl`). */
  registerHref?: string | undefined;
  /** Optional callback for registration navigation. */
  onNavigateRegister?: (() => void) | undefined;
  /** Optional social / SSO identity providers (`kcContext.social.providers`). */
  socialProviders?: readonly SocialProviderItem[] | undefined;
  /** Server-side username error. */
  usernameError?: string | undefined;
  /** Server-side password error. */
  passwordError?: string | undefined;
  /** Optional banner message (e.g. invalid credentials or locked account). */
  banner?: AuthBannerMessage | undefined;
  /** Marks the account temporarily locked and disables submission. */
  isLocked?: boolean | undefined;
  /** Pending submission state. */
  isPending?: boolean | undefined;
  /** Keycloak POST action URL (`url.loginAction`). */
  actionUrl?: string | undefined;
  /** Optional hidden `credentialId` value for Keycloak POST. */
  selectedCredential?: string | undefined;
  /** Client submit handler (prevents default when provided). */
  onSubmit?: ((payload: { username: string; password: string; rememberMe: boolean }) => void) | undefined;
  /** Shell overrides. */
  shellProps?: Partial<Omit<AuthShellProps, 'title' | 'children'>> | undefined;
}

/**
 * Standard Keycloak username/email + password sign-in screen (`login.ftl`).
 * Isolates email/username input in LTR (D-86) and pairs with `PasswordField` reveal toggle.
 */
export function PasswordSignIn({
  defaultUsername = '',
  defaultRememberMe = false,
  allowRememberMe = true,
  allowForgotPassword = true,
  forgotPasswordHref,
  onForgotPassword,
  phoneSignInHref,
  onSwitchToPhone,
  registerHref,
  onNavigateRegister,
  socialProviders,
  usernameError,
  passwordError,
  banner,
  isLocked = false,
  isPending = false,
  actionUrl,
  selectedCredential,
  onSubmit,
  shellProps,
}: PasswordSignInProps) {
  const m = useAuthMessages();
  const baseId = useId();
  const usernameId = `${baseId}-username`;
  const passwordId = `${baseId}-password`;

  const [username, setUsername] = useState(defaultUsername);
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(defaultRememberMe);
  const [localErrors, setLocalErrors] = useState<{
    username?: string | undefined;
    password?: string | undefined;
  }>({});

  const effectiveUsernameError = localErrors.username ?? usernameError;
  const effectivePasswordError = localErrors.password ?? passwordError;

  const summaryErrors = [
    ...(effectiveUsernameError ? [{ id: usernameId, message: effectiveUsernameError }] : []),
    ...(effectivePasswordError ? [{ id: passwordId, message: effectivePasswordError }] : []),
  ];

  const resolvedBanner: AuthBannerMessage | undefined = isLocked
    ? {
        tone: 'danger',
        title: m.passwordSignIn.accountLockedTitle,
        body: m.passwordSignIn.accountLockedDescription,
      }
    : banner;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const nextErrors: { username?: string | undefined; password?: string | undefined } = {};
    if (!username.trim()) nextErrors.username = m.common.requiredFieldError;
    if (!password) nextErrors.password = m.common.requiredFieldError;
    if (nextErrors.username || nextErrors.password) {
      event.preventDefault();
      setLocalErrors(nextErrors);
      return;
    }
    setLocalErrors({});
    if (onSubmit || !actionUrl) {
      event.preventDefault();
      onSubmit?.({ username: username.trim(), password, rememberMe });
    }
  };

  const footer = (
    <Stack gap="3">
      {(phoneSignInHref || onSwitchToPhone) && (
        <div className={styles.actionsStack}>
          <div className={styles.dividerRow} aria-hidden="true">
            <Divider />
            <Text size="sm" tone="subtle">
              {m.common.orDivider}
            </Text>
            <Divider />
          </div>
          {phoneSignInHref && !onSwitchToPhone ? (
            <LinkButton href={phoneSignInHref} variant="secondary" iconStart={iconPhone} fullWidth>
              {m.passwordSignIn.switchToPhone}
            </LinkButton>
          ) : (
            <Button
              type="button"
              variant="secondary"
              iconStart={iconPhone}
              fullWidth
              onPress={() => onSwitchToPhone?.()}
            >
              {m.passwordSignIn.switchToPhone}
            </Button>
          )}
        </div>
      )}

      {(registerHref || onNavigateRegister) && (
        <div className={styles.linkRow}>
          <Text size="sm" tone="muted">
            {m.passwordSignIn.createAccountPrompt}
          </Text>
          {registerHref && !onNavigateRegister ? (
            <Link href={registerHref} variant="standalone" className={styles.touchLink}>
              {m.passwordSignIn.createAccountAction}
            </Link>
          ) : (
            <Button type="button" variant="ghost" onPress={() => onNavigateRegister?.()}>
              {m.passwordSignIn.createAccountAction}
            </Button>
          )}
        </div>
      )}
    </Stack>
  );

  return (
    <AuthShell
      {...shellProps}
      title={m.passwordSignIn.title}
      subtitle={m.passwordSignIn.subtitle}
      banner={resolvedBanner}
      cardFooter={footer}
    >
      <div data-nds="PasswordSignIn">
        <form
          method={actionUrl ? 'post' : undefined}
          action={actionUrl}
          noValidate
          className={styles.form}
          onSubmit={handleSubmit}
        >
          {selectedCredential && (
            <input type="hidden" name="credentialId" value={selectedCredential} />
          )}

          <FormErrorSummary errors={summaryErrors} title={m.common.errorSummaryTitle} />

          <TextField
            id={usernameId}
            name="username"
            label={m.passwordSignIn.usernameLabel}
            description={m.passwordSignIn.usernameDescription}
            dir="ltr"
            autoComplete="username"
            value={username}
            onChange={(next) => {
              setUsername(next);
              if (localErrors.username) setLocalErrors((prev) => ({ ...prev, username: undefined }));
            }}
            isRequired
            isDisabled={isLocked || isPending}
            isInvalid={Boolean(effectiveUsernameError)}
            errorMessage={effectiveUsernameError}
          />

          <PasswordField
            id={passwordId}
            name="password"
            label={m.passwordSignIn.passwordLabel}
            autoComplete="current-password"
            value={password}
            onChange={(next) => {
              setPassword(next);
              if (localErrors.password) setLocalErrors((prev) => ({ ...prev, password: undefined }));
            }}
            isRequired
            isDisabled={isLocked || isPending}
            isInvalid={Boolean(effectivePasswordError)}
            errorMessage={effectivePasswordError}
          />

          {(allowRememberMe || allowForgotPassword) && (
            <div className={styles.inlineRow}>
              {allowRememberMe ? (
                <Checkbox
                  name="rememberMe"
                  value="on"
                  isSelected={rememberMe}
                  onChange={setRememberMe}
                  isDisabled={isLocked || isPending}
                >
                  {m.passwordSignIn.rememberMeLabel}
                </Checkbox>
              ) : (
                <span />
              )}

              {allowForgotPassword &&
                (forgotPasswordHref && !onForgotPassword ? (
                  <Link href={forgotPasswordHref} variant="standalone" className={styles.touchLink}>
                    {m.passwordSignIn.forgotPasswordAction}
                  </Link>
                ) : (
                  <Button type="button" variant="ghost" onPress={() => onForgotPassword?.()}>
                    {m.passwordSignIn.forgotPasswordAction}
                  </Button>
                ))}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            iconStart={iconSignIn}
            fullWidth
            isPending={isPending}
            isDisabled={isLocked}
          >
            {m.passwordSignIn.submitAction}
          </Button>

          {socialProviders && socialProviders.length > 0 && (
            <div className={styles.actionsStack}>
              <div className={styles.dividerRow} aria-hidden="true">
                <Divider />
                <Text size="sm" tone="subtle">
                  {m.passwordSignIn.socialDivider}
                </Text>
                <Divider />
              </div>
              {socialProviders.map((provider) => (
                <LinkButton
                  key={provider.alias}
                  href={provider.loginUrl}
                  variant="secondary"
                  fullWidth
                >
                  {m.passwordSignIn.socialContinueWith(provider.displayName)}
                </LinkButton>
              ))}
            </div>
          )}
        </form>
      </div>
    </AuthShell>
  );
}
