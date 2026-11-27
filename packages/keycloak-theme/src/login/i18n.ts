import { i18nBuilder } from 'keycloakify/login/i18n';
import type { KcContext } from './KcContext.ts';

/**
 * Keycloakify i18n configuration with Persian (`fa`) custom translations for both
 * standard Keycloak keys and Negaresh SMS/mobile verification extensions.
 */
const { useI18n, ofTypeI18n } = i18nBuilder
  .withThemeName<'negaresh'>()
  .withCustomTranslations({
    fa: {
      loginAccountTitle: 'ورود به حساب نگرش',
      doLogIn: 'ورود به حساب',
      doRegister: 'ساخت حساب کاربری',
      doForgotPassword: 'فراموشی رمز عبور',
      backToLogin: 'بازگشت به صفحهٔ ورود',
      backToApplication: 'بازگشت به برنامه',
      proceedWithAction: 'ادامه به برنامه',
      usernameOrEmail: 'ایمیل یا نام کاربری',
      password: 'رمز عبور',
      passwordConfirm: 'تکرار رمز عبور',
      rememberMe: 'در این مرورگر واردشده بمانم',
      invalidUserMessage: 'نام کاربری یا رمز عبور نادرست است.',
      accountDisabledMessage: 'این حساب کاربری غیرفعال شده است. با پشتیبانی تماس بگیرید.',
      expiredActionMessage: 'نشست شما منقضی شده است. لطفاً دوباره از ابتدا اقدام کنید.',
      invalidTotpMessage: 'کد ۶ رقمی احراز هویت معتبر نیست.',
      loginTotpTitle: 'راه‌اندازی ورود دومرحله‌ای',
      ndsPhoneSignInTitle: 'ورود با شمارهٔ موبایل',
      ndsVerifyMobileTitle: 'تأیید شمارهٔ موبایل',
      ndsOtpResend: 'ارسال دوبارهٔ کد',
    },
  })
  .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
export type { KcContext };
