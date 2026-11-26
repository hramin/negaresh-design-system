import { Button, InlineAlert, Stack, Text } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './feedback.module.css';

function Example() {
  const [dismissed, setDismissed] = useState(false);
  return (
    <div className={styles.block} data-interactive="inline-alert">
      <Stack gap="4">
        {!dismissed ? (
          <InlineAlert
            tone="warning"
            title="سقف فعال‌سازی این سریال پر شده است"
            isDismissible
            onDismiss={() => setDismissed(true)}
            actions={
              <Button size="sm" variant="secondary" onPress={() => setDismissed(true)}>
                متوجه شدم
              </Button>
            }
          >
            این سریال پیش‌تر روی رایانهٔ دیگری فعال شده است. نصب دوباره روی همان رایانه رایگان است.
          </InlineAlert>
        ) : (
          <Stack gap="2">
            <Text size="sm" tone="muted" className={styles.output}>
              پیام بسته شد.
            </Text>
            <Button size="sm" variant="secondary" onPress={() => setDismissed(false)}>
              نمایش دوبارهٔ پیام
            </Button>
          </Stack>
        )}
      </Stack>
    </div>
  );
}

export const inlineAlertDoc: ComponentDoc = {
  slug: 'inline-alert',
  title: 'پیام درون‌متنی (InlineAlert)',
  components: ['InlineAlert'],
  summary:
    'بلوک بازخورد درون‌صفحه در چهار لحن معنایی (اطلاع، موفق، هشدار، خطا) با آیکن، عنوان، اقدام‌های مرتبط و قابلیت بستن، بدون سایهٔ ساکن.',
  status: 'review',
  products: ['R', 'N', 'T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="لحن‌های معنایی">
        <State label="اطلاع (info)">
          <div className={styles.block}>
            <InlineAlert tone="info" title="نصب دوباره رایگان است">
              نصب دوباره روی همین رایانه از سقف فعال‌سازی سریال کم نمی‌کند.
            </InlineAlert>
          </div>
        </State>
        <State label="موفق (success)">
          <div className={styles.block}>
            <InlineAlert tone="success" title="کد فعال‌سازی ساخته شد">
              همین کد را در پنجرهٔ فعال‌سازی برنامه وارد کنید. یک نسخه با پیامک هم ارسال شد.
            </InlineAlert>
          </div>
        </State>
        <State label="هشدار (warning)">
          <div className={styles.block}>
            <InlineAlert tone="warning" title="سقف فعال‌سازی این سریال پر شده است">
              برای فعال‌سازی روی رایانهٔ تازه باید یک ظرفیت اضافه بخرید.
            </InlineAlert>
          </div>
        </State>
        <State label="خطا (danger)">
          <div className={styles.block}>
            <InlineAlert tone="danger" title="سریال باطل شده است">
              این سریال غیرفعال شده است. برای پیگیری با پشتیبانی تماس بگیرید.
            </InlineAlert>
          </div>
        </State>
      </GalleryRow>
      <GalleryRow title="اقدام و قابلیت بستن">
        <State label="با اقدام و دکمهٔ بستن">
          <div className={styles.block}>
            <InlineAlert
              tone="info"
              title="گزارش PDF آماده است"
              isDismissible
              actions={
                <Button size="sm" variant="secondary">
                  دریافت گزارش
                </Button>
              }
            >
              پروندهٔ نتیجهٔ آزمون تا ۱۸۰ روز در حساب کاربری شما نگهداری می‌شود.
            </InlineAlert>
          </div>
        </State>
        <State label="فقط متن بدون عنوان">
          <div className={styles.block}>
            <InlineAlert tone="success">اطلاعات پرونده با موفقیت به‌روزرسانی شد.</InlineAlert>
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای پیام‌های مرتبط با یک بخش، کارت یا نتیجهٔ فرم درون جریان صفحه استفاده کنید.',
      'در پیام‌های خطا دقیقاً بگویید چه رخ داده و کاربر چه کاری باید انجام دهد.',
      'همیشه متن واضح و آیکن معنایی را همراه لحن رنگی نگه دارید.',
    ],
    dont: [
      'برای اعلان‌های کوتاه گذرا پس از کپی یا ذخیره استفاده نکنید؛ از Toast کمک بگیرید.',
      'از پیام خطای قرمز برای اطلاع‌رسانی عادی یا توضیح راهنما استفاده نکنید.',
    ],
  },
  api: [
    {
      name: 'InlineAlert',
      props: [
        {
          name: 'tone',
          type: "'info' | 'success' | 'warning' | 'danger'",
          default: "'info'",
          description: 'لحن معنایی؛ رنگ پس‌زمینه، حاشیه، متن و آیکن پیش‌فرض را تعیین می‌کند.',
        },
        { name: 'title', type: 'ReactNode', description: 'عنوان کوتاه و مشخص پیام.' },
        { name: 'children', type: 'ReactNode', description: 'متن توضیحی پیام.' },
        {
          name: 'icon',
          type: 'IconDefinition | false',
          description: 'جایگزینی آیکن پیش‌فرض یا حذف آن با false.',
        },
        { name: 'actions', type: 'ReactNode', description: 'دکمه‌ها یا پیوندهای اقدام زیر متن.' },
        {
          name: 'isDismissible',
          type: 'boolean',
          default: 'false',
          description: 'نمایش دکمهٔ بستن با هدف لمسی حداقل ۴۴×۴۴ پیکسل.',
        },
        {
          name: 'isDismissed / defaultDismissed / onDismiss',
          type: 'boolean / boolean / () => void',
          description: 'کنترل وضعیت بسته‌شدن به صورت کنترل‌شده یا خودکار.',
        },
        {
          name: 'headingLevel',
          type: '2 | 3 | 4',
          description: 'رندر عنوان به صورت تیتر معنایی در سلسله‌مراتب صفحه.',
        },
        {
          name: 'role',
          type: "'alert' | 'status' | 'note' | 'region'",
          description: 'پیش‌فرض: alert برای danger، status برای success/warning، و note برای info.',
        },
      ],
    },
  ],
  keyboard: [
    { keys: 'Tab / Shift+Tab', action: 'جابه‌جایی فوکوس میان دکمه‌های اقدام و دکمهٔ بستن.' },
    { keys: 'Enter / Space', action: 'اجرای اقدام یا بستن پیام در صورت فعال بودن isDismissible.' },
  ],
  a11y: [
    'هر لحن معنایی با آیکن و متن همراه است و هرگز تنها به رنگ تکیه نمی‌کند.',
    'پیام‌های danger به صورت پیش‌فرض role="alert"، پیام‌های success/warning با role="status"، و info با role="note" رندر می‌شوند.',
    'دکمهٔ بستن حداقل ۴۴×۴۴ پیکسل اندازه دارد و برچسب فارسی آن از NdsMessages خوانده می‌شود.',
  ],
  rtl: [
    'آیکن در ابتدای خط (سمت راست در فارسی) و دکمهٔ بستن در انتهای خط (سمت چپ) قرار می‌گیرند.',
    'تمام حاشیه‌ها و فاصله‌ها با ویژگی‌های منطقی CSS نوشته شده‌اند.',
  ],
};
