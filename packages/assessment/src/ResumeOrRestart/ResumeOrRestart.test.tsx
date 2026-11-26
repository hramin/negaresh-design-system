import { ThemeProvider } from '@negaresh/react';
import { faMessages } from '@negaresh/react/messages/fa';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { unfinishedAttempt } from '../fixtures/index.ts';
import { expectNoAxeViolations } from '../test/axe.ts';
import { ResumeOrRestart } from './ResumeOrRestart.tsx';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider messages={faMessages}>{ui}</ThemeProvider>);
}

describe('ResumeOrRestart', () => {
  it('invokes onResume and guards onRestart with AlertDialog confirmation', async () => {
    const onResume = vi.fn();
    const onRestart = vi.fn();
    const user = userEvent.setup();

    const { container } = renderWithTheme(
      <ResumeOrRestart
        testTitle={unfinishedAttempt.testTitle}
        lastSavedAt={unfinishedAttempt.lastSavedAt}
        expiresAt={unfinishedAttempt.expiresAt}
        answeredCount={unfinishedAttempt.answeredCount}
        totalQuestions={unfinishedAttempt.totalQuestions}
        currentPage={unfinishedAttempt.currentPage}
        totalPages={unfinishedAttempt.totalPages}
        onResume={onResume}
        onRestart={onRestart}
      />,
    );

    expect(container.textContent).toContain('۲۴ از ۶۰ پرسش پاسخ داده شده');
    await user.click(screen.getByRole('button', { name: 'ادامهٔ آزمون' }));
    expect(onResume).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'شروع دوباره' }));
    expect(onRestart).not.toHaveBeenCalled();
    expect(screen.getByRole('alertdialog')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'پاک کردن و شروع دوباره' }));
    expect(onRestart).toHaveBeenCalledTimes(1);
    await expectNoAxeViolations(container);
  });
});
