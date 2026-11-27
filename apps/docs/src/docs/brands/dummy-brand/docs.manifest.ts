import type { DocsManifest } from '@negaresh/brand-ravanma/docs.manifest';

/**
 * Dummy brand package manifest required by P7 (`docs/phases/P7.md`) to prove the
 * `docs.manifest.ts` extension point end-to-end: navigation injection, route resolution,
 * Persian search indexing, and zero coupling to the docs shell.
 */
export const dummyBrandDocsManifest: DocsManifest = {
  brandId: 'sample-dummy',
  packageName: '@negaresh/brand-sample-dummy',
  themePackage: '@negaresh/theme-company',
  title: 'بستهٔ برند نمونه (Dummy Extension)',
  navGroup: 'برند · نمونه (Dummy)',
  summary:
    'بستهٔ نمونه برای راستی‌آزمایی نقطهٔ توسعهٔ docs.manifest.ts در فاز P7؛ هر بستهٔ برند جدید با همین قرارداد بدون تغییر پوسته به سایت مستندات متصل می‌شود.',
  status: 'demo',
  locales: ['fa'],
  routes: [
    {
      slug: 'overview',
      title: 'نمای کلی بستهٔ نمونهٔ برند',
      summary:
        'نشان می‌دهد چگونه یک بستهٔ برند مستقل گروه ناوبری، مسیرهای اختصاصی و کلیدواژه‌های جست‌وجو را به سایت مستندات تزریق می‌کند.',
      keywords: ['برند نمونه', 'dummy', 'docs.manifest', 'extension point', 'افزونه برند'],
      sections: [
        {
          id: 'how-it-works',
          heading: 'نحوهٔ اتصال بدون تغییر پوستهٔ سایت',
          body: 'بستهٔ برند تنها یک شیء سازگار با نوع DocsManifest را در مسیر docs.manifest.ts صادر می‌کند. رجیستری سایت مستندات به‌طور خودکار گروه ناوبری کناری، صفحه‌های /brands/$brand/$slug و فهرست جست‌وجوی فارسی را می‌سازد.',
          bullets: [
            'تزریق خودکار گروه ناوبری در Shell.tsx بدون دست‌زدن به کد پوسته.',
            'ثبت خودکار در موتور جست‌وجوی فارسی با نرمال‌سازی ی/ي، ک/ك و نیم‌فاصله.',
            'سازگار با رندر سرور (SSR)، حالت بدون جاوااسکریپت و دو حالت روشن/تیره.',
          ],
          code: {
            label: 'قرارداد نمونهٔ docs.manifest.ts',
            snippet: `import type { DocsManifest } from '@negaresh/brand-ravanma/docs.manifest';

export const docsManifest: DocsManifest = {
  brandId: 'my-brand',
  packageName: '@negaresh/brand-my-brand',
  themePackage: '@negaresh/theme-company',
  title: 'بستهٔ برند اختصاصی',
  navGroup: 'برند · اختصاصی',
  summary: 'مستندات دارایی‌ها و جایگاه‌های برند.',
  status: 'demo',
  locales: ['fa'],
  routes: [{ slug: 'overview', title: 'معرفی', summary: '…', keywords: ['برند'], sections: [] }],
};`,
          },
        },
      ],
      relatedLinks: [
        { label: 'فهرست همهٔ افزونه‌های برند', to: '/brands' },
        { label: 'معماری بستهٔ روانما', to: '/brands/ravanma/overview' },
        { label: 'جایگاه لوگو (LogoSlot)', to: '/components/logo-slot' },
      ],
    },
    {
      slug: 'tokens-and-slots',
      title: 'توکن‌ها و جایگاه‌های برند نمونه',
      summary: 'الگوی تعریف جایگاه‌های لوگو و سطح‌بندی معنایی بدون افزودن رنگ خام یا سایهٔ ثابت (D-77).',
      keywords: ['جایگاه', 'توکن برند', 'dummy', 'slots', 'D-77'],
      sections: [
        {
          id: 'slot-rules',
          heading: 'قواعد ایمنی برای بسته‌های برند',
          body: 'بستهٔ برند هرگز رنگ یا فاصلهٔ خام در CSS نمی‌نویسد و تمام سطوح خود را روی توکن‌های معنایی --nds-* بنا می‌کند تا در حالت روشن، تیره و کنتراست بالا (forced-colors) یکپارچه بماند.',
          bullets: [
            'نسبت کنتراست متن ≥ ۴٫۵:۱ و اجزای رابط ≥ ۳:۱ در هر دو حالت.',
            'استفادهٔ انحصاری از ویژگی‌های منطقی CSS (margin-inline-start، padding-block).',
            'تضمین هدف لمسی دست‌کم ۴۴×۴۴ پیکسل در تمام پیوندها و دکمه‌ها.',
          ],
        },
      ],
      relatedLinks: [
        { label: 'توکن‌های رنگ', to: '/foundations/color' },
        { label: 'همهٔ توکن‌ها', to: '/tokens' },
      ],
    },
  ],
};

export default dummyBrandDocsManifest;
