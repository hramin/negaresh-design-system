import type { ChartMessages } from './types.ts';

/** Default Persian (fa-IR) message catalogue for `@negaresh/charts` (D-94). */
export const faChartMessages: ChartMessages = {
  dataTableToggle: 'جدول داده‌ها',
  dataTableCaption: 'جدول داده‌های نمودار',
  legendLabel: 'راهنمای نمودار',
  loadingChart: 'در حال بارگذاری نمودار',
  emptyTitle: 'داده‌ای برای نمایش وجود ندارد',
  emptyDescription: 'پس از ثبت اطلاعات، نمودار در این بخش نمایش داده می‌شود.',
  errorTitle: 'نمایش نمودار ممکن نشد',
  errorDescription: 'در بارگذاری داده‌های نمودار خطایی رخ داد. دوباره تلاش کنید.',
  retry: 'تلاش دوباره',
  inspectHint: 'برای مشاهدهٔ جزئیات هر نقطه، با صفحه‌کلید یا اشاره‌گر روی آن بروید.',
  intervalReadout: (label, value, low, high, band) => {
    const parts = [`${label}: ${value}`];
    if (low !== undefined && high !== undefined) {
      parts.push(`بازهٔ اطمینان ${low} تا ${high}`);
    }
    if (band !== undefined && band.length > 0) {
      parts.push(band);
    }
    return parts.join(' — ');
  },
  pointReadout: (series, category, value) => `${series} · ${category}: ${value}`,
  singlePointReadout: (category, value) => `${category}: ${value}`,
  columnCategory: 'دسته',
  columnScale: 'مقیاس',
  columnValue: 'مقدار',
  columnInterval: 'بازهٔ اطمینان',
  columnBand: 'بازه / وضعیت',
  columnSeries: 'سری',
  rangeBetween: (low, high) => `${low} تا ${high}`,
  missingValue: '—',
  severityProfessional: {
    ok: 'در محدودهٔ طبیعی',
    caution: 'نیازمند توجه',
    severe: 'بالاتر از آستانهٔ بالینی',
  },
  severityCalm: {
    ok: 'در بازهٔ معمول',
    caution: 'کمی بالاتر از معمول',
    severe: 'قابل توجه؛ گفت‌وگو با متخصص پیشنهاد می‌شود',
  },
};
