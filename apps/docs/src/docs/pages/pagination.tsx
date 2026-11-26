import { LoadMore, Pagination, Stack, Text } from '@negaresh/react';
import { formatNumber } from '@negaresh/utils';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './navigation.module.css';

function Example() {
  const [page, setPage] = useState(3);
  const [loaded, setLoaded] = useState(20);
  const [loading, setLoading] = useState(false);

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setLoaded((prev) => Math.min(60, prev + 20));
      setLoading(false);
    }, 150);
  };

  return (
    <div className={styles.wide} data-interactive="pagination">
      <Stack gap="6">
        <Stack gap="2">
          <Pagination
            aria-label="صفحه‌بندی فهرست سریال‌ها (تعاملی)"
            page={page}
            totalPages={12}
            showSummary
            onPageChange={setPage}
          />
          <Text size="xs" tone="muted" className={styles.output}>
            صفحهٔ فعال: {formatNumber(page, { maximumFractionDigits: 0 })}
          </Text>
        </Stack>

        <LoadMore
          loaded={loaded}
          total={60}
          isLoading={loading}
          onLoadMore={handleLoadMore}
        />
      </Stack>
    </div>
  );
}

export const paginationDoc: ComponentDoc = {
  slug: 'pagination',
  title: 'صفحه‌بندی و بارگذاری بیشتر (Pagination / LoadMore)',
  components: ['Pagination', 'LoadMore'],
  summary:
    'صفحه‌بندی با پیوندهای سروررندر و ارقام فارسی (formatNumber)، پیکان‌های منطقی آینه‌ای، فشرده‌سازی خودکار در موبایل و الگوی مکمل LoadMore.',
  status: 'review',
  products: ['R', 'N', 'T', 'V'],
  base: 'React Aria Link / Button',
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="صفحهٔ اول، میانی و آخر (با پیوندهای سروررندر)">
        <State label="page 1 of 10 (prev disabled)">
          <div className={styles.wide}>
            <Pagination
              aria-label="صفحه‌بندی نمونهٔ صفحهٔ اول"
              page={1}
              totalPages={10}
              getPageHref={(p) => `#page-${p}`}
              showSummary
            />
          </div>
        </State>
        <State label="page 5 of 12 (both ellipses)">
          <div className={styles.wide}>
            <Pagination
              aria-label="صفحه‌بندی نمونهٔ صفحهٔ میانی"
              page={5}
              totalPages={12}
              getPageHref={(p) => `#page-${p}`}
            />
          </div>
        </State>
        <State label="page 10 of 10 (next disabled)">
          <div className={styles.wide}>
            <Pagination
              aria-label="صفحه‌بندی نمونهٔ صفحهٔ آخر"
              page={10}
              totalPages={10}
              getPageHref={(p) => `#page-${p}`}
            />
          </div>
        </State>
      </GalleryRow>
      <GalleryRow title="LoadMore (دارای ادامه و تکمیل‌شده)">
        <State label="partial (20 of 60)">
          <div className={styles.block}>
            <LoadMore loaded={20} total={60} href="#page-2" />
          </div>
        </State>
        <State label="complete (60 of 60)">
          <div className={styles.block}>
            <LoadMore loaded={60} total={60} />
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'در صفحات عمومی و قابل نمایه‌سازی (وبلاگ، فروشگاه، فهرست آزمون‌ها) ویژگی getPageHref را بدهید تا پیوندها بدون جاوااسکریپت هم کار کنند.',
      'همهٔ عددها به طور خودکار با formatNumber به فارسی نمایش داده می‌شوند.',
    ],
    dont: [
      'در کنار LoadMore از اسکرول بی‌نهایت بدون دکمه استفاده نکنید؛ دسترسی به پاورقی صفحه را دشوار می‌کند.',
    ],
  },
  api: [
    {
      name: 'Pagination',
      props: [
        { name: 'page / totalPages', type: 'number / number', description: 'شمارهٔ صفحهٔ جاری (از ۱) و کل صفحات.' },
        { name: 'getPageHref', type: '(page: number) => string', description: 'سازندهٔ نشانی پیوندهای سروررندر (SSR).' },
        { name: 'onPageChange', type: '(page: number) => void', description: 'فراخوانی هنگام تغییر صفحه.' },
        { name: 'siblingCount / boundaryCount', type: 'number / number', default: '1 / 1', description: 'تعداد صفحات مجاور صفحهٔ جاری و لبه‌ها.' },
        { name: 'showSummary', type: 'boolean', default: 'false', description: 'نمایش متن «صفحهٔ n از N» در دسکتاپ.' },
      ],
    },
    {
      name: 'LoadMore',
      props: [
        { name: 'loaded / total', type: 'number / number', description: 'تعداد موارد نمایش‌داده‌شده و کل موارد.' },
        { name: 'href / onLoadMore / isLoading', type: 'string / () => void / boolean', description: 'پیوند SSR، اقدام بارگذاری و وضعیت در حال انجام.' },
        { name: 'showProgress', type: 'boolean', default: 'true', description: 'نوار پیشرفت مویی نسبت بارگذاری.' },
      ],
    },
  ],
  keyboard: [
    { keys: 'Tab / Shift+Tab', action: 'حرکت بین دکمه‌های قبلی، شماره صفحات و بعدی.' },
    { keys: 'Enter / Space', action: 'رفتن به صفحهٔ انتخاب‌شده یا بارگذاری دستهٔ بعدی.' },
  ],
  a11y: [
    'شمارهٔ صفحهٔ جاری aria-current="page" دارد و دکمه‌های مرز در صفحهٔ اول/آخر غیرفعال می‌شوند.',
    'خلاصهٔ LoadMore درون aria-live="polite" اعلام می‌شود.',
    'اندازهٔ لمسی همهٔ دکمه‌ها دست‌کم ۴۴×۴۴ پیکسل است.',
  ],
  rtl: [
    'دکمه‌های قبلی/بعدی از iconChevronStart و iconChevronEnd آینه‌ای استفاده می‌کنند و در عرض زیر ۶۰۰ پیکسل به خلاصهٔ «صفحهٔ n از N» فشرده می‌شوند.',
  ],
};
