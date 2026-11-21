import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { FormErrorSummary } from './FormErrorSummary.tsx';

describe('FormErrorSummary', () => {
  it('renders no alert when there are no errors', () => {
    renderNds(<FormErrorSummary errors={[]} />);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('announces a labelled list of field errors and focuses the linked field', async () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = renderNds(
      <>
        <FormErrorSummary
          ref={ref}
          title="این موارد را بررسی کنید"
          errors={[
            { id: 'summary-email', message: 'ایمیل لازم است' },
            { id: 'summary-phone', message: 'شماره لازم است' },
          ]}
        />
        <label htmlFor="summary-email">ایمیل</label>
        <input id="summary-email" aria-invalid="true" aria-describedby="email-error" />
        <span id="email-error">ایمیل لازم است</span>
        <label htmlFor="summary-phone">شماره</label>
        <input id="summary-phone" aria-invalid="true" aria-describedby="phone-error" />
        <span id="phone-error">شماره لازم است</span>
      </>,
    );
    expect(ref.current).toBe(screen.getByRole('alert', { name: 'این موارد را بررسی کنید' }));
    expect(screen.getByRole('link', { name: 'شماره لازم است' }).getAttribute('href')).toBe(
      '#summary-phone',
    );
    await userEvent.click(screen.getByRole('link', { name: 'شماره لازم است' }));
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'شماره' }));
    await expectNoAxeViolations(container);
  });
});
