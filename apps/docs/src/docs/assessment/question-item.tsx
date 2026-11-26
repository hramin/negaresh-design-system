import { QuestionItem, questionDefinitionToProps } from '@negaresh/assessment';
import { sampleQuestions } from '@negaresh/assessment/fixtures';
import { SegmentedControl, SegmentedControlItem, Stack, Text } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './assessment.module.css';

type DemoKey = 'tf' | 'likert5' | 'forced' | 'image';

const DEMO_INDEX: Record<DemoKey, number> = {
  tf: 0,
  likert5: 1,
  forced: 2,
  image: 5,
};

function Example() {
  const [kind, setKind] = useState<DemoKey>('likert5');
  const [answers, setAnswers] = useState<Record<string, string>>({
    'q-likert-5': '4',
  });
  const activeQuestion = sampleQuestions[DEMO_INDEX[kind]]!;

  return (
    <div className={styles.wide} data-interactive="question-item">
      <Stack gap="4">
        <div className={styles.controls}>
          <SegmentedControl
            aria-label="نوع پرسش"
            value={kind}
            onChange={(k) => setKind(k as DemoKey)}
          >
            <SegmentedControlItem id="tf">دوگزینه‌ای</SegmentedControlItem>
            <SegmentedControlItem id="likert5">لیکرت ۵تایی</SegmentedControlItem>
            <SegmentedControlItem id="forced">انتخاب اجباری</SegmentedControlItem>
            <SegmentedControlItem id="image">گزینهٔ تصویری</SegmentedControlItem>
          </SegmentedControl>
        </div>

        <QuestionItem
          {...questionDefinitionToProps(activeQuestion)}
          id={`demo-${activeQuestion.id}`}
          value={answers[activeQuestion.id] ?? null}
          onChange={(val) => setAnswers((prev) => ({ ...prev, [activeQuestion.id]: val }))}
        />

        <Text size="xs" tone="subtle">
          مقدار انتخاب‌شده: {answers[activeQuestion.id] ?? 'هنوز انتخاب نشده'}
        </Text>
      </Stack>
    </div>
  );
}

export const questionItemDoc: ComponentDoc = {
  slug: 'question-item',
  title: 'پرسش آزمون (QuestionItem)',
  components: ['QuestionItem'],
  base: 'fieldset + legend + React Aria RadioGroup',
  summary:
    'واحد استاندارد هر پرسش آزمون با صورت پرسش در تگ legend و گزینه‌های واقعی radio؛ پشتیبانی از ۲/۴/۶ گزینه، لیکرت ۵ و ۷، انتخاب اجباری و گزینه‌های تصویری.',
  status: 'review',
  products: ['T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="دوگزینه‌ای و چهارگزینه‌ای (Standard)">
        <State label="2-option True/False (selected)">
          <div className={styles.wide}>
            <QuestionItem
              {...questionDefinitionToProps(sampleQuestions[0]!)}
              id="gal-q-tf"
              defaultValue="true"
            />
          </div>
        </State>
        <State label="4-option choice">
          <div className={styles.wide}>
            <QuestionItem
              {...questionDefinitionToProps(sampleQuestions[3]!)}
              id="gal-q-4"
              defaultValue="4-5"
            />
          </div>
        </State>
      </GalleryRow>

      <GalleryRow title="طیف لیکرت (۵ و ۷ گزینه‌ای)">
        <State label="Likert 5-point">
          <div className={styles.wide}>
            <QuestionItem
              {...questionDefinitionToProps(sampleQuestions[1]!)}
              id="gal-q-likert5"
              defaultValue="4"
            />
          </div>
        </State>
        <State label="Likert 7-point">
          <div className={styles.wide}>
            <QuestionItem
              {...questionDefinitionToProps(sampleQuestions[4]!)}
              id="gal-q-likert7"
              defaultValue="5"
            />
          </div>
        </State>
      </GalleryRow>

      <GalleryRow title="انتخاب اجباری و گزینه‌های تصویری">
        <State label="Forced choice (paired A/B)">
          <div className={styles.wide}>
            <QuestionItem
              {...questionDefinitionToProps(sampleQuestions[2]!)}
              id="gal-q-forced"
              defaultValue="a"
            />
          </div>
        </State>
        <State label="Image options (alt required)">
          <div className={styles.wide}>
            <QuestionItem
              {...questionDefinitionToProps(sampleQuestions[5]!)}
              id="gal-q-image"
              defaultValue="flowing"
            />
          </div>
        </State>
      </GalleryRow>

      <GalleryRow title="حالت‌های خطا، غیرفعال و فقط‌خواندنی">
        <State label="Invalid (unanswered error)">
          <div className={styles.wide}>
            <QuestionItem
              {...questionDefinitionToProps(sampleQuestions[0]!)}
              id="gal-q-invalid"
              isInvalid
            />
          </div>
        </State>
        <State label="Disabled">
          <div className={styles.wide}>
            <QuestionItem
              {...questionDefinitionToProps(sampleQuestions[0]!)}
              id="gal-q-disabled"
              defaultValue="false"
              isDisabled
            />
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'صورت هر پرسش را همیشه از طریق stem در legend قرار دهید تا صفحه‌خوان پیش از هر گزینه آن را بخواند.',
      'برای پرسش‌های تصویری متن جایگزین معنادار (alt) برای هر تصویر و برچسب متنی قابل مشاهده ارائه کنید.',
      'حداقل اندازهٔ لمسی ۴۴×۴۴ پیکسل هر گزینه را در موبایل و دسکتاپ حفظ کنید.',
    ],
    dont: [
      'به‌جای RadioGroup از دکمه‌های معمولی بدون نقش radio استفاده نکنید.',
      'حلقهٔ فوکوس گزینه‌ها را پنهان نکنید؛ تمرکز کیبورد باید روی خود کارت گزینه دیده شود.',
    ],
  },
  api: [
    {
      name: 'QuestionItem',
      props: [
        { name: 'id', type: 'string', description: 'شناسهٔ پایدار پرسش و fieldset برای پرش خطا' },
        { name: 'number', type: 'number', description: 'شمارهٔ یک‌مبنای پرسش (قالب‌بندی با ارقام فارسی)' },
        { name: 'stem', type: 'ReactNode', description: 'صورت پرسش در تگ legend' },
        { name: 'description', type: 'ReactNode', description: 'توضیح راهنمای اختیاری متصل به aria-describedby' },
        { name: 'options', type: 'readonly QuestionOption[]', description: 'گزینه‌های رادیویی (۲/۴/۶، لیکرت، انتخاب اجباری یا تصویر)' },
        { name: 'variant', type: "'standard' | 'likert' | 'forced-choice' | 'image'", default: "'standard'", description: 'نوع چیدمان بصری گزینه‌ها' },
        { name: 'columns', type: '1 | 2 | 3', default: '1', description: 'تعداد ستون در دسکتاپ برای حالت standard' },
        { name: 'value / defaultValue / onChange', type: 'string', description: 'مدیریت کنترل‌شده یا غیرکنترل‌شدهٔ پاسخ' },
        { name: 'isInvalid / errorMessage', type: 'boolean / ReactNode', description: 'نمایش خطای درون‌خطی با role="alert"' },
        { name: 'isDisabled / isReadOnly', type: 'boolean', default: 'false', description: 'حالت غیرفعال یا فقط‌خواندنی' },
      ],
    },
  ],
  keyboard: [
    { keys: 'Tab / Shift+Tab', action: 'ورود و خروج از گروه رادیویی پرسش' },
    { keys: 'ArrowLeft / ArrowRight', action: 'جابه‌جایی میان گزینه‌های لیکرت در جهت راست‌به‌چپ' },
    { keys: 'ArrowDown / ArrowUp', action: 'جابه‌جایی میان گزینه‌های عمودی و انتخاب فوری' },
    { keys: 'Space', action: 'انتخاب گزینهٔ دارای فوکوس' },
  ],
  a11y: [
    'هر پرسش یک fieldset + legend معنایی است که به RadioGroup با aria-labelledby متصل می‌شود (رفع یافتهٔ بررسی #۱).',
    'گزینه‌ها ورودی واقعی <input type="radio"> هستند و بدون جاوااسکریپت نیز کار می‌کنند.',
    'فوکوس کیبورد با حلقهٔ ۲ پیکسلی (--nds-focus-ring) روی خود چیپ گزینه نمایش داده می‌شود و با forced-colors سازگار است.',
  ],
  rtl: [
    'شمارهٔ پرسش و گام‌های لیکرت با ارقام فارسی نمایش داده می‌شوند.',
    'جهت کلیدهای پیکان و چیدمان ستون‌ها با ویژگی‌های منطقی CSS در RTL تنظیم شده است.',
  ],
};
