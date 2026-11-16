import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { Form } from 'react-aria-components';
import { describe, expect, it, vi } from 'vitest';
import { faMessages } from '../messages/fa.ts';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { SearchField } from './SearchField.tsx';

function ControlledSearch() {
  const [value, setValue] = useState('نگرش');
  return <SearchField label="جست‌وجو" value={value} onChange={setValue} />;
}

describe('SearchField', () => {
  it('submits a query and clears it with RAC while keeping input focus', async () => {
    const onSubmit = vi.fn();
    const onClear = vi.fn();
    const onChange = vi.fn();
    renderNds(
      <SearchField label="جست‌وجو" onSubmit={onSubmit} onClear={onClear} onChange={onChange} />,
    );
    const input = screen.getByRole('searchbox', { name: 'جست‌وجو' }) as HTMLInputElement;
    await userEvent.type(input, 'روان‌شناسی{Enter}');
    expect(onSubmit).toHaveBeenCalledWith('روان‌شناسی');
    await userEvent.click(screen.getByRole('button', { name: 'پاک کردن جست‌وجو' }));
    expect(input.value).toBe('');
    expect(document.activeElement).toBe(input);
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith('');
    expect(screen.queryByRole('button', { name: 'پاک کردن جست‌وجو' })).toBeNull();
  });

  it('supports controlled values and Escape clearing', async () => {
    renderNds(<ControlledSearch />);
    const input = screen.getByRole('searchbox') as HTMLInputElement;
    await userEvent.click(input);
    await userEvent.keyboard('{Escape}');
    expect(input.value).toBe('');
    await userEvent.type(input, 'تست');
    expect(input.value).toBe('تست');
  });

  it('associates help and error text and forwards the actual input ref', async () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = renderNds(
      <SearchField
        label="جست‌وجوی محصول"
        description="نام یا کد محصول"
        shortcutHint="Ctrl+K"
        isInvalid
        errorMessage="عبارت کوتاه است"
        className="custom-root"
        ref={ref}
      />,
    );
    const input = screen.getByRole('searchbox') as HTMLInputElement;
    expect(ref.current).toBe(input);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    const descriptions = input.getAttribute('aria-describedby')?.split(' ') ?? [];
    expect(descriptions.map((id) => document.getElementById(id)?.textContent).join(' ')).toContain(
      'نام یا کد محصول',
    );
    expect(descriptions.map((id) => document.getElementById(id)?.textContent).join(' ')).toContain(
      'عبارت کوتاه است',
    );
    expect(container.querySelector('.custom-root')?.getAttribute('data-nds')).toBe('SearchField');
    expect(input.classList.contains('custom-root')).toBe(false);
    await expectNoAxeViolations(container);
  });

  it('provides the Persian fallback for controlled invalid state without a message', () => {
    renderNds(<SearchField label="جست‌وجو" isInvalid />);
    expect(screen.getByRole('searchbox').getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText(faMessages.fieldInvalid)).toBeTruthy();
  });

  it('preserves a readonly query and disables a disabled field', async () => {
    const { rerender } = renderNds(<SearchField label="جست‌وجو" defaultValue="ثابت" isReadOnly />);
    const input = screen.getByRole('searchbox') as HTMLInputElement;
    expect(input.readOnly).toBe(true);
    expect(screen.queryByRole('button')).toBeNull();
    await userEvent.type(input, 'دیگر');
    expect(input.value).toBe('ثابت');
    rerender(<SearchField label="جست‌وجو" isDisabled />);
    expect((screen.getByRole('searchbox') as HTMLInputElement).disabled).toBe(true);
  });

  it('displays named server errors from Form and announces pending work', async () => {
    renderNds(
      <Form validationErrors={{ query: 'این جست‌وجو در دسترس نیست' }}>
        <SearchField label="جست‌وجو" name="query" defaultValue="تست" isPending />
      </Form>,
    );
    const error = screen.getByText('این جست‌وجو در دسترس نیست');
    const validationSlot = error.parentElement;
    expect(screen.getByRole('status').textContent).toBe('در حال انجام');
    expect(screen.getByRole('searchbox').getAttribute('aria-busy')).toBe('true');
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'نو' } });
    expect(screen.queryByText('این جست‌وجو در دسترس نیست')).toBeNull();
    // Clearing server validation must preserve the reserved row below the input.
    expect(validationSlot?.isConnected).toBe(true);
    expect(validationSlot?.textContent).toBe('');
  });
});
