/**
 * Theme selection (docs/03-architecture.md §2 Modes): `data-theme` on <html>; the default
 * follows the OS; the user's choice is stored in a cookie so SSR renders the right mode
 * without a flash. `?theme=` overrides the cookie for reproducible tests and screenshots.
 */
import { createIsomorphicFn } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';

export type ThemeChoice = 'light' | 'dark' | 'system';
export const THEME_COOKIE = 'nds-theme';
export const THEME_CHOICES: readonly ThemeChoice[] = ['system', 'light', 'dark'];

export function parseTheme(value: unknown): ThemeChoice | undefined {
  return value === 'light' || value === 'dark' || value === 'system' ? value : undefined;
}

/** Reads the theme cookie on the server (request) and in the browser (document.cookie). */
export const readThemeCookie = createIsomorphicFn()
  .server(() => parseTheme(getCookie(THEME_COOKIE)))
  .client(() => {
    const match = document.cookie.match(new RegExp(`(?:^|; )${THEME_COOKIE}=([^;]*)`));
    return parseTheme(match?.[1]);
  });

export function writeThemeCookie(choice: ThemeChoice): void {
  const maxAge = choice === 'system' ? 0 : 60 * 60 * 24 * 365;
  // biome-ignore lint/suspicious/noDocumentCookie: a plain first-party preference cookie
  document.cookie = `${THEME_COOKIE}=${choice}; path=/; max-age=${maxAge}; samesite=lax`;
}

/** The `data-theme` attribute value, or undefined to follow the OS. */
export function themeAttribute(choice: ThemeChoice): 'light' | 'dark' | undefined {
  return choice === 'system' ? undefined : choice;
}
