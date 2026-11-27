import {
  Heading,
  Stack,
  Text,
  type TextSize,
  type TextTone,
  type TextWeight,
} from '@negaresh/react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';

const SIZES: TextSize[] = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'];
const WEIGHTS: TextWeight[] = ['regular', 'medium', 'semibold', 'bold', 'heavy'];
const TONES: TextTone[] = [
  'default',
  'muted',
  'subtle',
  'disabled',
  'accent',
  'success',
  'warning',
  'danger',
  'info',
];

export const typographyDoc: ComponentDoc = {
  slug: 'typography',
  title: 'متن و عنوان',
  components: ['Text', 'Heading'],
  summary:
    'متن با اندازه، وزن و رنگ توکنی. فارسی هرگز ایتالیک یا با فاصلهٔ حروف نمی‌شود؛ تأکید با وزن است.',
  status: 'approved',
  products: ['R', 'N', 'T', 'V'],
  Example: () => (
    <Stack gap="2">
      {/* Demo uses level 2 with the h1 look: a page has one h1 (the docs page title). */}
      <Heading level={2} size="3xl" weight="heavy">
        فعال‌سازی نرم‌افزار
      </Heading>
      <Text as="p" tone="muted" leading="text" measure>
        سریالی را که خریده‌اید وارد کنید تا کد فعال‌سازی ساخته شود. کد را در برنامه وارد می‌کنید و کار
        تمام است.
      </Text>
    </Stack>
  ),
  Gallery: () => (
    <>
      <GalleryRow title="اندازه‌ها">
        {SIZES.map((s) => (
          <State key={s} label={s}>
            <Text size={s}>نگارش</Text>
          </State>
        ))}
      </GalleryRow>
      <GalleryRow title="وزن‌ها">
        {WEIGHTS.map((w) => (
          <State key={w} label={w}>
            <Text weight={w}>آزمون هوش</Text>
          </State>
        ))}
      </GalleryRow>
      <GalleryRow title="رنگ‌ها">
        {TONES.map((t) => (
          <State key={t} label={t}>
            <Text tone={t}>متن نمونه</Text>
          </State>
        ))}
      </GalleryRow>
      <GalleryRow title="عنوان‌ها">
        {(
          [
            [1, '3xl', 'heavy'],
            [2, 'xl', 'bold'],
            [3, 'lg', 'bold'],
            [4, 'md', 'bold'],
          ] as const
        ).map(([l, size, weight]) => (
          <State key={l} label={`level={${l}} → ${size}`}>
            {/* Rendered one level below the page title so the docs page keeps a single h1. */}
            <Heading level={l === 1 ? 2 : l} size={size} weight={weight}>
              عنوان سطح {['۱', '۲', '۳', '۴'][l - 1]}
            </Heading>
          </State>
        ))}
      </GalleryRow>
    </>
  ),
  usage: {
    do: ['متن خواندنی (مقاله، تفسیر نتیجه) با leading="text" و measure.', 'اعداد جدول با tabular.'],
    dont: [
      'ایتالیک یا letter-spacing برای فارسی.',
      'انتخاب سطح عنوان برای اندازه؛ سطح ساختار سند است و اندازه جداگانه تنظیم می‌شود.',
    ],
  },
  a11y: [
    'سطح عنوان‌ها را پشت سر هم نگه دارید؛ یک h1 در هر صفحه.',
    'رنگ متن روی زمینه‌های رنگی از توکن fg همان وضعیت است.',
  ],
  rtl: ['متن‌های لاتین یا کد درون فارسی را با Ltr یا Code جدا کنید.'],
};
