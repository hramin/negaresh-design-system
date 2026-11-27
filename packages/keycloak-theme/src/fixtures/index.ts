import { maskPhone } from '@negaresh/utils';
import type { KcContext as BaseKcContext } from 'keycloakify/login/KcContext';
import type { KcContext } from '../login/KcContext.ts';

/**
 * Deterministic inline SVG QR code placeholder (21×21 Version-1 QR geometry)
 * so docs galleries, Vitest, and Playwright never depend on external network images.
 */
const SAMPLE_QR_SVG = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" width="176" height="176" shape-rendering="crispEdges">',
  '<rect width="25" height="25" fill="#ffffff"/>',
  '<path fill="#11181a" d="',
  'M2 2h7v7H2zm1 1v5h5V3zm1 1h3v3H4z',
  'M16 2h7v7h-7zm1 1v5h5V3zm1 1h3v3h-3z',
  'M2 16h7v7H2zm1 1v5h5v-5zm1 1h3v3H4z',
  'M11 2h2v2h-2zM14 3h1v3h-1zM10 5h2v2h-2zM12 7h3v1h-3z',
  'M2 10h2v2H2zM5 10h3v1H5zM9 10h2v3H9zM12 10h4v2h-4zM18 10h2v2h-2zM21 10h2v1h-2z',
  'M3 13h4v2H3zM8 14h3v1H8zM12 13h2v3h-2zM15 13h3v2h-3zM19 13h4v2h-4z',
  'M11 17h2v2h-2zM14 16h2v4h-2zM17 17h3v2h-3zM21 16h2v3h-2z',
  'M11 21h4v2h-4zM16 20h2v3h-2zM19 21h4v2h-4z',
  '"/>',
  '</svg>',
].join('');

export const sampleTotpQrDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(SAMPLE_QR_SVG)}`;

export const sampleAuthFixtures = {
  phone: '+989123456789',
  phoneDisplayInput: '09123456789',
  maskedPhone: maskPhone('+989123456789') ?? '+98912***4567',
  staffEmail: 's.moradi@negaresh.ir',
  firstName: 'سارا',
  lastName: 'مرادی',
  totpSecret: 'JBSW Y3DP EHPK 3PXP',
  totpSecretRaw: 'JBSWY3DPEHPK3PXP',
  totpQrDataUri: sampleTotpQrDataUri,
  errorReferenceCode: 'KC-401-9F2A8C',
  socialProviders: [
    { alias: 'negaresh-org', displayName: 'حساب سازمانی (SSO)', loginUrl: '#sso-org' },
  ],
  otpCredentials: [
    { id: 'cred-1', userLabel: 'گوشی کاری — FreeOTP' },
    { id: 'cred-2', userLabel: 'تبلت کلینیک — Authenticator' },
  ],
  infoRequiredActions: [
    'تأیید شمارهٔ موبایل برای بازیابی امن حساب',
    'تنظیم ورود دومرحله‌ای برای دسترسی به پنل مدیریت',
  ],
} as const;

function createMessagesPerField(errors: Record<string, string> = {}) {
  return {
    printIfExists: <T extends string>(fieldName: string, text: T) =>
      errors[fieldName] ? text : undefined,
    existsError: (fieldName: string, ...other: string[]) =>
      [fieldName, ...other].some((name) => Boolean(errors[name])),
    get: (fieldName: string) => errors[fieldName] ?? '',
    exists: (fieldName: string) => Boolean(errors[fieldName]),
    getFirstError: (...fieldNames: string[]) => {
      for (const name of fieldNames) {
        if (errors[name]) return errors[name];
      }
      return '';
    },
  };
}

function createCommonKcContext(overrides?: {
  message?: { type: 'success' | 'warning' | 'error' | 'info'; summary: string } | undefined;
  fieldErrors?: Record<string, string> | undefined;
}): BaseKcContext.Common & {
  themeName: 'negaresh';
  properties: Record<string, string | undefined>;
} {
  return {
    themeVersion: '0.0.0',
    keycloakifyVersion: '11.16.4',
    themeType: 'login',
    themeName: 'negaresh',
    url: {
      loginAction: '#keycloak-action',
      resourcesPath: '/resources',
      resourcesCommonPath: '/resources-common',
      loginRestartFlowUrl: '#restart-flow',
      loginUrl: '#login',
      ssoLoginInOtherTabsUrl: '#sso-tabs',
    },
    realm: {
      name: 'negaresh',
      displayName: 'حساب یکپارچهٔ نگرش',
      displayNameHtml: 'حساب یکپارچهٔ نگرش',
      internationalizationEnabled: true,
      registrationEmailAsUsername: false,
    },
    locale: {
      currentLanguageTag: 'fa',
      rtl: true,
      supported: [{ languageTag: 'fa', label: 'فارسی', url: '#lang-fa' }],
    },
    client: {
      clientId: 'negaresh-registry',
      name: 'سامانهٔ رجیستری نگرش',
      attributes: {},
    },
    ...(overrides?.message ? { message: overrides.message } : {}),
    messagesPerField: createMessagesPerField(overrides?.fieldErrors),
    properties: {},
    'x-keycloakify': { messages: {} },
  };
}

/** Deterministic mock Keycloakify contexts for tests and previews across all 8 Wave 2 screens. */
export const mockKcContexts = {
  phoneSignIn: (overrides?: {
    rateLimitedSeconds?: number;
    fieldErrors?: Record<string, string>;
  }): Extract<KcContext, { pageId: 'login-phone.ftl' }> => ({
    ...createCommonKcContext({ fieldErrors: overrides?.fieldErrors }),
    pageId: 'login-phone.ftl',
    phone: sampleAuthFixtures.phoneDisplayInput,
    passwordLoginUrl: '#password-login',
    registrationUrl: '#register',
    ...(overrides?.rateLimitedSeconds !== undefined
      ? { rateLimitedSeconds: overrides.rateLimitedSeconds }
      : {}),
  }),

  phoneOtp: (overrides?: {
    resendCooldownSeconds?: number;
    expired?: boolean;
    fieldErrors?: Record<string, string>;
  }): Extract<KcContext, { pageId: 'login-sms-otp.ftl' }> => ({
    ...createCommonKcContext({ fieldErrors: overrides?.fieldErrors }),
    pageId: 'login-sms-otp.ftl',
    phone: sampleAuthFixtures.phone,
    maskedPhone: sampleAuthFixtures.maskedPhone,
    resendCooldownSeconds: overrides?.resendCooldownSeconds ?? 45,
    codeExpiryMinutes: 2,
    changePhoneUrl: '#change-phone',
    resendActionUrl: '#resend-otp',
    ...(overrides?.expired !== undefined ? { expired: overrides.expired } : {}),
  }),

  passwordSignIn: (overrides?: {
    message?: { type: 'success' | 'warning' | 'error' | 'info'; summary: string };
    fieldErrors?: Record<string, string>;
  }): Extract<KcContext, { pageId: 'login.ftl' }> => {
    const common = createCommonKcContext(overrides);
    return {
      ...common,
      pageId: 'login.ftl',
      url: {
        ...common.url,
        loginResetCredentialsUrl: '#forgot-password',
        registrationUrl: '#register',
      },
      realm: {
        ...common.realm,
        loginWithEmailAllowed: true,
        rememberMe: true,
        password: true,
        resetPasswordAllowed: true,
        registrationAllowed: true,
      },
      auth: {},
      registrationDisabled: false,
      login: {
        username: sampleAuthFixtures.staffEmail,
        rememberMe: '',
      },
      social: {
        displayInfo: true,
        providers: sampleAuthFixtures.socialProviders.map((p) => ({
          ...p,
          providerId: p.alias,
        })),
      },
      challenge: '',
      userVerification: 'not specified',
      rpId: 'negaresh.ir',
      createTimeout: 0,
      isUserIdentified: 'false',
    };
  },

  forgotPassword: (overrides?: {
    message?: { type: 'success' | 'warning' | 'error' | 'info'; summary: string };
  }): Extract<KcContext, { pageId: 'login-reset-password.ftl' }> => {
    const common = createCommonKcContext(overrides);
    return {
      ...common,
      pageId: 'login-reset-password.ftl',
      realm: {
        ...common.realm,
        loginWithEmailAllowed: true,
        duplicateEmailsAllowed: false,
      },
      url: {
        ...common.url,
        loginResetCredentialsUrl: '#forgot-password',
      },
      auth: {
        attemptedUsername: sampleAuthFixtures.staffEmail,
      },
    };
  },

  register: (overrides?: {
    fieldErrors?: Record<string, string>;
  }): Extract<KcContext, { pageId: 'register.ftl' }> => {
    const common = createCommonKcContext(overrides);
    return {
      ...common,
      pageId: 'register.ftl',
      profile: {
        attributesByName: {
          firstName: {
            name: 'firstName',
            displayName: 'نام',
            value: '',
            required: true,
            readOnly: false,
            validators: {},
            annotations: {},
            multivalued: false,
          },
          lastName: {
            name: 'lastName',
            displayName: 'نام خانوادگی',
            value: '',
            required: true,
            readOnly: false,
            validators: {},
            annotations: {},
            multivalued: false,
          },
          email: {
            name: 'email',
            displayName: 'ایمیل',
            value: '',
            required: false,
            readOnly: false,
            validators: {},
            annotations: {},
            multivalued: false,
          },
        },
        html5DataAnnotations: {},
      },
      url: {
        ...common.url,
        registrationAction: '#register-action',
      },
      passwordRequired: true,
      termsAcceptanceRequired: true,
    };
  },

  verifyMobile: (overrides?: {
    step?: 'phone' | 'otp';
    fieldErrors?: Record<string, string>;
  }): Extract<KcContext, { pageId: 'verify-mobile.ftl' }> => ({
    ...createCommonKcContext({ fieldErrors: overrides?.fieldErrors }),
    pageId: 'verify-mobile.ftl',
    step: overrides?.step ?? 'phone',
    phone: sampleAuthFixtures.phone,
    maskedPhone: sampleAuthFixtures.maskedPhone,
    resendCooldownSeconds: 45,
    codeExpiryMinutes: 2,
    changePhoneUrl: '#edit-phone',
    logoutUrl: '#logout',
    isMigratedUser: true,
  }),

  twoFactorSetup: (overrides?: {
    fieldErrors?: Record<string, string>;
  }): Extract<KcContext, { pageId: 'login-config-totp.ftl' }> => ({
    ...createCommonKcContext({ fieldErrors: overrides?.fieldErrors }),
    pageId: 'login-config-totp.ftl',
    mode: 'qr',
    totp: {
      totpSecretEncoded: sampleAuthFixtures.totpSecret,
      totpSecret: sampleAuthFixtures.totpSecretRaw,
      totpSecretQrCode: '',
      qrUrl: sampleAuthFixtures.totpQrDataUri,
      manualUrl: '#manual',
      username: sampleAuthFixtures.staffEmail,
      supportedApplications: ['FreeOTP', 'Google Authenticator', 'Authy'],
      otpCredentials: [],
      policy: {
        type: 'totp',
        algorithm: 'HmacSHA1',
        digits: 6,
        period: 30,
        lookAheadWindow: 1,
        getAlgorithmKey: () => 'SHA1',
      },
    },
  }),

  error: (overrides?: {
    summary?: string;
  }): Extract<KcContext, { pageId: 'error.ftl' }> => {
    const common = createCommonKcContext({
      message: {
        type: 'error',
        summary:
          overrides?.summary ??
          'پیوند ورود منقضی شده یا نامعتبر است. برای ادامه، دوباره از برنامه وارد شوید.',
      },
    });
    return {
      ...common,
      pageId: 'error.ftl',
      client: {
        ...common.client,
        baseUrl: '#app-home',
      },
      message: common.message!,
    };
  },

  info: (overrides?: {
    summary?: string;
    requiredActions?: string[];
  }): Extract<KcContext, { pageId: 'info.ftl' }> => {
    const common = createCommonKcContext({
      message: {
        type: 'info',
        summary:
          overrides?.summary ??
          'شمارهٔ موبایل شما با موفقیت تأیید شد. اکنون می‌توانید به سامانهٔ رجیستری بازگردید.',
      },
    });
    return {
      ...common,
      pageId: 'info.ftl',
      skipLink: false,
      pageRedirectUri: '#app-home',
      ...(overrides?.requiredActions ? { requiredActions: overrides.requiredActions } : {}),
      client: {
        ...common.client,
        baseUrl: '#app-home',
      },
      message: common.message!,
    };
  },
};
