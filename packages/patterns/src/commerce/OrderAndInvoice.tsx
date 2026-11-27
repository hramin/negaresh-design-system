import { iconDownload, iconPrint } from '@negaresh/icons';
import {
  Button,
  Code,
  Heading,
  Inline,
  type KeyValueEntry,
  KeyValueList,
  LogoSlot,
  type OrderStatus,
  Section,
  Stack,
  StatusBadge,
  Surface,
  Text,
  Timeline,
  type TimelineEntry,
} from '@negaresh/react';
import { type DateInput, formatDate, formatNumber, formatPrice } from '@negaresh/utils';
import type { Ref } from 'react';
import { cx } from '../internal/cx.ts';
import { usePatternMessages } from '../messages/context.tsx';
import styles from './commerce.module.css';
import { Price } from './Price.tsx';

export interface OrderLineItem {
  id: string;
  title: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderDetailProps {
  orderNumber: string;
  status: OrderStatus;
  createdAt: DateInput;
  timeline: readonly TimelineEntry[];
  items: readonly OrderLineItem[];
  shippingDetails?: readonly KeyValueEntry[] | undefined;
  discount?: number | undefined;
  shippingCost?: number | undefined;
  onDownloadInvoice?: (() => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Order detail pattern: state timeline, itemized Toman breakdown, shipping metadata, and invoice download. */
export function OrderDetail({
  orderNumber,
  status,
  createdAt,
  timeline,
  items,
  shippingDetails,
  discount = 0,
  shippingCost = 0,
  onDownloadInvoice,
  className,
  ref,
}: OrderDetailProps) {
  const { commerce } = usePatternMessages();
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const total = Math.max(0, subtotal - discount + shippingCost);

  return (
    <section
      ref={ref}
      data-nds="OrderDetail"
      aria-label={`${commerce.orderNumberLabel} ${orderNumber}`}
      className={className}
    >
      <Stack gap="5">
        <Surface>
          <Section>
            <div className={styles.invoiceHeader}>
              <Stack gap="2">
                <Inline gap="2">
                  <StatusBadge domain="order" status={status} />
                  <Text size="sm" tone="muted">
                    {formatDate(createdAt)}
                  </Text>
                </Inline>
                <Heading level={2}>
                  {commerce.orderNumberLabel}: <Code>{orderNumber}</Code>
                </Heading>
              </Stack>
              {onDownloadInvoice && (
                <Button variant="secondary" iconStart={iconDownload} onPress={onDownloadInvoice}>
                  {commerce.downloadInvoice}
                </Button>
              )}
            </div>
          </Section>
        </Surface>

        <Surface>
          <Section>
            <Stack gap="3">
              <Heading level={3}>{commerce.orderTimelineHeading}</Heading>
              <Timeline items={timeline} aria-label={commerce.orderTimelineHeading} />
            </Stack>
          </Section>
        </Surface>

        <Surface>
          <Section>
            <Stack gap="4">
              <Heading level={3}>{commerce.orderItemsHeading}</Heading>
              <div className={styles.invoiceTableWrap}>
                <table className={styles.invoiceTable}>
                  <thead>
                    <tr>
                      <th scope="col">{commerce.invoiceColumnItem}</th>
                      <th scope="col">{commerce.invoiceColumnQty}</th>
                      <th scope="col">{commerce.invoiceColumnUnitPrice}</th>
                      <th scope="col">{commerce.invoiceColumnLineTotal}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{formatNumber(item.quantity, { maximumFractionDigits: 0 })}</td>
                        <td>{formatPrice(item.unitPrice)}</td>
                        <td>{formatPrice(item.unitPrice * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.invoiceTotals}>
                <div className={styles.summaryRow}>
                  <span>{commerce.subtotalLabel}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className={styles.summaryRow}>
                    <span>{commerce.discountLabel}</span>
                    <span className={styles.summaryDiscount}>−{formatPrice(discount)}</span>
                  </div>
                )}
                <div className={styles.summaryRow}>
                  <span>{commerce.shippingLabel}</span>
                  <span>{shippingCost <= 0 ? commerce.freeShipping : formatPrice(shippingCost)}</span>
                </div>
                <div className={styles.summaryTotal}>
                  <span>{commerce.totalLabel}</span>
                  <Price amount={total} size="md" />
                </div>
              </div>
            </Stack>
          </Section>
        </Surface>

        {shippingDetails && shippingDetails.length > 0 && (
          <Surface>
            <Section>
              <Stack gap="3">
                <Heading level={3}>{commerce.orderShippingHeading}</Heading>
                <KeyValueList items={shippingDetails} />
              </Stack>
            </Section>
          </Surface>
        )}
      </Stack>
    </section>
  );
}

export interface InvoiceProps {
  invoiceNumber: string;
  issuedAt: DateInput;
  productLabel?: string | undefined;
  seller: readonly KeyValueEntry[];
  buyer: readonly KeyValueEntry[];
  items: readonly OrderLineItem[];
  discount?: number | undefined;
  shippingCost?: number | undefined;
  onPrint?: (() => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * A4 printable invoice pattern (`14mm × 10mm` `@page` margins, Jalali issue date, Toman totals,
 * LTR invoice number, and print-hidden action bar).
 */
export function Invoice({
  invoiceNumber,
  issuedAt,
  productLabel,
  seller,
  buyer,
  items,
  discount = 0,
  shippingCost = 0,
  onPrint,
  className,
  ref,
}: InvoiceProps) {
  const { commerce } = usePatternMessages();
  const resolvedProductLabel = productLabel ?? commerce.invoiceTitle;
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const total = Math.max(0, subtotal - discount + shippingCost);

  return (
    <article
      ref={ref}
      data-nds="Invoice"
      aria-label={`${commerce.invoiceTitle} ${invoiceNumber}`}
      className={cx(styles.invoiceSheet, className)}
    >
      <div className={styles.invoiceHeader}>
        <Stack gap="2">
          <LogoSlot size="md" product={resolvedProductLabel} />
          <Heading level={2}>{commerce.invoiceTitle}</Heading>
        </Stack>
        <Stack gap="2">
          <Text size="sm">
            {commerce.invoiceNumberLabel}: <Code>{invoiceNumber}</Code>
          </Text>
          <Text size="sm" tone="muted">
            {commerce.invoiceDateLabel}: {formatDate(issuedAt)}
          </Text>
          {onPrint && (
            <span className={styles.printOnlyHide}>
              <Button size="sm" variant="secondary" iconStart={iconPrint} onPress={onPrint}>
                {commerce.printInvoice}
              </Button>
            </span>
          )}
        </Stack>
      </div>

      <div className={styles.invoiceParties}>
        <Stack gap="2">
          <Heading level={3}>{commerce.invoiceSellerHeading}</Heading>
          <KeyValueList items={seller} density="compact" />
        </Stack>
        <Stack gap="2">
          <Heading level={3}>{commerce.invoiceBuyerHeading}</Heading>
          <KeyValueList items={buyer} density="compact" />
        </Stack>
      </div>

      <div className={styles.invoiceTableWrap}>
        <table className={styles.invoiceTable}>
          <thead>
            <tr>
              <th scope="col">{commerce.invoiceColumnItem}</th>
              <th scope="col">{commerce.invoiceColumnQty}</th>
              <th scope="col">{commerce.invoiceColumnUnitPrice}</th>
              <th scope="col">{commerce.invoiceColumnLineTotal}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{formatNumber(item.quantity, { maximumFractionDigits: 0 })}</td>
                <td>{formatPrice(item.unitPrice)}</td>
                <td>{formatPrice(item.unitPrice * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.invoiceTotals}>
        <div className={styles.summaryRow}>
          <span>{commerce.subtotalLabel}</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className={styles.summaryRow}>
            <span>{commerce.discountLabel}</span>
            <span className={styles.summaryDiscount}>−{formatPrice(discount)}</span>
          </div>
        )}
        <div className={styles.summaryRow}>
          <span>{commerce.shippingLabel}</span>
          <span>{shippingCost <= 0 ? commerce.freeShipping : formatPrice(shippingCost)}</span>
        </div>
        <div className={styles.summaryTotal}>
          <span>{commerce.totalLabel}</span>
          <Price amount={total} size="md" />
        </div>
      </div>
    </article>
  );
}
