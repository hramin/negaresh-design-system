import type { IconDefinition } from '@negaresh/icons';
import { type ReactNode, type Ref, useId } from 'react';
import {
  type Key,
  ToggleButton as RacToggleButton,
  ToggleButtonGroup as RacToggleButtonGroup,
  type ToggleButtonGroupProps as RacToggleButtonGroupProps,
} from 'react-aria-components';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { fieldStyles } from '../internal/field.tsx';
import styles from './SegmentedControl.module.css';

export interface SegmentedControlProps
  extends Pick<
    RacToggleButtonGroupProps,
    'isDisabled' | 'aria-label' | 'aria-labelledby' | 'aria-describedby'
  > {
  /** Optional HTML id on the root element. */
  id?: string | undefined;
  /** Optional visible label placed above the segmented control. */
  label?: ReactNode;
  /** Optional supporting description. */
  description?: ReactNode;
  /** Controlled active option key. */
  value?: Key | undefined;
  /** Initial active option key for uncontrolled usage. */
  defaultValue?: Key | undefined;
  /** Called with the newly selected option key. */
  onChange?: ((value: Key) => void) | undefined;
  /** Segment size; both sizes maintain a ≥ 44 px interactive target. Default `md`. */
  size?: 'sm' | 'md' | undefined;
  /** Stretch segments evenly across the container. */
  fullWidth?: boolean | undefined;
  /** Two to five `SegmentedControlItem` children. */
  children: ReactNode;
  /** Class applied only to the root container. */
  className?: string | undefined;
  /** Ref forwarded to the underlying ToggleButtonGroup container. */
  ref?: Ref<HTMLDivElement> | undefined;
}

/**
 * Single-choice segmented control for 2–5 short options, built on React Aria
 * ToggleButtonGroup with single selection and non-empty selection enforced.
 */
export function SegmentedControl({
  id,
  label,
  description,
  value,
  defaultValue,
  onChange,
  size = 'md',
  fullWidth,
  children,
  className,
  ref,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: SegmentedControlProps) {
  const generatedId = useId();
  const labelId = `${generatedId}-label`;
  const descriptionId = `${generatedId}-description`;
  const labelledBy = ariaLabelledBy ?? (label != null ? labelId : undefined);
  const describedBy =
    [ariaDescribedBy, description != null ? descriptionId : undefined].filter(Boolean).join(' ') ||
    undefined;

  return (
    <div
      id={id}
      data-nds="SegmentedControl"
      data-size={size}
      data-full-width={fullWidth ? 'true' : undefined}
      className={cx(styles.root, className)}
    >
      {label != null && (
        <span id={labelId} className={fieldStyles.label}>
          {label}
        </span>
      )}
      <RacToggleButtonGroup
        {...rest}
        ref={ref}
        selectionMode="single"
        disallowEmptySelection
        {...(value !== undefined ? { selectedKeys: new Set([value]) } : {})}
        {...(defaultValue !== undefined ? { defaultSelectedKeys: new Set([defaultValue]) } : {})}
        {...(onChange
          ? {
              onSelectionChange: (keys: Set<Key>) => {
                const next = keys.values().next().value;
                if (next !== undefined) onChange(next);
              },
            }
          : {})}
        {...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {})}
        {...(labelledBy !== undefined ? { 'aria-labelledby': labelledBy } : {})}
        {...(describedBy !== undefined ? { 'aria-describedby': describedBy } : {})}
        className={cx(styles.track)}
      >
        {children}
      </RacToggleButtonGroup>
      {description != null && (
        <span id={descriptionId} className={fieldStyles.description}>
          {description}
        </span>
      )}
    </div>
  );
}

export interface SegmentedControlItemProps {
  /** Unique key within the SegmentedControl. */
  id: Key;
  /** Optional leading icon. */
  icon?: IconDefinition | undefined;
  /** Disable this option. */
  isDisabled?: boolean | undefined;
  /** Short option label. */
  children: ReactNode;
  /** Class applied to the segment button. */
  className?: string | undefined;
  /** Ref forwarded to the underlying button. */
  ref?: Ref<HTMLButtonElement> | undefined;
}

/** Individual option inside a SegmentedControl. */
export function SegmentedControlItem({
  id,
  icon,
  isDisabled,
  children,
  className,
  ref,
}: SegmentedControlItemProps) {
  return (
    <RacToggleButton
      id={id}
      ref={ref}
      {...(isDisabled !== undefined ? { isDisabled } : {})}
      data-nds="SegmentedControlItem"
      className={cx(styles.item, className)}
    >
      {icon != null && <Icon icon={icon} size="sm" />}
      <span>{children}</span>
    </RacToggleButton>
  );
}
