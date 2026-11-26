import { iconKey, iconReceipt, iconShield, iconUsers } from '@negaresh/icons';
import { Stack, StatGroup, StatTile, Text } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './data-display.module.css';

function SparklinePreview({ warn = false }: { warn?: boolean }) {
  return (
    <svg
      viewBox="0 0 80 28"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={warn ? styles.sparkSvgWarn : styles.sparkSvg}
    >
      <path
        d={
          warn
            ? 'M2 8 L16 10 L30 14 L44 12 L58 18 L78 23'
            : 'M2 24 L16 20 L30 17 L44 19 L58 10 L78 4'
        }
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Example() {
  const [selectedMetric, setSelectedMetric] = useState<string>('سریال‌های فعال');

  return (
    <div className={styles.wide} data-interactive="stat-tile">
      <Stack gap="4">
        <StatGroup columns={4} aria-label="شاخص‌های رجیستری">
          <StatTile
            label="سریال‌های فعال"
            value={1248}
            icon={iconKey}
            delta={{ value: '۱۲٪', direction: 'up', label: 'نسبت به ماه قبل' }}
            sparkline={<SparklinePreview />}
            onPress={() => setSelectedMetric('سریال‌های فعال')}
          />
          <StatTile
            label="فروش بستهٔ نرم‌افزار"
            value={14850000}
            format="toman"
            icon={iconReceipt}
            delta={{ value: '۸٫۴٪', direction: 'up', label: '۳۰ روز گذشته' }}
            onPress={() => setSelectedMetric('فروش بستهٔ نرم‌افزار')}
          />
          <StatTile
            label="نرخ فعال‌سازی موفق"
            value={94}
            format="percent"
            icon={iconShield}
            delta={{ value: '۰٪', direction: 'neutral', label: 'پایدار' }}
            onPress={() => setSelectedMetric('نرخ فعال‌سازی موفق')}
          />
          <StatTile
            label="سقف پر شده"
            value={37}
            unit="سریال"
            icon={iconUsers}
            delta={{
              value: '۶٪',
              direction: 'down',
              sentiment: 'positive',
              label: 'کاهش هشدارها',
            }}
            sparkline={<SparklinePreview warn />}
            onPress={() => setSelectedMetric('سقف پر شده')}
          />
        </StatGroup>
        <Text size="xs" tone="muted" className={styles.output}>
          کاشی انتخاب‌شده: {selectedMetric}
        </Text>
      </Stack>
    </div>
  );
}

export const statTileDoc: ComponentDoc = {
  slug: 'stat-tile',
  title: 'کاشی شاخص (StatTile · StatGroup)',
  components: ['StatTile', 'StatGroup'],
  summary:
    'نمایش شاخص‌های عددی کلیدی با ارقام هم‌عرض فارسی (tabular-nums)، روند تغییر همراه با آیکون و متن (هرگز رنگ به تنهایی)، و اسلات sparkline برای نمودارک‌های فاز P5.',
  status: 'review',
  products: ['R', 'N', 'T'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="گروه شاخص‌ها (مثبت، منفی، خنثی و جایگاه sparkline)">
        <State label="StatGroup · 3 columns">
          <div className={styles.wide}>
            <StatGroup columns={3} aria-label="گالری کاشی‌های شاخص">
              <StatTile
                label="فعال‌سازی امروز"
                value={312}
                icon={iconKey}
                delta={{ value: '۱۴٪', direction: 'up', label: 'نسبت به دیروز' }}
                sparkline={<SparklinePreview />}
              />
              <StatTile
                label="خطاهای فعال‌سازی"
                value={19}
                icon={iconShield}
                delta={{ value: '۳٪', direction: 'down', sentiment: 'negative', label: 'نیاز به بررسی' }}
              />
              <StatTile
                label="درآمد هفته"
                value={6420000}
                format="toman"
                delta={{ value: '۰٪', direction: 'neutral', label: 'بدون تغییر' }}
              />
            </StatGroup>
          </div>
        </State>
      </GalleryRow>
      <GalleryRow title="تراکم فشرده و حالت بارگذاری">
        <State label="compact · isLoading">
          <div className={styles.block}>
            <StatGroup columns={2}>
              <StatTile
                label="کاربران فعال"
                value={890}
                unit="نفر"
                density="compact"
                helperText="به‌روزرسانی لحظه‌ای"
              />
              <StatTile label="در حال دریافت آمار" value={0} isLoading />
            </StatGroup>
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای نمایش ارقام عددی از مقدار number استفاده کنید تا قالب‌بندی فارسی و tabular-nums خودکار اعمال شود.',
      'تغییر روند (delta) را همیشه با جهت آیکون، عدد و برچسب توضیحی همراه کنید تا به رنگ وابسته نباشد.',
      'نمودارک (Sparkline) فاز P5 را از طریق اسلات sparkline تزریق کنید تا مرز بستهٔ @negaresh/react حفظ شود.',
    ],
    dont: [
      'رنگ قرمز یا سبز را بدون آیکون جهت و متن برای نشان دادن رشد یا افت به کار نبرید.',
      'سایهٔ استراحت یا قاب تزئینی به کاشی‌ها اضافه نکنید (D-77).',
    ],
  },
  api: [
    {
      name: 'StatTile',
      props: [
        { name: 'label', type: 'ReactNode', description: 'عنوان شاخص در بالای کاشی.' },
        { name: 'value', type: 'number | ReactNode', description: 'مقدار شاخص (اعداد خودکار فارسی و tabular-nums می‌شوند).' },
        { name: 'format', type: "'number' | 'toman' | 'percent'", default: "'number'", description: 'قالب‌بندی عددی از @negaresh/utils.' },
        { name: 'delta', type: 'StatDelta', description: 'شاخص تغییر شامل value، direction (up/down/neutral)، sentiment و label.' },
        { name: 'sparkline', type: 'ReactNode', description: 'اسلات نمودارک برای یکپارچه‌سازی تمیز با @negaresh/charts در P5.' },
        { name: 'density', type: "'comfortable' | 'compact'", default: "'comfortable'", description: 'تراکم فاصله‌گذاری داخلی.' },
        { name: 'isLoading', type: 'boolean', default: 'false', description: 'نمایش Skeleton با aria-busy.' },
        { name: 'href / onPress', type: 'string / () => void', description: 'تبدیل کاشی به پیوند یا دکمهٔ دسترس‌پذیر.' },
      ],
    },
    {
      name: 'StatGroup',
      props: [
        { name: 'columns', type: "2 | 3 | 4 | 'auto'", default: "'auto'", description: 'تعداد ستون در دسکتاپ؛ زیر ۹۰۰ پیکسل به ۲ و در عرض باریک به ۱ ستون می‌شکند.' },
        { name: 'aria-label', type: 'string', description: 'برچسب گروه شاخص‌ها (نقش group).' },
      ],
    },
  ],
  keyboard: [
    { keys: 'Tab', action: 'حرکت بین کاشی‌های تعاملی (دارای href یا onPress).' },
    { keys: 'Enter / Space', action: 'اجرای اقدام یا باز کردن پیوند کاشی.' },
  ],
  a11y: [
    'هر روند تغییر پیشوند خوانشگر مخفی («افزایش:»، «کاهش:»، «بدون تغییر:») و آیکون جهت دارد.',
    'حالت بارگذاری ویژگی aria-busy="true" تنظیم می‌کند و کاشی‌های تعاملی حداقل ارتفاع ۴۴ پیکسل دارند.',
  ],
  rtl: [
    'گرید با ویژگی‌های منطقی چیده می‌شود و ارقام فارسی با font-variant-numeric: tabular-nums هم‌تراز می‌مانند.',
  ],
};
