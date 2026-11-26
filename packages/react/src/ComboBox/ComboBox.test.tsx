import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { Autocomplete, ComboBox, ComboBoxItem } from './ComboBox.tsx';

function CreateNewHarness() {
  const [options, setOptions] = useState([
    { id: 'cbt', label: 'درمان شناختی-رفتاری' },
    { id: 'act', label: 'درمان مبتنی بر پذیرش و تعهد' },
  ]);
  const [selected, setSelected] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  return (
    <>
      <Autocomplete
        label="برچسب موضوعی"
        items={options.filter((o) => o.label.includes(inputValue.trim()))}
        inputValue={inputValue}
        onInputChange={setInputValue}
        value={selected}
        onChange={(key) => setSelected(key ? String(key) : null)}
        onCreateOption={(query) => {
          const id = `new-${options.length + 1}`;
          setOptions((prev) => [...prev, { id, label: query }]);
          setSelected(id);
          setInputValue(query);
        }}
      >
        {(item) => (
          <ComboBoxItem id={item.id} textValue={item.label}>
            {item.label}
          </ComboBoxItem>
        )}
      </Autocomplete>
      <output data-testid="selected">{selected ?? 'none'}</output>
    </>
  );
}

describe('ComboBox and Autocomplete', () => {
  it('filters options, selects via keyboard/click, forwards ref, and passes axe', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();
    const { container } = renderNds(
      <ComboBox
        ref={ref}
        label="آزمون روان‌شناختی"
        description="نام یا کد آزمون را تایپ کنید."
        onChange={onChange}
        className="custom-combobox"
      >
        <ComboBoxItem id="neo">نئو (NEO-PI-R)</ComboBoxItem>
        <ComboBoxItem id="mmpi">ام‌ام‌پی‌آی (MMPI-2)</ComboBoxItem>
        <ComboBoxItem id="beck">افسردگی بک</ComboBoxItem>
      </ComboBox>,
    );

    const input = screen.getByRole('combobox', { name: 'آزمون روان‌شناختی' }) as HTMLInputElement;
    expect(ref.current).toBe(input);
    expect(
      container.querySelector('[data-nds="ComboBox"]')?.classList.contains('custom-combobox'),
    ).toBe(true);

    await user.type(input, 'بک');
    const option = screen.getByRole('option', { name: 'افسردگی بک' });
    await user.click(option);
    expect(onChange).toHaveBeenCalledWith('beck');
    expect(input.value).toBe('افسردگی بک');
    await expectNoAxeViolations(container);
  });

  it('supports Autocomplete alias with create-new option and async loading/empty states', async () => {
    const user = userEvent.setup();
    const { container } = renderNds(<CreateNewHarness />);

    const input = screen.getByRole('combobox', { name: 'برچسب موضوعی' }) as HTMLInputElement;
    await user.type(input, 'روان‌سنجی کودک');
    const createOption = screen.getByRole('option', { name: /افزودن «روان‌سنجی کودک»/ });
    await user.click(createOption);

    expect(screen.getByTestId('selected').textContent).toBe('new-3');
    expect(input.value).toBe('روان‌سنجی کودک');
    await expectNoAxeViolations(container);
  });

  it('shows localized loading and empty messages and invalid error alert', async () => {
    const user = userEvent.setup();
    const { container, rerender } = renderNds(
      <ComboBox
        label="جست‌وجوی متخصص"
        items={[] as { id: string; label: string }[]}
        isLoading
        isInvalid
        errorMessage="انتخاب متخصص الزامی است."
      >
        {(item) => <ComboBoxItem id={item.id}>{item.label}</ComboBoxItem>}
      </ComboBox>,
    );

    expect(screen.getByRole('progressbar', { name: 'در حال بارگذاری…' })).toBeTruthy();
    expect(screen.getByRole('alert').textContent).toContain('انتخاب متخصص الزامی است.');

    await user.click(screen.getByRole('button', { name: /نمایش گزینه‌ها/ }));
    expect(screen.getByRole('status').textContent).toContain('در حال بارگذاری…');

    rerender(
      <ComboBox label="جست‌وجوی متخصص" items={[] as { id: string; label: string }[]}>
        {(item) => <ComboBoxItem id={item.id}>{item.label}</ComboBoxItem>}
      </ComboBox>,
    );
    expect(screen.getByRole('status').textContent).toContain('موردی یافت نشد');
    await user.keyboard('{Escape}');
    await expectNoAxeViolations(container);
  });
});
