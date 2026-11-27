import { AnswerPage, AnswerProgress } from '@negaresh/assessment';
import { sampleQuestions } from '@negaresh/assessment/fixtures';
import { Button, InlineAlert, Stack } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './assessment.module.css';

const PAGES = [
  sampleQuestions.slice(0, 2),
  sampleQuestions.slice(2, 4),
  sampleQuestions.slice(4, 6),
];

function Example() {
  const [pageIdx, setPageIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const currentQuestions = PAGES[pageIdx] ?? PAGES[0]!;
  const answeredTotal = Object.keys(answers).length;

  return (
    <div className={styles.wide} data-interactive="answer-flow">
      <Stack gap="4">
        {submitted && (
          <InlineAlert
            tone="success"
            title="تمامی پاسخ‌های نمونه ثبت شد"
            actions={
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onPress={() => {
                  setAnswers({});
                  setPageIdx(0);
                  setSubmitted(false);
                }}
              >
                آغاز دوبارهٔ نمونه
              </Button>
            }
          >
            همهٔ ۳ صفحه با اعتبارسنجی کامل تکمیل شدند.
          </InlineAlert>
        )}

        <AnswerPage
          title="آزمون نمونهٔ چندصفحه‌ای"
          questions={currentQuestions}
          currentPage={pageIdx + 1}
          totalPages={PAGES.length}
          answers={answers}
          answeredCount={answeredTotal}
          totalQuestions={sampleQuestions.length}
          isDraftSaved={answeredTotal > 0}
          onAnswerChange={(id, val) => setAnswers((prev) => ({ ...prev, [id]: val }))}
          onPreviousPage={() => setPageIdx((i) => Math.max(0, i - 1))}
          onNextPage={() => setPageIdx((i) => Math.min(PAGES.length - 1, i + 1))}
          onSubmit={() => setSubmitted(true)}
        />
      </Stack>
    </div>
  );
}

export const answerFlowDoc: ComponentDoc = {
  slug: 'answer-flow',
  title: 'صفحهٔ پاسخ‌دهی و پیشرفت (AnswerPage · AnswerProgress)',
  components: ['AnswerPage', 'AnswerProgress'],
  base: 'FormErrorSummary + ProgressBar + QuestionItem',
  summary:
    'جریان پاسخ‌دهی چندصفحه‌ای با نمایش و اعلام صوتی پیشرفت («صفحهٔ n از N»)، اعتبارسنجی هر صفحه و خلاصهٔ پرسش‌های بی‌پاسخ با پرش مستقیم فوکوس.',
  status: 'approved',
  products: ['T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="پیشرفت پاسخ‌دهی (AnswerProgress)">
        <State label="Page 3 of 13 (with answered count)">
          <div className={styles.wide}>
            <AnswerProgress
              currentPage={3}
              totalPages={13}
              answeredCount={12}
              totalQuestions={40}
            />
          </div>
        </State>
        <State label="Final page (page 13 of 13)">
          <div className={styles.wide}>
            <AnswerProgress
              currentPage={13}
              totalPages={13}
              answeredCount={40}
              totalQuestions={40}
            />
          </div>
        </State>
      </GalleryRow>

      <GalleryRow title="صفحهٔ پاسخ‌دهی (AnswerPage)">
        <State label="Middle page with draft saved indicator">
          <div className={styles.wide}>
            <AnswerPage
              title="پرسشنامهٔ بهزیستی روانشناختی"
              questions={sampleQuestions.slice(0, 2)}
              currentPage={2}
              totalPages={6}
              defaultAnswers={{ 'q-tf-1': 'true', 'q-likert-5': '4' }}
              answeredCount={4}
              totalQuestions={12}
              isDraftSaved
              onPreviousPage={() => {}}
            />
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'تعداد پرسش در هر صفحه را محدود نگه دارید (معمولاً ۲ تا ۶ پرسش) تا خستگی شناختی کاهش یابد.',
      'هنگام خطای اعتبارسنجی صفحه، خلاصهٔ پرسش‌های بی‌پاسخ را بالای صفحه نمایش دهید و فوکوس را به اولین پرسش بی‌پاسخ ببرید.',
      'تغییر صفحه را با AnswerProgress و ناحیهٔ زندهٔ role="status" اعلام کنید.',
    ],
    dont: [
      'آزمون‌دهنده را بدون اعلام دقیق شمارهٔ پرسش‌های بی‌پاسخ در صفحه نگه ندارید.',
      'دکمهٔ صفحهٔ قبلی و بعدی را در موبایل کنار هم فشرده نکنید؛ در عرض کمتر از ۹۰۰ پیکسل به‌صورت تمام‌عرض چیده می‌شوند.',
    ],
  },
  keyboard: [
    { keys: 'Tab / Shift+Tab', action: 'حرکت بین خلاصهٔ خطا، پرسش‌ها و دکمه‌های ناوبری' },
    { keys: 'Enter (روی دکمهٔ ثبت/بعدی)', action: 'اعتبارسنجی صفحه و انتقال فوکوس به اولین پرسش بی‌پاسخ در صورت خطا' },
  ],
  a11y: [
    'AnswerProgress تغییر صفحه را از طریق ناحیهٔ زندهٔ polite (role="status") برای صفحه‌خوان اعلام می‌کند.',
    'FormErrorSummary لینک مستقیم به هر پرسش بی‌پاسخ دارد و فعال‌سازی لینک فوکوس را به اولین گزینهٔ رادیویی همان پرسش می‌برد.',
    'scroll-margin-block مانع پوشیده شدن پرسش فوکوس‌شده زیر نوار بالایی (WCAG 2.4.11) می‌شود.',
  ],
  rtl: [
    'عبارت «صفحهٔ n از N» و شمارش پرسش‌ها با ارقام فارسی قالب‌بندی می‌شوند.',
    'آیکون‌های arrowStart و arrowEnd به‌صورت خودکار در جهت راست‌به‌چپ آینه می‌شوند.',
  ],
};
