import {
  Heading,
  InlineAlert,
  type InlineAlertTone,
  Link,
  LogoSlot,
  SkipLink,
  Text,
  type ThemeChoice,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from '@negaresh/react';
import type { ReactNode, Ref } from 'react';
import { useAuthMessages } from '../messages/context.tsx';
import styles from './AuthShell.module.css';

export interface AuthBannerMessage {
  tone: InlineAlertTone;
  title?: ReactNode;
  body: ReactNode;
}

export interface AuthFooterLink {
  label: string;
  href: string;
}

export interface AuthShellProps {
  /** Primary screen title (renders `<h1>` standalone, `<h3>` when embedded in docs galleries). */
  title: ReactNode;
  /** Optional calm subtitle directly beneath the title. */
  subtitle?: ReactNode;
  /** Optional eyebrow badge/step indicator rendered above the title. */
  eyebrow?: ReactNode;
  /** Product/realm name next to the Negaresh logo slot. */
  productName?: ReactNode;
  /** Optional custom logo artwork passed to `LogoSlot` (Q-02). */
  logo?: ReactNode;
  /** Optional status/server banner displayed at the top of the card body. */
  banner?: AuthBannerMessage | undefined;
  /** Main form or screen content. */
  children: ReactNode;
  /** Optional sunken footer section inside the card for secondary navigation links. */
  cardFooter?: ReactNode;
  /** Optional footer links (help, privacy, terms). */
  footerLinks?: readonly AuthFooterLink[] | undefined;
  /** Shows the light/dark/system theme switch in the top header. Default `true` when standalone. */
  showThemeToggle?: boolean | undefined;
  /** Controlled theme override callback (optional; defaults to `ThemeProvider.setTheme`). */
  onThemeChange?: ((next: ThemeChoice) => void) | undefined;
  /**
   * Renders in embedded gallery mode (no duplicate `<header>`/`<main>`/`<footer>`/`<h1>`
   * landmarks and no `100dvh` stretch). Use `false` for standalone Keycloak pages.
   */
  embedded?: boolean | undefined;
  /** Explicit heading level override. Defaults to `1` standalone and `3` embedded. */
  headingLevel?: 1 | 2 | 3 | 4 | undefined;
  /** Root class name. */
  className?: string | undefined;
  /** Root ref. */
  ref?: Ref<HTMLDivElement> | undefined;
}

function ShellThemeToggle({
  onThemeChange,
}: {
  onThemeChange?: ((next: ThemeChoice) => void) | undefined;
}) {
  const m = useAuthMessages();
  const { theme, setTheme } = useTheme();
  return (
    <div className={styles.themeSwitch}>
      <ToggleButtonGroup
        aria-label={m.shell.themeLegend}
        selectedKeys={[theme]}
        disallowEmptySelection
        onSelectionChange={(keys) => {
          const [next] = [...keys];
          if (next === 'light' || next === 'dark' || next === 'system') {
            setTheme(next);
            onThemeChange?.(next);
          }
        }}
      >
        <ToggleButton id="light">{m.shell.themeLight}</ToggleButton>
        <ToggleButton id="dark">{m.shell.themeDark}</ToggleButton>
        <ToggleButton id="system">{m.shell.themeSystem}</ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}

/**
 * Shared Negaresh Keycloak login shell following the Focus page template
 * (`docs/foundations/layout.md`): calm warm neutral canvas, hairline-separated surface
 * (zero resting shadows per D-77), RTL Persian chrome, and mobile-first composition.
 */
export function AuthShell({
  title,
  subtitle,
  eyebrow,
  productName,
  logo,
  banner,
  children,
  cardFooter,
  footerLinks,
  showThemeToggle,
  onThemeChange,
  embedded = false,
  headingLevel,
  className,
  ref,
}: AuthShellProps) {
  const m = useAuthMessages();
  const resolvedHeadingLevel = headingLevel ?? (embedded ? 3 : 1);
  const resolvedShowThemeToggle = showThemeToggle ?? !embedded;
  const links: readonly AuthFooterLink[] = footerLinks ?? [
    { label: m.shell.footerHelp, href: '#auth-help' },
    { label: m.shell.footerPrivacy, href: '#auth-privacy' },
    { label: m.shell.footerTerms, href: '#auth-terms' },
  ];

  const HeaderTag = embedded ? 'div' : 'header';
  const MainTag = embedded ? 'div' : 'main';
  const FooterTag = embedded ? 'div' : 'footer';

  return (
    <div
      ref={ref}
      dir="rtl"
      data-nds="AuthShell"
      data-embedded={embedded ? 'true' : 'false'}
      className={className ? `${styles.shell} ${className}` : styles.shell}
    >
      {!embedded && <SkipLink target="auth-main" />}

      <HeaderTag className={styles.header}>
        <LogoSlot
          logo={logo}
          name={m.shell.brandProduct}
          product={productName}
          size="md"
        />
        {resolvedShowThemeToggle && <ShellThemeToggle onThemeChange={onThemeChange} />}
      </HeaderTag>

      <MainTag
        id={embedded ? undefined : 'auth-main'}
        tabIndex={embedded ? undefined : -1}
        className={styles.main}
      >
        <div className={styles.cardWrap}>
          <div className={styles.card}>
            <div className={styles.cardHead}>
              {eyebrow && (
                <Text size="sm" tone="subtle">
                  {eyebrow}
                </Text>
              )}
              <Heading level={resolvedHeadingLevel} size="xl">
                {title}
              </Heading>
              {subtitle && (
                <Text as="p" size="md" tone="muted" leading="text">
                  {subtitle}
                </Text>
              )}
            </div>

            <div className={styles.cardBody}>
              {banner && (
                <InlineAlert tone={banner.tone} title={banner.title}>
                  {banner.body}
                </InlineAlert>
              )}
              {children}
            </div>

            {cardFooter && <div className={styles.cardFooter}>{cardFooter}</div>}
          </div>
        </div>
      </MainTag>

      <FooterTag className={styles.footer}>
        <Text size="sm" tone="subtle">
          {m.shell.footerCopyright}
        </Text>
        <div className={styles.footerLinks}>
          {links.map((item) => (
            <Link key={item.label} href={item.href} variant="standalone" className={styles.footerLink}>
              {item.label}
            </Link>
          ))}
        </div>
      </FooterTag>
    </div>
  );
}
