import { iconCheck, iconLink, iconShield } from '@negaresh/icons';
import { Badge, Inline } from '@negaresh/react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './feedback.module.css';

function Example() {
  return (
    <div className={styles.block} data-interactive="badge">
      <Inline gap="2">
        <Badge tone="accent" size="sm" icon={iconLink}>
          باز شده از برنامه
        </Badge>
        <Badge tone="success" icon={iconCheck}>
          تأییدشده
        </Badge>
        <Badge tone="info" dot>
          نسخهٔ آزمایشی
        </Badge>
        <Badge tone="neutral">ویندوز</Badge>
      </Inline>
    </div>
  );
}

export const badgeDoc: ComponentDoc = {
  slug: 'badge',
  title: 'نشان (Badge)',
  components: ['Badge'],
  summary:
    'برچسب کپسولی غیرتعاملی برای نمایش دسته‌بندی، منبع باز شدن یا وضعیت کوتاه در شش لحن و دو اندازه، با نقطه یا آیکن اختیاری.',
  status: 'approved',
  products: ['R', 'N', 'T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="لحن‌ها (اندازهٔ متوسط)">
        <State label="خنثی">
          <Badge tone="neutral">پیش‌نویس</Badge>
        </State>
        <State label="تأکیدی (accent)">
          <Badge tone="accent" icon={iconLink}>
            باز شده از برنامه
          </Badge>
        </State>
        <State label="اطلاع">
          <Badge tone="info">در حال بررسی</Badge>
        </State>
        <State label="موفق">
          <Badge tone="success" icon={iconCheck}>
            فعال
          </Badge>
        </State>
        <State label="هشدار">
          <Badge tone="warning">نیاز به توجه</Badge>
        </State>
        <State label="خطا">
          <Badge tone="danger">نامعتبر</Badge>
        </State>
      </GalleryRow>
      <GalleryRow title="اندازه و نشانگر نقطه‌ای">
        <State label="کوچک (sm)">
          <Inline gap="2">
            <Badge size="sm" tone="accent" icon={iconLink}>
              باز شده از برنامه
            </Badge>
            <Badge size="sm" tone="neutral">
              نسخهٔ ۴
            </Badge>
          </Inline>
        </State>
        <State label="با نقطه (dot)">
          <Inline gap="2">
            <Badge tone="success" dot>
              آنلاین
            </Badge>
            <Badge tone="warning" dot>
              در انتظار
            </Badge>
            <Badge tone="info" dot>
              همگام‌سازی
            </Badge>
          </Inline>
        </State>
        <State label="با آیکن سفارشی">
          <Badge tone="accent" icon={iconShield}>
            دارای مجوز
          </Badge>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای برچسب‌های کوتاه یک تا سه‌کلمه‌ای کنار عنوان، ردیف جدول یا کارت استفاده کنید.',
      'برای وضعیت‌های استاندارد دامنه (سفارش، پرداخت، سریال و …) از StatusBadge استفاده کنید.',
    ],
    dont: [
      'نشان را به عنوان دکمهٔ کلیک‌پذیر یا تگ حذف‌شدنی به کار نبرید؛ برای برچسب تعاملی از TagGroup استفاده کنید.',
      'نقطهٔ رنگی را بدون متن نمایش ندهید.',
    ],
  },
  a11y: [
    'نشان غیرتعاملی است و با متن خوانا همراه می‌شود تا معنا تنها به رنگ متکی نباشد.',
    'آیکن و نقطهٔ تزئینی با aria-hidden="true" علامت‌گذاری شده‌اند.',
    'در حالت کنتراست بالا و forced-colors حاشیهٔ واضح currentColor / CanvasText اضافه می‌شود.',
  ],
  rtl: [
    'آیکن یا نقطه در ابتدای خط (سمت راست در فارسی) و متن پس از آن قرار می‌گیرند.',
  ],
};
