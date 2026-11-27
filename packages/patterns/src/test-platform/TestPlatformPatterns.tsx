import {
  iconCard,
  iconDownload,
  iconKey,
  iconLink,
  iconPlay,
  iconPlus,
  iconTest,
  iconTrash,
} from '@negaresh/icons';
import {
  AlertDialog,
  Badge,
  Button,
  type CampaignStatus,
  Card,
  CardBody,
  CardFooter,
  Checkbox,
  CheckboxGroup,
  Code,
  CopyButton,
  DataTable,
  type DataTableColumn,
  DatePicker,
  DialogTrigger,
  EmptyState,
  FileUpload,
  FilterBar,
  Heading,
  Inline,
  InlineAlert,
  KeyValueList,
  LinkButton,
  Ltr,
  NumberField,
  PhoneField,
  type ReportStatus,
  Section,
  Select,
  SelectItem,
  Stack,
  StatGroup,
  StatTile,
  type StatTileProps,
  StatusBadge,
  Surface,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Text,
  TextArea,
  TextField,
  UsageMeter,
} from '@negaresh/react';
import {
  type DateInput,
  formatDate,
  formatDateTime,
  formatPrice,
  formatToman,
  isValidPhone,
  maskPhone,
  normalizePhone,
} from '@negaresh/utils';
import { type ReactNode, type Ref, useMemo, useState } from 'react';
import { Price } from '../commerce/Price.tsx';
import { usePatternMessages } from '../messages/context.tsx';
import styles from './test-platform.module.css';

/* ── TestCatalog ─────────────────────────────────────────────────────────────────────── */
export interface TestCatalogItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  questionCount: number;
  estimatedMinutes: number;
  price: number;
  originalPrice?: number | undefined;
  isOrgRate?: boolean | undefined;
}

export interface TestCatalogProps {
  tests: readonly TestCatalogItem[];
  onStartOrBuy?: ((testId: string) => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Psychometric test catalog displaying free, sale, and organization-rate Toman pricing. */
export function TestCatalog({ tests, onStartOrBuy, className, ref }: TestCatalogProps) {
  const { testPlatform } = usePatternMessages();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tests;
    return tests.filter((t) => `${t.title} ${t.summary} ${t.category}`.toLowerCase().includes(q));
  }, [tests, query]);

  return (
    <section
      ref={ref}
      data-nds="TestCatalog"
      aria-label={testPlatform.catalogTitle}
      className={className}
    >
      <Stack gap="4">
        <Heading level={2}>{testPlatform.catalogTitle}</Heading>
        <FilterBar
          aria-label={testPlatform.catalogTitle}
          searchValue={query}
          onSearchChange={setQuery}
          searchPlaceholder={testPlatform.catalogSearchPlaceholder}
          onReset={() => setQuery('')}
        />
        {filtered.length === 0 ? (
          <EmptyState icon={iconTest} title={testPlatform.catalogEmptyTitle} />
        ) : (
          <div className={styles.catalogGrid}>
            {filtered.map((test) => (
              <Card key={test.id}>
                <CardBody>
                  <Stack gap="3">
                    <Inline gap="2">
                      <Badge tone="neutral" size="sm">
                        {test.category}
                      </Badge>
                      <Text size="xs" tone="subtle">
                        {testPlatform.questionsCount(test.questionCount)}
                      </Text>
                      <Text size="xs" tone="subtle">
                        {testPlatform.estimatedMinutes(test.estimatedMinutes)}
                      </Text>
                    </Inline>
                    <Heading level={3}>{test.title}</Heading>
                    <Text as="p" size="sm" tone="muted" leading="text">
                      {test.summary}
                    </Text>
                  </Stack>
                </CardBody>
                <CardFooter tone="sunken">
                  <Inline gap="3">
                    <Price
                      amount={test.price}
                      {...(test.originalPrice !== undefined
                        ? { originalAmount: test.originalPrice }
                        : {})}
                      isOrgRate={Boolean(test.isOrgRate)}
                      size="md"
                    />
                    {onStartOrBuy && (
                      <Button
                        size="sm"
                        variant="primary"
                        iconStart={iconPlay}
                        onPress={() => onStartOrBuy(test.id)}
                      >
                        {test.price <= 0 ? testPlatform.startTest : testPlatform.buyTest}
                      </Button>
                    )}
                  </Inline>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </Stack>
    </section>
  );
}

/* ── TestDashboard ───────────────────────────────────────────────────────────────────── */
export interface DashboardReportItem {
  id: string;
  testTitle: string;
  status: ReportStatus;
  createdAt: DateInput;
  downloadHref?: string | undefined;
  resultHref?: string | undefined;
}

export interface TestDashboardProps {
  stats: readonly StatTileProps[];
  /** Optional unfinished attempt card (e.g. `@negaresh/assessment` `ResumeOrRestart`). */
  resumeSlot?: ReactNode | undefined;
  /** Fallback unfinished test title when `resumeSlot` is not supplied. */
  unfinishedTestTitle?: string | undefined;
  onContinueAttempt?: (() => void) | undefined;
  reports: readonly DashboardReportItem[];
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Test-taker dashboard composing summary `StatGroup`, unfinished-attempt resume slot, and ready/recent reports. */
export function TestDashboard({
  stats,
  resumeSlot,
  unfinishedTestTitle,
  onContinueAttempt,
  reports,
  className,
  ref,
}: TestDashboardProps) {
  const { testPlatform } = usePatternMessages();
  const readyReports = reports.filter((r) => r.status === 'ready');

  return (
    <section
      ref={ref}
      data-nds="TestDashboard"
      aria-label={testPlatform.dashboardTitle}
      className={className}
    >
      <Stack gap="5">
        <Heading level={2}>{testPlatform.dashboardTitle}</Heading>
        <StatGroup>
          {stats.map((tile) => (
            <StatTile key={String(tile.label)} {...tile} />
          ))}
        </StatGroup>

        {(resumeSlot !== undefined || unfinishedTestTitle !== undefined) && (
          <Surface>
            <Section>
              <Stack gap="3">
                <Heading level={3}>{testPlatform.resumeHeading}</Heading>
                {resumeSlot ?? (
                  <div className={styles.listRow}>
                    <Text weight="semibold">{unfinishedTestTitle}</Text>
                    {onContinueAttempt && (
                      <Button size="sm" variant="primary" iconStart={iconPlay} onPress={onContinueAttempt}>
                        {testPlatform.continueAttempt}
                      </Button>
                    )}
                  </div>
                )}
              </Stack>
            </Section>
          </Surface>
        )}

        <div className={styles.twoCol}>
          <Surface>
            <Section>
              <Stack gap="3">
                <Heading level={3}>{testPlatform.readyReportsHeading}</Heading>
                <ul className={styles.plainList}>
                  {readyReports.map((rep) => (
                    <li key={rep.id} className={styles.listRow}>
                      <Stack gap="1">
                        <Text weight="semibold" size="sm">
                          {rep.testTitle}
                        </Text>
                        <Text size="xs" tone="subtle">
                          {formatDate(rep.createdAt)}
                        </Text>
                      </Stack>
                      <Inline gap="2">
                        <StatusBadge domain="report" status={rep.status} size="sm" />
                        {rep.downloadHref && (
                          <LinkButton size="sm" variant="secondary" href={rep.downloadHref}>
                            {testPlatform.downloadReport}
                          </LinkButton>
                        )}
                      </Inline>
                    </li>
                  ))}
                </ul>
              </Stack>
            </Section>
          </Surface>

          <Surface>
            <Section>
              <Stack gap="3">
                <Heading level={3}>{testPlatform.recentResultsHeading}</Heading>
                <ul className={styles.plainList}>
                  {reports.map((rep) => (
                    <li key={rep.id} className={styles.listRow}>
                      <Stack gap="1">
                        <Text weight="semibold" size="sm">
                          {rep.testTitle}
                        </Text>
                        <Text size="xs" tone="subtle">
                          {formatDate(rep.createdAt)}
                        </Text>
                      </Stack>
                      <Inline gap="2">
                        <StatusBadge domain="report" status={rep.status} size="sm" />
                        {rep.resultHref && (
                          <LinkButton size="sm" variant="ghost" href={rep.resultHref}>
                            {testPlatform.viewResult}
                          </LinkButton>
                        )}
                      </Inline>
                    </li>
                  ))}
                </ul>
              </Stack>
            </Section>
          </Surface>
        </div>
      </Stack>
    </section>
  );
}

/* ── Campaign Patterns ───────────────────────────────────────────────────────────────── */
export interface CampaignBuilderProps {
  testOptions: readonly { id: string; label: string }[];
  extraFieldOptions: readonly { id: string; label: string }[];
  onCreate?: ((payload: {
    name: string;
    testId: string;
    seats: number;
    expiryDate: string | null;
    extraFields: string[];
  }) => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Organization campaign builder form (test choice, seats, Jalali expiry, and demographic fields). */
export function CampaignBuilder({
  testOptions,
  extraFieldOptions,
  onCreate,
  className,
  ref,
}: CampaignBuilderProps) {
  const { testPlatform } = usePatternMessages();
  const [name, setName] = useState('');
  const [testId, setTestId] = useState(testOptions[0]?.id ?? '');
  const [seats, setSeats] = useState(50);
  const [expiryDate, setExpiryDate] = useState<string | null>('2026-12-20');
  const [extraFields, setExtraFields] = useState<string[]>(
    extraFieldOptions[0] ? [extraFieldOptions[0].id] : [],
  );

  return (
    <Surface ref={ref} data-nds="CampaignBuilder" className={className}>
      <Section>
        <Stack gap="4">
          <Heading level={2}>{testPlatform.campaignBuilderTitle}</Heading>
          <div className={styles.twoCol}>
            <TextField
              label={testPlatform.campaignNameLabel}
              value={name}
              onChange={setName}
            />
            <Select
              label={testPlatform.campaignTestLabel}
              value={testId}
              onChange={(k) => setTestId(String(k ?? ''))}
            >
              {testOptions.map((opt) => (
                <SelectItem key={opt.id} id={opt.id} textValue={opt.label}>
                  {opt.label}
                </SelectItem>
              ))}
            </Select>
            <NumberField
              label={testPlatform.campaignSeatLimitLabel}
              minValue={1}
              maxValue={5000}
              value={seats}
              onChange={(v) => setSeats(Number.isFinite(v) ? v : 1)}
            />
            <DatePicker
              label={testPlatform.campaignExpiryLabel}
              value={expiryDate}
              onChange={setExpiryDate}
            />
          </div>
          <CheckboxGroup
            label={testPlatform.campaignExtraFieldsLegend}
            value={extraFields}
            onChange={setExtraFields}
          >
            {extraFieldOptions.map((f) => (
              <Checkbox key={f.id} value={f.id}>
                {f.label}
              </Checkbox>
            ))}
          </CheckboxGroup>
          <Inline gap="2">
            <Button
              variant="primary"
              iconStart={iconPlus}
              isDisabled={name.trim().length === 0}
              onPress={() => onCreate?.({ name: name.trim(), testId, seats, expiryDate, extraFields })}
            >
              {testPlatform.createCampaign}
            </Button>
          </Inline>
        </Stack>
      </Section>
    </Surface>
  );
}

export interface ShareLinkPanelProps {
  shareUrl: string;
  onExportIndividualCsv?: (() => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Campaign share-link panel with LTR URL copy and individual-links CSV export. */
export function ShareLinkPanel({
  shareUrl,
  onExportIndividualCsv,
  className,
  ref,
}: ShareLinkPanelProps) {
  const { testPlatform } = usePatternMessages();

  return (
    <Surface ref={ref} data-nds="ShareLinkPanel" className={className}>
      <Section>
        <Stack gap="4">
          <Heading level={3}>{testPlatform.shareLinkTitle}</Heading>
          <KeyValueList
            items={[
              {
                id: 'share-url',
                label: testPlatform.publicLinkLabel,
                value: shareUrl,
                code: true,
                copyValue: shareUrl,
                copyLabel: testPlatform.copyShareLink,
              },
            ]}
          />
          <Inline gap="2">
            <CopyButton value={shareUrl} variant="primary">
              {testPlatform.copyShareLink}
            </CopyButton>
            {onExportIndividualCsv && (
              <Button
                variant="secondary"
                iconStart={iconDownload}
                onPress={onExportIndividualCsv}
              >
                {testPlatform.exportIndividualLinksCsv}
              </Button>
            )}
          </Inline>
        </Stack>
      </Section>
    </Surface>
  );
}

export interface RosterImportProps {
  defaultPasteText?: string | undefined;
  onImport?: ((validEntries: string[]) => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Campaign roster importer with tabbed paste list (live phone normalization/validation) and CSV FileUpload. */
export function RosterImport({
  defaultPasteText = '',
  onImport,
  className,
  ref,
}: RosterImportProps) {
  const { testPlatform } = usePatternMessages();
  const [pasteText, setPasteText] = useState(defaultPasteText);

  const parsed = useMemo(() => {
    const lines = pasteText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const valid: string[] = [];
    let invalid = 0;
    for (const line of lines) {
      if (isValidPhone(line)) {
        const normalized = normalizePhone(line);
        if (normalized) valid.push(normalized);
      } else {
        invalid += 1;
      }
    }
    return { valid, invalid };
  }, [pasteText]);

  return (
    <Surface ref={ref} data-nds="RosterImport" className={className}>
      <Section>
        <Stack gap="4">
          <Heading level={3}>{testPlatform.rosterImportTitle}</Heading>
          <Tabs defaultSelectedKey="paste">
            <TabList aria-label={testPlatform.rosterImportTitle}>
              <Tab id="paste">{testPlatform.rosterTabPaste}</Tab>
              <Tab id="csv">{testPlatform.rosterTabCsv}</Tab>
            </TabList>
            <TabPanel id="paste">
              <Stack gap="3">
                <TextArea
                  label={testPlatform.rosterPasteLabel}
                  description={testPlatform.rosterPasteHint}
                  value={pasteText}
                  onChange={setPasteText}
                />
                <Inline gap="3">
                  <Badge tone={parsed.invalid > 0 ? 'warning' : 'success'} size="sm">
                    {testPlatform.rosterSummary(parsed.valid.length, parsed.invalid)}
                  </Badge>
                  <Button
                    size="sm"
                    variant="primary"
                    isDisabled={parsed.valid.length === 0}
                    onPress={() => onImport?.(parsed.valid)}
                  >
                    {testPlatform.importRosterAction}
                  </Button>
                </Inline>
              </Stack>
            </TabPanel>
            <TabPanel id="csv">
              <FileUpload
                label={testPlatform.rosterCsvLabel}
                accept={['.csv', '.txt']}
              />
            </TabPanel>
          </Tabs>
        </Stack>
      </Section>
    </Surface>
  );
}

export interface SeatMeterProps {
  used: number;
  limit: number;
  sourceNote?: string | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/** Campaign seat capacity meter composing approved `UsageMeter`. */
export function SeatMeter({ used, limit, sourceNote, className, ref }: SeatMeterProps) {
  const { testPlatform } = usePatternMessages();
  return (
    <UsageMeter
      ref={ref}
      label={testPlatform.seatMeterLabel}
      used={used}
      limit={limit}
      {...(sourceNote !== undefined ? { sourceNote } : {})}
      showFullIndicator
      className={className}
    />
  );
}

export interface CampaignParticipant {
  id: string;
  identifier: string;
  status: CampaignStatus;
  completedAt?: DateInput | undefined;
}

export interface CampaignParticipantsProps {
  participants: readonly CampaignParticipant[];
  'aria-label'?: string | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Campaign participant roster table with masked/LTR identifiers and `StatusBadge(domain="campaign")`. */
export function CampaignParticipants({
  participants,
  'aria-label': ariaLabel,
  className,
  ref,
}: CampaignParticipantsProps) {
  const { testPlatform } = usePatternMessages();
  const label = ariaLabel ?? testPlatform.participantsTitle;

  const columns: DataTableColumn<CampaignParticipant>[] = [
    {
      id: 'identifier',
      header: testPlatform.participantColumnId,
      cell: (row) => (
        <Ltr>{isValidPhone(row.identifier) ? maskPhone(row.identifier) : row.identifier}</Ltr>
      ),
      mobilePrimary: true,
    },
    {
      id: 'status',
      header: testPlatform.participantColumnStatus,
      cell: (row) => <StatusBadge domain="campaign" status={row.status} size="sm" />,
    },
    {
      id: 'completedAt',
      header: testPlatform.participantColumnCompletedAt,
      cell: (row) => (row.completedAt ? formatDateTime(row.completedAt) : '—'),
    },
  ];

  return (
    <section ref={ref} data-nds="CampaignParticipants" aria-label={label} className={className}>
      <Stack gap="3">
        <Heading level={3}>{testPlatform.participantsTitle}</Heading>
        <DataTable
          aria-label={label}
          columns={columns}
          rows={participants}
          getRowKey={(r) => r.id}
        />
      </Stack>
    </section>
  );
}

/* ── OrgWallet ───────────────────────────────────────────────────────────────────────── */
export interface WalletLedgerEntry {
  id: string;
  date: DateInput;
  description: string;
  /** Positive for top-up, negative for allocation/consumption (Toman). */
  delta: number;
  balanceAfter: number;
}

export interface OrgWalletProps {
  balance: number;
  ledger: readonly WalletLedgerEntry[];
  topUpPresets?: readonly number[] | undefined;
  onTopUp?: ((amount: number) => void) | undefined;
  onAllocate?: ((payload: { phone: string; amount: number }) => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Organization Toman wallet: balance hero, top-up presets, allocate-by-phone form, and Jalali ledger `DataTable`. */
export function OrgWallet({
  balance,
  ledger,
  topUpPresets = [1_000_000, 3_000_000, 5_000_000],
  onTopUp,
  onAllocate,
  className,
  ref,
}: OrgWalletProps) {
  const { testPlatform } = usePatternMessages();
  const [topUpAmount, setTopUpAmount] = useState(topUpPresets[0] ?? 1_000_000);
  const [allocPhone, setAllocPhone] = useState('');
  const [allocAmount, setAllocAmount] = useState(250_000);

  const columns: DataTableColumn<WalletLedgerEntry>[] = [
    { id: 'date', header: testPlatform.walletColumnDate, cell: (r) => formatDateTime(r.date) },
    {
      id: 'desc',
      header: testPlatform.walletColumnDescription,
      cell: (r) => r.description,
      mobilePrimary: true,
    },
    {
      id: 'delta',
      header: testPlatform.walletColumnAmount,
      cell: (r) => (
        <span className={r.delta >= 0 ? styles.amountPositive : styles.amountNegative}>
          {r.delta >= 0 ? `+${formatToman(r.delta)}` : `−${formatToman(Math.abs(r.delta))}`}
        </span>
      ),
    },
    {
      id: 'balance',
      header: testPlatform.walletColumnBalance,
      cell: (r) => formatPrice(r.balanceAfter),
    },
  ];

  return (
    <section
      ref={ref}
      data-nds="OrgWallet"
      aria-label={testPlatform.walletTitle}
      className={className}
    >
      <Stack gap="5">
        <div className={styles.walletHero}>
          <Stack gap="1">
            <Text size="sm" tone="muted">
              {testPlatform.walletBalanceLabel}
            </Text>
            <span className={styles.walletAmount}>{formatToman(balance)}</span>
          </Stack>
          <Badge tone="accent" icon={iconCard}>
            {testPlatform.walletTitle}
          </Badge>
        </div>

        <div className={styles.twoCol}>
          <Surface>
            <Section>
              <Stack gap="3">
                <Heading level={3}>{testPlatform.walletTopUpHeading}</Heading>
                <Inline gap="2">
                  {topUpPresets.map((preset) => (
                    <Button
                      key={preset}
                      size="sm"
                      variant={topUpAmount === preset ? 'primary' : 'secondary'}
                      onPress={() => setTopUpAmount(preset)}
                    >
                      {formatToman(preset)}
                    </Button>
                  ))}
                </Inline>
                <NumberField
                  label={testPlatform.walletTopUpAmountLabel}
                  minValue={100_000}
                  step={100_000}
                  value={topUpAmount}
                  onChange={(v) => setTopUpAmount(Number.isFinite(v) ? v : 100_000)}
                />
                <Button
                  variant="primary"
                  iconStart={iconCard}
                  onPress={() => onTopUp?.(topUpAmount)}
                >
                  {testPlatform.walletTopUpAction}
                </Button>
              </Stack>
            </Section>
          </Surface>

          <Surface>
            <Section>
              <Stack gap="3">
                <Heading level={3}>{testPlatform.walletAllocateHeading}</Heading>
                <PhoneField
                  label={testPlatform.walletAllocatePhoneLabel}
                  value={allocPhone}
                  onChange={setAllocPhone}
                />
                <NumberField
                  label={testPlatform.walletAllocateAmountLabel}
                  minValue={50_000}
                  step={50_000}
                  value={allocAmount}
                  onChange={(v) => setAllocAmount(Number.isFinite(v) ? v : 50_000)}
                />
                <Button
                  variant="secondary"
                  isDisabled={allocPhone.trim().length < 10}
                  onPress={() => onAllocate?.({ phone: allocPhone, amount: allocAmount })}
                >
                  {testPlatform.walletAllocateAction}
                </Button>
              </Stack>
            </Section>
          </Surface>
        </div>

        <Stack gap="3">
          <Heading level={3}>{testPlatform.walletLedgerHeading}</Heading>
          <DataTable
            aria-label={testPlatform.walletLedgerHeading}
            columns={columns}
            rows={ledger}
            getRowKey={(r) => r.id}
          />
        </Stack>
      </Stack>
    </section>
  );
}

/* ── B2BPanel ────────────────────────────────────────────────────────────────────────── */
export interface B2BClientItem {
  id: string;
  name: string;
  keyPrefix: string;
  usedCalls: number;
  monthlyQuota: number;
  lastUsedAt?: DateInput | undefined;
}

export interface B2BPanelProps {
  clients: readonly B2BClientItem[];
  /** Newly created API key shown once with copy button and warning banner. */
  newlyCreatedKey?: string | undefined;
  onCreateKey?: (() => void) | undefined;
  onRevokeKey?: ((clientId: string) => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** B2B API access panel: client list, one-time-visible LTR key reveal with copy, revoke AlertDialog, and quota UsageMeter. */
export function B2BPanel({
  clients,
  newlyCreatedKey,
  onCreateKey,
  onRevokeKey,
  className,
  ref,
}: B2BPanelProps) {
  const { testPlatform } = usePatternMessages();

  return (
    <section ref={ref} data-nds="B2BPanel" aria-label={testPlatform.b2bTitle} className={className}>
      <Stack gap="5">
        <Inline gap="3">
          <Heading level={2}>{testPlatform.b2bTitle}</Heading>
          {onCreateKey && (
            <Button variant="primary" size="sm" iconStart={iconKey} onPress={onCreateKey}>
              {testPlatform.b2bCreateKeyAction}
            </Button>
          )}
        </Inline>

        {newlyCreatedKey && (
          <Stack gap="3">
            <InlineAlert tone="warning" title={testPlatform.b2bOneTimeKeyTitle}>
              {testPlatform.b2bOneTimeKeyWarning}
            </InlineAlert>
            <div className={styles.keyRevealBox}>
              <Inline gap="2">
                <Text size="sm" weight="semibold">
                  {testPlatform.b2bKeyLabel}:
                </Text>
                <Code>{newlyCreatedKey}</Code>
              </Inline>
              <CopyButton value={newlyCreatedKey} variant="primary" size="sm" />
            </div>
          </Stack>
        )}

        <Stack gap="3">
          <Heading level={3}>{testPlatform.b2bClientsHeading}</Heading>
          <ul className={styles.plainList}>
            {clients.map((client) => (
              <li key={client.id}>
                <Surface>
                  <Section>
                    <Stack gap="3">
                      <div className={styles.listRow}>
                        <Stack gap="1">
                          <Inline gap="2">
                            <Heading level={4}>{client.name}</Heading>
                            <Badge tone="neutral" size="sm" icon={iconLink}>
                              <Code>{`${client.keyPrefix}••••`}</Code>
                            </Badge>
                          </Inline>
                          {client.lastUsedAt && (
                            <Text size="xs" tone="subtle">
                              {formatDateTime(client.lastUsedAt)}
                            </Text>
                          )}
                        </Stack>
                        {onRevokeKey && (
                          <DialogTrigger>
                            <Button size="sm" variant="danger" iconStart={iconTrash}>
                              {testPlatform.b2bRevokeKeyAction}
                            </Button>
                            <AlertDialog
                              tone="danger"
                              title={testPlatform.b2bRevokeConfirmTitle}
                              confirmLabel={testPlatform.b2bRevokeKeyAction}
                              onConfirm={() => onRevokeKey(client.id)}
                            >
                              {testPlatform.b2bRevokeConfirmBody(client.name)}
                            </AlertDialog>
                          </DialogTrigger>
                        )}
                      </div>
                      <UsageMeter
                        label={testPlatform.b2bUsageLabel}
                        used={client.usedCalls}
                        limit={client.monthlyQuota}
                        showFullIndicator
                      />
                    </Stack>
                  </Section>
                </Surface>
              </li>
            ))}
          </ul>
        </Stack>
      </Stack>
    </section>
  );
}
