import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { Skeleton } from './Skeleton.tsx';

describe('Skeleton', () => {
  it('renders decorative text, block, circle, and table variants and passes axe', async () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = renderNds(
      <>
        <Skeleton ref={ref} variant="text" lines={3} />
        <Skeleton variant="block" size="md" />
        <Skeleton variant="circle" size="sm" isAnimated={false} />
        <Skeleton variant="table" rows={3} columns={4} />
      </>,
    );

    expect(ref.current?.dataset.nds).toBe('Skeleton');
    expect(ref.current?.getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelectorAll('[data-nds="Skeleton"]')).toHaveLength(4);
    await expectNoAxeViolations(container);
  });
});
