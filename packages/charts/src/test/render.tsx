import { ThemeProvider } from '@negaresh/react';
import { faMessages } from '@negaresh/react/messages/fa';
import { type RenderOptions, type RenderResult, render } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <div dir="rtl" lang="fa">
      <ThemeProvider messages={faMessages}>{children}</ThemeProvider>
    </div>
  );
}

/** Render inside ThemeProvider (Persian messages) and an RTL container. */
export function renderCharts(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
): RenderResult {
  return render(ui, { wrapper: Wrapper, ...options });
}
