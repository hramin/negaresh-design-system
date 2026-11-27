import { Code, OTPField, Stack, Text } from '@negaresh/react';
import { toPersianDigits } from '@negaresh/utils';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './fields.module.css';

function Example() {
  const [code, setCode] = useState('');
  const [completed, setCompleted] = useState<string | null>(null);
  const [resendCount, setResendCount] = useState(0);

  return (
    <div className={styles.example} data-interactive="otp-field">
      <Stack gap="4">
        <OTPField
          id="docs-otp-live"
          name="otp"
          label="کد تأیید پیامکی"
          description="کد ۶ رقمی ارسال‌شده به ۰۹۱۲ ••• ۴۵۶۷ را وارد کنید یا مستقیم جای‌گذاری نمایید (ارقام فارسی، عربی و لاتین پذیرفته می‌شوند)."
          value={code}
          onChange={setCode}
          onComplete={setCompleted}
          onResend={() => setResendCount((c) => c + 1)}
          resendCooldown={60}
        />
        <Text size="sm" tone="muted" className={styles.output}>
          مقدار استاندارد: {code ? <Code>{code}</Code> : 'خالی'} · تکمیل‌شده:{' '}
          {completed ? <Code>{completed}</Code> : '—'} · تعداد ارسال دوباره:{' '}
          {toPersianDigits(resendCount)}
        </Text>
      </Stack>
    </div>
  );
}

export const otpFieldDoc: ComponentDoc = {
  slug: 'otp-field',
  title: 'کد یک‌بارمصرف (OTP)',
  components: ['OTPField'],
  base: 'Input, ProgressBar, FormValidationContext',
  summary:
    'ورودی ۶ رقمی کد یک‌بارمصرف با ترتیب چپ‌به‌راست ارقام لاتین در صفحهٔ راست‌به‌چپ، تبدیل خودکار ارقام فارسی/عربی، جای‌گذاری هوشمند پیامک، تکمیل خودکار one-time-code و شمارشگر ارسال دوباره.',
  status: 'approved',
  products: ['R', 'N', 'T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="ورودی و تکمیل">
        <State label="خالی (پیش‌فرض)">
          <OTPField
            label="کد تأیید"
            description="کد ۶ رقمی ارسال‌شده با پیامک."
          />
        </State>
        <State label="پُر و تراز جدولی (tabular-nums)">
          <OTPField
            label="کد تأیید"
            defaultValue="۴۸۲۹۱۶"
            description="ارقام فارسی هنگام ورود به لاتین استاندارد تبدیل می‌شوند."
          />
        </State>
        <State label="شمارشگر ارسال دوباره (انتظار)">
          <OTPField
            label="کد ورود"
            defaultValue="123"
            resendSecondsRemaining={45}
          />
        </State>
        <State label="آماده برای ارسال دوباره">
          <OTPField
            label="کد ورود"
            resendSecondsRemaining={0}
            onResend={() => undefined}
          />
        </State>
      </GalleryRow>
      <GalleryRow title="حالت‌ها">
        <State label="خطادار">
          <OTPField
            label="کد تأیید"
            defaultValue="1234"
            isInvalid
            errorMessage="کد واردشده نادرست یا منقضی است."
          />
        </State>
        <State label="در حال بررسی">
          <OTPField
            label="بررسی کد"
            defaultValue="482916"
            isPending
          />
        </State>
        <State label="فقط‌خواندنی">
          <OTPField
            label="کد ثبت‌شده"
            defaultValue="704219"
            isReadOnly
          />
        </State>
        <State label="غیرفعال">
          <OTPField
            label="کد منقضی‌شده"
            defaultValue="000000"
            isDisabled
            resendSecondsRemaining={0}
            onResend={() => undefined}
          />
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای کد ۶ رقمی پیامکی ورود، تأیید شمارهٔ همراه و احراز هویت دومرحله‌ای استفاده کنید.',
      'اجازه دهید کاربر کد کامل یا حتی متن پیامک را در هر خانه جای‌گذاری کند؛ فیلد ارقام را استخراج و نرمال‌سازی می‌کند.',
      'مقدار استاندارد لاتین را از onChange یا onComplete بخوانید و در سرور اعتبارسنجی کنید.',
    ],
    dont: [
      'محدودیت maxlength=1 روی ورودی نگذارید که تکمیل خودکار پیامک در iOS و Android را قطع کند.',
      'ارقام کد را راست‌به‌چپ نچینید؛ ترتیب خواندن کدهای احراز هویت همیشه چپ‌به‌راست و با ارقام لاتین است (D-86).',
      'خطا را فقط با رنگ قرمز حاشیه نشان ندهید؛ پیام روشن و مشخص بنویسید.',
    ],
  },
  keyboard: [
    { keys: 'ارقام ۰–۹ / 0–9', action: 'ثبت رقم لاتین در خانهٔ فعلی و حرکت خودکار به خانهٔ بعدی.' },
    { keys: 'Backspace', action: 'پاک کردن خانهٔ فعلی؛ اگر خالی باشد، بازگشت به خانهٔ قبلی و پاک کردن آن.' },
    { keys: 'Delete', action: 'پاک کردن رقم خانهٔ فعلی بدون جابه‌جایی مکان‌نما.' },
    { keys: 'ArrowLeft / ArrowRight', action: 'حرکت چپ و راست میان خانه‌ها هم‌جهت با ترتیب بصری LTR ارقام.' },
    { keys: 'Home / End', action: 'پرش به نخستین یا آخرین خانهٔ کد.' },
    { keys: 'Ctrl+V / ⌘V', action: 'جای‌گذاری کد کامل یا بخشی از آن (حتی با متن فارسی پیامک) و توزیع در خانه‌ها.' },
  ],
  a11y: [
    'گروه با role="group" و aria-labelledby به برچسب متصل است و هر خانه برچسب فارسی «رقم ۱ از ۶» تا «رقم ۶ از ۶» دارد.',
    'خانهٔ نخست دارای autocomplete="one-time-code" و بدون maxlength=1 است تا تکمیل خودکار پیامک در iOS و Android و جای‌گذاری کامل مطابق WCAG 2.2 (3.3.8) کار کند.',
    'اندازهٔ هدف لمسی هر خانه دست‌کم ۴۴×۴۸ پیکسل است و حلقهٔ فوکوس ۲ پیکسلی روی خود خانه نمایش داده می‌شود.',
    'خطاها در role="alert" و تغییر وضعیت ارسال دوباره در ناحیهٔ زندهٔ role="status" اعلام می‌شوند.',
  ],
  rtl: [
    'برچسب، راهنما، خطا و ردیف ارسال دوباره راست‌به‌چپ‌اند، اما ردیف ۶ خانه جزیرهٔ LTR با ارقام لاتین و tabular-nums است (D-86).',
    'در عرض‌های کم (موبایل ۳۶۰–۳۹۰ پیکسل) فاصلهٔ خانه‌ها کاهش می‌یابد تا هر ۶ خانه بدون اسکرول افقی و با هدف ۴۴ پیکسلی در یک ردیف بمانند.',
  ],
};
