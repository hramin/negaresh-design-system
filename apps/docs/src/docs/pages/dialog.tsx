import {
  AlertDialog,
  Button,
  Code,
  Dialog,
  DialogTrigger,
  Inline,
  Stack,
  Text,
} from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './overlays.module.css';

function Example() {
  const [status, setStatus] = useState<string | null>(null);

  return (
    <div className={styles.block} data-interactive="dialog">
      <Stack gap="3">
        <Inline gap="2">
          <DialogTrigger>
            <Button variant="primary">باز کردن پنجره (md)</Button>
            <Dialog
              title="جزئیات فعال‌سازی سریال"
              description="اطلاعات زیر برای ثبت این رایانه ذخیره می‌شود."
              size="md"
              footer={(close) => (
                <>
                  <Button variant="secondary" onPress={close}>
                    انصراف
                  </Button>
                  <Button
                    variant="primary"
                    onPress={() => {
                      setStatus('تغییرات پنجرهٔ گفتگو ثبت شد.');
                      close();
                    }}
                  >
                    ثبت و ادامه
                  </Button>
                </>
              )}
            >
              <Stack gap="2">
                <Text as="p" size="sm" leading="text">
                  شمارهٔ سریال <Code>NGR-4920-8814</Code> یک ظرفیت آزاد برای فعال‌سازی روی این
                  دستگاه دارد.
                </Text>
                <Text as="p" size="sm" tone="muted" leading="text">
                  در نمایشگرهای زیر ۹۰۰ پیکسل، این پنجره به صورت خودکار به برگهٔ پایینی (Bottom
                  Sheet) تبدیل می‌شود.
                </Text>
              </Stack>
            </Dialog>
          </DialogTrigger>

          <DialogTrigger>
            <Button variant="danger">باطل کردن سریال (AlertDialog)</Button>
            <AlertDialog
              tone="danger"
              title="باطل کردن سریال؟"
              confirmLabel="باطل شود"
              onConfirm={() => setStatus('سریال با تأیید کاربر باطل شد.')}
              onCancel={() => setStatus('عملیات باطل کردن لغو شد.')}
            >
              پس از باطل کردن، امکان ساخت کد فعال‌سازی تازه با این سریال وجود نخواهد داشت.
            </AlertDialog>
          </DialogTrigger>
        </Inline>
        {status && (
          <Text size="sm" tone="muted" className={styles.output}>
            {status}
          </Text>
        )}
      </Stack>
    </div>
  );
}

export const dialogDoc: ComponentDoc = {
  slug: 'dialog',
  title: 'پنجرهٔ گفتگو و هشدار (Dialog / AlertDialog)',
  components: ['DialogTrigger', 'Dialog', 'AlertDialog'],
  base: 'ModalOverlay, Modal, Dialog, DialogTrigger',
  summary:
    'پنجرهٔ مودال و پیام تأیید مسدودکننده بر پایهٔ React Aria با تلهٔ فوکوس، بازگشت فوکوس به دکمهٔ بازکننده، سایهٔ لایهٔ شناور (--nds-shadow-overlay) و تبدیل خودکار به برگهٔ پایینی در موبایل (زیر ۹۰۰ پیکسل، D-90).',
  status: 'approved',
  products: ['R', 'N', 'T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="اندازه‌های پنجرهٔ گفتگو (دسکتاپ)">
        <State label="کوچک (sm · ۴۰۰px)">
          <DialogTrigger>
            <Button size="sm">نمایش sm</Button>
            <Dialog title="تأیید کوتاه" size="sm">
              پنجرهٔ کوچک برای فرم‌های تک‌فیلدی یا راهنمای مختصر.
            </Dialog>
          </DialogTrigger>
        </State>
        <State label="میانه (md · ۵۶۰px)">
          <DialogTrigger>
            <Button size="sm">نمایش md</Button>
            <Dialog title="ویرایش مشخصات" size="md">
              اندازهٔ پیش‌فرض برای اغلب فرم‌ها و جزئیات رکوردها.
            </Dialog>
          </DialogTrigger>
        </State>
        <State label="بزرگ (lg · ۷۲۰px)">
          <DialogTrigger>
            <Button size="sm">نمایش lg</Button>
            <Dialog title="پیش‌نمایش گزارش" size="lg">
              اندازهٔ گسترده برای جدول‌های کوتاه یا اطلاعات چندبخشی.
            </Dialog>
          </DialogTrigger>
        </State>
      </GalleryRow>
      <GalleryRow title="نقش‌های AlertDialog">
        <State label="تأیید عادی (default)">
          <DialogTrigger>
            <Button size="sm" variant="secondary">
              تأیید عادی
            </Button>
            <AlertDialog title="ذخیرهٔ تغییرات پیش از خروج؟" confirmLabel="ذخیره و خروج">
              تغییرات ذخیره نشده‌اند و در صورت خروج از دست می‌روند.
            </AlertDialog>
          </DialogTrigger>
        </State>
        <State label="اقدام مخرب (danger)">
          <DialogTrigger>
            <Button size="sm" variant="danger">
              تأیید مخرب
            </Button>
            <AlertDialog tone="danger" title="حذف دائمی گزارش؟" confirmLabel="حذف گزارش">
              این گزارش از بایگانی حذف می‌شود و قابل بازیابی نیست.
            </AlertDialog>
          </DialogTrigger>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای کارهای متمرکز کوتاه یا تأیید اقدام‌های حساس که نباید در جریان صفحه گم شوند استفاده کنید.',
      'همیشه برای AlertDialog تیتر پرسشی روشن و دکمهٔ تأیید با فعل دقیق («باطل شود»، «حذف گزارش») بنویسید.',
      'فهرست دکمه‌های اقدام را در footer قرار دهید تا در موبایل به شکل ستونی چیده شوند.',
    ],
    dont: [
      'فرم‌های طولانی چندمرحله‌ای یا صفحه‌های کامل را درون Dialog قرار ندهید.',
      'بیش از یک مودال را هم‌زمان روی هم باز نکنید.',
    ],
  },
  keyboard: [
    { keys: 'Tab / Shift+Tab', action: 'گردش فوکوس درون تلهٔ فوکوس پنجره.' },
    { keys: 'Escape', action: 'بستن پنجره و بازگشت فوکوس به دکمهٔ بازکننده.' },
    { keys: 'Enter / Space', action: 'اجرای دکمهٔ دارای فوکوس درون پنجره.' },
  ],
  a11y: [
    'بر پایهٔ React Aria ModalOverlay و Dialog: محتوای پس‌زمینه را برای صفحه‌خوان‌ها پنهان می‌کند، فوکوس را محصور نگه می‌دارد و هنگام بسته شدن به محرک برمی‌گرداند.',
    'AlertDialog دارای role="alertdialog" است و بستن با کلیک روی پس‌زمینه به صورت پیش‌فرض غیرفعال است تا تصمیم کاربر صریح باشد.',
    'دکمهٔ بستن دارای برچسب فارسی از کاتالوگ (بستن پنجره) و اندازهٔ لمسی حداقل ۴۴×۴۴ پیکسل است.',
  ],
  rtl: [
    'عنوان و دکمهٔ بستن با ویژگی‌های منطقی در ابتدا و انتهای سطر قرار می‌گیرند.',
    'زیر ۹۰۰ پیکسل پنجره به برگهٔ پایینی با گوشه‌های بالایی گرد (--nds-radius-xl) و چیدمان عمودی دکمه‌های پاورقی تبدیل می‌شود.',
  ],
};
