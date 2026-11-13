import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { m } from '../lib/messages.ts';
import { THEME_CHOICES } from '../lib/theme.ts';
import styles from './Shell.module.css';
import { useTheme } from './ThemeProvider.tsx';

const NAV = [
  { to: '/', label: m.nav.overview },
  { to: '/tokens', label: m.nav.tokens },
  { to: '/foundations/color', label: m.nav.color },
] as const;

/** RTL site shell: skip link, top bar with theme switch, side navigation, main content. */
export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <a className={styles.skip} href="#main">
        {m.skipToContent}
      </a>
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
        <ul>
          {NAV.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={styles.navLink}
                activeOptions={{ exact: true, includeSearch: false }}
                activeProps={{ 'aria-current': 'page' }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <main id="main" className={styles.main} tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}

function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  return (
    <fieldset className={styles.themeSwitch}>
      <legend className={styles.visuallyHidden}>{m.theme.legend}</legend>
      {THEME_CHOICES.map((choice) => (
        <label key={choice} className={styles.themeOption}>
          <input
            type="radio"
            name="nds-theme"
            value={choice}
            checked={theme === choice}
            onChange={() => setTheme(choice)}
          />
          <span>{m.theme[choice]}</span>
        </label>
      ))}
    </fieldset>
  );
}
