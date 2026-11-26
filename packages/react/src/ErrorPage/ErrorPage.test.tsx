import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Code } from '../Ltr/Ltr.tsx';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { ErrorPage, ErrorState } from './ErrorPage.tsx';

describe('ErrorState and ErrorPage', () => {
  it('renders all five presets (403, 404, 410, 500, maintenance) with Persian copy and passes axe', async () => {
    const onRetry = vi.fn();
    const ref = createRef<HTMLDivElement>();
    const { container } = renderNds(
      <>
        <ErrorState ref={ref} status={403} actionHref="/" />
        <ErrorState status={404} actionHref="/" />
        <ErrorState status={410} />
        <ErrorState
          status={500}
          onAction={onRetry}
          details={
            <>
              شناسهٔ خطا: <Code>REQ-4092-FA</Code>
            </>
          }
        />
        <ErrorPage status="maintenance" embedded headingLevel={2} onAction={onRetry} />
      </>,
    );

    expect(ref.current?.dataset.nds).toBe('ErrorState');
    expect(screen.getByText('۴۰۳')).toBeTruthy();
    expect(screen.getByText('۴۰۴')).toBeTruthy();
    expect(screen.getByText('۴۱۰')).toBeTruthy();
    expect(screen.getByText('۵۰۰')).toBeTruthy();
    expect(screen.getByText('به‌روزرسانی')).toBeTruthy();
    expect(screen.getByRole('alert')).toBeTruthy();

    await userEvent.click(screen.getByRole('button', { name: 'تلاش دوباره' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    await expectNoAxeViolations(container);
  });
});
