import { iconSignOut, iconUser } from '@negaresh/icons';
import { AccountPill, Menu, MenuItem, MenuSeparator, MenuTrigger } from '@negaresh/react';
import { maskPhone } from '@negaresh/utils';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import ui from '../ui.module.css';

const MASKED_PHONE = maskPhone('09121234567');

function AccountMenuExample() {
  return (
    <MenuTrigger>
      <AccountPill label={MASKED_PHONE} ltr aria-label={`حساب کاربری ${MASKED_PHONE}`} />
      <Menu placement="bottom end">
        <MenuItem id="activations" icon={iconUser}>
          فعال‌سازی‌های من
        </MenuItem>
        <MenuSeparator />
        <MenuItem id="signout" icon={iconSignOut}>
          خروج
        </MenuItem>
      </Menu>
    </MenuTrigger>
  );
}

export const accountPillDoc: ComponentDoc = {
  slug: 'account-pill',
  title: 'قرص حساب کاربری',
  components: ['AccountPill'],
  base: 'Button',
  summary:
    'دکمهٔ فشردهٔ حساب کاربری برای نوار بالایی؛ معمولاً ماشهٔ منوی کاربری است. در دسکتاپ برچسب (شمارهٔ پوشیده یا نام) و آواتار را نشان می‌دهد و در موبایل به دکمهٔ آواتار با هدف ۴۴×۴۴ پیکسل تبدیل می‌شود.',
  status: 'approved',
  products: ['R', 'N', 'T', 'V'],
  Example: () => <AccountMenuExample />,
  Gallery: () => (
    <>
      <GalleryRow title="حالت‌ها و ترکیب‌ها">
        <State label="شمارهٔ پوشیده (ltr) · تعاملی">
          <span className={ui.capture} data-interactive="account-pill">
            <AccountPill label={MASKED_PHONE} ltr aria-label={`حساب کاربری ${MASKED_PHONE}`} />
          </span>
        </State>
        <State label="نام فارسی با آواتار سفارشی">
          <AccountPill label="سارا محمدی" avatar="سم" aria-label="حساب کاربری سارا محمدی" />
        </State>
        <State label="همراه با MenuTrigger">
          <AccountMenuExample />
        </State>
        <State label="غیرفعال">
          <AccountPill
            label={MASKED_PHONE}
            ltr
            isDisabled
            aria-label={`حساب کاربری ${MASKED_PHONE}`}
          />
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'همیشه aria-label کامل بدهید؛ زیر ۹۰۰ پیکسل برچسب دیدنی پنهان می‌شود و نام دکمه از همین ویژگی می‌آید.',
      'برای شمارهٔ پوشیده (maskPhone) یا ایمیل، ویژگی ltr را فعال کنید تا جهت ارقام به‌هم نریزد (D-86).',
      'مستقیماً به‌عنوان ماشهٔ MenuTrigger استفاده کنید؛ ویژگی‌های aria-haspopup و aria-expanded خودکار متصل می‌شوند.',
    ],
    dont: [
      'نمایش شمارهٔ کامل کاربر در نوار بالایی؛ از maskPhone استفاده کنید (حریم خصوصی).',
      'گذاشتن اقدام‌های متعدد داخل خود قرص؛ قرص یک دکمهٔ واحد است که منو را باز می‌کند.',
    ],
  },
  keyboard: [
    { keys: 'Tab / Shift+Tab', action: 'رسیدن فوکوس به دکمه با حلقهٔ فوکوس ۲ پیکسلی' },
    { keys: 'Enter / Space / ↓', action: 'اجرا یا باز کردن منوی متصل (درون MenuTrigger)' },
  ],
  a11y: [
    'ویژگی aria-label در نوع تایپ‌اسکریپت الزامی است تا در نمای موبایل (بدون برچسب دیدنی) هرگز دکمهٔ بی‌نام ساخته نشود.',
    'در موبایل ظاهر دکمه آواتار ۳۲ پیکسلی است اما ناحیهٔ لمس با شبه‌عنصر نامرئی تا ۴۴×۴۴ پیکسل گسترش می‌یابد.',
    'آواتار درونی با aria-hidden="true" تزئینی است و نام دکمه فقط از aria-label خوانده می‌شود.',
  ],
  rtl: [
    'در دسکتاپ، برچسب در سمت شروع (راست) و آواتار در سمت پایان (چپ) با پدینگ منطقی قرار می‌گیرند.',
    'با ویژگی ltr، شمارهٔ پوشیده داخل جزیرهٔ چپ‌به‌راست رندر می‌شود و ترتیب ارقام حفظ می‌گردد.',
  ],
};
