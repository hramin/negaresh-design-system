import { allIcons } from '@negaresh/icons/all';
import { BRAND_MANIFESTS } from '../docs/brands/registry.ts';
import { ALL_CATALOG_DOCS } from '../docs/catalog.ts';
import { PRODUCTS_CATALOG } from '../docs/products/catalog.ts';
import { DECISIONS_DATA } from './decisions.ts';
import { cssTokens, tsPath } from './tokens.ts';

export type SearchCategory =
  | 'کامپوننت‌ها'
  | 'نمودارها'
  | 'کیت ارزیابی'
  | 'الگوهای محصول'
  | 'مبانی و توکن‌ها'
  | 'محصولات و برندها'
  | 'ابزارها و مرجع‌ها';

export interface SearchDocument {
  id: string;
  title: string;
  summary: string;
  category: SearchCategory;
  to: string;
  keywords: string[];
  badge?: string | undefined;
}

export interface SearchResult extends SearchDocument {
  score: number;
}

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

/**
 * Persian-aware search normalisation (docs/docs-site.md §Requirements):
 * - Arabic Yeh (`ي`, `ى`) → Persian Yeh (`ی`)
 * - Arabic Kaf (`ك`) → Persian Kaf (`ک`)
 * - Normalises `ۀ` / combining Hamza (`ٔ`) and strips Arabic diacritics & tatweel
 * - Converts Persian (`۰-۹`) and Arabic-Indic (`٠-٩`) digits to Latin (`0-9`)
 * - Case-folds Latin letters and normalises ZWNJ (`\u200C`) / whitespace
 */
export function normalizePersianSearch(input: string): string {
  let out = '';
  for (let i = 0; i < input.length; i++) {
    const ch = input[i]!;
    const pIdx = PERSIAN_DIGITS.indexOf(ch);
    if (pIdx !== -1) {
      out += String(pIdx);
      continue;
    }
    const aIdx = ARABIC_DIGITS.indexOf(ch);
    if (aIdx !== -1) {
      out += String(aIdx);
      continue;
    }
    if (ch === '\u064A' || ch === '\u0649') {
      out += '\u06CC'; // ی
    } else if (ch === '\u0643') {
      out += '\u06A9'; // ک
    } else if (ch === '\u06C0') {
      out += '\u0647'; // ه
    } else if (ch === '\u200C') {
      out += ' ';
    } else if (/[\u064B-\u065F\u0670\u0640\u0654]/.test(ch)) {
    } else {
      out += ch.toLowerCase();
    }
  }
  return out.replaceAll(/\s+/g, ' ').trim();
}

/** Space/ZWNJ/hyphen-stripped compact key so `فعالسازی`, `فعال‌سازی`, and `فعال سازی` all match. */
export function compactSearchKey(input: string): string {
  return normalizePersianSearch(input).replaceAll(/[\s\-_./]+/g, '');
}

const SECTION_CATEGORY: Record<string, SearchCategory> = {
  components: 'کامپوننت‌ها',
  charts: 'نمودارها',
  assessment: 'کیت ارزیابی',
  patterns: 'الگوهای محصول',
};

const STATIC_PAGES: readonly SearchDocument[] = [
  {
    id: 'page:home',
    title: 'معرفی دیزاین سیستم نگرش',
    summary: 'نمای کلی، اصول طراحی (آرام، قابل اعتماد، کمینه)، محصولات و آخرین تغییرات NDS.',
    category: 'ابزارها و مرجع‌ها',
    to: '/',
    keywords: ['overview', 'nds', 'نگرش', 'معرفی', 'خانه'],
  },
  {
    id: 'page:start',
    title: 'شروع کار و نصب',
    summary: 'نصب بسته‌های @negaresh/*، فونت وزیرمتن، لایه‌های CSS، ThemeProvider و کوکی تم SSR.',
    category: 'ابزارها و مرجع‌ها',
    to: '/start',
    keywords: ['install', 'setup', 'ThemeProvider', 'SSR', 'cookie', 'نصب', 'راه‌اندازی'],
  },
  {
    id: 'page:playground',
    title: 'زمین بازی تعاملی (Playground)',
    summary: 'آزمایش زندهٔ ویژگی‌ها، تم روشن/تیره/هم‌زمان، تراکم، جهت RTL/LTR و قاب‌های واکنش‌گرا.',
    category: 'ابزارها و مرجع‌ها',
    to: '/playground',
    keywords: ['playground', 'live', 'interactive', 'زمین بازی', 'پیش‌نمایش', 'تم', 'تراکم'],
  },
  {
    id: 'page:changelog',
    title: 'تاریخچهٔ تغییرات (Changelog)',
    summary: 'تغییرات بسته‌ها از Changesets و تاریخچهٔ فازهای تأییدشدهٔ P1 تا P6.',
    category: 'ابزارها و مرجع‌ها',
    to: '/changelog',
    keywords: ['changelog', 'changesets', 'releases', 'تغییرات', 'نسخه‌ها'],
  },
  {
    id: 'page:decisions',
    title: 'تصمیم‌های معماری و طراحی (D-01 تا D-97)',
    summary: 'فهرست تصمیم‌های الزام‌آور NDS و پرسش‌های باز از docs/01-decisions.md.',
    category: 'ابزارها و مرجع‌ها',
    to: '/decisions',
    keywords: ['decisions', 'D-77', 'D-85', 'D-93', 'D-97', 'تصمیم‌ها', 'معماری'],
  },
  {
    id: 'page:guide-form',
    title: 'آداپتور TanStack Form و Zod',
    summary: 'راهنمای اتصال فرم‌های NDS به @tanstack/react-form و zod v4 با خلاصهٔ خطای فارسی.',
    category: 'ابزارها و مرجع‌ها',
    to: '/guides/tanstack-form-zod',
    keywords: ['tanstack', 'form', 'zod', 'validation', 'فرم', 'اعتبارسنجی'],
  },
  {
    id: 'page:foundations-color',
    title: 'مبانی · رنگ و کنتراست',
    summary: 'پالت شنی (روشن)، جوهری (تیره)، تأکید سبزآبی و جدول کنتراست WCAG 2.2 AA.',
    category: 'مبانی و توکن‌ها',
    to: '/foundations/color',
    keywords: ['color', 'palette', 'contrast', 'sand', 'ink', 'teal', 'رنگ', 'کنتراست'],
  },
  {
    id: 'page:foundations-typography',
    title: 'مبانی · تایپوگرافی فارسی',
    summary: 'وزیرمتن و ابَر پرو، مقیاس ۱۲ تا ۵۰ پیکسل، وزن‌ها، ارتفاع خط و قواعد نیم‌فاصله.',
    category: 'مبانی و توکن‌ها',
    to: '/foundations/typography',
    keywords: ['typography', 'font', 'vazirmatn', 'abar', 'تایپوگرافی', 'فونت', 'قلم', 'نیم‌فاصله'],
  },
  {
    id: 'page:foundations-layout',
    title: 'مبانی · چیدمان، فضا و شکل',
    summary: 'پایهٔ ۴px، شکست ۹۰۰px، پنج الگوی صفحه، سطوح بدون سایه (D-77) و تراکم نمایش.',
    category: 'مبانی و توکن‌ها',
    to: '/foundations/layout',
    keywords: ['layout', 'space', 'breakpoint', 'density', 'surface', 'چیدمان', 'فاصله', 'تراکم'],
  },
  {
    id: 'page:foundations-motion',
    title: 'مبانی · حرکت (Motion)',
    summary: 'توکن‌های زمان و منحنی حرکت با احترام کامل به prefers-reduced-motion.',
    category: 'مبانی و توکن‌ها',
    to: '/foundations/motion',
    keywords: ['motion', 'duration', 'easing', 'reduced-motion', 'حرکت', 'انیمیشن'],
  },
  {
    id: 'page:foundations-icons',
    title: 'مبانی · آیکون‌ها',
    summary: '۷۶ آیکون خطی روی شبکهٔ ۲۴ با پرچم قرینه‌سازی در راست‌به‌چپ (mirrored).',
    category: 'مبانی و توکن‌ها',
    to: '/foundations/icons',
    keywords: ['icons', 'lucide', 'mirrored', 'svg', 'آیکون', 'قرینه'],
  },
  {
    id: 'page:foundations-localization',
    title: 'مبانی · بومی‌سازی و راست‌به‌چپ',
    summary: 'آزمون زندهٔ ارقام فارسی، تاریخ جلالی تهران، تومان (D-26)، موبایل و سریال.',
    category: 'مبانی و توکن‌ها',
    to: '/foundations/localization',
    keywords: ['localization', 'rtl', 'jalali', 'toman', 'digits', 'بومی‌سازی', 'جلالی', 'تومان'],
  },
  {
    id: 'page:foundations-accessibility',
    title: 'مبانی · دسترس‌پذیری (WCAG 2.2 AA)',
    summary: 'چک‌لیست کنتراست، حلقهٔ فوکوس، هدف لمسی ۴۴px، کیبورد و قواعد دسترس‌پذیری آزمون.',
    category: 'مبانی و توکن‌ها',
    to: '/foundations/accessibility',
    keywords: ['accessibility', 'wcag', 'a11y', 'axe', 'keyboard', 'دسترس‌پذیری', 'کیبورد'],
  },
  {
    id: 'page:foundations-content',
    title: 'مبانی · محتوا و لحن',
    summary: 'لحن آرام و شفاف فارسی، الگوی متن خطا و دکمه و قواعد ایمنی متن‌های روان‌شناختی.',
    category: 'مبانی و توکن‌ها',
    to: '/foundations/content',
    keywords: ['content', 'voice', 'copy', 'microcopy', 'لحن', 'محتوا', 'نگارش'],
  },
  {
    id: 'page:foundations-data-viz',
    title: 'مبانی · بصری‌سازی داده',
    summary: 'پالت --nds-viz-1..6، شش نوع نمودار SVG، مقیاس شدت حرفه‌ای/آرام و چاپ سیاه‌وسفید.',
    category: 'مبانی و توکن‌ها',
    to: '/foundations/data-viz',
    keywords: ['data-viz', 'charts', 'viz', 'calm', 'بصری‌سازی', 'نمودار', 'شدت'],
  },
  {
    id: 'page:tokens',
    title: 'جدول همهٔ توکن‌ها (CSS و TypeScript)',
    summary: '۱۱۸ متغیر CSS و مسیرهای TypeScript با دکمهٔ کپی مستقیم برای هر دو حالت روشن و تیره.',
    category: 'مبانی و توکن‌ها',
    to: '/tokens',
    keywords: ['tokens', 'css', 'dtcg', 'variables', 'توکن‌ها', 'متغیر'],
  },
  {
    id: 'page:components-index',
    title: 'همهٔ کامپوننت‌های Core (@negaresh/react)',
    summary: 'فهرست کامل ۷۴ صفحهٔ کامپوننت پایه، کنش‌ها، ورودی‌ها، بازخورد، لایه‌ها، ناوبری و داده.',
    category: 'کامپوننت‌ها',
    to: '/components',
    keywords: ['components', 'react', 'کامپوننت‌ها'],
  },
  {
    id: 'page:charts-index',
    title: 'همهٔ نمودارها (@negaresh/charts)',
    summary: 'فهرست نمودارهای SVG سرورمحور شامل IntervalBar، ProfileLine، Bar، Radar، Gauge و Sparkline.',
    category: 'نمودارها',
    to: '/charts',
    keywords: ['charts', 'svg', 'd3', 'نمودارها'],
  },
  {
    id: 'page:assessment-index',
    title: 'همهٔ اجزای کیت ارزیابی (@negaresh/assessment)',
    summary: 'جریان پاسخ‌دهی آزمون، نتایج حرفه‌ای و آرام و چیدمان چاپ A4.',
    category: 'کیت ارزیابی',
    to: '/assessment',
    keywords: ['assessment', 'exam', 'mmpi', 'کیت ارزیابی', 'آزمون'],
  },
  {
    id: 'page:patterns-index',
    title: 'همهٔ الگوهای محصول (@negaresh/patterns و Keycloak)',
    summary: 'الگوهای فروشگاه، رجیستری، مجله، متخصصان، دوره‌ها، مدیریت، پلتفرم آزمون و ورود Keycloak.',
    category: 'الگوهای محصول',
    to: '/patterns',
    keywords: ['patterns', 'keycloak', 'الگوها'],
  },
  {
    id: 'page:products-index',
    title: 'محصولات نگرش',
    summary: 'نگاشت صفحه‌های رجیستری، سایت اصلی نگرش، پلتفرم آزمون و روانما به الگوهای NDS.',
    category: 'محصولات و برندها',
    to: '/products',
    keywords: ['products', 'محصولات', 'رجیستری', 'نگارش', 'آزمون', 'روانما'],
  },
  {
    id: 'page:brands-index',
    title: 'افزونه‌های برند (docs.manifest.ts)',
    summary: 'نقطهٔ توسعهٔ بسته‌های برند مانند روانما و بستهٔ نمونهٔ Dummy بدون تغییر پوستهٔ سایت.',
    category: 'محصولات و برندها',
    to: '/brands',
    keywords: ['brands', 'manifest', 'docs.manifest.ts', 'افزونه برند', 'روانما', 'dummy'],
  },
  {
    id: 'page:ref-registry',
    title: 'مرجع · صفحهٔ فعال‌سازی رجیستری',
    summary: 'بازسازی کامل تمام‌صفحهٔ فعال‌سازی رجیستری با هم‌ارزی پیکسلی.',
    category: 'ابزارها و مرجع‌ها',
    to: '/reference/registry-activation',
    keywords: ['reference', 'registry', 'activation', 'فعال‌سازی', 'رجیستری'],
  },
  {
    id: 'page:ref-admin',
    title: 'مرجع · پنل مدیریت سریال‌ها',
    summary: 'نمونهٔ تمام‌صفحهٔ جدول مدیریت سریال‌ها با FilterBar، DataTable و BulkActionBar.',
    category: 'ابزارها و مرجع‌ها',
    to: '/reference/admin-serials',
    keywords: ['reference', 'admin', 'serials', 'مدیریت', 'سریال'],
  },
  {
    id: 'page:ref-report',
    title: 'مرجع · گزارش چاپی A4 آزمون',
    summary: 'پیش‌نمایش تمام‌صفحهٔ گزارش A4 و PDF با هم‌ارزی کامل صفحه و چاپ.',
    category: 'ابزارها و مرجع‌ها',
    to: '/reference/assessment-report',
    keywords: ['reference', 'print', 'pdf', 'a4', 'گزارش', 'چاپ'],
  },
  {
    id: 'page:ref-keycloak',
    title: 'مرجع · پوستهٔ ورود Keycloak',
    summary: 'پیش‌نمایش تمام‌صفحهٔ ۸ جریان احراز هویت در @negaresh/keycloak-theme.',
    category: 'ابزارها و مرجع‌ها',
    to: '/reference/keycloak-login',
    keywords: ['reference', 'keycloak', 'login', 'otp', 'ورود', 'احراز هویت'],
  },
];

let cachedIndex: SearchDocument[] | null = null;

/** Builds the complete local Persian + Latin search index lazily once. */
export function getSearchIndex(): readonly SearchDocument[] {
  if (cachedIndex) return cachedIndex;

  const docs: SearchDocument[] = [...STATIC_PAGES];

  for (const item of ALL_CATALOG_DOCS) {
    docs.push({
      id: `${item.section}:${item.slug}`,
      title: item.title,
      summary: item.summary,
      category: SECTION_CATEGORY[item.section] ?? 'کامپوننت‌ها',
      to: `/${item.section}/${item.slug}`,
      keywords: [...item.components, item.slug, ...(item.base ? [item.base] : [])],
      badge: item.components[0],
    });
  }

  for (const prod of PRODUCTS_CATALOG) {
    docs.push({
      id: `product:${prod.slug}`,
      title: `محصول · ${prod.name}`,
      summary: prod.summary,
      category: 'محصولات و برندها',
      to: `/products/${prod.slug}`,
      keywords: [prod.englishName, prod.slug, ...prod.screens.map((s) => s.screen)],
      badge: prod.englishName,
    });
  }

  for (const manifest of BRAND_MANIFESTS) {
    for (const route of manifest.routes) {
      docs.push({
        id: `brand:${manifest.brandId}:${route.slug}`,
        title: `${manifest.title} · ${route.title}`,
        summary: route.summary,
        category: 'محصولات و برندها',
        to: `/brands/${manifest.brandId}/${route.slug}`,
        keywords: [manifest.brandId, manifest.packageName, ...route.keywords],
        badge: manifest.brandId,
      });
    }
  }

  for (const token of cssTokens) {
    if (!token.cssVar) continue;
    const tsName = tsPath(token.path);
    docs.push({
      id: `token:${token.path}`,
      title: token.cssVar,
      summary: `${tsName} · روشن: ${token.value.light}${token.modal ? ` · تیره: ${token.value.dark}` : ''}`,
      category: 'مبانی و توکن‌ها',
      to: '/tokens',
      keywords: [token.cssVar, token.path, tsName, token.description ?? ''],
      badge: 'token',
    });
  }

  for (const icon of allIcons) {
    const exportName = `icon${icon.name.charAt(0).toUpperCase()}${icon.name.slice(1)}`;
    docs.push({
      id: `icon:${icon.name}`,
      title: exportName,
      summary: icon.mirrored
        ? 'آیکون خطی ۲۴×۲۴ · قرینه‌شونده در راست‌به‌چپ (mirrored)'
        : 'آیکون خطی ۲۴×۲۴ از @negaresh/icons',
      category: 'مبانی و توکن‌ها',
      to: '/foundations/icons',
      keywords: [icon.name, exportName, icon.mirrored ? 'mirrored قرینه' : 'آیکون'],
      badge: 'icon',
    });
  }

  for (const d of [...DECISIONS_DATA.nds, ...DECISIONS_DATA.inherited]) {
    docs.push({
      id: `decision:${d.id}`,
      title: `تصمیم ${d.id}`,
      summary: `${d.decision} → ${d.consequence}`,
      category: 'ابزارها و مرجع‌ها',
      to: '/decisions',
      keywords: [d.id, d.decision, d.consequence],
      badge: d.id,
    });
  }

  for (const q of DECISIONS_DATA.openQuestions) {
    docs.push({
      id: `question:${q.id}`,
      title: `پرسش باز ${q.id}`,
      summary: `${q.question} (${q.defaultPolicy})`,
      category: 'ابزارها و مرجع‌ها',
      to: '/decisions',
      keywords: [q.id, q.question, q.defaultPolicy],
      badge: q.id,
    });
  }

  cachedIndex = docs;
  return cachedIndex;
}

/** Searches the complete NDS docs index using Persian-aware normalisation and ranked scoring. */
export function searchDocs(query: string, limit = 24): SearchResult[] {
  const normQuery = normalizePersianSearch(query);
  if (!normQuery) return [];

  const tokens = normQuery.split(' ').filter(Boolean);
  const compactQuery = compactSearchKey(query);
  const index = getSearchIndex();
  const scored: SearchResult[] = [];

  for (const doc of index) {
    const normTitle = normalizePersianSearch(doc.title);
    const compactTitle = compactSearchKey(doc.title);
    const normSummary = normalizePersianSearch(doc.summary);
    const compactSummary = compactSearchKey(doc.summary);
    const normKeywords = doc.keywords.map(normalizePersianSearch);
    const compactKeywords = doc.keywords.map(compactSearchKey);

    let score = 0;

    if (normTitle === normQuery || compactTitle === compactQuery) score += 120;
    else if (normTitle.startsWith(normQuery) || compactTitle.startsWith(compactQuery)) score += 80;
    else if (normTitle.includes(normQuery) || (compactQuery.length >= 2 && compactTitle.includes(compactQuery))) {
      score += 55;
    }

    for (let i = 0; i < normKeywords.length; i++) {
      const kw = normKeywords[i]!;
      const ckw = compactKeywords[i]!;
      if (kw === normQuery || ckw === compactQuery) score += 100;
      else if (kw.startsWith(normQuery) || ckw.startsWith(compactQuery)) score += 65;
      else if (kw.includes(normQuery) || (compactQuery.length >= 2 && ckw.includes(compactQuery))) {
        score += 35;
      }
    }

    if (
      normSummary.includes(normQuery) ||
      (compactQuery.length >= 2 && compactSummary.includes(compactQuery))
    ) {
      score += 20;
    }

    // Multi-token fallback: every query word must appear somewhere in title, keywords, or summary.
    if (score === 0 && tokens.length > 1) {
      const haystack = `${normTitle} ${normKeywords.join(' ')} ${normSummary}`;
      const compactHaystack = `${compactTitle} ${compactKeywords.join(' ')} ${compactSummary}`;
      const allPresent = tokens.every(
        (t) => haystack.includes(t) || compactHaystack.includes(compactSearchKey(t)),
      );
      if (allPresent) score += 25;
    }

    if (score > 0) {
      // Gently prefer primary docs pages over individual token/icon rows on broad ties.
      if (doc.badge === 'token' || doc.badge === 'icon') score -= 5;
      scored.push({ ...doc, score });
    }
  }

  scored.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'fa'));
  return scored.slice(0, limit);
}
