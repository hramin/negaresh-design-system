import { iconFile, iconKey, iconReceipt, iconSettings } from '@negaresh/icons';
import { Inline, Stack, Text, UserMenu } from '@negaresh/react';
import { maskPhone } from '@negaresh/utils';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './navigation.module.css';

const MASKED = maskPhone('09121234567');
const PORTRAIT_SVG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' fill='%231D6B66'/><circle cx='32' cy='25' r='11' fill='%23F3F1EC'/><path d='M14 56c3-11 10-16 18-16s15 5 18 16' fill='%23F3F1EC'/></svg>";

function Example() {
  const [role, setRole] = useState('customer');
  const [status, setStatus] = useState<string | null>(null);

  return (
    <div className={styles.block} data-interactive="user-menu">
      <Stack gap="3">
        <Inline gap="3">
          <UserMenu
            label="دکتر سارا رضایی"
            aria-label="حساب کاربری دکتر سارا رضایی"
            name="دکتر سارا رضایی"
            subtitle={MASKED}
            ltrSubtitle
            avatarSrc={PORTRAIT_SVG}
            showThemeToggle
            activeRole={role}
            onRoleChange={(next) => {
              setRole(next);
              setStatus(`نقش فعال به «${next === 'admin' ? 'مدیر سامانه' : 'مشتری'}» تغییر کرد.`);
            }}
            roles={[
              { id: 'customer', label: 'مشتری' },
              { id: 'admin', label: 'مدیر سامانه' },
            ]}
            items={[
              {
                id: 'activations',
                label: 'فعال‌سازی‌های من',
                icon: iconKey,
                onAction: () => setStatus('صفحهٔ فعال‌سازی‌های من انتخاب شد.'),
              },
              {
                id: 'orders',
                label: 'سفارش‌ها',
                icon: iconReceipt,
                onAction: () => setStatus('صفحهٔ سفارش‌ها انتخاب شد.'),
              },
              {
                id: 'admin-serials',
                label: 'مدیریت سریال‌ها',
                icon: iconSettings,
                roles: ['admin'],
                onAction: () => setStatus('بخش مدیریت سریال‌ها باز شد.'),
              },
            ]}
            onSignOut={() => setStatus('درخواست خروج از حساب ثبت شد.')}
          />
        </Inline>
        {status && (
          <Text size="xs" tone="muted" className={styles.output}>
            {status}
          </Text>
        )}
      </Stack>
    </div>
  );
}

export const userMenuDoc: ComponentDoc = {
  slug: 'user-menu',
  title: 'منوی حساب کاربری (UserMenu)',
  components: ['UserMenu'],
  summary:
    'ترکیب کامپوننت‌های تأییدشدهٔ AccountPill، Menu و Avatar با پشتیبانی از تعویض نقش کاربری، تغییر زندهٔ نمایهٔ رنگ (روشن/تیره/سیستم) و اقدام خروج.',
  status: 'review',
  products: ['R', 'N', 'T', 'V'],
  base: 'AccountPill + MenuTrigger + Menu + Avatar',
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="شمارهٔ همراه ماسک‌شده (رجیستری) و نام با تصویر Avatar">
        <State label="masked phone · default icon">
          <UserMenu
            label={MASKED}
            ltr
            aria-label={`حساب کاربری ${MASKED}`}
            items={[{ id: 'a', label: 'فعال‌سازی‌های من', icon: iconKey }]}
            onSignOut={() => {}}
          />
        </State>
        <State label="display name · portrait Avatar">
          <UserMenu
            label="سارا رضایی"
            aria-label="حساب کاربری سارا رضایی"
            name="سارا رضایی"
            avatarSrc={PORTRAIT_SVG}
            items={[{ id: 'p', label: 'پروندهٔ آزمون‌ها', icon: iconFile }]}
            showThemeToggle
          />
        </State>
        <State label="disabled">
          <UserMenu
            label={MASKED}
            ltr
            aria-label={`حساب کاربری ${MASKED} (غیرفعال)`}
            isDisabled
            items={[{ id: 'a', label: 'فعال‌سازی‌های من' }]}
          />
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای شمارهٔ همراه یا ایمیل روی دکمهٔ ماشه، ویژگی ltr را فعال کنید (D-86).',
      'از showThemeToggle برای تغییر زندهٔ نمایهٔ رنگ متصل به ThemeProvider استفاده کنید.',
    ],
    dont: [
      'حساب کاربری را بدون aria-label رندر نکنید؛ در عرض زیر ۹۰۰ پیکسل برچسب متنی پنهان می‌شود و تنها آواتار دیده می‌شود.',
    ],
  },
  api: [
    {
      name: 'UserMenu',
      props: [
        { name: 'label / aria-label / ltr', type: 'ReactNode / string / boolean', description: 'شناسهٔ نمایشی دسکتاپ، نام دسترس‌پذیر الزامی و ایزوله‌سازی LTR.' },
        { name: 'name / subtitle / avatarSrc', type: 'string / ReactNode / string', description: 'سربرگ حساب و تصویر Avatar (در صورت نبود تصویر، سربرگ منو حروف اول فارسی را نشان می‌دهد).' },
        { name: 'items', type: 'readonly UserMenuItemData[]', description: 'آیتم‌های منو با امکان فیلتر بر اساس نقش (roles).' },
        { name: 'roles / activeRole / onRoleChange', type: 'readonly UserMenuRole[] / string / (id: string) => void', description: 'بخش انتخاب نقش کاربری.' },
        { name: 'showThemeToggle', type: 'boolean', default: 'false', description: 'افزودن بخش انتخاب نمایهٔ رنگ متصل به useTheme().' },
        { name: 'onSignOut / signOutLabel', type: '() => void / string', description: 'اقدام خروج با لحن danger و آیکن خروج.' },
      ],
    },
  ],
  keyboard: [
    { keys: 'Enter / Space / ArrowDown', action: 'باز کردن منوی حساب کاربری از AccountPill.' },
    { keys: 'ArrowDown / ArrowUp', action: 'حرکت بین بخش‌های پیوندها، نقش‌ها، نمایهٔ رنگ و خروج.' },
    { keys: 'Escape', action: 'بستن منو و بازگرداندن فوکوس به AccountPill.' },
  ],
  a11y: [
    'از ساختار MenuSection و MenuItem استاندارد React Aria با نقش‌های menu / group / menuitem / menuitemradio استفاده می‌کند.',
    'در موبایل هدف لمسی AccountPill دست‌کم ۴۴×۴۴ پیکسل حفظ می‌شود.',
  ],
  rtl: [
    'منو به طور پیش‌فرض در placement="bottom end" (تراز با لبهٔ پایان سطر در RTL) باز می‌شود.',
  ],
};
