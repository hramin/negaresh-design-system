import {
  type AssessmentReportState,
  ReportStatus,
  SubmittedPage,
} from '@negaresh/assessment';
import { mmpiTeen13Fixture } from '@negaresh/assessment/fixtures';
import { SegmentedControl, SegmentedControlItem, Stack } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './assessment.module.css';

function Example() {
  const [status, setStatus] = useState<AssessmentReportState>('failed');

  return (
    <div className={styles.wide} data-interactive="report-status">
      <Stack gap="4">
        <div className={styles.controls}>
          <SegmentedControl
            aria-label="وضعیت گزارش PDF"
            value={status}
            onChange={(k) => setStatus(k as AssessmentReportState)}
          >
            <SegmentedControlItem id="none">ساخته‌نشده</SegmentedControlItem>
            <SegmentedControlItem id="pending">در حال ساخت</SegmentedControlItem>
            <SegmentedControlItem id="ready">آماده</SegmentedControlItem>
            <SegmentedControlItem id="failed">ناموفق</SegmentedControlItem>
            <SegmentedControlItem id="purged">حذف‌شده (۱۸۰ روز)</SegmentedControlItem>
          </SegmentedControl>
        </div>

        <ReportStatus
          status={status}
          generatedAt={status === 'ready' ? '2026-11-18T08:20:00.000Z' : undefined}
          expiresAt={status === 'ready' ? '2027-05-17T08:20:00.000Z' : undefined}
          downloadHref={status === 'ready' ? '/reference/assessment-report' : undefined}
          onPrint={status === 'ready' ? () => window.print() : undefined}
          onGenerate={() => setStatus('pending')}
          onRetry={() => setStatus('ready')}
        />
      </Stack>
    </div>
  );
}

export const reportStatusDoc: ComponentDoc = {
  slug: 'report-status',
  title: 'وضعیت گزارش و صفحهٔ ثبت نهایی (ReportStatus · SubmittedPage)',
  components: ['ReportStatus', 'SubmittedPage'],
  base: 'StatusBadge(domain="report") + Spinner + InlineAlert',
  summary:
    'کارت چرخهٔ عمر گزارش PDF (هر ۵ وضعیت none، pending، ready، failed و purged با دکمهٔ تلاش دوباره) و صفحهٔ تأیید ثبت کارزار («می‌توانید این صفحه را ببندید»).',
  status: 'review',
  products: ['T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="تمام ۵ وضعیت چرخهٔ عمر گزارش (ReportStatus)">
        <State label="none">
          <div className={styles.wide}>
            <ReportStatus status="none" onGenerate={() => {}} />
          </div>
        </State>
        <State label="pending">
          <div className={styles.wide}>
            <ReportStatus status="pending" />
          </div>
        </State>
        <State label="ready (download + print + 180d retention)">
          <div className={styles.wide}>
            <ReportStatus
              status="ready"
              generatedAt="2026-11-18T08:20:00.000Z"
              expiresAt="2027-05-17T08:20:00.000Z"
              downloadHref="/reference/assessment-report"
              onPrint={() => {}}
            />
          </div>
        </State>
        <State label="failed (with retry)">
          <div className={styles.wide}>
            <ReportStatus status="failed" onRetry={() => {}} />
          </div>
        </State>
        <State label="purged (180-day retention)">
          <div className={styles.wide}>
            <ReportStatus status="purged" onGenerate={() => {}} />
          </div>
        </State>
      </GalleryRow>

      <GalleryRow title="صفحهٔ تأیید ثبت کارزار (SubmittedPage)">
        <State label="Stripped campaign confirmation">
          <div className={styles.wide}>
            <SubmittedPage
              organizationName={mmpiTeen13Fixture.organizationName}
              testTitle={mmpiTeen13Fixture.testTitle}
              submittedAt={mmpiTeen13Fixture.completedAt}
              trackingCode={mmpiTeen13Fixture.attemptCode}
            />
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'در وضعیت failed دلیل خطا و دکمهٔ «تلاش دوباره» (onRetry) را همیشه در دسترس بگذارید.',
      'در حالت کارزارهای سازمانی و مدرسه‌ای از SubmittedPage در پوستهٔ بدون منو (Stripped shell) با پیام روشن «می‌توانید این صفحه را ببندید» استفاده کنید.',
    ],
    dont: [
      'در پوستهٔ کارزار (SubmittedPage) پیشنهاد ورود یا منوی حساب کاربری اضافه نکنید.',
      'گزارش‌های حذف‌شده پس از ۱۸۰ روز (purged) را با خطای سیستم (failed) اشتباه نگیرید.',
    ],
  },
  api: [
    {
      name: 'ReportStatus',
      props: [
        { name: 'status', type: "'none' | 'pending' | 'ready' | 'failed' | 'purged'", description: 'وضعیت فعلی فایل PDF' },
        { name: 'generatedAt / expiresAt', type: 'string | Date', description: 'زمان ساخت و مهلت نگهداری ۱۸۰ روزه (شمسی تهران)' },
        { name: 'downloadHref / onDownload / onPrint', type: 'string / callbacks', description: 'اقدام‌های دریافت و چاپ در وضعیت ready' },
        { name: 'onGenerate / onRetry', type: 'callbacks', description: 'ساخت تازه در none/purged یا تلاش دوباره در failed' },
      ],
    },
    {
      name: 'SubmittedPage',
      props: [
        { name: 'organizationName / testTitle', type: 'ReactNode', description: 'نام سازمان برگزارکننده و عنوان آزمون' },
        { name: 'canCloseNote', type: 'ReactNode', default: "'نیاز به اقدام دیگری نیست؛ می‌توانید این صفحه را ببندید.'", description: 'پیام اطمینان‌بخش پایان آزمون' },
        { name: 'submittedAt / trackingCode', type: 'string | Date / string', description: 'زمان ثبت شمسی و کد پیگیری LTR' },
      ],
    },
  ],
  a11y: [
    'وضعیت pending در ناحیهٔ زندهٔ role="status" با Spinner دارای برچسب متنی اعلام می‌شود و failed از InlineAlert با role="alert" استفاده می‌کند.',
    'ReportStatus به‌طور خودکار در @media print پنهان می‌شود تا وارد خروجی چاپی A4 نشود.',
  ],
  rtl: [
    'تاریخ تولید و انقضای گزارش با formatDateTime (شمسی، وقت تهران) و کد پیگیری در <Code> با ایزولهٔ LTR نمایش داده می‌شوند.',
  ],
};
