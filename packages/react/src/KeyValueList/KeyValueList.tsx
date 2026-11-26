import type { ReactNode, Ref } from 'react';
import { CopyButton } from '../CopyButton/CopyButton.tsx';
import { cx } from '../internal/cx.ts';
import { Code, Ltr } from '../Ltr/Ltr.tsx';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './KeyValueList.module.css';

export type KeyValueLayout = 'horizontal' | 'stacked';
export type KeyValueDensity = 'comfortable' | 'compact';

export interface KeyValueEntry {
  /** Stable React key (falls back to string label or index). */
  id?: string | undefined;
  /** Term label rendered inside `<dt>`. */
  label: ReactNode;
  /** Value rendered inside `<dd>`. */
  value: ReactNode;
  /** Wrap value in `<Ltr>` for phones, emails, URLs, or Latin identifiers (D-86). */
  ltr?: boolean | undefined;
  /** Render value in `<Code>` monospace LTR island (serials, activation codes, order IDs). */
  code?: boolean | undefined;
  /** Exact normalised string to copy; adds a `<CopyButton>` when set. */
  copyValue?: string | undefined;
  /** Accessible name override for the copy button. */
  copyLabel?: string | undefined;
  /** Called after a successful copy. */
  onCopy?: ((value: string) => void) | undefined;
}

export interface KeyValueItemProps extends Omit<KeyValueEntry, 'id'> {
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/** Single label/value row inside `<KeyValueList>` with optional LTR/code isolation and copy action. */
export function KeyValueItem({
  label,
  value,
  ltr = false,
  code = false,
  copyValue,
  copyLabel,
  onCopy,
  className,
  ref,
}: KeyValueItemProps) {
  const m = useNdsMessages();
  const resolvedCopyLabel =
    copyLabel ?? (typeof label === 'string' ? m.copyValue(label) : m.copy);

  let renderedValue: ReactNode = value;
  if (code && (typeof value === 'string' || typeof value === 'number')) {
    renderedValue = <Code>{value}</Code>;
  } else if (code || ltr) {
    renderedValue = <Ltr>{value}</Ltr>;
  }

  return (
    <div ref={ref} data-nds="KeyValueItem" className={cx(styles.item, className)}>
      <dt className={cx(styles.label)}>{label}</dt>
      <dd className={cx(styles.value)}>
        <span className={cx(styles.valueContent)}>{renderedValue}</span>
        {copyValue !== undefined && (
          <span className={cx(styles.copySlot)}>
            <CopyButton
              value={copyValue}
              variant="ghost"
              size="sm"
              aria-label={resolvedCopyLabel}
              className={cx(styles.copyButton)}
              {...(onCopy !== undefined ? { onCopy } : {})}
            />
          </span>
        )}
      </dd>
    </div>
  );
}

export interface KeyValueListProps {
  /** `horizontal` (two-column on desktop, stacked below 600 px) or always `stacked`. Default `'horizontal'`. */
  layout?: KeyValueLayout | undefined;
  /** Separate rows with a hairline divider. Default `true`. */
  divided?: boolean | undefined;
  /** Row vertical spacing: `comfortable` (default) or `compact`. */
  density?: KeyValueDensity | undefined;
  /** Optional declarative array of rows (alternative to composing `<KeyValueItem>` children). */
  items?: readonly KeyValueEntry[] | undefined;
  'aria-label'?: string | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDListElement> | undefined;
}

/**
 * Semantic `<dl>` metadata list for serial details, order summaries, and expert profiles.
 * Supports LTR/code isolation (D-86) and copyable rows reusing `<CopyButton>`.
 */
export function KeyValueList({
  layout = 'horizontal',
  divided = true,
  density = 'comfortable',
  items,
  'aria-label': ariaLabel,
  children,
  className,
  ref,
}: KeyValueListProps) {
  return (
    <dl
      ref={ref}
      {...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {})}
      data-nds="KeyValueList"
      data-layout={layout}
      data-divided={divided ? 'true' : 'false'}
      data-density={density}
      className={cx(styles.list, className)}
    >
      {items?.map((item, index) => (
        <KeyValueItem
          key={item.id ?? (typeof item.label === 'string' ? item.label : index)}
          label={item.label}
          value={item.value}
          ltr={item.ltr}
          code={item.code}
          copyValue={item.copyValue}
          copyLabel={item.copyLabel}
          onCopy={item.onCopy}
        />
      ))}
      {children}
    </dl>
  );
}
