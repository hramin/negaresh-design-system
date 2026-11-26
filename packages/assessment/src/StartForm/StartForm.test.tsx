import { ThemeProvider } from '@negaresh/react';
import { faMessages } from '@negaresh/react/messages/fa';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { startFormSchema } from '../fixtures/index.ts';
import { expectNoAxeViolations } from '../test/axe.ts';
import { StartForm } from './StartForm.tsx';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider messages={faMessages}>{ui}</ThemeProvider>);
}

describe('StartForm', () => {
  it('renders all 4 schema field types, validates required fields, and submits cleanly', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    const { container } = renderWithTheme(
      <StartForm
        title="اطلاعات پیش از شروع آزمون"
        fields={startFormSchema}
        defaultValues={{
          educationLevel: 'high',
          age: 16,
          audiencePreference: 'calm',
        }}
        onSubmit={onSubmit}
      />,
    );

    // Missing required participantCode triggers error summary
    await user.click(screen.getByRole('button', { name: 'شروع آزمون' }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('لطفاً پیش از شروع، موارد زیر را تکمیل یا اصلاح کنید')).toBeTruthy();

    const codeInput = screen.getByLabelText(/شناسهٔ شرکت‌کننده/);
    await user.type(codeInput, 'SCH-1405-042');
    await user.click(screen.getByRole('button', { name: 'شروع آزمون' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        participantCode: 'SCH-1405-042',
        educationLevel: 'high',
        age: 16,
        audiencePreference: 'calm',
      }),
    );
    await expectNoAxeViolations(container);
  });

  it('displays campaign blocker alert and disables submit when blocked', async () => {
    const { container } = renderWithTheme(
      <StartForm title="آزمون سازمانی" fields={startFormSchema} blocker="seats_full" />,
    );

    expect(screen.getByText('ظرفیت این آزمون تکمیل شده است')).toBeTruthy();
    expect((screen.getByRole('button', { name: 'شروع آزمون' }) as HTMLButtonElement).disabled).toBe(
      true,
    );
    await expectNoAxeViolations(container);
  });
});
