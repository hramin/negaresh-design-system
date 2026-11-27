import {
  type InlineAlertTone,
  serializeThemeCookie,
  ThemeProvider,
  type ThemeChoice,
} from '@negaresh/react';
import { faMessages } from '@negaresh/react/messages/fa';
import { lazy, Suspense } from 'react';
import { AuthMessagesProvider } from '../messages/context.tsx';
import { faAuthMessages } from '../messages/fa.ts';
import { ErrorScreen } from '../screens/ErrorScreen.tsx';
import { ForgotPassword } from '../screens/ForgotPassword.tsx';
import { InfoScreen } from '../screens/InfoScreen.tsx';
import { PasswordSignIn } from '../screens/PasswordSignIn.tsx';
import { PhoneSignIn } from '../screens/PhoneSignIn.tsx';
import { Register } from '../screens/Register.tsx';
import { TwoFactorSetup } from '../screens/TwoFactorSetup.tsx';
import { VerifyMobile } from '../screens/VerifyMobile.tsx';
import type { AuthBannerMessage } from '../shell/AuthShell.tsx';
import { useI18n } from './i18n.ts';
import type { KcContext } from './KcContext.ts';

const DefaultPage = lazy(() => import('keycloakify/login/DefaultPage'));
const Template = lazy(() => import('keycloakify/login/Template'));
const UserProfileFormFields = lazy(() => import('keycloakify/login/UserProfileFormFields'));

function mapKcBanner(
  message: KcContext['message'],
): AuthBannerMessage | undefined {
  if (!message?.summary) return undefined;
  const toneMap: Record<NonNullable<KcContext['message']>['type'], InlineAlertTone> = {
    success: 'success',
    warning: 'warning',
    error: 'danger',
    info: 'info',
  };
  return {
    tone: toneMap[message.type],
    body: message.summary,
  };
}

function persistThemePreference(next: ThemeChoice) {
  if (typeof document === 'undefined') return;
  try {
    // biome-ignore lint/suspicious/noDocumentCookie: shared first-party NDS theme preference cookie
    document.cookie = serializeThemeCookie(next);
    window.localStorage.setItem('nds-theme', next);
  } catch {
    // Ignore storage restrictions.
  }
}

function readInitialTheme(): ThemeChoice {
  if (typeof document === 'undefined') return 'system';
  try {
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'light' || attr === 'dark') return attr;
  } catch {
    // Ignore DOM read errors.
  }
  return 'system';
}

export interface KcPageProps {
  kcContext: KcContext;
  /** Optional embedded mode for preview/testing without duplicate page landmarks. */
  embedded?: boolean | undefined;
}

/**
 * Keycloakify login theme router mapping every Negaresh Identity & Auth `pageId`
 * to its corresponding NDS screen component, with native Keycloak POST bindings
 * and a safe Keycloakify `DefaultPage` fallback for unmapped pages.
 */
export default function KcPage({ kcContext, embedded = false }: KcPageProps) {
  const { i18n } = useI18n({ kcContext });
  const banner = mapKcBanner(kcContext.message);
  const productName = kcContext.client?.name || undefined;
  const shellProps = {
    productName,
    embedded,
    onThemeChange: persistThemePreference,
  };

  const renderScreen = () => {
    switch (kcContext.pageId) {
      case 'login-phone.ftl':
        return (
          <PhoneSignIn
            step="phone"
            defaultPhone={kcContext.phone ?? ''}
            actionUrl={kcContext.url.loginAction}
            phoneFieldName={kcContext.phoneFieldName ?? 'phone'}
            rateLimitedSeconds={kcContext.rateLimitedSeconds}
            phoneError={
              kcContext.messagesPerField.existsError('phone', 'username')
                ? kcContext.messagesPerField.getFirstError('phone', 'username')
                : undefined
            }
            passwordSignInHref={kcContext.passwordLoginUrl ?? kcContext.url.loginUrl}
            registerHref={kcContext.registrationUrl}
            banner={banner}
            shellProps={shellProps}
          />
        );

      case 'login-sms-otp.ftl':
        return (
          <PhoneSignIn
            step="otp"
            defaultPhone={kcContext.phone ?? ''}
            maskedPhone={kcContext.maskedPhone}
            actionUrl={kcContext.url.loginAction}
            otpFieldName={kcContext.otpFieldName ?? 'code'}
            resendSecondsRemaining={kcContext.resendCooldownSeconds ?? 60}
            codeExpiryMinutes={kcContext.codeExpiryMinutes ?? 2}
            rateLimitedSeconds={kcContext.rateLimitedSeconds}
            isCodeExpired={kcContext.expired}
            otpError={
              kcContext.messagesPerField.existsError('code', 'otp', 'totp')
                ? kcContext.messagesPerField.getFirstError('code', 'otp', 'totp')
                : undefined
            }
            editPhoneHref={kcContext.changePhoneUrl ?? kcContext.url.loginRestartFlowUrl}
            banner={banner}
            shellProps={shellProps}
          />
        );

      case 'login.ftl':
        return (
          <PasswordSignIn
            defaultUsername={kcContext.login.username ?? ''}
            defaultRememberMe={Boolean(kcContext.login.rememberMe)}
            allowRememberMe={kcContext.realm.rememberMe}
            allowForgotPassword={kcContext.realm.resetPasswordAllowed}
            forgotPasswordHref={kcContext.url.loginResetCredentialsUrl}
            registerHref={
              kcContext.realm.registrationAllowed && !kcContext.registrationDisabled
                ? kcContext.url.registrationUrl
                : undefined
            }
            socialProviders={kcContext.social?.providers?.map((p) => ({
              alias: p.alias,
              displayName: p.displayName,
              loginUrl: p.loginUrl,
            }))}
            usernameError={
              kcContext.messagesPerField.existsError('username', 'password')
                ? kcContext.messagesPerField.getFirstError('username', 'password')
                : undefined
            }
            actionUrl={kcContext.url.loginAction}
            selectedCredential={kcContext.auth.selectedCredential}
            banner={banner}
            shellProps={shellProps}
          />
        );

      case 'login-reset-password.ftl':
        return (
          <ForgotPassword
            mode="identifier"
            step="identify"
            defaultIdentifier={kcContext.auth.attemptedUsername ?? ''}
            identifierError={
              kcContext.messagesPerField.existsError('username')
                ? kcContext.messagesPerField.get('username')
                : undefined
            }
            actionUrl={kcContext.url.loginAction}
            backToSignInHref={kcContext.url.loginUrl}
            banner={banner}
            shellProps={shellProps}
          />
        );

      case 'login-update-password.ftl':
        return (
          <ForgotPassword
            mode="sms"
            step="reset"
            passwordError={
              kcContext.messagesPerField.existsError('password', 'password-new')
                ? kcContext.messagesPerField.getFirstError('password', 'password-new')
                : undefined
            }
            confirmPasswordError={
              kcContext.messagesPerField.existsError('password-confirm')
                ? kcContext.messagesPerField.get('password-confirm')
                : undefined
            }
            actionUrl={kcContext.url.loginAction}
            backToSignInHref={kcContext.url.loginUrl}
            banner={banner}
            shellProps={shellProps}
          />
        );

      case 'register.ftl': {
        const attrs = kcContext.profile.attributesByName;
        return (
          <Register
            defaultValues={{
              firstName: attrs.firstName?.value ?? '',
              lastName: attrs.lastName?.value ?? '',
              phone: attrs.phone?.value ?? attrs.mobile?.value ?? '',
              email: attrs.email?.value ?? '',
            }}
            emailRequired={Boolean(attrs.email?.required)}
            passwordRequired={kcContext.passwordRequired}
            termsRequired={Boolean(kcContext.termsAcceptanceRequired)}
            fieldErrors={{
              firstName: kcContext.messagesPerField.get('firstName') || undefined,
              lastName: kcContext.messagesPerField.get('lastName') || undefined,
              phone: kcContext.messagesPerField.getFirstError('phone', 'mobile') || undefined,
              email: kcContext.messagesPerField.get('email') || undefined,
              password: kcContext.messagesPerField.get('password') || undefined,
              passwordConfirm: kcContext.messagesPerField.get('password-confirm') || undefined,
            }}
            actionUrl={kcContext.url.registrationAction}
            signInHref={kcContext.url.loginUrl}
            banner={banner}
            shellProps={shellProps}
          />
        );
      }

      case 'verify-mobile.ftl':
        return (
          <VerifyMobile
            step={kcContext.step ?? 'phone'}
            defaultPhone={kcContext.phone ?? ''}
            maskedPhone={kcContext.maskedPhone}
            showMigrationNotice={kcContext.isMigratedUser ?? true}
            resendSecondsRemaining={kcContext.resendCooldownSeconds ?? 60}
            codeExpiryMinutes={kcContext.codeExpiryMinutes ?? 2}
            phoneError={
              kcContext.messagesPerField.existsError('phone')
                ? kcContext.messagesPerField.get('phone')
                : undefined
            }
            otpError={
              kcContext.messagesPerField.existsError('code', 'otp')
                ? kcContext.messagesPerField.getFirstError('code', 'otp')
                : undefined
            }
            actionUrl={kcContext.url.loginAction}
            phoneFieldName={kcContext.phoneFieldName ?? 'phone'}
            otpFieldName={kcContext.otpFieldName ?? 'code'}
            editPhoneHref={kcContext.changePhoneUrl}
            signOutHref={kcContext.logoutUrl}
            banner={banner}
            shellProps={shellProps}
          />
        );

      case 'login-config-totp.ftl': {
        const qrSrc = kcContext.totp.totpSecretQrCode
          ? `data:image/png;base64,${kcContext.totp.totpSecretQrCode}`
          : kcContext.totp.qrUrl || undefined;
        return (
          <TwoFactorSetup
            mode="setup"
            qrImageSrc={qrSrc}
            manualSecret={kcContext.totp.totpSecretEncoded}
            rawSecret={kcContext.totp.totpSecret}
            codeError={
              kcContext.messagesPerField.existsError('totp')
                ? kcContext.messagesPerField.get('totp')
                : undefined
            }
            deviceLabelError={
              kcContext.messagesPerField.existsError('userLabel')
                ? kcContext.messagesPerField.get('userLabel')
                : undefined
            }
            actionUrl={kcContext.url.loginAction}
            banner={banner}
            shellProps={shellProps}
          />
        );
      }

      case 'login-otp.ftl':
        return (
          <TwoFactorSetup
            mode="challenge"
            credentials={kcContext.otpLogin.userOtpCredentials}
            defaultSelectedCredentialId={kcContext.otpLogin.selectedCredentialId}
            codeError={
              kcContext.messagesPerField.existsError('totp', 'otp')
                ? kcContext.messagesPerField.getFirstError('totp', 'otp')
                : undefined
            }
            actionUrl={kcContext.url.loginAction}
            banner={banner}
            shellProps={shellProps}
          />
        );

      case 'error.ftl':
        return (
          <ErrorScreen
            message={kcContext.message.summary}
            backHref={!kcContext.skipLink ? (kcContext.client?.baseUrl ?? kcContext.url.loginUrl) : undefined}
            shellProps={shellProps}
          />
        );

      case 'info.ftl':
        return (
          <InfoScreen
            title={kcContext.messageHeader || undefined}
            message={kcContext.message.summary}
            tone={kcContext.message.type === 'success' ? 'success' : 'info'}
            requiredActions={kcContext.requiredActions}
            actionHref={
              !kcContext.skipLink
                ? (kcContext.pageRedirectUri ?? kcContext.actionUri ?? kcContext.client?.baseUrl)
                : undefined
            }
            backToSignInHref={kcContext.url.loginUrl}
            shellProps={shellProps}
          />
        );

      default:
        return (
          <Suspense>
            <DefaultPage
              kcContext={kcContext}
              i18n={i18n}
              classes={{}}
              Template={Template}
              doUseDefaultCss={false}
              UserProfileFormFields={UserProfileFormFields}
              doMakeUserConfirmPassword={true}
            />
          </Suspense>
        );
    }
  };

  return (
    <ThemeProvider messages={faMessages} defaultTheme={readInitialTheme()}>
      <AuthMessagesProvider messages={faAuthMessages}>{renderScreen()}</AuthMessagesProvider>
    </ThemeProvider>
  );
}
