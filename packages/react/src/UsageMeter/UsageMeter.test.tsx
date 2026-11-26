import { screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { UsageMeter } from './UsageMeter.tsx';

describe('UsageMeter', () => {
  it('renders segmented slots, Persian summary, source note, and full capacity state', async () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = renderNds(
      <>
        <UsageMeter
          ref={ref}
          label="سقف این سریال"
          used={1}
          limit={3}
          sourceNote="سقف اختصاصی این سریال"
        />
        <UsageMeter
          label="رایانه‌های فعال‌شده"
          used={1}
          limit={1}
          sourceNote="سقف پیش‌فرض محصول"
          showFullIndicator
        />
        <UsageMeter label="صندلی‌های کارزار" used={42} limit={100} sourceNote="سقف قرارداد سازمانی" />
      </>,
    );

    expect(ref.current?.dataset.nds).toBe('UsageMeter');
    const meters = screen.getAllByRole('meter');
    expect(meters).toHaveLength(3);
    expect(meters[0]?.getAttribute('aria-valuetext')).toBe('۱ از ۳');
    expect(meters[1]?.getAttribute('data-full')).toBe('true');
    expect(meters[1]?.getAttribute('aria-valuetext')).toContain('سقف پر شده است');
    expect(screen.getByText('سقف پیش‌فرض محصول')).toBeTruthy();
    expect(screen.getByText('۴۲ از ۱۰۰')).toBeTruthy();
    await expectNoAxeViolations(container);
  });
});
