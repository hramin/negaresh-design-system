import { Button, Inline, Stack, Text, Toast, ToastProvider, useToast } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './feedback.module.css';

function LiveToastButtons() {
  const toast = useToast();
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <Stack gap="3">
      <Inline gap="2">
        <Button
          size="sm"
          variant="primary"
          onPress={() =>
            toast.add({
              title: 'کد فعال‌سازی کپی شد',
              tone: 'neutral',
            })
          }
        >
          اعلان خنثی
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onPress={() =>
            toast.add({
              title: 'سریال باطل شد',
              description: 'می‌توانید این تغییر را بازگردانید.',
              tone: 'success',
              actionLabel: 'بازگردانی',
              onAction: () => setLastAction('عملیات بازگردانی اجرا شد.'),
            })
          }
        >
          اعلان با اقدام
        </Button>
        <Button
          size="sm"
          variant="danger"
          onPress={() =>
            toast.add({
              title: 'ذخیرهٔ تغییرات ناموفق بود',
              description: 'ارتباط با سرور برقرار نشد.',
              tone: 'danger',
            })
          }
        >
          اعلان خطا
        </Button>
      </Inline>
      {lastAction && (
        <Text size="sm" tone="muted" className={styles.output}>
          {lastAction}
        </Text>
      )}
    </Stack>
  );
}

function Example() {
  return (
    <div className={styles.block} data-interactive="toast">
      <ToastProvider>
        <LiveToastButtons />
      </ToastProvider>
    </div>
  );
}

export const toastDoc: ComponentDoc = {
  slug: 'toast',
  title: 'اعلان شناور (Toast / ToastRegion)',
  components: ['Toast', 'ToastRegion', 'ToastProvider', 'createToastQueue', 'useToast'],
  base: 'UNSTABLE_ToastRegion, UNSTABLE_Toast, UNSTABLE_ToastQueue',
  summary:
    'اعلان‌های شناور و صف‌بندی‌شده روی React Aria Components با سطح معکوس برای حالت خنثی، لحن‌های معنایی حاشیه‌دار، سایهٔ لایهٔ شناور (--nds-shadow-overlay)، اقدام اختیاری و مکث خودکار روی هاور و فوکوس.',
  status: 'review',
  products: ['R', 'N', 'T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="لحن‌های اعلان شناور">
        <State label="خنثی (سطح معکوس)">
          <div className={styles.toastCard}>
            <Toast title="پیوند دعوت کپی شد" tone="neutral" />
          </div>
        </State>
        <State label="اطلاع (info)">
          <div className={styles.toastCard}>
            <Toast
              title="خروجی آمادهٔ دانلود است"
              description="فهرست سریال‌ها در قالب CSV ساخته شد."
              tone="info"
            />
          </div>
        </State>
        <State label="موفق (success) با اقدام">
          <div className={styles.toastCard}>
            <Toast
              title="سریال جدید ثبت شد"
              description="تغییرات در فهرست نمایش داده می‌شوند."
              tone="success"
              actionLabel="مشاهده"
            />
          </div>
        </State>
        <State label="هشدار (warning)">
          <div className={styles.toastCard}>
            <Toast
              title="تنها ۲ ظرفیت باقی مانده است"
              description="برای افزایش سقف به تنظیمات سریال بروید."
              tone="warning"
            />
          </div>
        </State>
        <State label="خطا (danger)">
          <div className={styles.toastCard}>
            <Toast
              title="ارسال پیامک ناموفق بود"
              description="لطفاً دقایقی دیگر دوباره تلاش کنید."
              tone="danger"
              actionLabel="تلاش دوباره"
            />
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای تأیید کوتاه عملیات غیرمسدودکننده مانند کپی، ذخیره یا ارسال استفاده کنید.',
      'اعلان‌های دارای دکمهٔ اقدام (مانند «بازگردانی») را بدون بسته شدن خودکار یا با زمان کافی نمایش دهید.',
      'از ToastProvider در ریشهٔ برنامه و هوک useToast() استفاده کنید تا صف اعلان‌ها یکپارچه بماند.',
    ],
    dont: [
      'خطاهای مهم اعتبارسنجی فرم یا اطلاعات حیاتی که کاربر باید بارها بخواند را در Toast قرار ندهید.',
      'بیش از یک دکمهٔ اقدام کوتاه در هر اعلان قرار ندهید.',
    ],
  },
  api: [
    {
      name: 'ToastProvider',
      props: [
        {
          name: 'maxVisibleToasts',
          type: 'number',
          default: '3',
          description: 'حداکثر تعداد اعلان‌های هم‌زمان روی صفحه.',
        },
        {
          name: 'placement',
          type: "'bottom-end' | 'bottom-center' | 'top-end'",
          default: "'bottom-end'",
          description: 'جایگاه منطقی ناحیهٔ اعلان در دسکتاپ.',
        },
        {
          name: 'aria-label',
          type: 'string',
          default: 'messages.toastRegionLabel',
          description: 'نام دسترس‌پذیر ناحیهٔ اعلان‌ها.',
        },
      ],
    },
    {
      name: 'Toast',
      props: [
        { name: 'title', type: 'ReactNode', description: 'تیتر کوتاه اعلان.' },
        { name: 'description', type: 'ReactNode', description: 'توضیح تکمیلی اختیاری.' },
        {
          name: 'tone',
          type: "'neutral' | 'info' | 'success' | 'warning' | 'danger'",
          default: "'neutral'",
          description: 'لحن خنثی (معکوس) یا لحن معنایی حاشیه‌دار.',
        },
        { name: 'actionLabel / onAction', type: 'string / () => void', description: 'دکمهٔ اقدام کوتاه.' },
      ],
    },
  ],
  keyboard: [
    { keys: 'F6', action: 'پرش سریع به ناحیهٔ اعلان‌های فعال (React Aria landmark).' },
    { keys: 'Tab / Shift+Tab', action: 'حرکت بین دکمهٔ اقدام و دکمهٔ بستن در اعلان.' },
    { keys: 'Enter / Space', action: 'اجرای اقدام یا بستن اعلان.' },
  ],
  a11y: [
    'بر پایهٔ React Aria ToastRegion پیاده‌سازی شده و هنگام هاور یا فوکوس کیبورد، زمان‌سنج بسته شدن خودکار را متوقف می‌کند.',
    'اعلان‌های دارای actionLabel در ToastProvider به صورت پیش‌فرض تایمر خودکار ندارند تا کاربر زمان کافی برای اقدام داشته باشد.',
    'دکمه‌های بستن و اقدام دارای هدف لمسی حداقل ۴۴×۴۴ پیکسل و حلقهٔ فوکوس با کنتراست بالا هستند.',
    'تنها لایه‌های شناور مانند Toast مجاز به استفاده از --nds-shadow-overlay هستند (D-77).',
  ],
  rtl: [
    'موقعیت پیش‌فرض bottom-end در فارسی در گوشهٔ پایین‌چپ صفحه قرار می‌گیرد و در موبایل (زیر ۹۰۰ پیکسل) به تمام عرض امن می‌چسبد.',
    'رشته‌های داخلی @react-aria/toast به فارسی بومی‌سازی شده‌اند (D-97).',
  ],
};
