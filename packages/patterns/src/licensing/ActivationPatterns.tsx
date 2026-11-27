import { iconCart, iconKey, iconSend } from '@negaresh/icons';
import {
  Badge,
  Button,
  CopyButton,
  EmptyState,
  Heading,
  Inline,
  InlineAlert,
  KeyValueList,
  Section,
  SerialField,
  Stack,
  Surface,
  Text,
  UsageMeter,
} from '@negaresh/react';
import { type DateInput, formatDateTime } from '@negaresh/utils';
import { type Ref, useState } from 'react';
import { cx } from '../internal/cx.ts';
import { usePatternMessages } from '../messages/context.tsx';
import styles from './licensing.module.css';

export interface CodeDisplayProps {
  /** Activation code rendered in large LTR monospace Latin digits (D-86). */
  code: string;
  /** Optional custom heading/label. Defaults to `messages.licensing.activationCodeLabel`. */
  label?: string | undefined;
  /** Delivery channels note (e.g. «پیامک و ایمیل»). */
  sentByChannels?: string | undefined;
  /** Shows Registry FR-12 repeat-PC banner stating no slot was consumed. */
  isRepeatPc?: boolean | undefined;
  onCopy?: ((code: string) => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Prominent LTR activation code display with copy action, delivery note, and FR-12 repeat-PC notice. */
export function CodeDisplay({
  code,
  label,
  sentByChannels,
  isRepeatPc = false,
  onCopy,
  className,
  ref,
}: CodeDisplayProps) {
  const { licensing } = usePatternMessages();
  const heading = label ?? licensing.activationCodeLabel;

  return (
    <Surface ref={ref} data-nds="CodeDisplay" className={className}>
      <Section>
        <Stack gap="4">
          <Text size="sm" weight="semibold" tone="muted">
            {heading}
          </Text>
          <div className={styles.codeBox}>
            <code className={styles.codeLarge} dir="ltr">
              {code}
            </code>
            <CopyButton
              value={code}
              variant="primary"
              aria-label={licensing.copyActivationCode}
              {...(onCopy !== undefined ? { onCopy } : {})}
            >
              {licensing.copyActivationCode}
            </CopyButton>
          </div>
          {isRepeatPc && (
            <InlineAlert tone="info" title={licensing.repeatPcTitle}>
              {licensing.repeatPcDescription}
            </InlineAlert>
          )}
          {sentByChannels && (
            <Text size="sm" tone="muted">
              {licensing.sentByChannels(sentByChannels)}
            </Text>
          )}
        </Stack>
      </Section>
    </Surface>
  );
}

export type ActivationErrorKind = 'unknown_serial' | 'wrong_product' | 'revoked' | 'limit_reached';

export interface ActivationFlowProps {
  /** Product title being activated. */
  productName: string;
  /** Prefilled LTR system code coming from the desktop app (`/?s=&code=`). */
  systemCode: string;
  /** Controlled or initial serial number. */
  serialValue?: string | undefined;
  defaultSerialValue?: string | undefined;
  onSerialChange?: ((value: string) => void) | undefined;
  /** Active error state per Registry FR-11. */
  errorKind?: ActivationErrorKind | undefined;
  /** Issued activation code on success. */
  activationCode?: string | undefined;
  /** Whether the returned code is from a repeat PC (FR-12, zero slot consumed). */
  isRepeatPc?: boolean | undefined;
  /** Delivery channels note shown with `CodeDisplay`. */
  sentByChannels?: string | undefined;
  /** Current quota usage & FR-23 source note. */
  usage?: { used: number; limit: number; sourceNote?: string | undefined } | undefined;
  isSubmitting?: boolean | undefined;
  onSubmit?: ((serial: string) => void) | undefined;
  onBuyExtraSlot?: (() => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Software Registry activation pattern: prefilled LTR system code, `SerialField`,
 * FR-11 specific error alerts, `UsageMeter`, `CodeDisplay` with repeat-PC note (FR-12),
 * and limit-reached → buy +1 CTA.
 */
export function ActivationFlow({
  productName,
  systemCode,
  serialValue,
  defaultSerialValue = '',
  onSerialChange,
  errorKind,
  activationCode,
  isRepeatPc = false,
  sentByChannels,
  usage,
  isSubmitting = false,
  onSubmit,
  onBuyExtraSlot,
  className,
  ref,
}: ActivationFlowProps) {
  const { licensing } = usePatternMessages();
  const [internalSerial, setInternalSerial] = useState(defaultSerialValue);
  const currentSerial = serialValue ?? internalSerial;

  const handleSerialChange = (next: string) => {
    if (serialValue === undefined) setInternalSerial(next);
    onSerialChange?.(next);
  };

  const activeError = errorKind ? licensing.errors[errorKind] : undefined;

  return (
    <section
      ref={ref}
      data-nds="ActivationFlow"
      aria-label={productName}
      className={cx(styles.activationGrid, className)}
    >
      <Surface>
        <Section>
          <Stack gap="4">
            <Heading level={2}>{productName}</Heading>
            <KeyValueList
              items={[
                {
                  id: 'system-code',
                  label: licensing.systemCodeLabel,
                  value: systemCode,
                  code: true,
                  copyValue: systemCode,
                },
              ]}
            />
            {usage && (
              <UsageMeter
                label={licensing.usageMeterLabel}
                used={usage.used}
                limit={usage.limit}
                {...(usage.sourceNote !== undefined ? { sourceNote: usage.sourceNote } : {})}
                showFullIndicator
              />
            )}

            <SerialField
              label={licensing.serialFieldLabel}
              value={currentSerial}
              onChange={handleSerialChange}
              isInvalid={Boolean(activeError)}
              {...(activeError ? { errorMessage: activeError.title } : {})}
            />

            {activeError && (
              <InlineAlert
                tone={errorKind === 'limit_reached' ? 'warning' : 'danger'}
                title={activeError.title}
                actions={
                  errorKind === 'limit_reached' && onBuyExtraSlot ? (
                    <Button
                      size="sm"
                      variant="primary"
                      iconStart={iconCart}
                      onPress={onBuyExtraSlot}
                    >
                      {licensing.buyExtraSlot}
                    </Button>
                  ) : undefined
                }
              >
                {activeError.description}
              </InlineAlert>
            )}

            <Inline gap="3">
              <Button
                variant="primary"
                isPending={isSubmitting}
                isDisabled={currentSerial.trim().length === 0}
                onPress={() => onSubmit?.(currentSerial)}
              >
                {licensing.activateSubmit}
              </Button>
            </Inline>
          </Stack>
        </Section>
      </Surface>

      {activationCode && (
        <CodeDisplay
          code={activationCode}
          isRepeatPc={isRepeatPc}
          {...(sentByChannels !== undefined ? { sentByChannels } : {})}
        />
      )}
    </section>
  );
}

export interface ActivationRecord {
  id: string;
  serial: string;
  productName: string;
  systemCode: string;
  activationCode: string;
  activatedAt: DateInput;
  /** Remaining resend rate-limit seconds (`> 0` disables resend with countdown label). */
  resendCooldownSeconds?: number | undefined;
}

export interface MyActivationsProps {
  records: readonly ActivationRecord[];
  onResendCode?: ((id: string) => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Customer activation history list per serial with LTR codes, Jalali dates, copy, and rate-limited resend. */
export function MyActivations({ records, onResendCode, className, ref }: MyActivationsProps) {
  const { licensing } = usePatternMessages();

  return (
    <section
      ref={ref}
      data-nds="MyActivations"
      aria-label={licensing.myActivationsTitle}
      className={className}
    >
      <Stack gap="4">
        <Heading level={2}>{licensing.myActivationsTitle}</Heading>
        {records.length === 0 ? (
          <EmptyState
            icon={iconKey}
            title={licensing.myActivationsEmptyTitle}
            description={licensing.myActivationsEmptyDescription}
          />
        ) : (
          <Stack gap="3">
            {records.map((rec) => {
              const cooldown = rec.resendCooldownSeconds ?? 0;
              return (
                <div key={rec.id} className={styles.activationCard}>
                  <div className={styles.cardHeader}>
                    <Inline gap="2">
                      <Heading level={3}>{rec.productName}</Heading>
                      <Badge tone="neutral" size="sm">
                        <span dir="ltr">{rec.serial}</span>
                      </Badge>
                    </Inline>
                    {onResendCode && (
                      <Button
                        size="sm"
                        variant="secondary"
                        iconStart={iconSend}
                        isDisabled={cooldown > 0}
                        onPress={() => onResendCode(rec.id)}
                      >
                        {cooldown > 0 ? licensing.resendCooldown(cooldown) : licensing.resendCode}
                      </Button>
                    )}
                  </div>
                  <KeyValueList
                    density="compact"
                    items={[
                      {
                        id: `${rec.id}-sys`,
                        label: licensing.systemCodeLabel,
                        value: rec.systemCode,
                        code: true,
                        copyValue: rec.systemCode,
                      },
                      {
                        id: `${rec.id}-act`,
                        label: licensing.activationCodeLabel,
                        value: rec.activationCode,
                        code: true,
                        copyValue: rec.activationCode,
                      },
                      {
                        id: `${rec.id}-date`,
                        label: licensing.activatedAtLabel,
                        value: formatDateTime(rec.activatedAt),
                      },
                    ]}
                  />
                </div>
              );
            })}
          </Stack>
        )}
      </Stack>
    </section>
  );
}
