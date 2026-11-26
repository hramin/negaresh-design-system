import { Sparkline } from '@negaresh/charts';
import { iconKey, iconReceipt, iconShield } from '@negaresh/icons';
import { Stack, StatGroup, StatTile, Text } from '@negaresh/react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './charts.module.css';

function Example() {
  return (
    <div className={styles.wide} data-interactive="sparkline-chart">
      <Stack gap="4">
        <StatGroup columns={3} aria-label="شاخص‌های رجیستری همراه با نمودارک روند">
          <StatTile
            label="فعال‌سازی هفتگی"
            value={312}
            icon={iconKey}
            delta={{ value: '۱۴٪', direction: 'up', label: '۷ روز اخیر' }}
            sparkline={
              <Sparkline
                values={[28, 34, 31, 40, 44, 42, 53]}
                baseline={38}
                tone="positive"
                summary="روند صعودی هفتگی از ۲۸ به ۵۳ فعال‌سازی"
              />
            }
          />
          <StatTile
            label="فروش هفته"
            value={14850000}
            format="toman"
            icon={iconReceipt}
            delta={{ value: '۸٫۴٪', direction: 'up', label: 'میانگین روزانه' }}
            sparkline={
              <Sparkline
                values={[18, 21, 19, 24, 23, 27, 29]}
                tone="accent"
                summary="روند صعودی فروش در ۷ روز اخیر"
              />
            }
          />
          <StatTile
            label="خطاهای اعتبارسنجی"
            value={19}
            icon={iconShield}
            delta={{
              value: '۹٪',
              direction: 'down',
              sentiment: 'negative',
              label: 'افزایش نسبت به هفتهٔ قبل',
            }}
            sparkline={
              <Sparkline
                values={[8, 10, 9, 13, 15, 17, 19]}
                baseline={12}
                tone="negative"
                summary="روند افزایشی خطاهای اعتبارسنجی از ۸ به ۱۹ مورد"
              />
            }
          />
        </StatGroup>
        <Text size="xs" tone="subtle">
          Sparkline بدون هیچ وابستگی معکوس به `@negaresh/react` در جایگاه `sparkline` کامپوننت
          `StatTile` قرار می‌گیرد.
        </Text>
      </Stack>
    </div>
  );
}

export const sparklineDoc: ComponentDoc = {
  slug: 'sparkline',
  title: 'نمودارک روند (Sparkline)',
  components: ['Sparkline'],
  summary:
    'نمودار خطی فشرده و بدون محور برای نمایش روند کوتاه داخل StatTile؛ همیشه همراه با خلاصهٔ متنی دسترس‌پذیر (summary).',
  status: 'review',
  products: ['R', 'N', 'T'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="اندازه‌ها و لحن‌های معنایی">
        <State label="sm / md / lg · accent / positive / negative / neutral">
          <div className={styles.sparkRow}>
            <Sparkline size="sm" tone="accent" values={[12, 16, 14, 19, 22]} summary="روند صعودی کوچک" />
            <Sparkline
              size="md"
              tone="positive"
              values={[18, 20, 24, 23, 29, 34]}
              baseline={24}
              summary="روند مثبت با خط مبنا"
            />
            <Sparkline
              size="md"
              tone="negative"
              values={[30, 28, 26, 22, 20, 16]}
              summary="روند نزولی"
            />
            <Sparkline
              size="lg"
              tone="neutral"
              values={[15, 16, 15, 17, 16, 16]}
              baseline={16}
              summary="روند پایدار"
            />
          </div>
        </State>
      </GalleryRow>

      <GalleryRow title="ترکیب زنده داخل StatTile">
        <State label="StatTile + Sparkline">
          <div className={styles.wide}>
            <StatGroup columns={2} aria-label="گالری ترکیب StatTile و Sparkline">
              <StatTile
                label="آزمون‌های تکمیل‌شده"
                value={428}
                delta={{ value: '۱۱٪', direction: 'up', label: 'این هفته' }}
                sparkline={
                  <Sparkline
                    values={[45, 52, 50, 61, 68, 72, 80]}
                    tone="positive"
                    summary="رشد آزمون‌های تکمیل‌شده از ۴۵ به ۸۰"
                  />
                }
              />
              <StatTile
                label="میانگین زمان پاسخ"
                value={14}
                unit="دقیقه"
                delta={{ value: '۰٪', direction: 'neutral', label: 'پایدار' }}
                sparkline={
                  <Sparkline
                    values={[14, 15, 14, 14, 13, 14, 14]}
                    tone="neutral"
                    baseline={14}
                    summary="میانگین زمان پاسخ پایدار در حدود ۱۴ دقیقه"
                  />
                }
              />
            </StatGroup>
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'همیشه یک summary کوتاه و دقیق فارسی برای صفحه‌خوان بنویسید (مثلاً «روند صعودی از ۲۸ به ۵۳»).',
      'از Sparkline درون جایگاه sparkline کامپوننت StatTile برای نشان دادن جهت کلی روند استفاده کنید.',
    ],
    dont: [
      'برای مقایسهٔ دقیق اعداد یا نمایش محورها و خطوط آستانه از Sparkline استفاده نکنید؛ ProfileLine یا Bar انتخاب درست است.',
    ],
  },
  api: [
    {
      name: 'Sparkline',
      props: [
        { name: 'values', type: 'readonly number[]', description: 'آرایهٔ مرتب مقادیر (قدیمی‌ترین به جدیدترین).' },
        { name: 'summary', type: 'string', description: 'خلاصهٔ متنی الزامی برای aria-label و <title>.' },
        { name: 'tone', type: "'accent' | 'positive' | 'negative' | 'neutral' | 1..6", default: "'accent'", description: 'لحن رنگ خط.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'اندازهٔ فشردهٔ نمودارک.' },
        { name: 'baseline', type: 'number', description: 'مقدار اختیاری خط مبنای نقطه‌چین.' },
        { name: 'highlightLast', type: 'boolean', default: 'true', description: 'نمایش نقطهٔ پایانی روی آخرین مقدار.' },
      ],
    },
  ],
  a11y: [
    'SVG دارای role="img"، aria-label={summary} و عنصر <title> است تا کاربران صفحه‌خوان خلاصهٔ روند را بشنوند.',
    'بدون نیاز به جاوااسکریپت روی سرور رندر می‌شود و در حالت forced-colors با CanvasText خواناست.',
  ],
  rtl: [
    'در حالت RTL قدیمی‌ترین نقطه در سمت راست و جدیدترین نقطه در سمت چپ (پایان خوانش) قرار می‌گیرد.',
  ],
};
