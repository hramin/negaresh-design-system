import {
  iconClock,
  iconCopy,
  iconEdit,
  iconKey,
  iconLaptop,
  iconShield,
  iconTrash,
} from '@negaresh/icons';
import {
  ActivityList,
  AlertDialog,
  Badge,
  Breadcrumbs,
  BulkActionBar,
  Button,
  ButtonGroup,
  Code,
  CopyButton,
  DiffView,
  ErrorState,
  GridList,
  GridListItem,
  Heading,
  Icon,
  IconButton,
  KeyValueItem,
  KeyValueList,
  Ltr,
  NumberField,
  Section,
  Select,
  SelectItem,
  Sheet,
  Stack,
  StatGroup,
  StatTile,
  StatusBadge,
  Surface,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Text,
  TextField,
  Timeline,
  UsageMeter,
  useToast,
} from '@negaresh/react';
import { formatDate, formatDateTime, formatNumber, maskPhone } from '@negaresh/utils';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import type { Selection } from 'react-aria-components';
import {
  type AdminDeviceRecord,
  type AdminSerialRecord,
  findAdminSerial,
  LIMIT_SOURCE_LABELS,
  type LimitSource,
} from '../-admin-serials-data.ts';
import { AdminShell } from '../-admin-shell.tsx';
import styles from '../admin-serials.module.css';

type DetailTab = 'overview' | 'devices' | 'history' | 'diff';

export const Route = createFileRoute('/reference/admin-serials/$serial')({
  validateSearch: (search: Record<string, unknown>): { tab?: DetailTab } => {
    if (
      search.tab === 'overview' ||
      search.tab === 'devices' ||
      search.tab === 'history' ||
      search.tab === 'diff'
    ) {
      return { tab: search.tab };
    }
    return {};
  },
  head: ({ params }) => ({
    meta: [{ title: `جزئیات سریال ${params.serial} · نمونهٔ پنل مدیریت رجیستری` }],
  }),
  component: AdminSerialDetailPage,
});

function AdminSerialDetailContent({
  initialRecord,
  initialTab,
}: {
  initialRecord: AdminSerialRecord;
  initialTab: DetailTab;
}) {
  const toast = useToast();
  const [record, setRecord] = useState<AdminSerialRecord>(initialRecord);
  const [devices, setDevices] = useState<AdminDeviceRecord[]>(() => [...initialRecord.devices]);
  const [selectedDevices, setSelectedDevices] = useState<Selection>(new Set());
  const [activeTab, setActiveTab] = useState<DetailTab>(initialTab);

  const [isLimitSheetOpen, setIsLimitSheetOpen] = useState(false);
  const [draftLimit, setDraftLimit] = useState(initialRecord.limit);
  const [draftSource, setDraftSource] = useState<LimitSource>(initialRecord.limitSource);
  const [draftReason, setDraftReason] = useState('');
  const [isRevokeOpen, setIsRevokeOpen] = useState(false);

  const selectedDeviceIds =
    selectedDevices === 'all' ? devices.map((d) => d.id) : [...selectedDevices].map(String);

  const timelineItems = record.timeline.map((ev) => ({
    id: ev.id,
    title: ev.title,
    description: ev.description,
    timestamp: ev.timestamp,
    tone: ev.tone,
    actor: ev.actor,
    ...(ev.badgeText
      ? {
          badge: (
            <Badge
              tone={
                ev.tone === 'danger'
                  ? 'danger'
                  : ev.tone === 'warning'
                    ? 'warning'
                    : ev.tone === 'info'
                      ? 'info'
                      : 'neutral'
              }
              size="sm"
            >
              {ev.badgeText}
            </Badge>
          ),
        }
      : {}),
    ...(ev.codeMeta || ev.ipMeta
      ? {
          meta: (
            <>
              {ev.codeMeta && (
                <>
                  کد سیستم: <Code>{ev.codeMeta}</Code>
                </>
              )}
              {ev.codeMeta && ev.ipMeta ? ' · ' : null}
              {ev.ipMeta && <Ltr>{ev.ipMeta}</Ltr>}
            </>
          ),
        }
      : {}),
  }));

  const handleDeactivateSelectedDevices = () => {
    const targets = new Set(selectedDeviceIds);
    setDevices((prev) => prev.map((d) => (targets.has(d.id) ? { ...d, active: false } : d)));
    setSelectedDevices(new Set());
    toast.add({
      title: 'دستگاه‌ها غیرفعال شدند',
      description: `${formatNumber(targets.size, { maximumFractionDigits: 0 })} رایانه از فهرست فعال خارج شد.`,
      tone: 'warning',
    });
  };

  return (
    <div data-admin-detail>
      <Stack gap="6">
        <Breadcrumbs
          items={[
            { id: 'home', label: 'مدیریت رجیستری', href: '/reference/admin-serials' },
            { id: 'serials', label: 'سریال‌ها', href: '/reference/admin-serials' },
            { id: 'current', label: record.serial },
          ]}
        />

        <div className={styles.pageHeader}>
          <div className={styles.titleBlock}>
            <div className={styles.titleRow}>
              <Heading level={1}>
                <Code>{record.serial}</Code>
              </Heading>
              <CopyButton
                value={record.serial.replace(/-/g, '')}
                variant="ghost"
                size="sm"
                aria-label={`کپی سریال ${record.serial}`}
                onCopy={() =>
                  toast.add({ title: 'سریال کپی شد', description: record.serial, tone: 'success' })
                }
              />
              <StatusBadge domain="serial" status={record.status} />
            </div>
            <Text size="sm" tone="muted">
              {record.productName} · متعلق به {record.customerName}
            </Text>
          </div>

          <ButtonGroup>
            <Button
              variant="secondary"
              iconStart={iconEdit}
              onPress={() => {
                setDraftLimit(record.limit);
                setDraftSource(record.limitSource);
                setIsLimitSheetOpen(true);
              }}
            >
              تغییر سقف فعال‌سازی
            </Button>
            <Button
              variant="danger"
              iconStart={iconTrash}
              isDisabled={record.status === 'revoked'}
              onPress={() => setIsRevokeOpen(true)}
            >
              ابطال سریال
            </Button>
          </ButtonGroup>
        </div>

        <StatGroup columns={3} aria-label="خلاصهٔ وضعیت سریال">
          <StatTile
            label="رایانه‌های فعال‌شده"
            value={record.used}
            unit={`از ${formatNumber(record.limit, { maximumFractionDigits: 0 })}`}
            icon={iconLaptop}
            helperText={`منبع سقف مؤثر: ${LIMIT_SOURCE_LABELS[record.limitSource]}`}
          />
          <StatTile
            label="تاریخ صدور"
            value={formatDate(record.createdAt)}
            icon={iconKey}
            helperText={`کد سفارش: ${record.orderCode}`}
          />
          <StatTile
            label="آخرین فعالیت"
            value={formatDate(record.lastActivationAt)}
            icon={iconClock}
            helperText={formatDateTime(record.lastActivationAt)}
          />
        </StatGroup>

        <Surface>
          <Section>
            <UsageMeter
              label="ظرفیت فعال‌سازی سریال"
              used={record.used}
              limit={record.limit}
              sourceNote={`منبع سقف مؤثر (FR-23): ${LIMIT_SOURCE_LABELS[record.limitSource]}`}
              showFullIndicator
            />
          </Section>
        </Surface>

        <Tabs
          selectedKey={activeTab}
          onSelectionChange={(key) => {
            if (key === 'overview' || key === 'devices' || key === 'history' || key === 'diff') {
              setActiveTab(key);
            }
          }}
        >
          <TabList aria-label="بخش‌های جزئیات سریال">
            <Tab id="overview">نمای کلی</Tab>
            <Tab id="devices" badge={devices.length}>
              دستگاه‌های فعال
            </Tab>
            <Tab id="history" badge={timelineItems.length}>
              تاریخچه و ممیزی
            </Tab>
            <Tab id="diff">مقایسهٔ تغییرات</Tab>
          </TabList>

          <TabPanel id="overview">
            <Stack gap="5">
              <div className={styles.detailGrid}>
                <Surface>
                  <Section>
                    <Heading level={2} size="md" className={styles.sectionTitle}>
                      مشخصات ثبت‌شده
                    </Heading>
                    <KeyValueList aria-label="مشخصات سریال">
                      <KeyValueItem
                        label="شمارهٔ سریال"
                        value={record.serial}
                        code
                        copyValue={record.serial.replace(/-/g, '')}
                        onCopy={() =>
                          toast.add({ title: 'سریال کپی شد', description: record.serial, tone: 'success' })
                        }
                      />
                      <KeyValueItem label="محصول" value={record.productName} />
                      <KeyValueItem label="نام مشتری" value={record.customerName} />
                      <KeyValueItem label="شمارهٔ همراه" value={maskPhone(record.phone)} ltr />
                      <KeyValueItem
                        label="کد سفارش"
                        value={record.orderCode}
                        code
                        copyValue={record.orderCode}
                      />
                      <KeyValueItem
                        label="سقف مؤثر (FR-23)"
                        value={`${formatNumber(record.limit, { maximumFractionDigits: 0 })} رایانه (${LIMIT_SOURCE_LABELS[record.limitSource]})`}
                      />
                      <KeyValueItem label="زمان صدور" value={formatDateTime(record.createdAt)} />
                    </KeyValueList>
                  </Section>
                </Surface>

                <Surface>
                  <Section>
                    <Heading level={2} size="md" className={styles.sectionTitle}>
                      دستگاه‌های ثبت‌شده
                    </Heading>
                    <GridList aria-label="فهرست دستگاه‌های فعال سریال" bordered={false}>
                      {devices.map((device) => (
                        <GridListItem
                          key={device.id}
                          id={device.id}
                          title={device.label}
                          description={`${device.os} · ${formatDate(device.activatedAt)}`}
                          leading={<Icon icon={iconLaptop} size="sm" />}
                          meta={
                            <>
                              <Code>{device.systemCode}</Code>
                              <StatusBadge
                                domain="serial"
                                status={device.active ? 'active' : 'revoked'}
                                size="sm"
                              />
                            </>
                          }
                          actions={
                            <IconButton
                              icon={iconCopy}
                              variant="ghost"
                              size="sm"
                              aria-label={`کپی کد فعال‌سازی ${device.label}`}
                              onPress={() =>
                                toast.add({
                                  title: 'کد فعال‌سازی کپی شد',
                                  description: device.activationCode,
                                  tone: 'success',
                                })
                              }
                            />
                          }
                        />
                      ))}
                    </GridList>
                  </Section>
                </Surface>
              </div>

              <div className={styles.detailGrid}>
                <Surface>
                  <Section>
                    <Heading level={2} size="md" className={styles.sectionTitle}>
                      رویدادهای اخیر و ممیزی
                    </Heading>
                    <Timeline aria-label="رویدادهای اخیر سریال" items={timelineItems.slice(0, 3)} />
                  </Section>
                </Surface>

                <DiffView
                  title="آخرین تغییر سیاست سقف"
                  beforeLabel={record.policySummaryBefore}
                  afterLabel={record.policySummaryAfter}
                  before={record.policyBefore}
                  after={record.policyAfter}
                  isCode
                  allowModeToggle
                />
              </div>
            </Stack>
          </TabPanel>

          <TabPanel id="devices">
            <Stack gap="4">
              <BulkActionBar
                selectedCount={selectedDeviceIds.length}
                totalCount={devices.length}
                onSelectAll={() => setSelectedDevices('all')}
                onClearSelection={() => setSelectedDevices(new Set())}
              >
                <Button
                  variant="danger"
                  size="sm"
                  iconStart={iconTrash}
                  onPress={handleDeactivateSelectedDevices}
                >
                  غیرفعال کردن انتخاب‌شده‌ها
                </Button>
              </BulkActionBar>

              <GridList
                aria-label="مدیریت دستگاه‌های فعال"
                selectionMode="multiple"
                selectedKeys={selectedDevices}
                onSelectionChange={setSelectedDevices}
              >
                {devices.map((device) => (
                  <GridListItem
                    key={device.id}
                    id={device.id}
                    title={device.label}
                    description={`${device.os} · فعال‌سازی در ${formatDateTime(device.activatedAt)}`}
                    leading={<Icon icon={iconLaptop} size="sm" />}
                    meta={
                      <>
                        <Code>{device.systemCode}</Code>
                        <Ltr>{device.ip}</Ltr>
                        <StatusBadge
                          domain="serial"
                          status={device.active ? 'active' : 'revoked'}
                          size="sm"
                        />
                      </>
                    }
                  />
                ))}
              </GridList>
            </Stack>
          </TabPanel>

          <TabPanel id="history">
            <Surface>
              <Section>
                <ActivityList
                  aria-label="تاریخچهٔ کامل فعال‌سازی و ممیزی"
                  items={timelineItems}
                  onAction={(key) =>
                    toast.add({
                      title: 'جزئیات رویداد',
                      description: `شناسهٔ رویداد: ${String(key)}`,
                      tone: 'info',
                    })
                  }
                />
              </Section>
            </Surface>
          </TabPanel>

          <TabPanel id="diff">
            <DiffView
              title={`مقایسهٔ نسخه‌های سیاست سریال ${record.serial}`}
              beforeLabel={record.policySummaryBefore}
              afterLabel={record.policySummaryAfter}
              before={record.policyBefore}
              after={record.policyAfter}
              isCode
              defaultMode="split"
              allowModeToggle
            />
          </TabPanel>
        </Tabs>

        <Sheet
          isOpen={isLimitSheetOpen}
          onOpenChange={setIsLimitSheetOpen}
          side="end"
          title="ویرایش سقف فعال‌سازی (FR-23)"
          description="تغییر سقف در تاریخچهٔ ممیزی و جدول مقایسهٔ تغییرات ثبت می‌شود."
          footer={(close) => (
            <ButtonGroup justify="end" stackOnMobile>
              <Button variant="ghost" onPress={close}>
                انصراف
              </Button>
              <Button
                variant="primary"
                iconStart={iconShield}
                onPress={() => {
                  const nextAfter = `serial=${record.serial}\nlimit=${draftLimit}\nsource=${draftSource}\nallow_repeat_pc=true\nreason=${draftReason || 'admin_override'}\nstatus=${record.status}`;
                  setRecord((prev) => ({
                    ...prev,
                    limit: draftLimit,
                    limitSource: draftSource,
                    policyBefore: prev.policyAfter,
                    policyAfter: nextAfter,
                    timeline: [
                      {
                        id: `ev-live-${prev.timeline.length + 1}`,
                        title: `به‌روزرسانی سقف به ${formatNumber(draftLimit, { maximumFractionDigits: 0 })} رایانه`,
                        description:
                          draftReason.trim() ||
                          `منبع سقف مؤثر روی «${LIMIT_SOURCE_LABELS[draftSource]}» تنظیم شد.`,
                        timestamp: new Date().toISOString(),
                        tone: 'warning',
                        actor: 'حامد کریمی (مدیر سامانه)',
                        badgeText: 'تغییر سقف',
                      },
                      ...prev.timeline,
                    ],
                  }));
                  toast.add({
                    title: 'سقف مؤثر ذخیره شد',
                    description: `${formatNumber(draftLimit, { maximumFractionDigits: 0 })} رایانه (${LIMIT_SOURCE_LABELS[draftSource]})`,
                    tone: 'success',
                  });
                  setDraftReason('');
                  close();
                }}
              >
                ذخیرهٔ تغییر سقف
              </Button>
            </ButtonGroup>
          )}
        >
          <div className={styles.dialogForm}>
            <NumberField
              label="سقف فعال‌سازی مؤثر"
              value={draftLimit}
              onChange={setDraftLimit}
              minValue={1}
              maxValue={20}
            />
            <Select
              label="منبع سقف (FR-23)"
              value={draftSource}
              onChange={(key) => setDraftSource(String(key) as LimitSource)}
            >
              <SelectItem id="serial">{LIMIT_SOURCE_LABELS.serial}</SelectItem>
              <SelectItem id="customer">{LIMIT_SOURCE_LABELS.customer}</SelectItem>
              <SelectItem id="product">{LIMIT_SOURCE_LABELS.product}</SelectItem>
              <SelectItem id="global">{LIMIT_SOURCE_LABELS.global}</SelectItem>
            </Select>
            <TextField
              label="دلیل تغییر"
              value={draftReason}
              onChange={setDraftReason}
              placeholder="توضیح کوتاه برای گزارش ممیزی…"
            />
          </div>
        </Sheet>

        <AlertDialog
          isOpen={isRevokeOpen}
          onOpenChange={setIsRevokeOpen}
          tone="danger"
          title="ابطال سریال"
          confirmLabel="بله، سریال باطل شود"
          onConfirm={() => {
            setRecord((prev) => ({ ...prev, status: 'revoked' }));
            toast.add({
              title: 'سریال باطل شد',
              description: record.serial,
              tone: 'warning',
            });
          }}
        >
          آیا از ابطال سریال <Code>{record.serial}</Code> اطمینان دارید؟ پس از ابطال، امکان
          فعال‌سازی تازه وجود ندارد.
        </AlertDialog>
      </Stack>
    </div>
  );
}

function AdminSerialDetailPage() {
  const { serial } = Route.useParams();
  const { tab } = Route.useSearch();
  const record = findAdminSerial(serial);

  return (
    <AdminShell activeSection="serials">
      {record ? (
        <AdminSerialDetailContent
          key={record.serial}
          initialRecord={record}
          initialTab={tab ?? 'overview'}
        />
      ) : (
        <ErrorState
          status={404}
          headingLevel={1}
          title="سریال مورد نظر یافت نشد"
          description="شمارهٔ سریال واردشده در فهرست نمونهٔ رجیستری وجود ندارد."
          actionHref="/reference/admin-serials"
          actionLabel="بازگشت به فهرست سریال‌ها"
        />
      )}
    </AdminShell>
  );
}
