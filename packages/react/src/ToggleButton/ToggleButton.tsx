import type { IconDefinition } from '@negaresh/icons';
import type { ReactNode, Ref } from 'react';
import {
  type Key,
  ToggleButton as RacToggleButton,
  ToggleButtonGroup as RacToggleButtonGroup,
  type ToggleButtonGroupProps as RacToggleButtonGroupProps,
  type ToggleButtonProps as RacToggleButtonProps,
} from 'react-aria-components';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import styles from './ToggleButton.module.css';

export interface ToggleButtonProps
  extends Pick<
    RacToggleButtonProps,
    'isSelected' | 'defaultSelected' | 'onChange' | 'isDisabled' | 'aria-label' | 'aria-describedby'
  > {
  /** Key inside a ToggleButtonGroup. */
  id?: Key;
  iconStart?: IconDefinition | undefined;
  /** Default `md` (48 px); `sm` 40 px visual with a 44 px target. */
  size?: 'sm' | 'md';
  className?: string | undefined;
  children: ReactNode;
  ref?: Ref<HTMLButtonElement> | undefined;
}

/** A button that stays pressed (aria-pressed). Selected state shows tone + border + weight, not colour alone. */
export function ToggleButton({
  iconStart,
  size = 'md',
  className,
  children,
  ref,
  ...rest
}: ToggleButtonProps) {
  return (
    <RacToggleButton
      {...rest}
      ref={ref}
      data-nds="ToggleButton"
      data-size={size}
      className={cx(styles.toggle, className)}
    >
      {iconStart && <Icon icon={iconStart} />}
      <span>{children}</span>
    </RacToggleButton>
  );
}

export interface ToggleButtonGroupProps
  extends Pick<
    RacToggleButtonGroupProps,
    | 'selectionMode'
    | 'selectedKeys'
    | 'defaultSelectedKeys'
    | 'onSelectionChange'
    | 'disallowEmptySelection'
    | 'isDisabled'
    | 'orientation'
    | 'aria-label'
    | 'aria-labelledby'
  > {
  className?: string | undefined;
  children: ReactNode;
  ref?: Ref<HTMLDivElement> | undefined;
}

/** Joined toggle buttons with single (default) or multiple selection; arrow keys move between them. */
export function ToggleButtonGroup({ className, children, ref, ...rest }: ToggleButtonGroupProps) {
  return (
    <RacToggleButtonGroup
      {...rest}
      ref={ref}
      data-nds="ToggleButtonGroup"
      className={cx(styles.group, className)}
    >
      {children}
    </RacToggleButtonGroup>
  );
}
