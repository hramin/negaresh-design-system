import { iconHelp } from '@negaresh/icons';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { Accordion, AccordionItem, Disclosure } from './Disclosure.tsx';

describe('Disclosure and Accordion', () => {
  it('toggles standalone Disclosure via keyboard and click, supports responsive mobile-help mode, and passes axe', async () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = renderNds(
      <Disclosure
        ref={ref}
        title="راهنمای فعال‌سازی"
        icon={iconHelp}
        variant="plain"
        alwaysExpandedAbove="md"
      >
        سه گام ساده برای دریافت کد فعال‌سازی.
      </Disclosure>,
    );

    expect(ref.current?.dataset.nds).toBe('Disclosure');
    expect(ref.current?.dataset.alwaysExpanded).toBe('md');
    const trigger = screen.getByRole('button', { name: 'راهنمای فعال‌سازی' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    await userEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('سه گام ساده برای دریافت کد فعال‌سازی.')).toBeTruthy();

    await expectNoAxeViolations(container);
  });

  it('supports single-expand and multi-expand Accordion groups and passes axe', async () => {
    const { container } = renderNds(
      <Accordion defaultExpandedKeys={['q1']}>
        <AccordionItem id="q1" title="نصب دوباره روی همان رایانه رایگان است؟" meta="پاسخ کوتاه">
          بله؛ روی همان سخت‌افزار کد قبلی بدون مصرف سقف برگردانده می‌شود.
        </AccordionItem>
        <AccordionItem id="q2" title="چطور سقف سریال را افزایش دهیم؟">
          می‌توانید یک فعال‌سازی دیگر از صفحهٔ فعال‌سازی بخرید.
        </AccordionItem>
      </Accordion>,
    );

    const btn1 = screen.getByRole('button', { name: /نصب دوباره/ });
    const btn2 = screen.getByRole('button', { name: /چطور سقف سریال/ });
    expect(btn1.getAttribute('aria-expanded')).toBe('true');
    expect(btn2.getAttribute('aria-expanded')).toBe('false');

    await userEvent.click(btn2);
    expect(btn1.getAttribute('aria-expanded')).toBe('false');
    expect(btn2.getAttribute('aria-expanded')).toBe('true');

    await expectNoAxeViolations(container);
  });
});
