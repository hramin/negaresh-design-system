/**
 * Theme selection (docs/03-architecture.md §2 Modes): `data-theme` on <html>; the default
 * follows the OS; the choice is stored in a cookie so SSR renders the right mode without
 * a flash. `?theme=` overrides the cookie for reproducible tests and screenshots.
 */
import {
  parseThemeChoice,
  serializeThemeCookie,
  THEME_COOKIE,
  type ThemeChoice,
} from '@negaresh/react';
import { createIsomorphicFn } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';

export const THEME_CHOICES: readonly ThemeChoice[] = ['system', 'light', 'dark'];

/** Reads the theme cookie on the server (request) and in the browser (document.cookie). */
export const readThemeCookie = createIsomorphicFn()
  .server(() => parseThemeChoice(getCookie(THEME_COOKIE)))
  .client(() => {
    const match = document.cookie.match(new RegExp(`(?:^|; )${THEME_COOKIE}=([^;]*)`));
    return parseThemeChoice(match?.[1]);
  });

export function writeThemeCookie(choice: ThemeChoice): void {
  // biome-ignore lint/suspicious/noDocumentCookie: a plain first-party preference cookie
  document.cookie = serializeThemeCookie(choice);
}
