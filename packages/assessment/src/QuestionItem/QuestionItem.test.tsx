import { ThemeProvider } from '@negaresh/react';
import { faMessages } from '@negaresh/react/messages/fa';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { sampleQuestions } from '../fixtures/index.ts';
import { expectNoAxeViolations } from '../test/axe.ts';
import { QuestionItem, questionDefinitionToProps } from './QuestionItem.tsx';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider messages={faMessages}>{ui}</ThemeProvider>);
}

describe('QuestionItem', () => {
  it('renders semantic fieldset + legend stem and real radio options (fixes review finding #1)', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const q = sampleQuestions[0]!;

    const { container } = renderWithTheme(
      <QuestionItem {...questionDefinitionToProps(q)} onChange={onChange} />,
    );

    const fieldset = container.querySelector('fieldset');
    const legend = container.querySelector('legend');
    expect(fieldset).toBeTruthy();
    expect(legend?.textContent).toContain('پرسش ۱');
    expect(legend?.textContent).toContain(q.stem);

    const group = screen.getByRole('radiogroup');
    expect(group).toBeTruthy();
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(2);

    await user.click(radios[0]!);
    expect(onChange).toHaveBeenCalledWith('true');
    await expectNoAxeViolations(container);
  });

  it('supports 5-point Likert, forced-choice, and image-option variants with zero axe violations', async () => {
    const likertQ = sampleQuestions[1]!;
    const forcedQ = sampleQuestions[2]!;
    const imageQ = sampleQuestions[5]!;

    const { container } = renderWithTheme(
      <div>
        <QuestionItem {...questionDefinitionToProps(likertQ)} defaultValue="3" />
        <QuestionItem {...questionDefinitionToProps(forcedQ)} defaultValue="a" />
        <QuestionItem {...questionDefinitionToProps(imageQ)} defaultValue="clear" />
      </div>,
    );

    expect(container.querySelectorAll('[data-nds="QuestionItem"]')).toHaveLength(3);
    expect(container.querySelectorAll('img')).toHaveLength(3);
    await expectNoAxeViolations(container);
  });

  it('announces inline validation error when invalid', async () => {
    const q = sampleQuestions[0]!;
    const { container } = renderWithTheme(
      <QuestionItem {...questionDefinitionToProps(q)} isInvalid />,
    );

    const alert = screen.getByRole('alert');
    expect(alert.textContent).toContain('لطفاً یکی از گزینه‌ها را انتخاب کنید.');
    await expectNoAxeViolations(container);
  });
});
