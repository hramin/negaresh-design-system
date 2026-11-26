import { Button, Inline, Skeleton, Stack, Text } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './feedback.module.css';

function Example() {
  const [loading, setLoading] = useState(true);
  return (
    <div className={styles.block} data-interactive="skeleton">
      <Stack gap="4">
        <Button size="sm" variant="secondary" onPress={() => setLoading((v) => !v)}>
          {loading ? 'نمایش محتوای واقعی' : 'نمایش اسکلت بارگذاری'}
        </Button>
        <div aria-busy={loading}>
          {loading ? (
            <Stack gap="3">
              <Inline gap="3">
                <Skeleton variant="circle" size="sm" />
                <div className={styles.compact}>
                  <Skeleton variant="text" lines={2} />
                </div>
              </Inline>
              <Skeleton variant="block" size="sm" />
            </Stack>
          ) : (
            <Stack gap="1">
              <Text weight="bold">نگارش تست هوش ۴</Text>
              <Text size="sm" tone="muted">
                نسخهٔ دانلودی ویندوز · ۱ از ۳ فعال‌سازی مصرف‌شده
              </Text>
            </Stack>
          )}
        </div>
      </Stack>
    </div>
  );
}

export const skeletonDoc: ComponentDoc = {
  slug: 'skeleton',
  title: 'اسکلت بارگذاری (Skeleton)',
  components: ['Skeleton'],
  summary:
    'جایگزین آرام و هم‌شکل محتوا هنگام بارگذاری اولیه (خطوط متن، بلوک، دایره و ردیف‌های جدول) با پالس شفافیت ملایم و توقف کامل در حالت کاهش حرکت.',
  status: 'review',
  products: ['R', 'N', 'T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="گونه‌های اسکلت">
        <State label="خطوط متن (text)">
          <div className={styles.compact}>
            <Skeleton variant="text" lines={3} />
          </div>
        </State>
        <State label="بلوک (block — md)">
          <div className={styles.compact}>
            <Skeleton variant="block" size="md" />
          </div>
        </State>
        <State label="دایره (circle — sm / md / lg)">
          <Inline gap="3">
            <Skeleton variant="circle" size="sm" />
            <Skeleton variant="circle" size="md" />
            <Skeleton variant="circle" size="lg" />
          </Inline>
        </State>
        <State label="ردیف‌های جدول (table)">
          <div className={styles.block}>
            <Skeleton variant="table" rows={3} columns={4} />
          </div>
        </State>
        <State label="ایستا بدون انیمیشن">
          <div className={styles.compact}>
            <Skeleton variant="text" lines={2} isAnimated={false} />
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای کاهش پرش چیدمان (CLS) هنگام بارگذاری اولیهٔ کارت‌ها، فهرست‌ها و جداول استفاده کنید.',
      'روی ظرف والد صفت aria-busy="true" و در صورت نیاز یک پیام وضعیت دسترس‌پذیر قرار دهید.',
    ],
    dont: [
      'برای عملیات سریع زیر ۳۰۰ میلی‌ثانیه اسکلت نمایش ندهید تا صفحه چشمک نزند.',
    ],
  },
  api: [
    {
      name: 'Skeleton',
      props: [
        {
          name: 'variant',
          type: "'text' | 'block' | 'circle' | 'table'",
          default: "'text'",
          description: 'شکل جایگزین.',
        },
        { name: 'lines', type: 'number', default: '3', description: 'تعداد سطرها در حالت text.' },
        { name: 'rows / columns', type: 'number', default: '4 / 4', description: 'ابعاد شبکه در حالت table.' },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          default: "'md'",
          description: 'اندازهٔ توکن‌محور برای حالت‌های block و circle.',
        },
        {
          name: 'isAnimated',
          type: 'boolean',
          default: 'true',
          description: 'پالس آرام شفافیت (در prefers-reduced-motion: reduce به صورت خودکار خاموش می‌شود).',
        },
      ],
    },
  ],
  a11y: [
    'هر Skeleton دارای aria-hidden="true" است تا صفحه‌خوان‌ها عناصر تزئینی خالی را نخوانند.',
    'تنها از انیمیشن opacity استفاده می‌کند (motion-icons.md) و در prefers-reduced-motion: reduce کاملاً ایستا می‌شود.',
    'در forced-colors: active حاشیهٔ ۱ پیکسلی CanvasText جایگزین رنگ زمینه می‌شود.',
  ],
  rtl: [
    'خط پایانی حالت text با عرض ۶۵٪ از ابتدای خط (سمت راست در فارسی) تراز می‌شود.',
  ],
};
