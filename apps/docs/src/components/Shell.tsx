import { SkipLink, ToggleButton, ToggleButtonGroup, useTheme } from '@negaresh/react';
import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { buildBrandNavGroups } from '../docs/brands/registry.ts';
import {
  ASSESSMENT_CATALOG,
  CHART_CATALOG,
  COMPONENT_CATALOG,
  PATTERN_CATALOG,
} from '../docs/catalog.ts';
import { m } from '../lib/messages.ts';
import { THEME_CHOICES } from '../lib/theme.ts';
import { DocsSearch } from './DocsSearch.tsx';
import styles from './Shell.module.css';

const NAV: {
  title: string;
  items: { to: string; params?: Record<string, string>; label: string }[];
}[] = [
  {
    title: m.navGroups.start,
    items: [
      { to: '/', label: m.nav.overview },
      { to: '/start', label: m.nav.start },
    ],
  },
  {
    title: m.navGroups.foundations,
    items: [
      { to: '/foundations/color', label: m.nav.color },
      { to: '/foundations/typography', label: m.nav.typography },
      { to: '/foundations/layout', label: m.nav.layout },
      { to: '/foundations/motion', label: m.nav.motion },
      { to: '/foundations/icons', label: m.nav.icons },
      { to: '/foundations/localization', label: m.nav.localization },
      { to: '/foundations/accessibility', label: m.nav.accessibility },
      { to: '/foundations/content', label: m.nav.content },
      { to: '/foundations/data-viz', label: m.nav.dataViz },
      { to: '/tokens', label: m.nav.tokens },
    ],
  },
  {
    title: m.navGroups.components,
    items: [
      { to: '/components', label: m.nav.components },
      ...COMPONENT_CATALOG.map((d) => ({
        to: '/components/$slug',
        params: { slug: d.slug },
        label: d.title,
      })),
    ],
  },
  {
    title: m.navGroups.charts,
    items: [
      { to: '/charts', label: m.nav.charts },
      ...CHART_CATALOG.map((d) => ({
        to: '/charts/$slug',
        params: { slug: d.slug },
        label: d.title,
      })),
    ],
  },
  {
    title: m.navGroups.assessment,
    items: [
      { to: '/assessment', label: m.nav.assessment },
      ...ASSESSMENT_CATALOG.map((d) => ({
        to: '/assessment/$slug',
        params: { slug: d.slug },
        label: d.title,
      })),
    ],
  },
  {
    title: m.navGroups.patterns,
    items: [
      { to: '/patterns', label: m.nav.patterns },
      ...PATTERN_CATALOG.map((d) => ({
        to: '/patterns/$slug',
        params: { slug: d.slug },
        label: d.title,
      })),
    ],
  },
  {
    title: m.navGroups.products,
    items: [
      { to: '/products', label: m.nav.products },
      { to: '/products/registry', label: m.nav.productRegistry },
      { to: '/products/negaresh', label: m.nav.productNegaresh },
      { to: '/products/test-platform', label: m.nav.productTestPlatform },
      { to: '/products/ravanma', label: m.nav.productRavanma },
    ],
  },
  {
    title: m.navGroups.brands,
    items: [{ to: '/brands', label: m.nav.brands }],
  },
  ...buildBrandNavGroups(),
  {
    title: m.navGroups.tools,
    items: [
      { to: '/playground', label: m.nav.playground },
      { to: '/search', label: m.nav.search },
      { to: '/guides/tanstack-form-zod', label: m.nav.formAdapter },
      { to: '/changelog', label: m.nav.changelog },
      { to: '/decisions', label: m.nav.decisions },
    ],
  },
  {
    title: m.navGroups.reference,
    items: [
      { to: '/reference/registry-activation', label: m.nav.reference },
      { to: '/reference/admin-serials', label: m.nav.adminSerialsList },
      {
        to: '/reference/admin-serials/$serial',
        params: { serial: 'N25AG-EMV0K' },
        label: m.nav.adminSerialDetail,
      },
      { to: '/reference/assessment-report', label: m.nav.assessmentReport },
      { to: '/reference/keycloak-login', label: m.nav.keycloakLogin },
    ],
  },
];

/** RTL site shell: skip link, top bar with search & theme switch, side navigation, main content. */
export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <SkipLink />
      <header className={styles.topbar} data-docs-topbar>
        <Link to="/" className={styles.brand}>
          {m.siteName}
          <span className={styles.brandLatin} lang="en" dir="ltr">
            {m.siteNameLatin}
          </span>
        </Link>
        <div className={styles.topbarActions}>
          <DocsSearch />
          <ThemeSwitch />
        </div>
      </header>
      <nav className={styles.nav} aria-label={m.navLabel}>
        {NAV.map((group) => (
          <div key={group.title} className={styles.navGroup}>
            <p className={styles.navTitle}>{group.title}</p>
            <ul>
              {group.items.map((item) => (
                <li
                  key={`${item.to}:${item.params?.brand ?? ''}:${item.params?.slug ?? ''}:${item.params?.serial ?? ''}`}
                >
                  <Link
                    to={item.to}
                    {...(item.params ? { params: item.params } : {})}
                    className={styles.navLink}
                    activeOptions={{ exact: true, includeSearch: false }}
                    activeProps={{ 'aria-current': 'page' }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <main id="main" className={styles.main} tabIndex={-1}>
        {children}
      </main>
      <footer className={styles.footer}>
        <code className={styles.build} dir="ltr" data-testid="build-info">
          {m.build(__NDS_BUILD__.branch, __NDS_BUILD__.sha)}
        </code>
      </footer>
    </div>
  );
}

function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  return (
    <ToggleButtonGroup
      aria-label={m.theme.legend}
      selectedKeys={[theme]}
      disallowEmptySelection
      onSelectionChange={(keys) => {
        const [next] = [...keys];
        if (next === 'light' || next === 'dark' || next === 'system') setTheme(next);
      }}
    >
      {THEME_CHOICES.map((choice) => (
        <ToggleButton key={choice} id={choice} size="sm">
          {m.theme[choice]}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
