/**
 * Typed Persian-first message catalogue for `@negaresh/keycloak-theme` (D-94).
 * Every visible label, helper, status, aria-label, and fallback message in the
 * auth shell and all 8 Keycloak screens comes from this catalogue or explicit props.
 */
export interface AuthMessages {
  shell: {
    brandProduct: string;
    brandSubtitle: string;
    themeLegend: string;
    themeLight: string;
    themeDark: string;
    themeSystem: string;
    footerHelp: string;
    footerPrivacy: string;
    footerTerms: string;
    footerCopyright: string;
    skipToForm: string;
  };
  common: {
    errorSummaryTitle: string;
    orDivider: string;
    backToSignIn: string;
    backToApp: string;
    continueToApp: string;
    retryAction: string;
    supportLink: string;
    requiredFieldError: string;
    invalidPhoneError: string;
    invalidEmailError: string;
    invalidOtpError: string;
    passwordMismatchError: string;
    passwordTooShortError: string;
    termsRequiredError: string;
    captchaLabel: string;
    statusErrorLabel: string;
    statusWarningLabel: string;
    statusInfoLabel: string;
    statusSuccessLabel: string;
  };
  phoneSignIn: {
    phoneTitle: string;
    phoneSubtitle: string;
    phoneLabel: string;
    phoneDescription: string;
    phoneSubmit: string;
    otpTitle: string;
    otpSubtitle: (maskedPhone: string) => string;
    otpLabel: string;
    otpExpiryNotice: (minutes: number) => string;
    otpSubmit: string;
    editPhoneAction: string;
    switchToPassword: string;
    createAccountPrompt: string;
    createAccountAction: string;
    rateLimitTitle: string;
    rateLimitDescription: (seconds: number) => string;
    wrongCodeError: string;
    expiredCodeError: string;
  };
  passwordSignIn: {
    title: string;
    subtitle: string;
    usernameLabel: string;
    usernameDescription: string;
    passwordLabel: string;
    rememberMeLabel: string;
    forgotPasswordAction: string;
    submitAction: string;
    switchToPhone: string;
    createAccountPrompt: string;
    createAccountAction: string;
    socialDivider: string;
    socialContinueWith: (provider: string) => string;
    invalidCredentialsTitle: string;
    invalidCredentialsDescription: string;
    accountLockedTitle: string;
    accountLockedDescription: string;
  };
  forgotPassword: {
    title: string;
    smsPhoneSubtitle: string;
    identifierSubtitle: string;
    phoneLabel: string;
    identifierLabel: string;
    identifierDescription: string;
    sendCodeSubmit: string;
    sendLinkSubmit: string;
    otpStepTitle: string;
    otpStepSubtitle: (maskedPhone: string) => string;
    otpLabel: string;
    otpExpiryNotice: (minutes: number) => string;
    verifyCodeSubmit: string;
    editPhoneAction: string;
    resetStepTitle: string;
    resetStepSubtitle: string;
    newPasswordLabel: string;
    confirmPasswordLabel: string;
    passwordStrengthHint: string;
    savePasswordSubmit: string;
    sentSuccessTitle: string;
    sentSuccessDescription: string;
    stepLabel: (current: number, total: number) => string;
  };
  register: {
    title: string;
    subtitle: string;
    firstNameLabel: string;
    lastNameLabel: string;
    phoneLabel: string;
    phoneDescription: string;
    emailLabel: string;
    emailOptionalNote: string;
    passwordLabel: string;
    confirmPasswordLabel: string;
    passwordStrengthHint: string;
    termsLabel: string;
    submitAction: string;
    alreadyHaveAccountPrompt: string;
    signInAction: string;
  };
  verifyMobile: {
    title: string;
    migrationNoticeTitle: string;
    migrationNoticeDescription: string;
    phoneSubtitle: string;
    phoneLabel: string;
    sendCodeSubmit: string;
    otpSubtitle: (maskedPhone: string) => string;
    otpLabel: string;
    otpExpiryNotice: (minutes: number) => string;
    confirmSubmit: string;
    editPhoneAction: string;
    signOutAction: string;
    duplicatePhoneError: string;
  };
  twoFactorSetup: {
    title: string;
    subtitle: string;
    stepsHeading: string;
    stepInstallApp: string;
    stepScanOrEnter: string;
    stepEnterCode: string;
    qrAlt: string;
    qrCaption: string;
    manualKeyLabel: string;
    manualKeyCopyLabel: string;
    showManualKey: string;
    hideManualKey: string;
    codeLabel: string;
    codeDescription: string;
    deviceLabel: string;
    devicePlaceholder: string;
    logoutSessionsLabel: string;
    submitAction: string;
    challengeTitle: string;
    challengeSubtitle: string;
    credentialSelectorLabel: string;
    challengeSubmit: string;
    invalidCodeError: string;
  };
  errorScreen: {
    defaultTitle: string;
    defaultDescription: string;
    referenceCodeLabel: string;
    copyReferenceCode: string;
    nextStepNote: string;
  };
  infoScreen: {
    defaultTitle: string;
    defaultDescription: string;
    requiredActionsHeading: string;
  };
}
