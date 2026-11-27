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
import {
  Button,
  Inline,
  LinkButton,
  SegmentedControl,
  SegmentedControlItem,
  Stack,
  Text,
} from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { State } from '../ui.tsx';
import pStyles from './patterns.module.css';

type SignInPreviewKey = 'phone' | 'otp' | 'password' | 'forgot' | 'register';

function IdentitySignInExample() {
  const [screen, setScreen] = useState<SignInPreviewKey>('phone');
  const [submittedPhone, setSubmittedPhone] = useState<string>(sampleAuthFixtures.phoneDisplayInput);
  const [statusNote, setStatusNote] = useState<string>('');

  return (
    <Stack gap="4">
      <Inline gap="3" align="center" justify="between">
        <SegmentedControl
          aria-label="انتخاب صفحهٔ پیش‌نمایش ورود"
          value={screen}
          onChange={(key) => {
            setScreen(key as SignInPreviewKey);
            setStatusNote('');
          }}
        >
          <SegmentedControlItem id="phone">ورود با موبایل</SegmentedControlItem>
          <SegmentedControlItem id="otp">کد پیامکی</SegmentedControlItem>
          <SegmentedControlItem id="password">رمز عبور</SegmentedControlItem>
          <SegmentedControlItem id="forgot">بازیابی رمز</SegmentedControlItem>
          <SegmentedControlItem id="register">ثبت‌نام</SegmentedControlItem>
        </SegmentedControl>
        <LinkButton href="/reference/keycloak-login?screen=phone-signin" variant="secondary" size="sm">
          پیش‌نمایش تمام‌صفحه
        </LinkButton>
      </Inline>

      {statusNote && (
        <div role="status">
          <Text size="sm" tone="muted">
            {statusNote}
          </Text>
        </div>
      )}

      {screen === 'phone' && (
        <PhoneSignIn
          step="phone"
          defaultPhone={submittedPhone}
          onSubmitPhone={(canonical) => {
            setSubmittedPhone(canonical);
            setScreen('otp');
            setStatusNote(`کد تأیید برای ${canonical} ارسال شد.`);
          }}
          onSwitchToPassword={() => setScreen('password')}
          onNavigateRegister={() => setScreen('register')}
          shellProps={{ embedded: true, productName: 'سامانهٔ رجیستری نگرش' }}
        />
      )}

      {screen === 'otp' && (
        <PhoneSignIn
          step="otp"
          defaultPhone={submittedPhone}
          resendSecondsRemaining={45}
          onEditPhone={() => setScreen('phone')}
          onSubmitOtp={({ code }) => setStatusNote(`کد ${code} با موفقیت تأیید شد.`)}
          onSwitchToPassword={() => setScreen('password')}
          shellProps={{ embedded: true, productName: 'سامانهٔ رجیستری نگرش' }}
        />
      )}

      {screen === 'password' && (
        <PasswordSignIn
          defaultUsername={sampleAuthFixtures.staffEmail}
          socialProviders={sampleAuthFixtures.socialProviders}
          onSwitchToPhone={() => setScreen('phone')}
          onForgotPassword={() => setScreen('forgot')}
          onNavigateRegister={() => setScreen('register')}
          onSubmit={({ username }) => setStatusNote(`درخواست ورود برای ${username} ثبت شد.`)}
          shellProps={{ embedded: true, productName: 'سامانهٔ رجیستری نگرش' }}
        />
      )}

      {screen === 'forgot' && (
        <ForgotPassword
          mode="sms"
          defaultIdentifier={sampleAuthFixtures.phoneDisplayInput}
          resendSecondsRemaining={45}
          onBackToSignIn={() => setScreen('password')}
          shellProps={{ embedded: true, productName: 'سامانهٔ رجیستری نگرش' }}
        />
      )}

      {screen === 'register' && (
        <Register
          defaultValues={{
            firstName: sampleAuthFixtures.firstName,
            lastName: sampleAuthFixtures.lastName,
            phone: sampleAuthFixtures.phoneDisplayInput,
          }}
          onNavigateSignIn={() => setScreen('phone')}
          onSubmit={({ phone }) => setStatusNote(`حساب کاربری برای ${phone} ثبت شد.`)}
          shellProps={{ embedded: true, productName: 'سامانهٔ رجیستری نگرش' }}
        />
      )}
    </Stack>
  );
}

type SecurityPreviewKey = 'verify-phone' | 'verify-otp' | 'totp-setup' | 'error' | 'info';

function IdentitySecurityExample() {
  const [screen, setScreen] = useState<SecurityPreviewKey>('totp-setup');

  return (
    <Stack gap="4">
      <Inline gap="3" align="center" justify="between">
        <SegmentedControl
          aria-label="انتخاب صفحهٔ امنیت و پیام‌های سامانه"
          value={screen}
          onChange={(key) => setScreen(key as SecurityPreviewKey)}
        >
          <SegmentedControlItem id="verify-phone">تأیید موبایل</SegmentedControlItem>
          <SegmentedControlItem id="verify-otp">کد تأیید موبایل</SegmentedControlItem>
          <SegmentedControlItem id="totp-setup">دومرحله‌ای</SegmentedControlItem>
          <SegmentedControlItem id="error">صفحهٔ خطا</SegmentedControlItem>
          <SegmentedControlItem id="info">صفحهٔ اطلاع</SegmentedControlItem>
        </SegmentedControl>
        <LinkButton href="/reference/keycloak-login?screen=two-factor-setup" variant="secondary" size="sm">
          پیش‌نمایش تمام‌صفحه
        </LinkButton>
      </Inline>

      {screen === 'verify-phone' && (
        <VerifyMobile
          step="phone"
          defaultPhone={sampleAuthFixtures.phoneDisplayInput}
          onSubmitPhone={() => setScreen('verify-otp')}
          onSignOut={() => setScreen('info')}
          shellProps={{ embedded: true, productName: 'حساب یکپارچهٔ نگرش' }}
        />
      )}

      {screen === 'verify-otp' && (
        <VerifyMobile
          step="otp"
          defaultPhone={sampleAuthFixtures.phone}
          maskedPhone={sampleAuthFixtures.maskedPhone}
          resendSecondsRemaining={45}
          onSubmitOtp={() => setScreen('info')}
          onSignOut={() => setScreen('verify-phone')}
          shellProps={{ embedded: true, productName: 'حساب یکپارچهٔ نگرش' }}
        />
      )}

      {screen === 'totp-setup' && (
        <TwoFactorSetup
          mode="setup"
          qrImageSrc={sampleAuthFixtures.totpQrDataUri}
          manualSecret={sampleAuthFixtures.totpSecret}
          rawSecret={sampleAuthFixtures.totpSecretRaw}
          shellProps={{ embedded: true, productName: 'پنل همکاران نگرش' }}
        />
      )}

      {screen === 'error' && (
        <ErrorScreen
          message="نشست ورود منقضی شده یا پیوند بازشده دیگر معتبر نیست. لطفاً دوباره وارد شوید."
          referenceCode={sampleAuthFixtures.errorReferenceCode}
          backHref="#back-to-app"
          supportHref="#support"
          shellProps={{ embedded: true, productName: 'حساب یکپارچهٔ نگرش' }}
        />
      )}

      {screen === 'info' && (
        <InfoScreen
          message="شمارهٔ موبایل شما با موفقیت تأیید شد. اکنون می‌توانید به سامانهٔ رجیستری بازگردید."
          tone="success"
          requiredActions={sampleAuthFixtures.infoRequiredActions}
          actionHref="#continue"
          backToSignInHref="#signin"
          shellProps={{ embedded: true, productName: 'حساب یکپارچهٔ نگرش' }}
        />
      )}
    </Stack>
  );
}

export const identitySignInDoc: ComponentDoc = {
  slug: 'identity-sign-in',
  title: 'پوستهٔ Keycloak · ورود با موبایل/رمز، بازیابی و ثبت‌نام',
  components: ['AuthShell', 'PhoneSignIn', 'PasswordSignIn', 'ForgotPassword', 'Register'],
  summary:
    'صفحه‌های اصلی ورود، کد پیامکی ۶ رقمی، ورود با ایمیل و رمز عبور، بازیابی پیامکی و ثبت‌نام در `@negaresh/keycloak-theme` (ساخته‌شده با Keycloakify 11.16.4 برای Keycloak 26+).',
  status: 'review',
  products: ['R', 'N', 'T', 'V'],
  Example: IdentitySignInExample,
  Gallery: () => (
    <div className={pStyles.stack}>
      <State label="ورود با موبایل — مرحلهٔ شماره و جایگاه CAPTCHA (`login-phone.ftl`)">
        <PhoneSignIn
          step="phone"
          defaultPhone={sampleAuthFixtures.phoneDisplayInput}
          passwordSignInHref="#password"
          registerHref="#register"
          captchaSlot={
            <Inline gap="2" align="center" justify="between">
              <Text size="sm" tone="muted">
                جایگاه ویجت CAPTCHA (بدون وابستگی خارجی در NDS)
              </Text>
              <Button type="button" variant="ghost" size="sm">
                تأیید امنیتی
              </Button>
            </Inline>
          }
          shellProps={{ embedded: true, productName: 'رجیستری نگرش' }}
        />
      </State>

      <State label="ورود با موبایل — مرحلهٔ کد پیامکی با شمارش معکوس ۶۰ ثانیه و خطای کد نادرست (`login-sms-otp.ftl`)">
        <PhoneSignIn
          step="otp"
          defaultPhone={sampleAuthFixtures.phone}
          maskedPhone={sampleAuthFixtures.maskedPhone}
          resendSecondsRemaining={45}
          otpError="کد واردشده نادرست است. پیامک دریافتی را بررسی و دوباره وارد کنید."
          shellProps={{ embedded: true, productName: 'رجیستری نگرش' }}
        />
      </State>

      <State label="ورود با موبایل — حالت محدودیت نرخ ارسال (Rate Limit)">
        <PhoneSignIn
          step="phone"
          defaultPhone={sampleAuthFixtures.phoneDisplayInput}
          rateLimitedSeconds={55}
          shellProps={{ embedded: true, productName: 'رجیستری نگرش' }}
        />
      </State>

      <State label="ورود با ایمیل و رمز عبور با خطای اعتبارسنجی و SSO (`login.ftl`)">
        <PasswordSignIn
          defaultUsername={sampleAuthFixtures.staffEmail}
          socialProviders={sampleAuthFixtures.socialProviders}
          forgotPasswordHref="#forgot"
          phoneSignInHref="#phone"
          registerHref="#register"
          banner={{
            tone: 'danger',
            title: 'نام کاربری یا رمز عبور نادرست است',
            body: 'اطلاعات ورودی را بررسی کنید یا از بخش بازیابی رمز عبور استفاده نمایید.',
          }}
          shellProps={{ embedded: true, productName: 'فروشگاه نگرش' }}
        />
      </State>

      <State label="بازیابی رمز عبور با پیامک — مرحلهٔ تعیین رمز جدید (`login-reset-password.ftl` / `login-update-password.ftl`)">
        <ForgotPassword
          mode="sms"
          step="reset"
          backToSignInHref="#signin"
          shellProps={{ embedded: true, productName: 'پلتفرم آزمون نگرش' }}
        />
      </State>

      <State label="ثبت‌نام حساب کاربری با خلاصهٔ خطاهای فرم (`register.ftl`)">
        <Register
          defaultValues={{
            firstName: sampleAuthFixtures.firstName,
            lastName: sampleAuthFixtures.lastName,
            phone: sampleAuthFixtures.phoneDisplayInput,
            email: sampleAuthFixtures.staffEmail,
          }}
          fieldErrors={{
            password: 'رمز عبور باید دست‌کم ۸ نویسه داشته باشد.',
          }}
          signInHref="#signin"
          shellProps={{ embedded: true, productName: 'حساب یکپارچهٔ نگرش' }}
        />
      </State>
    </div>
  ),
  usage: {
    do: [
      'در همهٔ ورودی‌های شمارهٔ موبایل، کد OTP و ایمیل ایزوله‌سازی چپ‌به‌راست (`dir="ltr"`) و پذیرش ارقام فارسی/عربی/لاتین را حفظ کنید (D-86).',
      'شمارهٔ موبایل را در مرحلهٔ OTP تنها به صورت پوشانده‌شده (`maskPhone`) نمایش دهید تا حریم خصوصی حفظ شود.',
      'همهٔ متن‌های قابل مشاهده را از `faAuthMessages` یا بستهٔ پیام Keycloak بخوانید؛ هیچ رشتهٔ ثابتی در JSX ننویسید (D-94).',
    ],
    dont: [
      'روی کارت احراز هویت سایهٔ ثابت قرار ندهید؛ جداکنندگی صرفاً با رنگ سطح و یک خط‌مو است (D-77).',
      'در خطاهای ورود از پیام‌های فنی یا سرزنش‌کننده مانند «Error 401» استفاده نکنید.',
    ],
  },
  api: [
    {
      name: 'AuthShell',
      props: [
        { name: 'title / subtitle / eyebrow', type: 'ReactNode', description: 'عنوان، توضیح کوتاه و برچسب مرحله در بالای کارت ورود.' },
        { name: 'banner', type: 'AuthBannerMessage', description: 'پیام وضعیت سرور (`InlineAlert` با آیکون و واژه).' },
        { name: 'embedded', type: 'boolean', default: 'false', description: 'حالت پیش‌نمایش بدون لندمارک تکراری (`header`/`main`/`footer`/`h1`).' },
        { name: 'showThemeToggle', type: 'boolean', default: '!embedded', description: 'نمایش کلید روشن/تیره/سیستم در نوار بالای صفحهٔ ورود.' },
      ],
    },
    {
      name: 'PhoneSignIn (login-phone.ftl, login-sms-otp.ftl)',
      props: [
        { name: 'step', type: "'phone' | 'otp'", default: "'phone'", description: 'مرحلهٔ ورود شماره یا تأیید کد ۶ رقمی.' },
        { name: 'resendSecondsRemaining / codeExpiryMinutes', type: 'number', default: '60 / 2', description: 'شمارش معکوس ارسال دوباره و مهلت اعتبار کد به ارقام فارسی.' },
        { name: 'rateLimitedSeconds', type: 'number', description: 'نمایش هشدار سقف درخواست و غیرفعال‌سازی موقت ارسال.' },
        { name: 'captchaSlot', type: 'ReactNode', description: 'جایگاه اختیاری CAPTCHA داخل `<fieldset>` معنایی.' },
      ],
    },
    {
      name: 'PasswordSignIn (login.ftl)',
      props: [
        { name: 'defaultUsername / allowRememberMe / allowForgotPassword', type: 'string / boolean', description: 'تنظیمات همگام با `kcContext.realm`.' },
        { name: 'socialProviders', type: 'readonly SocialProviderItem[]', description: 'دکمه‌های ورود از طریق ارائه‌دهندگان SSO.' },
        { name: 'isLocked', type: 'boolean', default: 'false', description: 'نمایش هشدار قفل موقت و غیرفعال‌سازی فرم.' },
      ],
    },
    {
      name: 'ForgotPassword (login-reset-password.ftl, login-update-password.ftl)',
      props: [
        { name: 'mode', type: "'sms' | 'identifier'", default: "'sms'", description: 'بازیابی سه‌مرحله‌ای پیامکی یا ارسال پیوند استاندارد Keycloak.' },
        { name: 'step', type: "'identify' | 'otp' | 'reset' | 'sent'", default: "'identify'", description: 'مرحلهٔ فعال جریان بازیابی رمز.' },
      ],
    },
    {
      name: 'Register (register.ftl)',
      props: [
        { name: 'emailRequired / passwordRequired / termsRequired', type: 'boolean', description: 'پیکربندی فیلدهای الزامی همگام با سیاست User Profile در Keycloak.' },
        { name: 'fieldErrors', type: 'RegisterFieldErrors', description: 'نگاشت خطاهای سمت سرور به هر فیلد و `FormErrorSummary`.' },
      ],
    },
  ],
  keyboard: [
    { keys: 'Tab / Shift+Tab', action: 'جابه‌جایی منظم میان فیلدها، نمایش رمز، دکمهٔ ارسال دوباره و پیوندهای کمکی.' },
    { keys: 'Paste (Ctrl+V)', action: 'جای‌گذاری یکجای کد ۶ رقمی OTP در خانه‌های `OTPField`.' },
    { keys: 'Enter', action: 'ارسال فرم مرحلهٔ فعال و انتقال فوکوس به خلاصهٔ خطا در صورت نقص.' },
  ],
  a11y: [
    'همهٔ دکمه‌ها و پیوندهای لمسی دست‌کم ۴۴×۴۴ پیکسل اندازهٔ هدف دارند (WCAG 2.5.8).',
    'خطاهای فرم در `FormErrorSummary` (`role="alert"`) با پیوند مستقیم به ورودی نامعتبر اعلام می‌شوند.',
    'پشتیبانی کامل از `forced-colors: active` و `prefers-reduced-motion: reduce` و حلقهٔ فوکوس `--nds-focus-ring`.',
  ],
  rtl: [
    'کل پوسته راست‌به‌چپ (`dir="rtl"`, `lang="fa"`) با فونت خودمیزبان Vazirmatn است.',
    'ورودی‌های موبایل، کد OTP و ایمیل ایزوله‌شدهٔ چپ‌به‌راست (`dir="ltr"`) با ارقام لاتین هستند؛ زمان و شمارنده‌ها به ارقام فارسی نمایش داده می‌شوند (D-86).',
  ],
};

export const identitySecurityDoc: ComponentDoc = {
  slug: 'identity-security',
  title: 'پوستهٔ Keycloak · تأیید موبایل، دومرحله‌ای و خطا/اطلاع',
  components: ['VerifyMobile', 'TwoFactorSetup', 'ErrorScreen', 'InfoScreen', 'KcPage'],
  summary:
    'صفحه‌های اقدام الزامی تأیید موبایل کاربران منتقل‌شده، راه‌اندازی و چالش ورود دومرحله‌ای (TOTP) همکاران، و صفحه‌های خطا و اطلاع در `@negaresh/keycloak-theme`.',
  status: 'review',
  products: ['R', 'N', 'T', 'V'],
  Example: IdentitySecurityExample,
  Gallery: () => (
    <div className={pStyles.stack}>
      <State label="تأیید موبایل کاربران منتقل‌شده — مرحلهٔ ورود شماره (`verify-mobile.ftl`)">
        <VerifyMobile
          step="phone"
          defaultPhone={sampleAuthFixtures.phoneDisplayInput}
          signOutHref="#logout"
          shellProps={{ embedded: true, productName: 'حساب یکپارچهٔ نگرش' }}
        />
      </State>

      <State label="تأیید موبایل — مرحلهٔ کد پیامکی (`verify-mobile.ftl`)">
        <VerifyMobile
          step="otp"
          defaultPhone={sampleAuthFixtures.phone}
          maskedPhone={sampleAuthFixtures.maskedPhone}
          resendSecondsRemaining={45}
          shellProps={{ embedded: true, productName: 'حساب یکپارچهٔ نگرش' }}
        />
      </State>

      <State label="راه‌اندازی ورود دومرحله‌ای با QR، کلید دستی LTR و خطای کد (`login-config-totp.ftl`)">
        <TwoFactorSetup
          mode="setup"
          qrImageSrc={sampleAuthFixtures.totpQrDataUri}
          manualSecret={sampleAuthFixtures.totpSecret}
          rawSecret={sampleAuthFixtures.totpSecretRaw}
          codeError="کد ۶ رقمی معتبر نیست. همگام بودن ساعت دستگاه را بررسی و دوباره تلاش کنید."
          shellProps={{ embedded: true, productName: 'پنل مدیریت نگرش' }}
        />
      </State>

      <State label="چالش ورود دومرحله‌ای با انتخاب دستگاه (`login-otp.ftl`)">
        <TwoFactorSetup
          mode="challenge"
          credentials={sampleAuthFixtures.otpCredentials}
          shellProps={{ embedded: true, productName: 'پنل مدیریت نگرش' }}
        />
      </State>

      <State label="صفحهٔ خطای احراز هویت با کد پیگیری LTR قابل کپی (`error.ftl`)">
        <ErrorScreen
          message="پیوند ورود منقضی شده یا نامعتبر است. برای ادامه، دوباره از برنامه وارد شوید."
          referenceCode={sampleAuthFixtures.errorReferenceCode}
          backHref="#app-home"
          supportHref="#support"
          shellProps={{ embedded: true, productName: 'حساب یکپارچهٔ نگرش' }}
        />
      </State>

      <State label="صفحهٔ اطلاع و اقدامات باقی‌مانده (`info.ftl`)">
        <InfoScreen
          message="شمارهٔ موبایل شما با موفقیت تأیید شد. اکنون می‌توانید به سامانهٔ رجیستری بازگردید."
          tone="success"
          requiredActions={sampleAuthFixtures.infoRequiredActions}
          actionHref="#app-home"
          backToSignInHref="#signin"
          shellProps={{ embedded: true, productName: 'حساب یکپارچهٔ نگرش' }}
        />
      </State>
    </div>
  ),
  usage: {
    do: [
      'در `TwoFactorSetup` هم رمزینهٔ QR با متن جایگزین توصیفی و هم کلید دستی LTR با `CopyButton` ارائه کنید تا کاربران بدون دوربین یا با صفحه‌خوان به مشکل نخورند.',
      'در `ErrorScreen` و `InfoScreen` وضعیت را همیشه با ترکیب آیکون، نشان متنی (`Badge`) و توضیح روشن بیان کنید.',
      'بستهٔ JAR را با `pnpm --filter @negaresh/keycloak-theme build:jar` بسازید و در مسیر `/opt/keycloak/providers/` روی Keycloak 26+ بارگذاری کنید.',
    ],
    dont: [
      'کلید دستی TOTP یا کد پیگیری خطا را با ارقام فارسی یا جهت راست‌به‌چپ نمایش ندهید.',
      'پیام خطا را بدون اقدام بعدی مشخص (بازگشت به برنامه یا پشتیبانی) رها نکنید.',
    ],
  },
  api: [
    {
      name: 'VerifyMobile (verify-mobile.ftl)',
      props: [
        { name: 'step', type: "'phone' | 'otp'", default: "'phone'", description: 'مرحلهٔ ثبت شماره یا تأیید پیامکی برای کاربران منتقل‌شده.' },
        { name: 'showMigrationNotice', type: 'boolean', default: 'true', description: 'نمایش اعلان راهنمای انتقال حساب پیشین.' },
        { name: 'signOutHref / onSignOut', type: 'string / () => void', description: 'امکان خروج از حساب در صورت اشتباه بودن کاربر.' },
      ],
    },
    {
      name: 'TwoFactorSetup (login-config-totp.ftl, login-otp.ftl)',
      props: [
        { name: 'mode', type: "'setup' | 'challenge'", default: "'setup'", description: 'راه‌اندازی اولیهٔ Authenticator یا وارد کردن کد در ورود بعدی.' },
        { name: 'qrImageSrc / manualSecret / rawSecret', type: 'string', description: 'تصویر QR، کلید خوانای base32 و مقدار خام برای فیلد مخفی `totpSecret` و کپی بدون فاصله.' },
        { name: 'credentials', type: 'readonly TotpCredentialOption[]', description: 'فهرست دستگاه‌های ثبت‌شده در حالت `challenge`.' },
      ],
    },
    {
      name: 'ErrorScreen (error.ftl) & InfoScreen (info.ftl)',
      props: [
        { name: 'title / message', type: 'ReactNode', description: 'عنوان و متن اصلی پیام دریافت‌شده از Keycloak.' },
        { name: 'referenceCode', type: 'string', description: 'کد پیگیری LTR قابل کپی برای پشتیبانی در `ErrorScreen`.' },
        { name: 'requiredActions', type: 'readonly string[]', description: 'فهرست اقدامات باقی‌مانده در `InfoScreen`.' },
      ],
    },
    {
      name: 'KcPage (Keycloakify Adapter)',
      props: [
        { name: 'kcContext', type: 'KcContext', description: 'زمینهٔ تزریق‌شده توسط Keycloakify برای نگاشت خودکار همهٔ `pageId`ها و fallback به `DefaultPage`.' },
        { name: 'embedded', type: 'boolean', default: 'false', description: 'حالت غیرتمام‌صفحه برای آزمون و پیش‌نمایش.' },
      ],
    },
  ],
  keyboard: [
    { keys: 'Enter / Space', action: 'کپی کلید دستی TOTP یا کد پیگیری خطا با اعلان صوتی `role="status"`.' },
    { keys: 'ArrowUp / ArrowDown', action: 'جابه‌جایی میان گزینه‌های دستگاه احراز هویت در حالت `challenge`.' },
  ],
  a11y: [
    'رمزینهٔ QR دارای متن جایگزین فارسی (`alt`) و قاب کم‌نوسان با حاشیهٔ امن در هر دو حالت روشن و تیره است.',
    'کپی کلید دستی فضای خالی نمایشی را حذف می‌کند و نتیجه را در ناحیهٔ زندهٔ `CopyButton` اعلام می‌نماید.',
    'تمامی حالت‌های خطا و اطلاع با ترکیب آیکون و واژه (نه رنگ تنها) نمایش داده می‌شوند.',
  ],
  rtl: [
    'کلید دستی base32 و کد پیگیری خطا داخل `<Ltr><Code>` با فونت تک‌عرض و جهت چپ‌به‌راست ایزوله می‌شوند (D-86).',
    'فهرست شماره‌گذاری‌شدهٔ مراحل راه‌اندازی با ارقام فارسی نمایش داده می‌شود.',
  ],
};
