import { iconExternalLink } from '@negaresh/icons';
import type { ReactNode, Ref } from 'react';
import { Link as RacLink, type LinkProps as RacLinkProps } from 'react-aria-components';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden.tsx';
import styles from './Link.module.css';

export interface LinkProps
  extends Pick<
    RacLinkProps,
    | 'href'
    | 'hrefLang'
    | 'rel'
    | 'download'
    | 'isDisabled'
    | 'onPress'
    | 'routerOptions'
    | 'aria-label'
    | 'aria-current'
    | 'id'
  > {
  /** `inline` inside running text (underlined), `standalone` on its own line (bolder). Default `inline`. */
  variant?: 'inline' | 'standalone';
  /** Opens in a new tab: adds an icon and a visually hidden note, sets `rel="noopener"`. */
  external?: boolean | undefined;
  className?: string | undefined;
  children: ReactNode;
  ref?: Ref<HTMLAnchorElement> | undefined;
}

/** Link on React Aria `Link`. Text links are always underlined, so they never rely on colour. */
export function Link({
  variant = 'inline',
  external,
  className,
  children,
  rel,
  ref,
  ...rest
}: LinkProps) {
  const m = useNdsMessages();
  return (
    <RacLink
      {...rest}
      ref={ref}
      {...(external ? { target: '_blank', rel: rel ?? 'noopener noreferrer' } : rel ? { rel } : {})}
      data-nds="Link"
      data-variant={variant}
      className={cx(styles.link, className)}
    >
      {children}
      {external && (
        <>
          <Icon icon={iconExternalLink} size="sm" className={cx(styles.externalIcon)} />
          <VisuallyHidden> {m.opensInNewTab}</VisuallyHidden>
        </>
      )}
    </RacLink>
  );
}
