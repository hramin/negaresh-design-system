import type { AssessmentMessages } from './types.ts';

/** Default Persian (fa-IR) message catalogue for `@negaresh/assessment`. */
export const faAssessmentMessages: AssessmentMessages = {
  questionNumber: (n) => `پرسش ${n}`,
  requiredLabel: 'الزامی',
  unansweredError: 'لطفاً یکی از گزینه‌ها را انتخاب کنید.',
  unansweredSummaryTitle: (count) => `${count} پرسش در این صفحه بدون پاسخ مانده است`,
  unansweredSummaryItem: (questionNumber, stemPreview) =>
    `پرسش ${questionNumber}: ${stemPreview}`,
  pageProgress: (current, total) => `صفحهٔ ${current} از ${total}`,
  pageProgressAnnouncement: (current, total, answered, totalQuestions) =>
    answered && totalQuestions
      ? `صفحهٔ ${current} از ${total}؛ ${answered} از ${totalQuestions} پرسش پاسخ داده شده است.`
      : `صفحهٔ ${current} از ${total}`,
  answeredCount: (answered, total) => `${answered} از ${total} پرسش پاسخ داده شده`,
  previousPage: 'صفحهٔ قبلی',
  nextPage: 'صفحهٔ بعدی',
  submitAnswers: 'ثبت نهایی پاسخ‌ها',
  submittingAnswers: 'در حال ثبت پاسخ‌ها…',
  draftSaved: 'پاسخ‌ها ذخیره شد',

  startFormSubmit: 'شروع آزمون',
  startFormErrorSummaryTitle: 'لطفاً پیش از شروع، موارد زیر را تکمیل یا اصلاح کنید',
  fieldRequiredError: (label) => `وارد کردن «${label}» الزامی است.`,
  fieldRangeError: (label, min, max) => {
    if (min !== undefined && max !== undefined) {
      return `مقدار «${label}» باید بین ${min} تا ${max} باشد.`;
    }
    if (min !== undefined) return `مقدار «${label}» نباید کمتر از ${min} باشد.`;
    if (max !== undefined) return `مقدار «${label}» نباید بیشتر از ${max} باشد.`;
    return `مقدار «${label}» معتبر نیست.`;
  },
  campaignBlockers: {
    not_on_roster: {
      title: 'اطلاعات شما در فهرست این دوره یافت نشد',
      body: 'شناسهٔ واردشده با فهرست مجاز این آزمون همخوانی ندارد. در صورت نیاز با هماهنگ‌کنندهٔ سازمان تماس بگیرید.',
    },
    already_taken: {
      title: 'پاسخ‌های شما پیش‌تر ثبت شده است',
      body: 'امکان شرکت دوباره در این آزمون با این شناسه وجود ندارد.',
    },
    seats_full: {
      title: 'ظرفیت این آزمون تکمیل شده است',
      body: 'تمام سهمیه‌های تعریف‌شده برای این پیوند استفاده شده است. برای افزایش ظرفیت با مسئول دوره هماهنگ کنید.',
    },
    closed: {
      title: 'این آزمون بسته شده است',
      body: 'پاسخ‌دهی به این دوره توسط برگزارکننده متوقف شده است.',
    },
    expired: {
      title: 'مهلت شرکت در این آزمون به پایان رسیده است',
      body: 'زمان مجاز این پیوند منقضی شده و امکان ثبت پاسخ تازه وجود ندارد.',
    },
  },

  resumeTitle: 'یک آزمون ناتمام دارید',
  resumeDescription:
    'پاسخ‌های پیشین شما ذخیره شده است. می‌توانید از ادامهٔ همان تلاش پیش بروید یا آزمون را از ابتدا شروع کنید.',
  resumeLastSavedLabel: 'آخرین ذخیره',
  resumeProgressLabel: 'پیشرفت ثبت‌شده',
  resumeExpiresLabel: 'مهلت تکمیل',
  resumeAction: 'ادامهٔ آزمون',
  restartAction: 'شروع دوباره',
  restartConfirmTitle: 'آزمون از ابتدا شروع شود؟',
  restartConfirmBody:
    'با شروع دوباره، تمام پاسخ‌های ذخیره‌شدهٔ این تلاش پاک می‌شود و قابل بازگردانی نیست.',
  restartConfirmAction: 'پاک کردن و شروع دوباره',
  restartCancelAction: 'انصراف',

  modeBadge: {
    professional: 'نمای حرفه‌ای (بالینی)',
    calm: 'نمای آرام',
  },
  resultKindLabel: {
    profile: 'نیمرخ مقیاس‌ها',
    type: 'تیپ و الگو',
    index: 'شاخص کلی',
    themes: 'محورهای اصلی',
  },
  severityProfessional: {
    ok: 'در بازهٔ هنجار',
    caution: 'نیازمند توجه',
    severe: 'بالاتر از آستانهٔ بالینی',
  },
  severityCalm: {
    ok: 'در بازهٔ معمول',
    caution: 'کمی متفاوت از معمول',
    severe: 'قابل توجه؛ گفت‌وگو با متخصص پیشنهاد می‌شود',
  },
  completedAtLabel: 'تاریخ تکمیل',
  attemptCodeLabel: 'شناسهٔ تلاش',
  takerLabel: 'آزمون‌دهنده',
  validityLabel: 'شاخص روایی پاسخ‌دهی',
  calmValidityLabel: 'یادداشت راهنما',
  calmSupportNote:
    'این نتیجه برای شناخت بهتر و گفت‌وگوی سازنده طراحی شده است و جایگزین ارزیابی تخصصی نیست.',

  scoreTableCaption: 'جدول نمرات مقیاس‌ها',
  scoreColumnScale: 'مقیاس',
  scoreColumnCode: 'کد',
  scoreColumnRaw: 'نمرهٔ خام',
  scoreColumnValue: 'نمره',
  scoreColumnInterval: 'بازهٔ اطمینان',
  scoreColumnBand: 'وضعیت',
  scoreRangeBetween: (low, high) => `${low} تا ${high}`,
  scoreMissing: '—',

  interpretationHeading: 'تفسیر نتایج',
  interpretationRecommendations: 'پیشنهادهای بالینی و پیگیری',
  interpretationCalmRecommendations: 'گام‌های پیشنهادی',
  interpretationEmpty: 'تفسیر متنی برای این بخش ثبت نشده است.',

  reportStatusTitle: 'وضعیت گزارش چاپی (PDF)',
  reportDescriptions: {
    none: 'گزارش PDF این آزمون هنوز ساخته نشده است.',
    pending: 'گزارش PDF در حال آماده‌سازی است. لطفاً چند لحظه صبر کنید.',
    ready: 'گزارش A4 آمادهٔ دریافت و چاپ است.',
    failed: 'در ساخت گزارش PDF خطایی رخ داد. می‌توانید دوباره تلاش کنید.',
    purged: 'بیش از ۱۸۰ روز از تولید گزارش گذشته و فایل آن طبق سیاست نگهداری حذف شده است.',
  },
  reportGeneratedAtLabel: 'زمان تولید گزارش',
  reportRetentionLabel: 'مهلت نگهداری فایل',
  reportGenerateAction: 'ساخت گزارش PDF',
  reportDownloadAction: 'دریافت گزارش PDF',
  reportPrintAction: 'چاپ گزارش (A4)',
  reportRetryAction: 'تلاش دوباره',

  printReportLabel: 'گزارش نتیجهٔ آزمون',
  printIssuedAtLabel: 'تاریخ صدور',
  printReferenceIdLabel: 'شناسهٔ گزارش',
  printAudienceLabel: 'حالت گزارش',
  printConfidentialNote:
    'این گزارش محرمانه است و صرفاً برای استفادهٔ مجاز و بررسی تخصصی صادر شده است.',

  submittedDefaultTitle: 'پاسخ‌های شما با موفقیت ثبت شد',
  submittedDefaultBody: 'از همراهی و وقتی که برای پاسخ‌دهی گذاشتید سپاسگزاریم.',
  submittedCanCloseNote: 'نیاز به اقدام دیگری نیست؛ می‌توانید این صفحه را ببندید.',
  submittedAtLabel: 'زمان ثبت',
  submittedTrackingCodeLabel: 'کد پیگیری',
};
