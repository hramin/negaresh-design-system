import { iconCopy } from '@negaresh/icons';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { IconButton } from '../Button/Button.tsx';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { Tooltip, TooltipTrigger } from './Tooltip.tsx';

describe('Tooltip', () => {
  it('opens on keyboard focus, passes axe while open, and dismisses with Escape', async () => {
    const tooltipRef = createRef<HTMLDivElement>();
    renderNds(
      <TooltipTrigger delay={0} closeDelay={0}>
        <IconButton icon={iconCopy} aria-label="کپی کد" />
        <Tooltip ref={tooltipRef} placement="top">
          کپی کد فعال‌سازی
        </Tooltip>
      </TooltipTrigger>,
    );

    await userEvent.tab();
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toBe(tooltipRef.current);
    expect(tooltip.dataset.nds).toBe('Tooltip');
    expect(tooltip.textContent).toContain('کپی کد فعال‌سازی');

    await expectNoAxeViolations(document.body);

    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).toBeNull();
    });
  });

  it('opens on pointer hover and supports hiding the arrow', async () => {
    renderNds(
      <TooltipTrigger delay={0} closeDelay={0}>
        <IconButton icon={iconCopy} aria-label="کپی سریال" />
        <Tooltip showArrow={false}>کپی سریال به کلیپ‌بورد</Tooltip>
      </TooltipTrigger>,
    );

    const button = screen.getByRole('button', { name: 'کپی سریال' });
    await userEvent.pointer([{ target: document.body }, { target: button }]);
    await userEvent.hover(button);
    expect(await screen.findByRole('tooltip')).toBeTruthy();
    expect(document.querySelector('[data-nds="TooltipArrow"]')).toBeNull();
  });
});
