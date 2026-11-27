export interface BrandManifestLink {
  label: string;
  to: string;
}

export interface BrandManifestSection {
  id: string;
  heading: string;
  body: string;
  bullets?: readonly string[];
  code?: { label: string; snippet: string };
}

export interface BrandManifestRoute {
  slug: string;
  title: string;
  summary: string;
  keywords: readonly string[];
  sections: readonly BrandManifestSection[];
  relatedLinks?: readonly BrandManifestLink[];
}

/**
 * Framework-free contract for brand packages registering their own docs section
 * in `apps/docs` without coupling Core or the company theme to brand art (D-77).
 */
export interface DocsManifest {
  /** URL-safe brand identifier used under `/brands/<brandId>/<slug>`. */
  brandId: string;
  /** Workspace package name, e.g. `@negaresh/brand-ravanma`. */
  packageName: string;
  /** Theme package this brand builds on, e.g. `@negaresh/theme-ravanma`. */
  themePackage: string;
  /** Persian display title for the brand section. */
  title: string;
  /** Navigation group title injected into the docs sidebar. */
  navGroup: string;
  /** Short one-line summary shown in `/brands` and search results. */
  summary: string;
  /** Maturity status (`placeholder` | `demo` | `approved`). */
  status: 'placeholder' | 'demo' | 'approved';
  /** Supported locales (e.g. `['fa', 'en']` per D-30 for Ravanma). */
  locales: readonly string[];
  /** Routes owned by this brand package. */
  routes: readonly BrandManifestRoute[];
}

/**
 * Ravanma brand-kit documentation manifest placeholder.
 * Zero painted assets or ornament enter Core or `@negaresh/theme-company` (D-77).
 */
export const docsManifest: DocsManifest = {
  brandId: 'ravanma',
  packageName: '@negaresh/brand-ravanma',
  themePackage: '@negaresh/theme-ravanma',
  title: 'بستهٔ برند روانما (Placeholder)',
  navGroup: 'برند · روانما',
  summary:
    'جایگاه رسمی بستهٔ هنری و تم روانما روی اسکلت مشترک NDS؛ بدون ورود هیچ عنصر تزئینی به Core یا تم شرکتی (D-77).',
  status: 'placeholder',
  locales: ['fa', 'en'],
  routes: [
    {
      slug: 'overview',
      title: 'معماری بستهٔ برند روانما',
      summary:
        'روانما از اجزای Core، نمودارها و کیت ارزیابی NDS استفاده می‌کند و لایه‌های هنری خود را صرفاً در این بسته نگه می‌دارد.',
      keywords: ['روانما', 'ravanma', 'brand', 'theme-ravanma', 'D-30', 'D-77'],
      sections: [
        {
          id: 'isolation',
          heading: 'جداسازی کامل هنر از اجزای Core (D-24 و D-77)',
          body: 'تمامی برگ‌های نقاشی‌شده، نقشه‌های پرسپکتیو، لایه‌های مسافر و تذهیب منحصراً در @negaresh/brand-ravanma زندگی می‌کنند و هیچ کامپوننتی در @negaresh/react یا @negaresh/theme-company به این بسته وابسته نیست.',
          bullets: [
            'وابستگی یک‌طرفه: @negaresh/brand-ravanma فقط به @negaresh/theme-ravanma تکیه دارد.',
            'آیکون‌های اندازه‌پذیر رابط همچنان از @negaresh/icons می‌آیند (D-24).',
            'پشتیبانی دوزبانه (فارسی RTL و انگلیسی LTR) طبق تصمیم D-30 از روز نخست.',
          ],
        },
      ],
      relatedLinks: [
        { label: 'صفحهٔ محصول روانما', to: '/products/ravanma' },
        { label: 'کیت ارزیابی و آزمون', to: '/assessment' },
        { label: 'نمودارهای SVG', to: '/charts' },
      ],
    },
    {
      slug: 'art-slots',
      title: 'جایگاه‌های هنری و توکن‌های تم روانما',
      summary: 'قرارداد جایگذاری تصویرسازی، لوگو و توکن‌های اختصاصی هنگام پیاده‌سازی فاز برند روانما.',
      keywords: ['روانما', 'art', 'slots', 'LogoSlot', 'ravanma.css'],
      sections: [
        {
          id: 'slots',
          heading: 'جایگاه‌های تعریف‌شده روی اسکلت NDS',
          body: 'به‌جای بازنویسی کامپوننت‌ها، بستهٔ برند از جایگاه‌های استاندارد NDS مانند LogoSlot و توکن‌های معنایی ravanma.css استفاده می‌کند.',
          bullets: [
            'توکن‌های رنگ و شعاع اختصاصی در tokens/themes/ravanma.tokens.json → @negaresh/tokens/ravanma.css.',
            'جایگاه لوگو در TopBar و AuthShell از طریق LogoSlot بدون تغییر ساختار دسترس‌پذیری.',
            'تست‌های LTR و RTL روی همان کامپوننت‌های تاییدشدهٔ @negaresh/react اجرا می‌شوند.',
          ],
        },
      ],
      relatedLinks: [
        { label: 'جایگاه لوگو (LogoSlot)', to: '/components/logo-slot' },
        { label: 'همهٔ توکن‌ها', to: '/tokens' },
      ],
    },
  ],
};

export default docsManifest;
