import {
  iconDownload,
  iconEdit,
  iconKey,
  iconPlus,
  iconShield,
  iconTrash,
  iconWarning,
} from '@negaresh/icons';
import {
  AlertDialog,
  Breadcrumbs,
  BulkActionBar,
  Button,
  ButtonGroup,
  Code,
  CopyButton,
  DataTable,
  type DataTableColumn,
  type DataTableDensity,
  type DataTableSelection,
  type DataTableSortDescriptor,
  Dialog,
  DialogTrigger,
  EmptyState,
  FilterBar,
  type FilterChip,
  Heading,
  Link,
  NumberField,
  Pagination,
  Select,
  SelectItem,
  type SerialStatus,
  Stack,
  StatGroup,
  StatTile,
  StatusBadge,
  Text,
  TextField,
  UsageMeter,
  useToast,
} from '@negaresh/react';
import { formatDate, formatNumber, maskPhone } from '@negaresh/utils';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import {
  ADMIN_SERIALS,
  type AdminSerialRecord,
  LIMIT_SOURCE_LABELS,
  type LimitSource,
  PRODUCT_LABELS,
  STATUS_LABELS,
} from '../-admin-serials-data.ts';
import { AdminShell } from '../-admin-shell.tsx';
import styles from '../admin-serials.module.css';

export const Route = createFileRoute('/reference/admin-serials/')({
  head: () => ({ meta: [{ title: 'مدیریت سریال‌ها · نمونهٔ پنل مدیریت رجیستری' }] }),
  component: AdminSerialsListPage,
});

const PAGE_SIZE = 6;

function SparkMini({ warn = false }: { warn?: boolean }) {
  return (
    <svg
      viewBox="0 0 64 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={warn ? styles.sparkSvgWarn : styles.sparkSvg}
    >
      <path
        d={
          warn
            ? 'M2 7 L14 9 L26 12 L38 11 L50 17 L62 20'
            : 'M2 20 L14 17 L26 15 L38 16 L50 9 L62 4'
        }
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AdminSerialsListContent() {
  const toast = useToast();
  const [records, setRecords] = useState<AdminSerialRecord[]>(() => [...ADMIN_SERIALS]);
  const [search, setSearch] = useState('');
  const [productFilter, setProductFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [selected, setSelected] = useState<DataTableSelection>(new Set());
  const [sort, setSort] = useState<DataTableSortDescriptor>({
    column: 'lastActivationAt',
    direction: 'descending',
  });
  const [density, setDensity] = useState<DataTableDensity>('comfortable');
  const [page, setPage] = useState(1);

  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false);
  const [batchProduct, setBatchProduct] = useState<AdminSerialRecord['productId']>('iq4');
  const [batchCount, setBatchCount] = useState(10);

  const [isBulkLimitOpen, setIsBulkLimitOpen] = useState(false);
  const [bulkLimitValue, setBulkLimitValue] = useState(3);
  const [bulkLimitReason, setBulkLimitReason] = useState('');
  const [isBulkRevokeOpen, setIsBulkRevokeOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.filter((r) => {
      if (productFilter !== 'all' && r.productId !== productFilter) return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (sourceFilter !== 'all' && r.limitSource !== sourceFilter) return false;
      if (!q) return true;
      return (
        r.serial.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.orderCode.toLowerCase().includes(q)
      );
    });
  }, [records, search, productFilter, statusFilter, sourceFilter]);

  const sorted = useMemo(() => {
    const dir = sort.direction === 'descending' ? -1 : 1;
    const col = String(sort.column);
    return [...filtered].sort((a, b) => {
      if (col === 'serial') return a.serial.localeCompare(b.serial) * dir;
      if (col === 'product') return a.productName.localeCompare(b.productName, 'fa-IR') * dir;
      if (col === 'usage') return (a.used - b.used) * dir;
      return a.lastActivationAt.localeCompare(b.lastActivationAt) * dir;
    });
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const selectedSerials = useMemo(() => {
    if (selected === 'all') return pageRows.map((r) => r.serial);
    return [...selected].map(String);
  }, [selected, pageRows]);

  const activeChips: FilterChip[] = [
    ...(productFilter !== 'all'
      ? [
          {
            id: 'product',
            label: 'محصول',
            value: PRODUCT_LABELS[productFilter as AdminSerialRecord['productId']],
          },
        ]
      : []),
    ...(statusFilter !== 'all'
      ? [{ id: 'status', label: 'وضعیت', value: STATUS_LABELS[statusFilter as SerialStatus] }]
      : []),
    ...(sourceFilter !== 'all'
      ? [{ id: 'source', label: 'منبع سقف', value: LIMIT_SOURCE_LABELS[sourceFilter as LimitSource] }]
      : []),
  ];

  const handleRemoveChip = (id: string) => {
    if (id === 'product') setProductFilter('all');
    if (id === 'status') setStatusFilter('all');
    if (id === 'source') setSourceFilter('all');
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setProductFilter('all');
    setStatusFilter('all');
    setSourceFilter('all');
    setPage(1);
  };

  const columns: DataTableColumn<AdminSerialRecord>[] = [
    {
      id: 'serial',
      header: 'شمارهٔ سریال',
      isRowHeader: true,
      hideable: false,
      allowsSorting: true,
      mobilePrimary: true,
      cell: (row) => (
        <span className={styles.titleRow}>
          <Link
            href={`/reference/admin-serials/${row.serial}`}
            variant="standalone"
            className={styles.serialLink}
          >
            <Code>{row.serial}</Code>
          </Link>
          <CopyButton
            value={row.serial.replace(/-/g, '')}
            variant="ghost"
            size="sm"
            aria-label={`کپی سریال ${row.serial}`}
            onCopy={() =>
              toast.add({
                title: 'سریال کپی شد',
                description: row.serial,
                tone: 'success',
              })
            }
          />
        </span>
      ),
    },
    {
      id: 'product',
      header: 'محصول و مشتری',
      allowsSorting: true,
      cell: (row) => (
        <div className={styles.tableMetaCell}>
          <Text size="sm" weight="medium">
            {row.productName}
          </Text>
          <Text size="xs" tone="muted">
            {row.customerName} · <span dir="ltr">{maskPhone(row.phone)}</span>
          </Text>
        </div>
      ),
    },
    {
      id: 'usage',
      header: 'مصرف و منبع سقف',
      allowsSorting: true,
      cell: (row) => (
        <div className={styles.usageCell}>
          <UsageMeter
            label="فعال‌سازی"
            used={row.used}
            limit={row.limit}
            sourceNote={LIMIT_SOURCE_LABELS[row.limitSource]}
          />
        </div>
      ),
    },
    {
      id: 'status',
      header: 'وضعیت',
      cell: (row) => <StatusBadge domain="serial" status={row.status} size="sm" />,
    },
    {
      id: 'lastActivationAt',
      header: 'آخرین فعالیت',
      allowsSorting: true,
      cell: (row) => formatDate(row.lastActivationAt),
    },
  ];

  const stats = useMemo(() => {
    const active = records.filter((r) => r.status === 'active').length;
    const limitReached = records.filter((r) => r.status === 'limit_reached').length;
    const revoked = records.filter((r) => r.status === 'revoked').length;
    return { total: records.length, active, limitReached, revoked };
  }, [records]);

  return (
    <div data-admin-list>
      <Stack gap="6">
        <Breadcrumbs
          items={[
            { id: 'home', label: 'مدیریت رجیستری', href: '/reference/admin-serials' },
            { id: 'serials', label: 'سریال‌ها' },
          ]}
        />

        <div className={styles.pageHeader}>
          <div className={styles.titleBlock}>
            <Heading level={1}>مدیریت سریال‌ها</Heading>
            <Text size="sm" tone="muted">
              پایش وضعیت فعال‌سازی، سقف مؤثر (FR-23) و عملیات گروهی روی سریال‌های نرم‌افزاری نگرش.
            </Text>
          </div>
          <ButtonGroup>
            <Button
              variant="secondary"
              iconStart={iconDownload}
              onPress={() =>
                toast.add({
                  title: 'خروجی CSV آماده شد',
                  description: `${formatNumber(sorted.length, { maximumFractionDigits: 0 })} سریال در فایل ثبت شد.`,
                  tone: 'success',
                })
              }
            >
              خروجی CSV
            </Button>
            <DialogTrigger isOpen={isBatchDialogOpen} onOpenChange={setIsBatchDialogOpen}>
              <Button variant="primary" iconStart={iconPlus}>
                ساخت دستهٔ سریال
              </Button>
              <Dialog
                title="ساخت دستهٔ سریال تازه"
                description="پس از تأیید، سریال‌های جدید با الگوی ۵-۵ تولید و آمادهٔ دریافت CSV می‌شوند."
                footer={(close) => (
                  <ButtonGroup justify="end" stackOnMobile>
                    <Button variant="ghost" onPress={close}>
                      انصراف
                    </Button>
                    <Button
                      variant="primary"
                      onPress={() => {
                        toast.add({
                          title: 'دستهٔ سریال ایجاد شد',
                          description: `${formatNumber(batchCount, { maximumFractionDigits: 0 })} سریال برای «${PRODUCT_LABELS[batchProduct]}» تولید شد.`,
                          tone: 'success',
                        });
                        close();
                      }}
                    >
                      تولید سریال‌ها
                    </Button>
                  </ButtonGroup>
                )}
              >
                <div className={styles.dialogForm}>
                  <Select
                    label="محصول هدف"
                    value={batchProduct}
                    onChange={(k) => setBatchProduct(String(k) as AdminSerialRecord['productId'])}
                  >
                    <SelectItem id="iq4">{PRODUCT_LABELS.iq4}</SelectItem>
                    <SelectItem id="clinical">{PRODUCT_LABELS.clinical}</SelectItem>
                    <SelectItem id="mmpi">{PRODUCT_LABELS.mmpi}</SelectItem>
                    <SelectItem id="wisc">{PRODUCT_LABELS.wisc}</SelectItem>
                  </Select>
                  <NumberField
                    label="تعداد سریال در دسته"
                    value={batchCount}
                    onChange={setBatchCount}
                    minValue={1}
                    maxValue={500}
                  />
                </div>
              </Dialog>
            </DialogTrigger>
          </ButtonGroup>
        </div>

        <StatGroup columns={4} aria-label="شاخص‌های خلاصهٔ سریال‌ها">
          <StatTile
            label="کل سریال‌ها"
            value={stats.total}
            icon={iconKey}
            delta={{ value: '۱۲٪', direction: 'up', label: 'در ۳۰ روز گذشته' }}
            sparkline={<SparkMini />}
          />
          <StatTile
            label="سریال‌های فعال"
            value={stats.active}
            icon={iconShield}
            delta={{ value: '۸٪', direction: 'up', label: 'نرخ پایدار' }}
            sparkline={<SparkMini />}
          />
          <StatTile
            label="سقف پر شده"
            value={stats.limitReached}
            icon={iconWarning}
            delta={{ value: '۲ مورد', direction: 'down', sentiment: 'positive', label: 'کمتر از هفتهٔ قبل' }}
            sparkline={<SparkMini warn />}
          />
          <StatTile
            label="باطل‌شده"
            value={stats.revoked}
            icon={iconTrash}
            delta={{ value: '۰٪', direction: 'neutral', label: 'بدون تغییر' }}
          />
        </StatGroup>

        <FilterBar
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          searchPlaceholder="جست‌وجوی سریال، نام مشتری، شمارهٔ همراه یا کد سفارش…"
          filters={
            <>
              <Select
                label="محصول"
                value={productFilter}
                onChange={(key) => {
                  setProductFilter(String(key));
                  setPage(1);
                }}
                size="sm"
              >
                <SelectItem id="all">همهٔ محصولات</SelectItem>
                <SelectItem id="iq4">{PRODUCT_LABELS.iq4}</SelectItem>
                <SelectItem id="clinical">{PRODUCT_LABELS.clinical}</SelectItem>
                <SelectItem id="mmpi">{PRODUCT_LABELS.mmpi}</SelectItem>
                <SelectItem id="wisc">{PRODUCT_LABELS.wisc}</SelectItem>
              </Select>
              <Select
                label="وضعیت"
                value={statusFilter}
                onChange={(key) => {
                  setStatusFilter(String(key));
                  setPage(1);
                }}
                size="sm"
              >
                <SelectItem id="all">همهٔ وضعیت‌ها</SelectItem>
                <SelectItem id="active">{STATUS_LABELS.active}</SelectItem>
                <SelectItem id="unused">{STATUS_LABELS.unused}</SelectItem>
                <SelectItem id="limit_reached">{STATUS_LABELS.limit_reached}</SelectItem>
                <SelectItem id="revoked">{STATUS_LABELS.revoked}</SelectItem>
                <SelectItem id="expired">{STATUS_LABELS.expired}</SelectItem>
              </Select>
              <Select
                label="منبع سقف"
                value={sourceFilter}
                onChange={(key) => {
                  setSourceFilter(String(key));
                  setPage(1);
                }}
                size="sm"
              >
                <SelectItem id="all">همهٔ منابع</SelectItem>
                <SelectItem id="serial">{LIMIT_SOURCE_LABELS.serial}</SelectItem>
                <SelectItem id="customer">{LIMIT_SOURCE_LABELS.customer}</SelectItem>
                <SelectItem id="product">{LIMIT_SOURCE_LABELS.product}</SelectItem>
                <SelectItem id="global">{LIMIT_SOURCE_LABELS.global}</SelectItem>
              </Select>
            </>
          }
          activeFilters={activeChips}
          onRemoveFilter={handleRemoveChip}
          onReset={handleResetFilters}
        />

        <BulkActionBar
          selectedCount={selectedSerials.length}
          totalCount={pageRows.length}
          onSelectAll={() => setSelected('all')}
          onClearSelection={() => setSelected(new Set())}
        >
          <Button
            variant="secondary"
            size="sm"
            iconStart={iconEdit}
            onPress={() => setIsBulkLimitOpen(true)}
          >
            تغییر سقف
          </Button>
          <Button
            variant="danger"
            size="sm"
            iconStart={iconTrash}
            onPress={() => setIsBulkRevokeOpen(true)}
          >
            ابطال انتخاب‌شده‌ها
          </Button>
        </BulkActionBar>

        <DataTable
          aria-label="فهرست سریال‌های رجیستری"
          columns={columns}
          rows={pageRows}
          getRowKey={(r) => r.serial}
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
          emptyState={
            <EmptyState
              title="سریالی با این فیلترها پیدا نشد"
              description="عبارت جست‌وجو یا فیلترهای انتخاب‌شده را تغییر دهید."
              size="sm"
              headingLevel={3}
              action={
                <Button variant="secondary" onPress={handleResetFilters}>
                  پاک کردن فیلترها
                </Button>
              }
            />
          }
        />

        {sorted.length > 0 && (
          <div className={styles.paginationRow}>
            <Text size="xs" tone="muted">
              نمایش {formatNumber(pageRows.length, { maximumFractionDigits: 0 })} از{' '}
              {formatNumber(sorted.length, { maximumFractionDigits: 0 })} سریال
            </Text>
            <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}

        <Dialog
          isOpen={isBulkLimitOpen}
          onOpenChange={setIsBulkLimitOpen}
          title="تغییر گروهی سقف فعال‌سازی"
          description={`سقف جدید برای ${formatNumber(selectedSerials.length, { maximumFractionDigits: 0 })} سریال انتخاب‌شده با منبع «اختصاصی سریال» ثبت می‌شود.`}
          footer={(close) => (
            <ButtonGroup justify="end" stackOnMobile>
              <Button variant="ghost" onPress={close}>
                انصراف
              </Button>
              <Button
                variant="primary"
                onPress={() => {
                  const targets = new Set(selectedSerials);
                  setRecords((prev) =>
                    prev.map((r) =>
                      targets.has(r.serial)
                        ? { ...r, limit: bulkLimitValue, limitSource: 'serial' }
                        : r,
                    ),
                  );
                  setSelected(new Set());
                  toast.add({
                    title: 'سقف فعال‌سازی به‌روزرسانی شد',
                    description: `سقف جدید (${formatNumber(bulkLimitValue, { maximumFractionDigits: 0 })} رایانه) در تاریخچهٔ ممیزی ثبت شد.`,
                    tone: 'success',
                  });
                  setBulkLimitReason('');
                  close();
                }}
              >
                ذخیرهٔ سقف جدید
              </Button>
            </ButtonGroup>
          )}
        >
          <div className={styles.dialogForm}>
            <NumberField
              label="سقف فعال‌سازی جدید"
              value={bulkLimitValue}
              onChange={setBulkLimitValue}
              minValue={1}
              maxValue={20}
            />
            <TextField
              label="دلیل تغییر (ثبت در ممیزی)"
              value={bulkLimitReason}
              onChange={setBulkLimitReason}
              placeholder="مثلاً: درخواست کلینیک برای رایانهٔ دوم"
            />
          </div>
        </Dialog>

        <AlertDialog
          isOpen={isBulkRevokeOpen}
          onOpenChange={setIsBulkRevokeOpen}
          tone="danger"
          title="ابطال سریال‌های انتخاب‌شده"
          confirmLabel="بله، ابطال شوند"
          onConfirm={() => {
            const targets = new Set(selectedSerials);
            setRecords((prev) =>
              prev.map((r) => (targets.has(r.serial) ? { ...r, status: 'revoked' } : r)),
            );
            setSelected(new Set());
            toast.add({
              title: 'سریال‌ها باطل شدند',
              description: `${formatNumber(targets.size, { maximumFractionDigits: 0 })} سریال به وضعیت باطل‌شده تغییر یافت.`,
              tone: 'warning',
            });
          }}
        >
          آیا از ابطال {formatNumber(selectedSerials.length, { maximumFractionDigits: 0 })} سریال
          اطمینان دارید؟ پس از ابطال، فعال‌سازی تازه با این سریال‌ها ممکن نخواهد بود.
        </AlertDialog>
      </Stack>
    </div>
  );
}

function AdminSerialsListPage() {
  return (
    <AdminShell activeSection="serials">
      <AdminSerialsListContent />
    </AdminShell>
  );
}
