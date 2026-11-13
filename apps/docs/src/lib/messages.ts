/**
 * Site chrome strings. A stand-in for the Paraglide message catalogue, which arrives
 * with the first components that need it; page content lives in the route files.
 */
export const m = {
  siteName: 'دیزاین سیستم نگرش',
  siteNameLatin: 'Negaresh Design System',
  skipToContent: 'رفتن به محتوای اصلی',
  navLabel: 'بخش‌های سایت',
  navGroups: {
    start: 'شروع',
    foundations: 'مبانی',
    components: 'کامپوننت‌ها',
    reference: 'صفحه‌های مرجع',
  },
  nav: {
    overview: 'معرفی',
    tokens: 'توکن‌ها',
    color: 'رنگ',
    icons: 'آیکون‌ها',
    components: 'همهٔ کامپوننت‌ها',
    reference: 'فعال‌سازی رجیستری',
  },
  /** Footer build stamp: «build <branch>@<short sha>» (Latin, LTR: it is a code). */
  build: (branch: string, sha: string) => `build ${branch}@${sha}`,
  notFound: {
    title: 'این صفحه پیدا نشد',
    body: 'نشانی را بررسی کنید یا از فهرست کناری به بخش دیگری بروید.',
  },
  theme: {
    legend: 'حالت نمایش',
    system: 'سیستم',
    light: 'روشن',
    dark: 'تیره',
  },
} as const;
