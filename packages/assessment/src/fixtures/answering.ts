import type { DemographicField, QuestionDefinition } from '../types.ts';

/**
 * Deterministic inline-SVG data URIs used for image-option questions so tests,
 * SSR, and offline CI environments never depend on external network hosts.
 */
const svgDataUri = (svg: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

export const OPTION_IMAGE_SUN = svgDataUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80"><rect width="120" height="80" rx="8" fill="#F2EFE8"/><circle cx="60" cy="40" r="18" fill="#1D6B66"/><g stroke="#1D6B66" stroke-width="3" stroke-linecap="round"><line x1="60" y1="12" x2="60" y2="18"/><line x1="60" y1="62" x2="60" y2="68"/><line x1="32" y1="40" x2="38" y2="40"/><line x1="82" y1="40" x2="88" y2="40"/></g></svg>',
);

export const OPTION_IMAGE_WAVE = svgDataUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80"><rect width="120" height="80" rx="8" fill="#F2EFE8"/><path d="M16 48 Q38 24 60 48 T104 48" fill="none" stroke="#1D6B66" stroke-width="4" stroke-linecap="round"/><path d="M16 60 Q38 36 60 60 T104 60" fill="none" stroke="#536878" stroke-width="3" stroke-linecap="round"/></svg>',
);

export const OPTION_IMAGE_GRID = svgDataUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80"><rect width="120" height="80" rx="8" fill="#F2EFE8"/><rect x="26" y="18" width="28" height="18" rx="4" fill="#1D6B66"/><rect x="66" y="18" width="28" height="18" rx="4" fill="#B57B27"/><rect x="26" y="44" width="68" height="18" rx="4" fill="#536878"/></svg>',
);

/**
 * Sample Persian questions exercising every `QuestionItem` layout:
 * 2-option True/False, 4-option choice, 5-point Likert, 7-point Likert,
 * forced choice, and image options.
 */
export const sampleQuestions: readonly QuestionDefinition[] = [
  {
    id: 'q-tf-1',
    number: 1,
    stem: 'در دو هفتهٔ گذشته معمولاً صبح‌ها با احساس آمادگی و انرژی کافی بیدار شده‌ام.',
    description: 'نزدیک‌ترین گزینه به تجربهٔ غالب خود در ۱۴ روز اخیر را انتخاب کنید.',
    variant: 'standard',
    columns: 2,
    options: [
      { value: 'true', label: 'درست' },
      { value: 'false', label: 'نادرست' },
    ],
  },
  {
    id: 'q-likert-5',
    number: 2,
    stem: 'هنگام روبه‌رو شدن با فشار درسی یا کاری، می‌توانم تمرکز خود را حفظ کنم.',
    variant: 'likert',
    likertStartLabel: 'کاملاً مخالفم',
    likertEndLabel: 'کاملاً موافقم',
    options: [
      { value: '1', stepLabel: '۱', label: 'کاملاً مخالفم' },
      { value: '2', stepLabel: '۲', label: 'مخالفم' },
      { value: '3', stepLabel: '۳', label: 'نظری ندارم' },
      { value: '4', stepLabel: '۴', label: 'موافقم' },
      { value: '5', stepLabel: '۵', label: 'کاملاً موافقم' },
    ],
  },
  {
    id: 'q-forced-1',
    number: 3,
    stem: 'در کارهای گروهی کدام سبک به شما نزدیک‌تر است؟',
    description: 'حتی اگر هر دو گزینه تا حدی درست هستند، گزینه‌ای را برگزینید که بیشتر توصیف‌کنندهٔ شماست.',
    variant: 'forced-choice',
    options: [
      {
        value: 'a',
        label: 'برنامه‌ریزی دقیق پیش از شروع',
        description: 'ترجیح می‌دهم گام‌ها و زمان‌بندی از ابتدا مشخص باشد.',
      },
      {
        value: 'b',
        label: 'انعطاف‌پذیری در طول مسیر',
        description: 'ترجیح می‌دهم در جریان کار ایده‌های تازه را امتحان کنم.',
      },
    ],
  },
  {
    id: 'q-choice-4',
    number: 4,
    stem: 'در طول یک هفته چند شب خواب منظم و بدون بیدار شدن مکرر داشته‌اید؟',
    variant: 'standard',
    columns: 2,
    options: [
      { value: '0-1', label: 'کمتر از ۲ شب' },
      { value: '2-3', label: '۲ تا ۳ شب' },
      { value: '4-5', label: '۴ تا ۵ شب' },
      { value: '6-7', label: '۶ تا ۷ شب' },
    ],
  },
  {
    id: 'q-likert-7',
    number: 5,
    stem: 'در مجموع از کیفیت ارتباط با دوستان و نزدیکان خود رضایت دارم.',
    variant: 'likert',
    likertStartLabel: 'بسیار کم',
    likertEndLabel: 'بسیار زیاد',
    options: [
      { value: '1', stepLabel: '۱', label: 'بسیار کم' },
      { value: '2', stepLabel: '۲', label: 'کم' },
      { value: '3', stepLabel: '۳', label: 'تا حدی کم' },
      { value: '4', stepLabel: '۴', label: 'متوسط' },
      { value: '5', stepLabel: '۵', label: 'تا حدی زیاد' },
      { value: '6', stepLabel: '۶', label: 'زیاد' },
      { value: '7', stepLabel: '۷', label: 'بسیار زیاد' },
    ],
  },
  {
    id: 'q-image-1',
    number: 6,
    stem: 'کدام الگوی بصری به حالت ذهنی امروز شما نزدیک‌تر است؟',
    variant: 'image',
    options: [
      {
        value: 'clear',
        label: 'روشن و متمرکز',
        image: { src: OPTION_IMAGE_SUN, alt: 'نماد خورشید ساده با پرتوهای منظم' },
      },
      {
        value: 'flowing',
        label: 'آرام و در جریان',
        image: { src: OPTION_IMAGE_WAVE, alt: 'دو خط موجی آرام به رنگ آبی-سبز' },
      },
      {
        value: 'structured',
        label: 'منظم و دسته‌بندی‌شده',
        image: { src: OPTION_IMAGE_GRID, alt: 'چیدمان سه بلوک منظم در قاب مستطیلی' },
      },
    ],
  },
];

/** Schema-driven demographics fixture exercising all 4 `StartForm` field types. */
export const startFormSchema: readonly DemographicField[] = [
  {
    name: 'participantCode',
    type: 'text',
    label: 'شناسهٔ شرکت‌کننده (کد مدرسه یا سازمان)',
    description: 'کد اختصاصی خود را با حروف و ارقام انگلیسی وارد کنید.',
    placeholder: 'SCH-1405-042',
    ltr: true,
    isRequired: true,
  },
  {
    name: 'educationLevel',
    type: 'choice',
    label: 'مقطع یا سطح تحصیلی',
    presentation: 'select',
    placeholder: 'یک گزینه انتخاب کنید',
    isRequired: true,
    options: [
      { value: 'middle', label: 'متوسطهٔ اول' },
      { value: 'high', label: 'متوسطهٔ دوم' },
      { value: 'bachelor', label: 'کارشناسی' },
      { value: 'master', label: 'کارشناسی ارشد و بالاتر' },
    ],
  },
  {
    name: 'age',
    type: 'number',
    label: 'سن (سال)',
    description: 'برای انتخاب جدول هنجار مناسب استفاده می‌شود.',
    minValue: 12,
    maxValue: 99,
    isRequired: true,
  },
  {
    name: 'birthDate',
    type: 'jalali-date',
    label: 'تاریخ تولد (شمسی)',
    description: 'تقویم شمسی به وقت تهران (اختیاری)',
    minValue: '1930-03-21',
    maxValue: '2016-03-20',
    isRequired: false,
  },
  {
    name: 'audiencePreference',
    type: 'choice',
    label: 'حالت دریافت خلاصهٔ نتیجه',
    presentation: 'radio',
    isRequired: true,
    options: [
      {
        value: 'calm',
        label: 'نمای آرام (زبان ساده و راهنما)',
        description: 'مناسب دانش‌آموز، والدین و مطالعهٔ فردی',
      },
      {
        value: 'professional',
        label: 'نمای حرفه‌ای (بالینی با نمرات T)',
        description: 'مناسب مشاور و روان‌شناس',
      },
    ],
  },
];

/** Sample unfinished-attempt metadata for `ResumeOrRestart`. */
export const unfinishedAttempt = {
  testTitle: 'پرسشنامهٔ نیمرخ شخصیت نوجوانان (MMPI-Teen-13)',
  lastSavedAt: '2026-11-24T15:20:00.000Z',
  expiresAt: '2026-11-30T20:29:00.000Z',
  answeredCount: 24,
  totalQuestions: 60,
  currentPage: 5,
  totalPages: 12,
} as const;
