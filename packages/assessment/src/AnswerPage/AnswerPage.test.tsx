import { ThemeProvider } from '@negaresh/react';
import { faMessages } from '@negaresh/react/messages/fa';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AnswerProgress } from '../AnswerProgress/AnswerProgress.tsx';
import { sampleQuestions } from '../fixtures/index.ts';
import { expectNoAxeViolations } from '../test/axe.ts';
import { AnswerPage } from './AnswerPage.tsx';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider messages={faMessages}>{ui}</ThemeProvider>);
}

describe('AnswerProgress & AnswerPage', () => {
  it('renders Persian page progress and live-region announcement', async () => {
    const { container } = renderWithTheme(
      <AnswerProgress currentPage={3} totalPages={13} answeredCount={12} totalQuestions={40} />,
    );

    expect(container.textContent).toContain('صفحهٔ ۳ از ۱۳');
    expect(container.textContent).toContain('۱۲ از ۴۰ پرسش پاسخ داده شده');
    const status = screen.getByRole('status');
    expect(status.textContent).toContain('صفحهٔ ۳ از ۱۳');
    await expectNoAxeViolations(container);
  });

  it('validates unanswered questions on submit, announces FormErrorSummary, and focuses first radio', async () => {
    const onNext = vi.fn();
    const user = userEvent.setup();
    const pageQuestions = sampleQuestions.slice(0, 2);

    const { container } = renderWithTheme(
      <AnswerPage
        title="آزمون نمونه"
        questions={pageQuestions}
        currentPage={1}
        totalPages={3}
        onNextPage={onNext}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'صفحهٔ بعدی' }));

    expect(onNext).not.toHaveBeenCalled();
    expect(screen.getByText('۲ پرسش در این صفحه بدون پاسخ مانده است')).toBeTruthy();

    const firstRadio = screen.getAllByRole('radio')[0]!;
    expect(document.activeElement).toBe(firstRadio);

    // Answer both questions and submit cleanly
    await user.click(firstRadio);
    const secondQuestionRadios = screen.getAllByRole('radio');
    await user.click(secondQuestionRadios[4]!);
    await user.click(screen.getByRole('button', { name: 'صفحهٔ بعدی' }));

    expect(onNext).toHaveBeenCalledWith({
      [pageQuestions[0]!.id]: 'true',
      [pageQuestions[1]!.id]: '3',
    });
    await expectNoAxeViolations(container);
  });
});
