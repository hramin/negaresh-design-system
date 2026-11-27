import { iconCopy, iconDownload, iconPrint, iconShare } from '@negaresh/icons';
import { Button, ButtonGroup, Divider, IconButton, Toolbar } from '@negaresh/react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';

export const buttonGroupDoc: ComponentDoc = {
  slug: 'button-group',
  title: 'گروه دکمه و نوار ابزار',
  components: ['ButtonGroup', 'Toolbar'],
  base: 'Toolbar',
  summary:
    'ButtonGroup فقط چیدمان است و هر دکمه توقف Tab خودش را دارد. Toolbar یک توقف Tab است و با کلیدهای جهت حرکت می‌کند.',
  status: 'approved',
  products: ['R', 'N', 'T', 'V'],
  Example: () => (
    <Toolbar aria-label="گزارش">
      <IconButton icon={iconPrint} aria-label="چاپ" />
      <IconButton icon={iconDownload} aria-label="دریافت PDF" />
      <Divider orientation="vertical" />
      <IconButton icon={iconShare} aria-label="اشتراک‌گذاری" />
    </Toolbar>
  ),
  Gallery: () => (
    <>
      <GalleryRow title="ButtonGroup">
        <State label='justify="start"'>
          <ButtonGroup>
            <Button variant="primary">ذخیره</Button>
            <Button variant="ghost">انصراف</Button>
          </ButtonGroup>
        </State>
        <State label="stackOnMobile">
          <ButtonGroup stackOnMobile>
            <Button variant="primary">پرداخت</Button>
            <Button>بازگشت</Button>
          </ButtonGroup>
        </State>
      </GalleryRow>
      <GalleryRow title="Toolbar">
        <State label="افقی">
          <Toolbar aria-label="ابزار">
            <IconButton icon={iconCopy} aria-label="کپی" />
            <IconButton icon={iconPrint} aria-label="چاپ" />
            <IconButton icon={iconShare} aria-label="اشتراک" />
          </Toolbar>
        </State>
        <State label="عمودی">
          <Toolbar aria-label="ابزار عمودی" orientation="vertical">
            <Button size="sm">بالا</Button>
            <Button size="sm">پایین</Button>
          </Toolbar>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: ['پانویس سطح‌ها: ButtonGroup.', 'ویرایشگرها و نوار گزارش: Toolbar با aria-label.'],
    dont: ['Toolbar برای دو دکمهٔ فرم؛ کاربر انتظار Tab دارد.'],
  },
  keyboard: [
    { keys: 'Tab', action: 'ورود به نوار ابزار / خروج از آن' },
    { keys: '← / →', action: 'عنصر بعدی / قبلی (در فارسی چپ = بعدی)' },
  ],
  a11y: ['Toolbar نقش toolbar و roving tabindex از React Aria دارد.'],
  rtl: ['کلیدهای جهت بر اساس locale فارسی برعکس می‌شوند.'],
};
