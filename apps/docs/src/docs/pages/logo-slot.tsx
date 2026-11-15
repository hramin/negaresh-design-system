import { LogoSlot, Stack } from '@negaresh/react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';

export const logoSlotDoc: ComponentDoc = {
  slug: 'logo-slot',
  title: 'جای لوگو',
  components: ['LogoSlot'],
  summary:
    'هسته فقط جای لوگو را تعریف می‌کند (D-14، D-37): نشان، نام و برچسب محصول با فضای خالی. تا رسیدن لوگوهای تازه (Q-02) جای‌نما نشان داده می‌شود.',
  status: 'review',
  products: ['R', 'N', 'T', 'V'],
  Example: () => <LogoSlot name="نگارش برتر" product="رجیستری" />,
  Gallery: () => (
    <>
      <GalleryRow title="اندازه‌ها">
        {(['sm', 'md', 'lg'] as const).map((s) => (
          <State key={s} label={s}>
            <LogoSlot size={s} name="نگارش برتر" />
          </State>
        ))}
      </GalleryRow>
      <GalleryRow title="ترکیب‌ها">
        <State label="فقط نشان">
          <LogoSlot />
        </State>
        <State label="نشان + نام + محصول (محصول در موبایل پنهان)">
          <Stack>
            <LogoSlot name="نگارش برتر" product="پلتفرم آزمون" />
          </Stack>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: ['لوگو را داخل یک پیوند به صفحهٔ اصلی بگذارید و به پیوند نام بدهید.'],
    dont: ['تصویر یا هنر نقاشی‌شده در هسته؛ هنر روانما در brand-ravanma است.'],
  },
  api: [
    {
      name: 'LogoSlot',
      props: [
        { name: 'logo', type: 'ReactNode', description: 'نشان از کیت برند؛ بدون آن جای‌نما.' },
        { name: 'name', type: 'ReactNode', description: 'نام شرکت.' },
        { name: 'product', type: 'ReactNode', description: 'برچسب محصول بعد از جداکننده.' },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          default: "'md'",
          description: '۲۴، ۳۲، ۴۸ پیکسل.',
        },
      ],
    },
  ],
  a11y: ['تزئینی است؛ نام دسترس‌پذیر را پیوند اطرافش می‌دهد.'],
  rtl: ['ترتیب نشان → نام → محصول از سمت شروع (راست).'],
};
