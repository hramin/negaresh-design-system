import type { ExtendKcContext } from 'keycloakify/login/KcContext';

export type KcEnvName = never;

export type KcContextExtension = {
  themeName: 'negaresh';
  properties: Record<string, string | undefined>;
};

/**
 * Custom FreeMarker SPI page contracts registered with Keycloakify.
 * Keycloakify inspects `KcContextExtensionPerPage` to emit `.ftl` files in the JAR:
 * - `login-phone.ftl` (Step 1: mobile entry for PhoneSignIn)
 * - `login-sms-otp.ftl` (Step 2: 6-digit SMS OTP for PhoneSignIn)
 * - `verify-mobile.ftl` (Migrated-user mobile verification Required Action)
 */
export type KcContextExtensionPerPage = {
  'login-phone.ftl': {
    phone?: string;
    passwordLoginUrl?: string;
    registrationUrl?: string;
    recaptchaRequired?: boolean;
    recaptchaSiteKey?: string;
    rateLimitedSeconds?: number;
    phoneFieldName?: string;
  };
  'login-sms-otp.ftl': {
    phone?: string;
    maskedPhone?: string;
    resendCooldownSeconds?: number;
    codeExpiryMinutes?: number;
    changePhoneUrl?: string;
    resendActionUrl?: string;
    rateLimitedSeconds?: number;
    otpFieldName?: string;
    expired?: boolean;
  };
  'verify-mobile.ftl': {
    step?: 'phone' | 'otp';
    phone?: string;
    maskedPhone?: string;
    resendCooldownSeconds?: number;
    codeExpiryMinutes?: number;
    changePhoneUrl?: string;
    logoutUrl?: string;
    isMigratedUser?: boolean;
    phoneFieldName?: string;
    otpFieldName?: string;
  };
};

export type KcContext = ExtendKcContext<KcContextExtension, KcContextExtensionPerPage>;
