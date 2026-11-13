import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Button } from '../Button/Button.tsx';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { ButtonGroup, Toolbar } from './ButtonGroup.tsx';

describe('ButtonGroup', () => {
  it('lays out buttons that each keep a Tab stop', async () => {
    const { container } = renderNds(
      <ButtonGroup justify="end" stackOnMobile>
        <Button variant="primary">ذخیره</Button>
        <Button variant="ghost">انصراف</Button>
      </ButtonGroup>,
    );
    const group = container.querySelector('[data-nds="ButtonGroup"]') as HTMLElement;
    expect([group.dataset.justify, group.dataset.stack]).toEqual(['end', 'true']);
    await userEvent.tab();
    expect(document.activeElement?.textContent).toBe('ذخیره');
    await userEvent.tab();
    expect(document.activeElement?.textContent).toBe('انصراف');
  });
});

describe('Toolbar', () => {
  it('is one Tab stop with arrow keys that follow RTL', async () => {
    const { container } = renderNds(
      <Toolbar aria-label="قالب‌بندی">
        <Button>اول</Button>
        <Button>دوم</Button>
        <Button>سوم</Button>
      </Toolbar>,
    );
    expect(screen.getByRole('toolbar', { name: 'قالب‌بندی' })).toBeTruthy();
    await userEvent.tab();
    expect(document.activeElement?.textContent).toBe('اول');
    // In RTL the next item is to the left.
    await userEvent.keyboard('{ArrowLeft}');
    expect(document.activeElement?.textContent).toBe('دوم');
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement?.textContent).toBe('اول');
    await expectNoAxeViolations(container);
  });
});
