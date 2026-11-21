import type { ReactNode, Ref } from 'react';
import {
  SwitchButton as RacSwitchButton,
  SwitchField as RacSwitchField,
  type SwitchFieldProps as RacSwitchFieldProps,
  Text,
} from 'react-aria-components';
import { cx } from '../internal/cx.ts';
import styles from './Switch.module.css';

export interface SwitchProps
  extends Pick<
    RacSwitchFieldProps,
    | 'id'
    | 'name'
    | 'value'
    | 'isSelected'
    | 'defaultSelected'
    | 'onChange'
    | 'isDisabled'
    | 'isReadOnly'
    | 'aria-label'
    | 'aria-labelledby'
    | 'aria-describedby'
  > {
  /** Visible switch label. */
  children?: ReactNode;
  /** Optional help text associated with the switch. */
  description?: ReactNode;
  /** Class applied only to the switch root. */
  className?: string | undefined;
  /** Ref forwarded to the underlying native switch input. */
  ref?: Ref<HTMLInputElement> | undefined;
}

/** Accessible binary switch built on React Aria's SwitchField + SwitchButton. */
export function Switch({ children, description, className, ref, ...rest }: SwitchProps) {
  return (
    <RacSwitchField
      {...rest}
      inputRef={ref ?? null}
      data-nds="Switch"
      className={cx(styles.field, className)}
    >
      <RacSwitchButton className={cx(styles.control)}>
        <span className={styles.track} aria-hidden="true">
          <span className={styles.thumb} />
        </span>
        {children != null && <span className={styles.labelText}>{children}</span>}
      </RacSwitchButton>
      {description != null && (
        <Text slot="description" className={cx(styles.description)}>
          {description}
        </Text>
      )}
    </RacSwitchField>
  );
}
