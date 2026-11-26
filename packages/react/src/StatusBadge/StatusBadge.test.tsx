import { screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { StatusBadge } from './StatusBadge.tsx';

describe('StatusBadge', () => {
  it('maps every domain status to localized Persian labels with icons and passes axe', async () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = renderNds(
      <>
        <StatusBadge ref={ref} domain="order" status="awaiting_payment" />
        <StatusBadge domain="order" status="completed" />
        <StatusBadge domain="payment" status="failed" />
        <StatusBadge domain="serial" status="active" />
        <StatusBadge domain="serial" status="limit_reached" />
        <StatusBadge domain="serial" status="revoked" />
        <StatusBadge domain="review" status="changes_requested" />
        <StatusBadge domain="review" status="published" />
        <StatusBadge domain="report" status="ready" />
        <StatusBadge domain="report" status="purged" />
        <StatusBadge domain="campaign" status="full" />
        <StatusBadge domain="campaign" status="closed" label="کارزار بسته شد" showIcon={false} dot />
      </>,
    );

    expect(ref.current?.dataset.nds).toBe('Badge');
    expect(screen.getByText('در انتظار پرداخت')).toBeTruthy();
    expect(screen.getByText('سقف پر شده')).toBeTruthy();
    expect(screen.getByText('باطل‌شده')).toBeTruthy();
    expect(screen.getByText('نیاز به اصلاح')).toBeTruthy();
    expect(screen.getByText('حذف‌شده')).toBeTruthy();
    expect(screen.getByText('تکمیل ظرفیت')).toBeTruthy();
    expect(screen.getByText('کارزار بسته شد')).toBeTruthy();
    await expectNoAxeViolations(container);
  });
});
