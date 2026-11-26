import type { ReactNode, Ref } from 'react';
import { Link as RacLink, type LinkProps as RacLinkProps } from 'react-aria-components';
import { cx } from '../internal/cx.ts';
import styles from './Card.module.css';

export type CardVariant = 'default' | 'sunken' | 'plain';
export type CardOrientation = 'vertical' | 'horizontal';

export interface CardProps
  extends Pick<
    RacLinkProps,
    'href' | 'hrefLang' | 'rel' | 'target' | 'isDisabled' | 'onPress' | 'routerOptions'
  > {
  /** Surface treatment: `default` (surface + hairline, no shadow), `sunken`, or `plain`. */
  variant?: CardVariant | undefined;
  /** `vertical` (default) or `horizontal` (collapses to vertical below 600 px). */
  orientation?: CardOrientation | undefined;
  /** Semantic element when non-interactive (no `href`). Default `'article'`. */
  as?: 'article' | 'div' | 'section' | 'li' | undefined;
  'aria-label'?: string | undefined;
  'aria-labelledby'?: string | undefined;
  children: ReactNode;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Generic D-77 hairline card container with zero resting shadow.
 * Provide `href` for the interactive link-card variant built on React Aria `Link`
 * (do not nest interactive links or buttons inside a link card).
 */
export function Card({
  variant = 'default',
  orientation = 'vertical',
  as: As = 'article',
  href,
  hrefLang,
  rel,
  target,
  isDisabled,
  onPress,
  routerOptions,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  children,
  className,
  ref,
}: CardProps) {
  const isInteractive = href !== undefined;
  const shared = {
    'data-nds': 'Card',
    'data-variant': variant,
    'data-orientation': orientation,
    'data-interactive': isInteractive ? 'true' : undefined,
    ...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {}),
    ...(ariaLabelledby !== undefined ? { 'aria-labelledby': ariaLabelledby } : {}),
    className: cx(styles.card, className),
  };

  if (isInteractive) {
    return (
      <RacLink
        {...shared}
        ref={ref as Ref<HTMLAnchorElement> | undefined}
        href={href}
        {...(hrefLang !== undefined ? { hrefLang } : {})}
        {...(rel !== undefined ? { rel } : {})}
        {...(target !== undefined ? { target } : {})}
        {...(isDisabled !== undefined ? { isDisabled } : {})}
        {...(onPress !== undefined ? { onPress } : {})}
        {...(routerOptions !== undefined ? { routerOptions } : {})}
      >
        {children}
      </RacLink>
    );
  }

  return (
    <As {...shared} ref={ref as never}>
      {children}
    </As>
  );
}

export interface CardMediaProps {
  children: ReactNode;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/** Full-bleed media slot for `Card` (pairs cleanly with `<Image>`). */
export function CardMedia({ children, className, ref }: CardMediaProps) {
  return (
    <div ref={ref} data-nds="CardMedia" className={cx(styles.media, className)}>
      {children}
    </div>
  );
}

export interface CardBodyProps {
  children: ReactNode;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/** Primary padded content area inside `Card`. */
export function CardBody({ children, className, ref }: CardBodyProps) {
  return (
    <div ref={ref} data-nds="CardBody" className={cx(styles.body, className)}>
      {children}
    </div>
  );
}

export interface CardFooterProps {
  /** `default` (transparent) or `sunken` (`--nds-bg-sunken`). Default `'default'`. */
  tone?: 'default' | 'sunken' | undefined;
  children: ReactNode;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/** Hairline-separated footer slot for metadata or actions inside `Card`. */
export function CardFooter({ tone = 'default', children, className, ref }: CardFooterProps) {
  return (
    <div ref={ref} data-nds="CardFooter" data-tone={tone} className={cx(styles.footer, className)}>
      {children}
    </div>
  );
}
