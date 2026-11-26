import { iconLink } from '@negaresh/icons';
import { screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { Badge } from './Badge.tsx';

describe('Badge', () => {
  it('renders all tones, sizes, dot, icon, forwards ref, and passes axe', async () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = renderNds(
      <>
        <Badge ref={ref} tone="neutral">
          پیش‌نویس
        </Badge>
        <Badge tone="accent" size="sm" icon={iconLink}>
          باز شده از برنامه
        </Badge>
        <Badge tone="info" dot>
          در حال بررسی
        </Badge>
        <Badge tone="success">فعال</Badge>
        <Badge tone="warning">سقف پر شده</Badge>
        <Badge tone="danger">باطل‌شده</Badge>
      </>,
    );

    expect(ref.current?.dataset.nds).toBe('Badge');
    expect(ref.current?.dataset.tone).toBe('neutral');
    expect(screen.getByText('باز شده از برنامه')).toBeTruthy();
    await expectNoAxeViolations(container);
  });
});
