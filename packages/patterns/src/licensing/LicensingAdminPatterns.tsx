import { iconBell, iconDownload, iconKey, iconSend } from '@negaresh/icons';
import {
  Badge,
  Button,
  Code,
  DataTable,
  type DataTableColumn,
  DiffView,
  FilterBar,
  Heading,
  Inline,
  InlineAlert,
  NumberField,
  Section,
  Select,
  SelectItem,
  Stack,
  Surface,
  Switch,
  Text,
  TextField,
  Timeline,
  type TimelineEntry,
} from '@negaresh/react';
import { type DateInput, formatDateTime, formatNumber } from '@negaresh/utils';
import { type Ref, useMemo, useState } from 'react';
import { usePatternMessages } from '../messages/context.tsx';
import styles from './licensing.module.css';

export type LimitSource = 'serial' | 'customer' | 'product' | 'global';

export interface LimitEditorProps {
  effectiveLimit: number;
  source: LimitSource;
  history: readonly TimelineEntry[];
  onSaveOverride?: ((payload: { limit: number; reason: string }) => void) | undefined;
  onResetOverride?: (() => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Admin activation limit editor displaying FR-23 effective limit + source, override reason, and history. */
export function LimitEditor({
  effectiveLimit,
  source,
  history,
  onSaveOverride,
  onResetOverride,
  className,
  ref,
}: LimitEditorProps) {
  const { licensing } = usePatternMessages();
  const [nextLimit, setNextLimit] = useState(effectiveLimit);
  const [reason, setReason] = useState('');

  return (
    <section
      ref={ref}
      data-nds="LimitEditor"
      aria-label={licensing.limitEditorTitle}
      className={className}
    >
      <Stack gap="5">
        <Surface>
          <Section>
            <Stack gap="4">
              <div className={styles.cardHeader}>
                <Heading level={2}>{licensing.limitEditorTitle}</Heading>
                <Inline gap="2">
                  <Badge tone="accent">
                    {`${licensing.effectiveLimitLabel}: ${formatNumber(effectiveLimit, { maximumFractionDigits: 0 })}`}
                  </Badge>
                  <Badge tone="info">
                    {`${licensing.limitSourceLabel}: ${licensing.limitSources[source]}`}
                  </Badge>
                </Inline>
              </div>

              <div className={styles.formRow}>
                <NumberField
                  label={licensing.overrideLimitLabel}
                  minValue={1}
                  maxValue={99}
                  value={nextLimit}
                  onChange={(v) => setNextLimit(Number.isFinite(v) ? v : effectiveLimit)}
                />
                <TextField
                  label={licensing.overrideReasonLabel}
                  placeholder={licensing.overrideReasonPlaceholder}
                  value={reason}
                  onChange={setReason}
                  isRequired
                />
              </div>

              <Inline gap="3">
                <Button
                  variant="primary"
                  isDisabled={reason.trim().length === 0}
                  onPress={() => onSaveOverride?.({ limit: nextLimit, reason: reason.trim() })}
                >
                  {licensing.saveLimit}
                </Button>
                {source === 'serial' && onResetOverride && (
                  <Button variant="secondary" onPress={onResetOverride}>
                    {licensing.resetOverride}
                  </Button>
                )}
              </Inline>
            </Stack>
          </Section>
        </Surface>

        <Surface>
          <Section>
            <Stack gap="3">
              <Heading level={3}>{licensing.limitHistoryHeading}</Heading>
              <Timeline items={history} aria-label={licensing.limitHistoryHeading} />
            </Stack>
          </Section>
        </Surface>
      </Stack>
    </section>
  );
}

export interface SerialProductOption {
  id: string;
  name: string;
  defaultPrefix: string;
}

export interface SerialBatchGeneratorProps {
  products: readonly SerialProductOption[];
  defaultProductId?: string | undefined;
  defaultQuantity?: number | undefined;
  initialPreview?: readonly string[] | undefined;
  onGenerate?: ((payload: { productId: string; quantity: number; prefix: string }) => string[]) | undefined;
  onExportCsv?: ((serials: readonly string[]) => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

function buildSampleBatch(prefix: string, quantity: number): string[] {
  const safePrefix = (prefix.replace(/[^A-Za-z0-9]/g, '').toUpperCase() || 'N25').slice(0, 5);
  const count = Math.min(Math.max(1, Math.floor(quantity)), 24);
  return Array.from({ length: count }, (_, i) => {
    const tail = String(10001 + i * 37)
      .padStart(5, '0')
      .slice(-5);
    return `${safePrefix}-${tail}`;
  });
}

/** Admin serial batch generator with product selector, quantity field, LTR code preview, and CSV export. */
export function SerialBatchGenerator({
  products,
  defaultProductId,
  defaultQuantity = 6,
  initialPreview,
  onGenerate,
  onExportCsv,
  className,
  ref,
}: SerialBatchGeneratorProps) {
  const { licensing } = usePatternMessages();
  const initialProduct = products.find((p) => p.id === defaultProductId) ?? products[0];
  const [productId, setProductId] = useState(initialProduct?.id ?? '');
  const [quantity, setQuantity] = useState(defaultQuantity);
  const [prefix, setPrefix] = useState(initialProduct?.defaultPrefix ?? 'N25AG');
  const [preview, setPreview] = useState<readonly string[]>(
    initialPreview ?? buildSampleBatch(initialProduct?.defaultPrefix ?? 'N25AG', defaultQuantity),
  );

  const handleGenerate = () => {
    const next = onGenerate
      ? onGenerate({ productId, quantity, prefix })
      : buildSampleBatch(prefix, quantity);
    setPreview(next);
  };

  return (
    <Surface ref={ref} data-nds="SerialBatchGenerator" className={className}>
      <Section>
        <Stack gap="4">
          <Heading level={2}>{licensing.batchGeneratorTitle}</Heading>
          <div className={styles.formRow}>
            <Select
              label={licensing.batchProductLabel}
              value={productId}
              onChange={(key) => {
                const nextId = String(key ?? '');
                setProductId(nextId);
                const found = products.find((p) => p.id === nextId);
                if (found) setPrefix(found.defaultPrefix);
              }}
            >
              {products.map((p) => (
                <SelectItem key={p.id} id={p.id} textValue={p.name}>
                  {p.name}
                </SelectItem>
              ))}
            </Select>
            <NumberField
              label={licensing.batchQuantityLabel}
              minValue={1}
              maxValue={500}
              value={quantity}
              onChange={(v) => setQuantity(Number.isFinite(v) ? v : 1)}
            />
          </div>

          <TextField
            label={licensing.batchPrefixLabel}
            value={prefix}
            onChange={setPrefix}
          />

          <Inline gap="3">
            <Button variant="primary" iconStart={iconKey} onPress={handleGenerate}>
              {licensing.generatePreview}
            </Button>
            {onExportCsv && (
              <Button
                variant="secondary"
                iconStart={iconDownload}
                isDisabled={preview.length === 0}
                onPress={() => onExportCsv(preview)}
              >
                {licensing.exportCsv}
              </Button>
            )}
          </Inline>

          {preview.length > 0 && (
            <Stack gap="2">
              <Text size="sm" weight="semibold" tone="muted">
                {licensing.batchPreviewHeading(preview.length)}
              </Text>
              <ul className={styles.previewGrid}>
                {preview.map((code) => (
                  <li key={code} className={styles.previewItem}>
                    <Code>{code}</Code>
                  </li>
                ))}
              </ul>
            </Stack>
          )}
        </Stack>
      </Section>
    </Surface>
  );
}

export type AlertChannelId = 'sms' | 'email' | 'telegram' | 'bale';

export interface AlertChannelConfig {
  id: AlertChannelId;
  enabled: boolean;
  endpoint: string;
}

export interface AlertChannelsProps {
  channels: readonly AlertChannelConfig[];
  primaryRecipient: string;
  secondaryRecipient: string;
  onToggleChannel?: ((id: AlertChannelId, enabled: boolean) => void) | undefined;
  onEndpointChange?: ((id: AlertChannelId, endpoint: string) => void) | undefined;
  onRecipientsChange?: ((primary: string, secondary: string) => void) | undefined;
  onSendTest?: ((id: AlertChannelId) => void) | undefined;
  'aria-label'?: string | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Admin alert channels pattern: SMS, email, Telegram relay, Bale, two recipients, and per-channel send-test. */
export function AlertChannels({
  channels,
  primaryRecipient,
  secondaryRecipient,
  onToggleChannel,
  onEndpointChange,
  onRecipientsChange,
  onSendTest,
  'aria-label': ariaLabel,
  className,
  ref,
}: AlertChannelsProps) {
  const { licensing } = usePatternMessages();
  const [testedChannel, setTestedChannel] = useState<AlertChannelId | null>(null);
  const [primary, setPrimary] = useState(primaryRecipient);
  const [secondary, setSecondary] = useState(secondaryRecipient);

  return (
    <section
      ref={ref}
      data-nds="AlertChannels"
      aria-label={ariaLabel ?? licensing.alertChannelsTitle}
      className={className}
    >
      <Stack gap="5">
        <Heading level={2}>{licensing.alertChannelsTitle}</Heading>
        <Stack gap="3">
          {channels.map((ch) => (
            <div key={ch.id} className={styles.channelRow}>
              <div className={styles.channelHeader}>
                <Switch
                  isSelected={ch.enabled}
                  onChange={(enabled) => onToggleChannel?.(ch.id, enabled)}
                >
                  {licensing.alertChannels[ch.id]}
                </Switch>
                <Button
                  variant="secondary"
                  iconStart={iconSend}
                  isDisabled={!ch.enabled}
                  onPress={() => {
                    setTestedChannel(ch.id);
                    onSendTest?.(ch.id);
                  }}
                >
                  {licensing.sendTest}
                </Button>
              </div>
              <TextField
                label={`${licensing.channelEndpointLabel} (${licensing.alertChannels[ch.id]})`}
                value={ch.endpoint}
                isDisabled={!ch.enabled}
                onChange={(v) => onEndpointChange?.(ch.id, v)}
              />
              {testedChannel === ch.id && (
                <InlineAlert tone="success" title={licensing.alertChannels[ch.id]}>
                  {licensing.testSentNote}
                </InlineAlert>
              )}
            </div>
          ))}
        </Stack>

        <Surface>
          <Section>
            <Stack gap="3">
              <Inline gap="2">
                <Heading level={3}>{licensing.recipientsHeading}</Heading>
                <Badge tone="neutral" size="sm">
                  {formatNumber(2, { maximumFractionDigits: 0 })}
                </Badge>
              </Inline>
              <div className={styles.formRow}>
                <TextField
                  label={licensing.primaryRecipientLabel}
                  value={primary}
                  onChange={(v) => {
                    setPrimary(v);
                    onRecipientsChange?.(v, secondary);
                  }}
                />
                <TextField
                  label={licensing.secondaryRecipientLabel}
                  value={secondary}
                  onChange={(v) => {
                    setSecondary(v);
                    onRecipientsChange?.(primary, v);
                  }}
                />
              </div>
            </Stack>
          </Section>
        </Surface>
      </Stack>
    </section>
  );
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: DateInput;
  ip: string;
  before?: string | undefined;
  after?: string | undefined;
}

export interface AuditLogProps {
  entries: readonly AuditLogEntry[];
  /** Unique accessible name when multiple audit logs appear on one page. */
  'aria-label'?: string | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Filterable admin audit log combining `FilterBar`, `DataTable`, LTR IP `<Code>`, and expandable `DiffView`. */
export function AuditLog({
  entries,
  'aria-label': ariaLabel,
  className,
  ref,
}: AuditLogProps) {
  const { licensing } = usePatternMessages();
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (e) =>
        e.actor.toLowerCase().includes(q) ||
        e.action.toLowerCase().includes(q) ||
        e.target.toLowerCase().includes(q) ||
        e.ip.toLowerCase().includes(q),
    );
  }, [entries, query]);

  const expandedEntry = filtered.find((e) => e.id === expandedId);
  const label = ariaLabel ?? licensing.auditLogTitle;

  const columns: DataTableColumn<AuditLogEntry>[] = [
    { id: 'actor', header: licensing.auditColumnActor, cell: (row) => row.actor, mobilePrimary: true },
    { id: 'action', header: licensing.auditColumnAction, cell: (row) => row.action },
    { id: 'target', header: licensing.auditColumnTarget, cell: (row) => <Code>{row.target}</Code> },
    { id: 'time', header: licensing.auditColumnTime, cell: (row) => formatDateTime(row.timestamp) },
    { id: 'ip', header: licensing.auditColumnIp, cell: (row) => <Code>{row.ip}</Code> },
    {
      id: 'diff',
      header: licensing.auditColumnDiff,
      cell: (row) =>
        row.before !== undefined && row.after !== undefined ? (
          <Button
            variant="ghost"
            iconStart={iconBell}
            onPress={() => setExpandedId((cur) => (cur === row.id ? null : row.id))}
          >
            {expandedId === row.id ? licensing.auditHideDiff : licensing.auditShowDiff}
          </Button>
        ) : (
          '—'
        ),
    },
  ];

  return (
    <div ref={ref as Ref<HTMLDivElement>} data-nds="AuditLog" className={className}>
      <Stack gap="4">
        <Heading level={2}>{licensing.auditLogTitle}</Heading>
        <FilterBar
          aria-label={label}
          searchValue={query}
          onSearchChange={setQuery}
          searchPlaceholder={licensing.auditSearchPlaceholder}
          onReset={() => setQuery('')}
        />
        <DataTable
          aria-label={label}
          columns={columns}
          rows={filtered}
          getRowKey={(row) => row.id}
          getRowTextValue={(row) => `${row.actor} ${row.action} ${row.target}`}
        />
        {expandedEntry && expandedEntry.before !== undefined && expandedEntry.after !== undefined && (
          <div className={styles.auditDiffPanel}>
            <DiffView
              before={expandedEntry.before}
              after={expandedEntry.after}
              aria-label={`${licensing.auditColumnDiff}: ${expandedEntry.target}`}
            />
          </div>
        )}
      </Stack>
    </div>
  );
}
