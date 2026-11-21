import type { ReactNode, Ref } from 'react';
import { Link as RacLink, type LinkProps as RacLinkProps } from 'react-aria-components';
import { cx } from '../internal/cx.ts';
import { Container } from '../Layout/Layout.tsx';
import styles from './TopBar.module.css';

/** `data-*` attributes forwarded to the root element (test hooks, regions). */
type DataAttributes = { [key: `data-${string}`]: string | undefined };

export interface TopBarProps extends DataAttributes {
  /** Brand element at inline start (typically `<TopBarBrand><LogoSlot ... /></TopBarBrand>`). */
  brand?: ReactNode | undefined;
  /** Primary navigation landmark (typically `<TopBarNav>`). */
  nav?: ReactNode | undefined;
  /** Actions aligned to inline end (theme toggle, `<AccountPill>`, etc.). */
  actions?: ReactNode | undefined;
  /** Optional mobile menu trigger shown below 900 px. */
  mobileMenu?: ReactNode | undefined;
  /** Inner container width: `default` (1200 px) or `wide` (1440 px). Default `default`. */
  size?: 'default' | 'wide';
  /** Stick to the top of the viewport with translucent blur. Default `true`. */
  sticky?: boolean | undefined;
  /** Root element tag. Default `header`. Use `div` for non-banner embedded previews. */
  as?: 'header' | 'div';
  id?: string | undefined;
  'aria-label'?: string | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Sticky application header: brand slot, primary navigation links, optional mobile menu
 * trigger and inline-end actions. Composes inside a hairline-separated translucent bar
 * with no resting shadow (D-77).
 */
export function TopBar({
  brand,
  nav,
  actions,
  mobileMenu,
  size = 'default',
  sticky = true,
  as = 'header',
  className,
  ref,
  ...rest
}: TopBarProps) {
  const inner = (
    <Container size={size} className={cx(styles.inner)}>
      {mobileMenu && <div className={cx(styles.mobileMenu)}>{mobileMenu}</div>}
      {brand}
      {nav}
      {actions && <div className={cx(styles.actions)}>{actions}</div>}
    </Container>
  );
  const rootProps = {
    ...rest,
    'data-nds': 'TopBar',
    'data-sticky': sticky ? '' : undefined,
    className: cx(styles.topbar, className),
  };
  if (as === 'div') {
    return (
      <div {...rootProps} ref={ref as Ref<HTMLDivElement> | undefined}>
        {inner}
      </div>
    );
  }
  return (
    <header {...rootProps} ref={ref}>
      {inner}
    </header>
  );
}

export interface TopBarBrandProps
  extends Pick<
    RacLinkProps,
    'href' | 'onPress' | 'routerOptions' | 'aria-label' | 'aria-current' | 'id'
  > {
  className?: string | undefined;
  children: ReactNode;
  ref?: Ref<HTMLAnchorElement> | undefined;
}

/** Brand home link inside `<TopBar>`, wrapping `<LogoSlot>` with a visible focus ring. */
export function TopBarBrand({ className, children, ref, ...rest }: TopBarBrandProps) {
  return (
    <RacLink {...rest} ref={ref} data-nds="TopBarBrand" className={cx(styles.brand, className)}>
      {children}
    </RacLink>
  );
}

export interface TopBarNavProps {
  /** Required landmark name (e.g. «بخش‌های رجیستری»). */
  'aria-label': string;
  /** Hide below 900 px (mobile composition, D-90). Default `true`. */
  hideOnMobile?: boolean | undefined;
  className?: string | undefined;
  children: ReactNode;
  ref?: Ref<HTMLElement> | undefined;
}

/** Primary navigation landmark inside `<TopBar>`. */
export function TopBarNav({
  hideOnMobile = true,
  className,
  children,
  ref,
  ...rest
}: TopBarNavProps) {
  return (
    <nav
      {...rest}
      ref={ref}
      data-nds="TopBarNav"
      data-hide-on-mobile={hideOnMobile ? '' : undefined}
      className={cx(styles.nav, className)}
    >
      {children}
    </nav>
  );
}

export interface TopBarNavLinkProps
  extends Pick<
    RacLinkProps,
    | 'href'
    | 'hrefLang'
    | 'rel'
    | 'target'
    | 'isDisabled'
    | 'onPress'
    | 'routerOptions'
    | 'aria-label'
    | 'aria-current'
    | 'id'
  > {
  /** Marks this link as the current page (`aria-current="page"`). */
  isCurrent?: boolean | undefined;
  className?: string | undefined;
  children: ReactNode;
  ref?: Ref<HTMLAnchorElement> | undefined;
}

/** Navigation link inside `<TopBarNav>` built on React Aria `Link` with a 44 px target. */
export function TopBarNavLink({
  isCurrent,
  'aria-current': ariaCurrent,
  className,
  children,
  ref,
  ...rest
}: TopBarNavLinkProps) {
  const current = ariaCurrent ?? (isCurrent ? 'page' : undefined);
  return (
    <RacLink
      {...rest}
      ref={ref}
      {...(current !== undefined ? { 'aria-current': current } : {})}
      data-nds="TopBarNavLink"
      data-current={current ? '' : undefined}
      className={cx(styles.navLink, className)}
    >
      {children}
    </RacLink>
  );
}
