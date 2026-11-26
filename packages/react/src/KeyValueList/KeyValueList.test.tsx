import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { KeyValueItem, KeyValueList } from './KeyValueList.tsx';

describe('KeyValueList', () => {
  it('renders semantic dl rows, LTR/Code isolation, copyable rows via CopyButton, and passes axe', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    const listRef = createRef<HTMLDListElement>();
    const onCopy = vi.fn();
    const { container } = renderNds(
      <KeyValueList ref={listRef} aria-label="مشخصات سریال">
        <KeyValueItem
          label="شمارهٔ سریال"
          value="NGR-4920-8814-AB12"
          code
          copyValue="NGR49208814AB12"
          onCopy={onCopy}
        />
        <KeyValueItem label="شمارهٔ همراه" value="+98 912 345 6789" ltr />
        <KeyValueItem label="محصول" value="بستهٔ آزمون‌های بالینی نگارش" />
      </KeyValueList>,
    );

    expect(listRef.current?.tagName).toBe('DL');
    expect(listRef.current?.dataset.nds).toBe('KeyValueList');
    expect(container.querySelector('[data-nds="Code"]')?.getAttribute('dir')).toBe('ltr');
    expect(container.querySelector('[data-nds="Ltr"]')?.getAttribute('dir')).toBe('ltr');

    const copyBtn = screen.getByRole('button', { name: 'کپی شمارهٔ سریال' });
    await userEvent.click(copyBtn);
    expect(writeText).toHaveBeenCalledWith('NGR49208814AB12');
    expect(onCopy).toHaveBeenCalledWith('NGR49208814AB12');

    await expectNoAxeViolations(container);
  });

  it('supports declarative items array, stacked layout, and compact density', async () => {
    const { container } = renderNds(
      <KeyValueList
        layout="stacked"
        density="compact"
        divided={false}
        items={[
          { id: 'order', label: 'کد سفارش', value: 'ORD-1405-910', code: true },
          { id: 'status', label: 'وضعیت', value: 'تکمیل‌شده' },
        ]}
      />,
    );

    const dl = container.querySelector('[data-nds="KeyValueList"]');
    expect(dl?.getAttribute('data-layout')).toBe('stacked');
    expect(dl?.getAttribute('data-density')).toBe('compact');
    expect(dl?.getAttribute('data-divided')).toBe('false');
    expect(screen.getByText('ORD-1405-910')).toBeTruthy();

    await expectNoAxeViolations(container);
  });
});
