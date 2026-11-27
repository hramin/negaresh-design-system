export interface ProductScreenRow {
  screen: string;
  shell: string;
  patterns: { label: string; to: string }[];
  notes: string;
}

export interface ProductDoc {
  slug: 'registry' | 'negaresh' | 'test-platform' | 'ravanma';
  name: string;
  englishName: string;
  status: 'active' | 'placeholder';
  statusLabel: string;
  summary: string;
  theme: string;
  locales: string;
  constraints: readonly string[];
  screens: readonly ProductScreenRow[];
  referenceLinks: readonly { label: string; to: string }[];
}

export const PRODUCTS_CATALOG: readonly ProductDoc[] = [
  {
    slug: 'registry',
    name: 'رجیستری نرم‌افزارهای نگرش',
    englishName: 'Registry',
    status: 'active',
    statusLabel: 'نخستین محصول روی NDS',
    summary:
      'سامانهٔ فعال‌سازی سریال‌های نرم‌افزارهای ویندوزی نگرش، مدیریت فعال‌سازی‌های کاربر، خرید +۱ فعال‌سازی و پنل مدیریت سقف‌ها و ممیزی.',
    theme: '@negaresh/theme-company (روشن و تیره)',
    locales: 'فارسی RTL (کدهای سریال و سیستم LTR با ارقام لاتین — D-86)',
    constraints: [
      'موبایل‌اول از عرض ۳۶۰ پیکسل و باز شدن مستقیم از نرم‌افزار ویندوز با پارامترهای `/?s=&code=`.',
      'خطاهای دقیق فعال‌سازی (FR-11): سریال ناشناخته، محصول نادرست، ابطال‌شده و پر شدن سقف.',
      'تکرار سریال + کد سیستم یکسان کد قبلی را بدون مصرف ظرفیت تازه برمی‌گرداند (FR-12).',
      'منبع سقف مؤثر (سریال، مشتری، محصول یا سراسری) همیشه در پنل مدیریت نمایش داده می‌شود (FR-23).',
    ],
    screens: [
      {
        screen: 'فعال‌سازی محصول (صفحهٔ مرجع)',
        shell: 'Task (ستون اصلی + راهنما)',
        patterns: [
          { label: 'جریان فعال‌سازی (ActivationFlow)', to: '/patterns/licensing-activation' },
          { label: 'SerialField / CodeField', to: '/components/serial-field' },
          { label: 'CopyButton', to: '/components/copy-button' },
        ],
        notes: 'بازسازی پیکسلی تاییدشده در P2 و P3؛ پیش‌پر شدن کد سیستم از نشانی.',
      },
      {
        screen: 'فعال‌سازی‌های من و خرید +۱ ظرفیت',
        shell: 'Workspace (AccountShell)',
        patterns: [
          { label: 'فعال‌سازی‌های من (MyActivations)', to: '/patterns/licensing-activation' },
          { label: 'تسویه و درگاه (Checkout)', to: '/patterns/commerce-checkout' },
          { label: 'پوستهٔ حساب کاربری', to: '/patterns/account-admin-shells' },
        ],
        notes: 'نمایش UsageMeter ظرفیت و ارسال مجدد کد با محدودیت نرخ.',
      },
      {
        screen: 'پنل مدیریت (سریال‌ها، سقف‌ها، هشدارها و ممیزی)',
        shell: 'Workspace (AdminShell)',
        patterns: [
          { label: 'مدیریت مجوزها (LimitEditor / Batch / Audit)', to: '/patterns/licensing-admin' },
          { label: 'جدول داده (DataTable)', to: '/components/data-table' },
          { label: 'نوار فیلتر (FilterBar)', to: '/components/filter-bar' },
        ],
        notes: 'پشتیبانی از حالت تراکم compact، خروجی CSV و تاریخچهٔ تغییر سقف با دلیل.',
      },
      {
        screen: 'ورود یکپارچه با موبایل و پیامک',
        shell: 'Focus (AuthShell / Keycloak)',
        patterns: [
          { label: 'ورود با موبایل و OTP', to: '/patterns/identity-sign-in' },
          { label: 'تأیید موبایل و دومرحله‌ای', to: '/patterns/identity-security' },
        ],
        notes: 'کد پیامکی ۶ رقمی با شمارش معکوس ۶۰ ثانیه و اعتبار ۲ دقیقه.',
      },
    ],
    referenceLinks: [
      { label: 'صفحهٔ مرجع فعال‌سازی رجیستری', to: '/reference/registry-activation' },
      { label: 'نمونهٔ مدیریت · فهرست سریال‌ها', to: '/reference/admin-serials' },
      { label: 'پوستهٔ ورود Keycloak', to: '/reference/keycloak-login' },
    ],
  },
  {
    slug: 'negaresh',
    name: 'سایت اصلی نگرش',
    englishName: 'Negaresh Main Site',
    status: 'active',
    statusLabel: 'فروشگاه، مجله، دوره‌ها و متخصصان',
    summary:
      'وب‌سایت اصلی نگرش شامل فروشگاه محصولات نرم‌افزاری و فیزیکی، مجله و بلوک‌های محتوا، دایرکتوری متخصصان، دوره‌های آموزشی و پنل تحریریه و مدیریت.',
    theme: '@negaresh/theme-company (روشن و تیره)',
    locales: 'فارسی RTL · قیمت‌ها فقط به تومان (D-26)',
    constraints: [
      'رندر سرور (SSR) برای صفحات عمومی، سئو و LCP زیر ۲٫۵ ثانیه روی موبایل.',
      'بلوک‌های محتوای ساختاریافته (۱۱ نوع بلوک از جمله CalloutBox و ContentCallout) بدون وابستگی به ویرایشگر خاص (Q-04).',
      'اطلاعات تماس متخصصان هرگز در صفحات عمومی نمایش داده نمی‌شود.',
      'فاکتور قابل چاپ قطع A4 با حاشیهٔ ۱۴×۱۰ میلی‌متر و تاریخ جلالی.',
    ],
    screens: [
      {
        screen: 'کاتالوگ و صفحهٔ محصول',
        shell: 'Catalog / Reading',
        patterns: [
          { label: 'کاتالوگ و صفحهٔ محصول (ProductPage)', to: '/patterns/commerce-catalog' },
          { label: 'کارت انتخاب ویرایش (ChoiceCard)', to: '/components/choice-card' },
        ],
        notes: 'گالری، انتخاب ویرایش، قیمت تخفیف‌خورده یا رایگان، پیش‌نیازها و علاقه‌مندی‌ها.',
      },
      {
        screen: 'سبد خرید، تسویه، سفارش و فاکتور A4',
        shell: 'Task / Print',
        patterns: [
          { label: 'سبد خرید و تسویه (Cart / Checkout)', to: '/patterns/commerce-checkout' },
          { label: 'جزئیات سفارش و فاکتور (OrderDetail / Invoice)', to: '/patterns/commerce-orders' },
        ],
        notes: 'کد تخفیف، درگاه‌های بانکی با ترتیب مدیریت و چاپ A4.',
      },
      {
        screen: 'بلاگ، صفحهٔ مقاله و نظرسنجی',
        shell: 'Reading / Catalog',
        patterns: [
          { label: 'محتوای تحریریه و بلوک‌ها (ArticlePage)', to: '/patterns/content-editorial' },
          { label: 'مسیر راهنما (Breadcrumbs)', to: '/components/breadcrumbs' },
        ],
        notes: '۴ گونه ContentCard، اسلایدر ویژهٔ حداکثر ۵ مورد، TOC و یادداشت متخصص پس از رأی‌گیری.',
      },
      {
        screen: 'دایرکتوری متخصصان، فضای نویسنده و صف بررسی',
        shell: 'Catalog / Workspace',
        patterns: [
          { label: 'متخصصان و گردش‌کار تحریریه', to: '/patterns/content-experts' },
          { label: 'مقایسهٔ نسخه‌ها (DiffView)', to: '/components/diff-view' },
        ],
        notes: 'نشان پروانهٔ تأییدشده (VerifiedBadge)، جریان ۵ مرحله‌ای انتشار و مقایسهٔ ویرایش‌ها.',
      },
      {
        screen: 'دوره‌های آموزشی و پخش‌کنندهٔ درس',
        shell: 'Reading / Workspace',
        patterns: [
          { label: 'دوره‌ها و پخش‌کننده (CoursePlayer)', to: '/patterns/courses' },
          { label: 'پوستهٔ حساب و مدیریت', to: '/patterns/account-admin-shells' },
        ],
        notes: 'سرفصل، قاب ۱۶:۹ با کنترل سرعت و ادامهٔ مشاهده و قاعدهٔ تکمیل ۹۰٪.',
      },
    ],
    referenceLinks: [
      { label: 'الگوی صفحهٔ محصول و فروشگاه', to: '/patterns/commerce-catalog' },
      { label: 'الگوی مقاله و بلوک‌های محتوا', to: '/patterns/content-editorial' },
      { label: 'پوستهٔ ورود Keycloak', to: '/reference/keycloak-login' },
    ],
  },
  {
    slug: 'test-platform',
    name: 'پلتفرم آزمون‌های روان‌شناختی',
    englishName: 'Psychology Test Platform',
    status: 'active',
    statusLabel: 'کیت ارزیابی + نمودارهای SVG + چاپ A4',
    summary:
      'سامانهٔ اجرای آزمون‌های روان‌شناختی، نمایش دوگانهٔ نتایج (حرفه‌ای برای متخصص و آرام برای نوجوان و والدین)، گزارش PDF قطع A4، کارزارهای سازمانی و کیف پول.',
    theme: '@negaresh/theme-company (روشن و تیره؛ چاپ همیشه کاغذ روشن)',
    locales: 'فارسی RTL · تاریخ تولد و انقضا با تقویم جلالی',
    constraints: [
      'آزمون‌دهندگان نوجوان ممکن است نتیجه را بخوانند: نمای آرام بدون رنگ رز/قرمز و بدون واژگان تشخیصی هراس‌آور.',
      'هم‌ارزی کامل نمایش صفحه و PDF قطع A4 با حاشیهٔ ۱۴×۱۰ میلی‌متر و نمودارهای SVG سرورمحور.',
      'هر پرسش درون <fieldset>/<legend> با رادیوهای واقعی و اعلام زندهٔ پیشرفت («صفحهٔ n از N»).',
      'حالت کمپین بدون کروم اضافه (بدون منوی کاربری) و صفحهٔ تأیید پایان آزمون.',
    ],
    screens: [
      {
        screen: 'کاتالوگ آزمون‌ها و پیشخوان آزمون‌دهنده',
        shell: 'Catalog / Workspace',
        patterns: [
          { label: 'کاتالوگ و داشبورد آزمون', to: '/patterns/test-platform-catalog' },
          { label: 'شروع و ادامهٔ آزمون (StartForm / Resume)', to: '/assessment/start-resume' },
        ],
        notes: 'قیمت‌گذاری رایگان/تخفیف/تعرفهٔ سازمانی و جلوگیری از آزمون تکراری ناتمام.',
      },
      {
        screen: 'صفحهٔ پاسخ‌دهی پرسش‌ها',
        shell: 'Focus',
        patterns: [
          { label: 'پرسش آزمون (QuestionItem)', to: '/assessment/question-item' },
          { label: 'جریان پاسخ‌دهی و پیشرفت (AnswerPage)', to: '/assessment/answer-flow' },
        ],
        notes: 'گزینه‌های ۲/۴/۶ تایی، لیکرت ۵ و ۷، جفت اجباری، گزینه‌های تصویری و پرش خطا.',
      },
      {
        screen: 'نتیجهٔ حرفه‌ای، نتیجهٔ آرام و گزارش چاپی A4',
        shell: 'Reading / Print',
        patterns: [
          { label: 'خلاصه، جدول نمره و نمودار نتیجه', to: '/assessment/result-overview' },
          { label: 'بلوک تفسیر (InterpretationBlock)', to: '/assessment/interpretation-block' },
          { label: 'چیدمان چاپ A4 (PrintLayout)', to: '/assessment/print-layout' },
          { label: 'نمودار نیمرخ و بازه‌ای (@negaresh/charts)', to: '/charts/interval-bar' },
        ],
        notes: 'سازگار با شکل JSON خروجی `/api/v1` (نمونه‌های MMPI-Teen-13 و Wellbeing-8).',
      },
      {
        screen: 'کارزار سازمانی، فهرست شرکت‌کنندگان، کیف پول و B2B',
        shell: 'Workspace (AdminShell)',
        patterns: [
          { label: 'کارزار، کیف پول و B2B', to: '/patterns/test-platform-org' },
          { label: 'وضعیت گزارش و پایان کمپین', to: '/assessment/report-status' },
        ],
        notes: 'بارگذاری CSV فهرست افراد، لینک اشتراک LTR، کیف پول تومانی و کلید API یک‌بارنمایش.',
      },
    ],
    referenceLinks: [
      { label: 'گزارش چاپی A4 · MMPI-Teen-13 (حرفه‌ای)', to: '/reference/assessment-report' },
      { label: 'الگوی کاتالوگ آزمون', to: '/patterns/test-platform-catalog' },
      { label: 'پوستهٔ ورود Keycloak', to: '/reference/keycloak-login' },
    ],
  },
  {
    slug: 'ravanma',
    name: 'روانما',
    englishName: 'Ravanma',
    status: 'placeholder',
    statusLabel: 'جایگاه آماده (فاز برند جداگانه — D-37)',
    summary:
      'روانما روی اسکلت مشترک Core، نمودارها و کیت ارزیابی NDS اجرا می‌شود و هویت بصری، تم اختصاصی و هنر نقاشی‌شدهٔ خود را در بسته‌های مجزای @negaresh/theme-ravanma و @negaresh/brand-ravanma نگه می‌دارد.',
    theme: '@negaresh/theme-ravanma (Placeholder)',
    locales: 'دوزبانه فارسی (RTL) و انگلیسی (LTR) طبق تصمیم D-30',
    constraints: [
      'هیچ عنصر تذهیب، قاب، شمسه یا نشانگر لوزی وارد Core یا تم شرکتی نمی‌شود (D-77).',
      'هنر نقاشی‌شده از اجزای اندازه‌پذیر رابط جداست؛ آیکون‌های UI همچنان از @negaresh/icons می‌آیند (D-24).',
      'بستهٔ @negaresh/brand-ravanma بخش مستندات خود را از طریق docs.manifest.ts به همین سایت متصل می‌کند.',
      'پشتیبانی کامل LTR در کامپوننت‌های Core با ویژگی‌های منطقی CSS از پیش فراهم شده است.',
    ],
    screens: [
      {
        screen: 'جریان پاسخ‌دهی و نتایج روی اسکلت مشترک',
        shell: 'Focus / Reading',
        patterns: [
          { label: 'کیت ارزیابی و آزمون', to: '/assessment' },
          { label: 'نمودار بازه‌ای (IntervalBar)', to: '/charts/interval-bar' },
          { label: 'کنترل بخش‌بندی (SegmentedControl)', to: '/components/segmented-control' },
        ],
        notes: 'بازاستفادهٔ مستقیم بدون دوگانه‌سازی منطق دسترس‌پذیری یا نمودارها.',
      },
      {
        screen: 'مستندات افزونهٔ برند روانما (docs.manifest.ts)',
        shell: 'Brand Extension',
        patterns: [
          { label: 'معماری بستهٔ برند روانما', to: '/brands/ravanma/overview' },
          { label: 'جایگاه‌های هنری و توکن‌های روانما', to: '/brands/ravanma/art-slots' },
        ],
        notes: 'بخش اختصاصی تزریق‌شده از @negaresh/brand-ravanma/docs.manifest.',
      },
    ],
    referenceLinks: [
      { label: 'معماری بستهٔ برند روانما', to: '/brands/ravanma/overview' },
      { label: 'فهرست افزونه‌های برند (docs.manifest.ts)', to: '/brands' },
    ],
  },
];

export function findProductDoc(slug: ProductDoc['slug']): ProductDoc {
  const found = PRODUCTS_CATALOG.find((p) => p.slug === slug);
  if (!found) throw new Error(`Unknown product slug: ${slug}`);
  return found;
}
