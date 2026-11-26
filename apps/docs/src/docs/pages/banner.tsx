import { Banner, Button, Stack, Text } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './feedback.module.css';

function Example() {
  const [dismissed, setDismissed] = useState(false);
  return (
    <div className={styles.wide} data-interactive="banner">
      <Stack gap="4">
        {!dismissed ? (
          <Banner
            tone="info"
            size="full"
            title="به‌روزرسانی برنامه‌ریزی‌شده"
            isDismissible
            onDismiss={() => setDismissed(true)}
            action={
              <Button size="sm" variant="secondary" onPress={() => setDismissed(true)}>
                جزئیات
              </Button>
            }
          >
            سامانه پنج‌شنبه ساعت ۲ تا ۲:۳۰ بامداد به مدت کوتاه در حال به‌روزرسانی خواهد بود.
          </Banner>
        ) : (
          <Stack gap="2">
            <Text size="sm" tone="muted" className={styles.output}>
              بنر صفحه بسته شد.
            </Text>
            <Button size="sm" variant="secondary" onPress={() => setDismissed(false)}>
              نمایش دوبارهٔ بنر
            </Button>
          </Stack>
        )}
      </Stack>
    </div>
  );
}

export const bannerDoc: ComponentDoc = {
  slug: 'banner',
  title: 'بنر صفحه (Banner)',
  components: ['Banner'],
  summary:
    'نوار اطلاع‌رسانی تمام‌عرض در بالای صفحه برای اعلان‌های سراسری، نگهداری سامانه یا هشدارهای مهم حساب با قابلیت اقدام و بستن.',
  status: 'review',
  products: ['R', 'N', 'T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="لحن‌های بنر">
        <State label="خنثی (neutral)">
          <div className={styles.wide}>
            <Banner tone="neutral" size="full" title="نسخهٔ تازه" aria-label="اعلان نسخهٔ تازه">
              امکان خروجی گزارش در قالب A4 برای آزمون‌های جدید فعال شد.
            </Banner>
          </div>
        </State>
        <State label="اطلاع (info) با اقدام و بستن">
          <div className={styles.wide}>
            <Banner
              tone="info"
              size="full"
              aria-label="اطلاعیهٔ سامانه"
              isDismissible
              action={
                <Button size="sm" variant="secondary">
                  بررسی
                </Button>
              }
            >
              تنظیمات کانال هشدار پیامکی به‌روزرسانی شده است.
            </Banner>
          </div>
        </State>
        <State label="موفق (success)">
          <div className={styles.wide}>
            <Banner tone="success" size="full" title="پرداخت تأیید شد">
              سفارش شما ثبت شده و سریال‌ها در حساب کاربری فعال هستند.
            </Banner>
          </div>
        </State>
        <State label="هشدار (warning)">
          <div className={styles.wide}>
            <Banner tone="warning" size="full" title="پایان نزدیک کارزار" isDismissible>
              مهلت کارزار سنجش سازمانی تا پایان فردا ادامه دارد.
            </Banner>
          </div>
        </State>
        <State label="خطا (danger)">
          <div className={styles.wide}>
            <Banner tone="danger" size="full" title="اختلال موقت در درگاه پرداخت">
              در حال حاضر امکان ثبت پرداخت جدید وجود ندارد؛ لطفاً دقایقی دیگر تلاش کنید.
            </Banner>
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'در بالای صفحه زیر نوار ناوبری برای پیام‌هایی که کل صفحه یا محصول را تحت تأثیر قرار می‌دهند قرار دهید.',
      'متن بنر را کوتاه و تک‌سطری (در دسکتاپ) بنویسید و حداکثر یک اقدام قرار دهید.',
    ],
    dont: [
      'چند بنر هم‌زمان روی هم نچینید؛ مهم‌ترین پیام را نمایش دهید.',
      'برای خطاهای یک فرم یا کارت مشخص از InlineAlert استفاده کنید نه Banner.',
    ],
  },
  api: [
    {
      name: 'Banner',
      props: [
        {
          name: 'tone',
          type: "'neutral' | 'info' | 'success' | 'warning' | 'danger'",
          default: "'info'",
          description: 'لحن بنر سراسری.',
        },
        { name: 'title', type: 'ReactNode', description: 'عبارت کوتاه آغازین پیش از متن اصلی.' },
        { name: 'children', type: 'ReactNode', description: 'متن اصلی بنر.' },
        { name: 'action', type: 'ReactNode', description: 'دکمه یا پیوند اقدام در انتهای سطر.' },
        {
          name: 'size',
          type: "'default' | 'wide' | 'full'",
          default: "'default'",
          description: 'هم‌ترازی عرض محتوای درونی با کانتینر ۱۲۰۰، ۱۴۴۰ یا تمام‌عرض.',
        },
        {
          name: 'isDismissible',
          type: 'boolean',
          default: 'false',
          description: 'نمایش دکمهٔ بستن با هدف لمسی ۴۴×۴۴ پیکسل.',
        },
        {
          name: 'isDismissed / defaultDismissed / onDismiss',
          type: 'boolean / boolean / () => void',
          description: 'مدیریت وضعیت بسته‌شدن.',
        },
      ],
    },
  ],
  keyboard: [
    { keys: 'Tab / Shift+Tab', action: 'حرکت میان دکمهٔ اقدام و دکمهٔ بستن.' },
    { keys: 'Enter / Space', action: 'فعال‌سازی اقدام یا بستن بنر.' },
  ],
  a11y: [
    'بنرهای خطر با role="alert"، هشدار و موفقیت با role="status"، و اعلان‌های عمومی با role="region" و برچسب دسترس‌پذیر رندر می‌شوند.',
    'در نمای موبایل (زیر ۹۰۰ پیکسل) محتوا و اقدام‌ها بدون اسکرول افقی می‌شکنند و هدف ۴۴×۴۴ حفظ می‌شود.',
  ],
  rtl: [
    'آیکن و متن در ابتدای خط (راست) و بخش اقدام/بستن در انتهای خط (چپ) با margin-inline-start: auto تراز می‌شوند.',
  ],
};
