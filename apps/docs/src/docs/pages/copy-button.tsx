import { Code, CopyButton, Inline, Stack } from '@negaresh/react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';

export const copyButtonDoc: ComponentDoc = {
  slug: 'copy-button',
  title: 'دکمهٔ کپی',
  components: ['CopyButton'],
  base: 'Button',
  summary:
    'مقدار نرمال‌شده (بدون فاصله) را کپی می‌کند، برچسب به «کپی شد» تغییر می‌کند و نتیجه در ناحیهٔ زندهٔ مؤدبانه اعلام می‌شود.',
  status: 'approved',
  products: ['R', 'N', 'T'],
  Example: () => (
    <Stack gap="3" align="center">
      <Code size="display">4417 9082 6153</Code>
      <CopyButton value="441790826153" variant="primary" aria-label="کپی کد فعال‌سازی">
        کپی کد
      </CopyButton>
    </Stack>
  ),
  Gallery: () => (
    <GalleryRow title="گونه‌ها">
      <State label="secondary (پیش‌فرض، برچسب از کاتالوگ)">
        <CopyButton value="N25AGEMV0K" />
      </State>
      <State label="primary با برچسب">
        <CopyButton value="441790826153" variant="primary">
          کپی کد
        </CopyButton>
      </State>
      <State label='size="sm"'>
        <Inline>
          <Code>882859354</Code>
          <CopyButton value="882859354" size="sm" variant="ghost" aria-label="کپی کد سیستم" />
        </Inline>
      </State>
    </GalleryRow>
  ),
  usage: {
    do: [
      'کنار هر کدی که کاربر باید جای دیگری وارد کند.',
      'وقتی برچسب مبهم است aria-label کامل بدهید: «کپی کد فعال‌سازی».',
    ],
    dont: ['کپی مقدار با فاصله یا خط تیرهٔ نمایشی.'],
  },
  keyboard: [{ keys: 'Enter / Space', action: 'کپی' }],
  a11y: [
    'اعلام «کپی شد» یا «کپی نشد…» با role="status".',
    'در خطا، متن را برای انتخاب دستی نگه دارید.',
  ],
  rtl: ['آیکون کپی قرینه نمی‌شود.'],
};
