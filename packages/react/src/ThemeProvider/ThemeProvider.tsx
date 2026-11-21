import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { I18nProvider } from 'react-aria-components';
import { installReactAriaPersianStrings } from '../messages/react-aria-fa.ts';
import type { NdsMessages } from '../messages/types.ts';

export type ThemeChoice = 'light' | 'dark' | 'system';
export type Density = 'comfortable' | 'compact';

interface NdsContextValue {
  theme: ThemeChoice;
  setTheme: (choice: ThemeChoice) => void;
  density: Density;
  messages: NdsMessages;
}

const NdsContext = createContext<NdsContextValue | null>(null);

export interface ThemeProviderProps {
  /** Initial theme choice, e.g. read from the theme cookie on the server. Default `system`. */
  defaultTheme?: ThemeChoice;
  /** Called after the user changes the theme; persist it here (cookie). */
  onThemeChange?: (choice: ThemeChoice) => void;
  /** `compact` for admin tables (40 px controls); targets stay ≥ 44 px. Default `comfortable`. */
  density?: Density;
  /** Strings components render on their own, e.g. `faMessages` from `@negaresh/react/messages/fa`. */
  messages: NdsMessages;
  /** Locale for React Aria (dates, numbers, direction). Default `fa-IR-u-ca-persian`. */
  locale?: string | undefined;
  children: ReactNode;
}

/**
 * Root provider: theme choice, density, locale and the message catalogue.
 * Render `data-theme` on `<html>` on the server from the same choice (`themeAttribute`)
 * so the first paint is correct; the provider keeps it in sync on the client.
 */
export function ThemeProvider({
  defaultTheme = 'system',
  onThemeChange,
  density = 'comfortable',
  messages,
  locale = 'fa-IR-u-ca-persian',
  children,
}: ThemeProviderProps) {
  installReactAriaPersianStrings(locale);
  const [theme, setThemeState] = useState<ThemeChoice>(defaultTheme);

  useEffect(() => {
    const root = document.documentElement;
    const attr = themeAttribute(theme);
    if (attr) root.dataset.theme = attr;
    else delete root.dataset.theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.density = density;
  }, [density]);

  const setTheme = useCallback(
    (choice: ThemeChoice) => {
      setThemeState(choice);
      onThemeChange?.(choice);
    },
    [onThemeChange],
  );

  const value = useMemo(
    () => ({ theme, setTheme, density, messages }),
    [theme, setTheme, density, messages],
  );
  return (
    <NdsContext.Provider value={value}>
      <I18nProvider locale={locale}>{children}</I18nProvider>
    </NdsContext.Provider>
  );
}

function useNds(): NdsContextValue {
  const ctx = useContext(NdsContext);
  if (!ctx) throw new Error('NDS components must be rendered inside <ThemeProvider messages={…}>.');
  return ctx;
}

/** Current theme choice and a setter. */
export function useTheme(): Pick<NdsContextValue, 'theme' | 'setTheme'> {
  const { theme, setTheme } = useNds();
  return { theme, setTheme };
}

/** The message catalogue passed to <ThemeProvider>. */
export function useNdsMessages(): NdsMessages {
  return useNds().messages;
}

/** `data-theme` value for a choice; undefined follows the OS. */
export function themeAttribute(choice: ThemeChoice): 'light' | 'dark' | undefined {
  return choice === 'system' ? undefined : choice;
}

/** Cookie that stores the theme choice (read it on the server to render `data-theme`). */
export const THEME_COOKIE = 'nds-theme';

export function parseThemeChoice(value: unknown): ThemeChoice | undefined {
  return value === 'light' || value === 'dark' || value === 'system' ? value : undefined;
}

/** Reads the choice from a `Cookie` header or `document.cookie`. */
export function readThemeCookie(cookieHeader: string | null | undefined): ThemeChoice | undefined {
  const match = cookieHeader?.match(new RegExp(`(?:^|;\\s*)${THEME_COOKIE}=([^;]*)`));
  return parseThemeChoice(match?.[1]);
}

/** `Set-Cookie` / `document.cookie` value for a choice; `system` clears the cookie. */
export function serializeThemeCookie(choice: ThemeChoice): string {
  const maxAge = choice === 'system' ? 0 : 60 * 60 * 24 * 365;
  return `${THEME_COOKIE}=${choice}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}
