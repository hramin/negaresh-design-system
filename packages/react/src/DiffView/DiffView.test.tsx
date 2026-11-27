import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { computeLineDiff, DiffView } from './DiffView.tsx';

describe('DiffView', () => {
  it('computes line diffs and renders accessible ins/del markers with Persian summary counts', async () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = renderNds(
      <DiffView
        ref={ref}
        title="بازنگری سیاست سقف فعال‌سازی"
        beforeLabel="نسخهٔ ۱"
        afterLabel="نسخهٔ ۲"
        before={'سقف پیش‌فرض: ۲ رایانه\nمنبع سقف: محصول'}
        after={'سقف پیش‌فرض: ۳ رایانه\nمنبع سقف: مشتری\nدلیل: درخواست کلینیک'}
        allowModeToggle
      />,
    );

    expect(ref.current?.dataset.nds).toBe('DiffView');
    expect(ref.current?.dataset.mode).toBe('unified');
    expect(container.querySelectorAll('ins').length).toBe(3);
    expect(container.querySelectorAll('del').length).toBe(2);
    expect(screen.getByText('+۳')).toBeTruthy();
    expect(screen.getByText('−۲')).toBeTruthy();

    await expectNoAxeViolations(container);

    // Toggle to split mode
    await userEvent.click(screen.getByRole('radio', { name: 'کنار هم' }));
    expect(ref.current?.dataset.mode).toBe('split');
    await expectNoAxeViolations(container);
  });

  it('isolates LTR code lines and renders inline segments cleanly', async () => {
    const computed = computeLineDiff('limit=1', 'limit=3');
    expect(computed.map((l) => l.type)).toEqual(['removed', 'added']);

    const { container } = renderNds(
      <DiffView
        isCode
        lines={[
          {
            type: 'removed',
            content: 'serial: N25AG-EMV0K · limit=1',
            oldLineNumber: 1,
            inlineSegments: [
              { text: 'serial: N25AG-EMV0K · limit=' },
              { text: '1', changed: true },
            ],
          },
          {
            type: 'added',
            content: 'serial: N25AG-EMV0K · limit=3',
            newLineNumber: 1,
            inlineSegments: [
              { text: 'serial: N25AG-EMV0K · limit=' },
              { text: '3', changed: true },
            ],
          },
        ]}
      />,
    );

    const ltrSpans = container.querySelectorAll('[dir="ltr"]');
    expect(ltrSpans.length).toBe(2);
    await expectNoAxeViolations(container);
  });
});
