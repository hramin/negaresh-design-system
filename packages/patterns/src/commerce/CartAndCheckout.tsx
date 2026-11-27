import {
  iconCard,
  iconCart,
  iconClose,
  iconError,
  iconMinus,
  iconPlus,
  iconRefresh,
  iconSuccess,
  iconTrash,
  iconWarning,
} from '@negaresh/icons';
import {
  Badge,
  Button,
  ChoiceCard,
  Code,
  CopyButton,
  EmptyState,
  Heading,
  Icon,
  IconButton,
  Image,
  Inline,
  InlineAlert,
  KeyValueList,
  LinkButton,
  PhoneField,
  RadioGroup,
  Section,
  Stack,
  Stepper,
  type StepperStepData,
  Surface,
  Text,
  TextField,
} from '@negaresh/react';
import { formatNumber, formatPrice } from '@negaresh/utils';
import { type ReactNode, type Ref, useState } from 'react';
import { cx } from '../internal/cx.ts';
import { usePatternMessages } from '../messages/context.tsx';
import styles from './commerce.module.css';
import { Price } from './Price.tsx';

export interface CartLineItem {
  id: string;
  title: string;
  edition?: string | undefined;
  imageSrc?: string | undefined;
  imageAlt?: string | undefined;
  unitPrice: number;
  quantity: number;
  maxQuantity?: number | undefined;
}

export interface OrderSummaryProps {
  subtotal: number;
  discount?: number | undefined;
  shipping?: number | undefined;
  couponCode?: string | undefined;
  onApplyCoupon?: ((code: string) => void) | undefined;
  onRemoveCoupon?: (() => void) | undefined;
  couponError?: string | undefined;
  action?: ReactNode | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Toman order summary card with optional coupon field and primary checkout slot. */
export function OrderSummary({
  subtotal,
  discount = 0,
  shipping = 0,
  couponCode,
  onApplyCoupon,
  onRemoveCoupon,
  couponError,
  action,
  className,
  ref,
}: OrderSummaryProps) {
  const { commerce } = usePatternMessages();
  const [draftCoupon, setDraftCoupon] = useState(couponCode ?? '');
  const total = Math.max(0, subtotal - discount + shipping);

  return (
    <Surface ref={ref} data-nds="OrderSummary" className={className}>
      <Section>
        <Stack gap="4">
          <Heading level={3}>{commerce.orderSummaryTitle}</Heading>

          {onApplyCoupon && (
            <div className={styles.couponRow}>
              <div className={styles.couponField}>
                <TextField
                  label={commerce.couponLabel}
                  placeholder={commerce.couponPlaceholder}
                  value={draftCoupon}
                  onChange={setDraftCoupon}
                  isInvalid={Boolean(couponError)}
                  {...(couponError !== undefined ? { errorMessage: couponError } : {})}
                />
              </div>
              {couponCode && onRemoveCoupon ? (
                <Button variant="secondary" iconStart={iconClose} onPress={onRemoveCoupon}>
                  {commerce.removeCoupon}
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  isDisabled={draftCoupon.trim().length === 0}
                  onPress={() => onApplyCoupon(draftCoupon.trim())}
                >
                  {commerce.applyCoupon}
                </Button>
              )}
            </div>
          )}

          <Stack gap="2">
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
              <span>{shipping <= 0 ? commerce.freeShipping : formatPrice(shipping)}</span>
            </div>
            <div className={styles.summaryTotal}>
              <span>{commerce.totalLabel}</span>
              <Price amount={total} size="md" />
            </div>
          </Stack>

          {action}
        </Stack>
      </Section>
    </Surface>
  );
}

export interface CartProps {
  items: readonly CartLineItem[];
  discount?: number | undefined;
  shipping?: number | undefined;
  couponCode?: string | undefined;
  couponError?: string | undefined;
  onQuantityChange?: ((id: string, nextQuantity: number) => void) | undefined;
  onRemoveItem?: ((id: string) => void) | undefined;
  onApplyCoupon?: ((code: string) => void) | undefined;
  onRemoveCoupon?: (() => void) | undefined;
  onProceedToCheckout?: (() => void) | undefined;
  /** Optional unique accessible name when multiple carts appear on a page. */
  'aria-label'?: string | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Shopping cart pattern with accessible ≥ 44×44 px quantity steppers, coupon code, and Toman summary. */
export function Cart({
  items,
  discount = 0,
  shipping = 0,
  couponCode,
  couponError,
  onQuantityChange,
  onRemoveItem,
  onApplyCoupon,
  onRemoveCoupon,
  onProceedToCheckout,
  'aria-label': ariaLabel,
  className,
  ref,
}: CartProps) {
  const { commerce } = usePatternMessages();
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <section ref={ref} data-nds="Cart" aria-label={ariaLabel ?? commerce.cartTitle} className={className}>
      <Stack gap="4">
        <Heading level={2}>{commerce.cartTitle}</Heading>
        {items.length === 0 ? (
          <EmptyState
            icon={iconCart}
            title={commerce.cartEmptyTitle}
            description={commerce.cartEmptyDescription}
          />
        ) : (
          <div className={styles.splitLayout}>
            <ul className={styles.cartList}>
              {items.map((item) => (
                <li key={item.id} className={styles.cartLine}>
                  <div className={styles.cartLineMedia}>
                    {item.imageSrc && (
                      <Image src={item.imageSrc} alt={item.imageAlt ?? item.title} ratio="1/1" />
                    )}
                  </div>
                  <Stack gap="1">
                    <Text weight="semibold">{item.title}</Text>
                    {item.edition && (
                      <Text size="sm" tone="muted">
                        {item.edition}
                      </Text>
                    )}
                    <Price amount={item.unitPrice * item.quantity} size="sm" />
                  </Stack>
                  <div className={styles.cartLineControls}>
                    {onQuantityChange && (
                      <div className={styles.qtyStepper}>
                        <IconButton
                          variant="ghost"
                          icon={iconMinus}
                          aria-label={commerce.decreaseQty(item.title)}
                          isDisabled={item.quantity <= 1}
                          onPress={() => onQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                        />
                        <span className={styles.qtyValue}>
                          {formatNumber(item.quantity, { maximumFractionDigits: 0 })}
                        </span>
                        <IconButton
                          variant="ghost"
                          icon={iconPlus}
                          aria-label={commerce.increaseQty(item.title)}
                          isDisabled={
                            item.maxQuantity !== undefined && item.quantity >= item.maxQuantity
                          }
                          onPress={() => onQuantityChange(item.id, item.quantity + 1)}
                        />
                      </div>
                    )}
                    {onRemoveItem && (
                      <IconButton
                        variant="ghost"
                        icon={iconTrash}
                        aria-label={commerce.removeLine(item.title)}
                        onPress={() => onRemoveItem(item.id)}
                      />
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <OrderSummary
              subtotal={subtotal}
              discount={discount}
              shipping={shipping}
              {...(couponCode !== undefined ? { couponCode } : {})}
              {...(couponError !== undefined ? { couponError } : {})}
              {...(onApplyCoupon !== undefined ? { onApplyCoupon } : {})}
              {...(onRemoveCoupon !== undefined ? { onRemoveCoupon } : {})}
              action={
                onProceedToCheckout ? (
                  <Button variant="primary" fullWidth onPress={onProceedToCheckout}>
                    {commerce.proceedToCheckout}
                  </Button>
                ) : undefined
              }
            />
          </div>
        )}
      </Stack>
    </section>
  );
}

export interface PaymentGatewayOption {
  id: string;
  name: string;
  description?: string | undefined;
  badge?: string | undefined;
  isDisabled?: boolean | undefined;
}

export interface GatewayPickerProps {
  /** Enabled payment gateways in admin-configured order. */
  gateways: readonly PaymentGatewayOption[];
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((gatewayId: string) => void) | undefined;
  label?: ReactNode | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/** Payment gateway selector rendering `ChoiceCard` radios in exact admin order. */
export function GatewayPicker({
  gateways,
  value,
  defaultValue,
  onChange,
  label,
  className,
  ref,
}: GatewayPickerProps) {
  const { commerce } = usePatternMessages();
  return (
    <RadioGroup
      ref={ref}
      data-nds="GatewayPicker"
      label={label ?? commerce.gatewayPickerLegend}
      {...(value !== undefined ? { value } : {})}
      {...(defaultValue !== undefined ? { defaultValue } : {})}
      {...(onChange !== undefined ? { onChange } : {})}
      className={className}
    >
      {gateways.map((gw) => (
        <ChoiceCard
          key={gw.id}
          value={gw.id}
          title={gw.name}
          icon={iconCard}
          {...(gw.description !== undefined ? { description: gw.description } : {})}
          {...(gw.badge !== undefined
            ? { badge: <Badge tone="info" size="sm">{gw.badge}</Badge> }
            : {})}
          {...(gw.isDisabled !== undefined ? { isDisabled: gw.isDisabled } : {})}
        />
      ))}
    </RadioGroup>
  );
}

export interface ShippingMethodOption {
  id: string;
  title: string;
  description?: string | undefined;
  price: number;
}

export interface CheckoutAddress {
  recipient: string;
  phone: string;
  province: string;
  city: string;
  postalCode: string;
  street: string;
}

export interface CheckoutProps {
  items: readonly CartLineItem[];
  gateways: readonly PaymentGatewayOption[];
  shippingMethods?: readonly ShippingMethodOption[] | undefined;
  /** Skip address and shipping steps when order contains digital products/licenses only. */
  isDigitalOnly?: boolean | undefined;
  /** Show an initial sign-in step before address/payment. */
  requiresSignIn?: boolean | undefined;
  /** Custom sign-in step UI (defaults to phone prompt). */
  signInSlot?: ReactNode | undefined;
  discount?: number | undefined;
  defaultStep?: number | undefined;
  onPay?: ((payload: { gatewayId: string; shippingId?: string | undefined; address?: CheckoutAddress | undefined }) => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Multi-step checkout pattern: optional sign-in → address (physical only) → shipping →
 * `GatewayPicker` → review & pay, accompanied by `OrderSummary`.
 */
export function Checkout({
  items,
  gateways,
  shippingMethods = [],
  isDigitalOnly = false,
  requiresSignIn = false,
  signInSlot,
  discount = 0,
  defaultStep = 1,
  onPay,
  className,
  ref,
}: CheckoutProps) {
  const { commerce } = usePatternMessages();

  type StepKind = 'signin' | 'address' | 'shipping' | 'payment';
  const stepKinds: StepKind[] = [
    ...(requiresSignIn ? (['signin'] as const) : []),
    ...(!isDigitalOnly ? (['address', 'shipping'] as const) : []),
    'payment',
  ];

  const [stepIndex, setStepIndex] = useState(
    Math.min(Math.max(1, defaultStep), stepKinds.length),
  );
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState<CheckoutAddress>({
    recipient: '',
    phone: '',
    province: '',
    city: '',
    postalCode: '',
    street: '',
  });
  const [shippingId, setShippingId] = useState(shippingMethods[0]?.id ?? '');
  const [gatewayId, setGatewayId] = useState(gateways[0]?.id ?? '');

  const currentKind = stepKinds[stepIndex - 1] ?? 'payment';
  const selectedShipping = shippingMethods.find((s) => s.id === shippingId);
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shippingCost = isDigitalOnly ? 0 : (selectedShipping?.price ?? 0);

  const stepLabels: Record<StepKind, string> = {
    signin: commerce.checkoutStepSignIn,
    address: commerce.checkoutStepAddress,
    shipping: commerce.checkoutStepShipping,
    payment: commerce.checkoutStepPayment,
  };

  const steps: StepperStepData[] = stepKinds.map((kind, i) => ({
    id: kind,
    title: stepLabels[kind],
    onPress: i + 1 < stepIndex ? () => setStepIndex(i + 1) : undefined,
  }));

  const isFirst = stepIndex <= 1;
  const isLast = stepIndex >= stepKinds.length;

  return (
    <section
      ref={ref}
      data-nds="Checkout"
      aria-label={commerce.checkoutStepsLabel}
      className={className}
    >
      <Stack gap="6">
        <Stepper
          orientation="horizontal"
          steps={steps}
          currentStep={stepIndex}
          asNav
          aria-label={commerce.checkoutStepsLabel}
        />

        <div className={styles.splitLayout}>
          <Surface>
            <Section>
              <Stack gap="5">
                {currentKind === 'signin' && (
                  <Stack gap="4">
                    <Heading level={3}>{commerce.signInPromptTitle}</Heading>
                    <Text as="p" tone="muted">
                      {commerce.signInPromptDescription}
                    </Text>
                    {signInSlot ?? (
                      <PhoneField
                        label={commerce.addressPhoneLabel}
                        value={phone}
                        onChange={setPhone}
                      />
                    )}
                  </Stack>
                )}

                {currentKind === 'address' && (
                  <Stack gap="4">
                    <Heading level={3}>{commerce.checkoutStepAddress}</Heading>
                    <div className={styles.formGrid}>
                      <TextField
                        label={commerce.addressRecipientLabel}
                        value={address.recipient}
                        onChange={(v) => setAddress((a) => ({ ...a, recipient: v }))}
                      />
                      <PhoneField
                        label={commerce.addressPhoneLabel}
                        value={address.phone}
                        onChange={(v) => setAddress((a) => ({ ...a, phone: v }))}
                      />
                      <TextField
                        label={commerce.addressProvinceLabel}
                        value={address.province}
                        onChange={(v) => setAddress((a) => ({ ...a, province: v }))}
                      />
                      <TextField
                        label={commerce.addressCityLabel}
                        value={address.city}
                        onChange={(v) => setAddress((a) => ({ ...a, city: v }))}
                      />
                      <TextField
                        label={commerce.addressPostalCodeLabel}
                        value={address.postalCode}
                        onChange={(v) => setAddress((a) => ({ ...a, postalCode: v }))}
                      />
                      <div className={styles.formSpanFull}>
                        <TextField
                          label={commerce.addressStreetLabel}
                          value={address.street}
                          onChange={(v) => setAddress((a) => ({ ...a, street: v }))}
                        />
                      </div>
                    </div>
                  </Stack>
                )}

                {currentKind === 'shipping' && (
                  <RadioGroup
                    label={commerce.shippingMethodLegend}
                    value={shippingId}
                    onChange={setShippingId}
                  >
                    {shippingMethods.map((method) => (
                      <ChoiceCard
                        key={method.id}
                        value={method.id}
                        title={method.title}
                        {...(method.description !== undefined
                          ? { description: method.description }
                          : {})}
                        price={method.price}
                      />
                    ))}
                  </RadioGroup>
                )}

                {currentKind === 'payment' && (
                  <GatewayPicker
                    gateways={gateways}
                    value={gatewayId}
                    onChange={setGatewayId}
                  />
                )}

                <div className={styles.stepActions}>
                  <div>
                    {!isFirst && (
                      <Button variant="secondary" onPress={() => setStepIndex((i) => i - 1)}>
                        {commerce.previousStep}
                      </Button>
                    )}
                  </div>
                  {isLast ? (
                    <Button
                      variant="primary"
                      iconStart={iconCard}
                      onPress={() =>
                        onPay?.({
                          gatewayId,
                          shippingId: isDigitalOnly ? undefined : shippingId,
                          address: isDigitalOnly ? undefined : address,
                        })
                      }
                    >
                      {commerce.payNow}
                    </Button>
                  ) : (
                    <Button variant="primary" onPress={() => setStepIndex((i) => i + 1)}>
                      {currentKind === 'signin'
                        ? commerce.continueAfterSignIn
                        : commerce.nextStep}
                    </Button>
                  )}
                </div>
              </Stack>
            </Section>
          </Surface>

          <OrderSummary subtotal={subtotal} discount={discount} shipping={shippingCost} />
        </div>
      </Stack>
    </section>
  );
}

export type PaymentResultStatus = 'success' | 'cancelled' | 'failed';

export interface PaymentResultProps {
  status: PaymentResultStatus;
  /** Optional custom description explaining next steps or failure reason. */
  description?: string | undefined;
  /** Bank tracking code (LTR, copyable) for successful payments. */
  trackingCode?: string | undefined;
  /** Order number (LTR, copyable). */
  orderNumber?: string | undefined;
  /** Amount paid in Toman. */
  amount?: number | undefined;
  /** Link to order detail page (success). */
  orderHref?: string | undefined;
  /** Retry payment handler (failed / cancelled). */
  onRetry?: (() => void) | undefined;
  /** Return to cart handler or href. */
  onReturnToCart?: (() => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Payment return page pattern covering `success` (with copyable LTR tracking code),
 * `cancelled`, and `failed` (with retry) — always using status words and icons, never colour alone.
 */
export function PaymentResult({
  status,
  description,
  trackingCode,
  orderNumber,
  amount,
  orderHref,
  onRetry,
  onReturnToCart,
  className,
  ref,
}: PaymentResultProps) {
  const { commerce } = usePatternMessages();
  const titleMap: Record<PaymentResultStatus, string> = {
    success: commerce.paymentResultSuccessTitle,
    cancelled: commerce.paymentResultCancelledTitle,
    failed: commerce.paymentResultFailedTitle,
  };
  const iconMap = {
    success: iconSuccess,
    cancelled: iconWarning,
    failed: iconError,
  };
  const badgeTone = status === 'success' ? 'success' : status === 'cancelled' ? 'warning' : 'danger';

  const kvItems = [
    ...(orderNumber
      ? [
          {
            id: 'order',
            label: commerce.orderNumberLabel,
            value: orderNumber,
            code: true,
            copyValue: orderNumber,
          },
        ]
      : []),
    ...(trackingCode
      ? [
          {
            id: 'tracking',
            label: commerce.trackingCodeLabel,
            value: trackingCode,
            code: true,
            copyValue: trackingCode,
          },
        ]
      : []),
    ...(amount !== undefined
      ? [{ id: 'amount', label: commerce.totalLabel, value: formatPrice(amount) }]
      : []),
  ];

  return (
    <section
      ref={ref}
      data-nds="PaymentResult"
      data-status={status}
      aria-label={titleMap[status]}
      className={cx(styles.paymentCard, className)}
    >
      <div className={styles.paymentHeader}>
        <span className={styles.paymentIcon} data-status={status} aria-hidden="true">
          <Icon icon={iconMap[status]} size="lg" />
        </span>
        <Stack gap="2">
          <Inline gap="2">
            <Badge tone={badgeTone} size="sm">
              {titleMap[status]}
            </Badge>
          </Inline>
          <Heading level={2}>{titleMap[status]}</Heading>
          {description && (
            <Text as="p" tone="muted" leading="text">
              {description}
            </Text>
          )}
        </Stack>
      </div>

      {status === 'failed' && (
        <InlineAlert tone="danger" title={commerce.paymentResultFailedTitle}>
          {description ?? commerce.paymentResultFailedTitle}
        </InlineAlert>
      )}

      {kvItems.length > 0 && <KeyValueList items={kvItems} />}

      {trackingCode && status === 'success' && (
        <Inline gap="2">
          <Code>{trackingCode}</Code>
          <CopyButton value={trackingCode} variant="secondary" />
        </Inline>
      )}

      <Inline gap="3">
        {status === 'success' && orderHref && (
          <LinkButton variant="primary" href={orderHref}>
            {commerce.viewOrder}
          </LinkButton>
        )}
        {status !== 'success' && onRetry && (
          <Button variant="primary" iconStart={iconRefresh} onPress={onRetry}>
            {commerce.retryPayment}
          </Button>
        )}
        {onReturnToCart && (
          <Button variant="secondary" onPress={onReturnToCart}>
            {commerce.returnToCart}
          </Button>
        )}
      </Inline>
    </section>
  );
}
