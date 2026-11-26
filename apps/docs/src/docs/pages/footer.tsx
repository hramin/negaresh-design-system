import { Badge, Footer, LogoSlot } from '@negaresh/react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './navigation.module.css';

const SAMPLE_GROUPS = [
  {
    id: 'products',
    title: 'محصولات',
    links: [
      { id: 'registry', label: 'رجیستری نرم‌افزار', href: '#registry' },
      { id: 'tests', label: 'پلتفرم آزمون', href: '#tests' },
      { id: 'courses', label: 'دوره‌های آموزشی', href: '#courses' },
    ],
  },
  {
    id: 'resources',
    title: 'منابع',
    links: [
      { id: 'articles', label: 'مقالات تخصصی', href: '#articles' },
      { id: 'experts', label: 'فهرست متخصصان', href: '#experts' },
      { id: 'guide', label: 'راهنمای فعال‌سازی', href: '#guide' },
    ],
  },
  {
    id: 'support',
    title: 'پشتیبانی',
    links: [
      { id: 'contact', label: 'تماس با ما', href: '#contact' },
      { id: 'faq', label: 'پرسش‌های متداول', href: '#faq' },
      { id: 'status', label: 'وضعیت سرویس‌ها', href: 'https://negaresh.ir', external: true },
    ],
  },
];

const LEGAL_LINKS = [
  { id: 'privacy', label: 'حریم خصوصی', href: '#privacy' },
  { id: 'terms', label: 'قوانین و مقررات', href: '#terms' },
];

function Example() {
  return (
    <div className={styles.frame} data-interactive="footer">
      <Footer
        as="div"
        brand={<LogoSlot name="نگارش برتر" product="پلتفرم روان‌سنجی" />}
        description="انتشار نرم‌افزارها، آزمون‌های استاندارد و دوره‌های تخصصی روان‌شناسی برای متخصصان و مراکز مشاوره."
        groups={SAMPLE_GROUPS}
        copyright="© ۱۴۰۵ نگارش برتر. همهٔ حقوق محفوظ است."
        legalLinks={LEGAL_LINKS}
        badges={<Badge tone="neutral">نماد اعتماد</Badge>}
      />
    </div>
  );
}

export const footerDoc: ComponentDoc = {
  slug: 'footer',
  title: 'پاورقی (Footer)',
  components: ['Footer', 'FooterGroup', 'FooterLink'],
  summary:
    'پاورقی معنایی صفحه با ستون برند، گروه‌های پیوند واکنش‌گرا، پیوندهای بیرونی دسترس‌پذیر و ردیف حقوقی جداشده با خط مویی (بدون سایهٔ ساکن، D-77).',
  status: 'review',
  products: ['N', 'T'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="سطح استاندارد (surface) و فرورفته (sunken)">
        <State label="surface · multi-column">
          <div className={styles.frame}>
            <Footer
              as="div"
              tone="surface"
              brand={<LogoSlot name="نگارش برتر" />}
              description="سامانهٔ یکپارچهٔ محصولات و خدمات تخصصی روان‌شناسی."
              groups={SAMPLE_GROUPS.slice(0, 2)}
              copyright="© ۱۴۰۵ نگارش برتر"
              legalLinks={LEGAL_LINKS}
            />
          </div>
        </State>
        <State label="sunken · compact legal only">
          <div className={styles.frame}>
            <Footer
              as="div"
              tone="sunken"
              copyright="© ۱۴۰۵ نگارش برتر — رجیستری نرم‌افزار"
              legalLinks={LEGAL_LINKS}
            />
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'در هر صفحه حداکثر یک Footer با تگ پیش‌فرض <footer> رندر کنید؛ برای پیش‌نمایش‌های توکار از as="div" استفاده کنید.',
      'برای پیوندهای خارجی ویژگی external را روشن کنید تا آیکن و توضیح صفحه‌خوان اضافه شود.',
    ],
    dont: [
      'ستون‌های پیوند را بیش از ۴ گروه نکنید تا خوانایی در دسکتاپ و موبایل حفظ شود.',
    ],
  },
  api: [
    {
      name: 'Footer',
      props: [
        { name: 'brand / description', type: 'ReactNode / ReactNode', description: 'جایگاه لوگو (LogoSlot) و توضیح کوتاه برند.' },
        { name: 'groups', type: 'readonly FooterGroupData[]', description: 'ستون‌های پیوند با عنوان و فهرست پیوندها.' },
        { name: 'copyright / legalLinks / badges', type: 'ReactNode / readonly FooterLinkData[] / ReactNode', description: 'ردیف حقوقی و نشان‌های اعتماد.' },
        { name: 'tone / size / as', type: "'surface' | 'sunken' / 'default' | 'wide' / 'footer' | 'div'", default: "'surface' / 'default' / 'footer'", description: 'پس‌زمینه، عرض کانتینر و تگ ریشه.' },
      ],
    },
  ],
  keyboard: [
    { keys: 'Tab / Shift+Tab', action: 'حرکت بین همهٔ پیوندهای ستون‌ها و ردیف حقوقی.' },
  ],
  a11y: [
    'تگ معنایی <footer> نقش contentinfo را به طور خودکار فراهم می‌کند.',
    'هر پیوند حداقل ۴۴ پیکسل ارتفاع لمسی دارد و هر ستون از لیست <ul> متصل به عنوان خود با aria-labelledby استفاده می‌کند.',
  ],
  rtl: [
    'ستون برند در ابتدای سطر (راست) و ستون‌های پیوند و نشان‌های اعتماد به ترتیب منطقی راست‌به‌چپ چیده می‌شوند.',
  ],
};
