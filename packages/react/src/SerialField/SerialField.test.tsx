import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Form } from 'react-aria-components';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { CodeField, SerialField } from './SerialField.tsx';

function ControlledSerialExample() {
  const [value, setValue] = useState('');
  return <SerialField label="سریال" value={value} onChange={setValue} />;
}

describe('SerialField and CodeField', () => {
  it('groups display, normalizes the callback and submits a single canonical value', async () => {
    const onChange = vi.fn();
    const { container } = renderNds(
      <Form>
        <SerialField label="سریال" name="serial" onChange={onChange} />
      </Form>,
    );
    const input = screen.getByRole('textbox', { name: 'سریال' }) as HTMLInputElement;
    await userEvent.type(input, 'abcde۱۲۳۴۵');
    expect(input.value).toBe('ABCDE-12345');
    expect(onChange).toHaveBeenLastCalledWith('ABCDE12345');
    expect(
      new FormData(container.querySelector('form') as HTMLFormElement).getAll('serial'),
    ).toEqual(['ABCDE12345']);
    expect(input.dir).toBe('ltr');
    expect(screen.getByText(/XXXXX-XXXXX/)).toBeTruthy();
  });

  it('preserves insertion selection and excess characters instead of truncating them', async () => {
    renderNds(<SerialField label="سریال" defaultValue="ABCDE12345" />);
    const input = screen.getByRole('textbox', { name: 'سریال' }) as HTMLInputElement;
    await userEvent.click(input);
    input.setSelectionRange(2, 2);
    await userEvent.keyboard('z');
    expect(input.value).toBe('ABZCD-E12345');
    expect(input.selectionStart).toBe(3);
    await userEvent.keyboard('x');
    expect(input.value).toBe('ABZXC-DE12345');
  });

  it('keeps the caret at an edited separator instead of deleting the last character', async () => {
    renderNds(<SerialField label="سریال" defaultValue="ABCDE12345" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await userEvent.click(input);
    input.setSelectionRange(6, 6);
    await userEvent.keyboard('{Backspace}');
    expect(input.value).toBe('ABCDE-12345');
    expect(input.selectionStart).toBe(5);
    await userEvent.keyboard('{Backspace}');
    expect(input.value).toBe('ABCD1-2345');
    expect(input.selectionStart).toBe(4);
  });

  it('keeps forward deletion at the separator next to the second group', async () => {
    renderNds(<SerialField label="سریال" defaultValue="ABCDE12345" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await userEvent.click(input);
    input.setSelectionRange(5, 5);
    await userEvent.keyboard('{Delete}');
    expect(input.value).toBe('ABCDE-12345');
    expect(input.selectionStart).toBe(6);
    await userEvent.keyboard('{Delete}');
    expect(input.value).toBe('ABCDE-2345');
    expect(input.selectionStart).toBe(6);
  });

  it('supports paste and controlled canonical values without replacing look-alike letters', async () => {
    renderNds(<ControlledSerialExample />);
    const input = screen.getByRole('textbox', { name: 'سریال' }) as HTMLInputElement;
    const user = userEvent.setup();
    await user.click(input);
    await user.paste('oIl01 - Abcde');
    expect(input.value).toBe('OIL01-ABCDE');
  });

  it('keeps generic system codes independent of serial grouping and length', async () => {
    const { container } = renderNds(
      <Form>
        <CodeField label="کد سیستم" name="system" defaultValue="۸۸۲۸۵۹۳۵۴" isReadOnly />
      </Form>,
    );
    const input = screen.getByRole('textbox', { name: 'کد سیستم' }) as HTMLInputElement;
    expect(input.value).toBe('882859354');
    expect(input.readOnly).toBe(true);
    expect(new FormData(container.querySelector('form') as HTMLFormElement).get('system')).toBe(
      '882859354',
    );
    await expectNoAxeViolations(container);
  });

  it('restores grouped serial and generic code defaults with canonical values on form reset', async () => {
    const { container } = renderNds(
      <Form>
        <SerialField label="سریال" name="serial" defaultValue="abcde12345" />
        <CodeField label="کد سیستم" name="system" defaultValue="882859354" />
        <button type="reset">بازنشانی فرم</button>
      </Form>,
    );
    const serial = screen.getByRole('textbox', { name: 'سریال' }) as HTMLInputElement;
    const system = screen.getByRole('textbox', { name: 'کد سیستم' }) as HTMLInputElement;
    await userEvent.clear(serial);
    await userEvent.type(serial, 'zzzzz99999');
    await userEvent.clear(system);
    await userEvent.type(system, '123');
    await userEvent.click(screen.getByRole('button', { name: 'بازنشانی فرم' }));
    expect(serial.value).toBe('ABCDE-12345');
    expect(system.value).toBe('882859354');
    const data = new FormData(container.querySelector('form') as HTMLFormElement);
    expect(data.get('serial')).toBe('ABCDE12345');
    expect(data.get('system')).toBe('882859354');
  });

  it('uses named server errors with custom serial groups', async () => {
    const { container } = renderNds(
      <Form validationErrors={{ serial: 'سریال متعلق به محصول دیگری است' }}>
        <SerialField label="سریال" name="serial" groups={[3, 3]} defaultValue="abc123" />
      </Form>,
    );
    const input = screen.getByRole('textbox', { name: 'سریال' }) as HTMLInputElement;
    expect(input.value).toBe('ABC-123');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText('سریال متعلق به محصول دیگری است')).toBeTruthy();
    await expectNoAxeViolations(container);
  });
});
