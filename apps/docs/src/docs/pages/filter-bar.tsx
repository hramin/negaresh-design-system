import { FilterBar, type FilterChip, Select, SelectItem, Stack, Text } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './data-display.module.css';

const STATUS_LABELS: Record<string, string> = {
  active: 'فعال',
  limit_reached: 'سقف پر شده',
  revoked: 'باطل‌شده',
};

const PRODUCT_LABELS: Record<string, string> = {
  iq4: 'نگارش تست هوش ۴',
  clinical: 'بستهٔ بالینی',
  mmpi: 'تفسیر MMPI-2',
};

function Example() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('active');
  const [product, setProduct] = useState<string>('iq4');

  const chips: FilterChip[] = [
    ...(status !== 'all' ? [{ id: 'status', label: 'وضعیت', value: STATUS_LABELS[status] }] : []),
    ...(product !== 'all' ? [{ id: 'product', label: 'محصول', value: PRODUCT_LABELS[product] }] : []),
  ];

  const handleRemove = (id: string) => {
    if (id === 'status') setStatus('all');
    if (id === 'product') setProduct('all');
  };

  const handleReset = () => {
    setSearch('');
    setStatus('all');
    setProduct('all');
  };

  return (
    <div className={styles.wide} data-interactive="filter-bar">
      <Stack gap="3">
        <FilterBar
          aria-label="فیلترهای تعاملی سریال‌ها"
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="جست‌وجوی سریال یا شمارهٔ همراه…"
          filters={
            <>
              <Select
                label="وضعیت سریال"
                value={status}
                onChange={(key) => setStatus(String(key))}
                size="sm"
              >
                <SelectItem id="all">همهٔ وضعیت‌ها</SelectItem>
                <SelectItem id="active">فعال</SelectItem>
                <SelectItem id="limit_reached">سقف پر شده</SelectItem>
                <SelectItem id="revoked">باطل‌شده</SelectItem>
              </Select>
              <Select
                label="محصول"
                value={product}
                onChange={(key) => setProduct(String(key))}
                size="sm"
              >
                <SelectItem id="all">همهٔ محصولات</SelectItem>
                <SelectItem id="iq4">نگارش تست هوش ۴</SelectItem>
                <SelectItem id="clinical">بستهٔ بالینی</SelectItem>
                <SelectItem id="mmpi">تفسیر MMPI-2</SelectItem>
              </Select>
            </>
          }
          activeFilters={chips}
          onRemoveFilter={handleRemove}
          onReset={handleReset}
        />
        <Text size="xs" tone="muted" className={styles.output}>
          جست‌وجو: {search || '—'} · وضعیت: {STATUS_LABELS[status] ?? 'همه'} · محصول:{' '}
          {PRODUCT_LABELS[product] ?? 'همه'}
        </Text>
      </Stack>
    </div>
  );
}

export const filterBarDoc: ComponentDoc = {
  slug: 'filter-bar',
  title: 'نوار جست‌وجو و فیلتر (FilterBar)',
  components: ['FilterBar'],
  summary:
    'ترکیب SearchField، کنترل‌های فیلتر درون‌خطی دسکتاپ، برچسب‌های فیلتر فعال قابل حذف (TagGroup) و بازنشانی؛ زیر ۹۰۰ پیکسل فیلترها به کشوی Sheet منتقل می‌شوند.',
  status: 'review',
  products: ['R', 'N', 'T'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="نوار کامل با فیلترهای فعال و دکمهٔ پاک کردن">
        <State label="search + inline filters + active chips">
          <div className={styles.wide}>
            <FilterBar
              aria-label="گالری فیلترهای کامل"
              searchValue="N25AG"
              onSearchChange={() => undefined}
              filters={
                <>
                  <Select label="وضعیت" defaultValue="active" size="sm">
                    <SelectItem id="active">فعال</SelectItem>
                    <SelectItem id="revoked">باطل‌شده</SelectItem>
                  </Select>
                  <Select label="منبع سقف" defaultValue="customer" size="sm">
                    <SelectItem id="customer">اختصاصی مشتری</SelectItem>
                    <SelectItem id="product">پیش‌فرض محصول</SelectItem>
                  </Select>
                </>
              }
              activeFilters={[
                { id: 'status', label: 'وضعیت', value: 'فعال' },
                { id: 'source', label: 'منبع سقف', value: 'اختصاصی مشتری' },
              ]}
              onRemoveFilter={() => undefined}
              onReset={() => undefined}
            />
          </div>
        </State>
      </GalleryRow>
      <GalleryRow title="حالت ساده بدون فیلتر فعال">
        <State label="search only">
          <div className={styles.block}>
            <FilterBar
              aria-label="گالری جست‌وجوی ساده"
              searchValue=""
              onSearchChange={() => undefined}
              searchPlaceholder="جست‌وجو در گزارش ممیزی…"
            />
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'فیلترهای اصلی (Select، DateRangePicker و…) را به prop filters بدهید تا روی دسکتاپ درون‌خطی و در موبایل درون Sheet نمایش داده شوند.',
      'هر فیلتر انتخاب‌شده را به صورت یک FilterChip در activeFilters نمایش دهید تا کاربر با یک کلیک یا کلید Delete آن را حذف کند.',
    ],
    dont: [
      'کنترل‌های فیلتر را در موبایل در چند ردیف فشرده روی هم نچینید؛ FilterBar به طور خودکار کشوی Sheet را زیر ۹۰۰ پیکسل فعال می‌کند.',
    ],
  },
  api: [
    {
      name: 'FilterBar',
      props: [
        { name: 'searchValue / onSearchChange / searchPlaceholder', type: 'string / (v: string) => void', description: 'مدیریت ورودی SearchField.' },
        { name: 'filters', type: 'ReactNode', description: 'کنترل‌های فیلتر؛ در دسکتاپ درون‌خطی و در موبایل (< ۹۰۰px) درون Sheet.' },
        { name: 'activeFilters', type: 'readonly FilterChip[]', description: 'برچسب‌های فیلتر فعال زیر نوار.' },
        { name: 'onRemoveFilter / onReset', type: '(id: string) => void / () => void', description: 'حذف تک‌فیلتر یا پاک کردن همهٔ فیلترها.' },
        { name: 'sheetTitle', type: 'ReactNode', default: "'فیلتر کردن نتایج'", description: 'عنوان کشوی فیلترها در موبایل.' },
        { name: 'actions', type: 'ReactNode', description: 'اقدام‌های اختیاری در انتهای سطر.' },
      ],
    },
  ],
  keyboard: [
    { keys: 'Tab', action: 'حرکت بین جست‌وجو، کنترل‌های فیلتر (یا دکمهٔ فیلترها در موبایل)، برچسب‌ها و دکمهٔ پاک کردن.' },
    { keys: 'Delete / Backspace', action: 'حذف برچسب فیلتر متمرکز در TagGroup.' },
    { keys: 'Escape', action: 'بستن کشوی Sheet فیلترها در موبایل و بازگشت تمرکز به دکمهٔ «فیلترها».' },
  ],
  a11y: [
    'ریشه دارای role="search" و نام دسترس‌پذیر فارسی است و فیلد جست‌وجو برچسب مرئی دارد.',
    'هنگام باز بودن کشوی Sheet موبایل، نسخهٔ دسکتاپ کنترل‌ها unmount می‌شود تا هیچ id تکراری در DOM پدید نیاید.',
  ],
  rtl: [
    'در عرض زیر ۹۰۰ پیکسل، جست‌وجو تمام‌عرض شده و دکمهٔ «فیلترها» همراه با شمارندهٔ فارسی فیلترهای فعال، کشوی پایین Sheet را باز می‌کند.',
  ],
};
