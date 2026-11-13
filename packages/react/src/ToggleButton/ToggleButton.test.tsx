import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { ToggleButton, ToggleButtonGroup } from './ToggleButton.tsx';

describe('ToggleButton', () => {
  it('toggles aria-pressed', async () => {
    const onChange = vi.fn();
    renderNds(<ToggleButton onChange={onChange}>پررنگ</ToggleButton>);
    const button = screen.getByRole('button', { name: 'پررنگ' });
    expect(button.getAttribute('aria-pressed')).toBe('false');
    await userEvent.click(button);
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe('ToggleButtonGroup', () => {
  it('selects one item at a time', async () => {
    const onSelectionChange = vi.fn();
    const { container } = renderNds(
      <ToggleButtonGroup
        aria-label="نما"
        defaultSelectedKeys={['pro']}
        onSelectionChange={onSelectionChange}
      >
        <ToggleButton id="pro">نمای حرفه‌ای</ToggleButton>
        <ToggleButton id="calm">نمای آرام</ToggleButton>
      </ToggleButtonGroup>,
    );
    const calm = screen.getByRole('radio', { name: 'نمای آرام' });
    expect(screen.getByRole('radio', { name: 'نمای حرفه‌ای' }).getAttribute('aria-checked')).toBe(
      'true',
    );
    await userEvent.click(calm);
    expect(calm.getAttribute('aria-checked')).toBe('true');
    const lastSelection = onSelectionChange.mock.calls.at(-1)?.[0] as Set<string> | undefined;
    expect([...(lastSelection ?? [])]).toEqual(['calm']);
    await expectNoAxeViolations(container);
  });

  it('supports multiple selection', async () => {
    renderNds(
      <ToggleButtonGroup aria-label="فیلتر" selectionMode="multiple">
        <ToggleButton id="a">الف</ToggleButton>
        <ToggleButton id="b" isDisabled>
          ب
        </ToggleButton>
      </ToggleButtonGroup>,
    );
    const a = screen.getByRole('button', { name: 'الف' });
    await userEvent.click(a);
    expect(a.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'ب' }).hasAttribute('disabled')).toBe(true);
  });
});
