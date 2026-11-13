/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import page from '../components/Page.module.css';
import { Shell } from '../components/Shell.tsx';
import { ThemeProvider } from '../components/ThemeProvider.tsx';
import { m } from '../lib/messages.ts';
import { parseTheme, readThemeCookie, themeAttribute } from '../lib/theme.ts';
import appCss from '../styles.css?url';

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    const search = location.search as Record<string, unknown>;
    return { theme: parseTheme(search.theme) ?? readThemeCookie() ?? 'system' };
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'color-scheme', content: 'light dark' },
      { title: m.siteName },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      // No favicon until the logos exist (Q-02); an empty icon avoids a 404 per page.
      { rel: 'icon', href: 'data:,' },
    ],
  }),
  shellComponent: RootDocument,
  component: RootComponent,
  notFoundComponent: NotFound,
});

function NotFound() {
  return (
    <article className={page.page}>
      <header className={page.header}>
        <h1 className={page.title}>{m.notFound.title}</h1>
        <p className={page.lead}>{m.notFound.body}</p>
      </header>
    </article>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  const { theme } = Route.useRouteContext();
  return (
    <html lang="fa" dir="rtl" data-theme={themeAttribute(theme)}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { theme } = Route.useRouteContext();
  return (
    <ThemeProvider initial={theme}>
      <Shell>
        <Outlet />
      </Shell>
    </ThemeProvider>
  );
}
