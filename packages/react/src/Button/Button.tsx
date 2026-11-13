import type { IconDefinition } from '@negaresh/icons';
import type { ReactNode, Ref } from 'react';
import {
  Button as RacButton,
  type ButtonProps as RacButtonProps,
  Link as RacLink,
  type LinkProps as RacLinkProps,
  ProgressBar,
} from 'react-aria-components';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonLookProps {
  /** `primary` (one per surface), `secondary`, `ghost`, `danger` (destructive). Default `secondary`. */
  variant?: ButtonVariant | undefined;
  /** Height 40 / 48 / 56 px. The touch target stays ≥ 44 px. Default `md`. */
  size?: ButtonSize | undefined;
  /** Icon before the label (inline start). */
  iconStart?: IconDefinition | undefined;
  /** Icon after the label (inline end); directional icons flip in RTL. */
  iconEnd?: IconDefinition | undefined;
  /** Stretch to the container width (mobile action bars). */
  fullWidth?: boolean | undefined;
  className?: string | undefined;
}

export interface ButtonProps
  extends ButtonLookProps,
    Pick<
      RacButtonProps,
      | 'onPress'
      | 'isDisabled'
      | 'isPending'
      | 'type'
      | 'form'
      | 'autoFocus'
      | 'aria-label'
      | 'aria-describedby'
      | 'aria-controls'
      | 'aria-expanded'
      | 'aria-haspopup'
      | 'id'
      | 'slot'
    > {
  /** The label: starts with a verb and says the result («ساخت کد فعال‌سازی»). */
  children: ReactNode;
  ref?: Ref<HTMLButtonElement> | undefined;
}

function Content({
  iconStart,
  iconEnd,
  children,
  isPending,
}: Pick<ButtonLookProps, 'iconStart' | 'iconEnd'> & {
  children: ReactNode;
  isPending?: boolean | undefined;
}) {
  const m = useNdsMessages();
  return (
    <>
      {iconStart && <Icon icon={iconStart} className={cx(styles.icon)} />}
      <span className={cx(styles.label)}>{children}</span>
      {iconEnd && <Icon icon={iconEnd} className={cx(styles.icon)} />}
      {isPending && (
        <ProgressBar isIndeterminate aria-label={m.pending} className={cx(styles.spinner)}>
          <span className={cx(styles.spinnerRing)} aria-hidden="true" />
        </ProgressBar>
      )}
    </>
  );
}

/** Button on React Aria `Button`: press handling, focus ring, pending state announced. */
export function Button({
  variant = 'secondary',
  size = 'md',
  iconStart,
  iconEnd,
  fullWidth,
  className,
  children,
  ref,
  ...rest
}: ButtonProps) {
  return (
    <RacButton
      {...rest}
      ref={ref}
      data-nds="Button"
      data-variant={variant}
      data-size={size}
      data-full-width={fullWidth || undefined}
      className={cx(styles.button, className)}
    >
      <Content iconStart={iconStart} iconEnd={iconEnd} isPending={rest.isPending}>
        {children}
      </Content>
    </RacButton>
  );
}

export interface LinkButtonProps
  extends ButtonLookProps,
    Pick<
      RacLinkProps,
      'href' | 'target' | 'rel' | 'isDisabled' | 'onPress' | 'aria-label' | 'routerOptions'
    > {
  children: ReactNode;
  ref?: Ref<HTMLAnchorElement> | undefined;
}

/** A link that looks like a button: navigation with button weight («فعال‌سازی‌های من»). */
export function LinkButton({
  variant = 'secondary',
  size = 'md',
  iconStart,
  iconEnd,
  fullWidth,
  className,
  children,
  ref,
  ...rest
}: LinkButtonProps) {
  return (
    <RacLink
      {...rest}
      ref={ref}
      data-nds="LinkButton"
      data-variant={variant}
      data-size={size}
      data-full-width={fullWidth || undefined}
      className={cx(styles.button, className)}
    >
      <Content iconStart={iconStart} iconEnd={iconEnd}>
        {children}
      </Content>
    </RacLink>
  );
}

export interface IconButtonProps
  extends Pick<
    RacButtonProps,
    | 'onPress'
    | 'isDisabled'
    | 'isPending'
    | 'type'
    | 'aria-describedby'
    | 'aria-expanded'
    | 'aria-haspopup'
    | 'id'
    | 'slot'
  > {
  icon: IconDefinition;
  /** Required accessible name: the button has no visible text. */
  'aria-label': string;
  /** `ghost` (default) or `secondary`. */
  variant?: 'ghost' | 'secondary';
  /** Visual size; the target is always ≥ 44 × 44 px. Default `md`. */
  size?: 'sm' | 'md';
  className?: string | undefined;
  ref?: Ref<HTMLButtonElement> | undefined;
}

/** Icon-only button with a required accessible name and a 44 × 44 px target. */
export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  className,
  ref,
  ...rest
}: IconButtonProps) {
  return (
    <RacButton
      {...rest}
      ref={ref}
      data-nds="IconButton"
      data-variant={variant}
      data-size={size}
      data-icon-only
      className={cx(styles.button, className)}
    >
      <Icon icon={icon} size={size === 'sm' ? 'sm' : 'md'} />
    </RacButton>
  );
}
