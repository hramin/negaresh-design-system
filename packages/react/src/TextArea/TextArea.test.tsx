import { createRef, useState } from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { faMessages } from '../messages/fa.ts';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { TextArea } from './TextArea.tsx';

function ControlledTextArea() {
  const [value, setValue] = useState('');
  return <TextArea label="یادداشت" value={value} onChange={setValue} showCharacterCount />;
}

describe('TextArea', () => {
  it('renders a labelled multiline input and links its description and error', async () => {
    const ref = createRef<HTMLTextAreaElement>();
    const { container } = renderNds(
      <TextArea
        label="یادداشت"
        id="note"
        description="جزئیات"
        isInvalid
        errorMessage="متن را اصلاح کنید"
        ref={ref}
        rows={4}
        autoGrow={false}
      />,
    );
    const input = screen.getByRole('textbox', { name: 'یادداشت' }) as HTMLTextAreaElement;
    expect(input.tagName).toBe('TEXTAREA');
    expect(ref.current).toBe(input);
    expect(input.id).toBe('note');
    expect(input.rows).toBe(4);
    const ids = input.getAttribute('aria-describedby')?.split(' ') ?? [];
    expect(ids.map((id) => document.getElementById(id)?.textContent).join(' ')).toContain('جزئیات');
    expect(ids.map((id) => document.getElementById(id)?.textContent).join(' ')).toContain(
      'متن را اصلاح کنید',
    );
    await expectNoAxeViolations(container);
  });

  it('supports controlled text, line breaks and the count', async () => {
    renderNds(<ControlledTextArea />);
    const input = screen.getByRole('textbox') as HTMLTextAreaElement;
    await userEvent.type(input, 'الف{Enter}ب');
    expect(input.value).toBe('الف\nب');
    expect(screen.getByText(faMessages.characterCount(5))).toBeTruthy();
  });

  it('grows and shrinks rows from measured content while keeping the configured minimum', async () => {
    const computed = vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      lineHeight: '20px',
      paddingBlockStart: '8px',
      paddingBlockEnd: '8px',
    } as CSSStyleDeclaration);
    try {
      const { rerender } = renderNds(
        <TextArea label="یادداشت" rows={2} value="الف" onChange={() => {}} />,
      );
      const input = screen.getByRole('textbox') as HTMLTextAreaElement;
      let measuredHeight = 116;
      Object.defineProperty(input, 'scrollHeight', { get: () => measuredHeight });
      rerender(<TextArea label="یادداشت" rows={2} value="متن بلند" onChange={() => {}} />);
      await waitFor(() => expect(input.rows).toBe(5));
      measuredHeight = 36;
      rerender(<TextArea label="یادداشت" rows={2} value="کوتاه" onChange={() => {}} />);
      await waitFor(() => expect(input.rows).toBe(2));
    } finally {
      computed.mockRestore();
    }
  });
});
