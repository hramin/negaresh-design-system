import { iconFile, iconKey, iconSearch } from '@negaresh/icons';
import { Button, EmptyState, Section, Surface } from '@negaresh/react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './feedback.module.css';

function Example() {
  return (
    <div className={styles.block} data-interactive="empty-state">
      <Surface>
        <Section>
          <EmptyState
            icon={iconKey}
            title="هنوز فعال‌سازی‌ای ثبت نشده است"
            description="پس از وارد کردن سریال و ساخت نخستین کد فعال‌سازی، فهرست رایانه‌های فعال‌شده اینجا نمایش داده می‌شود."
            action={<Button variant="primary">فعال‌سازی نرم‌افزار</Button>}
            secondaryAction={<Button variant="secondary">راهنمای فعال‌سازی</Button>}
          />
        </Section>
      </Surface>
    </div>
  );
}

export const emptyStateDoc: ComponentDoc = {
  slug: 'empty-state',
  title: 'وضعیت خالی (EmptyState)',
  components: ['EmptyState'],
  summary:
    'بلوک آرام برای فهرست‌ها، جداول و بخش‌های بدون داده که توضیح می‌دهد چه چیزی اینجا قرار می‌گیرد و اقدام نخست را پیشنهاد می‌کند.',
  status: 'approved',
  products: ['R', 'N', 'T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="اندازه‌ها و کاربردها">
        <State label="استاندارد با دو اقدام (md)">
          <div className={styles.block}>
            <Surface>
              <Section>
                <EmptyState
                  icon={iconFile}
                  title="گزارشی برای نمایش وجود ندارد"
                  description="پس از تکمیل نخستین آزمون، گزارش و نمودار نتیجه اینجا آماده می‌شود."
                  action={<Button variant="primary">شروع آزمون جدید</Button>}
                  secondaryAction={<Button variant="ghost">مشاهدهٔ نمونه</Button>}
                />
              </Section>
            </Surface>
          </div>
        </State>
        <State label="فشرده برای جدول یا جست‌وجو (sm)">
          <div className={styles.block}>
            <Surface>
              <Section>
                <EmptyState
                  size="sm"
                  icon={iconSearch}
                  title="موردی با این فیلتر پیدا نشد"
                  description="عبارت جست‌وجو یا فیلترهای انتخاب‌شده را تغییر دهید."
                  action={
                    <Button size="sm" variant="secondary">
                      پاک کردن فیلترها
                    </Button>
                  }
                />
              </Section>
            </Surface>
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'در یک جمله بگویید چه داده‌ای اینجا نمایش داده می‌شود و دکمهٔ آغاز کار را مستقیم قرار دهید.',
      'هنگام قرار دادن درون کارت یا جدول، خود EmptyState حاشیه و سایه اضافه نمی‌کند تا کارت تو در تو نسازد (D-77).',
    ],
    dont: [
      'عبارت‌های مبهم یا سرزنش‌کننده مانند «داده‌ای یافت نشد!» ننویسید.',
    ],
  },
  a11y: [
    'آیکن با aria-hidden="true" نشانه‌گذاری شده و تیتر با سطح headingLevel قابل تنظیم به ساختار صفحه متصل می‌شود.',
    'عرض متن توضیحی به ۴۶ کاراکتر (46ch) محدود شده تا خوانایی در دسکتاپ و موبایل حفظ شود.',
  ],
  rtl: [
    'چیدمان وسط‌چین با جهت راست‌به‌چپ برای دکمه‌ها و متن‌ها؛ در موبایل دکمه‌ها به صورت خودکار می‌شکنند.',
  ],
};
