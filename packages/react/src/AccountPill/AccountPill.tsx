import { iconUser } from '@negaresh/icons';
import type { ReactNode, Ref } from 'react';
import { Button as RacButton, type ButtonProps as RacButtonProps } from 'react-aria-components';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { Ltr } from '../Ltr/Ltr.tsx';
import styles from './AccountPill.module.css';

export interface AccountPillProps
  extends Pick<
    RacButtonProps,
    | 'onPress'
    | 'isDisabled'
    | 'type'
    | 'autoFocus'
    | 'aria-describedby'
    | 'aria-controls'
    | 'aria-expanded'
    | 'aria-haspopup'
    | 'id'
    | 'slot'
  > {
  /** Visible account identifier on desktop (e.g. masked phone or display name); hidden below 900 px. */
  label: ReactNode;
  /** Required accessible name because `label` is visually hidden on mobile. */
  'aria-label': string;
  /** Wrap `label` in `<Ltr>` (use for masked phones or emails, D-86). Default `false`. */
  ltr?: boolean | undefined;
  /** Custom 32 × 32 px avatar content (defaults to the user icon). */
  avatar?: ReactNode | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLButtonElement> | undefined;
}

/**
 * Compact account trigger button for `<TopBar>` (typically paired with `<MenuTrigger>` and
 * `<Menu>`). Shows label + avatar pill on desktop and collapses to an avatar button on mobile
 * while preserving a ≥ 44 × 44 px hit target and accessible name.
 */
export function AccountPill({
  label,
  ltr = false,
  avatar,
  className,
  ref,
  ...rest
}: AccountPillProps) {
  return (
    <RacButton {...rest} ref={ref} data-nds="AccountPill" className={cx(styles.pill, className)}>
      {ltr ? (
        <Ltr className={cx(styles.label)}>{label}</Ltr>
      ) : (
        <span className={cx(styles.label)}>{label}</span>
      )}
      <span className={cx(styles.avatar)} aria-hidden="true">
        {avatar ?? <Icon icon={iconUser} size="sm" />}
      </span>
    </RacButton>
  );
}
