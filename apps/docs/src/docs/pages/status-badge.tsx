import { StatusBadge } from '@negaresh/react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './feedback.module.css';

function Example() {
  return (
    <div className={styles.block} data-interactive="status-badge">
      <div className={styles.statusList}>
        <StatusBadge domain="serial" status="active" />
        <StatusBadge domain="serial" status="limit_reached" />
        <StatusBadge domain="order" status="completed" />
        <StatusBadge domain="payment" status="failed" />
        <StatusBadge domain="review" status="scheduled" />
        <StatusBadge domain="report" status="ready" />
        <StatusBadge domain="campaign" status="full" />
      </div>
    </div>
  );
}

export const statusBadgeDoc: ComponentDoc = {
  slug: 'status-badge',
  title: 'نشان وضعیت دامنه (StatusBadge)',
  components: ['StatusBadge'],
  base: 'Badge',
  summary:
    'نگاشت نوع‌دار وضعیت‌های شش دامنهٔ محصولات نگارش (سفارش، پرداخت، سریال، بازبینی محتوا، گزارش و کارزار) به متن فارسی، آیکن و لحن یکسان.',
  status: 'review',
  products: ['R', 'N', 'T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="سفارش (order)">
        <State label="همهٔ وضعیت‌های سفارش">
          <div className={styles.statusList}>
            <StatusBadge domain="order" status="awaiting_payment" />
            <StatusBadge domain="order" status="paid" />
            <StatusBadge domain="order" status="processing" />
            <StatusBadge domain="order" status="shipped" />
            <StatusBadge domain="order" status="completed" />
            <StatusBadge domain="order" status="cancelled" />
            <StatusBadge domain="order" status="refunded" />
          </div>
        </State>
      </GalleryRow>
      <GalleryRow title="پرداخت (payment) و سریال (serial)">
        <State label="پرداخت">
          <div className={styles.statusList}>
            <StatusBadge domain="payment" status="pending" />
            <StatusBadge domain="payment" status="paid" />
            <StatusBadge domain="payment" status="failed" />
            <StatusBadge domain="payment" status="cancelled" />
            <StatusBadge domain="payment" status="refunded" />
          </div>
        </State>
        <State label="سریال">
          <div className={styles.statusList}>
            <StatusBadge domain="serial" status="active" />
            <StatusBadge domain="serial" status="unused" />
            <StatusBadge domain="serial" status="limit_reached" />
            <StatusBadge domain="serial" status="revoked" />
            <StatusBadge domain="serial" status="expired" />
          </div>
        </State>
      </GalleryRow>
      <GalleryRow title="بازبینی محتوا (review)، گزارش (report) و کارزار (campaign)">
        <State label="بازبینی محتوا">
          <div className={styles.statusList}>
            <StatusBadge domain="review" status="draft" />
            <StatusBadge domain="review" status="submitted" />
            <StatusBadge domain="review" status="changes_requested" />
            <StatusBadge domain="review" status="scheduled" />
            <StatusBadge domain="review" status="published" />
            <StatusBadge domain="review" status="unpublished" />
          </div>
        </State>
        <State label="گزارش آزمون">
          <div className={styles.statusList}>
            <StatusBadge domain="report" status="none" />
            <StatusBadge domain="report" status="pending" />
            <StatusBadge domain="report" status="ready" />
            <StatusBadge domain="report" status="failed" />
            <StatusBadge domain="report" status="purged" />
          </div>
        </State>
        <State label="کارزار">
          <div className={styles.statusList}>
            <StatusBadge domain="campaign" status="draft" />
            <StatusBadge domain="campaign" status="active" />
            <StatusBadge domain="campaign" status="full" />
            <StatusBadge domain="campaign" status="closed" />
            <StatusBadge domain="campaign" status="expired" />
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'در جداول مدیریت، صفحات جزئیات و کارت‌های پیگیری از StatusBadge استفاده کنید تا واژگان و رنگ‌ها در همهٔ محصولات یکسان بماند.',
      'آیکن معنایی را فعال نگه دارید تا وضعیت علاوه بر متن و رنگ با شکل هم قابل تشخیص باشد.',
    ],
    dont: [
      'متن وضعیت‌های استاندارد محصولات را به صورت دستی در کامپوننت‌های جداگانه بازنویسی نکنید.',
      'برای مقیاس شدت نتایج آزمون‌های روان‌شناسی از StatusBadge استفاده نکنید؛ نتایج آزمون مقیاس آرام اختصاصی خود را در P5 دارند.',
    ],
  },
  api: [
    {
      name: 'StatusBadge',
      props: [
        {
          name: 'domain',
          type: "'order' | 'payment' | 'serial' | 'review' | 'report' | 'campaign'",
          description: 'دامنهٔ کسب‌وکار برای انتخاب جدول نگاشت.',
        },
        {
          name: 'status',
          type: 'OrderStatus | PaymentStatus | SerialStatus | ReviewStatus | ReportStatus | CampaignStatus',
          description: 'وضعیت نوع‌دار منطبق با domain انتخاب‌شده.',
        },
        {
          name: 'label',
          type: 'ReactNode',
          description: 'جایگزینی اختیاری برچسب فارسی خوانده‌شده از NdsMessages.',
        },
        { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'اندازهٔ نشان.' },
        {
          name: 'showIcon',
          type: 'boolean',
          default: 'true',
          description: 'نمایش آیکن نگاشت‌شده کنار واژهٔ وضعیت.',
        },
        { name: 'dot', type: 'boolean', default: 'false', description: 'نقطهٔ تزئینی در صورت نیاز.' },
      ],
    },
  ],
  a11y: [
    'هر وضعیت به صورت خودکار ترکیبی از واژهٔ فارسی، آیکن معنایی و لحن رنگی با کنتراست حداقل ۴٫۵:۱ نمایش می‌دهد.',
    'تمام برچسب‌ها از NdsMessages خوانده می‌شوند (D-94) و هیچ رشتهٔ فارسی سخت‌کدشده‌ای در کامپوننت وجود ندارد.',
  ],
  rtl: [
    'آیکن در ابتدای خط (راست) قرار می‌گیرد و برچسب‌های فارسی در جدول‌های فشرده به صورت تک‌خطی و منظم تراز می‌شوند.',
  ],
};
