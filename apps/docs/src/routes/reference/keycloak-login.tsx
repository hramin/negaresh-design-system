import {
  ErrorScreen,
  ForgotPassword,
  InfoScreen,
  PasswordSignIn,
  PhoneSignIn,
  Register,
  TwoFactorSetup,
  VerifyMobile,
} from '@negaresh/keycloak-theme';
import { sampleAuthFixtures } from '@negaresh/keycloak-theme/fixtures';
import { createFileRoute } from '@tanstack/react-router';

export type KeycloakPreviewScreen =
  | 'phone-signin'
  | 'phone-otp'
  | 'password-signin'
  | 'forgot-password'
  | 'register'
  | 'verify-mobile'
  | 'two-factor-setup'
  | 'error'
  | 'info';

const VALID_SCREENS = new Set<KeycloakPreviewScreen>([
  'phone-signin',
  'phone-otp',
  'password-signin',
  'forgot-password',
  'register',
  'verify-mobile',
  'two-factor-setup',
  'error',
  'info',
]);

function parseScreen(raw: unknown): KeycloakPreviewScreen {
  if (typeof raw === 'string' && VALID_SCREENS.has(raw as KeycloakPreviewScreen)) {
    return raw as KeycloakPreviewScreen;
  }
  return 'phone-signin';
}

export const Route = createFileRoute('/reference/keycloak-login')({
  validateSearch: (search: Record<string, unknown>) => ({
    screen: parseScreen(search.screen),
  }),
  head: () => ({
    meta: [{ title: 'پیش‌نمایش تمام‌صفحهٔ پوستهٔ ورود Keycloak · دیزاین سیستم نگرش' }],
  }),
  component: KeycloakLoginReferencePage,
});

function KeycloakLoginReferencePage() {
  const { screen } = Route.useSearch();
  const shellProps = { productName: 'سامانهٔ رجیستری نگرش' };

  switch (screen) {
    case 'phone-otp':
      return (
        <PhoneSignIn
          step="otp"
          defaultPhone={sampleAuthFixtures.phone}
          maskedPhone={sampleAuthFixtures.maskedPhone}
          resendSecondsRemaining={45}
          editPhoneHref="/reference/keycloak-login?screen=phone-signin"
          passwordSignInHref="/reference/keycloak-login?screen=password-signin"
          shellProps={shellProps}
        />
      );

    case 'password-signin':
      return (
        <PasswordSignIn
          defaultUsername={sampleAuthFixtures.staffEmail}
          socialProviders={sampleAuthFixtures.socialProviders}
          forgotPasswordHref="/reference/keycloak-login?screen=forgot-password"
          phoneSignInHref="/reference/keycloak-login?screen=phone-signin"
          registerHref="/reference/keycloak-login?screen=register"
          shellProps={shellProps}
        />
      );

    case 'forgot-password':
      return (
        <ForgotPassword
          mode="sms"
          defaultIdentifier={sampleAuthFixtures.phoneDisplayInput}
          resendSecondsRemaining={45}
          backToSignInHref="/reference/keycloak-login?screen=password-signin"
          shellProps={shellProps}
        />
      );

    case 'register':
      return (
        <Register
          defaultValues={{
            firstName: sampleAuthFixtures.firstName,
            lastName: sampleAuthFixtures.lastName,
            phone: sampleAuthFixtures.phoneDisplayInput,
          }}
          signInHref="/reference/keycloak-login?screen=phone-signin"
          shellProps={shellProps}
        />
      );

    case 'verify-mobile':
      return (
        <VerifyMobile
          step="phone"
          defaultPhone={sampleAuthFixtures.phoneDisplayInput}
          signOutHref="/reference/keycloak-login?screen=phone-signin"
          shellProps={shellProps}
        />
      );

    case 'two-factor-setup':
      return (
        <TwoFactorSetup
          mode="setup"
          qrImageSrc={sampleAuthFixtures.totpQrDataUri}
          manualSecret={sampleAuthFixtures.totpSecret}
          rawSecret={sampleAuthFixtures.totpSecretRaw}
          shellProps={{ productName: 'پنل همکاران نگرش' }}
        />
      );

    case 'error':
      return (
        <ErrorScreen
          message="پیوند ورود منقضی شده یا نامعتبر است. برای ادامه، دوباره از برنامه وارد شوید."
          referenceCode={sampleAuthFixtures.errorReferenceCode}
          backHref="/reference/keycloak-login?screen=phone-signin"
          supportHref="/patterns/identity-security"
          shellProps={shellProps}
        />
      );

    case 'info':
      return (
        <InfoScreen
          message="شمارهٔ موبایل شما با موفقیت تأیید شد. اکنون می‌توانید به سامانهٔ رجیستری بازگردید."
          tone="success"
          requiredActions={sampleAuthFixtures.infoRequiredActions}
          actionHref="/patterns/identity-security"
          backToSignInHref="/reference/keycloak-login?screen=phone-signin"
          shellProps={shellProps}
        />
      );

    default:
      return (
        <PhoneSignIn
          key={screen}
          defaultStep="phone"
          defaultPhone={sampleAuthFixtures.phoneDisplayInput}
          passwordSignInHref="/reference/keycloak-login?screen=password-signin"
          registerHref="/reference/keycloak-login?screen=register"
          shellProps={shellProps}
        />
      );
  }
}
