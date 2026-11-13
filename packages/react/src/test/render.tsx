import { type RenderOptions, type RenderResult, render } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { faMessages } from '../messages/fa.ts';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider.tsx';

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <div dir="rtl" lang="fa">
      <ThemeProvider messages={faMessages}>{children}</ThemeProvider>
    </div>
  );
}

/** Render inside ThemeProvider (Persian messages) and an RTL container. */
export function renderNds(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
): RenderResult {
  return render(ui, { wrapper: Wrapper, ...options });
}
