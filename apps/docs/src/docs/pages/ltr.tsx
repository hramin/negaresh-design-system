import { Code, Ltr, Stack, Text } from '@negaresh/react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';

export const ltrDoc: ComponentDoc = {
  slug: 'ltr-code',
  title: 'جزیرهٔ چپ‌به‌راست و کد',
  components: ['Ltr', 'Code'],
  summary:
    'سریال، کد سیستم، کد فعال‌سازی، شمارهٔ سفارش، نشانی وب و ایمیل چپ‌به‌راست و با ارقام لاتین نمایش داده می‌شوند (D-86).',
  status: 'approved',
  products: ['R', 'N', 'T', 'V'],
  Example: () => (
    <Stack gap="2">
      <Text as="p">
        سریال <Code>N25AG-EMV0K</Code> برای «نگارش تست هوش ۴» ثبت شد.
      </Text>
      <Text as="p">
        پاسخ به <Ltr>support@negaresh.ir</Ltr> فرستاده می‌شود.
      </Text>
    </Stack>
  ),
  Gallery: () => (
    <>
      <GalleryRow title="Code">
        <State label="inline">
          <Text>
            کد سیستم <Code>882859354</Code>
          </Text>
        </State>
        <State label="ارقام فارسی ورودی → لاتین">
          <Code>{'۴۴۱۷ ۹۰۸۲ ۶۱۵۳'}</Code>
        </State>
        <State label='size="display"'>
          <Code size="display">4417 9082 6153</Code>
        </State>
      </GalleryRow>
      <GalleryRow title="Ltr">
        <State label="نشانی وب در متن فارسی">
          <Text>
            به <Ltr>negaresh.ir/registry</Ltr> بروید.
          </Text>
        </State>
        <State label='lang="en"'>
          <Text>
            نسخهٔ <Ltr lang="en">Negaresh IQ 4</Ltr>
          </Text>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'هر کدی که کاربر جای دیگری تایپ می‌کند Code باشد.',
      'برای کپی، مقدار نرمال‌شده بدون فاصله را به CopyButton بدهید.',
    ],
    dont: ['ارقام فارسی در کدها.', 'رشته‌های مختلط بدون جدا کردن؛ ترتیب کلمات به هم می‌ریزد.'],
  },
  a11y: ['dir="ltr" و translate="no" روی کد؛ صفحه‌خوان کد را بی‌تغییر می‌خواند.'],
  rtl: ['unicode-bidi: isolate تا جزیره ترتیب کلمات اطراف را به هم نزند.'],
};
