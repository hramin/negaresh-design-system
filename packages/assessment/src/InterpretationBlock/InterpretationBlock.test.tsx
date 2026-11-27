import { ThemeProvider } from '@negaresh/react';
import { faMessages } from '@negaresh/react/messages/fa';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { mmpiTeen13Fixture } from '../fixtures/index.ts';
import { expectNoAxeViolations } from '../test/axe.ts';
import { InterpretationBlock } from './InterpretationBlock.tsx';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider messages={faMessages}>{ui}</ThemeProvider>);
}

describe('InterpretationBlock', () => {
  it('renders professional clinical sections with danger accent and calm sections with zero danger/rose', async () => {
    const pro = renderWithTheme(
      <InterpretationBlock sections={mmpiTeen13Fixture.interpretations} mode="professional" />,
    );
    expect(pro.container.querySelectorAll('[data-accent="danger"]').length).toBeGreaterThan(0);
    expect(pro.container.querySelectorAll('[data-tone="danger"]').length).toBeGreaterThan(0);
    await expectNoAxeViolations(pro.container);
    pro.unmount();

    const calm = renderWithTheme(
      <InterpretationBlock sections={mmpiTeen13Fixture.interpretations} mode="calm" />,
    );
    expect(calm.container.querySelectorAll('[data-accent="danger"]')).toHaveLength(0);
    expect(calm.container.querySelectorAll('[data-tone="danger"]')).toHaveLength(0);
    expect(calm.container.textContent).toContain('گام‌های پیشنهادی');
    await expectNoAxeViolations(calm.container);
  });
});
