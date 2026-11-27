import { Button, GlobalLoadingBar, Inline, Spinner, Stack, Text } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './feedback.module.css';

function Example() {
  const [loading, setLoading] = useState(true);
  return (
    <div className={styles.block} data-interactive="spinner">
      <Stack gap="4">
        <GlobalLoadingBar isLoading={loading} position="static" />
        <Inline gap="3">
          <Button
            size="sm"
            variant="secondary"
            onPress={() => setLoading((active) => !active)}
          >
            {loading ? 'توقف نوار بارگذاری' : 'شروع نوار بارگذاری'}
          </Button>
          {loading && (
            <Inline gap="2">
              <Spinner size="sm" decorative />
              <Text size="sm" tone="muted">
                در حال دریافت اطلاعات…
              </Text>
            </Inline>
          )}
        </Inline>
      </Stack>
    </div>
  );
}

export const spinnerDoc: ComponentDoc = {
  slug: 'spinner',
  title: 'چرخنده و نوار بارگذاری (Spinner / GlobalLoadingBar)',
  components: ['Spinner', 'GlobalLoadingBar'],
  summary:
    'شاخص بارگذاری دایره‌ای در سه اندازه برای بخش‌های کوچک و نوار باریک سراسری بالای صفحه برای ناوبری و بارگذاری مسیرها.',
  status: 'approved',
  products: ['R', 'N', 'T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="اندازه‌ها و لحن‌های Spinner">
        <State label="کوچک (sm)">
          <Spinner size="sm" label="بارگذاری کوچک" />
        </State>
        <State label="متوسط (md)">
          <Spinner size="md" label="بارگذاری متوسط" />
        </State>
        <State label="بزرگ (lg)">
          <Spinner size="lg" label="بارگذاری بزرگ" />
        </State>
        <State label="کم‌رنگ (muted)">
          <Spinner size="md" tone="muted" label="بارگذاری کم‌رنگ" />
        </State>
        <State label="معکوس (inverse)">
          <span className={styles.inverseSurface}>
            <Spinner size="md" tone="inverse" label="بارگذاری روی سطح تیره" />
          </span>
        </State>
      </GalleryRow>
      <GalleryRow title="نوار بارگذاری سراسری (GlobalLoadingBar)">
        <State label="نامعین (حالت پیش‌فرض ناوبری)">
          <div className={styles.compact}>
            <GlobalLoadingBar isLoading position="static" />
          </div>
        </State>
        <State label="معین (۷۰٪)">
          <div className={styles.compact}>
            <GlobalLoadingBar isLoading value={70} position="static" label="بارگذاری ۷۰ درصد" />
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای انتظارهای کوتاه در بخش‌های کوچک یا کنار متن وضعیت از Spinner استفاده کنید.',
      'وقتی متن مرئی «در حال بارگذاری…» کنار Spinner وجود دارد، decorative={true} بگذارید تا صفحه‌خوان متن را دوبار نخواند.',
      'برای گذار میان مسیرها از GlobalLoadingBar با position="fixed" در ریشهٔ برنامه استفاده کنید.',
    ],
    dont: [
      'برای بارگذاری کل ساختار یک کارت یا جدول از Spinner تنها استفاده نکنید؛ Skeleton تجربهٔ آرام‌تری می‌دهد.',
    ],
  },
  a11y: [
    'Spinner غیرتزئینی با role="status" و متن فارسی از NdsMessages وضعیت بارگذاری را اعلام می‌کند.',
    'GlobalLoadingBar با role="progressbar" و برچسب فارسی رندر می‌شود.',
    'در prefers-reduced-motion: reduce سرعت چرخش Spinner بسیار آرام و حرکت نوار سراسری متوقف می‌شود.',
  ],
  rtl: [
    'GlobalLoadingBar در جهت RTL از راست به چپ حرکت می‌کند و در حالت fixed تمام عرض viewport را با ویژگی‌های منطقی می‌پوشاند.',
  ],
};
