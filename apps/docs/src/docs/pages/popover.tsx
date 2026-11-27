import {
  Button,
  Inline,
  Popover,
  PopoverTrigger,
  Stack,
  Text,
} from '@negaresh/react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './overlays.module.css';

function Example() {
  return (
    <div className={styles.block} data-interactive="popover">
      <Inline gap="2">
        <PopoverTrigger>
          <Button variant="primary">نمایش پاپ‌اور با پیکان</Button>
          <Popover title="منبع سقف فعال‌سازی" showArrow placement="bottom start">
            {(close) => (
              <Stack gap="3">
                <Text as="p" size="sm" tone="muted" leading="text">
                  این سریال از سقف پیش‌فرض محصول (۳ دستگاه) پیروی می‌کند و برای تغییر آن می‌توانید
                  از تنظیمات مشتری اقدام کنید.
                </Text>
                <Inline gap="2">
                  <Button size="sm" variant="secondary" onPress={close}>
                    متوجه شدم
                  </Button>
                </Inline>
              </Stack>
            )}
          </Popover>
        </PopoverTrigger>

        <PopoverTrigger>
          <Button variant="secondary">پاپ‌اور بدون پیکان</Button>
          <Popover aria-label="یادداشت کوتاه" placement="top">
            <Text as="p" size="sm" leading="text">
              پاپ‌اور ساده برای محتوای تعاملی یا توضیحات چندخطی کنار کنترل‌ها.
            </Text>
          </Popover>
        </PopoverTrigger>
      </Inline>
    </div>
  );
}

export const popoverDoc: ComponentDoc = {
  slug: 'popover',
  title: 'پنجرهٔ شناور (Popover)',
  components: ['Popover', 'PopoverTrigger'],
  base: 'Popover, OverlayArrow, Dialog, DialogTrigger',
  summary:
    'لایهٔ شناور متصل به محرک بر پایهٔ React Aria با سایهٔ --nds-shadow-overlay، پیکان اختیاری و جایگذاری منطقی سازگار با راست‌به‌چپ.',
  status: 'approved',
  products: ['R', 'N', 'T', 'V'],
  Example,
  Gallery: () => (
    <GalleryRow title="جایگذاری منطقی و پیکان">
      <State label="پایین · شروع (bottom start)">
        <PopoverTrigger>
          <Button size="sm">bottom start</Button>
          <Popover placement="bottom start" showArrow title="جایگذاری bottom start">
            تراز با لبهٔ راست در فارسی.
          </Popover>
        </PopoverTrigger>
      </State>
      <State label="بالا (top)">
        <PopoverTrigger>
          <Button size="sm">top</Button>
          <Popover placement="top" showArrow title="جایگذاری top">
            در صورت کمبود فضا به طور خودکار برمی‌گردد.
          </Popover>
        </PopoverTrigger>
      </State>
      <State label="انتهای سطر (end)">
        <PopoverTrigger>
          <Button size="sm">end</Button>
          <Popover placement="end" showArrow title="جایگذاری end">
            در فارسی در سمت چپ دکمه باز می‌شود.
          </Popover>
        </PopoverTrigger>
      </State>
    </GalleryRow>
  ),
  usage: {
    do: [
      'برای جزئیات تکمیلی، تنظیمات سریع یا محتوای دارای پیوند و دکمه کنار یک کنترل استفاده کنید.',
      'وقتی عنوان دیداری ندارید، حتماً aria-label بگذارید.',
    ],
    dont: [
      'برای راهنمای تک‌خطی متنی هنگام هاور از Popover استفاده نکنید؛ برای آن از Tooltip بهره ببرید.',
      'برای تصمیم‌های مسدودکننده از Dialog یا AlertDialog استفاده کنید.',
    ],
  },
  keyboard: [
    { keys: 'Enter / Space', action: 'باز کردن پاپ‌اور از روی محرک.' },
    { keys: 'Tab / Shift+Tab', action: 'حرکت بین کنترل‌های داخلی پاپ‌اور.' },
    { keys: 'Escape', action: 'بستن پاپ‌اور و بازگشت فوکوس به محرک.' },
  ],
  a11y: [
    'بر پایهٔ React Aria Popover و Dialog با بازگشت فوکوس به محرک و دکمهٔ پنهان بستن برای صفحه‌خوان‌های لمسی (بومی‌سازی‌شده به فارسی، D-97).',
    'دارای سایهٔ لایهٔ شناور (--nds-shadow-overlay) و مرز ۱ پیکسلی که در forced-colors: active به CanvasText تغییر می‌کند.',
  ],
  rtl: [
    'مقادیر منطقی start و end بر اساس جهت صفحه به راست و چپ ترجمه می‌شوند.',
    'پیکان OverlayArrow بر اساس data-placement محاسبه‌شده به صورت خودکار می‌چرخد.',
  ],
};
