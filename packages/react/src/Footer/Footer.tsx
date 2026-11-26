import { type ReactNode, type Ref, useId } from 'react';
import { cx } from '../internal/cx.ts';
import { Container } from '../Layout/Layout.tsx';
import { Link } from '../Link/Link.tsx';
import styles from './Footer.module.css';

export interface FooterLinkData {
  id: string;
  label: ReactNode;
  href: string;
  external?: boolean | undefined;
}

export interface FooterGroupData {
  id: string;
  title: ReactNode;
  links: readonly FooterLinkData[];
}

export interface FooterLinkProps {
  href: string;
  external?: boolean | undefined;
  children: ReactNode;
  className?: string | undefined;
}

/** Single navigation link inside `<FooterGroup>` with a ≥ 44 px vertical tap target. */
export function FooterLink({ href, external = false, children, className }: FooterLinkProps) {
  return (
    <li className={cx(styles.linkItem)}>
      <Link href={href} variant="standalone" external={external} className={cx(styles.link, className)}>
        {children}
      </Link>
    </li>
  );
}

export interface FooterGroupProps {
  /** Column heading. */
  title: ReactNode;
  children: ReactNode;
  className?: string | undefined;
}

/** Titled column of links inside `<Footer>`. */
export function FooterGroup({ title, children, className }: FooterGroupProps) {
  const headingId = useId();
  return (
    <div data-nds="FooterGroup" className={cx(styles.group, className)}>
      <h2 id={headingId} className={cx(styles.groupTitle)}>
        {title}
      </h2>
      <ul className={cx(styles.linkList)} aria-labelledby={headingId}>
        {children}
      </ul>
    </div>
  );
}

export interface FooterProps {
  /** Brand element (typically `<LogoSlot>`). */
  brand?: ReactNode | undefined;
  /** Short Persian product or company summary under the brand slot. */
  description?: ReactNode | undefined;
  /** Declarative columns of footer links. */
  groups?: readonly FooterGroupData[] | undefined;
  /** Copyright / legal ownership statement. */
  copyright?: ReactNode | undefined;
  /** Legal / policy links rendered in the bottom row. */
  legalLinks?: readonly FooterLinkData[] | undefined;
  /** Optional trust / certification badges slot at inline-end of the legal row. */
  badges?: ReactNode | undefined;
  /** Container width: `default` (1200 px) or `wide` (1440 px). Default `'default'`. */
  size?: 'default' | 'wide' | undefined;
  /** Background surface tone: `surface` (default) or `sunken`. */
  tone?: 'surface' | 'sunken' | undefined;
  /** Root tag: `footer` (default) or `div` for non-landmark embedded previews. */
  as?: 'footer' | 'div' | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Page footer with brand column, responsive multi-column link groups, and hairline-separated
 * legal row. Zero resting shadow (D-77); logical RTL layout; ≥ 44 px link targets.
 */
export function Footer({
  brand,
  description,
  groups,
  copyright,
  legalLinks,
  badges,
  size = 'default',
  tone = 'surface',
  as = 'footer',
  children,
  className,
  ref,
}: FooterProps) {
  const hasTop = Boolean(brand || description || (groups && groups.length > 0) || children);
  const hasLegal = Boolean(copyright || (legalLinks && legalLinks.length > 0) || badges);

  const inner = (
    <Container size={size} className={cx(styles.inner)}>
      {hasTop && (
        <div className={cx(styles.top)}>
          {(brand || description) && (
            <div className={cx(styles.brandCol)}>
              {brand}
              {description && <p className={cx(styles.description)}>{description}</p>}
            </div>
          )}
          <div className={cx(styles.groups)}>
            {groups?.map((group) => (
              <FooterGroup key={group.id} title={group.title}>
                {group.links.map((link) => (
                  <FooterLink key={link.id} href={link.href} external={link.external}>
                    {link.label}
                  </FooterLink>
                ))}
              </FooterGroup>
            ))}
            {children}
          </div>
        </div>
      )}

      {hasLegal && (
        <div className={cx(styles.legal)}>
          <div className={cx(styles.legalMeta)}>
            {copyright && <p className={cx(styles.copyright)}>{copyright}</p>}
            {legalLinks && legalLinks.length > 0 && (
              <ul className={cx(styles.legalLinks)}>
                {legalLinks.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      variant="standalone"
                      external={link.external}
                      className={cx(styles.legalLink)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {badges && <div className={cx(styles.badges)}>{badges}</div>}
        </div>
      )}
    </Container>
  );

  if (as === 'div') {
    return (
      <div
        ref={ref as Ref<HTMLDivElement> | undefined}
        data-nds="Footer"
        data-tone={tone}
        className={cx(styles.footer, className)}
      >
        {inner}
      </div>
    );
  }

  return (
    <footer
      ref={ref}
      data-nds="Footer"
      data-tone={tone}
      className={cx(styles.footer, className)}
    >
      {inner}
    </footer>
  );
}
