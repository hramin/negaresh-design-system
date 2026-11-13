import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { type ThemeChoice, themeAttribute, writeThemeCookie } from '../lib/theme.ts';

interface ThemeContextValue {
  theme: ThemeChoice;
  setTheme: (choice: ThemeChoice) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Stub of the NDS ThemeProvider (the real one ships in @negaresh/react, P2).
 * Holds the theme choice, writes the cookie and updates `data-theme` on <html>.
 */
export function ThemeProvider({
  initial,
  children,
}: {
  initial: ThemeChoice;
  children: ReactNode;
}) {
  const [theme, setThemeState] = useState(initial);
  const setTheme = useCallback((choice: ThemeChoice) => {
    setThemeState(choice);
    writeThemeCookie(choice);
    const attr = themeAttribute(choice);
    if (attr) document.documentElement.dataset.theme = attr;
    else delete document.documentElement.dataset.theme;
  }, []);
  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
