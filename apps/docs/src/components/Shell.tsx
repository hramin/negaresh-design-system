import { SkipLink, ToggleButton, ToggleButtonGroup, useTheme } from '@negaresh/react';
import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { ASSESSMENT_DOCS } from '../docs/assessment/registry.tsx';
import { CHART_DOCS } from '../docs/charts/registry.tsx';
import { PATTERN_DOCS } from '../docs/patterns/registry.tsx';
import { COMPONENT_DOCS } from '../docs/registry.tsx';
import { m } from '../lib/messages.ts';
import { THEME_CHOICES } from '../lib/theme.ts';
import styles from './Shell.module.css';

const NAV: {
  title: string;
  items: { to: string; params?: Record<string, string>; label: string }[];
}[] = [
  {
    title: m.navGroups.start,
    items: [{ to: '/', label: m.nav.overview }],
  },
  {
    title: m.navGroups.foundations,
    items: [
      { to: '/foundations/color', label: m.nav.color },
      { to: '/foundations/icons', label: m.nav.icons },
      { to: '/tokens', label: m.nav.tokens },
    ],
  },
  {
    title: m.navGroups.components,
    items: [
      { to: '/components', label: m.nav.components },
      ...COMPONENT_DOCS.map((d) => ({
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
      ...CHART_DOCS.map((d) => ({
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
      ...ASSESSMENT_DOCS.map((d) => ({
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
      ...PATTERN_DOCS.map((d) => ({
        to: '/patterns/$slug',
        params: { slug: d.slug },
        label: d.title,
      })),
    ],
  },
  {
    title: m.navGroups.guides,
    items: [{ to: '/guides/tanstack-form-zod', label: m.nav.formAdapter }],
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
    ],
  },
];

/** RTL site shell: skip link, top bar with theme switch, side navigation, main content. */
export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <SkipLink />
      <header className={styles.topbar}>
        <Link to="/" className={styles.brand}>
          {m.siteName}
          <span className={styles.brandLatin} lang="en" dir="ltr">
            {m.siteNameLatin}
          </span>
        </Link>
        <ThemeSwitch />
      </header>
      <nav className={styles.nav} aria-label={m.navLabel}>
        {NAV.map((group) => (
          <div key={group.title} className={styles.navGroup}>
            <p className={styles.navTitle}>{group.title}</p>
            <ul>
              {group.items.map((item) => (
                <li key={item.to + (item.params?.slug ?? '')}>
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
