import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardMedia,
  Heading,
  Image,
  Inline,
  Text,
  VerifiedBadge,
} from '@negaresh/react';
import { formatToman } from '@negaresh/utils';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './overlays.module.css';

const COVER_ILLUSTRATION =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><rect width="640" height="360" fill="%23eef6f5"/><rect x="48" y="54" width="220" height="20" rx="10" fill="%23b7d8d4"/><rect x="48" y="96" width="380" height="14" rx="7" fill="%23dcecea"/><rect x="48" y="138" width="544" height="168" rx="12" fill="%23fffdfa" stroke="%23b7d8d4" stroke-width="2"/><path d="M88 266 L190 210 L292 232 L410 174 L548 196" fill="none" stroke="%231d6b66" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function Example() {
  return (
    <div className={styles.wide} data-interactive="card">
      <Inline gap="4">
        <div className={styles.cardFrame}>
          <Card>
            <CardMedia>
              <Image
                src={COVER_ILLUSTRATION}
                alt="نمودار نمونهٔ نیمرخ آزمون شخصیت نئو"
                ratio="16/9"
              />
            </CardMedia>
            <CardBody>
              <Inline gap="2">
                <Badge tone="accent" size="sm">
                  آزمون بالینی
                </Badge>
                <VerifiedBadge size="sm" />
              </Inline>
              <Heading level={3}>آزمون شخصیت NEO-PI-R</Heading>
              <Text as="p" size="sm" tone="muted" leading="text">
                ارزیابی پنج عامل اصلی شخصیت با گزارش تفسیری آمادهٔ چاپ در قطع A4.
              </Text>
            </CardBody>
            <CardFooter tone="sunken">
              <Text weight="semibold" size="sm">
                {formatToman(380000)}
              </Text>
              <Button size="sm" variant="primary">
                مشاهدهٔ آزمون
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className={styles.cardFrame}>
          <Card href="#card-link-demo">
            <CardMedia>
              <Image
                src={COVER_ILLUSTRATION}
                alt="پیش‌نمایش مقالهٔ راهنمای تفسیر گزارش"
                ratio="16/9"
              />
            </CardMedia>
            <CardBody>
              <Badge tone="neutral" size="sm">
                کارت پیوندی
              </Badge>
              <Heading level={3}>راهنمای انتخاب نسخهٔ آرام یا حرفه‌ای گزارش</Heading>
              <Text as="p" size="sm" tone="muted" leading="text">
                کل کارت به عنوان یک پیوند دسترس‌پذیر بدون سایهٔ ثابت عمل می‌کند.
              </Text>
            </CardBody>
          </Card>
        </div>
      </Inline>
    </div>
  );
}

export const cardDoc: ComponentDoc = {
  slug: 'card',
  title: 'کارت (Card)',
  components: ['Card', 'CardMedia', 'CardBody', 'CardFooter'],
  base: 'Link (در حالت کارت پیوندی)',
  summary:
    'کارت عمومی با جایگاه‌های media، body و footer و گونهٔ کارت پیوندی تعاملی. مطابق D-77 تنها با تُن پس‌زمینه و یک خط مویی جدا می‌شود و سایهٔ ثابت ندارد.',
  status: 'approved',
  products: ['R', 'N', 'T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="گونه‌های سطح (بدون سایهٔ ثابت، D-77)">
        <State label="پیش‌فرض (default)">
          <div className={styles.cardFrame}>
            <Card variant="default">
              <CardBody>
                <Heading level={3}>کارت استاندارد</Heading>
                <Text as="p" size="sm" tone="muted">
                  پس‌زمینهٔ سطح و خط مویی ۱ پیکسلی.
                </Text>
              </CardBody>
              <CardFooter tone="sunken">
                <Text size="xs" tone="subtle">
                  بروزرسانی امروز
                </Text>
              </CardFooter>
            </Card>
          </div>
        </State>
        <State label="فرورفته (sunken)">
          <div className={styles.cardFrame}>
            <Card variant="sunken">
              <CardBody>
                <Heading level={3}>کارت فرورفته</Heading>
                <Text as="p" size="sm" tone="muted">
                  برای خلاصه‌ها یا بخش‌های ثانویه روی سطح اصلی.
                </Text>
              </CardBody>
            </Card>
          </div>
        </State>
        <State label="کارت پیوندی تعاملی (href)">
          <div className={styles.cardFrame}>
            <Card href="#gallery-link-card">
              <CardBody>
                <Heading level={3}>مقالهٔ راهنما</Heading>
                <Text as="p" size="sm" tone="muted">
                  هاور با تقویت خط حاشیه و پس‌زمینه، همراه حلقهٔ فوکوس ۲ پیکسلی.
                </Text>
              </CardBody>
            </Card>
          </div>
        </State>
      </GalleryRow>
      <GalleryRow title="جهت افقی (زیر ۶۰۰ پیکسل به عمودی تبدیل می‌شود)">
        <State label="horizontal">
          <div className={styles.wideCardFrame}>
            <Card orientation="horizontal">
              <CardMedia>
                <Image src={COVER_ILLUSTRATION} alt="تصویر کارت افقی" ratio="4/3" />
              </CardMedia>
              <CardBody>
                <Heading level={3}>دورهٔ تفسیر آزمون‌های هوش</Heading>
                <Text as="p" size="sm" tone="muted" leading="text">
                  چیدمان افقی برای فهرست‌های تک‌ستونه که در موبایل به صورت خودکار روی هم چیده
                  می‌شوند.
                </Text>
              </CardBody>
            </Card>
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای کارت‌های محصول، مقاله، دوره و خلاصهٔ کارنامه با ترکیب CardMedia، CardBody و CardFooter استفاده کنید.',
      'وقتی کل کارت به یک نشانی می‌رود، href را روی Card بگذارید و کنترل تعاملی تودرتو داخل آن نگذارید.',
    ],
    dont: [
      'دکمه یا پیوند جداگانه درون یک کارت پیوندی (دارای href) قرار ندهید؛ در آن حالت کارت ایستا بسازید و اقدام را در CardFooter بگذارید.',
      'به کارت سایهٔ ثابت (box-shadow) اضافه نکنید (D-77).',
    ],
  },
  keyboard: [
    { keys: 'Tab', action: 'فوکوس روی کارت پیوندی (در حالت دارای href) با حلقهٔ ۲ پیکسلی.' },
    { keys: 'Enter', action: 'باز کردن مقصد کارت پیوندی.' },
  ],
  a11y: [
    'در حالت پیش‌فرض به صورت <article> معنایی و در حالت پیوندی روی React Aria Link با حلقهٔ فوکوس واضح رندر می‌شود.',
    'هیچ سایهٔ ثابتی وجود ندارد و در forced-colors: active مرز CanvasText و حلقهٔ Highlight اعمال می‌شود.',
  ],
  rtl: [
    'در جهت افقی، خط جداکنندهٔ رسانه با border-inline-end تنظیم می‌شود و در فارسی در لبهٔ درست قرار می‌گیرد.',
  ],
};
