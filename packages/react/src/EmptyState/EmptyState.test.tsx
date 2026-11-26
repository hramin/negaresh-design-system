import { iconKey } from '@negaresh/icons';
import { screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Button } from '../Button/Button.tsx';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { EmptyState } from './EmptyState.tsx';

describe('EmptyState', () => {
  it('renders icon, heading, description, actions, forwards ref, and passes axe', async () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = renderNds(
      <EmptyState
        ref={ref}
        icon={iconKey}
        title="هنوز سریالی ثبت نشده است"
        description="سریال‌های ساخته‌شده یا درون‌ریزی‌شده در این فهرست نمایش داده می‌شوند."
        action={<Button variant="primary">ساخت سریال تازه</Button>}
        secondaryAction={<Button variant="secondary">درون‌ریزی CSV</Button>}
      />,
    );

    expect(ref.current?.dataset.nds).toBe('EmptyState');
    expect(screen.getByRole('heading', { level: 2, name: 'هنوز سریالی ثبت نشده است' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'ساخت سریال تازه' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'درون‌ریزی CSV' })).toBeTruthy();
    await expectNoAxeViolations(container);
  });
});
