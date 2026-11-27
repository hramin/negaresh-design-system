import { Image } from '@negaresh/react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './overlays.module.css';

const SAMPLE_WIDE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><rect width="640" height="360" fill="%23f4efe7"/><circle cx="140" cy="180" r="88" fill="%23dcecea"/><rect x="260" y="110" width="310" height="24" rx="12" fill="%231d6b66"/><rect x="260" y="156" width="240" height="16" rx="8" fill="%238cc0ba"/><rect x="260" y="190" width="190" height="16" rx="8" fill="%23cbbfae"/></svg>';

const SAMPLE_SQUARE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320"><rect width="320" height="320" fill="%23eef6f5"/><rect x="64" y="64" width="192" height="192" rx="24" fill="%23b7d8d4"/><circle cx="160" cy="160" r="52" fill="%231d6b66"/></svg>';

function Example() {
  return (
    <div className={styles.block} data-interactive="image">
      <Image
        src={SAMPLE_WIDE}
        alt="نمونهٔ تصویر گزارش ارزیابی روان‌سنجی نگارش"
        ratio="16/9"
        radius="lg"
        sizes="(max-width: 900px) 100vw, 520px"
        caption="نسبت تصویر ۱۶:۹ با رزرو فضا پیش از بارگذاری برای جلوگیری از پرش چیدمان (CLS)."
      />
    </div>
  );
}

export const imageDoc: ComponentDoc = {
  slug: 'image',
  title: 'تصویر (Image)',
  components: ['Image'],
  summary:
    'کامپوننت تصویر واکنش‌گرا با نسبت تصویر ثابت (aspect-ratio)، ویژگی‌های sizes/srcSet، بارگذاری تنبل پیش‌فرض، الزام تایپی alt و زیرنویس معنایی figure/figcaption.',
  status: 'approved',
  products: ['R', 'N', 'T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="نسبت‌های تصویر">
        <State label="۱۶:۹ (عریض · radius md)">
          <div className={styles.imageFrame}>
            <Image src={SAMPLE_WIDE} alt="تصویر با نسبت ۱۶ به ۹" ratio="16/9" radius="md" />
          </div>
        </State>
        <State label="۴:۳ (کارت · radius md)">
          <div className={styles.imageFrame}>
            <Image src={SAMPLE_WIDE} alt="تصویر با نسبت ۴ به ۳" ratio="4/3" radius="md" />
          </div>
        </State>
        <State label="۱:۱ (مربع · radius lg)">
          <div className={styles.imageFrame}>
            <Image src={SAMPLE_SQUARE} alt="تصویر مربع" ratio="1/1" radius="lg" />
          </div>
        </State>
      </GalleryRow>
      <GalleryRow title="تناسب و زیرنویس">
        <State label="contain با زیرنویس معنایی">
          <div className={styles.imageFrame}>
            <Image
              src={SAMPLE_SQUARE}
              alt="نمودار کامل بدون برش"
              ratio="16/9"
              fit="contain"
              radius="md"
              caption="حالت contain برای نمودارهایی که نباید برش بخورند."
            />
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'همیشه یک ratio مشخص تعیین کنید تا پیش از بارگذاری تصویر هیچ پرش چیدمانی (CLS) رخ ندهد.',
      'برای تصاویر اصلی بالای صفحه (LCP) مقدار loading="eager" و fetchPriority="high" بگذارید.',
      'برای تصاویر تزئینی صریحاً alt="" بدهید.',
    ],
    dont: [
      'متن جایگزین را خالی نگذارید مگر آنکه تصویر کاملاً تزئینی باشد.',
      'بهینه‌سازی سرور تصویر (sharp / imgproxy) در لایهٔ محصول انجام می‌شود، نه درون Image.',
    ],
  },
  a11y: [
    'ویژگی alt در تایپ TypeScript اجباری است تا هیچ تصویر محتوایی بدون متن جایگزین منتشر نشود.',
    'در خطای بارگذاری، قاب آرام با آیکون تصویر و همان نسبت ابعاد و برچسب دسترس‌پذیر نمایش داده می‌شود.',
  ],
  rtl: [
    'زیرنویس figcaption به صورت منطقی از ابتدا (راست در فارسی) تراز می‌شود.',
  ],
};
