import {
  BulkActionBar,
  Button,
  Code,
  DataTable,
  type DataTableColumn,
  type DataTableDensity,
  type DataTableSelection,
  type DataTableSortDescriptor,
  SegmentedControl,
  SegmentedControlItem,
  Stack,
  StatusBadge,
  Text,
  UsageMeter,
} from '@negaresh/react';
import { formatDate, formatNumber, maskPhone } from '@negaresh/utils';
import { useMemo, useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './data-display.module.css';

interface DemoSerial {
  id: string;
  serial: string;
  product: string;
  phone: string;
  used: number;
  limit: number;
  source: string;
  status: 'active' | 'unused' | 'limit_reached' | 'revoked';
  updatedAt: string;
}

const DEMO_ROWS: DemoSerial[] = [
  {
    id: 's1',
    serial: 'N25AG-EMV0K',
    product: 'نگارش تست هوش ۴',
    phone: '09123456789',
    used: 2,
    limit: 3,
    source: 'اختصاصی مشتری',
    status: 'active',
    updatedAt: '2026-11-15',
  },
  {
    id: 's2',
    serial: 'N25BG-9K1LP',
    product: 'بستهٔ بالینی',
    phone: '09351122334',
    used: 2,
    limit: 2,
    source: 'پیش‌فرض محصول',
    status: 'limit_reached',
    updatedAt: '2026-11-14',
  },
  {
    id: 's3',
    serial: 'N25CR-4M7QX',
    product: 'تفسیر MMPI-2',
    phone: '09198765432',
    used: 0,
    limit: 1,
    source: 'پیش‌فرض سراسری',
    status: 'unused',
    updatedAt: '2026-11-10',
  },
  {
    id: 's4',
    serial: 'N25DT-8W2ZN',
    product: 'نگارش تست هوش ۴',
    phone: '09127778899',
    used: 1,
    limit: 1,
    source: 'اختصاصی سریال',
    status: 'revoked',
    updatedAt: '2026-11-05',
  },
];

const COLUMNS: DataTableColumn<DemoSerial>[] = [
  {
    id: 'serial',
    header: 'شمارهٔ سریال',
    isRowHeader: true,
    hideable: false,
    allowsSorting: true,
    sortValue: (r) => r.serial,
    cell: (r) => <Code>{r.serial}</Code>,
  },
  {
    id: 'product',
    header: 'محصول',
    allowsSorting: true,
    sortValue: (r) => r.product,
    cell: (r) => r.product,
  },
  {
    id: 'phone',
    header: 'مشتری',
    cell: (r) => maskPhone(r.phone),
  },
  {
    id: 'usage',
    header: 'مصرف ظرفیت',
    allowsSorting: true,
    sortValue: (r) => r.used,
    cell: (r) => (
      <span>
        {formatNumber(r.used, { maximumFractionDigits: 0 })} از{' '}
        {formatNumber(r.limit, { maximumFractionDigits: 0 })} ({r.source})
      </span>
    ),
  },
  {
    id: 'status',
    header: 'وضعیت',
    cell: (r) => <StatusBadge domain="serial" status={r.status} size="sm" />,
  },
  {
    id: 'updatedAt',
    header: 'آخرین فعالیت',
    allowsSorting: true,
    sortValue: (r) => r.updatedAt,
    cell: (r) => formatDate(r.updatedAt),
  },
];

function Example() {
  const [selected, setSelected] = useState<DataTableSelection>(new Set(['s1']));
  const [sort, setSort] = useState<DataTableSortDescriptor>({
    column: 'updatedAt',
    direction: 'descending',
  });
  const [density, setDensity] = useState<DataTableDensity>('comfortable');
  const [viewState, setViewState] = useState<'ready' | 'loading' | 'empty' | 'error'>('ready');

  const sortedRows = useMemo(() => {
    const col = COLUMNS.find((c) => c.id === String(sort.column));
    if (!col?.sortValue) return DEMO_ROWS;
    const getVal = col.sortValue;
    const dir = sort.direction === 'descending' ? -1 : 1;
    return [...DEMO_ROWS].sort((a, b) => {
      const av = getVal(a);
      const bv = getVal(b);
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv), 'fa-IR') * dir;
    });
  }, [sort]);

  const selectedCount = selected === 'all' ? DEMO_ROWS.length : selected.size;

  return (
    <div className={styles.wide} data-interactive="data-table">
      <Stack gap="3">
        <SegmentedControl
          label="وضعیت دادهٔ جدول"
          value={viewState}
          onChange={(v) => {
            if (v === 'ready' || v === 'loading' || v === 'empty' || v === 'error') {
              setViewState(v);
            }
          }}
        >
          <SegmentedControlItem id="ready">دارای داده</SegmentedControlItem>
          <SegmentedControlItem id="loading">بارگذاری</SegmentedControlItem>
          <SegmentedControlItem id="empty">خالی</SegmentedControlItem>
          <SegmentedControlItem id="error">خطا</SegmentedControlItem>
        </SegmentedControl>

        {viewState === 'ready' && (
          <BulkActionBar
            selectedCount={selectedCount}
            totalCount={DEMO_ROWS.length}
            onSelectAll={() => setSelected('all')}
            onClearSelection={() => setSelected(new Set())}
          >
            <Button variant="secondary" size="sm" onPress={() => setSelected(new Set())}>
              ثبت اقدام نمونه
            </Button>
          </BulkActionBar>
        )}

        <DataTable
          aria-label="جدول تعاملی سریال‌ها"
          columns={COLUMNS}
          rows={viewState === 'empty' ? [] : sortedRows}
          getRowKey={(r) => r.id}
          getRowTextValue={(r) => r.serial}
          selectionMode="multiple"
          selectedKeys={selected}
          onSelectionChange={setSelected}
          sortDescriptor={sort}
          onSortChange={setSort}
          density={density}
          onDensityChange={setDensity}
          showDensityToggle
          enableColumnVisibility
          stickyHeader
          isLoading={viewState === 'loading'}
          error={viewState === 'error' ? 'اتصال به سرور رجیستری برقرار نشد.' : false}
          onRetry={() => setViewState('ready')}
        />
        <Text size="xs" tone="muted" className={styles.output}>
          تراکم: {density === 'compact' ? 'فشرده' : 'راحت'} · مرتب‌سازی: {String(sort.column)} (
          {sort.direction === 'ascending' ? 'صعودی' : 'نزولی'})
        </Text>
      </Stack>
    </div>
  );
}

export const dataTableDoc: ComponentDoc = {
  slug: 'data-table',
  title: 'جدول داده (DataTable)',
  components: ['DataTable'],
  base: 'React Aria Table',
  summary:
    'جدول کامل داده‌های مدیریتی روی React Aria Table با مرتب‌سازی، انتخاب ردیف، سرصفحهٔ چسبان، کنترل نمایش ستون‌ها، تراکم راحت/فشرده، حالت‌های خالی/بارگذاری/خطا و تبدیل خودکار به کارت‌های ستونی زیر ۹۰۰ پیکسل.',
  status: 'review',
  products: ['R', 'N', 'T'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="جدول استاندارد با انتخاب، مرتب‌سازی و کنترل‌های ستون و تراکم">
        <State label="comfortable · selectable · stickyHeader">
          <div className={styles.wide}>
            <DataTable
              aria-label="گالری جدول استاندارد"
              columns={COLUMNS.slice(0, 5)}
              rows={DEMO_ROWS.slice(0, 3)}
              getRowKey={(r) => r.id}
              getRowTextValue={(r) => r.serial}
              selectionMode="multiple"
              defaultSelectedKeys={new Set(['s1'])}
              defaultSortDescriptor={{ column: 'serial', direction: 'ascending' }}
              enableColumnVisibility
              showDensityToggle
              stickyHeader
            />
          </div>
        </State>
      </GalleryRow>
      <GalleryRow title="تراکم فشرده (Compact) با UsageMeter">
        <State label="compact density">
          <div className={styles.wide}>
            <DataTable
              aria-label="گالری جدول فشرده"
              density="compact"
              columns={[
                COLUMNS[0]!,
                COLUMNS[1]!,
                {
                  id: 'meter',
                  header: 'ظرفیت',
                  cell: (r) => <UsageMeter label="ظرفیت" used={r.used} limit={r.limit} />,
                },
                COLUMNS[4]!,
              ]}
              rows={DEMO_ROWS.slice(0, 2)}
              getRowKey={(r) => r.id}
              getRowTextValue={(r) => r.serial}
            />
          </div>
        </State>
      </GalleryRow>
      <GalleryRow title="حالت‌های بارگذاری، خالی و خطا (ترکیب با موج ۱)">
        <State label="loading · empty · error">
          <div className={styles.wide}>
            <Stack gap="4">
              <DataTable
                aria-label="گالری بارگذاری جدول"
                columns={COLUMNS.slice(0, 4)}
                rows={[]}
                getRowKey={(r) => r.id}
                isLoading
                loadingRows={3}
              />
              <DataTable
                aria-label="گالری حالت خالی جدول"
                columns={COLUMNS.slice(0, 4)}
                rows={[]}
                getRowKey={(r) => r.id}
              />
              <DataTable
                aria-label="گالری حالت خطای جدول"
                columns={COLUMNS.slice(0, 4)}
                rows={[]}
                getRowKey={(r) => r.id}
                error="دریافت فهرست سریال‌ها با خطا روبه‌رو شد."
                onRetry={() => undefined}
              />
            </Stack>
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای فهرست‌های مدیریتی (سریال‌ها، سفارش‌ها، گزارش‌ها) از DataTable با FilterBar و BulkActionBar استفاده کنید.',
      'حداقل یک ستون کلیدی را با hideable: false و isRowHeader: true مشخص کنید تا نام ردیف برای خوانشگرها حفظ شود.',
      'زیر ۹۰۰ پیکسل (D-90) حالت mobileCards را فعال نگه دارید تا ردیف‌ها بدون اسکرول افقی به کارت‌های خوانا تبدیل شوند.',
    ],
    dont: [
      'مقادیر کد (سریال، کد سفارش) را بدون <Code> یا <Ltr> در سلول قرار ندهید.',
      'جدول را بدون حالت خالی (EmptyState)، بارگذاری (Skeleton) و خطا (ErrorState) رها نکنید.',
    ],
  },
  api: [
    {
      name: 'DataTable<T>',
      props: [
        { name: 'columns / rows / getRowKey', type: 'DataTableColumn<T>[] / T[] / (r) => Key', description: 'تعریف ستون‌ها، داده‌ها و کلید یکتای هر ردیف.' },
        { name: 'selectionMode / selectedKeys / onSelectionChange', type: "'none' | 'single' | 'multiple'", default: "'none'", description: 'انتخاب ردیف‌ها با چک‌باکس ۴۴ پیکسلی.' },
        { name: 'sortDescriptor / onSortChange', type: 'SortDescriptor', description: 'مرتب‌سازی کنترل‌شده یا خودکار (با sortValue).' },
        { name: 'stickyHeader', type: 'boolean', default: 'false', description: 'چسبان کردن سرصفحه در بالای ناحیهٔ اسکرول جدول.' },
        { name: 'density / showDensityToggle', type: "'comfortable' | 'compact' / boolean", default: "'comfortable' / false", description: 'تراکم ردیف‌ها و نمایش کلید تغییر تراکم.' },
        { name: 'enableColumnVisibility / visibleColumns', type: 'boolean / Iterable<string>', default: 'false', description: 'منوی انتخاب ستون‌های قابل نمایش.' },
        { name: 'mobileCards', type: 'boolean', default: 'true', description: 'تبدیل خودکار ردیف‌ها به کارت‌های ستونی زیر ۹۰۰ پیکسل (تک‌درخت DOM، سازگار با SSR).' },
        { name: 'isLoading / error / onRetry / emptyState', type: 'boolean / ReactNode', description: 'حالت‌های بارگذاری، خطا و خالی با کامپوننت‌های موج ۱.' },
      ],
    },
  ],
  keyboard: [
    { keys: 'ArrowUp / ArrowDown / ArrowLeft / ArrowRight', action: 'حرکت بین ردیف‌ها و سلول‌های جدول در جهت راست‌به‌چپ.' },
    { keys: 'Space', action: 'انتخاب یا لغو انتخاب ردیف متمرکز.' },
    { keys: 'Enter', action: 'مرتب‌سازی روی سرصفحهٔ قابل مرتب‌سازی یا اجرای اقدام ردیف.' },
  ],
  a11y: [
    'بر پایهٔ React Aria Table ساخته شده و رشته‌های خوانشگر فارسی (@react-aria/table و @react-aria/grid) را از D-97 دریافت می‌کند.',
    'در نمای موبایل (< ۹۰۰ پیکسل)، سرصفحهٔ thead به صورت بصری مخفی می‌ماند تا ساختار ARIA ستون‌ها برای صفحه‌خوان‌ها حفظ شود.',
  ],
  rtl: [
    'چک‌باکس انتخاب در آغاز سطر (راست)، اعداد با tabular-nums و کدها در <Code> ایزوله می‌شوند؛ در عرض ۳۹۰ پیکسل هیچ سرریز افقی وجود ندارد.',
  ],
};
