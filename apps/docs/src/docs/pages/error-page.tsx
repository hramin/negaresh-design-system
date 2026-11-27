import {
  Button,
  Code,
  ErrorPage,
  ErrorState,
  type ErrorStatus,
  LinkButton,
  SegmentedControl,
  SegmentedControlItem,
  Stack,
} from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './feedback.module.css';

const STATUS_OPTIONS: readonly { id: string; value: ErrorStatus; label: string }[] = [
  { id: '403', value: 403, label: '۴۰۳' },
  { id: '404', value: 404, label: '۴۰۴' },
  { id: '410', value: 410, label: '۴۱۰' },
  { id: '500', value: 500, label: '۵۰۰' },
  { id: 'maintenance', value: 'maintenance', label: 'به‌روزرسانی' },
];

function Example() {
  const [selected, setSelected] = useState<string>('404');
  const current = STATUS_OPTIONS.find((item) => item.id === selected)?.value ?? 404;

  return (
    <div className={styles.wide} data-interactive="error-page">
      <Stack gap="4">
        <SegmentedControl
          aria-label="پیش‌تنظیم خطا"
          value={selected}
          onChange={(next) => setSelected(String(next))}
        >
          {STATUS_OPTIONS.map((item) => (
            <SegmentedControlItem key={item.id} id={item.id}>
              {item.label}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
        <ErrorPage
          status={current}
          embedded
          headingLevel={2}
          actionHref="/"
          secondaryAction={
            <LinkButton href="#support" variant="ghost">
              تماس با پشتیبانی
            </LinkButton>
          }
          details={
            current === 500 ? (
              <>
                شناسهٔ پیگیری: <Code>ERR-1405-8821</Code>
              </>
            ) : undefined
          }
        />
      </Stack>
    </div>
  );
}

export const errorPageDoc: ComponentDoc = {
  slug: 'error-page',
  title: 'وضعیت و صفحهٔ خطا (ErrorState / ErrorPage)',
  components: ['ErrorState', 'ErrorPage'],
  summary:
    'قالب‌های آماده و آرام فارسی برای خطاهای ۴۰۳، ۴۰۴، ۴۱۰، ۵۰۰ و حالت نگهداری سامانه، هم برای بخش‌های درون‌صفحه (ErrorState) و هم برای مسیرهای تمام‌صفحه (ErrorPage).',
  status: 'approved',
  products: ['R', 'N', 'T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="پیش‌تنظیم‌های خطای HTTP و نگهداری">
        <State label="۴۰۳ — عدم دسترسی">
          <div className={styles.block}>
            <ErrorPage status={403} embedded headingLevel={3} actionHref="/" />
          </div>
        </State>
        <State label="۴۰۴ — پیدا نشد">
          <div className={styles.block}>
            <ErrorPage status={404} embedded headingLevel={3} actionHref="/" />
          </div>
        </State>
        <State label="۴۱۰ — دیگر در دسترس نیست">
          <div className={styles.block}>
            <ErrorPage status={410} embedded headingLevel={3} actionHref="/" />
          </div>
        </State>
        <State label="۵۰۰ — خطای سرور با شناسهٔ پیگیری">
          <div className={styles.block}>
            <ErrorPage
              status={500}
              embedded
              headingLevel={3}
              action={<Button variant="primary">تلاش دوباره</Button>}
              details={
                <>
                  شناسهٔ خطا: <Code>REQ-9102</Code>
                </>
              }
            />
          </div>
        </State>
        <State label="به‌روزرسانی سامانه (maintenance)">
          <div className={styles.block}>
            <ErrorPage status="maintenance" embedded headingLevel={3} />
          </div>
        </State>
      </GalleryRow>
      <GalleryRow title="ErrorState درون‌بخشی">
        <State label="خطای بارگذاری فهرست (قابل استفاده در DataTable و کارت)">
          <div className={styles.block}>
            <ErrorState
              status={500}
              headingLevel={3}
              title="فهرست سریال‌ها بارگذاری نشد"
              description="ارتباط با سرویس رجیستری برقرار نشد. دوباره تلاش کنید."
              action={<Button variant="primary">تلاش دوباره</Button>}
            />
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'از ErrorPage برای مرزهای خطای مسیر (route error boundaries) و صفحات ۴۰۳/۴۰۴/۴۱۰/۵۰۰/نگهداری استفاده کنید.',
      'از ErrorState برای خطای بارگذاری یک بخش، جدول یا ویجت درون صفحه استفاده کنید.',
      'کدهای فنی یا شناسهٔ درخواست را درون details با کامپوننت <Code> (LTR) نمایش دهید.',
    ],
    dont: [
      'متن خطاهای خام سرور یا کدهای انگلیسی بدون توضیح فارسی را مستقیم به کاربر نشان ندهید.',
    ],
  },
  a11y: [
    'وضعیت ۵۰۰ با role="alert" و سایر وضعیت‌ها با role="status" اعلام می‌شوند.',
    'تمام متن‌های پیش‌فرض از NdsMessages.errorPresets خوانده می‌شوند و با لحن آرام و روشن نوشته شده‌اند (content.md).',
  ],
  rtl: [
    'اعداد وضعیت به فارسی (۴۰۳، ۴۰۴، ۴۱۰، ۵۰۰) نمایش داده می‌شوند و شناسه‌های فنی درون <Code> به صورت LTR ایزوله می‌مانند.',
  ],
};
