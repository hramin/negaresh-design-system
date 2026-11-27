import {
  iconBell,
  iconBook,
  iconCard,
  iconFile,
  iconHome,
  iconKey,
  iconSettings,
  iconShield,
} from '@negaresh/icons';
import type {
  BreadcrumbItemData,
  KeyValueEntry,
  SideNavGroupData,
  StatTileProps,
  TimelineEntry,
  UserMenuProps,
} from '@negaresh/react';
import { maskPhone } from '@negaresh/utils';
import type {
  CartLineItem,
  OrderLineItem,
  PaymentGatewayOption,
  ProductCardItem,
  ProductEdition,
  ProductFaqItem,
  ProductGalleryItem,
  ShippingMethodOption,
} from '../commerce/index.ts';
import type {
  ArticleAuthor,
  ContentBlock,
  ContentCardItem,
  ExpertSummary,
  FeaturedSlide,
  FeedAuthor,
  PollOption,
  ReviewQueueItem,
  WriterDocument,
} from '../content/index.ts';
import type { CourseChapter, CourseInstructor, EnrolledCourseItem } from '../courses/index.ts';
import type {
  ActivationRecord,
  AlertChannelConfig,
  AuditLogEntry,
  SerialProductOption,
} from '../licensing/index.ts';
import type { NotificationTemplate, VerifiedMobileItem } from '../shells/index.ts';
import type {
  B2BClientItem,
  CampaignParticipant,
  DashboardReportItem,
  TestCatalogItem,
  WalletLedgerEntry,
} from '../test-platform/index.ts';

function svgPlaceholder(label: string, tone: 'teal' | 'sand' | 'slate' = 'teal'): string {
  const palette =
    tone === 'teal'
      ? { bg: '#E6F1F0', fg: '#1D6B66', accent: '#B8DAD7' }
      : tone === 'slate'
        ? { bg: '#E8EDF2', fg: '#2C4257', accent: '#C6D3E0' }
        : { bg: '#F2EEE7', fg: '#4B433B', accent: '#DDD5C8' };
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="640" height="360"><rect width="640" height="360" fill="${palette.bg}"/><rect x="32" y="32" width="576" height="296" rx="16" fill="none" stroke="${palette.accent}" stroke-width="2"/><circle cx="104" cy="112" r="32" fill="${palette.accent}"/><rect x="160" y="92" width="260" height="16" rx="8" fill="${palette.accent}"/><rect x="160" y="122" width="180" height="12" rx="6" fill="${palette.accent}"/><text x="320" y="248" text-anchor="middle" font-family="sans-serif" font-size="22" fill="${palette.fg}">${label}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const PATTERNS_FIXTURES_VERSION = '1.0.0' as const;

export const sampleMedia = {
  softwareMain: svgPlaceholder('نرم‌افزار روان‌سنجی نگرش ۴', 'teal'),
  softwareReport: svgPlaceholder('پیش‌نمایش گزارش نیمرخ بالینی', 'slate'),
  softwareClinic: svgPlaceholder('نسخهٔ کلینیک چندکاربره', 'sand'),
  articleCover: svgPlaceholder('پژوهش روان‌سنجی نوجوانان', 'teal'),
  postCover: svgPlaceholder('یادداشت تخصصی مصاحبه بالینی', 'sand'),
  courseCover: svgPlaceholder('کارگاه جامع تفسیر MMPI-2', 'slate'),
} as const;

/* ── Commerce Fixtures ───────────────────────────────────────────────────────────────── */
export const sampleProducts: readonly ProductCardItem[] = [
  {
    id: 'prod-negaresh-suite',
    title: 'مجموعه نرم‌افزار روان‌سنجی نگرش ۴',
    summary: 'اجرا، نمره‌گذاری دقیق و تولید گزارش چاپی بیش از ۴۵ آزمون استاندارد بالینی و شغلی.',
    category: 'نرم‌افزار تخصصی',
    imageSrc: sampleMedia.softwareMain,
    imageAlt: 'نمایی از صفحهٔ اصلی نرم‌افزار روان‌سنجی نگرش ۴',
    editionCount: 3,
    price: 4_850_000,
    originalPrice: 5_900_000,
    href: '#product-negaresh-4',
    isWishlisted: true,
  },
  {
    id: 'prod-mmpi-interpreter',
    title: 'ماژول تفسیر تخصصی MMPI-2 و MMPI-A',
    summary: 'تفسیر خودکار مقیاس‌های روایی و بالینی به همراه گزارش آرام ویژهٔ والدین و نوجوان.',
    category: 'افزونهٔ بالینی',
    imageSrc: sampleMedia.softwareReport,
    imageAlt: 'پیش‌نمایش گزارش نیمرخ MMPI-2 در نرم‌افزار نگرش',
    editionCount: 2,
    price: 2_400_000,
    href: '#product-mmpi',
    isWishlisted: false,
  },
  {
    id: 'prod-manual-pdf',
    title: 'راهنمای کاربردی هنجاریابی آزمون‌های نگرش',
    summary: 'دفترچهٔ الکترونیکی راهنمای تفسیر نمره‌های T و بازه‌های اطمینان برای متخصصان.',
    category: 'کتابچهٔ رایگان',
    imageSrc: sampleMedia.softwareClinic,
    imageAlt: 'جلد دفترچهٔ راهنمای هنجاریابی آزمون‌های نگرش',
    editionCount: 1,
    price: 0,
    href: '#product-manual',
  },
];

export const sampleProductGallery: readonly ProductGalleryItem[] = [
  { id: 'g1', src: sampleMedia.softwareMain, alt: 'نمای اصلی مجموعه نرم‌افزار روان‌سنجی نگرش ۴' },
  { id: 'g2', src: sampleMedia.softwareReport, alt: 'گزارش نیمرخ بالینی در نرم‌افزار نگرش ۴' },
  { id: 'g3', src: sampleMedia.softwareClinic, alt: 'مدیریت پروندهٔ مراجعان در نسخهٔ کلینیک' },
];

export const sampleProductEditions: readonly ProductEdition[] = [
  {
    id: 'ed-single',
    title: 'ویرایش تک‌کاربره (۱ رایانه)',
    description: 'مناسب مطب شخصی؛ شامل ۱ سهمیه فعال‌سازی و به‌روزرسانی یک‌ساله.',
    price: 4_850_000,
    originalPrice: 5_900_000,
    badge: 'پرفروش',
  },
  {
    id: 'ed-clinic',
    title: 'ویرایش کلینیک (۵ رایانه)',
    description: 'قابل نصب روی ۵ ایستگاه کاری با پایگاه دادهٔ مشترک و پشتیبانی تلفنی.',
    price: 11_500_000,
  },
  {
    id: 'ed-org',
    title: 'ویرایش سازمانی (نامحدود شبکهٔ داخلی)',
    description: 'ویژهٔ مراکز مشاورهٔ دانشگاهی و سازمان‌ها با خروجی اکسل و API.',
    price: 24_000_000,
  },
];

export const sampleProductRequirements: readonly KeyValueEntry[] = [
  { id: 'os', label: 'سیستم‌عامل', value: 'Windows 10 / 11 (64-bit)', ltr: true },
  { id: 'ram', label: 'حافظهٔ رم پیشنهادی', value: '۸ گیگابایت یا بیشتر' },
  { id: 'disk', label: 'فضای دیسک', value: '۲ گیگابایت فضای آزاد' },
  { id: 'activation', label: 'فعال‌سازی', value: 'آنلاین از طریق سامانهٔ رجیستری نگرش' },
];

export const sampleProductFaqs: readonly ProductFaqItem[] = [
  {
    id: 'faq-1',
    question: 'در صورت تعویض ویندوز آیا سهمیهٔ فعال‌سازی کسر می‌شود؟',
    answer:
      'خیر. اگر کد سیستم رایانه تغییر نکرده باشد، سامانه همان کد فعال‌سازی قبلی را بدون کسر سهمیه نمایش می‌دهد.',
  },
  {
    id: 'faq-2',
    question: 'آیا امکان ارتقا از ویرایش تک‌کاربره به کلینیک وجود دارد؟',
    answer: 'بله، در هر زمان با پرداخت مابه‌التفاوت قیمت می‌توانید ویرایش مجوز را ارتقا دهید.',
  },
];

export const sampleCartItems: readonly CartLineItem[] = [
  {
    id: 'line-1',
    title: 'مجموعه نرم‌افزار روان‌سنجی نگرش ۴',
    edition: 'ویرایش تک‌کاربره (۱ رایانه)',
    imageSrc: sampleMedia.softwareMain,
    imageAlt: 'نرم‌افزار روان‌سنجی نگرش ۴',
    unitPrice: 4_850_000,
    quantity: 1,
    maxQuantity: 5,
  },
  {
    id: 'line-2',
    title: 'ماژول تفسیر تخصصی MMPI-2',
    edition: 'افزونهٔ بالینی',
    imageSrc: sampleMedia.softwareReport,
    imageAlt: 'ماژول MMPI-2',
    unitPrice: 2_400_000,
    quantity: 1,
    maxQuantity: 5,
  },
];

export const sampleGateways: readonly PaymentGatewayOption[] = [
  {
    id: 'behpardakht',
    name: 'درگاه اینترنتی به‌‌پرداخت ملت',
    description: 'پرداخت با کلیهٔ کارت‌های عضو شتاب (پیشنهادی)',
    badge: 'پایدار',
  },
  {
    id: 'zarinpal',
    name: 'درگاه پرداخت زرین‌پال',
    description: 'پرداخت سریع با پشتیبانی از کیف پول و کارت‌های شتاب',
  },
  {
    id: 'sadad',
    name: 'درگاه پرداخت سداد (بانک ملی)',
    description: 'درگاه پشتیبان برای پرداخت‌های سازمانی',
  },
];

export const sampleShippingMethods: readonly ShippingMethodOption[] = [
  {
    id: 'digital',
    title: 'تحویل آنی دیجیتال (صدور خودکار سریال)',
    description: 'بلافاصله پس از پرداخت در حساب کاربری و پیامک ثبت می‌شود.',
    price: 0,
  },
  {
    id: 'post-pishtaz',
    title: 'ارسال پستی پیشتاز (بستهٔ فیزیکی و دفترچه)',
    description: 'تحویل طی ۲ تا ۴ روز کاری در سراسر کشور',
    price: 85_000,
  },
];

export const sampleOrderItems: readonly OrderLineItem[] = [
  { id: 'oi-1', title: 'مجموعه نرم‌افزار روان‌سنجی نگرش ۴ — تک‌کاربره', quantity: 1, unitPrice: 4_850_000 },
  { id: 'oi-2', title: 'ماژول تفسیر تخصصی MMPI-2', quantity: 1, unitPrice: 2_400_000 },
];

export const sampleOrderTimeline: readonly TimelineEntry[] = [
  {
    id: 'ord-1',
    title: 'ثبت سفارش و ایجاد پیش‌فاکتور',
    timestamp: '2026-11-20T08:15:00Z',
    tone: 'neutral',
  },
  {
    id: 'ord-2',
    title: 'پرداخت موفق از درگاه به‌‌پرداخت ملت',
    description: 'کد پیگیری بانکی تأیید و سریال‌ها صادر شد.',
    timestamp: '2026-11-20T08:18:00Z',
    tone: 'success',
  },
  {
    id: 'ord-3',
    title: 'تکمیل سفارش و ارسال سریال با پیامک',
    timestamp: '2026-11-20T08:19:00Z',
    tone: 'accent',
  },
];

export const sampleInvoiceSeller: readonly KeyValueEntry[] = [
  { id: 's-name', label: 'نام شرکت', value: 'مؤسسهٔ روان‌سنجی و نرم‌افزار نگرش' },
  { id: 's-id', label: 'شناسهٔ ملی', value: '14008291450', code: true },
  { id: 's-city', label: 'نشانی', value: 'تهران، خیابان کارگر شمالی، پلاک ۱۴۲' },
];

export const sampleInvoiceBuyer: readonly KeyValueEntry[] = [
  { id: 'b-name', label: 'نام خریدار', value: 'کلینیک مشاورهٔ آرامش سپهر' },
  { id: 'b-phone', label: 'تلفن همراه', value: maskPhone('+989123456789') ?? '+98912***6789', ltr: true },
  { id: 'b-city', label: 'شهر', value: 'اصفهان' },
];

/* ── Licensing Fixtures ──────────────────────────────────────────────────────────────── */
export const sampleActivations: readonly ActivationRecord[] = [
  {
    id: 'act-1',
    serial: 'N25AG-EMV0K',
    productName: 'نرم‌افزار روان‌سنجی نگرش ۴',
    systemCode: 'SYS-94FA-21BC-08E1',
    activationCode: 'ACT-7K9P-3M2Q-8V4X',
    activatedAt: '2026-11-18T11:30:00Z',
    resendCooldownSeconds: 0,
  },
  {
    id: 'act-2',
    serial: 'N25MM-94Q2L',
    productName: 'ماژول تفسیر تخصصی MMPI-2',
    systemCode: 'SYS-62DE-10AC-44F0',
    activationCode: 'ACT-4R8T-9W1N-2C6Z',
    activatedAt: '2026-11-22T14:45:00Z',
    resendCooldownSeconds: 42,
  },
];

export const sampleLimitHistory: readonly TimelineEntry[] = [
  {
    id: 'lh-1',
    title: 'اعمال سقف اختصاصی سریال: ۳ فعال‌سازی',
    description: 'دلیل: تعویض مادربرد رایانهٔ پذیرش کلینیک (تأیید پشتیبانی).',
    actor: 'مهدی نادری',
    timestamp: '2026-11-19T09:10:00Z',
    tone: 'accent',
  },
  {
    id: 'lh-2',
    title: 'ایجاد سریال با سقف پیش‌فرض محصول: ۲ فعال‌سازی',
    actor: 'سامانهٔ خودکار صدور',
    timestamp: '2026-11-01T07:00:00Z',
    tone: 'neutral',
  },
];

export const sampleSerialProducts: readonly SerialProductOption[] = [
  { id: 'ng4', name: 'نرم‌افزار روان‌سنجی نگرش ۴', defaultPrefix: 'N25NG' },
  { id: 'mmpi', name: 'ماژول تفسیر تخصصی MMPI-2', defaultPrefix: 'N25MM' },
  { id: 'neo', name: 'آزمون شخصیت NEO-PI-R', defaultPrefix: 'N25NE' },
];

export const sampleAlertChannels: readonly AlertChannelConfig[] = [
  { id: 'sms', enabled: true, endpoint: 'kavenegar-pattern-ops' },
  { id: 'email', enabled: true, endpoint: 'ops-alerts@negaresh.ir' },
  { id: 'telegram', enabled: true, endpoint: 'https://relay.negaresh.internal/tg/alerts' },
  { id: 'bale', enabled: false, endpoint: '@negaresh_ops_bot' },
];

export const sampleAuditEntries: readonly AuditLogEntry[] = [
  {
    id: 'aud-1',
    actor: 'مهدی نادری',
    action: 'تغییر سقف فعال‌سازی',
    target: 'N25AG-EMV0K',
    timestamp: '2026-11-24T10:12:00Z',
    ip: '185.110.24.18',
    before: 'effective_limit: 2\nsource: product',
    after: 'effective_limit: 3\nsource: serial\nreason: تعویض مادربرد',
  },
  {
    id: 'aud-2',
    actor: 'نگار حسینی',
    action: 'صدور دستهٔ سریال (۱۰ عدد)',
    target: 'BATCH-1405-08',
    timestamp: '2026-11-23T15:40:00Z',
    ip: '185.110.24.19',
  },
  {
    id: 'aud-3',
    actor: 'سامانهٔ رجیستری',
    action: 'فعال‌سازی مجدد روی همان رایانه',
    target: 'N25MM-94Q2L',
    timestamp: '2026-11-22T14:45:00Z',
    ip: '5.120.88.41',
  },
];

/* ── Content / Magazine Fixtures ─────────────────────────────────────────────────────── */
export const samplePollOptions: readonly PollOption[] = [
  { id: 'p1', label: 'ارسال نسخهٔ آرام برای والدین پس از جلسهٔ بازخورد', votes: 68 },
  { id: 'p2', label: 'ارائهٔ شفاهی بدون گزارش چاپی', votes: 21 },
  { id: 'p3', label: 'ارسال گزارش کامل بالینی به خانواده', votes: 11 },
];

export const sampleFeaturedSlides: readonly FeaturedSlide[] = [
  {
    id: 'sl-1',
    title: 'چگونه نتایج آزمون‌های نوجوانان را با زبان آرام و غیرنگران‌کننده گزارش کنیم؟',
    summary:
      'مرور یافته‌های بالینی دربارهٔ تفاوت گزارش حرفه‌ای متخصص و نسخهٔ آرام ویژهٔ والدین و نوجوان.',
    category: 'روان‌سنجی بالینی',
    imageSrc: sampleMedia.articleCover,
    imageAlt: 'تصویر شاخص گزارش آرام آزمون‌های نوجوانان',
    href: '#article-calm-results',
  },
  {
    id: 'sl-2',
    title: 'اشتباهات رایج در تفسیر نمرهٔ خام بدون توجه به بازهٔ اطمینان',
    summary: 'چرا نمایش بازهٔ اطمینان در کنار نقطهٔ برآورد مانع از برچسب‌زنی زودهنگام می‌شود.',
    category: 'روش‌شناسی آزمون',
    imageSrc: sampleMedia.softwareReport,
    imageAlt: 'نمودار بازهٔ اطمینان در گزارش روان‌سنجی',
    href: '#article-ci',
  },
];

export const sampleAuthors: readonly FeedAuthor[] = [
  { id: 'au-1', name: 'دکتر سارا احمدی', isVerified: true },
  { id: 'au-2', name: 'دکتر محمدرضا کریمی', isVerified: true },
  { id: 'au-3', name: 'الهام شریفی', isVerified: false },
];

export const sampleContentCards: readonly ContentCardItem[] = [
  {
    id: 'cc-1',
    variant: 'article',
    title: 'تفاوت گزارش حرفه‌ای و نسخهٔ آرام در آزمون‌های نوجوانان',
    summary:
      'در این مقاله اصول نگارش بازخورد غیربرچسب‌زننده و پرهیز از رنگ‌های هشداردهنده را مرور می‌کنیم.',
    category: 'روان‌سنجی بالینی',
    authorName: 'دکتر سارا احمدی',
    publishedAt: '2026-11-15T09:00:00Z',
    readingMinutes: 7,
    imageSrc: sampleMedia.articleCover,
    imageAlt: 'تصویر مقالهٔ گزارش آرام نوجوانان',
    href: '#article-1',
  },
  {
    id: 'cc-2',
    variant: 'post',
    title: 'چک‌لیست آماده‌سازی محیط آرام پیش از اجرای آزمون آنلاین',
    excerpt:
      'نور ملایم، زمان کافی و توضیح شفاف دربارهٔ محرمانگی پاسخ‌ها، روایی پاسخ‌دهی را به‌طور محسوسی افزایش می‌دهد.',
    category: 'راهنمای اجرا',
    authorName: 'الهام شریفی',
    publishedAt: '2026-11-19T12:00:00Z',
    imageSrc: sampleMedia.postCover,
    imageAlt: 'یادداشت آماده‌سازی محیط آزمون',
  },
  {
    id: 'cc-3',
    variant: 'quote',
    quote:
      'آزمون روان‌شناختی نقطهٔ آغاز گفت‌وگوی بالینی است، نه حکمی قطعی دربارهٔ هویت مراجع.',
    source: 'دکتر محمدرضا کریمی · فصلنامهٔ سنجش و مشاوره، ۱۴۰۵',
    category: 'اخلاق حرفه‌ای',
    authorName: 'دکتر محمدرضا کریمی',
  },
  {
    id: 'cc-4',
    variant: 'poll',
    category: 'تجربهٔ بالینی',
    authorName: 'دکتر سارا احمدی',
    poll: {
      question: 'در ارائهٔ نتیجهٔ آزمون نوجوانان کدام شیوه را ترجیح می‌دهید؟',
      options: samplePollOptions,
      mode: 'single',
      status: 'open',
      expertNote:
        'پژوهش‌های جدید نشان می‌دهد ارائهٔ نسخهٔ آرام پس از گفت‌وگوی توضیحی، اضطراب خانواده را کاهش و همکاری درمانی را افزایش می‌دهد.',
    },
  },
];

export const sampleArticleAuthor: ArticleAuthor = {
  name: 'دکتر سارا احمدی',
  title: 'دکتری روان‌شناسی بالینی · عضو هیئت علمی',
  bio: 'پژوهشگر حوزهٔ سنجش روان‌شناختی نوجوانان و تدوین پروتکل‌های بازخورد بالینی امن در سامانهٔ نگرش.',
  isVerified: true,
};

export const sampleContentBlocks: readonly ContentBlock[] = [
  { id: 'b1', type: 'heading', level: 2, text: 'چرا زبان گزارش در نوجوانان اهمیت دارد؟', anchor: 'why-calm' },
  {
    id: 'b2',
    type: 'paragraph',
    text: 'زمانی که نوجوان یا والدین با جدول‌های پر از رنگ قرمز و برچسب‌های تشخیصی روبه‌رو می‌شوند، برداشت اضطرابی جای درک سازنده را می‌گیرد.',
  },
  {
    id: 'b3',
    type: 'callout-box',
    kind: 'tip',
    text: 'همیشه بازهٔ اطمینان نمره را در کنار نمرهٔ استاندارد نمایش دهید و بر نقاط قوت مراجع تأکید کنید.',
  },
  {
    id: 'b4',
    type: 'content-callout',
    kind: 'key-takeaway',
    title: 'جمع‌بندی کاربردی',
    text: 'نسخهٔ آرام در پلتفرم آزمون نگرش تمام رنگ‌های قرمز هشداردهنده را حذف می‌کند و توصیه‌های عملی جایگزین می‌کند.',
  },
  { id: 'b5', type: 'heading', level: 2, text: 'مقایسهٔ دو نمای گزارش', anchor: 'compare-views' },
  {
    id: 'b6',
    type: 'table',
    caption: 'تفاوت‌های ساختاری نمای حرفه‌ای و نمای آرام',
    headers: ['ویژگی', 'نمای حرفه‌ای', 'نمای آرام'],
    rows: [
      ['مخاطب اصلی', 'روان‌شناس و مشاور', 'نوجوان و والدین'],
      ['نمایش مقیاس‌های روایی', 'کامل با نمرهٔ T و خام', 'خلاصهٔ قابل فهم بدون اصطلاحات سنگین'],
      ['پالت رنگی', 'طیف کامل معنایی', 'بدون رنگ قرمز و برچسب اضطراب‌زا'],
    ],
  },
  {
    id: 'b7',
    type: 'quote',
    text: 'دقت علمی در کنار لحن آرام، اعتماد مراجع به فرایند ارزیابی را دوچندان می‌کند.',
    source: 'راهنمای اخلاق گزارش‌نویسی نگرش',
  },
  {
    id: 'b8',
    type: 'faq',
    items: [
      {
        id: 'bf-1',
        question: 'آیا چاپ A4 هر دو نما پشتیبانی می‌شود؟',
        answer: 'بله، چیدمان چاپی A4 در هر دو حالت حرفه‌ای و آرام دقیقاً هم‌ارز نمایش صفحه است.',
      },
    ],
  },
  { id: 'b9', type: 'divider' },
];

export const sampleExperts: readonly ExpertSummary[] = [
  {
    id: 'exp-1',
    name: 'دکتر سارا احمدی',
    title: 'روان‌شناس بالینی کودک و نوجوان',
    isVerified: true,
    specialties: ['روان‌سنجی نوجوانان', 'اضطراب تحصیلی'],
    modes: ['in_person', 'online'],
    city: 'تهران',
    intro: 'بیش از ۱۲ سال سابقهٔ ارزیابی تخصصی نوجوانان و مشاورهٔ خانواده با رویکرد شناختی-رفتاری.',
    profileHref: '#expert-sara',
  },
  {
    id: 'exp-2',
    name: 'دکتر محمدرضا کریمی',
    title: 'متخصص سنجش و روان‌سنجی',
    isVerified: true,
    specialties: ['آزمون‌های شخصیت', 'ارزیابی شغلی'],
    modes: ['online', 'phone'],
    city: 'اصفهان',
    intro: 'مشاور طراحی کارزارهای ارزیابی سازمانی و تفسیر نیمرخ‌های شخصیتی.',
    profileHref: '#expert-karimi',
  },
];

export const sampleWriterDocs: readonly WriterDocument[] = [
  {
    id: 'wd-1',
    title: 'راهنمای تفسیر مقیاس‌های روایی در MMPI-Teen-13',
    summary: 'نکات کلیدی برای بررسی همسانی پاسخ‌ها پیش از تفسیر مقیاس‌های بالینی.',
    body: 'در بررسی اولیهٔ نیمرخ، ابتدا مقیاس‌های روایی ارزیابی می‌شوند.\nتوصیه می‌شود مصاحبهٔ تکمیلی در جلسهٔ دوم انجام گیرد.',
    previousBody: 'در بررسی اولیهٔ نیمرخ، ابتدا مقیاس‌های روایی ارزیابی می‌شوند.\nتفسیر نهایی می‌تواند بدون مصاحبه انجام شود.',
    status: 'changes_requested',
    updatedAt: '2026-11-24T10:00:00Z',
    scheduledDate: '2026-12-01',
    scheduledTime: '10:30',
    reviewerNote: 'لطفاً مثال عملی برای مقیاس پاسخ‌دهی ناهمسان اضافه شود.',
  },
  {
    id: 'wd-2',
    title: 'چهار اصل طراحی کارزار آزمون در مدارس',
    summary: 'زمان‌بندی، محرمانگی و گزارش‌دهی به مشاوران مدرسه.',
    body: 'برای اجرای موفق کارزار در مدارس، هماهنگی قبلی با مشاور مدرسه ضروری است.',
    status: 'draft',
    updatedAt: '2026-11-25T08:30:00Z',
  },
];

export const sampleReviewQueue: readonly ReviewQueueItem[] = [
  {
    id: 'rq-1',
    title: 'راهنمای تفسیر مقیاس‌های روایی در MMPI-Teen-13',
    authorName: 'الهام شریفی',
    status: 'submitted',
    submittedAt: '2026-11-24T16:20:00Z',
    beforeText: 'تفسیر نهایی بدون جلسهٔ حضوری کافی است.',
    afterText: 'تفسیر نهایی باید همراه با مصاحبهٔ بالینی و بررسی تاریخچهٔ فردی انجام شود.',
  },
];

/* ── Courses Fixtures ────────────────────────────────────────────────────────────────── */
export const sampleCourseInstructor: CourseInstructor = {
  name: 'دکتر محمدرضا کریمی',
  title: 'مدرس روان‌سنجی و تفسیر آزمون‌های بالینی',
  bio: 'عضو کارگروه علمی نگرش و مؤلف راهنمای کاربردی تفسیر مقیاس‌های شخصیت.',
  isVerified: true,
};

export const sampleCourseChapters: readonly CourseChapter[] = [
  {
    id: 'ch-1',
    title: 'فصل اول: مبانی اجرا و روایی نیمرخ',
    lessons: [
      { id: 'l-1', title: 'آشنایی با ساختار آزمون و شرایط استاندارد اجرا', durationMinutes: 18, isCompleted: true, isPreview: true },
      { id: 'l-2', title: 'بررسی مقیاس‌های روایی و الگوهای پاسخ‌دهی', durationMinutes: 24, isCompleted: true },
    ],
  },
  {
    id: 'ch-2',
    title: 'فصل دوم: تفسیر بالینی و نگارش گزارش',
    lessons: [
      { id: 'l-3', title: 'تحلیل کدهای دونقطه‌ای و ترکیب مقیاس‌ها', durationMinutes: 32, isCompleted: false },
      { id: 'l-4', title: 'نگارش نسخهٔ آرام گزارش برای مراجع و خانواده', durationMinutes: 21, isLocked: true },
    ],
  },
];

export const sampleEnrolledCourses: readonly EnrolledCourseItem[] = [
  {
    id: 'ec-1',
    title: 'کارگاه جامع تفسیر بالینی MMPI-2',
    instructorName: 'دکتر محمدرضا کریمی',
    coverSrc: sampleMedia.courseCover,
    coverAlt: 'تصویر دورهٔ تفسیر بالینی MMPI-2',
    completedLessons: 5,
    totalLessons: 10,
    lastLessonTitle: 'تحلیل کدهای دونقطه‌ای',
  },
  {
    id: 'ec-2',
    title: 'اصول گزارش‌نویسی امن برای نوجوانان',
    instructorName: 'دکتر سارا احمدی',
    coverSrc: sampleMedia.articleCover,
    coverAlt: 'تصویر دورهٔ گزارش‌نویسی امن برای نوجوانان',
    completedLessons: 10,
    totalLessons: 10,
  },
];

/* ── Shells Fixtures ─────────────────────────────────────────────────────────────────── */
export const sampleAccountNav: readonly SideNavGroupData[] = [
  {
    id: 'acc-main',
    title: 'حساب کاربری',
    items: [
      { id: 'overview', label: 'پیشخوان', icon: iconHome, isCurrent: true, href: '#overview' },
      { id: 'orders', label: 'سفارش‌ها و فاکتورها', icon: iconCard, badge: 2, href: '#orders' },
      { id: 'activations', label: 'فعال‌سازی‌های من', icon: iconKey, badge: 3, href: '#activations' },
      { id: 'courses', label: 'دوره‌های من', icon: iconBook, href: '#courses' },
    ],
  },
];

export const sampleAdminNav: readonly SideNavGroupData[] = [
  {
    id: 'adm-core',
    title: 'مدیریت سامانه',
    items: [
      { id: 'serials', label: 'سریال‌ها و مجوزها', icon: iconKey, badge: 12, isCurrent: true, href: '#serials' },
      { id: 'limits', label: 'سقف‌های فعال‌سازی', icon: iconShield, href: '#limits' },
    ],
  },
  {
    id: 'adm-ops',
    title: 'عملیات (مدیر ارشد)',
    roles: ['admin'],
    items: [
      { id: 'alerts', label: 'کانال‌های هشدار', icon: iconBell, href: '#alerts' },
      { id: 'audit', label: 'گزارش ممیزی', icon: iconFile, href: '#audit' },
      { id: 'settings', label: 'تنظیمات', icon: iconSettings, href: '#settings' },
    ],
  },
];

export const sampleBreadcrumbs: readonly BreadcrumbItemData[] = [
  { id: 'bc-1', label: 'پنل مدیریت', href: '#admin' },
  { id: 'bc-2', label: 'مجوزها و سریال‌ها', href: '#serials' },
  { id: 'bc-3', label: 'سقف‌های فعال‌سازی' },
];

const SAMPLE_MASKED_PHONE = maskPhone('+989123456789') ?? '+98912***6789';

export const sampleUserMenu: UserMenuProps = {
  label: SAMPLE_MASKED_PHONE,
  'aria-label': `حساب کاربری ${SAMPLE_MASKED_PHONE}`,
  ltr: true,
  name: 'دکتر سارا احمدی',
  subtitle: SAMPLE_MASKED_PHONE,
  ltrSubtitle: true,
  roles: [
    { id: 'admin', label: 'مدیر ارشد' },
    { id: 'support', label: 'پشتیبان' },
  ],
  activeRole: 'admin',
  showThemeToggle: true,
};

export const sampleShellStats: readonly StatTileProps[] = [
  { label: 'سفارش‌های تکمیل‌شده', value: 4, icon: iconCard },
  { label: 'سریال‌های فعال', value: 3, icon: iconKey },
  { label: 'دوره‌های در حال یادگیری', value: 2, icon: iconBook },
];

export const sampleVerifiedMobiles: readonly VerifiedMobileItem[] = [
  { id: 'mob-1', phone: '+989123456789', isPrimary: true },
  { id: 'mob-2', phone: '+989357654321', isPrimary: false },
];

export const sampleNotificationTemplates: readonly NotificationTemplate[] = [
  {
    id: 'tpl-sms',
    channel: 'sms',
    name: 'ارسال کد فعال‌سازی نرم‌افزار',
    body: 'نگرش: کد فعال‌سازی محصول {{product}} برای شما {{code}} است.',
    variables: ['product', 'code', 'date'],
    sampleValues: { product: 'نگرش ۴', code: 'ACT-7K9P-3M2Q', date: '۵ آذر ۱۴۰۵' },
  },
  {
    id: 'tpl-email',
    channel: 'email',
    name: 'رسید صدور فاکتور و سریال',
    subject: 'جزئیات سفارش {{order}} در فروشگاه نگرش',
    body: 'کاربر گرامی {{name}}، سفارش شماره {{order}} با موفقیت ثبت شد.',
    variables: ['name', 'order', 'code'],
    sampleValues: { name: 'سارا احمدی', order: 'NG-1405-4092', code: 'N25AG-EMV0K' },
  },
  {
    id: 'tpl-telegram',
    channel: 'telegram',
    name: 'هشدار رسیدن به سقف فعال‌سازی',
    body: 'هشدار رجیستری: سریال {{code}} به سقف فعال‌سازی رسید.',
    variables: ['code', 'product'],
    sampleValues: { code: 'N25AG-EMV0K', product: 'نگرش ۴' },
  },
];

/* ── Test Platform Fixtures ──────────────────────────────────────────────────────────── */
export const sampleTestCatalog: readonly TestCatalogItem[] = [
  {
    id: 't-wellbeing',
    title: 'پرسشنامهٔ بهزیستی روانی (Wellbeing-8)',
    summary: 'غربالگری کوتاه بهزیستی هیجانی و رضایت از زندگی با گزارش آرام فوری.',
    category: 'بهزیستی و سلامت',
    questionCount: 8,
    estimatedMinutes: 5,
    price: 0,
  },
  {
    id: 't-mmpi-teen',
    title: 'آزمون شخصیتی نوجوانان (MMPI-Teen-13)',
    summary: 'ارزیابی جامع مقیاس‌های روایی و بالینی ویژهٔ سنین ۱۴ تا ۱۸ سال با دو نمای حرفه‌ای و آرام.',
    category: 'بالینی نوجوانان',
    questionCount: 130,
    estimatedMinutes: 35,
    price: 290_000,
    originalPrice: 380_000,
  },
  {
    id: 't-neo-org',
    title: 'آزمون شخصیت شغلی NEO-PI-R (بستهٔ سازمانی)',
    summary: 'ارزیابی پنج عامل بزرگ شخصیت برای جذب و توسعهٔ منابع انسانی.',
    category: 'سازمانی و شغلی',
    questionCount: 240,
    estimatedMinutes: 45,
    price: 180_000,
    isOrgRate: true,
  },
];

export const sampleDashboardReports: readonly DashboardReportItem[] = [
  {
    id: 'rep-1',
    testTitle: 'آزمون MMPI-Teen-13 (نمای آرام)',
    status: 'ready',
    createdAt: '2026-11-23T10:15:00Z',
    downloadHref: '#download-rep-1',
    resultHref: '#result-rep-1',
  },
  {
    id: 'rep-2',
    testTitle: 'پرسشنامهٔ بهزیستی روانی (Wellbeing-8)',
    status: 'pending',
    createdAt: '2026-11-25T13:20:00Z',
    resultHref: '#result-rep-2',
  },
];

export const sampleCampaignParticipants: readonly CampaignParticipant[] = [
  { id: 'cp-1', identifier: '+989121112233', status: 'active', completedAt: '2026-11-24T09:30:00Z' },
  { id: 'cp-2', identifier: '+989124445566', status: 'draft' },
  { id: 'cp-3', identifier: 'EMP-1405-092', status: 'active', completedAt: '2026-11-24T11:05:00Z' },
];

export const sampleWalletLedger: readonly WalletLedgerEntry[] = [
  {
    id: 'wl-1',
    date: '2026-11-20T08:00:00Z',
    description: 'شارژ کیف پول سازمانی از درگاه به‌‌پرداخت',
    delta: 5_000_000,
    balanceAfter: 5_000_000,
  },
  {
    id: 'wl-2',
    date: '2026-11-22T12:15:00Z',
    description: 'تخصیص ۵۰ صندلی کارزار ارزیابی پاییز',
    delta: -1_800_000,
    balanceAfter: 3_200_000,
  },
  {
    id: 'wl-3',
    date: '2026-11-24T14:40:00Z',
    description: 'تخصیص اعتبار به شمارهٔ همکار (+98912***4567)',
    delta: -250_000,
    balanceAfter: 2_950_000,
  },
];

export const sampleB2BClients: readonly B2BClientItem[] = [
  {
    id: 'b2b-1',
    name: 'سامانهٔ منابع انسانی پارس‌توسعه',
    keyPrefix: 'nds_live_8f3a',
    usedCalls: 1_420,
    monthlyQuota: 2_000,
    lastUsedAt: '2026-11-25T16:10:00Z',
  },
  {
    id: 'b2b-2',
    name: 'پورتال کلینیک‌های همکار سپهر',
    keyPrefix: 'nds_live_4c19',
    usedCalls: 500,
    monthlyQuota: 500,
    lastUsedAt: '2026-11-25T11:45:00Z',
  },
];
