import { ResumeOrRestart, StartForm, type StartFormValues } from '@negaresh/assessment';
import { startFormSchema, unfinishedAttempt } from '@negaresh/assessment/fixtures';
import { InlineAlert, Stack } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './assessment.module.css';

function Example() {
  const [submitted, setSubmitted] = useState<StartFormValues | null>(null);
  const [resumeAction, setResumeAction] = useState<string | null>(null);

  return (
    <div className={styles.wide} data-interactive="start-resume">
      <Stack gap="5">
        <StartForm
          title="فرم شروع و اطلاعات جمعیت‌شناختی"
          description="تمامی فیلدها به‌صورت پویا از اسکیمای آزمون ساخته می‌شوند (متن LTR، انتخاب، عدد و تاریخ شمسی)."
          fields={startFormSchema}
          defaultValues={{
            educationLevel: 'high',
            age: 16,
            audiencePreference: 'calm',
          }}
          onSubmit={(vals) => setSubmitted(vals)}
        />

        {submitted && (
          <InlineAlert tone="success" title="اطلاعات پایه تأیید شد">
            شناسهٔ شرکت‌کننده: {String(submitted.participantCode ?? '—')} · سن:{' '}
            {String(submitted.age ?? '—')}
          </InlineAlert>
        )}

        <ResumeOrRestart
          testTitle={unfinishedAttempt.testTitle}
          lastSavedAt={unfinishedAttempt.lastSavedAt}
          expiresAt={unfinishedAttempt.expiresAt}
          answeredCount={unfinishedAttempt.answeredCount}
          totalQuestions={unfinishedAttempt.totalQuestions}
          currentPage={unfinishedAttempt.currentPage}
          totalPages={unfinishedAttempt.totalPages}
          onResume={() => setResumeAction('ادامهٔ تلاش ذخیره‌شده انتخاب شد.')}
          onRestart={() => setResumeAction('تلاش قبلی پاک شد و آزمون از ابتدا شروع می‌شود.')}
        />

        {resumeAction && (
          <InlineAlert tone="info" role="status">
            {resumeAction}
          </InlineAlert>
        )}
      </Stack>
    </div>
  );
}

export const startResumeDoc: ComponentDoc = {
  slug: 'start-resume',
  title: 'فرم شروع و ادامهٔ آزمون (StartForm · ResumeOrRestart)',
  components: ['StartForm', 'ResumeOrRestart'],
  base: 'TextField · NumberField · Select · DatePicker · AlertDialog',
  summary:
    'فرم اطلاعات پایه مبتنی بر اسکیما (انتخاب، عدد، متن، تاریخ شمسی) همراه با خطاهای مسدودکنندهٔ کارزار و کارت تصمیم‌گیری ادامه یا شروع دوبارهٔ تلاش ناتمام.',
  status: 'review',
  products: ['T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="فرم شروع آزمون (StartForm)">
        <State label="Default schema form (all 4 field types)">
          <div className={styles.wide}>
            <StartForm
              title="اطلاعات جمعیت‌شناختی آزمون"
              description="این اطلاعات صرفاً برای انتخاب هنجار سنی مناسب استفاده می‌شود."
              fields={startFormSchema}
              defaultValues={{
                participantCode: 'SCH-1405-042',
                educationLevel: 'high',
                age: 16,
                birthDate: '2010-05-12',
                audiencePreference: 'calm',
              }}
            />
          </div>
        </State>
        <State label="Campaign blocker (seats_full)">
          <div className={styles.wide}>
            <StartForm
              title="کارزار پایش دانش‌آموزی"
              fields={startFormSchema.slice(0, 2)}
              blocker="seats_full"
            />
          </div>
        </State>
      </GalleryRow>

      <GalleryRow title="ادامه یا شروع دوباره (ResumeOrRestart)">
        <State label="Unfinished attempt with Jalali timestamps">
          <div className={styles.wide}>
            <ResumeOrRestart
              testTitle={unfinishedAttempt.testTitle}
              lastSavedAt={unfinishedAttempt.lastSavedAt}
              expiresAt={unfinishedAttempt.expiresAt}
              answeredCount={unfinishedAttempt.answeredCount}
              totalQuestions={unfinishedAttempt.totalQuestions}
              currentPage={unfinishedAttempt.currentPage}
              totalPages={unfinishedAttempt.totalPages}
              onResume={() => {}}
              onRestart={() => {}}
            />
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای فیلد تاریخ تولد یا تاریخ کارزار از نوع jalali-date استفاده کنید تا تقویم شمسی به وقت تهران فعال شود.',
      'در ResumeOrRestart همیشه گزینهٔ confirmRestart را فعال نگه دارید تا پاسخ‌های ذخیره‌شده به‌اشتباه پاک نشوند.',
      'وضعیت‌های کارزار (not_on_roster، already_taken، seats_full، closed، expired) را با ویژگی blocker نمایش دهید.',
    ],
    dont: [
      'فیلدهای شناسه یا کد سازمانی را در جهت RTL رها نکنید؛ با ltr: true جهت لاتین را حفظ کنید.',
      'اطلاعاتی را که پیش‌تر در فرآیند دریافت شده دوباره از کاربر نپرسید (WCAG 3.3.7).',
    ],
  },
  api: [
    {
      name: 'StartForm',
      props: [
        { name: 'title / description', type: 'ReactNode', description: 'عنوان و توضیح بالای فرم' },
        { name: 'fields', type: 'readonly DemographicField[]', description: 'آرایهٔ فیلدهای اسکیما (choice، number، text، jalali-date)' },
        { name: 'values / defaultValues / onValuesChange', type: 'StartFormValues', description: 'مقادیر فرم' },
        { name: 'onSubmit', type: '(values: StartFormValues) => void', description: 'فراخوانی پس از عبور از اعتبارسنجی' },
        { name: 'blocker', type: "'not_on_roster' | 'already_taken' | 'seats_full' | 'closed' | 'expired'", description: 'نمایش هشدار مسدودکنندهٔ کارزار و غیرفعال کردن ارسال' },
        { name: 'serverErrors / isPending', type: 'Record<string, string> / boolean', description: 'خطاهای سمت سرور و وضعیت انتظار ارسال' },
      ],
    },
    {
      name: 'ResumeOrRestart',
      props: [
        { name: 'testTitle', type: 'ReactNode', description: 'عنوان آزمون ناتمام' },
        { name: 'lastSavedAt / expiresAt', type: 'string | Date', description: 'زمان آخرین ذخیره و انقضا (قالب‌بندی شمسی تهران)' },
        { name: 'answeredCount / totalQuestions', type: 'number', description: 'تعداد پرسش‌های پاسخ‌داده‌شده از کل' },
        { name: 'onResume / onRestart', type: 'callbacks', description: 'ادامهٔ تلاش فعلی یا پاک‌سازی و شروع دوباره' },
        { name: 'confirmRestart', type: 'boolean', default: 'true', description: 'محافظت از شروع دوباره با پنجرهٔ AlertDialog' },
      ],
    },
  ],
  keyboard: [
    { keys: 'Tab / Shift+Tab', action: 'جابه‌جایی بین فیلدهای اسکیما و دکمه‌های اقدام' },
    { keys: 'Escape', action: 'بستن پنجرهٔ تأیید شروع دوباره و بازگردانی فوکوس به دکمهٔ محرک' },
  ],
  a11y: [
    'StartForm خطاهای اعتبارسنجی را هم در FormErrorSummary بالای فرم و هم زیر هر فیلد با aria-describedby مرتبط می‌کند.',
    'ResumeOrRestart از AlertDialog با role="alertdialog" برای جلوگیری از پاک‌سازی تصادفی استفاده می‌کند.',
  ],
  rtl: [
    'فیلدهای عددی ارقام لاتین و فارسی را می‌پذیرند و با ارقام فارسی نمایش می‌دهند؛ فیلدهای تاریخ از PersianCalendar و منطقهٔ زمانی تهران استفاده می‌کنند.',
    'تاریخ آخرین ذخیره و انقضا در ResumeOrRestart از طریق formatDateTime در @negaresh/utils قالب‌بندی می‌شود.',
  ],
};
