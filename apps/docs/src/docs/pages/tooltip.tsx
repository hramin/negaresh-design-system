import { iconCopy, iconDownload, iconPrint, iconRefresh } from '@negaresh/icons';
import { Button, IconButton, Inline, Tooltip, TooltipTrigger } from '@negaresh/react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './overlays.module.css';

function Example() {
  return (
    <div className={styles.block} data-interactive="tooltip">
      <Inline gap="2">
        <TooltipTrigger delay={150} closeDelay={100}>
          <IconButton icon={iconCopy} variant="secondary" aria-label="کپی کد فعال‌سازی" />
          <Tooltip placement="top">کپی کد فعال‌سازی</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger delay={150} closeDelay={100}>
          <IconButton icon={iconDownload} variant="secondary" aria-label="دانلود فایل CSV" />
          <Tooltip placement="bottom">دانلود فهرست به قالب CSV</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger delay={150} closeDelay={100}>
          <IconButton icon={iconPrint} variant="secondary" aria-label="چاپ نسخهٔ A4" />
          <Tooltip placement="start">چاپ گزارش در قطع A4</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger delay={150} closeDelay={100}>
          <Button variant="ghost" size="sm" iconStart={iconRefresh}>
            بروزرسانی
          </Button>
          <Tooltip placement="end">دریافت آخرین وضعیت از سرور</Tooltip>
        </TooltipTrigger>
      </Inline>
    </div>
  );
}

export const tooltipDoc: ComponentDoc = {
  slug: 'tooltip',
  title: 'راهنمای کوتاه (Tooltip)',
  components: ['TooltipTrigger', 'Tooltip'],
  base: 'TooltipTrigger, Tooltip, OverlayArrow',
  summary:
    'برچسب متنی کوتاه روی سطح معکوس (--nds-bg-inverse / --nds-fg-inverse، foundations/color.md) که با هاور ماوس و فوکوس کیبورد ظاهر می‌شود. هرگز برای اطلاعات حیاتی استفاده نمی‌شود.',
  status: 'review',
  products: ['R', 'N', 'T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="نمای سطح معکوس">
        <State label="ظاهر استاندارد (bg.inverse / fg.inverse + shadow.overlay)">
          <span className={styles.tooltipSample}>کپی کد فعال‌سازی</span>
        </State>
      </GalleryRow>
      <GalleryRow title="جهت‌های منطقی (روی دکمه‌ها هاور یا Tab کنید)">
        <State label="بالا (top)">
          <TooltipTrigger delay={0}>
            <Button size="sm">بالا</Button>
            <Tooltip placement="top">راهنمای بالای دکمه</Tooltip>
          </TooltipTrigger>
        </State>
        <State label="پایین (bottom)">
          <TooltipTrigger delay={0}>
            <Button size="sm">پایین</Button>
            <Tooltip placement="bottom">راهنمای پایین دکمه</Tooltip>
          </TooltipTrigger>
        </State>
        <State label="ابتدا (start)">
          <TooltipTrigger delay={0}>
            <Button size="sm">start</Button>
            <Tooltip placement="start">سمت راست در فارسی</Tooltip>
          </TooltipTrigger>
        </State>
        <State label="انتها (end)">
          <TooltipTrigger delay={0}>
            <Button size="sm">end</Button>
            <Tooltip placement="end">سمت چپ در فارسی</Tooltip>
          </TooltipTrigger>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'فقط متن کوتاه و غیرحیاتی (مانند توضیح دکمه‌های آیکونی) در Tooltip بگذارید.',
      'همیشه دکمهٔ آیکونی زیر Tooltip را به صورت مستقل با aria-label نام‌گذاری کنید.',
    ],
    dont: [
      'پیوند، دکمه یا اطلاعات ضروری فرم (مانند الگوی سریال یا خطا) را در Tooltip قرار ندهید؛ در دستگاه‌های لمسی هاور وجود ندارد.',
      'برای راهنمای غنی کنار برچسب فیلد از ContextualHelp استفاده کنید.',
    ],
  },
  api: [
    {
      name: 'TooltipTrigger',
      props: [
        { name: 'delay', type: 'number', default: '400', description: 'تأخیر نمایش هنگام هاور به میلی‌ثانیه.' },
        { name: 'closeDelay', type: 'number', default: '150', description: 'تأخیر پنهان شدن به میلی‌ثانیه.' },
        { name: 'isDisabled', type: 'boolean', default: 'false', description: 'غیرفعال کردن نمایش راهنما.' },
        { name: 'trigger', type: "'focus'", description: 'محدود کردن نمایش به فوکوس کیبورد.' },
      ],
    },
    {
      name: 'Tooltip',
      props: [
        { name: 'children', type: 'string | number', description: 'متن ساده و کوتاه (ساختار فقط-متن).' },
        { name: 'placement', type: "'top' | 'bottom' | 'start' | 'end'", default: "'top'", description: 'جایگذاری منطقی نسبت به محرک.' },
        { name: 'showArrow', type: 'boolean', default: 'true', description: 'نمایش پیکان هم‌رنگ سطح معکوس.' },
        { name: 'offset', type: 'number', default: '8', description: 'فاصلهٔ پیکسلی از محرک.' },
      ],
    },
  ],
  keyboard: [
    { keys: 'Tab', action: 'نمایش فوری راهنما هنگام فوکوس کیبورد روی محرک.' },
    { keys: 'Escape', action: 'پنهان کردن فوری راهنمای فعال.' },
  ],
  a11y: [
    'متن Tooltip از طریق aria-describedby به محرک پیوند می‌خورد و با کلید Escape بسته می‌شود (WCAG 1.4.13).',
    'تایپ children به string | number محدود شده تا کنترل تعاملی یا متن حیاتی طولانی داخل آن قرار نگیرد.',
    'در حالت forced-colors: active مرز CanvasText اضافه می‌شود تا در کنتراست بالا قابل تشخیص بماند.',
  ],
  rtl: [
    'جهت‌های start و end بر اساس راست‌به‌چپ بودن صفحه به راست و چپ نگاشت می‌شوند.',
  ],
};
