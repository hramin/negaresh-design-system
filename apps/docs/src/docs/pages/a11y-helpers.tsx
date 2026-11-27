import { Button, SkipLink, Text, VisuallyHidden } from '@negaresh/react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';

export const a11yHelpersDoc: ComponentDoc = {
  slug: 'a11y-helpers',
  title: 'کمک‌های دسترس‌پذیری',
  components: ['SkipLink', 'VisuallyHidden'],
  summary:
    'SkipLink اولین عنصر قابل فوکوس صفحه است و از سرصفحه می‌پرد؛ VisuallyHidden متنی برای صفحه‌خوان نگه می‌دارد که دیده نمی‌شود.',
  status: 'approved',
  products: ['R', 'N', 'T', 'V'],
  Example: () => (
    <Text as="p" size="sm" tone="muted">
      در همین صفحه کلید Tab را بزنید: اولین چیزی که می‌بینید «پرش به محتوا» است.
    </Text>
  ),
  Gallery: () => (
    <>
      <GalleryRow title="SkipLink (در حالت فوکوس دیده می‌شود)">
        <State label="target='main'">
          <div
            style={{
              position: 'relative',
              blockSize: 'var(--nds-control-lg)',
              inlineSize: 'calc(var(--nds-space-24) * 2)',
            }}
          >
            <SkipLink target="main" />
          </div>
        </State>
      </GalleryRow>
      <GalleryRow title="VisuallyHidden">
        <State label="نام دکمه برای صفحه‌خوان کامل‌تر است">
          <Button>
            حذف<VisuallyHidden> کوپن «بهار۱۴۰۵»</VisuallyHidden>
          </Button>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: ['SkipLink اولین فرزند body؛ main با id="main".'],
    dont: ['VisuallyHidden برای پنهان کردن برچسب فیلدها؛ برچسب باید دیده شود.'],
  },
  keyboard: [{ keys: 'Tab (اولین بار)', action: 'نمایش «پرش به محتوا»؛ Enter به main می‌رود.' }],
  a11y: ['متن SkipLink از کاتالوگ پیام‌ها می‌آید (skipToContent).'],
  rtl: ['در گوشهٔ شروع (بالا راست) ظاهر می‌شود.'],
};
